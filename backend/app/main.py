import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import get_database, in_memory_store
from backend.app.routes import (
    auth,
    activities,
    analytics,
    simulator,
    scenarios,
    recommendations,
    goals,
    environment,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("terratrace")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="TerraTrace Sustainability Intelligence Platform — Deterministic Carbon Engine & Future Lab Simulator",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(activities.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(simulator.router, prefix=settings.API_PREFIX)
app.include_router(scenarios.router, prefix=settings.API_PREFIX)
app.include_router(recommendations.router, prefix=settings.API_PREFIX)
app.include_router(goals.router, prefix=settings.API_PREFIX)
app.include_router(environment.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "app": "TerraTrace",
        "tagline": "Trace every choice. Understand every impact.",
        "version": settings.VERSION,
        "docs": "/docs",
    }

@app.get("/api/health")
def health_check():
    db = get_database()
    return {
        "status": "ok",
        "service": "TerraTrace Backend",
        "version": settings.VERSION,
        "database": "connected" if db is not None else "in-memory-fallback"
    }

@app.on_event("startup")
def on_startup():
    logger.info("Initializing TerraTrace backend services...")
    db = get_database()
    if db is not None:
        logger.info("MongoDB Atlas connected to '%s'", settings.DATABASE_NAME)
    else:
        logger.info("Operating in resilient local fallback mode.")
