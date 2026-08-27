/**
 * Fixed ed25519 keypairs for the two demo issuers, supplier-a and buyer-b.
 *
 * These are not secrets. They protect nothing of value — no funds, no
 * production identity, just a synthetic shipment on Sepolia/devnet — and
 * they are committed on purpose: the whole point of the ENS identity
 * resolver is that `supplier-a.<parent>.eth`'s oel.pubkey text record
 * matches the key this demo actually signs with. A key regenerated on every
 * page load could never stay in sync with a fact set once on-chain.
 */
import { keyPairFromPrivateHex, type KeyPair } from "@vbel/core";

const SUPPLIER_PRIVATE_KEY_HEX = "11f310221905e60cddc057d770fd7a0ad48d8929a1c9d797a9396d9907186272";
const BUYER_PRIVATE_KEY_HEX = "d3b98537c12cdd18db2d23703191ea2e83fed6260fa1e91b28e3d051066116da";

export async function loadDemoKeys(): Promise<{ supplier: KeyPair; buyer: KeyPair }> {
  const [supplier, buyer] = await Promise.all([
    keyPairFromPrivateHex(SUPPLIER_PRIVATE_KEY_HEX),
    keyPairFromPrivateHex(BUYER_PRIVATE_KEY_HEX),
  ]);
  return { supplier, buyer };
}
