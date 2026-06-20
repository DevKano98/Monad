from collections.abc import Callable
from typing import Any


class EventListener:
    def __init__(self) -> None:
        self.handlers: dict[str, Callable[[dict[str, Any]], None]] = {}

    def on(self, event_name: str, handler: Callable[[dict[str, Any]], None]) -> None:
        self.handlers[event_name] = handler

    def handle(self, event_name: str, payload: dict[str, Any]) -> None:
        handler = self.handlers.get(event_name)
        if handler is not None:
            handler(payload)
