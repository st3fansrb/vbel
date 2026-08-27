import { diffPayloads, verifyEvent, verifyPayload, type IdentityResolver } from "@vbel/core";
import type { LedgerRecord, RecordVerdict } from "./types";

/**
 * Runs entirely in the browser against the same @vbel/core the issuing API
 * uses. No server is consulted and no result is taken on trust — that is
 * the point of the verifier. The resolver is optional for the same reason:
 * verification degrades gracefully with no identity source, it doesn't fail.
 */
export async function verifyRecord(record: LedgerRecord, resolver?: IdentityResolver): Promise<RecordVerdict> {
  const signature = await verifyEvent(record.event, resolver);
  const payload = verifyPayload(record.storedPayload, record.event.envelope);

  return {
    signatureValid: signature.valid,
    signatureIssues: signature.issues,
    identityChecked: signature.identityChecked,
    payloadValid: payload.valid,
    differences: payload.valid ? [] : diffPayloads(record.issuerPayload, record.storedPayload),
    counterSigned: record.event.counterSignature !== null,
  };
}

export async function verifyAll(
  records: LedgerRecord[],
  resolver?: IdentityResolver
): Promise<Map<string, RecordVerdict>> {
  const entries = await Promise.all(
    records.map(async (record) => [record.event.envelope.eventId, await verifyRecord(record, resolver)] as const)
  );
  return new Map(entries);
}
