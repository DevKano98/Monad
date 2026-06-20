from hashlib import sha256


def generate_fingerprint(title: str, language: str, framework: str, dependency: str | None = None) -> str:
    raw = ":".join([title.lower().strip(), language.lower().strip(), framework.lower().strip(), dependency or ""])
    return sha256(raw.encode("utf-8")).hexdigest()
