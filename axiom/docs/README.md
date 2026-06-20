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
- Set `AXIOM_API_URL` for `@axiom/mcp` so the tools point at the deployed backend origin.
- Run `@axiom/mcp` with `AXIOM_MCP_TRANSPORT=http` to expose the MCP server on `/mcp`.
- Keep the backend `FINGERPRINT_REGISTRY_ADDRESS` and `REPUTATION_REGISTRY_ADDRESS` in sync with the Monad testnet deployment outputs.

## Azure Deployment

- Use Azure App Service on Linux for the MCP server. Do not use Docker for this path.
- Deploy the `packages/mcp` folder as the app source, with `server.js` as the entrypoint and `npm start` as the startup command.
- Set `AXIOM_MCP_TRANSPORT=http`, `AXIOM_API_URL`, and `AXIOM_MCP_PATH=/mcp` in App Service settings.
- Let Azure provide `PORT`; the MCP server now reads `process.env.PORT` and exposes `/health` for App Service probes.
