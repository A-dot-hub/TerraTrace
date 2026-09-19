# TerraTrace — Sustainability Intelligence Platform

> **Trace every choice. Understand every impact.**

TerraTrace is a modern sustainability intelligence platform that tracks everyday personal activities, computes deterministic carbon footprints based on standardized international factors, pinpoints dominant emission contributors, and empowers users with the **TerraTrace Future Lab** — an interactive what-if lifestyle simulator that projects 1-month, 6-month, and 1-year decarbonization horizons.

---

## Key Features

- **TerraTrace Future Lab**: An interactive "what-if" lifestyle simulator. Adjust weekly vehicle transit, rapid rail, poultry meals, household electricity, and organic food waste to immediately view baseline vs. simulated footprints, percentage cuts, and 1-Month, 6-Month, and 1-Year cumulative avoidance trajectories.
- **Deterministic Carbon Engine**: Standardized, verifiable greenhouse gas (GHG) calculations adhering to official DEFRA and IPCC conversion coefficients.
- **Natural Language Quick Trace**: Type daily activities in plain language (e.g. *"Drove 18 km in petrol car today"* or *"Ate 2 chicken meals"*). An automated rule-based NLP parser instantly extracts quantities, units, and emission values.
- **Trace AI Telemetry Copilot**: An ecological intelligence assistant that inspects actual user activity logs and telemetry to answer questions like *"Why is my footprint high?"*, *"What is my biggest impact source?"*, and *"How can I cut emissions by 20%?"*.
- **Environmental Intelligence Feed**: Automated Python scrapers collecting verified climate science reports, policy updates, and clean technology breakthroughs with full source attribution.
- **Quantified Sustainability Goals**: Goal-tracking engine with progress visualizers and incremental step loggers.
- **Dual-Engine Architecture**: Production-grade FastAPI Python backend with MongoDB Atlas persistence + an offline-first resilient client engine with full demo seeding for instant evaluation.

---

## Tech Stack

### Frontend
- **Framework**: React.js (JavaScript, JSX)
- **Tooling**: Vite, React Router v7
- **Styling**: Tailwind CSS (Sophisticated Climate-Tech Dark/Light UI)
- **Data Visualization**: Recharts (Donut breakdown, Area trends, Bar comparisons, Multi-line projections)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Python 3.10+, FastAPI
- **Server**: Uvicorn ASGI
- **Data Validation**: Pydantic v2
- **Database**: MongoDB Atlas (`terratrace` database) with PyMongo
- **Web Scraping**: Requests, BeautifulSoup4
- **Security**: Python-Jose (JWT), Passlib (Bcrypt)

---

## Architecture & Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS configuration
│   │   ├── config.py                   # Pydantic & environment settings
│   │   ├── database.py                 # MongoDB connection & cache fallback
│   │   ├── models/                     # Pydantic data schemas
│   │   │   ├── user.py
│   │   │   ├── activity.py
│   │   │   ├── scenario.py
│   │   │   └── goal.py
│   │   ├── routes/                     # REST API endpoints
│   │   │   ├── auth.py
│   │   │   ├── activities.py
│   │   │   ├── analytics.py
│   │   │   ├── simulator.py
│   │   │   ├── scenarios.py
│   │   │   ├── recommendations.py
│   │   │   ├── goals.py
│   │   │   └── environment.py
│   │   ├── services/                   # Business & calculation logic
│   │   │   ├── carbon_calculator.py    # DEFRA/IPCC calculation & NLP parser
│   │   │   ├── recommendation_engine.py# Impact breakdown & priority sorting
│   │   │   └── projection_engine.py    # 1M/6M/1Y timeline forecasting
│   │   └── scrapers/                   # Environmental information scrapers
│   │       ├── environmental_scraper.py
│   │       └── sustainability_news_scraper.py
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── api/client.js                   # Unified API client with automatic fallback
│   ├── components/
│   │   ├── layout/                     # AppLayout, Navbar, Sidebar
│   │   ├── dashboard/                  # ScoreCard, Donut, Trend, Impact widgets
│   │   ├── activities/                 # QuickTraceBar, ActivityList, Modal
│   │   ├── simulator/                  # LifestyleSlider, Charts, SavedScenarios
│   │   ├── goals/                      # GoalCard, GoalModal
│   │   └── common/                     # TraceAIChat Assistant
│   ├── context/                        # AuthContext, ThemeContext
│   ├── pages/                          # Landing, Dashboard, FutureLab, Insights, Goals, Profile
│   ├── utils/                          # carbonCalculator.js, demoData.js
│   ├── App.jsx
│   └── main.jsx
├── metadata.json
└── package.json
```

---

## Emission Factors Reference (DEFRA / IPCC 2026)

| Activity Key | Category | Unit | Factor (kg CO₂e / unit) | Reference |
| :--- | :--- | :--- | :--- | :--- |
| `car_petrol` | Transportation | km | 0.171 | DEFRA Passenger Vehicles |
| `car_diesel` | Transportation | km | 0.165 | DEFRA Passenger Vehicles |
| `car_electric`| Transportation | km | 0.047 | National Grid Weighted Average |
| `bus` | Transportation | km | 0.089 | DEFRA Local Transit |
| `metro_train` | Transportation | km | 0.035 | Electrified Rail Transit |
| `flight_domestic` | Transportation | km | 0.246 | Short-Haul Aviation + Radiative Forcing |
| `bicycle` | Transportation | km | 0.000 | Active Travel Benchmark |
| `electricity_grid` | Energy | kWh | 0.385 | Standard Grid Generation Mix |
| `natural_gas` | Energy | kWh | 0.183 | Natural Gas Thermal Efficiency |
| `beef_meal` | Food | meal | 6.800 | IPCC Ruminant Agriculture Baseline |
| `chicken_meal`| Food | meal | 1.400 | Poultry Production Footprint |
| `vegetarian_meal` | Food | meal | 0.700 | Ovo-Lacto Vegetarian Standard |
| `vegan_meal` | Food | meal | 0.450 | Plant-Based Nutrition Model |
| `landfill_waste` | Waste | kg | 2.500 | Municipal Solid Waste Methane Potential |
| `recycled_waste` | Waste | kg | 0.120 | Mechanical Sorting & Reprocessing |
| `composted_organic` | Waste | kg | 0.080 | Aerobic Microbe Decomposition |

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `GET` | `/api/activities` | List logged carbon activities |
| `POST` | `/api/activities` | Add activity with deterministic CO₂e calculation |
| `POST` | `/api/activities/quick-trace` | NLP parsing & automated carbon logging |
| `DELETE`| `/api/activities/{id}` | Remove an activity log |
| `GET` | `/api/activities/factors` | Retrieve official emission coefficients |
| `GET` | `/api/analytics/dashboard` | Aggregated sustainability score, breakdown & trends |
| `POST` | `/api/simulator/simulate` | Execute what-if Future Lab scenario calculations |
| `GET` | `/api/scenarios` | Fetch saved Future Lab scenarios |
| `POST` | `/api/scenarios` | Save scenario with reduction percentages |
| `DELETE`| `/api/scenarios/{id}` | Delete a saved scenario |
| `GET` | `/api/recommendations` | Dominant impact analysis and action plans |
| `POST` | `/api/recommendations/ask-ai` | Query Trace AI copilot with grounded telemetry |
| `GET` | `/api/goals` | List sustainability targets and progress |
| `POST` | `/api/goals` | Create a new target milestone |
| `PATCH` | `/api/goals/{id}` | Update progress increment (+1, +5) |
| `GET` | `/api/environment/news` | Scraped environmental intelligence & science reports |

---

## Getting Started

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The React frontend starts at `http://localhost:3000`.

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.
