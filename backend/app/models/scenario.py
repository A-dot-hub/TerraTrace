from pydantic import BaseModel
from typing import Dict, Any, Optional

class ScenarioInputs(BaseModel):
    carKm: float
    metroKm: float
    chickenMeals: float
    electricityKwh: float
    foodWasteKg: float

class ScenarioCreate(BaseModel):
    name: str
    inputs: ScenarioInputs
    currentFootprint: float
    simulatedFootprint: float
    reductionPercent: float
    annualSavingsKg: float

class ScenarioResponse(ScenarioCreate):
    id: str
    user_id: Optional[str] = "demo-user"
    created_at: str

class SimulationRequest(BaseModel):
    carKm: Optional[float] = 140.0
    metroKm: Optional[float] = 45.0
    chickenMeals: Optional[float] = 2.0
    electricityKwh: Optional[float] = 38.0
    foodWasteKg: Optional[float] = 1.2
