import { counterSignPreviousEvent, generateKeyPair, signEnvelope } from "@vbel/core";
import {
  buildAcceptanceEvent,
  buildCorrectionEvent,
  buildDispatchEvent,
  type AcceptancePayload,
  type DispatchPayload,
} from "@vbel/domain-delivery";
import type { LedgerRecord } from "./types";

export const SUPPLIER_ID = "urn:vbel:org:supplier-a";
export const BUYER_ID = "urn:vbel:org:buyer-b";

/**
 * Builds and signs the shipment in the browser, with keys generated on load.
 * Nothing here is canned: the signatures are real ed25519 signatures over
 * real canonical bytes, so every verdict the UI shows was actually computed.
 */
export async function buildScenario(): Promise<LedgerRecord[]> {
  const shipmentRef = `SHP-${Math.floor(Date.now() / 1000)}`;
  const supplier = await generateKeyPair();
  const buyer = await generateKeyPair();

  const dispatchPayload: DispatchPayload = {
    shipmentRef,
    supplier: "Supplier A",
    buyer: "Buyer B",
    dispatchedAt: new Date().toISOString(),
    lines: [{ sku: "SKU-1", description: "Cases of goods", quantity: 1000, unit: "case" }],
  };

  const dispatch = await signEnvelope({
    envelope: buildDispatchEvent({ issuerId: SUPPLIER_ID, payload: dispatchPayload }),
    signer: supplier,
    signerId: SUPPLIER_ID,
  });

  const acceptancePayload: AcceptancePayload = {
    shipmentRef,
    buyer: "Buyer B",
    receivedAt: new Date().toISOString(),
    lines: [
      {
        sku: "SKU-1",
        quantityDelivered: 1000,
        quantityAccepted: 940,
        rejectionReason: "60 cases damaged in transit",
      },
    ],
  };

  let acceptance = await signEnvelope({
    envelope: buildAcceptanceEvent({
      issuerId: BUYER_ID,
      payload: acceptancePayload,
      previousEventHash: dispatch.eventHash,
    }),
    signer: buyer,
    signerId: BUYER_ID,
  });
  acceptance = await counterSignPreviousEvent({
    signed: acceptance,
    counterSigner: buyer,
    signerId: BUYER_ID,
  });

  return [
    {
      label: "Dispatch",
      event: dispatch,
      storedPayload: dispatchPayload,
      issuerPayload: dispatchPayload,
      anchor: null,
    },
    {
      label: "Acceptance",
      event: acceptance,
      storedPayload: acceptancePayload,
      issuerPayload: acceptancePayload,
      anchor: null,
    },
  ];
}

/**
 * The correction is issued on demand rather than seeded, so the audience
 * watches it happen. It supersedes the acceptance without deleting it.
 */
export async function buildCorrection(records: LedgerRecord[]): Promise<LedgerRecord> {
  const acceptance = records.find((record) => record.label === "Acceptance");
  if (!acceptance) throw new Error("cannot correct: no acceptance record present");

  const previous = acceptance.issuerPayload as AcceptancePayload;
  const correctedPayload: AcceptancePayload = {
    ...previous,
    lines: [
      {
        sku: "SKU-1",
        quantityDelivered: 1000,
        quantityAccepted: 900,
        rejectionReason: "further 40 cases short-shipped, found at store level",
      },
    ],
  };

  const buyer = await generateKeyPair();
  const correction = await signEnvelope({
    envelope: buildCorrectionEvent({
      issuerId: BUYER_ID,
      payload: correctedPayload,
      previousEventHash: acceptance.event.eventHash,
      supersedes: acceptance.event.envelope.eventId,
      supersedeReason: "short shipment discovered after acceptance",
    }),
    signer: buyer,
    signerId: BUYER_ID,
  });

  return {
    label: "Correction",
    event: correction,
    storedPayload: correctedPayload,
    issuerPayload: correctedPayload,
    anchor: null,
  };
}
