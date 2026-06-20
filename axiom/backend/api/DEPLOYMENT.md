# Backend Deployment

This backend is a FastAPI app that expects:

- `DATABASE_URL`
- `REDIS_URL`
- `CELERY_BROKER_URL`
- `CELERY_RESULT_BACKEND`
- `MONAD_RPC_URL`
- `MONAD_CHAIN_ID`
- `PRIVATE_KEY`
- `FINGERPRINT_REGISTRY_ADDRESS`
- `REPUTATION_REGISTRY_ADDRESS`
- `X402_PAY_TO_ADDRESS`
- `CORS_ORIGINS`

## Local smoke test

```bash
cd backend/api
pip install -r requirements.txt
HOST=0.0.0.0 PORT=8000 sh start.sh
```

Then verify:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/v1/feed
curl http://127.0.0.1:8000/v1/map/crashes
```

## Docker deployment

Build and run the deployment stack from the repo root:

```bash
docker compose -f docker-compose.deploy.yml up --build
```

That starts:

- `postgres`
- `redis`
- `api`
- `mcp`

The backend listens on `http://localhost:8000` and the MCP server on `http://localhost:3333/mcp`.

Recommended environment values:

- `DATABASE_URL=postgresql+asyncpg://axiom:axiom@postgres:5432/axiom`
- `REDIS_URL=redis://redis:6379/0`
- `CELERY_BROKER_URL=redis://redis:6379/1`
- `CELERY_RESULT_BACKEND=redis://redis:6379/2`
- `MONAD_RPC_URL=https://testnet-rpc.monad.xyz`
- `MONAD_CHAIN_ID=10143`
- `PRIVATE_KEY`
- `FINGERPRINT_REGISTRY_ADDRESS`
- `REPUTATION_REGISTRY_ADDRESS`
- `X402_PAY_TO_ADDRESS`
- `CORS_ORIGINS=["*"]`

## Deploy order

1. Build and start the container stack.
2. Verify `/health`.
3. Verify `/v1/feed` and `/v1/map/crashes`.
4. Verify MCP at `/mcp`.
5. Point the frontend at the backend origin and set `AXIOM_API_URL` for external MCP clients if needed.

## Azure Container Apps

Recommended Azure layout:

- Azure Container Registry for images
- Azure Container Apps environment
- One Container App for `api`
- One Container App for `mcp`
- Azure Database for PostgreSQL flexible server
- Azure Cache for Redis or Azure Managed Redis

Target ports:

- `api`: `8000`
- `mcp`: `3333`

Deploy order:

1. Create the registry and managed data services.
2. Build and push the `backend/api` image and `packages/mcp` image to ACR.
3. Create the API container app with external ingress on port `8000`.
4. Create the MCP container app with external ingress on port `3333`.
5. Set the environment variables listed above.
6. Verify `https://<api-fqdn>/health`, `https://<api-fqdn>/v1/feed`, and `https://<mcp-fqdn>/mcp`.

Example image names:

- `axiom-api:latest`
- `axiom-mcp:latest`
