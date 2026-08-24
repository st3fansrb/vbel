import { createEnsPublicClient, createEnsWalletClient, type EnsPublicClient, type EnsWalletClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { EnsReadConfig, EnsWriteConfig } from "@vbel/config";

function chainFor(network: "mainnet" | "sepolia") {
  return network === "mainnet" ? mainnet : sepolia;
}

export function createReadClient(config: EnsReadConfig): EnsPublicClient {
  return createEnsPublicClient({ chain: chainFor(config.network), transport: http(config.rpcUrl) });
}

/** Holding this client means holding spend authority for config.ownerPrivateKey. */
export function createWriteClient(config: EnsWriteConfig): EnsWalletClient {
  const account = privateKeyToAccount(config.ownerPrivateKey);
  return createEnsWalletClient({ chain: chainFor(config.network), transport: http(config.rpcUrl), account });
}
