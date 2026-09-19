import uuid
import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.app.models.activity import ActivityCreate, ActivityResponse, QuickTraceRequest
from backend.app.services.carbon_calculator import calculate_emission, parse_quick_trace, EMISSION_FACTORS
from backend.app.database import get_database, in_memory_store

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.get("", response_model=List[ActivityResponse])
def get_activities():
    db = get_database()
    if db is not None:
        try:
            docs = list(db.activities.find({}, {"_id": 0}))
            if docs:
                return docs
        except Exception:
            pass

    return in_memory_store.get("activities", [])

@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(data: ActivityCreate):
    emission, info = calculate_emission(data.activity_type, data.quantity)
    activity_id = str(uuid.uuid4())
    now_str = data.timestamp or datetime.datetime.utcnow().isoformat()

    new_act = {
        "id": activity_id,
        "user_id": "demo-user",
        "category": data.category or info["category"],
        "activity_type": data.activity_type,
        "quantity": data.quantity,
        "unit": data.unit or info["unit"],
        "emission": emission,
        "notes": data.notes or f"{data.quantity} {data.unit} {info.get('label', data.activity_type)}",
        "timestamp": now_str,
    }

    db = get_database()
    if db is not None:
        try:
            db.activities.insert_one(dict(new_act))
        except Exception:
            in_memory_store["activities"].insert(0, new_act)
    else:
        in_memory_store["activities"].insert(0, new_act)

    return ActivityResponse(**new_act)

@router.post("/quick-trace", response_model=ActivityResponse)
def quick_trace(req: QuickTraceRequest):
    parsed = parse_quick_trace(req.text)
    activity_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    new_act = {
        "id": activity_id,
        "user_id": "demo-user",
        "category": parsed["category"],
        "activity_type": parsed["activity_type"],
        "quantity": parsed["quantity"],
        "unit": parsed["unit"],
        "emission": parsed["emission"],
        "notes": parsed["notes"],
        "timestamp": now_str,
    }

    db = get_database()
    if db is not None:
        try:
            db.activities.insert_one(dict(new_act))
        except Exception:
            in_memory_store["activities"].insert(0, new_act)
    else:
        in_memory_store["activities"].insert(0, new_act)

    return ActivityResponse(**new_act)

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: str):
    db = get_database()
    if db is not None:
        try:
            db.activities.delete_one({"id": activity_id})
        except Exception:
            pass

    in_memory_store["activities"] = [
        a for a in in_memory_store.get("activities", []) if a.get("id") != activity_id
    ]
    return None

@router.get("/factors")
def get_emission_factors():
    return EMISSION_FACTORS
