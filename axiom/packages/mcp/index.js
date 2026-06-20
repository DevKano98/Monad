import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { z } from "zod";

const DEFAULT_API_URL = "http://localhost:8000";

export function normalizeApiUrl(url = DEFAULT_API_URL) {
  return url.replace(/\/+$/, "").replace(/\/v1$/, "");
}

export function createAxiomMcpClient(options = {}) {
  const apiUrl = normalizeApiUrl(options.apiUrl ?? process.env.AXIOM_API_URL ?? DEFAULT_API_URL);
  const paymentHeader = options.paymentHeader ?? process.env.AXIOM_PAYMENT_HEADER;

  async function request(path, init = {}) {
    const response = await fetch(`${apiUrl}/v1${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(paymentHeader ? { "X-PAYMENT": paymentHeader } : {}),
        ...(init.headers ?? {}),
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async function fetchFeed() {
    return request("/feed");
  }

  async function fetchFixes() {
    return request("/fixes");
  }

  return {
    async search_failure(query) {
      const feed = await fetchFeed();
      const needle = query.toLowerCase();
      return feed.filter((item) => {
        return item.hash.toLowerCase().includes(needle) || item.error_type?.toLowerCase().includes(needle);
      });
    },
    async get_fixes(fingerprintHash) {
      const feed = await fetchFeed();
      const fingerprint = feed.find((item) => item.hash === fingerprintHash);
      if (!fingerprint) {
        return [];
      }
      const fixes = await fetchFixes();
      return fixes.filter((fix) => fix.fingerprint_id === fingerprint.id);
    },
    async submit_fix(input) {
      const feed = await fetchFeed();
      const fingerprint = feed.find((item) => item.hash === input.fingerprint_hash);
      if (!fingerprint) {
        throw new Error(`Fingerprint not found: ${input.fingerprint_hash}`);
      }
      return request("/fixes", {
        method: "POST",
        body: JSON.stringify({
          fingerprint_id: fingerprint.id,
          title: input.title,
          description: input.description,
        }),
      });
    },
    async vote_fix(input) {
      return request(`/fixes/${input.fix_id}/vote`, {
        method: "POST",
        body: JSON.stringify({ successful: input.successful }),
      });
    },
  };
}

export function registerAxiomTools(server, options = {}) {
  const client = createAxiomMcpClient(options);

  server.tool(
    "search_failure",
    "Search recent crash fingerprints by hash, error type, or message fragment.",
    { query: z.string().describe("The search term, such as 'Redis' or 'ConnectionTimeout'") },
    async ({ query }) => {
      const results = await client.search_failure(query);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  server.tool(
    "get_fixes",
    "Get proposed fixes for a crash fingerprint by fingerprint hash.",
    { fingerprint_hash: z.string().describe("The fingerprint hash returned by search_failure") },
    async ({ fingerprint_hash }) => {
      const results = await client.get_fixes(fingerprint_hash);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  server.tool(
    "submit_fix",
    "Submit a fix proposal for a crash fingerprint by fingerprint hash.",
    {
      fingerprint_hash: z.string().describe("The fingerprint hash returned by search_failure"),
      title: z.string().describe("A short title for the fix"),
      description: z.string().describe("Detailed description of the fix"),
    },
    async ({ fingerprint_hash, title, description }) => {
      const result = await client.submit_fix({ fingerprint_hash, title, description });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    "vote_fix",
    "Vote on a proposed fix.",
    {
      fix_id: z.string().describe("The UUID of the fix"),
      successful: z.boolean().describe("True to upvote, false to downvote"),
    },
    async ({ fix_id, successful }) => {
      const result = await client.vote_fix({ fix_id, successful });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  return server;
}

export function createAxiomMcpServer(options = {}) {
  const server = new McpServer({
    name: "axiom-mcp",
    version: "1.0.0",
  });
  return registerAxiomTools(server, options);
}

export async function startAxiomMcpHttpServer(options = {}) {
  const host = options.host ?? process.env.AXIOM_MCP_HOST ?? "0.0.0.0";
  const port = Number(options.port ?? process.env.AXIOM_MCP_PORT ?? process.env.PORT ?? 3333);
  const path = normalizePath(options.path ?? process.env.AXIOM_MCP_PATH ?? "/mcp");

  const httpServer = createServer(async (req, res) => {
    const requestUrl = req.url ? new URL(req.url, `http://${req.headers.host ?? host}`) : null;
    if (!requestUrl || requestUrl.pathname !== path) {
      if (requestUrl?.pathname === "/health") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "ok" }));
        return;
      }
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const body = await readRequestBody(req);
    // Create a fresh MCP transport/server per request so public HTTP clients
    // can open independent sessions without colliding on one in-memory session.
    const server = createAxiomMcpServer(options);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  });

  await new Promise((resolve) => {
    httpServer.listen(port, host, resolve);
  });

  return {
    httpServer,
    url: `http://${host}:${port}${path}`,
  };
}

export const tools = ["search_failure", "get_fixes", "submit_fix", "vote_fix"];

async function readRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return undefined;
  }

  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw.trim()) {
    return undefined;
  }

  return JSON.parse(raw);
}

function normalizePath(value) {
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return normalized.replace(/\/+$/, "") || "/";
}
