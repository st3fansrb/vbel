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
import { formatEther, parseAbi } from "viem";
import { getResolver } from "@ensdomains/ensjs/public";
import { setResolver } from "@ensdomains/ensjs/wallet";
import { randomSecret } from "@ensdomains/ensjs/utils";
import { loadEnsOwnerConfig } from "@vbel/config";
import { createChainClient, createReadClient, createWriteClient } from "../src/client.js";

loadDotenv({ path: resolve(import.meta.dirname, "../../../.env") });

const DURATION_SECONDS = 365 * 24 * 60 * 60;
/** The registrar's minimum commitment age is 60s; a margin avoids a revert. */
const COMMITMENT_WAIT_MS = 75_000;

const controllerAbi = parseAbi([
  "function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) view returns (bytes32)",
  "function commit(bytes32 commitment)",
  "function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable",
  "function rentPrice(string name, uint256 duration) view returns ((uint256 base, uint256 premium))",
  "function available(string name) view returns (bool)"
]);

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

  const controllerAddress =
    config.network === "mainnet"
      ? (wallet.chain.contracts as any)?.ensEthRegistrarController?.address ?? "0x253553366Da8546fC250F225fe3d25d0C782303b"
      : (wallet.chain.contracts as any)?.wrappedEthRegistrarController?.address ?? "0x4477cAc137F3353Ca35060E01E5aEb777a1Ca01B";

  const defaultResolverAddress =
    config.network === "mainnet"
      ? (wallet.chain.contracts as any)?.ensPublicResolver?.address ?? "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
      : (wallet.chain.contracts as any)?.wrappedPublicResolver?.address ?? "0x8948458626811dd0c23EB25Cc74291247077cC51";

  const available = await chain.readContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "available",
    args: [label],
  });
  if (!available) {
    console.error(`${name} is already registered — choose another label`);
    process.exit(1);
  }

  const preCheckPrice = await chain.readContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "rentPrice",
    args: [label, BigInt(DURATION_SECONDS)],
  });
  const preCheckTotal = preCheckPrice.base + preCheckPrice.premium;
  if (balance < preCheckTotal) {
    console.error(`insufficient balance: need at least ~${formatEther(preCheckTotal)} ETH, have ${formatEther(balance)}`);
    process.exit(1);
  }
  console.log(`price: ~${formatEther(preCheckTotal)} ETH for 1 year (re-quoted right before registering)`);

  const secret = randomSecret();
  const commitment = await chain.readContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "makeCommitment",
    args: [label, owner, BigInt(DURATION_SECONDS), secret, defaultResolverAddress, [], false, 0],
  });

  console.log("\n1/2 committing...");
  const commitHash = await wallet.writeContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "commit",
    args: [commitment],
  });
  console.log(`   tx ${commitHash}`);
  await chain.waitForTransactionReceipt({ hash: commitHash });
  console.log("   committed");

  console.log(`\n   waiting ${COMMITMENT_WAIT_MS / 1000}s for the commitment to age...`);
  await sleep(COMMITMENT_WAIT_MS);

  const price = await chain.readContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "rentPrice",
    args: [label, BigInt(DURATION_SECONDS)],
  });
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
  const registerHash = await wallet.writeContract({
    address: controllerAddress,
    abi: controllerAbi,
    functionName: "register",
    args: [label, owner, BigInt(DURATION_SECONDS), secret, defaultResolverAddress, [], false, 0],
    value,
  });
  console.log(`   tx ${registerHash}`);
  const receipt = await chain.waitForTransactionReceipt({ hash: registerHash });
  console.log(`   registered in block ${receipt.blockNumber}`);

  const activeResolver = await getResolver(ens, { name });
  if (!activeResolver && defaultResolverAddress) {
    console.log(`\nsetting resolver on ${name}...`);
    const resHash = await setResolver(wallet, {
      name,
      contract: "nameWrapper",
      resolverAddress: defaultResolverAddress,
      account: wallet.account,
    });
    console.log(`   tx ${resHash}`);
    await chain.waitForTransactionReceipt({ hash: resHash });
    console.log(`   resolver set to ${defaultResolverAddress}`);
  }

  console.log(`\n${name} is now owned by ${owner}`);
  console.log(`add it to .env:\n\n  ENS_PARENT_NAME=${name}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
