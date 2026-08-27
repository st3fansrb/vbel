import { getRecords, getResolver } from "@ensdomains/ensjs/public";
import type { EnsPublicClient } from "@ensdomains/ensjs";

/**
 * The VBEL text record vocabulary on an issuer's ENS name. `pubkey` is the
 * hex-encoded ed25519 public key the browser verifier resolves instead of
 * trusting a hard-coded value (TECHNICAL-BRIEF.md §7).
 */
export const OEL_TEXT_KEYS = ["oel.payload", "oel.anchor", "oel.status", "oel.pubkey"] as const;

export interface IssuerRecords {
  name: string;
  resolverAddress: string;
  payload: string | null;
  anchor: string | null;
  status: string | null;
  pubkey: string | null;
}

/** Read-only. Works with any EnsPublicClient — no private key involved. */
export async function resolveIssuerRecords(client: EnsPublicClient, name: string): Promise<IssuerRecords> {
  const parentName = name.includes(".") ? name.slice(name.indexOf(".") + 1) : name;
  let resolverAddress = await getResolver(client, { name }).catch(() => null);
  if (!resolverAddress && parentName !== name) {
    resolverAddress = await getResolver(client, { name: parentName }).catch(() => null);
  }

  const result = await getRecords(client, {
    name,
    texts: [...OEL_TEXT_KEYS],
    contentHash: false,
    abi: false,
    ...(resolverAddress ? { resolver: { address: resolverAddress, fallbackOnly: false } } : {}),
  });

  const byKey = new Map(result.texts.map((text) => [text.key, text.value]));

  return {
    name,
    resolverAddress: result.resolverAddress,
    payload: byKey.get("oel.payload") ?? null,
    anchor: byKey.get("oel.anchor") ?? null,
    status: byKey.get("oel.status") ?? null,
    pubkey: byKey.get("oel.pubkey") ?? null,
  };
}
