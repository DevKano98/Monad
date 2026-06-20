from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Axiom"
    app_description: str = "Decentralized failure intelligence and fix reputation backend"
    app_version: str = "1.0.0"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    database_url: str = "postgresql+asyncpg://axiom:axiom@localhost:5432/axiom"
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    groq_api_key: str | None = None
    groq_model: str = "llama-3.1-8b-instant"
    monad_rpc_url: str = "https://testnet-rpc.monad.xyz"
    monad_chain_id: int = 10143
    private_key: str | None = None
    fingerprint_registry_address: str | None = None
    reputation_registry_address: str | None = None
    x402_pay_to_address: str = "0x0000000000000000000000000000000000000000"
    x402_network: str = "monad-testnet"
    x402_premium_feed_price: str = "0.01"
    x402_advanced_search_price: str = "0.02"
    x402_reputation_analytics_price: str = "0.03"

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: object) -> bool:
        if isinstance(value, str):
            return value.lower() in {"1", "true", "yes", "on", "debug", "development"}
        return bool(value)

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
