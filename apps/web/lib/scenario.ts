import { counterSignPreviousEvent, generateKeyPair, signEnvelope, type IssuerAttestation, type KeyPair } from "@vbel/core";
import { StaticIdentityRegistry } from "@vbel/adapter-identity-static";
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
 * Trust root for this demo: a registry we assemble ourselves and can show
 * in full, binding each issuerId to the actual key it signs with in this
 * session. See adapter-identity-static — this is the honest placeholder
 * for ENS, did:web or an eIDAS chain, not a stand-in for having solved
 * identity.
 */
function buildRegistry(supplierPublicKeyHex: string, buyerPublicKeyHex: string): StaticIdentityRegistry {
  const validFrom = new Date(Date.now() - 60_000).toISOString();
  const attestations: IssuerAttestation[] = [
    { issuerId: SUPPLIER_ID, publicKey: supplierPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
    { issuerId: BUYER_ID, publicKey: buyerPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
  ];
  return new StaticIdentityRegistry({ registryId: "urn:vbel:demo:registry", attestations });
}

export interface Scenario {
  records: LedgerRecord[];
  resolver: StaticIdentityRegistry;
  /**
   * The buyer's key, kept only so a later correction can be issued by the
   * same identity the registry attests — not a fresh, unregistered one.
   */
  buyerKeys: KeyPair;
}

/**
 * Builds and signs the shipment in the browser, with keys generated on load.
 * Nothing here is canned: the signatures are real ed25519 signatures over
 * real canonical bytes, so every verdict the UI shows was actually computed.
 */
export async function buildScenario(): Promise<Scenario> {
  const shipmentRef = `SHP-${Math.floor(Date.now() / 1000)}`;
  const supplier = await generateKeyPair();
  const buyer = await generateKeyPair();
  const resolver = buildRegistry(supplier.publicKeyHex, buyer.publicKeyHex);

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

  return {
    records: [
      {
        label: "Dispatch",
        event: dispatch,
        storedPayload: dispatchPayload,
        issuerPayload: dispatchPayload,
        anchor: null,
        chainVerification: null,
      },
      {
        label: "Acceptance",
        event: acceptance,
        storedPayload: acceptancePayload,
        issuerPayload: acceptancePayload,
        anchor: null,
        chainVerification: null,
      },
    ],
    resolver,
    buyerKeys: buyer,
  };
}

/**
 * The correction is issued on demand rather than seeded, so the audience
 * watches it happen. It supersedes the acceptance without deleting it.
 */
export async function buildCorrection(records: LedgerRecord[], buyerKeys: KeyPair): Promise<LedgerRecord> {
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

  const correction = await signEnvelope({
    envelope: buildCorrectionEvent({
      issuerId: BUYER_ID,
      payload: correctedPayload,
      previousEventHash: acceptance.event.eventHash,
      supersedes: acceptance.event.envelope.eventId,
      supersedeReason: "short shipment discovered after acceptance",
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
