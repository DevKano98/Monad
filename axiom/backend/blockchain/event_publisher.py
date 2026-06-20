from typing import Any


class EventPublisher:
    def publish(self, event_name: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {"event": event_name, "payload": payload}
