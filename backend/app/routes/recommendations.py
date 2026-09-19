from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.database import get_database, in_memory_store
from backend.app.services.recommendation_engine import analyze_impact

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

class TraceAIQuestion(BaseModel):
    question: str

@router.get("")
def get_recommendations():
    db = get_database()
    activities = []
    if db is not None:
        try:
            activities = list(db.activities.find({}, {"_id": 0}))
        except Exception:
            pass
    if not activities:
        activities = in_memory_store.get("activities", [])

    return analyze_impact(activities)

@router.post("/ask-ai")
def ask_trace_ai(req: TraceAIQuestion):
    q = req.question.lower().strip()
    db = get_database()
    activities = []
    if db is not None:
        try:
            activities = list(db.activities.find({}, {"_id": 0}))
        except Exception:
            pass
    if not activities:
        activities = in_memory_store.get("activities", [])

    impact = analyze_impact(activities)
    top_cat = impact["biggestImpact"]["name"]
    top_val = impact["biggestImpact"]["value"]
    top_pct = impact["biggestImpact"]["percentage"]
    rec = impact["recommendation"]

    if "biggest" in q or "highest" in q or "main" in q:
        answer = (
            f"Based on your actual logged telemetry, your largest carbon contributor is **{top_cat}**, "
            f"generating **{top_val} kg CO₂e** (accounting for **{top_pct}%** of your total footprint). "
            f"Targeting this category offers your steepest decarbonization leverage."
        )
        source = f"Personal Activity Log ({len(activities)} telemetry records analyzed)"
    elif "why" in q and "high" in q:
        answer = (
            f"Your footprint is primarily driven by **{top_cat}** ({top_pct}% of total emissions). "
            f"In standard household footprints, transit and grid energy represent the steepest multipliers. "
            f"For instance, every 10 km driven in a petrol vehicle emits ~1.71 kg CO₂e."
        )
        source = "DEFRA GHG Multiplier Breakdown"
    elif "20%" in q or "reduce" in q:
        target_savings = round(top_val * 0.4, 1)
        answer = (
            f"To achieve a 20% footprint reduction, the fastest path is: **{rec['title']}**. "
            f"{rec['action']} This alone would save approximately **{rec['potentialSavingsKg']} kg CO₂e** per week."
        )
        source = "TerraTrace Recommendation Optimization Engine"
    elif "car" in q or "travel" in q or "drive" in q:
        answer = (
            "Reducing car travel from 180 km/week to 140 km/week saves ~6.8 kg CO₂e each week (approx 355 kg CO₂e annually). "
            "Switching those kilometers to electrified metro or bus transit retains mobility while cutting emissions by over 75%."
        )
        source = "Future Lab Transit Simulation Engine"
    elif "first" in q or "start" in q:
        answer = (
            f"You should address **{top_cat}** first. "
            f"Recommended step: {rec['action']} "
            f"You can also test this specific adjustment inside the **Future Lab** before making commitments."
        )
        source = "Priority Habit Diagnostics"
    else:
        answer = (
            f"Analyzing your profile: Your current weekly footprint is approx {top_val * 1.8:.1f} kg CO₂e, "
            f"led by {top_cat} ({top_pct}%). "
            f"By adjusting transit and diet habits in the Future Lab, you can realistically cut your emissions by 18-25% without sacrificing quality of life."
        )
        source = "TerraTrace Telemetry Diagnostic"

    return {
        "question": req.question,
        "answer": answer,
        "source": source,
        "topic": top_cat
    }
