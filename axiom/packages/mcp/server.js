#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createAxiomMcpServer, startAxiomMcpHttpServer } from "./index.js";

async function main() {
  const transportMode = process.env.AXIOM_MCP_TRANSPORT ?? "stdio";

  if (transportMode === "http") {
    const { url } = await startAxiomMcpHttpServer();
    console.error(`Axiom MCP Server listening on ${url}`);
    return;
  }

  const server = createAxiomMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Axiom MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
