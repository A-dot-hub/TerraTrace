from pydantic import BaseModel, Field
from typing import Optional

class ActivityCreate(BaseModel):
    category: str # Transportation, Food, Energy, Waste
    activity_type: str
    quantity: float
    unit: str
    notes: Optional[str] = None
    timestamp: Optional[str] = None

class QuickTraceRequest(BaseModel):
    text: str

class ActivityResponse(BaseModel):
    id: str
    user_id: Optional[str] = "demo-user"
    category: str
    activity_type: str
    quantity: float
    unit: str
    emission: float # kg CO2e
    notes: Optional[str] = None
    timestamp: str
