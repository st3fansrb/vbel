/**
 * Manual, read-only smoke test — no key needed, no cost, safe to run anytime.
 * Run: pnpm --filter @vbel/adapter-ens smoke:resolve -- <name.eth>
 */
import { loadEnsReadConfig } from "@vbel/config";
import { createReadClient } from "../src/client.js";
import { resolveIssuerRecords } from "../src/resolve.js";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error("usage: pnpm --filter @vbel/adapter-ens smoke:resolve -- <name.eth>");
    process.exit(1);
  }

  const client = createReadClient(loadEnsReadConfig());
  const records = await resolveIssuerRecords(client, name);
  console.log(records);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
