/**
 * One-time setup for the two demo issuers: creates supplier-a.<parent> and
 * buyer-b.<parent> as subnames of the registered VBEL parent name, and sets
 * each one's oel.pubkey text record to the fixed demo keypair the web app
 * actually signs with (apps/web/lib/demoKeys.ts).
 *
 * The public keys below are copied from that file, not imported — apps/web
 * is not a dependency of this package, and these are public keys, safe to
 * duplicate. If demoKeys.ts ever regenerates the keypairs, update both.
 *
 * Requires ENS_PARENT_NAME to already be set (run register:parent first).
 *
 * Run: pnpm --filter @vbel/adapter-ens run setup:demo-issuers
 */
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { loadEnsWriteConfig } from "@vbel/config";
import { EnsIssuerRegistry } from "../src/manage.js";

loadDotenv({ path: resolve(import.meta.dirname, "../../../.env") });

const ISSUERS: { label: string; publicKeyHex: string }[] = [
  { label: "supplier-a", publicKeyHex: "a45342d60f80801611737630f23b345b61e6188a9d00ec2d30d54561677abd43" },
  { label: "buyer-b", publicKeyHex: "a093bba3c044d7035769f93fa8e8455731d60dca3b671e3338ccd6457ead0338" },
];

async function main() {
  const config = loadEnsWriteConfig();
  const registry = new EnsIssuerRegistry(config);

  console.log(`setting up demo issuers under ${config.parentName}\n`);

  for (const { label, publicKeyHex } of ISSUERS) {
    console.log(`${label}:`);
    const { name, txHash } = await registry.createSubjectSubname(label);
    console.log(`  created ${name} (tx ${txHash})`);

    const { txHash: recordsTx } = await registry.setOelRecords(name, { pubkey: publicKeyHex });
    console.log(`  set oel.pubkey (tx ${recordsTx})`);
  }

  console.log("\ndone — both issuers now resolve their signing key from ENS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
