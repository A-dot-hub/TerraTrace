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

def init_and_seed_db(database=None):
    """
    Initializes and writes startup metadata and baseline collections into MongoDB Atlas.
    MongoDB will NOT show a database in `show dbs` until at least one document is written.
    This guarantees that the 'terratrace' database is physically created on MongoDB Atlas.
    """
    import datetime
    from backend.app.utils.security import hash_password

    target_db  = database if database is not None else get_database()
    if target_db is None:
        logger.warning("Database unavailable for seeding. Using in-memory store.")
        return

    try:
        now_iso = datetime.datetime.utcnow().isoformat()
        
        # 1. Physical write to guarantee DB is materialized in Atlas
        target_db.system_status.update_one(
            {"_id": "terratrace_cluster_init"},
            {
                "$set": {
                    "database": settings.DATABASE_NAME,
                    "service": "TerraTrace Backend",
                    "status": "online",
                    "version": settings.VERSION,
                    "last_heartbeat": now_iso,
                },
                "$setOnInsert": {
                    "created_at": now_iso
                }
            },
            upsert=True
        )

        # 2. Ensure unique index on users.email
        try:
            target_db.users.create_index("email", unique=True)
        except Exception:
            pass

        # 3. Ensure demo user exists in users collection
        if target_db.users.count_documents({"email": "alex.morgan@terratrace.earth"}) == 0:
            target_db.users.insert_one({
                "id": "demo-user-id",
                "name": "Alex Morgan",
                "email": "alex.morgan@terratrace.earth",
                "password": hash_password("password123"),
                "is_demo": True,
                "created_at": now_iso,
            })
            logger.info("Demo user 'alex.morgan@terratrace.earth' inserted into MongoDB Atlas.")

        # 4. Ensure scenarios collection has baseline scenarios
        if target_db.scenarios.count_documents({}) == 0:
            initial_scenarios = [
                {
                    "id": "scen-demo-1",
                    "userId": "demo-user-id",
                    "user_id": "demo-user-id",
                    "scenarioName": "Transit First & Meatless Thursdays",
                    "name": "Transit First & Meatless Thursdays",
                    "currentFootprint": 58.5,
                    "simulatedFootprint": 38.2,
                    "reductionPercent": 34.7,
                    "annualSavingsKg": 1055.6,
                    "habitVariables": {
                        "carKm": 60.0,
                        "metroKm": 80.0,
                        "chickenMeals": 2.0,
                        "electricityKwh": 35.0,
                        "foodWasteKg": 0.8
                    },
                    "inputs": {
                        "carKm": 60.0,
                        "metroKm": 80.0,
                        "chickenMeals": 2.0,
                        "electricityKwh": 35.0,
                        "foodWasteKg": 0.8
                    },
                    "created_at": now_iso,
                },
                {
                    "id": "scen-demo-2",
                    "userId": "demo-user-id",
                    "user_id": "demo-user-id",
                    "scenarioName": "Deep Decarbonization: Green Grid + Solar",
                    "name": "Deep Decarbonization: Green Grid + Solar",
                    "currentFootprint": 58.5,
                    "simulatedFootprint": 29.4,
                    "reductionPercent": 49.7,
                    "annualSavingsKg": 1513.2,
                    "habitVariables": {
                        "carKm": 80.0,
                        "metroKm": 60.0,
                        "chickenMeals": 2.0,
                        "electricityKwh": 12.0,
                        "foodWasteKg": 0.5
                    },
                    "inputs": {
                        "carKm": 80.0,
                        "metroKm": 60.0,
                        "chickenMeals": 2.0,
                        "electricityKwh": 12.0,
                        "foodWasteKg": 0.5
                    },
                    "created_at": now_iso,
                },
                {
                    "id": "scen-demo-3",
                    "userId": "demo-user-id",
                    "user_id": "demo-user-id",
                    "scenarioName": "Zero Food Waste & Micro-Mobility",
                    "name": "Zero Food Waste & Micro-Mobility",
                    "currentFootprint": 58.5,
                    "simulatedFootprint": 43.1,
                    "reductionPercent": 26.3,
                    "annualSavingsKg": 800.8,
                    "habitVariables": {
                        "carKm": 110.0,
                        "metroKm": 45.0,
                        "chickenMeals": 3.0,
                        "electricityKwh": 38.0,
                        "foodWasteKg": 0.2
                    },
                    "inputs": {
                        "carKm": 110.0,
                        "metroKm": 45.0,
                        "chickenMeals": 3.0,
                        "electricityKwh": 38.0,
                        "foodWasteKg": 0.2
                    },
                    "created_at": now_iso,
                }
            ]
            target_db.scenarios.insert_many(initial_scenarios)
            logger.info("Seeded initial scenarios into MongoDB Atlas collection 'scenarios'.")

        # 5. Ensure activities collection has baseline activities
        if target_db.activities.count_documents({}) == 0:
            initial_acts = []
            for i in range(14):
                day_offset = 13 - i
                initial_acts.append({
                    "id": f"seed-act-{i}-elec",
                    "user_id": "demo-user-id",
                    "category": "Energy",
                    "activity_type": "electricity",
                    "quantity": 6.0,
                    "unit": "kWh",
                    "emission": round(6.0 * 0.385, 2),
                    "timestamp": (datetime.datetime.utcnow() - datetime.timedelta(days=day_offset)).isoformat(),
                    "notes": "Residential power consumption"
                })
                if i % 2 == 0:
                    initial_acts.append({
                        "id": f"seed-act-{i}-transit",
                        "user_id": "demo-user-id",
                        "category": "Transportation",
                        "activity_type": "car",
                        "quantity": 25.0,
                        "unit": "km",
                        "emission": round(25.0 * 0.171, 2),
                        "timestamp": (datetime.datetime.utcnow() - datetime.timedelta(days=day_offset)).isoformat(),
                        "notes": "Daily commute"
                    })
                else:
                    initial_acts.append({
                        "id": f"seed-act-{i}-transit",
                        "user_id": "demo-user-id",
                        "category": "Transportation",
                        "activity_type": "metro",
                        "quantity": 18.0,
                        "unit": "km",
                        "emission": round(18.0 * 0.035, 2),
                        "timestamp": (datetime.datetime.utcnow() - datetime.timedelta(days=day_offset)).isoformat(),
                        "notes": "Subway transit trip"
                    })
            target_db.activities.insert_many(initial_acts)
            logger.info("Seeded initial activities into MongoDB Atlas collection 'activities'.")

        # 6. Ensure emission factors collection
        if target_db.emission_factors.count_documents({}) == 0:
            factors = [
                {"activity_type": "car", "factor": 0.171, "unit": "kg CO2e / km", "category": "Transportation"},
                {"activity_type": "bus", "factor": 0.089, "unit": "kg CO2e / km", "category": "Transportation"},
                {"activity_type": "metro", "factor": 0.035, "unit": "kg CO2e / km", "category": "Transportation"},
                {"activity_type": "flight", "factor": 0.255, "unit": "kg CO2e / km", "category": "Transportation"},
                {"activity_type": "beef", "factor": 6.0, "unit": "kg CO2e / meal", "category": "Food"},
                {"activity_type": "chicken", "factor": 1.4, "unit": "kg CO2e / meal", "category": "Food"},
                {"activity_type": "vegetarian", "factor": 0.6, "unit": "kg CO2e / meal", "category": "Food"},
                {"activity_type": "electricity", "factor": 0.385, "unit": "kg CO2e / kWh", "category": "Energy"},
                {"activity_type": "natural_gas", "factor": 2.05, "unit": "kg CO2e / m³", "category": "Energy"},
                {"activity_type": "food_waste", "factor": 2.5, "unit": "kg CO2e / kg", "category": "Waste"},
            ]
            target_db.emission_factors.insert_many(factors)
            logger.info("Seeded verified emission factors into MongoDB Atlas collection 'emission_factors'.")

        logger.info("MongoDB Atlas database '%s' successfully initialized and written to disk.", settings.DATABASE_NAME)
    except Exception as e:
        logger.error("Error during init_and_seed_db: %s", str(e))

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