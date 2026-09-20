import os
from dotenv import load_dotenv, find_dotenv

# Automatically finds the .env file regardless of where you run the start command
load_dotenv(find_dotenv())

env_path = find_dotenv()
print("DEBUG: Found .env file at ->", env_path)
load_dotenv(env_path)
class Settings:
    PROJECT_NAME: str = "TerraTrace"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "terratrace")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "terratrace_secret_hackathon_key_2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    ALLOWED_ORIGINS: list = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000"
        ).split(",")
    ]

settings = Settings()