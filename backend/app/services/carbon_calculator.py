import re
from typing import Dict, Any, Tuple

# Standardized DEFRA (UK Government GHG Conversion Factors) & IPCC 2026 Reference Factors
EMISSION_FACTORS: Dict[str, Dict[str, Any]] = {
    # Transportation (kg CO2e per km)
    "car_petrol": {"factor": 0.171, "category": "Transportation", "unit": "km", "label": "Petrol Car"},
    "car_diesel": {"factor": 0.165, "category": "Transportation", "unit": "km", "label": "Diesel Car"},
    "car_electric": {"factor": 0.047, "category": "Transportation", "unit": "km", "label": "Electric Car (Grid Avg)"},
    "bus": {"factor": 0.089, "category": "Transportation", "unit": "km", "label": "Bus Transit"},
    "metro_train": {"factor": 0.035, "category": "Transportation", "unit": "km", "label": "Subway / Rail"},
    "flight_domestic": {"factor": 0.246, "category": "Transportation", "unit": "km", "label": "Domestic Flight"},
    "bicycle": {"factor": 0.0, "category": "Transportation", "unit": "km", "label": "Bicycle / Walking"},

    # Energy (kg CO2e per unit)
    "electricity_grid": {"factor": 0.385, "category": "Energy", "unit": "kWh", "label": "Grid Electricity"},
    "natural_gas": {"factor": 0.183, "category": "Energy", "unit": "kWh", "label": "Natural Gas Heating"},
    "solar_electricity": {"factor": 0.015, "category": "Energy", "unit": "kWh", "label": "Rooftop Solar Offset"},

    # Food & Diet (kg CO2e per meal or kg)
    "beef_meal": {"factor": 6.8, "category": "Food", "unit": "meal", "label": "Beef Meal"},
    "chicken_meal": {"factor": 1.4, "category": "Food", "unit": "meal", "label": "Poultry / Chicken Meal"},
    "vegetarian_meal": {"factor": 0.7, "category": "Food", "unit": "meal", "label": "Vegetarian Meal"},
    "vegan_meal": {"factor": 0.45, "category": "Food", "unit": "meal", "label": "Plant-based / Vegan Meal"},

    # Waste & Circularity (kg CO2e per kg)
    "landfill_waste": {"factor": 2.5, "category": "Waste", "unit": "kg", "label": "Municipal Landfill Waste"},
    "recycled_waste": {"factor": 0.12, "category": "Waste", "unit": "kg", "label": "Recycled Material"},
    "composted_organic": {"factor": 0.08, "category": "Waste", "unit": "kg", "label": "Composted Organics"},
}

def calculate_emission(activity_type: str, quantity: float) -> Tuple[float, Dict[str, Any]]:
    info = EMISSION_FACTORS.get(activity_type)
    if not info:
        info = {
            "factor": 0.15,
            "category": "General",
            "unit": "unit",
            "label": activity_type
        }
    emission = round(quantity * info["factor"], 2)
    return emission, info

def parse_quick_trace(text: str) -> Dict[str, Any]:
    """
    Deterministic rule-based NLP extraction for Quick Trace.
    Extracts quantity, unit, activity_type, and category.
    """
    cleaned = text.lower().strip()

    # Extract numbers
    num_match = re.search(r"(\d+(?:\.\d+)?)", cleaned)
    quantity = float(num_match.group(1)) if num_match else 1.0

    activity_type = "car_petrol"
    category = "Transportation"
    unit = "km"

    # Transportation rules
    if "flight" in cleaned or "flew" in cleaned or "plane" in cleaned:
        activity_type = "flight_domestic"
        category = "Transportation"
        unit = "km"
    elif "metro" in cleaned or "subway" in cleaned or "train" in cleaned:
        activity_type = "metro_train"
        category = "Transportation"
        unit = "km"
    elif "bus" in cleaned:
        activity_type = "bus"
        category = "Transportation"
        unit = "km"
    elif "electric car" in cleaned or "ev" in cleaned:
        activity_type = "car_electric"
        category = "Transportation"
        unit = "km"
    elif "bike" in cleaned or "bicycle" in cleaned or "walk" in cleaned:
        activity_type = "bicycle"
        category = "Transportation"
        unit = "km"
    elif "car" in cleaned or "drove" in cleaned or "drive" in cleaned or "km" in cleaned or "miles" in cleaned:
        activity_type = "car_petrol"
        category = "Transportation"
        unit = "km"
    # Energy rules
    elif "kwh" in cleaned or "electricity" in cleaned or "power" in cleaned:
        activity_type = "electricity_grid"
        category = "Energy"
        unit = "kWh"
    elif "gas" in cleaned or "heating" in cleaned:
        activity_type = "natural_gas"
        category = "Energy"
        unit = "kWh"
    # Food rules
    elif "beef" in cleaned or "steak" in cleaned or "burger" in cleaned:
        activity_type = "beef_meal"
        category = "Food"
        unit = "meal"
    elif "chicken" in cleaned or "poultry" in cleaned:
        activity_type = "chicken_meal"
        category = "Food"
        unit = "meal"
    elif "vegan" in cleaned or "plant" in cleaned:
        activity_type = "vegan_meal"
        category = "Food"
        unit = "meal"
    elif "vegetarian" in cleaned or "veggie" in cleaned:
        activity_type = "vegetarian_meal"
        category = "Food"
        unit = "meal"
    # Waste rules
    elif "recycled" in cleaned or "recycling" in cleaned:
        activity_type = "recycled_waste"
        category = "Waste"
        unit = "kg"
    elif "compost" in cleaned:
        activity_type = "composted_organic"
        category = "Waste"
        unit = "kg"
    elif "trash" in cleaned or "waste" in cleaned:
        activity_type = "landfill_waste"
        category = "Waste"
        unit = "kg"

    emission, info = calculate_emission(activity_type, quantity)
    return {
        "activity_type": activity_type,
        "category": info["category"],
        "quantity": quantity,
        "unit": info["unit"],
        "emission": emission,
        "notes": text,
    }
