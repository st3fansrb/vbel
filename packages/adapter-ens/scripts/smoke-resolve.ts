/**
 * Manual, read-only smoke test — no key needed, no cost, safe to run anytime.
 * Run: pnpm --filter @vbel/adapter-ens smoke:resolve -- <name.eth>
 */
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { loadEnsReadConfig } from "@vbel/config";
import { createReadClient } from "../src/client.js";
import { resolveIssuerRecords } from "../src/resolve.js";

loadDotenv({ path: resolve(import.meta.dirname, "../../../.env") });

async function main() {
  const name = process.argv.slice(2).filter((arg) => arg !== "--")[0];
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
