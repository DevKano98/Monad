from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import conflict
from app.models.fingerprint import Fingerprint
from app.repositories.fingerprint_repository import FingerprintRepository
from app.schemas.fingerprint import FingerprintCreate
from app.services.blockchain_service import BlockchainService
from app.services.websocket_service import WebSocketService


class FingerprintService:
    def __init__(self, session: AsyncSession) -> None:
        self.repository = FingerprintRepository(session)
        self.blockchain = BlockchainService()
        self.websocket = WebSocketService()

    async def create_fingerprint(self, payload: FingerprintCreate) -> Fingerprint:
        existing = await self.repository.get_by_hash(payload.hash)
        if existing is not None:
            raise conflict("Fingerprint hash already exists")
        tx = await self.blockchain.publish_fingerprint(payload.model_dump())
        fingerprint = await self.repository.create(payload.model_dump() | {"monad_tx_hash": tx["tx_hash"]})
        await self.websocket.broadcast(
            "fingerprint.published",
            {
                "id": str(fingerprint.id),
                "fingerprint_hash": fingerprint.hash,
                "severity": fingerprint.severity,
                "tx_hash": fingerprint.monad_tx_hash,
            },
        )
        return fingerprint

    async def get_fingerprint(self, fingerprint_id: UUID) -> Fingerprint | None:
        return await self.repository.get(fingerprint_id)

    async def list_fingerprints(self, skip: int = 0, limit: int = 100) -> list[Fingerprint]:
        return await self.repository.list(skip, limit)
