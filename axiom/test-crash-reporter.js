const { createCrashReporter } = require("@axiom/crash-reporter");

async function run() {
  console.log("Initializing Crash Reporter...");
  const reporter = createCrashReporter({
    endpoint: "http://localhost:8000/v1/ingest",
    projectKey: "axiom_pk_demo",
    service: "demo-client-app",
    environment: "development",
    runtimeRegion: "eu-central-1"
  });

  console.log("Wiring runtime hooks...");
  reporter.installRuntimeHooks();

  console.log("Triggering a deliberate crash in 1 second...");
  setTimeout(() => {
    throw new Error("Simulated client-side database connection crash!");
  }, 1000);
}

run();
