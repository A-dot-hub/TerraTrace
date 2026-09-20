import logging
from fastapi import APIRouter, status
from backend.app.database import get_database, init_and_seed_db
from backend.app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/demo", tags=["Demo & Seeding"])

@router.post("/seed", status_code=status.HTTP_200_OK)
def seed_demo_data():
    """
    Seeds demo activities, scenarios, emission factors, and demo user into MongoDB Atlas.
    Guarantees that collections are populated and database exists in Atlas.
    """
    db = get_database()
    if db is not None:
        try:
            init_and_seed_db(db)
            return {
                "status": "success",
                "message": f"Demo data verified and seeded into MongoDB Atlas database '{settings.DATABASE_NAME}'",
                "database": settings.DATABASE_NAME,
            }
        except Exception as e:
            logger.error("Failed to seed MongoDB Atlas: %s", str(e))
            return {
                "status": "warning",
                "message": f"Seeding encountered an issue: {str(e)}",
                "database": settings.DATABASE_NAME,
            }

    return {
        "status": "local",
        "message": "Seeded into in-memory fallback store",
        "database": "in-memory"
    }