import { describe, expect, it } from "vitest";
import { compareDispatchToAcceptance } from "../src/discrepancy.js";
import type { AcceptancePayload, DispatchPayload } from "../src/schemas.js";

const dispatch: DispatchPayload = {
  shipmentRef: "SHP-4471",
  supplier: "Supplier A",
  buyer: "Buyer B",
  dispatchedAt: "2026-08-26T09:14:00Z",
  lines: [{ sku: "SKU-1", description: "Cases of goods", quantity: 1000, unit: "case" }],
};

describe("compareDispatchToAcceptance", () => {
  it("reports a clean match when everything sent was accepted", () => {
    const acceptance: AcceptancePayload = {
      shipmentRef: "SHP-4471",
      buyer: "Buyer B",
      receivedAt: "2026-08-26T14:02:00Z",
      lines: [{ sku: "SKU-1", quantityDelivered: 1000, quantityAccepted: 1000, rejectionReason: null }],
    };

    expect(compareDispatchToAcceptance(dispatch, acceptance).clean).toBe(true);
  });

  it("separates goods rejected at goods-in from goods lost in transit", () => {
    const acceptance: AcceptancePayload = {
      shipmentRef: "SHP-4471",
      buyer: "Buyer B",
      receivedAt: "2026-08-26T14:02:00Z",
      lines: [
        {
          sku: "SKU-1",
          quantityDelivered: 980,
          quantityAccepted: 940,
          rejectionReason: "40 cases damaged",
        },
      ],
    };

    const report = compareDispatchToAcceptance(dispatch, acceptance);
    const line = report.lines[0]!;

    expect(report.clean).toBe(false);
    expect(line.shortfallInTransit).toBe(20);
    expect(line.rejected).toBe(40);
    expect(line.rejectionReason).toBe("40 cases damaged");
  });

  it("flags a SKU that appears in only one of the two documents", () => {
    const acceptance: AcceptancePayload = {
      shipmentRef: "SHP-4471",
      buyer: "Buyer B",
      receivedAt: "2026-08-26T14:02:00Z",
      lines: [{ sku: "SKU-UNEXPECTED", quantityDelivered: 5, quantityAccepted: 5, rejectionReason: null }],
    };

    const report = compareDispatchToAcceptance(dispatch, acceptance);
    expect(report.clean).toBe(false);
    expect(report.unmatchedSkus).toEqual(["SKU-1", "SKU-UNEXPECTED"]);
  });
});
