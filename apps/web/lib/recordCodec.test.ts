import { describe, expect, it } from "vitest";
import { counterSignPreviousEvent, generateKeyPair, signEnvelope } from "@vbel/core";
import {
  buildAcceptanceEvent,
  buildCorrectionEvent,
  buildDispatchEvent,
  type AcceptancePayload,
  type DispatchPayload,
} from "@vbel/domain-delivery";
import {
  ChainDecodeError,
  decodeChain,
  encodeChain,
  MAX_ENCODED_LENGTH,
} from "./recordCodec";
import type { LedgerRecord } from "./types";

async function buildRealistic3RecordChain(): Promise<LedgerRecord[]> {
  const supplier = await generateKeyPair();
  const buyer = await generateKeyPair();
  const SUPPLIER_ID = "urn:vbel:org:supplier-a";
  const BUYER_ID = "urn:vbel:org:buyer-b";
  const shipmentRef = "SHP-4471";

  // 1. Dispatch
  const dispatchPayload: DispatchPayload = {
    shipmentRef,
    supplier: "Supplier A",
    buyer: "Buyer B",
    dispatchedAt: "2026-08-26T09:14:00Z",
    lines: [{ sku: "SKU-1", description: "Cases of goods", quantity: 1000, unit: "case" }],
  };

  const dispatch = await signEnvelope({
    envelope: buildDispatchEvent({
      issuerId: SUPPLIER_ID,
      issuedAt: "2026-08-26T09:14:00Z",
      payload: dispatchPayload,
    }),
    signer: supplier,
    signerId: SUPPLIER_ID,
  });

  // 2. Acceptance
  const acceptancePayload: AcceptancePayload = {
    shipmentRef,
    buyer: "Buyer B",
    receivedAt: "2026-08-26T14:02:00Z",
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
      issuedAt: "2026-08-26T14:02:00Z",
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

  // 3. Correction
  const correctionPayload: AcceptancePayload = {
    ...acceptancePayload,
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
      issuedAt: "2026-08-28T08:30:00Z",
      payload: correctionPayload,
      previousEventHash: acceptance.eventHash,
      supersedes: acceptance.envelope.eventId,
      supersedeReason: "short shipment discovered after acceptance",
    }),
    signer: buyer,
    signerId: BUYER_ID,
  });

  return [
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
    {
      label: "Correction",
      event: correction,
      storedPayload: correctionPayload,
      issuerPayload: correctionPayload,
      anchor: null,
      chainVerification: null,
    },
  ];
}

async function encodeRawJsonGzipBase64Url(data: unknown): Promise<string> {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  const stream = new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(bytes as unknown as BufferSource);
      controller.close();
    },
  }).pipeThrough(new CompressionStream("gzip"));
  const buffer = await new Response(stream).arrayBuffer();
  const compressed = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

describe("recordCodec", () => {
  it("round-trip: a 3-record chain (dispatch, acceptance, correction) decodes deep-equal to the input", async () => {
    const chain = await buildRealistic3RecordChain();
    const encoded = await encodeChain(chain);
    const decoded = await decodeChain(encoded);

    expect(decoded).toEqual(chain);
  });

  it("a single flipped character in the encoded string throws ChainDecodeError rather than returning junk", async () => {
    const chain = await buildRealistic3RecordChain();
    const encoded = await encodeChain(chain);

    // Pick a character in the middle of the encoded string and flip it
    const targetIndex = Math.floor(encoded.length / 2);
    const originalChar = encoded[targetIndex]!;
    const flippedChar = originalChar === "A" ? "B" : "A";
    const tampered = encoded.slice(0, targetIndex) + flippedChar + encoded.slice(targetIndex + 1);

    await expect(decodeChain(tampered)).rejects.toBeInstanceOf(ChainDecodeError);
    await expect(decodeChain(tampered)).rejects.toThrow(ChainDecodeError);
  });

  it("valid JSON that violates a schema throws ChainDecodeError", async () => {
    // 1. Non-array JSON
    const notAnArrayEncoded = await encodeRawJsonGzipBase64Url({ not: "an array" });
    await expect(decodeChain(notAnArrayEncoded)).rejects.toThrow(ChainDecodeError);

    // 2. Record missing required fields or having invalid signed event
    const chain = await buildRealistic3RecordChain();
    const invalidEventRecord = [
      {
        ...chain[0]!,
        event: {
          ...chain[0]!.event,
          eventHash: "not-a-valid-sha256-hash-format",
        },
      },
    ];
    const invalidEventEncoded = await encodeRawJsonGzipBase64Url(invalidEventRecord);
    await expect(decodeChain(invalidEventEncoded)).rejects.toThrow(ChainDecodeError);

    // 3. Record with invalid storedPayload (e.g. quantityAccepted > quantityDelivered)
    const invalidPayloadRecord = [
      {
        ...chain[1]!,
        storedPayload: {
          ...chain[1]!.storedPayload,
          lines: [
            {
              sku: "SKU-1",
              quantityDelivered: 100,
              quantityAccepted: 150, // Invalid: exceeds quantityDelivered
              rejectionReason: null,
            },
          ],
        },
      },
    ];
    const invalidPayloadEncoded = await encodeRawJsonGzipBase64Url(invalidPayloadRecord);
    await expect(decodeChain(invalidPayloadEncoded)).rejects.toThrow(ChainDecodeError);

    // 4. Record with unrecognized schema
    const unknownSchemaRecord = [
      {
        ...chain[0]!,
        event: {
          ...chain[0]!.event,
          envelope: {
            ...chain[0]!.event.envelope,
            schema: "urn:vbel:event:unknown:v1",
          },
        },
      },
    ];
    const unknownSchemaEncoded = await encodeRawJsonGzipBase64Url(unknownSchemaRecord);
    await expect(decodeChain(unknownSchemaEncoded)).rejects.toThrow(ChainDecodeError);
  });

  it("a realistic 3-record chain encodes to under MAX_ENCODED_LENGTH characters", async () => {
    const chain = await buildRealistic3RecordChain();
    const encoded = await encodeChain(chain);

    expect(MAX_ENCODED_LENGTH).toBe(2000);
    expect(encoded.length).toBeLessThan(MAX_ENCODED_LENGTH);
    // Ensure it produces a URL-safe string with no '+' or '/' or '='
    expect(encoded).not.toMatch(/[+/=]/);
  });
});
