import re
from hashlib import sha256

from app.schemas.ingest import CrashIngestRequest

HEX_RE = re.compile(r"0x[a-fA-F0-9]+")
UUID_RE = re.compile(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b")
NUMBER_RE = re.compile(r"\d+")
PATH_LINE_RE = re.compile(r":\d+:\d+")
WHITESPACE_RE = re.compile(r"\s+")


def normalize_crash(payload: CrashIngestRequest) -> str:
    stack_head = "\n".join((payload.stack or "").splitlines()[:8])
    raw = "|".join(
        [
            payload.error_type,
            payload.message,
            payload.language,
            payload.framework,
            stack_head,
        ]
    ).lower()
    raw = HEX_RE.sub("0xHEX", raw)
    raw = UUID_RE.sub("UUID", raw)
    raw = PATH_LINE_RE.sub(":LINE:COL", raw)
    raw = NUMBER_RE.sub("N", raw)
    return WHITESPACE_RE.sub(" ", raw).strip()


def fingerprint_hash(payload: CrashIngestRequest) -> str:
    digest = sha256(normalize_crash(payload).encode("utf-8")).hexdigest()
    return "0x" + digest
