import { diffPayloads, verifyEvent, verifyPayload } from "@vbel/core";
import type { LedgerRecord, RecordVerdict } from "./types";

/**
 * Runs entirely in the browser against the same @vbel/core the issuing API
 * uses. No server is consulted and no result is taken on trust — that is
 * the point of the verifier.
 */
export async function verifyRecord(record: LedgerRecord): Promise<RecordVerdict> {
  const signature = await verifyEvent(record.event);
  const payload = verifyPayload(record.storedPayload, record.event.envelope);

  return {
    signatureValid: signature.valid,
    signatureIssues: signature.issues,
    payloadValid: payload.valid,
    differences: payload.valid ? [] : diffPayloads(record.issuerPayload, record.storedPayload),
    counterSigned: record.event.counterSignature !== null,
  };
}

export async function verifyAll(records: LedgerRecord[]): Promise<Map<string, RecordVerdict>> {
  const entries = await Promise.all(
    records.map(async (record) => [record.event.envelope.eventId, await verifyRecord(record)] as const)
  );
  return new Map(entries);
}
