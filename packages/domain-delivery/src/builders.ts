import { hashPayload, type Envelope } from "@vbel/core";
import {
  AcceptancePayloadSchema,
  DispatchPayloadSchema,
  SCHEMA_ACCEPTED,
  SCHEMA_DISPATCHED,
  type AcceptancePayload,
  type DispatchPayload,
} from "./schemas.js";

export const DEFAULT_POLICY_ID = "urn:vbel:policy:v1";

export function subjectIdForShipment(shipmentRef: string): string {
  return `urn:vbel:shipment:${shipmentRef}`;
}

interface CommonParams {
  issuerId: string;
  /** Defaults to now. Injectable so tests and fixtures are deterministic. */
  issuedAt?: string;
  policyId?: string;
}

function baseEnvelope(params: {
  schema: string;
  subjectId: string;
  payloadHash: string;
  previousEventHash: string | null;
  common: CommonParams;
}): Envelope {
  return {
    schema: params.schema,
    eventId: crypto.randomUUID(),
    subjectId: params.subjectId,
    issuerId: params.common.issuerId,
    issuedAt: params.common.issuedAt ?? new Date().toISOString(),
    previousEventHash: params.previousEventHash,
    payloadHash: params.payloadHash,
    status: "ACTIVE",
    supersedes: null,
    supersedeReason: null,
    revokes: null,
    revokeReason: null,
    policyId: params.common.policyId ?? DEFAULT_POLICY_ID,
    privacy: "off-chain",
    nonce: crypto.randomUUID(),
  };
}

/**
 * Builders validate the payload before hashing it. A payload that does not
 * satisfy its schema must never reach an envelope — once it is hashed and
 * signed the mistake is permanent, because nothing in this system is ever
 * edited in place.
 */
export function buildDispatchEvent(params: CommonParams & { payload: DispatchPayload }): Envelope {
  const payload = DispatchPayloadSchema.parse(params.payload);
  return baseEnvelope({
    schema: SCHEMA_DISPATCHED,
    subjectId: subjectIdForShipment(payload.shipmentRef),
    payloadHash: hashPayload(payload),
    previousEventHash: null,
    common: params,
  });
}

export function buildAcceptanceEvent(
  params: CommonParams & { payload: AcceptancePayload; previousEventHash: string }
): Envelope {
  const payload = AcceptancePayloadSchema.parse(params.payload);
  return baseEnvelope({
    schema: SCHEMA_ACCEPTED,
    subjectId: subjectIdForShipment(payload.shipmentRef),
    payloadHash: hashPayload(payload),
    previousEventHash: params.previousEventHash,
    common: params,
  });
}

/**
 * A correction is a new event, never an edit. The event it replaces stays in
 * the chain and keeps verifying — it is marked SUPERSEDED by derivation, not
 * by mutation (see core's lifecycle.ts).
 */
export function buildCorrectionEvent(
  params: CommonParams & {
    payload: AcceptancePayload;
    previousEventHash: string;
    supersedes: string;
    supersedeReason: string;
  }
): Envelope {
  const payload = AcceptancePayloadSchema.parse(params.payload);
  return {
    ...baseEnvelope({
      schema: SCHEMA_ACCEPTED,
      subjectId: subjectIdForShipment(payload.shipmentRef),
      payloadHash: hashPayload(payload),
      previousEventHash: params.previousEventHash,
      common: params,
    }),
    supersedes: params.supersedes,
    supersedeReason: params.supersedeReason,
  };
}
