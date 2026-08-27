/**
 * Registers the VBEL parent .eth name, end to end.
 *
 * ENS registration is deliberately two-phase to stop front-running: you
 * publish a commitment hash, wait out the minimum age, then reveal the name
 * in the register transaction. This script does both and waits in between.
 *
 * The secret that links the two phases is generated here and held only in
 * memory — if the process dies between commit and register, the commitment
 * is unusable and you simply start again (the commit fee is negligible).
 *
 * Run: pnpm --filter @vbel/adapter-ens register:parent -- <label>
 *   e.g. register:parent -- vbel-issuer      → registers vbel-issuer.eth
 */
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { formatEther } from "viem";
import { getPrice } from "@ensdomains/ensjs/public";
import { commitName, registerName } from "@ensdomains/ensjs/wallet";
import { randomSecret } from "@ensdomains/ensjs/utils";
import { loadEnsOwnerConfig } from "@vbel/config";
import { createChainClient, createReadClient, createWriteClient } from "../src/client.js";

loadDotenv({ path: resolve(import.meta.dirname, "../../../.env") });

const DURATION_SECONDS = 365 * 24 * 60 * 60;
/** The registrar's minimum commitment age is 60s; a margin avoids a revert. */
const COMMITMENT_WAIT_MS = 75_000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // `pnpm run register:parent -- <label>` forwards the literal "--" into
  // argv (Node does not strip it), so the label is whatever comes after it.
  const label = process.argv.slice(2).filter((arg) => arg !== "--")[0];
  if (!label) {
    console.error("usage: pnpm --filter @vbel/adapter-ens register:parent -- <label>");
    process.exit(1);
  }
  if (label.includes(".")) {
    console.error(`pass the bare label, not the full name — "${label.split(".")[0]}" rather than "${label}"`);
    process.exit(1);
  }
  if ([...label].length < 5) {
    console.error("use 5+ characters; shorter names cost dramatically more");
    process.exit(1);
  }

  const name = `${label}.eth`;
  const config = loadEnsOwnerConfig();
  const ens = createReadClient(config);
  const chain = createChainClient(config);
  const wallet = createWriteClient(config);
  const owner = wallet.account.address;

  console.log(`registering ${name} on ${config.network} for ${owner}`);

  if (config.network === "mainnet") {
    console.log("MAINNET — this spends real ETH.");
  }

  const balance = await chain.getBalance({ address: owner });
  if (balance === 0n) {
    console.error(`\n${owner} has no ETH — fund it first (pnpm --filter @vbel/adapter-ens init:owner)`);
    process.exit(1);
  }
  console.log(`balance: ${formatEther(balance)} ETH`);

  const available = await ens.getAvailable({ name });
  if (!available) {
    console.error(`${name} is already registered — choose another label`);
    process.exit(1);
  }

  // Price is quoted here only to fail fast on an obviously insufficient
  // balance. The registrar's price is USD-pegged via a live oracle, and the
  // mandatory wait below is long enough for it to drift — a quote taken now
  // and reused 75s later is exactly what caused a real revert during
  // testing. The value actually sent is re-quoted fresh right before
  // registering instead.
  const preCheckPrice = await getPrice(ens, { nameOrNames: name, duration: DURATION_SECONDS });
  const preCheckTotal = preCheckPrice.base + preCheckPrice.premium;
  if (balance < preCheckTotal) {
    console.error(`insufficient balance: need at least ~${formatEther(preCheckTotal)} ETH, have ${formatEther(balance)}`);
    process.exit(1);
  }
  console.log(`price: ~${formatEther(preCheckTotal)} ETH for 1 year (re-quoted right before registering)`);

  const params = { name, owner, duration: DURATION_SECONDS, secret: randomSecret() };

  console.log("\n1/2 committing...");
  const commitHash = await commitName(wallet, { ...params, account: wallet.account });
  console.log(`   tx ${commitHash}`);
  await chain.waitForTransactionReceipt({ hash: commitHash });
  console.log("   committed");

  console.log(`\n   waiting ${COMMITMENT_WAIT_MS / 1000}s for the commitment to age...`);
  await sleep(COMMITMENT_WAIT_MS);

  const price = await getPrice(ens, { nameOrNames: name, duration: DURATION_SECONDS });
  const total = price.base + price.premium;
  // 20% buffer on a quote taken right now, not 75s ago — the registrar
  // refunds whatever it does not need.
  const value = (total * 120n) / 100n;
  console.log(`\nfresh price: ${formatEther(total)} ETH (sending ${formatEther(value)} with buffer)`);
  if (balance < value) {
    console.error(`insufficient balance: need ~${formatEther(value)} ETH, have ${formatEther(balance)}`);
    process.exit(1);
  }

  console.log("\n2/2 registering...");
  const registerHash = await registerName(wallet, { ...params, value, account: wallet.account });
  console.log(`   tx ${registerHash}`);
  const receipt = await chain.waitForTransactionReceipt({ hash: registerHash });
  console.log(`   registered in block ${receipt.blockNumber}`);

  console.log(`\n${name} is now owned by ${owner}`);
  console.log(`add it to .env:\n\n  ENS_PARENT_NAME=${name}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
