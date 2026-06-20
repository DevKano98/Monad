from typing import Any


async def build_feed_event(event: str, payload: dict[str, Any]) -> dict[str, Any]:
    return {"event": event, "payload": payload}
