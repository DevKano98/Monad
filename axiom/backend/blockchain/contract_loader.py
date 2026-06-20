import json
from pathlib import Path
from typing import Any


def load_abi(name: str) -> list[dict[str, Any]]:
    path = Path(__file__).parent / "abi" / f"{name}.json"
    return json.loads(path.read_text(encoding="utf-8"))["abi"]
