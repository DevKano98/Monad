from typing import Any
import json

try:
    from redis.asyncio import Redis
except ModuleNotFoundError:
    Redis = None

from app.core.config import settings

redis_client: Any | None = None


async def init_redis() -> None:
    global redis_client
    if settings.redis_url.startswith("memory://"):
        redis_client = InMemoryRedis()
        return
    if Redis is None:
        redis_client = InMemoryRedis()
        return
    redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
    await redis_client.ping()


async def close_redis() -> None:
    if redis_client is not None:
        await redis_client.aclose()


def get_redis() -> Any:
    if redis_client is None:
        if settings.redis_url.startswith("memory://"):
            return InMemoryRedis()
        if Redis is None:
            return InMemoryRedis()
        return Redis.from_url(settings.redis_url, decode_responses=True)
    return redis_client


async def publish_event(channel: str, payload: dict[str, Any]) -> None:
    await get_redis().publish(channel, json.dumps(payload, default=str))


class InMemoryRedis:
    async def ping(self) -> bool:
        return True

    async def aclose(self) -> None:
        return None

    async def publish(self, channel: str, payload: str) -> int:
        return 0
