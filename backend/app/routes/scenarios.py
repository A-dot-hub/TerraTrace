import uuid
import datetime
from typing import List
from fastapi import APIRouter, status
from backend.app.models.scenario import ScenarioCreate, ScenarioResponse
from backend.app.database import get_database, in_memory_store

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

@router.get("", response_model=List[ScenarioResponse])
def get_scenarios():
    db = get_database()
    if db is not None:
        try:
            docs = list(db.scenarios.find({}, {"_id": 0}))
            if docs:
                return docs
        except Exception:
            pass

    return in_memory_store.get("scenarios", [])

@router.post("", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(data: ScenarioCreate):
    scen_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    new_scen = {
        "id": scen_id,
        "user_id": "demo-user",
        "name": data.name,
        "inputs": data.inputs.model_dump(),
        "currentFootprint": data.currentFootprint,
        "simulatedFootprint": data.simulatedFootprint,
        "reductionPercent": data.reductionPercent,
        "annualSavingsKg": data.annualSavingsKg,
        "created_at": now_str,
    }

    db = get_database()
    if db is not None:
        try:
            db.scenarios.insert_one(dict(new_scen))
        except Exception:
            in_memory_store["scenarios"].append(new_scen)
    else:
        in_memory_store["scenarios"].append(new_scen)

    return ScenarioResponse(**new_scen)

@router.delete("/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scenario(scenario_id: str):
    db = get_database()
    if db is not None:
        try:
            db.scenarios.delete_one({"id": scenario_id})
        except Exception:
            pass

    in_memory_store["scenarios"] = [
        s for s in in_memory_store.get("scenarios", []) if s.get("id") != scenario_id
    ]
    return None
