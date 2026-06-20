const DEFAULT_ENDPOINT = "http://localhost:8000/v1/ingest";

export function createCrashReporter(options) {
  if (!options?.projectKey) {
    throw new Error("projectKey is required");
  }
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const basePayload = {
    project_key: options.projectKey,
    service: options.service,
    environment: options.environment,
    language: options.language ?? `node${process.versions.node.split(".")[0]}`,
    framework: options.framework ?? "node",
    runtime_region: options.runtimeRegion ?? process.env.AWS_REGION ?? process.env.VERCEL_REGION ?? process.env.FLY_REGION
  };

  async function report(error, overrides = {}) {
    const normalized = normalizeError(error);
    const payload = {
      ...basePayload,
      ...normalized,
      ...overrides
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });
    if (!response.ok) {
      throw new Error(`Axiom ingest failed with ${response.status}`);
    }
    return response.json();
  }

  function installRuntimeHooks() {
    process.on("uncaughtException", (error) => {
      void report(error).finally(() => {
        process.exitCode = 1;
      });
    });
    process.on("unhandledRejection", (reason) => {
      void report(reason instanceof Error ? reason : new Error(String(reason)));
    });
  }

  function expressErrorMiddleware() {
    return (error, _request, _response, next) => {
      void report(error, { framework: "express" });
      next(error);
    };
  }

  return { report, installRuntimeHooks, expressErrorMiddleware };
}

export async function reportCrash(options, error, overrides = {}) {
  return createCrashReporter(options).report(error, overrides);
}

function normalizeError(error) {
  if (error instanceof Error) {
    return {
      error_type: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack
    };
  }
  return {
    error_type: "NonErrorThrown",
    message: String(error),
    stack: undefined
  };
}
