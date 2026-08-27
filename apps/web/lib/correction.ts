import { buildCorrectionEvent, type AcceptanceLine, type AcceptancePayload } from "@vbel/domain-delivery";
import { signEnvelope, type KeyPair } from "@vbel/core";
import { BUYER_ID } from "./identity";
import type { LedgerRecord } from "./types";

/**
 * A correction is a new signed event, never an edit of the acceptance it
 * disputes — that record stays in the chain and keeps verifying; it is
 * marked SUPERSEDED by derivation (see core's lifecycle.ts), not by
 * mutation. `lines` and `reason` come from whoever is issuing the
 * correction, typed on their own device — nothing here is canned.
 */
export async function buildCorrection(params: {
  records: LedgerRecord[];
  buyerKeys: KeyPair;
  lines: AcceptanceLine[];
  reason: string;
}): Promise<LedgerRecord> {
  const { records, buyerKeys, lines, reason } = params;
  const acceptance = records.find((record) => record.label === "Acceptance");
  if (!acceptance) throw new Error("cannot correct: no acceptance record present");

  const previous = acceptance.issuerPayload as AcceptancePayload;
  const correctedPayload: AcceptancePayload = {
    ...previous,
    receivedAt: new Date().toISOString(),
    lines,
  };

  const correction = await signEnvelope({
    envelope: buildCorrectionEvent({
      issuerId: BUYER_ID,
      payload: correctedPayload,
      previousEventHash: acceptance.event.eventHash,
      supersedes: acceptance.event.envelope.eventId,
      supersedeReason: reason,
    }),
    signer: buyerKeys,
    signerId: BUYER_ID,
  });

  return {
    label: "Correction",
    event: correction,
    storedPayload: correctedPayload,
    issuerPayload: correctedPayload,
    anchor: null,
    chainVerification: null,
  };
}
