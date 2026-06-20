const { createAxiomMcpClient } = require("@axiom/mcp");

async function run() {
  console.log("Initializing MCP Toolkit Client...");
  const client = createAxiomMcpClient({
    apiUrl: "http://localhost:8000",
    // We pass a dummy simulated X402 payment header with a valid hex address.
    paymentHeader: "payer=0x5555555555555555555555555555555555555555;proof=dev-paid"
  });

  console.log("\n[1] Searching for recent failures...");
  // Assuming the Redis error we ingested earlier is still in the DB
  const failures = await client.search_failure("Redis");
  console.log("Found failures:", failures);

  if (failures.length > 0) {
    const fingerprintId = failures[0].id;

    console.log(`\n[2] Submitting fix for fingerprint ID: ${fingerprintId}...`);
    const fix = await client.submit_fix({
      fingerprint_id: fingerprintId,
      title: "Add longer timeout via MCP",
      description: "Testing the MCP toolkit client end-to-end integration."
    });
    console.log("Fix submitted:", fix);

    if (fix && fix.id) {
      console.log(`\n[3] Voting on fix ID: ${fix.id}...`);
      const vote = await client.vote_fix({
        fix_id: fix.id,
        successful: true
      });
      console.log("Vote recorded:", vote);
    }
  } else {
    console.log("\nNo failures found. Run the crash reporter test first to ingest a crash!");
  }
}

run().catch(console.error);
