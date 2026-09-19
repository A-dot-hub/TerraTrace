import uuid
import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.app.models.goal import GoalCreate, GoalUpdate, GoalResponse
from backend.app.database import get_database, in_memory_store

router = APIRouter(prefix="/goals", tags=["Goals"])

# Default seeded goals
DEFAULT_GOALS = [
    {
        "id": "g-1",
        "user_id": "demo-user",
        "title": "Reduce monthly footprint by 20%",
        "category": "General",
        "target": 20,
        "current": 14,
        "unit": "% reduction",
        "endDate": "2026-04-15",
        "created_at": datetime.datetime.utcnow().isoformat()
    },
    {
        "id": "g-2",
        "user_id": "demo-user",
        "title": "Use public transport 10 times",
        "category": "Transportation",
        "target": 10,
        "current": 7,
        "unit": "trips",
        "endDate": "2026-04-01",
        "created_at": datetime.datetime.utcnow().isoformat()
    },
    {
        "id": "g-3",
        "user_id": "demo-user",
        "title": "Reduce electricity consumption by 15%",
        "category": "Energy",
        "target": 15,
        "current": 9,
        "unit": "% kWh saved",
        "endDate": "2026-04-30",
        "created_at": datetime.datetime.utcnow().isoformat()
    },
    {
        "id": "g-4",
        "user_id": "demo-user",
        "title": "Reduce food waste by 30%",
        "category": "Waste",
        "target": 30,
        "current": 22,
        "unit": "% waste cut",
        "endDate": "2026-04-20",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
]

@router.get("", response_model=List[GoalResponse])
def get_goals():
    db = get_database()
    if db is not None:
        try:
            docs = list(db.goals.find({}, {"_id": 0}))
            if docs:
                return docs
            # Seed default goals if empty
            db.goals.insert_many([dict(g) for g in DEFAULT_GOALS])
            return DEFAULT_GOALS
        except Exception:
            pass

    if not in_memory_store.get("goals"):
        in_memory_store["goals"] = [dict(g) for g in DEFAULT_GOALS]

    return in_memory_store["goals"]

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(goal_data: GoalCreate):
    goal_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    new_goal = {
        "id": goal_id,
        "user_id": "demo-user",
        "title": goal_data.title,
        "category": goal_data.category,
        "target": goal_data.target,
        "current": goal_data.current or 0.0,
        "unit": goal_data.unit,
        "endDate": goal_data.endDate,
        "created_at": now_str,
    }

    db = get_database()
    if db is not None:
        try:
            db.goals.insert_one(dict(new_goal))
        except Exception:
            in_memory_store["goals"].append(new_goal)
    else:
        in_memory_store["goals"].append(new_goal)

    return GoalResponse(**new_goal)

@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, updates: GoalUpdate):
    db = get_database()
    updated_goal = None

    if db is not None:
        try:
            update_fields = {k: v for k, v in updates.model_dump().items() if v is not None}
            db.goals.update_one({"id": goal_id}, {"$set": update_fields})
            updated_goal = db.goals.find_one({"id": goal_id}, {"_id": 0})
        except Exception:
            pass

    if not updated_goal:
        for g in in_memory_store.get("goals", []):
            if g.get("id") == goal_id:
                if updates.current is not None:
                    g["current"] = updates.current
                if updates.target is not None:
                    g["target"] = updates.target
                if updates.title is not None:
                    g["title"] = updates.title
                updated_goal = g
                break

    if not updated_goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    return GoalResponse(**updated_goal)

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: str):
    db = get_database()
    if db is not None:
        try:
            db.goals.delete_one({"id": goal_id})
        except Exception:
            pass

    in_memory_store["goals"] = [
        g for g in in_memory_store.get("goals", []) if g.get("id") != goal_id
    ]
    return None
