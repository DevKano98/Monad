from fastapi import APIRouter

from app.api.v1 import blockchain, feed, fingerprints, fixes, health, incidents, ingest, map, premium, reputation

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(ingest.router, tags=["ingest"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(fingerprints.router, prefix="/fingerprints", tags=["fingerprints"])
api_router.include_router(fixes.router, prefix="/fixes", tags=["fixes"])
api_router.include_router(reputation.router, prefix="/reputation", tags=["reputation"])
api_router.include_router(feed.router, prefix="/feed", tags=["feed"])
api_router.include_router(map.router, prefix="/map", tags=["map"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])
api_router.include_router(premium.router, prefix="/premium", tags=["premium"])
