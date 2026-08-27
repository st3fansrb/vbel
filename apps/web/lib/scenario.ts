import { counterSignPreviousEvent, signEnvelope, type IdentityResolver, type IssuerAttestation, type KeyPair } from "@vbel/core";
import { StaticIdentityRegistry } from "@vbel/adapter-identity-static";
import { createReadClient, EnsIdentityResolver } from "@vbel/adapter-ens";
import {
  buildAcceptanceEvent,
  buildCorrectionEvent,
  buildDispatchEvent,
  type AcceptancePayload,
  type DispatchPayload,
} from "@vbel/domain-delivery";
import { loadDemoKeys } from "./demoKeys";
import type { LedgerRecord } from "./types";

export const SUPPLIER_ID = "urn:vbel:org:supplier-a";
export const BUYER_ID = "urn:vbel:org:buyer-b";

/**
 * Fallback trust root: a registry we assemble ourselves and can show in
 * full, binding each issuerId to the actual key it signs with. Used only
 * when ENS_PARENT_NAME isn't configured yet — see adapter-identity-static.
 */
function buildStaticRegistry(supplierPublicKeyHex: string, buyerPublicKeyHex: string): StaticIdentityRegistry {
  const validFrom = new Date(Date.now() - 60_000).toISOString();
  const attestations: IssuerAttestation[] = [
    { issuerId: SUPPLIER_ID, publicKey: supplierPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
    { issuerId: BUYER_ID, publicKey: buyerPublicKeyHex, attestedBy: "urn:vbel:demo:registry", validFrom, validUntil: null, signature: null },
  ];
  return new StaticIdentityRegistry({ registryId: "urn:vbel:demo:registry", attestations });
}

/**
 * Trust root for this demo: each issuer's signing key is resolved live from
 * an ENS text record on Sepolia, not from a list we assemble ourselves.
 * Falls back to the static registry when ENS_PARENT_NAME isn't set yet
 * (e.g. local dev before the one-time `setup:demo-issuers` script has run)
 * so the rest of the app keeps working either way.
 */
function buildResolver(supplierPublicKeyHex: string, buyerPublicKeyHex: string): IdentityResolver {
  const rpcUrl = process.env.ENS_RPC_URL;
  const parentName = process.env.ENS_PARENT_NAME;
  const network = process.env.ENS_NETWORK === "mainnet" ? "mainnet" : "sepolia";

  if (!rpcUrl || !parentName) {
    return buildStaticRegistry(supplierPublicKeyHex, buyerPublicKeyHex);
  }

  const client = createReadClient({ rpcUrl, network });
  return new EnsIdentityResolver(client, parentName, `urn:vbel:ens:${parentName}`);
}

export interface Scenario {
  records: LedgerRecord[];
  resolver: IdentityResolver;
  /**
   * The buyer's key, kept only so a later correction can be issued by the
   * same identity the registry attests — not a fresh, unregistered one.
   */
  buyerKeys: KeyPair;
}

/**
 * Builds and signs the shipment in the browser, with fixed demo keys (see
 * demoKeys.ts) rather than a fresh keypair per load — the ENS resolver
 * checks against a pubkey text record set once, on-chain, so the signing
 * key has to stay put across reloads to keep matching it.
 */
export async function buildScenario(): Promise<Scenario> {
  const shipmentRef = `SHP-${Math.floor(Date.now() / 1000)}`;
  const { supplier, buyer } = await loadDemoKeys();
  const resolver = buildResolver(supplier.publicKeyHex, buyer.publicKeyHex);

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
