/**
 * The stage demo, against a real chain.
 *
 * Runs the sequence from TECHNICAL-BRIEF.md §5 end to end: dispatch,
 * acceptance with a discrepancy, live tampering of the stored payload, and
 * a correction that supersedes without deleting. Every event is anchored on
 * Solana devnet and every explorer link printed is a real transaction.
 *
 * This is the composition root — the only place that knows about core, the
 * domain and the chain adapter at once.
 *
 * Run: pnpm --filter @vbel/demo-cli demo
 */
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import {
  counterSignPreviousEvent,
  diffPayloads,
  generateKeyPair,
  signEnvelope,
  validateChain,
  verifyEvent,
  verifyPayload,
  type SignedEvent,
} from "@vbel/core";
import { loadSolanaConfig } from "@vbel/config";
import { SolanaMemoAdapter } from "@vbel/adapter-solana";
import {
  buildAcceptanceEvent,
  buildCorrectionEvent,
  buildDispatchEvent,
  compareDispatchToAcceptance,
  type AcceptancePayload,
  type DispatchPayload,
} from "@vbel/domain-delivery";

loadDotenv({ path: resolve(import.meta.dirname, "../../../.env") });

const SHIPMENT_REF = `SHP-${Date.now()}`;
const SUPPLIER_ID = "urn:vbel:org:supplier-a";
const BUYER_ID = "urn:vbel:org:buyer-b";

function explorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

function step(n: number, title: string): void {
  console.log(`\n${"─".repeat(64)}\n${n}. ${title}\n`);
}

async function main() {
  const adapter = new SolanaMemoAdapter(loadSolanaConfig());
  const supplier = await generateKeyPair();
  const buyer = await generateKeyPair();

  console.log(`shipment ${SHIPMENT_REF} on ${adapter.network()}`);

  // ---------------------------------------------------------------- 1
  step(1, "Supplier dispatches 1,000 cases");

  const dispatchPayload: DispatchPayload = {
    shipmentRef: SHIPMENT_REF,
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

  const dispatchReceipt = await adapter.anchor(dispatch.eventHash, { ref: SHIPMENT_REF, type: "dispatch" });
  console.log(`   anchored ${dispatch.eventHash}`);
  console.log(`   ${explorerUrl(dispatchReceipt.reference)}`);

  // ---------------------------------------------------------------- 2
  step(2, "Buyer accepts 940 — 60 rejected at goods-in");

  const acceptancePayload: AcceptancePayload = {
    shipmentRef: SHIPMENT_REF,
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

  const acceptanceReceipt = await adapter.anchor(acceptance.eventHash, {
    ref: SHIPMENT_REF,
    type: "acceptance",
  });
  console.log(`   anchored ${acceptance.eventHash}`);
  console.log(`   counter-signed the dispatch it chains to`);
  console.log(`   ${explorerUrl(acceptanceReceipt.reference)}`);

  const report = compareDispatchToAcceptance(dispatchPayload, acceptancePayload);
  for (const line of report.lines) {
    console.log(`   ${line.sku}: sent ${line.quantityDispatched}, accepted ${line.quantityAccepted}, rejected ${line.rejected}`);
  }

  // ---------------------------------------------------------------- 3
  step(3, "Someone edits the stored payload back to 1,000");

  const tamperedPayload: AcceptancePayload = {
    ...acceptancePayload,
    lines: [{ ...acceptancePayload.lines[0]!, quantityAccepted: 1000, rejectionReason: null }],
  };

  const tamperCheck = verifyPayload(tamperedPayload, acceptance.envelope);
  console.log(`   payload verifies: ${tamperCheck.valid}`);
  for (const difference of diffPayloads(acceptancePayload, tamperedPayload)) {
    console.log(`   ${difference.path}: signed ${JSON.stringify(difference.expected)}, stored ${JSON.stringify(difference.actual)}`);
  }
  console.log(`   the signed record itself is untouched: ${(await verifyEvent(acceptance)).valid}`);

  // ---------------------------------------------------------------- 4
  step(4, "A correction supersedes the acceptance — nothing is deleted");

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
      issuerId: BUYER_ID,
      payload: correctedPayload,
      previousEventHash: acceptance.eventHash,
      supersedes: acceptance.envelope.eventId,
      supersedeReason: "short shipment discovered after acceptance",
    }),
    signer: buyer,
    signerId: BUYER_ID,
  });

  const correctionReceipt = await adapter.anchor(correction.eventHash, {
    ref: SHIPMENT_REF,
    type: "correction",
  });
  console.log(`   anchored ${correction.eventHash}`);
  console.log(`   ${explorerUrl(correctionReceipt.reference)}`);

  // ---------------------------------------------------------------- verify
  step(5, "Verify the whole chain, on chain");

  const events: SignedEvent[] = [dispatch, acceptance, correction];
  const chain = validateChain(events);
  console.log(`   chain structurally valid: ${chain.valid}`);

  for (const event of events) {
    const status = chain.derivedStatus.get(event.envelope.eventId);
    const signatures = await verifyEvent(event);
    console.log(`   ${event.envelope.schema.padEnd(42)} ${String(status).padEnd(11)} signatures ${signatures.valid}`);
  }

  const receipts = [dispatchReceipt, acceptanceReceipt, correctionReceipt];
  for (const [i, receipt] of receipts.entries()) {
    const result = await adapter.verify(receipt, events[i]!.eventHash);
    console.log(`   anchor ${i + 1} matches the chain: ${result.valid}`);
  }

  console.log("\nThe superseded record is still present, still verifies, and its\ncorrection names what it replaced. Nothing was deleted.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
