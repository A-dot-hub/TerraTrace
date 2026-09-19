import logging
from pymongo import MongoClient
from backend.app.config import settings

logger = logging.getLogger(__name__)

client = None
db = None

# Default in-memory cache if MongoDB is offline or running locally without Atlas
in_memory_store = {
    "users": [],
    "activities": [],
    "scenarios": [],
    "goals": [],
    "environmental_data": [],
    "recommendations": [],
    "emission_factors": []
}

def get_database():
    global client, db
    if db is not None:
        return db

    try:
        if settings.MONGODB_URI:
            client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            db = client[settings.DATABASE_NAME]
            # Ping database to verify connection
            db.command('ping')
            logger.info("Successfully connected to MongoDB (%s)", settings.DATABASE_NAME)
            return db
    except Exception as e:
        logger.warning("Could not connect to MongoDB (%s). Using fallback persistence mode.", str(e))
        db = None

    return db
