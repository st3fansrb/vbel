/**
 * Manual smoke test that WRITES on-chain: creates a subname and sets
 * oel.* text records. Not part of `pnpm test`. Defaults to Sepolia (free
 * testnet ETH via faucet) — only spends real ETH if ENS_NETWORK=mainnet is
 * set explicitly. Needs ENS_PARENT_NAME already registered and owned by
 * ENS_OWNER_PRIVATE_KEY.
 *
 * Run: pnpm --filter @vbel/adapter-ens smoke:manage -- <label>
 */
import { loadEnsWriteConfig } from "@vbel/config";
import { EnsIssuerRegistry } from "../src/manage.js";

async function main() {
  const label = process.argv[2];
  if (!label) {
    console.error("usage: pnpm --filter @vbel/adapter-ens smoke:manage -- <label>");
    process.exit(1);
  }

  const config = loadEnsWriteConfig();
  if (config.network === "mainnet") {
    console.warn("ENS_NETWORK=mainnet — this transaction will spend real ETH.");
  }

  const registry = new EnsIssuerRegistry(config);

  const { name, txHash: createTxHash } = await registry.createSubjectSubname(label);
  console.log(`created ${name} — tx ${createTxHash}`);

  const { txHash: recordsTxHash } = await registry.setOelRecords(name, {
    status: "ACTIVE",
    pubkey: "smoke-test-placeholder",
  });
  console.log(`set records on ${name} — tx ${recordsTxHash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
