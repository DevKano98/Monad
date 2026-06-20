from functools import lru_cache
import json

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
    redis_url: str = "rediss://default:YOUR_UPSTASH_PASSWORD@YOUR_UPSTASH_HOST:YOUR_UPSTASH_PORT/0"
    celery_broker_url: str = "rediss://default:YOUR_UPSTASH_PASSWORD@YOUR_UPSTASH_HOST:YOUR_UPSTASH_PORT/1"
    celery_result_backend: str = "rediss://default:YOUR_UPSTASH_PASSWORD@YOUR_UPSTASH_HOST:YOUR_UPSTASH_PORT/2"
    cors_origins: list[str] = Field(
        default_factory=lambda: ["*"]
    )
    groq_api_key: str | None = None
    groq_model: str = "llama-3.1-8b-instant"
    monad_rpc_url: str = "https://testnet-rpc.monad.xyz"
    monad_chain_id: int = 10143
    private_key: str | None = None
    fingerprint_registry_address: str | None = None
    reputation_registry_address: str | None = None
    monad_priority_fee_gwei: int = 2
    project_keys: str = "axiom_pk_demo"
    x402_pay_to_address: str = "0x0000000000000000000000000000000000000000"
    x402_network: str = "monad-testnet"
    x402_premium_feed_price: str = "0.01"
    x402_advanced_search_price: str = "0.02"
    x402_reputation_analytics_price: str = "0.03"
    x402_submit_fix_price: str = "0.01"
    x402_vote_fix_price: str = "0.005"

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: object) -> bool:
        if isinstance(value, str):
            return value.lower() in {"1", "true", "yes", "on", "debug", "development"}
        return bool(value)

    @field_validator("cors_origins", mode="before")
    @classmethod
    def normalize_cors_origins(cls, value: object) -> list[str]:
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []
            if text.startswith("["):
                parsed = json.loads(text)
                return [str(item).strip() for item in parsed if str(item).strip()]
            return [item.strip() for item in text.split(",") if item.strip()]
        if isinstance(value, list):
            normalized = [str(item).strip() for item in value if str(item).strip()]
            return normalized or ["*"]
        return ["*"]

    @property
    def allow_all_origins(self) -> bool:
        return "*" in self.cors_origins

    def is_valid_project_key(self, value: str) -> bool:
        keys = {key.strip() for key in self.project_keys.split(",") if key.strip()}
        return value in keys

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
