# TerraTrace — Sustainability Intelligence Platform

> **Trace every choice. Understand every impact.**

TerraTrace is an end-to-end sustainability intelligence platform that tracks everyday activities, computes deterministic carbon footprints based on standardized international factors (DEFRA/IPCC), pinpoints dominant emission contributors, and empowers users with the **TerraTrace Future Lab** — featuring an interactive **3D WebGL Earth Simulation** alongside multi-horizon lifestyle forecasting (1-Month, 6-Month, and 1-Year decarbonization trajectories).

---

## Key Features

- **3D Interactive Earth Simulation (React Three Fiber & Drei)**:
  - Real-time WebGL rendering of planet Earth with procedural atmosphere, dynamic clouds, and customizable rotation.
  - **Dynamic GLSL Shaders**: Translates user carbon footprints into physical planetary health states. High footprint levels trigger smog, brown particulate haze, and darkened oceans; low footprint levels restore vibrant azure oceans, lush verdant continents, and a crystalline cyan ozone aura.
  - Interactive orbit controls, auto-rotation speed modulated by environmental velocity, and responsive canvas sizing.
- **TerraTrace Future Lab**:
  - What-if lifestyle simulator with immediate reactivity.
  - Sliders for weekly vehicle transit (petrol/diesel/EV), rapid rail/metro, poultry & meat consumption, household electricity (kWh), and organic food waste.
  - Real-time comparison bar charts, multi-horizon avoidance curves, and saved scenario management.
- **Deterministic Carbon Engine**:
  - Verifiable greenhouse gas (GHG) calculations adhering strictly to official DEFRA and IPCC conversion coefficients.
  - Zero arbitrary estimations or fake multipliers.
- **Natural Language Quick Trace**:
  - Rule-based natural language parser that extracts quantities, units, and categories directly from everyday phrases (e.g., _"Drove 35 km to work"_, _"Ate 2 chicken meals"_, _"Used 14 kWh power"_).
- **Trace AI Telemetry Copilot**:
  - In-app environmental advisor grounded in the user's actual activity telemetry, answering questions like _"Why is my footprint high this week?"_ or _"What single change will yield a 20% reduction?"_.
- **Quantified Sustainability Goals**:
  - Milestone and habit targets with visual progress bars, status indicators, and quick increment loggers (+1, +5).
- **Environmental Intelligence Feed**:
  - Live climate science reports, policy updates, and technological breakthroughs.
- **Dual-Engine Full-Stack Architecture**:
  - **FastAPI + MongoDB Atlas**: Production Python API with physical database materialization, collections seeding, and JWT authentication.
  - **Resilient Client Fallback**: Offline-first client engine ensuring seamless demo evaluation and zero-downtime previews.

---

## Tech Stack

### Frontend

- **Framework**: React 18+ (JavaScript, JSX)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts (Area charts, Bar comparisons, Donut breakdowns)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend

- **Framework**: Python 3.10+, FastAPI
- **ASGI Server**: Uvicorn
- **Data Validation**: Pydantic v2
- **Database**: MongoDB Atlas (`terratrace` database) with PyMongo & Motor
- **Security**: JWT tokens, SHA-256 salted password hashing
- **Web Scraping**: Requests, BeautifulSoup4

---

## Architecture & Directory Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entry point, CORS & lifecycle hooks
│   │   ├── config.py                   # Pydantic settings & environment configuration
│   │   ├── database.py                 # MongoDB Atlas client & init_and_seed_db() engine
│   │   ├── models/                     # Pydantic schemas & data models
│   │   │   ├── user.py                 # User registration, login, and token models
│   │   │   ├── activity.py             # Carbon activity & quick-trace schemas
│   │   │   ├── scenario.py             # Future Lab simulation & scenario models
│   │   │   └── goal.py                 # Sustainability targets & milestones
│   │   ├── routes/                     # REST API routers
│   │   │   ├── auth.py                 # /signup, /register, /login, /me
│   │   │   ├── activities.py           # Activity CRUD & NLP quick-trace
│   │   │   ├── analytics.py            # Aggregated score & category breakdowns
│   │   │   ├── simulator.py            # /calculate & /simulate Future Lab projections
│   │   │   ├── scenarios.py            # Saved scenarios management
│   │   │   ├── recommendations.py      # Impact breakdowns & Trace AI copilot
│   │   │   ├── goals.py                # Goal creation and incremental tracking
│   │   │   ├── environment.py          # Environmental intelligence & news
│   │   │   └── demo.py                 # /seed endpoint for Atlas data materialization
│   │   ├── services/                   # Core business logic
│   │   │   ├── carbon_calculator.py    # DEFRA/IPCC calculation logic & NLP parser
│   │   │   ├── recommendation_engine.py# Dominant contributor sorting
│   │   │   └── projection_engine.py    # 1M, 6M, 1Y timeline extrapolation
│   │   ├── scrapers/                   # Environmental information scrapers
│   │   │   ├── environmental_scraper.py
│   │   │   └── sustainability_news_scraper.py
│   │   └── utils/
│   │       └── security.py             # Salted password hashing & JWT encoding/decoding
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── api/
│   │   └── client.js                   # Unified API client with automatic offline fallback
│   ├── components/
│   │   ├── layout/                     # AppLayout, Navbar, Sidebar
│   │   ├── common/                     # TerraTraceLogo, TraceAIChat Assistant
│   │   ├── dashboard/                  # ScoreCard, Donut, Trend, Impact widgets
│   │   ├── activities/                 # QuickTraceBar, ActivityList, LogModal
│   │   ├── simulator/                  # EarthSimulation.jsx (3D WebGL), LifestyleSlider, Charts
│   │   └── goals/                      # GoalCard, GoalModal
│   ├── context/                        # AuthContext, ThemeContext
│   ├── pages/                          # Landing, Dashboard, FutureLab, Insights, Goals, Auth
│   ├── utils/                          # carbonCalculator.js, demoData.js
│   ├── App.jsx
│   └── main.jsx
├── metadata.json
└── package.json
```

---

## 3D Earth Simulation Engine (`EarthSimulation.jsx`)

The 3D Earth component is built with **React Three Fiber** and custom **GLSL Shaders**:

- **Terrain & Atmospheric Shader**:
  - Computes normal-to-light dot products for dynamic day/night shading.
  - Atmosphere layer blends scattering color based on the `simulatedFuture` score.
- **Visual State Dynamics**:
  - **Healthy Planet (Low Footprint)**: Deep cyan-blue oceans, lush green landmasses, soft white procedural cloud layers, and a delicate glowing blue ozone rim.
  - **Polluted Planet (High Footprint)**: Turbid brownish-orange haze, reduced surface saturation, smog particles, and a warmer atmospheric scattering tint.
- **Interactivity**: OrbitControls enable mouse and touch rotation, zoom, and panning, while an ambient rotation loop maintains gentle continuous motion.

---

## Emission Factors Reference (DEFRA / IPCC 2026)

| Activity Key        | Category       | Unit | Factor (kg CO₂e / unit) | Official Standard                       |
| :------------------ | :------------- | :--- | :---------------------- | :-------------------------------------- |
| `car_petrol`        | Transportation | km   | 0.171                   | DEFRA Passenger Vehicles                |
| `car_diesel`        | Transportation | km   | 0.165                   | DEFRA Passenger Vehicles                |
| `car_electric`      | Transportation | km   | 0.047                   | National Grid Weighted Average          |
| `bus`               | Transportation | km   | 0.089                   | DEFRA Local Public Transit              |
| `metro_train`       | Transportation | km   | 0.035                   | Electrified Rail Transit                |
| `flight_domestic`   | Transportation | km   | 0.246                   | Short-Haul Aviation + Radiative Forcing |
| `bicycle`           | Transportation | km   | 0.000                   | Active Zero-Emission Travel             |
| `electricity_grid`  | Energy         | kWh  | 0.385                   | Standard Grid Generation Mix            |
| `natural_gas`       | Energy         | kWh  | 0.183                   | Natural Gas Thermal Efficiency          |
| `beef_meal`         | Food           | meal | 6.800                   | IPCC Ruminant Agriculture Baseline      |
| `chicken_meal`      | Food           | meal | 1.400                   | Poultry Production Standard             |
| `vegetarian_meal`   | Food           | meal | 0.700                   | Ovo-Lacto Vegetarian Standard           |
| `vegan_meal`        | Food           | meal | 0.450                   | Plant-Based Nutrition Model             |
| `landfill_waste`    | Waste          | kg   | 2.500                   | Municipal Solid Waste Methane Potential |
| `recycled_waste`    | Waste          | kg   | 0.120                   | Mechanical Sorting & Reprocessing       |
| `composted_organic` | Waste          | kg   | 0.080                   | Aerobic Microbe Decomposition           |

---

## API Endpoints Reference

| Method   | Endpoint                      | Description                                           |
| :------- | :---------------------------- | :---------------------------------------------------- |
| `POST`   | `/api/auth/signup`            | Register new user account into MongoDB Atlas          |
| `POST`   | `/api/auth/register`          | Alias for user registration                           |
| `POST`   | `/api/auth/login`             | Authenticate credentials and issue Bearer JWT         |
| `GET`    | `/api/auth/me`                | Fetch authenticated user profile using Bearer token   |
| `POST`   | `/api/demo/seed`              | Seed initial demo data and materialize Atlas database |
| `GET`    | `/api/activities`             | List user carbon activities                           |
| `POST`   | `/api/activities`             | Add activity with deterministic CO₂e calculation      |
| `POST`   | `/api/activities/quick-trace` | NLP parsing & automated carbon activity creation      |
| `DELETE` | `/api/activities/{id}`        | Remove an activity log                                |
| `GET`    | `/api/activities/factors`     | Retrieve official emission coefficients               |
| `GET`    | `/api/analytics/dashboard`    | Aggregated sustainability score, breakdown & trends   |
| `POST`   | `/api/simulator/calculate`    | Execute Future Lab what-if simulation calculations    |
| `POST`   | `/api/simulator/simulate`     | Alias for Future Lab simulation calculation           |
| `GET`    | `/api/scenarios`              | Fetch saved Future Lab scenarios                      |
| `POST`   | `/api/scenarios`              | Save scenario with reduction percentages & inputs     |
| `DELETE` | `/api/scenarios/{id}`         | Delete a saved scenario                               |
| `GET`    | `/api/recommendations`        | Dominant impact analysis and action plans             |
| `POST`   | `/api/recommendations/ask-ai` | Query Trace AI copilot with grounded telemetry        |
| `GET`    | `/api/goals`                  | List sustainability targets and progress milestones   |
| `POST`   | `/api/goals`                  | Create a new target milestone                         |
| `PATCH`  | `/api/goals/{id}`             | Update progress increment (+1, +5)                    |
| `GET`    | `/api/environment/news`       | Scraped environmental intelligence & science reports  |
| `GET`    | `/api/health`                 | Service health and database connection status         |

---

## MongoDB Atlas Integration & Database Materialization

MongoDB creates databases **lazily**: a database name does not appear in the MongoDB shell (`mongosh > show dbs;`) until at least one physical document is written to a collection.

TerraTrace resolves this automatically:

1. **Startup Lifecycle Hook (`@app.on_event("startup")`)**: Runs `init_and_seed_db()` on server start.
2. **Collection Materialization**: Writes initial documents to:
   - `system_status`: Server metadata and initialization heartbeat.
   - `users`: Default demo credentials (`alex.morgan@terratrace.earth`) with salted password hash and index constraints.
   - `scenarios`: Baseline what-if lifestyle scenarios.
   - `activities`: 14 days of realistic activity logs.
   - `emission_factors`: DEFRA/IPCC coefficients.
3. **Verification in MongoDB Shell (`mongosh`)**:
   ```javascript
   Atlas [primary] test> show dbs;
   admin        0 B
   local        0 B
   terratrace  64.00 KiB
   ```

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or later
- **Python**: 3.10 or later
- **MongoDB Atlas**: Connection URI string (optional; runs in in-memory mode if omitted)

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The React frontend runs at `http://localhost:3000`.

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

- Interactive Swagger API docs: `http://localhost:8000/docs`
- Redoc API docs: `http://localhost:8000/redoc`

---

## License

MIT License. Designed and developed for the TerraTrace Sustainability Intelligence Initiative.
