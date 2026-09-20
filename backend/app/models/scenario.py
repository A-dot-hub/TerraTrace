from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class HabitVariables(BaseModel):
    carKm: float = Field(..., description="Weekly car travel in kilometers")
    metroKm: float = Field(..., description="Weekly public rail/metro transit in kilometers")
    chickenMeals: float = Field(..., description="Weekly poultry/chicken meals count")
    electricityKwh: float = Field(..., description="Weekly household grid electricity in kWh")
    foodWasteKg: float = Field(..., description="Weekly organic food waste in kg")

# Alias for backwards-compatibility with previous inputs schema
ScenarioInputs = HabitVariables

class ScenarioCreate(BaseModel):
    userId: Optional[str] = Field("demo-user", description="Authenticated user ID")
    user_id: Optional[str] = None
    scenarioName: Optional[str] = Field(None, description="Custom scenario title")
    name: Optional[str] = None
    currentFootprint: float = Field(..., description="Baseline weekly carbon footprint in kg CO2e")
    simulatedFootprint: float = Field(..., description="Simulated target carbon footprint in kg CO2e")
    reductionPercent: Optional[float] = Field(0.0, description="Calculated % reduction from baseline")
    annualSavingsKg: Optional[float] = Field(0.0, description="Projected annual CO2e avoided in kg")
    habitVariables: Optional[HabitVariables] = None
    inputs: Optional[HabitVariables] = None

class ScenarioResponse(BaseModel):
    id: str
    userId: Optional[str] = "demo-user"
    user_id: Optional[str] = "demo-user"
    scenarioName: str
    name: str
    currentFootprint: float
    simulatedFootprint: float
    reductionPercent: float
    annualSavingsKg: float
    habitVariables: Dict[str, float]
    inputs: Dict[str, float]
    created_at: str
    updated_at: Optional[str] = None

class SimulationRequest(BaseModel):
    carKm: Optional[float] = 140.0
    metroKm: Optional[float] = 45.0
    chickenMeals: Optional[float] = 2.0
    electricityKwh: Optional[float] = 38.0
    foodWasteKg: Optional[float] = 1.2