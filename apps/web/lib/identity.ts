import { StaticIdentityRegistry } from "@vbel/adapter-identity-static";
import { createReadClient, EnsIdentityResolver } from "@vbel/adapter-ens";
import type { IdentityResolver, IssuerAttestation } from "@vbel/core";
import { loadDemoKeys } from "./demoKeys";

export const SUPPLIER_ID = "urn:vbel:org:supplier-a";
export const BUYER_ID = "urn:vbel:org:buyer-b";

/**
 * Fallback trust root: a registry assembled from the two fixed demo keys
 * (see demoKeys.ts), binding each issuerId to the actual key it signs
 * with. Both the supplier and buyer devices build this independently and
 * identically — nobody has to fetch it from a server, which is the same
 * "verify without trusting us" property the rest of the app claims.
 */
function buildStaticRegistry(supplierPublicKeyHex: string, buyerPublicKeyHex: string): StaticIdentityRegistry {
  const validFrom = new Date(Date.now() - 60_000).toISOString();
  const attestations: IssuerAttestation[] = [
    { issuerId: SUPPLIER_ID, publicKey: supplierPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
    { issuerId: BUYER_ID, publicKey: buyerPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
  ];
  return new StaticIdentityRegistry({ registryId: "urn:vbel:demo:registry", attestations });
}

/**
 * Trust root for this app: resolves each issuer's signing key live from an
 * ENS text record on Sepolia when ENS_PARENT_NAME is configured, falling
 * back to the static registry otherwise. Not active in this deployment —
 * ENSv2 landed on Sepolia in July 2026, the ensjs version this app depends
 * on cannot register a name against it, and Sepolia ENS state is reset
 * periodically, which is not a foundation for a live demo. The resolver
 * itself is written and tested; wiring it in is one env var away.
 */
function buildResolver(supplierPublicKeyHex: string, buyerPublicKeyHex: string): IdentityResolver {
  const rpcUrl = process.env.ENS_RPC_URL;
  const parentName = process.env.ENS_PARENT_NAME;
  const network = process.env.ENS_NETWORK === "mainnet" ? "mainnet" : "sepolia";

  if (!rpcUrl || !parentName) {
    return buildStaticRegistry(supplierPublicKeyHex, buyerPublicKeyHex);
  }

  const client = createReadClient({ rpcUrl, network });
  return new EnsIdentityResolver(client, parentName, `urn:vbel:ens:${parentName}`);
}

let cached: Promise<IdentityResolver> | null = null;

/**
 * The identity trust root, shared by every console on this device. Cached
 * per page load — the demo keys and ENS configuration never change during
 * a session, so there is nothing to gain from rebuilding it per call.
 */
export function getIdentityResolver(): Promise<IdentityResolver> {
  if (!cached) {
    cached = loadDemoKeys().then(({ supplier, buyer }) => buildResolver(supplier.publicKeyHex, buyer.publicKeyHex));
  }
  return cached;
}
