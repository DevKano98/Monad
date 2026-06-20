import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface AxiomMcpOptions {
  apiUrl?: string;
  paymentHeader?: string;
  host?: string;
  port?: number;
  path?: string;
}

export interface SearchFailureInput {
  query: string;
}

export interface GetFixesInput {
  fingerprint_hash: string;
}

export interface SubmitFixInput {
  fingerprint_hash: string;
  title: string;
  description: string;
}

export interface VoteFixInput {
  fix_id: string;
  successful: boolean;
}

export interface AxiomMcpClient {
  search_failure(query: string): Promise<unknown[]>;
  get_fixes(fingerprintHash: string): Promise<unknown[]>;
  submit_fix(input: SubmitFixInput): Promise<unknown>;
  vote_fix(input: VoteFixInput): Promise<unknown>;
}

export interface AxiomMcpHttpServer {
  httpServer: unknown;
  transport: unknown;
  server: McpServer;
  url: string;
}

export function normalizeApiUrl(url?: string): string;
export function createAxiomMcpClient(options?: AxiomMcpOptions): AxiomMcpClient;
export function registerAxiomTools(server: McpServer, options?: AxiomMcpOptions): McpServer;
export function createAxiomMcpServer(options?: AxiomMcpOptions): McpServer;
export function startAxiomMcpHttpServer(options?: AxiomMcpOptions): Promise<AxiomMcpHttpServer>;
export const tools: string[];
