import type { AcceptancePayload } from "@vbel/domain-delivery";
import type { LedgerRecord } from "./types";

/**
 * Genuinely rewrites the stored document — the same thing a party holding
 * the system of record could do to their own copy. The signed event is left
 * untouched, so the edit is detectable rather than authoritative.
 *
 * This is deliberately not a "show an invalid state" toggle. If it were,
 * the demo would prove nothing.
 */
export function tamperAcceptance(record: LedgerRecord): LedgerRecord {
  const payload = record.storedPayload as AcceptancePayload;
  const line = payload.lines[0];
  if (!line) throw new Error("cannot tamper: acceptance has no lines");

  return {
    ...record,
    storedPayload: {
      ...payload,
      lines: [{ ...line, quantityAccepted: line.quantityDelivered, rejectionReason: null }],
    },
  };
}

export function restore(record: LedgerRecord): LedgerRecord {
  return { ...record, storedPayload: record.issuerPayload };
}
