import {
  addEnsContracts,
  createEnsPublicClient,
  createEnsWalletClient,
  type EnsPublicClient,
  type EnsWalletClient,
} from "@ensdomains/ensjs";
import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { EnsOwnerConfig, EnsReadConfig } from "@vbel/config";

/**
 * viem's bare chain objects carry almost no ENS addresses — sepolia ships
 * only multicall3 and the universal resolver. Every ensjs action that has
 * to reach a registrar, resolver or name wrapper reads those addresses off
 * the chain object, so without this the controller is simply undefined and
 * registration cannot work.
 */
function chainFor(network: "mainnet" | "sepolia") {
  return addEnsContracts(network === "mainnet" ? mainnet : sepolia);
}

/** ENS-specific reads: names, records, availability. Carries no generic chain actions. */
export function createReadClient(config: EnsReadConfig): EnsPublicClient {
  return createEnsPublicClient({ chain: chainFor(config.network), transport: http(config.rpcUrl) });
}

/**
 * Generic chain reads — balances, transaction receipts. Deliberately
 * separate from the ENS client, which only carries ENS actions.
 */
export function createChainClient(config: EnsReadConfig): PublicClient {
  return createPublicClient({ chain: chainFor(config.network), transport: http(config.rpcUrl) });
}

/**
 * Holding this client means holding spend authority for config.ownerPrivateKey.
 * Takes the owner-level config, not the write-level one — signing does not
 * require owning a parent name.
 */
export function createWriteClient(config: EnsOwnerConfig): EnsWalletClient {
  const account = privateKeyToAccount(config.ownerPrivateKey);
  return createEnsWalletClient({ chain: chainFor(config.network), transport: http(config.rpcUrl), account });
}
