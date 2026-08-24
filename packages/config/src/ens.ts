import { z } from "zod";
import { parseEnv } from "./load.js";

export const EnsEnvSchema = z.object({
  ENS_RPC_URL: z.string().url(),
  /** Defaults to the free testnet — mainnet write operations cost real ETH and must be opted into explicitly. */
  ENS_NETWORK: z.enum(["mainnet", "sepolia"]).default("sepolia"),
  /** Required only for write operations (createSubname / setRecords). */
  ENS_PARENT_NAME: z.string().min(1).optional(),
  /** Required only for write operations. Never committed — see .env.example. */
  ENS_OWNER_PRIVATE_KEY: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/)
    .optional(),
});
export type EnsEnv = z.infer<typeof EnsEnvSchema>;

export interface EnsReadConfig {
  rpcUrl: string;
  network: "mainnet" | "sepolia";
}

export interface EnsWriteConfig extends EnsReadConfig {
  parentName: string;
  ownerPrivateKey: `0x${string}`;
}

/** Read-only ENS access: resolving names and text records. No key needed. */
export function loadEnsReadConfig(source: NodeJS.ProcessEnv = process.env): EnsReadConfig {
  const env = parseEnv(EnsEnvSchema, source, "ENS");
  return { rpcUrl: env.ENS_RPC_URL, network: env.ENS_NETWORK };
}

/**
 * Write access: creating subnames and setting records. Requires an owner
 * key with authority over ENS_PARENT_NAME — calling code should treat
 * obtaining this config as the point where "this can spend funds" becomes
 * true, and gate it accordingly.
 */
export function loadEnsWriteConfig(source: NodeJS.ProcessEnv = process.env): EnsWriteConfig {
  const env = parseEnv(EnsEnvSchema, source, "ENS");
  const missing: string[] = [];
  if (!env.ENS_PARENT_NAME) missing.push("ENS_PARENT_NAME");
  if (!env.ENS_OWNER_PRIVATE_KEY) missing.push("ENS_OWNER_PRIVATE_KEY");
  if (missing.length > 0) {
    throw new Error(
      `Invalid ENS configuration — required for write operations:\n${missing.map((k) => `  - ${k}`).join("\n")}`
    );
  }
  return {
    rpcUrl: env.ENS_RPC_URL,
    network: env.ENS_NETWORK,
    parentName: env.ENS_PARENT_NAME!,
    ownerPrivateKey: env.ENS_OWNER_PRIVATE_KEY! as `0x${string}`,
  };
}
