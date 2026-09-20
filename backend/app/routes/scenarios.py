import uuid
import datetime
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from backend.app.models.scenario import ScenarioCreate, ScenarioResponse, HabitVariables
from backend.app.database import get_database, get_async_database, in_memory_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

def normalize_scenario_doc(doc: dict) -> dict:
    """Normalizes document fields between various conventions."""
    name = doc.get("scenarioName") or doc.get("name") or "Saved Scenario"
    user_id = doc.get("userId") or doc.get("user_id") or "demo-user"
    habits = doc.get("habitVariables") or doc.get("inputs") or {
        "carKm": 140.0,
        "metroKm": 45.0,
        "chickenMeals": 2.0,
        "electricityKwh": 38.0,
        "foodWasteKg": 1.2
    }
    return {
        "id": doc.get("id", str(uuid.uuid4())),
        "userId": user_id,
        "user_id": user_id,
        "scenarioName": name,
        "name": name,
        "currentFootprint": float(doc.get("currentFootprint", 58.5)),
        "simulatedFootprint": float(doc.get("simulatedFootprint", 43.8)),
        "reductionPercent": float(doc.get("reductionPercent", 0.0)),
        "annualSavingsKg": float(doc.get("annualSavingsKg", 0.0)),
        "habitVariables": habits,
        "inputs": habits,
        "created_at": doc.get("created_at", datetime.datetime.utcnow().isoformat()),
        "updated_at": doc.get("updated_at", None),
    }

@router.get("", response_model=List[ScenarioResponse])
async def get_scenarios():
    """Retrieve all saved scenarios from MongoDB Atlas scenarios collection."""
    async_db = get_async_database()
    if async_db is not None:
        try:
            cursor = async_db.scenarios.find({}, {"_id": 0})
            docs = await cursor.to_list(length=100)
            if docs:
                return [normalize_scenario_doc(d) for d in docs]
        except Exception as e:
            logger.warning("Motor fetch scenarios failed (%s), trying sync driver.", str(e))

    sync_db = get_database()
    if sync_db is not None:
        try:
            docs = list(sync_db.scenarios.find({}, {"_id": 0}))
            if docs:
                return [normalize_scenario_doc(d) for d in docs]
        except Exception as e:
            logger.warning("Sync fetch scenarios failed (%s).", str(e))

    return [normalize_scenario_doc(d) for d in in_memory_store.get("scenarios", [])]

@router.post("", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
async def save_scenario(data: ScenarioCreate):
    """
    Save or update a simulated footprint scenario document in the MongoDB Atlas scenarios collection.
    Uses Motor (async driver) for high-concurrency non-blocking persistence with fallback.
    """
    scen_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    # Extract title and habit variables cleanly
    scenario_title = data.scenarioName or data.name or "Untitled Scenario"
    user_id = data.userId or data.user_id or "demo-user"

    raw_habits = data.habitVariables or data.inputs
    if raw_habits is not None:
        habits_dict = raw_habits.model_dump()
    else:
        habits_dict = {
            "carKm": 140.0,
            "metroKm": 45.0,
            "chickenMeals": 2.0,
            "electricityKwh": 38.0,
            "foodWasteKg": 1.2
        }

    scenario_doc = {
        "id": scen_id,
        "userId": user_id,
        "user_id": user_id,
        "scenarioName": scenario_title,
        "name": scenario_title,
        "currentFootprint": data.currentFootprint,
        "simulatedFootprint": data.simulatedFootprint,
        "reductionPercent": data.reductionPercent or round(
            max(0.0, (data.currentFootprint - data.simulatedFootprint) / (data.currentFootprint or 1.0)) * 100, 1
        ),
        "annualSavingsKg": data.annualSavingsKg or round(
            max(0.0, data.currentFootprint - data.simulatedFootprint) * 52.0, 1
        ),
        "habitVariables": habits_dict,
        "inputs": habits_dict,
        "created_at": now_str,
        "updated_at": now_str,
    }

    persisted = False

    # 1. Async MongoDB Atlas via Motor
    async_db = get_async_database()
    if async_db is not None:
        try:
            await async_db.scenarios.update_one(
                {"id": scen_id},
                {"$set": scenario_doc},
                upsert=True
            )
            persisted = True
            logger.info("Saved scenario '%s' via Motor Async MongoDB Atlas", scenario_title)
        except Exception as e:
            logger.warning("Motor insert scenario failed (%s), falling back to PyMongo.", str(e))

    # 2. Sync MongoDB Atlas via PyMongo
    if not persisted:
        sync_db = get_database()
        if sync_db is not None:
            try:
                sync_db.scenarios.update_one(
                    {"id": scen_id},
                    {"$set": dict(scenario_doc)},
                    upsert=True
                )
                persisted = True
                logger.info("Saved scenario '%s' via PyMongo sync", scenario_title)
            except Exception as e:
                logger.warning("PyMongo insert scenario failed (%s).", str(e))

    # 3. Always maintain in-memory store for instant fast reactivity
    in_memory_store["scenarios"].append(scenario_doc)

    return ScenarioResponse(**scenario_doc)

@router.delete("/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scenario(scenario_id: str):
    """Delete scenario by ID from MongoDB Atlas and cache."""
    async_db = get_async_database()
    if async_db is not None:
        try:
            await async_db.scenarios.delete_one({"id": scenario_id})
        except Exception:
            pass

    sync_db = get_database()
    if sync_db is not None:
        try:
            sync_db.scenarios.delete_one({"id": scenario_id})
        except Exception:
            pass

    in_memory_store["scenarios"] = [
        s for s in in_memory_store.get("scenarios", []) if s.get("id") != scenario_id
    ]
    return None
