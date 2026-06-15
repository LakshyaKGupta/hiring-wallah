import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load env variables from a parent or local .env if it exists
load_dotenv()

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"
    FIREBASE_PROJECT_ID: str = "hiring-wallah-prod"
    FIREBASE_SERVICE_ACCOUNT_JSON: str = ""
    FIREBASE_SERVICE_ACCOUNT_PATH: str = ""
    FIREBASE_ALLOW_LOCAL_TOKEN_FALLBACK: bool = True
    
    # Allow DB fallback to SQLite if Supabase url/keys are empty
    DB_FALLBACK_SQLITE: bool = True
    SQLITE_DB_PATH: str = "hiring_wallah.db"

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
