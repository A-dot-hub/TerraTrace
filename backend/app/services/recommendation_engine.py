from typing import List, Dict, Any

def analyze_impact(activities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Identifies dominant emission category, percentage share, and actionable advice.
    """
    if not activities:
        return {
            "biggestImpact": {
                "name": "Transportation",
                "value": 30.8,
                "percentage": 52,
                "color": "#10b981"
            },
            "recommendation": {
                "title": "Shift 2 commute trips weekly to rapid transit",
                "potentialSavingsKg": 11.2,
                "impactCategory": "Transportation",
                "difficulty": "Moderate",
                "action": "Substituting 35 km of petrol driving with metro saves ~11.2 kg CO2e weekly."
            }
        }

    totals: Dict[str, float] = {}
    for act in activities:
        cat = act.get("category", "Other")
        totals[cat] = totals.get(cat, 0.0) + act.get("emission", 0.0)

    total_sum = sum(totals.values()) or 1.0
    sorted_cats = sorted(totals.items(), key=lambda x: x[1], reverse=True)
    top_cat, top_val = sorted_cats[0]
    pct = round((top_val / total_sum) * 100)

    rec_map = {
        "Transportation": {
            "title": "Replace 2 weekly solo car trips with metro / bus transit",
            "potentialSavingsKg": round(top_val * 0.35, 1),
            "difficulty": "Moderate",
            "action": f"Transit accounts for {pct}% of your footprint. Shifting 30% of kilometers to rail will significantly flatten your emissions."
        },
        "Food": {
            "title": "Substitute 3 ruminant meat meals with plant-based alternatives",
            "potentialSavingsKg": round(top_val * 0.4, 1),
            "difficulty": "Easy",
            "action": f"Dietary choices contribute {pct}% of your impact. Switching beef or poultry to legumes avoids up to 5 kg CO2e per meal."
        },
        "Energy": {
            "title": "Optimize HVAC setpoints & eliminate phantom standby draws",
            "potentialSavingsKg": round(top_val * 0.25, 1),
            "difficulty": "Easy",
            "action": f"Household electricity makes up {pct}% of total emissions. A 2°C temperature shift cuts home power demand by 12%."
        },
        "Waste": {
            "title": "Audit kitchen leftovers & compost organic scraps",
            "potentialSavingsKg": round(top_val * 0.5, 1),
            "difficulty": "Easy",
            "action": f"Organic waste in landfills generates methane (2.5 kg CO2e/kg). Composting diverts 85% of this impact."
        }
    }

    rec = rec_map.get(top_cat, {
        "title": "Log high-frequency activities to reveal hidden emission spikes",
        "potentialSavingsKg": 8.0,
        "difficulty": "Easy",
        "action": "Continue tracking daily transit and diet in TerraTrace to unlock deeper optimizations."
    })

    return {
        "biggestImpact": {
            "name": top_cat,
            "value": round(top_val, 1),
            "percentage": pct,
            "color": "#10b981"
        },
        "recommendation": {
            **rec,
            "impactCategory": top_cat
        }
    }
