/**
 * One-off: anchor the VBEL pitch "claims of record" as an SPL Memo on devnet.
 *
 * The memo carries ONLY claims that hold up under checking. The point the
 * pitch makes is that a hash proves nothing was altered and says nothing
 * about what was left out — so this record is deliberately honest and
 * incomplete.
 *
 * Run: set -a && source .env && set +a && \
 *   pnpm --filter @vbel/adapter-solana exec tsx scripts/anchor-pitch-claims.ts
 */
import { loadSolanaConfig } from "@vbel/config";
import { hashCanonical } from "@vbel/core";
import { SolanaMemoAdapter } from "../src/memo-adapter.js";

const signedAt = new Date().toISOString();

const doc = {
  doc: "VBEL — claims of record",
  context: "ETH Belgrade x Superteam Balkan",
  signedAt,
  claims: [
    "Every event is signed and hash-linked.",
    "Change one record, everything downstream is flagged.",
    "Verification runs in your browser. No server vouches for it.",
    "The hash is anchored on Solana devnet, by SPL Memo.",
  ],
};

async function main() {
  const config = loadSolanaConfig();
  const adapter = new SolanaMemoAdapter(config);

  const h = hashCanonical(doc);
  console.log(`claims doc hash: ${h}`);
  console.log(`anchoring on ${adapter.network()} ...`);

  const receipt = await adapter.anchor(h, {
    doc: doc.doc,
    context: doc.context,
    signedAt,
    claims: doc.claims,
  });

  const result = await adapter.verify(receipt, h);

  console.log("\n=== RECEIPT ===");
  console.log(JSON.stringify(receipt, null, 2));
  console.log("\nexplorer:", `https://explorer.solana.com/tx/${receipt.reference}?cluster=devnet`);
  console.log("verify:", JSON.stringify(result));
  if (!result.valid) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
