import { describe, expect, it } from "vitest";
import {
  counterSignPreviousEvent,
  diffPayloads,
  generateKeyPair,
  signEnvelope,
  validateChain,
  verifyEvent,
  verifyPayload,
} from "@vbel/core";
import { buildAcceptanceEvent, buildCorrectionEvent, buildDispatchEvent } from "../src/builders.js";
import { compareDispatchToAcceptance } from "../src/discrepancy.js";
import type { AcceptancePayload, DispatchPayload } from "../src/schemas.js";

/**
 * The demo sequence from TECHNICAL-BRIEF.md §5, executable. If this test
 * goes red the stage demo is broken, so it is the one to run before
 * presenting anything.
 */
describe("demo: dispatch -> acceptance -> tamper -> correction", () => {
  it("runs the whole sequence and ends with both records verifying", async () => {
    const supplier = await generateKeyPair();
    const buyer = await generateKeyPair();

    // 1. Supplier dispatches 1,000 cases.
    const dispatchPayload: DispatchPayload = {
      shipmentRef: "SHP-4471",
      supplier: "Supplier A",
      buyer: "Buyer B",
      dispatchedAt: "2026-08-26T09:14:00Z",
      lines: [{ sku: "SKU-1", description: "Cases of goods", quantity: 1000, unit: "case" }],
    };
    const dispatch = await signEnvelope({
      envelope: buildDispatchEvent({
        issuerId: "urn:vbel:org:supplier-a",
        issuedAt: "2026-08-26T09:14:00Z",
        payload: dispatchPayload,
      }),
      signer: supplier,
      signerId: "urn:vbel:org:supplier-a",
    });

    expect((await verifyEvent(dispatch)).valid).toBe(true);
    expect(verifyPayload(dispatchPayload, dispatch.envelope).valid).toBe(true);

    // 2. Buyer accepts 940, chained to the dispatch and counter-signing it.
    const acceptancePayload: AcceptancePayload = {
      shipmentRef: "SHP-4471",
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
        issuerId: "urn:vbel:org:buyer-b",
        issuedAt: "2026-08-26T14:02:00Z",
        payload: acceptancePayload,
        previousEventHash: dispatch.eventHash,
      }),
      signer: buyer,
      signerId: "urn:vbel:org:buyer-b",
    });
    acceptance = await counterSignPreviousEvent({
      signed: acceptance,
      counterSigner: buyer,
      signerId: "urn:vbel:org:buyer-b",
    });

    expect((await verifyEvent(acceptance)).valid).toBe(true);

    const report = compareDispatchToAcceptance(dispatchPayload, acceptancePayload);
    expect(report.clean).toBe(false);
    expect(report.lines[0]?.rejected).toBe(60);

    // 3. Someone edits the stored payload back to 1,000. The signed record
    //    is untouched, so the tampering is detectable and locatable.
    const tamperedPayload: AcceptancePayload = {
      ...acceptancePayload,
      lines: [{ ...acceptancePayload.lines[0]!, quantityAccepted: 1000, rejectionReason: null }],
    };

    const tamperCheck = verifyPayload(tamperedPayload, acceptance.envelope);
    expect(tamperCheck.valid).toBe(false);

    const differences = diffPayloads(acceptancePayload, tamperedPayload);
    expect(differences.map((d) => d.path)).toContain("$.lines[0].quantityAccepted");

    // The envelope itself still verifies — only the stored document lied.
    expect((await verifyEvent(acceptance)).valid).toBe(true);

    // 4. A correction supersedes the acceptance. Nothing is deleted.
    const correctedPayload: AcceptancePayload = {
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
        issuerId: "urn:vbel:org:buyer-b",
        issuedAt: "2026-08-28T08:30:00Z",
        payload: correctedPayload,
        previousEventHash: acceptance.eventHash,
        supersedes: acceptance.envelope.eventId,
        supersedeReason: "short shipment discovered after acceptance",
      }),
      signer: buyer,
      signerId: "urn:vbel:org:buyer-b",
    });

    const chain = validateChain([dispatch, acceptance, correction]);
    expect(chain.valid).toBe(true);
    expect(chain.derivedStatus.get(dispatch.envelope.eventId)).toBe("ACTIVE");
    expect(chain.derivedStatus.get(acceptance.envelope.eventId)).toBe("SUPERSEDED");
    expect(chain.derivedStatus.get(correction.envelope.eventId)).toBe("ACTIVE");

    // The superseded record is still present and still verifies — that is
    // the point: correction without deletion.
    for (const event of [dispatch, acceptance, correction]) {
      expect((await verifyEvent(event)).valid).toBe(true);
    }
  });
});
