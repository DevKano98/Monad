from app.core.security import proof_hash


def test_proof_hash_is_stable() -> None:
    first = proof_hash("RedisConnectionTimeout:Node.js:Express")
    second = proof_hash("RedisConnectionTimeout:Node.js:Express")
    assert first == second
    assert len(first) == 64
