import type { AnchorReceipt, LedgerVerificationResult } from "@vbel/core";
import type { LedgerRecord } from "./types";

export type Chain = "solana" | "ethereum";

/**
 * Anchors one record's hash on the given chain, then immediately re-fetches
 * the anchor transaction and confirms it still carries this hash. The two
 * calls are deliberately separate: the first only proves a transaction was
 * submitted, the second proves the chain itself agrees with what was
 * submitted — see the /api/verify route.
 *
 * Anchoring is a platform action, not a per-company one: it runs against
 * whichever issuer key the deployed server holds, the same as every other
 * anchor request. It attests "this hash existed at this time on this
 * chain" — it says nothing about which company signed the underlying
 * business event, that is what the envelope's own signature carries.
 */
export async function anchorRecord(
  record: LedgerRecord,
  chain: Chain
): Promise<{ anchor: AnchorReceipt; chainVerification: LedgerVerificationResult | null }> {
  const response = await fetch("/api/anchor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      eventHash: record.event.eventHash,
      chain,
      metadata: { ref: record.event.envelope.subjectId, type: record.label.toLowerCase() },
    }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.detail ?? body.error ?? "anchoring failed");
  const anchor = body as AnchorReceipt;

  let chainVerification: LedgerVerificationResult | null = null;
  try {
    const verifyResponse = await fetch("/api/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventHash: record.event.eventHash, receipt: anchor, chain }),
    });
    if (verifyResponse.ok) chainVerification = (await verifyResponse.json()) as LedgerVerificationResult;
  } catch {
    // The anchor itself succeeded; a failed re-check just leaves
    // chainVerification null rather than failing the whole operation.
  }

  return { anchor, chainVerification };
}
