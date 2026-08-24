/**
 * Generates the wallet that will own the VBEL parent ENS name, writes it to
 * the shared .env (gitignored), and reports its balance.
 *
 * Re-running never replaces an existing key — an ENS name is owned by an
 * address, so losing the key means losing the name.
 *
 * On Sepolia the address is funded from a faucet. On mainnet you send real
 * ETH to it; if you would rather the name be owned by a wallet you already
 * control, set ENS_OWNER_PRIVATE_KEY yourself and skip this script.
 *
 * Run: pnpm --filter @vbel/adapter-ens init:owner
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { createPublicClient, formatEther, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const ENV_PATH = resolve(import.meta.dirname, "../../../.env");
const KEY_VAR = "ENS_OWNER_PRIVATE_KEY";

loadDotenv({ path: ENV_PATH });

function readExistingKey(): `0x${string}` | null {
  if (!existsSync(ENV_PATH)) return null;
  const line = readFileSync(ENV_PATH, "utf8")
    .split("\n")
    .find((l) => l.startsWith(`${KEY_VAR}=`));
  const value = line?.slice(KEY_VAR.length + 1).trim();
  return value && /^0x[0-9a-fA-F]{64}$/.test(value) ? (value as `0x${string}`) : null;
}

function persistKey(key: string): void {
  const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  const withoutKey = existing
    .split("\n")
    .filter((l) => !l.startsWith(`${KEY_VAR}=`))
    .join("\n")
    .replace(/\n+$/, "");
  writeFileSync(ENV_PATH, `${withoutKey ? `${withoutKey}\n` : ""}${KEY_VAR}=${key}\n`, { mode: 0o600 });
}

async function main() {
  const network = process.env.ENS_NETWORK === "mainnet" ? "mainnet" : "sepolia";
  const chain = network === "mainnet" ? mainnet : sepolia;
  const rpcUrl = process.env.ENS_RPC_URL ?? (network === "mainnet" ? undefined : "https://ethereum-sepolia-rpc.publicnode.com");

  const existing = readExistingKey();
  const privateKey = existing ?? generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  if (existing) {
    console.log(`reusing ENS owner from .env: ${account.address}`);
  } else {
    persistKey(privateKey);
    console.log(`generated ENS owner: ${account.address}`);
    console.log(`wrote ${KEY_VAR} to .env (gitignored)`);
  }

  const client = createPublicClient({ chain, transport: http(rpcUrl) });
  const balance = await client.getBalance({ address: account.address });
  console.log(`network: ${network}`);
  console.log(`balance: ${formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.log(`\nfund this address before registering a name:\n\n  ${account.address}\n`);
    if (network === "sepolia") {
      console.log("  Sepolia faucets (a phone browser is fine):");
      console.log("    https://www.alchemy.com/faucets/ethereum-sepolia");
      console.log("    https://sepolia-faucet.pk910.de   (proof-of-work, no signup)");
      console.log("\n  ~0.01 ETH is plenty for a registration plus records.");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
