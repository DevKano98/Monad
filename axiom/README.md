# Axiom

Axiom is a Monad-based failure-intelligence monorepo with three main surfaces:

- `apps/web`: the frontend dashboard and crash map
- `backend`: the FastAPI backend that handles ingest, feed, fixes, and websocket updates
- `packages/mcp`: the MCP server that exposes failure search and fix actions to agents

## Live deployment

- API: `https://axiom-api.icywater-403dd8c8.centralindia.azurecontainerapps.io`
- API health: `https://axiom-api.icywater-403dd8c8.centralindia.azurecontainerapps.io/health`
- MCP: `https://axiom-mcp.icywater-403dd8c8.centralindia.azurecontainerapps.io`
- MCP health: `https://axiom-mcp.icywater-403dd8c8.centralindia.azurecontainerapps.io/health`

## MCP tools

The deployed MCP server exposes these tools:

- `search_failure`
- `get_fixes`
- `submit_fix`
- `vote_fix`

Connect MCP clients to:

`https://axiom-mcp.icywater-403dd8c8.centralindia.azurecontainerapps.io/mcp`

## Local development

```bash
npm install
npm run dev:web
```

Backend and database services are configured separately in the repo. For deployment-oriented setup, see [`docs/README.md`](docs/README.md).

## Frontend environment

Use these values for the web app:

```bash
VITE_API_URL=https://axiom-api.icywater-403dd8c8.centralindia.azurecontainerapps.io
VITE_SHOW_MOCK_DATA=true
```

## Repository layout

- `apps/web` - Vite frontend
- `backend` - Python API and workers
- `contracts` - Monad smart contracts
- `database` - SQL schema and migrations
- `packages` - shared libraries, crash reporter, and MCP server

