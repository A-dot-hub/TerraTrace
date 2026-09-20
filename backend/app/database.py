import logging
from pymongo import MongoClient
from backend.app.config import settings

logger = logging.getLogger(__name__)

# Motor async client support
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    HAS_MOTOR = True
except ImportError:
    AsyncIOMotorClient = None
    HAS_MOTOR = False

client = None
db = None
async_client = None
async_db = None

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

def get_async_database():
    """Returns the motor AsyncIOMotorDatabase instance for async queries."""
    global async_client, async_db
    if async_db is not None:
        return async_db

    if HAS_MOTOR and settings.MONGODB_URI:
        try:
            async_client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            async_db = async_client[settings.DATABASE_NAME]
            logger.info("Successfully initialized Motor AsyncIOMotorClient (%s)", settings.DATABASE_NAME)
            return async_db
        except Exception as e:
            logger.warning("Could not initialize Motor client: %s", str(e))
            async_db = None

    return None