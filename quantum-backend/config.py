"""
Configuration management using Pydantic Settings
"""

from pydantic_settings import BaseSettings
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"
    
    # Vexa AI
    vexa_api_key: str = ""
    vexa_base_url: str = "https://api.cloud.vexa.ai"
    
    # Google Gemini AI
    gemini_api_key: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)
    
    # Database Configuration
    database_url: str = "sqlite:///./quantum.db"
    
    # JWT Configuration
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS Configuration
    frontend_url: str = "http://localhost:3000"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
