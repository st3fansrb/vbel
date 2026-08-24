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

/** Can sign transactions, but does not yet own any particular name. */
export interface EnsOwnerConfig extends EnsReadConfig {
  ownerPrivateKey: `0x${string}`;
}

/** Can sign, and owns the parent name that subnames hang beneath. */
export interface EnsWriteConfig extends EnsOwnerConfig {
  parentName: string;
}

/** Read-only ENS access: resolving names and text records. No key needed. */
export function loadEnsReadConfig(source: NodeJS.ProcessEnv = process.env): EnsReadConfig {
  const env = parseEnv(EnsEnvSchema, source, "ENS");
  return { rpcUrl: env.ENS_RPC_URL, network: env.ENS_NETWORK };
}

function requireEnv(env: EnsEnv, keys: (keyof EnsEnv)[]): void {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Invalid ENS configuration — required for this operation:\n${missing.map((k) => `  - ${k}`).join("\n")}`
    );
  }
}

/**
 * Signing authority without a name yet. This is what name *registration*
 * needs — requiring ENS_PARENT_NAME there would be circular, since
 * registration is what brings that name into existence.
 */
export function loadEnsOwnerConfig(source: NodeJS.ProcessEnv = process.env): EnsOwnerConfig {
  const env = parseEnv(EnsEnvSchema, source, "ENS");
  requireEnv(env, ["ENS_OWNER_PRIVATE_KEY"]);
  return {
    rpcUrl: env.ENS_RPC_URL,
    network: env.ENS_NETWORK,
    ownerPrivateKey: env.ENS_OWNER_PRIVATE_KEY! as `0x${string}`,
  };
}

/**
 * Signing authority over an existing parent name: creating subnames and
 * setting records beneath it. Obtaining this config is the point where
 * "this can spend funds" becomes true — gate it accordingly.
 */
export function loadEnsWriteConfig(source: NodeJS.ProcessEnv = process.env): EnsWriteConfig {
  const env = parseEnv(EnsEnvSchema, source, "ENS");
  requireEnv(env, ["ENS_PARENT_NAME", "ENS_OWNER_PRIVATE_KEY"]);
  return {
    ...loadEnsOwnerConfig(source),
    parentName: env.ENS_PARENT_NAME!,
  };
}
