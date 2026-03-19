"""
Application configuration module.
Loads settings from environment variables with Pydantic Settings.
"""
from functools import lru_cache
from typing import List, Optional
from urllib.parse import quote_plus

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application Settings
    app_name: str = Field(default="FastAPI App", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="development", alias="ENVIRONMENT")

    # Server Settings
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    reload: bool = Field(default=False, alias="RELOAD")

    # Database Settings
    postgres_user: str = Field(default="postgres", alias="POSTGRES_USER")
    postgres_password: str = Field(
        default="postgres", alias="POSTGRES_PASSWORD")
    postgres_host: str = Field(default="localhost", alias="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, alias="POSTGRES_PORT")
    postgres_db: str = Field(default="fastapi_db", alias="POSTGRES_DB")
    database_url: Optional[str] = Field(default=None, alias="DATABASE_URL")

    # CORS Settings
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        alias="CORS_ORIGINS",
    )
    cors_allow_credentials: bool = Field(
        default=True, alias="CORS_ALLOW_CREDENTIALS")
    cors_allow_methods: str = Field(
        default="GET,POST,PUT,DELETE,PATCH,OPTIONS",
        alias="CORS_ALLOW_METHODS",
    )
    cors_allow_headers: str = Field(
        default="Content-Type,Authorization,X-Requested-With",
        alias="CORS_ALLOW_HEADERS",
    )

    # Security Settings
    secret_key: str = Field(default="dev-secret-key", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(
        default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(
        default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")

    # Logging Settings
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_file: str = Field(default="logs/app.log", alias="LOG_FILE")
    log_format: str = Field(default="json", alias="LOG_FORMAT")

    # Rate Limiting
    rate_limit_per_minute: int = Field(
        default=60, alias="RATE_LIMIT_PER_MINUTE")

    # Pagination Defaults
    default_page_size: int = Field(default=20, alias="DEFAULT_PAGE_SIZE")
    max_page_size: int = Field(default=100, alias="MAX_PAGE_SIZE")

    # TTS / Modal Settings
    modal_tts_endpoint_url: str = Field(
        default="http://localhost:8080/tts",
        alias="MODAL_TTS_ENDPOINT_URL",
    )
    modal_tts_api_key: str = Field(default="", alias="MODAL_TTS_API_KEY")
    tts_media_dir: str = Field(default="media/tts", alias="TTS_MEDIA_DIR")
    tts_request_timeout: int = Field(
        default=60, alias="TTS_REQUEST_TIMEOUT"
    )

    @computed_field
    @property
    def async_database_url(self) -> str:
        """Generate async database URL if not provided."""
        if self.database_url:
            return self.database_url
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field
    @property
    def sync_database_url(self) -> str:
        """Generate sync database URL for Alembic."""
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @computed_field
    @property
    def cors_allow_methods_list(self) -> List[str]:
        """Parse CORS methods string into list."""
        return [method.strip() for method in self.cors_allow_methods.split(",")]

    @computed_field
    @property
    def cors_allow_headers_list(self) -> List[str]:
        """Parse CORS headers string into list."""
        return [header.strip() for header in self.cors_allow_headers.split(",")]

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"

    @property
    def is_testing(self) -> bool:
        """Check if running in testing environment."""
        return self.environment.lower() == "testing"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
