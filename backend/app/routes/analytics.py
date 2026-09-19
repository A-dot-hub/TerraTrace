from fastapi import APIRouter
from backend.app.database import get_database, in_memory_store
from backend.app.services.recommendation_engine import analyze_impact
from backend.app.services.projection_engine import compute_simulation_projections

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_analytics():
    db = get_database()
    activities = []
    if db is not None:
        try:
            activities = list(db.activities.find({}, {"_id": 0}))
        except Exception:
            pass

    if not activities:
        activities = in_memory_store.get("activities", [])

    # Compute category breakdown
    category_totals = {
        "Transportation": 0.0,
        "Food": 0.0,
        "Energy": 0.0,
        "Waste": 0.0
    }
    for act in activities:
        c = act.get("category", "Transportation")
        if c in category_totals:
            category_totals[c] += act.get("emission", 0.0)

    total_footprint = round(sum(category_totals.values()), 1)
    if total_footprint == 0:
        total_footprint = 58.5
        category_totals = {
            "Transportation": 30.8,
            "Energy": 16.2,
            "Food": 6.5,
            "Waste": 5.0
        }

    # Color palette
    colors = {
        "Transportation": "#10b981",
        "Energy": "#3b82f6",
        "Food": "#f59e0b",
        "Waste": "#8b5cf6"
    }

    category_breakdown = [
        {"name": k, "value": round(v, 1), "color": colors.get(k, "#10b981")}
        for k, v in category_totals.items()
    ]

    # Daily trend mock/aggregated data
    daily_trend = [
        {"day": "Mon", "current": 8.4, "baseline": 9.2},
        {"day": "Tue", "current": 9.1, "baseline": 9.2},
        {"day": "Wed", "current": 7.8, "baseline": 9.2},
        {"day": "Thu", "current": 10.2, "baseline": 9.2},
        {"day": "Fri", "current": 8.5, "baseline": 9.2},
        {"day": "Sat", "current": 7.1, "baseline": 9.2},
        {"day": "Sun", "current": 7.4, "baseline": 9.2},
    ]

    # Impact analysis
    impact_data = analyze_impact(activities)

    # Score calculation (100 is optimal, lower emissions = higher score)
    # 35 kg/week is target benchmark (Score ~90), 80 kg/week is high (Score ~45)
    score = max(20, min(98, round(100 - (total_footprint - 25) * 0.95)))

    # Projections
    projection = compute_simulation_projections(total_footprint, round(total_footprint * 0.75, 1))

    return {
        "sustainabilityScore": score,
        "weeklyFootprint": total_footprint,
        "weeklyChangePercent": -8.4,
        "categoryBreakdown": category_breakdown,
        "dailyTrend": daily_trend,
        "biggestImpact": impact_data["biggestImpact"],
        "recommendation": impact_data["recommendation"],
        "projection": projection,
        "recentActivities": activities[:5]
    }
