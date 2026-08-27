import { describe, expect, it } from "vitest";
import { AcceptanceLineSchema, AcceptancePayloadSchema, DispatchPayloadSchema } from "../src/schemas.js";

describe("DispatchPayloadSchema", () => {
  it("requires at least one line", () => {
    expect(() =>
      DispatchPayloadSchema.parse({
        shipmentRef: "SHP-4471",
        supplier: "Supplier A",
        buyer: "Buyer B",
        dispatchedAt: "2026-08-26T09:14:00Z",
        lines: [],
      })
    ).toThrow();
  });

  it("rejects fractional quantities", () => {
    expect(() =>
      DispatchPayloadSchema.parse({
        shipmentRef: "SHP-4471",
        supplier: "Supplier A",
        buyer: "Buyer B",
        dispatchedAt: "2026-08-26T09:14:00Z",
        lines: [{ sku: "SKU-1", description: "Cases", quantity: 10.5, unit: "case" }],
      })
    ).toThrow();
  });
});

describe("AcceptanceLineSchema", () => {
  it("rejects accepting more than was delivered", () => {
    expect(() =>
      AcceptanceLineSchema.parse({ sku: "SKU-1", quantityDelivered: 940, quantityAccepted: 1000 })
    ).toThrow(/cannot exceed/);
  });

  it("requires a reason when the acceptance is short", () => {
    expect(() =>
      AcceptanceLineSchema.parse({ sku: "SKU-1", quantityDelivered: 1000, quantityAccepted: 940 })
    ).toThrow(/rejectionReason/);
  });

  it("allows a clean acceptance with no reason", () => {
    const line = AcceptanceLineSchema.parse({ sku: "SKU-1", quantityDelivered: 1000, quantityAccepted: 1000 });
    expect(line.rejectionReason).toBeNull();
  });
});

describe("AcceptancePayloadSchema", () => {
  it("accepts a short delivery carrying a reason", () => {
    const payload = AcceptancePayloadSchema.parse({
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
    });
    expect(payload.lines[0]?.quantityAccepted).toBe(940);
  });
});
