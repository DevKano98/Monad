from hashlib import sha256


def proof_hash(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()
