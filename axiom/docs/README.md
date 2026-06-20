# Axiom

Axiom is a full-stack Monad application with two product features: a global failure intelligence feed and a verified fix reputation system.

## Run Locally

```bash
cp .env.example .env
docker compose up
```

## Backend

```bash
cd backend/api
pip install -r requirements.txt
python -m pytest
uvicorn app.main:app --reload
```

## Frontend

```bash
npm install
npm run dev:web
```

## Contracts

```bash
cd contracts
npm install
npm run compile
npm run deploy -- --network monadTestnet
```

## Deployment Notes

- Set `VITE_API_URL` to the backend origin. The frontend app appends `/v1` internally.
- Set `VITE_SHOW_MOCK_DATA=true` if you want the UI to render bundled demo data whenever the backend feed is empty or temporarily unreachable.
- Set `AXIOM_API_URL` for `@axiom/mcp` so the tools point at the deployed backend origin.
- Run `@axiom/mcp` with `AXIOM_MCP_TRANSPORT=http` to expose the MCP server on `/mcp`.
- Keep the backend `FINGERPRINT_REGISTRY_ADDRESS` and `REPUTATION_REGISTRY_ADDRESS` in sync with the Monad testnet deployment outputs.

## Vercel frontend env

Use these values in Vercel for the web app:

- `VITE_API_URL=https://axiom-api.icywater-403dd8c8.centralindia.azurecontainerapps.io`
- `VITE_SHOW_MOCK_DATA=true`

The frontend env vars are public build-time values, not secrets. Use Azure app settings for backend secrets instead.

## Docker Deployment

- Use `docker-compose.deploy.yml` from the repo root to run Postgres, Redis, the backend API, and the MCP server together.
- The backend image is built from `backend/api/Dockerfile`.
- The MCP image is built from `packages/mcp/Dockerfile`.
- Backend health is available at `/health`; MCP is exposed at `/mcp`.

## Azure Deployment

- Use Azure Container Apps for `api` and `mcp`.
- Push images to Azure Container Registry.
- Use Azure Database for PostgreSQL flexible server for persistence and Azure Cache for Redis or Azure Managed Redis for coordination.
- Configure ingress target ports to match the container ports: `8000` for API, `3333` for MCP.
- Set `AXIOM_API_URL` in MCP to the API app's FQDN, and set the backend env vars from `backend/api/DEPLOYMENT.md`.
