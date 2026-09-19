from fastapi import APIRouter
from backend.app.models.scenario import SimulationRequest
from backend.app.services.projection_engine import compute_simulation_projections

router = APIRouter(prefix="/simulator", tags=["Future Lab Simulator"])

@router.post("/simulate")
def simulate_future(req: SimulationRequest):
    # Baseline lifestyle parameters (standard week)
    base_car_km = 180.0
    base_metro_km = 25.0
    base_chicken = 4.0
    base_elec = 42.0
    base_waste = 2.0

    # Emission calculation for baseline
    cur_car = base_car_km * 0.171
    cur_metro = base_metro_km * 0.035
    cur_chicken = base_chicken * 1.4
    cur_elec = base_elec * 0.385
    cur_waste = base_waste * 2.5
    current_total = round(cur_car + cur_metro + cur_chicken + cur_elec + cur_waste, 1)

    # Emission calculation for simulated
    sim_car = req.carKm * 0.171
    sim_metro = req.metroKm * 0.035
    sim_chicken = req.chickenMeals * 1.4
    sim_elec = req.electricityKwh * 0.385
    sim_waste = req.foodWasteKg * 2.5
    simulated_total = round(sim_car + sim_metro + sim_chicken + sim_elec + sim_waste, 1)

    diff = max(0.0, current_total - simulated_total)
    pct = round((diff / (current_total or 1.0)) * 100, 1)
    monthly_red = round(diff * 4.3, 1)
    annual_red = round(diff * 52.0, 1)

    comparison = [
        {"category": "Car Commute", "current": round(cur_car, 1), "simulated": round(sim_car, 1)},
        {"category": "Metro Rail", "current": round(cur_metro, 1), "simulated": round(sim_metro, 1)},
        {"category": "Chicken Meals", "current": round(cur_chicken, 1), "simulated": round(sim_chicken, 1)},
        {"category": "Electricity", "current": round(cur_elec, 1), "simulated": round(sim_elec, 1)},
        {"category": "Food Waste", "current": round(cur_waste, 1), "simulated": round(sim_waste, 1)},
    ]

    projections = compute_simulation_projections(current_total, simulated_total)

    return {
        "currentFootprint": current_total,
        "simulatedFootprint": simulated_total,
        "percentageReduction": pct,
        "monthlyReduction": monthly_red,
        "annualReduction": annual_red,
        "comparisonCategories": comparison,
        "projections": projections,
    }
