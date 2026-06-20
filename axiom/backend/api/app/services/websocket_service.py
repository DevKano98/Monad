from typing import Any

from app.core.redis import publish_event
from app.core.websocket import connection_manager


class WebSocketService:
    async def broadcast(self, event: str, payload: dict[str, Any]) -> None:
        message = {"event": event, "payload": payload}
        await connection_manager.broadcast(message)
        await publish_event("axiom.feed", message)
