from pydantic import BaseModel
from typing import Optional

class GoalCreate(BaseModel):
    title: str
    category: str
    target: float
    unit: str
    endDate: Optional[str] = None
    current: Optional[float] = 0.0

class GoalUpdate(BaseModel):
    current: Optional[float] = None
    target: Optional[float] = None
    title: Optional[str] = None

class GoalResponse(GoalCreate):
    id: str
    user_id: Optional[str] = "demo-user"
    created_at: str
