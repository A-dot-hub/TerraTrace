from typing import Dict, Any, List

def compute_simulation_projections(
    current_weekly: float,
    simulated_weekly: float
) -> List[Dict[str, Any]]:
    """
    Computes 1-month, 6-month, and 1-year cumulative CO2e projections.
    """
    weekly_diff = max(0.0, current_weekly - simulated_weekly)

    # Multipliers: 1 month = 4.3 weeks, 6 months = 26 weeks, 1 year = 52 weeks
    m1_cur = round(current_weekly * 4.3, 1)
    m1_sim = round(simulated_weekly * 4.3, 1)
    m1_saved = round(m1_cur - m1_sim, 1)

    m6_cur = round(current_weekly * 26.0, 1)
    m6_sim = round(simulated_weekly * 26.0, 1)
    m6_saved = round(m6_cur - m6_sim, 1)

    y1_cur = round(current_weekly * 52.0, 1)
    y1_sim = round(simulated_weekly * 52.0, 1)
    y1_saved = round(y1_cur - y1_sim, 1)

    return [
        {"horizon": "Current", "currentKg": round(current_weekly, 1), "simulatedKg": round(current_weekly, 1), "savedKg": 0.0},
        {"horizon": "1 Month", "currentKg": m1_cur, "simulatedKg": m1_sim, "savedKg": m1_saved},
        {"horizon": "6 Months", "currentKg": m6_cur, "simulatedKg": m6_sim, "savedKg": m6_saved},
        {"horizon": "1 Year", "currentKg": y1_cur, "simulatedKg": y1_sim, "savedKg": y1_saved},
    ]
