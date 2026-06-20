from sqlalchemy.ext.asyncio import AsyncSession
from starlette.datastructures import Headers

from app.core.config import settings
from app.models.crash_map import CrashMapPoint
from app.models.fingerprint import Fingerprint
from app.models.incident import Incident, Severity
from app.repositories.crash_map_repository import CrashMapRepository
from app.repositories.fingerprint_repository import FingerprintRepository
from app.repositories.fix_repository import FixRepository
from app.schemas.ingest import CrashIngestRequest, CrashIngestResponse, CrashLocation
from app.services.blockchain_service import BlockchainService
from app.services.crash_fingerprinting import fingerprint_hash
from app.services.location_service import DerivedLocation, derive_location
from app.services.websocket_service import WebSocketService


class CrashIngestService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.fingerprints = FingerprintRepository(session)
        self.fixes = FixRepository(session)
        self.map_points = CrashMapRepository(session)
        self.blockchain = BlockchainService()
        self.websocket = WebSocketService()

    async def ingest(self, payload: CrashIngestRequest, headers: Headers) -> CrashIngestResponse:
        if not settings.is_valid_project_key(payload.project_key):
            from fastapi import HTTPException, status

            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid project key")

        hash_value = fingerprint_hash(payload)
        existing = await self.fingerprints.get_by_hash(hash_value)
        if existing is None:
            return await self._publish_new(payload, headers, hash_value)
        return await self._report_match(payload, headers, existing)

    async def _publish_new(
        self,
        payload: CrashIngestRequest,
        headers: Headers,
        hash_value: str,
    ) -> CrashIngestResponse:
        severity = classify_severity(payload)
        location = derive_location(payload, headers, severity, 1)
        tx = await self.blockchain.publish_fingerprint(
            {
                "hash": hash_value,
                "language": payload.language,
                "framework": payload.framework,
                "severity": severity,
                "error_type": payload.error_type,
            }
        )

        incident = Incident(title=payload.error_type, description=safe_description(payload), severity=Severity(severity))
        self.session.add(incident)
        await self.session.flush()

        fingerprint = Fingerprint(
            incident_id=incident.id,
            hash=hash_value,
            error_type=payload.error_type,
            language=payload.language,
            framework=payload.framework,
            severity=severity,
            match_count=1,
            latitude=location.latitude,
            longitude=location.longitude,
            region=location.region,
            country=location.country,
            blast_radius=location.blast_radius,
            monad_tx_hash=tx["tx_hash"],
        )
        self.session.add(fingerprint)
        await self.session.flush()
        point = await self._upsert_map_point(fingerprint, location, tx["tx_hash"], known_fix_count=0)
        await self.session.commit()
        await self.session.refresh(fingerprint)

        await self.websocket.broadcast(
            "fingerprint.published",
            {"fingerprint_hash": hash_value, "tx_hash": tx["tx_hash"], "match_count": 1},
        )
        await self._broadcast_map_update(point)
        return CrashIngestResponse(
            status="new_failure",
            fingerprint_hash=hash_value,
            match_count=1,
            monad_tx_hash=tx["tx_hash"],
            location=to_location_schema(location),
            known_fixes=[],
        )

    async def _report_match(
        self,
        payload: CrashIngestRequest,
        headers: Headers,
        fingerprint: Fingerprint,
    ) -> CrashIngestResponse:
        next_count = fingerprint.match_count + 1
        location = derive_location(payload, headers, fingerprint.severity, next_count)
        tx = await self.blockchain.report_match(fingerprint.hash)

        fingerprint.match_count = next_count
        fingerprint.blast_radius = location.blast_radius
        if fingerprint.latitude is None and location.latitude is not None:
            fingerprint.latitude = location.latitude
            fingerprint.longitude = location.longitude
            fingerprint.region = location.region
            fingerprint.country = location.country
        fingerprint.monad_tx_hash = tx["tx_hash"]
        known_fixes = await self.fixes.list_for_fingerprint(fingerprint.id)
        point = await self._upsert_map_point(fingerprint, location, tx["tx_hash"], known_fix_count=len(known_fixes))
        await self.session.commit()
        await self.session.refresh(fingerprint)

        await self.websocket.broadcast(
            "fingerprint.matched",
            {"fingerprint_hash": fingerprint.hash, "tx_hash": tx["tx_hash"], "match_count": next_count},
        )
        await self._broadcast_map_update(point)
        return CrashIngestResponse(
            status="known_failure",
            fingerprint_hash=fingerprint.hash,
            match_count=next_count,
            monad_tx_hash=tx["tx_hash"],
            location=to_location_schema(location),
            known_fixes=known_fixes,
        )

    async def _upsert_map_point(
        self,
        fingerprint: Fingerprint,
        location: DerivedLocation,
        tx_hash: str,
        known_fix_count: int,
    ) -> CrashMapPoint:
        point = await self.map_points.find_point(
            fingerprint.hash,
            location.region,
            location.latitude,
            location.longitude,
        )
        if point is None:
            point = CrashMapPoint(
                fingerprint_id=fingerprint.id,
                fingerprint_hash=fingerprint.hash,
                error_type=fingerprint.error_type,
                severity=fingerprint.severity,
                match_count=1,
                known_fix_count=known_fix_count,
                latitude=location.latitude,
                longitude=location.longitude,
                region=location.region,
                country=location.country,
                blast_radius=location.blast_radius,
                monad_tx_hash=tx_hash,
            )
            self.session.add(point)
            await self.session.flush()
            return point

        point.match_count += 1
        point.known_fix_count = known_fix_count
        point.blast_radius = location.blast_radius
        point.monad_tx_hash = tx_hash
        await self.session.flush()
        return point

    async def _broadcast_map_update(self, point: CrashMapPoint) -> None:
        await self.websocket.broadcast(
            "crash.map.updated",
            {
                "id": str(point.id),
                "fingerprint_id": str(point.fingerprint_id),
                "fingerprint_hash": point.fingerprint_hash,
                "error_type": point.error_type,
                "severity": point.severity,
                "match_count": point.match_count,
                "known_fix_count": point.known_fix_count,
                "latitude": point.latitude,
                "longitude": point.longitude,
                "region": point.region,
                "country": point.country,
                "blast_radius": point.blast_radius,
                "monad_tx_hash": point.monad_tx_hash,
            },
        )


def classify_severity(payload: CrashIngestRequest) -> str:
    text = f"{payload.error_type} {payload.message}".lower()
    if any(token in text for token in ("panic", "fatal", "data loss", "corruption", "outage")):
        return "critical"
    if any(token in text for token in ("timeout", "unavailable", "connection", "failed")):
        return "high"
    if any(token in text for token in ("warning", "retry", "degraded")):
        return "medium"
    return "low"


def safe_description(payload: CrashIngestRequest) -> str:
    return f"{payload.error_type}: {payload.message[:500]}"


def to_location_schema(location: DerivedLocation) -> CrashLocation:
    return CrashLocation(
        latitude=location.latitude,
        longitude=location.longitude,
        region=location.region,
        country=location.country,
        blast_radius=location.blast_radius,
    )
