from backend.blockchain.fingerprint_registry import FingerprintRegistryClient
from backend.blockchain.reputation_registry import ReputationRegistryClient


def publish_fingerprint(hash_value: str, language: str, framework: str, severity: str) -> str:
    return FingerprintRegistryClient().publish_fingerprint(hash_value, language, framework, severity)


def update_reputation(wallet: str, score: int, successful_fixes: int, failed_fixes: int) -> str:
    return ReputationRegistryClient().update_reputation(wallet, score, successful_fixes, failed_fixes)
