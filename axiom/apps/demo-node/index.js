const express = require('express');
const { createCrashReporter } = require('@axiom/crash-reporter');

const app = express();
const port = 3000;

const apiUrl = process.env.AXIOM_API_URL || "http://localhost:8000/v1/ingest";

console.log(`Initializing Crash Reporter targeting: ${apiUrl}`);
const reporter = createCrashReporter({
  endpoint: apiUrl,
  projectKey: "axiom_demo_project",
  service: "demo-node-app",
  environment: "staging",
  runtimeRegion: "us-east-1"
});

// 1. Install runtime hooks for uncaught exceptions outside of routes
reporter.installRuntimeHooks();

app.get('/', (req, res) => {
  res.send('Axiom Demo App is running. Go to /crash to test the Express error middleware.');
});

app.get('/crash', (req, res) => {
  console.log("Simulating a synchronous crash in an Express route...");
  throw new Error("Simulated Database Timeout Error from Express endpoint");
});

app.get('/crash-async', async (req, res) => {
  console.log("Simulating an unhandled promise rejection...");
  // This will trigger the global unhandledRejection hook 
  // if not caught by a middleware that wraps async routes.
  Promise.reject(new Error("Async unhandled promise rejection"));
  res.send("Check the logs for the unhandled rejection.");
});

// 2. Register the Axiom error middleware as the last middleware
app.use(reporter.expressErrorMiddleware());

app.listen(port, () => {
  console.log(`Demo app listening on port ${port}`);
});
