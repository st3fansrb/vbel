import type { AcceptancePayload, DispatchPayload } from "./schemas.js";

/**
 * The dispute, expressed as data: what was sent versus what the receiving
 * party signed for. This is the number two companies argue about a week
 * later, which is the whole reason the record needs to be tamper-evident.
 */
export interface LineDiscrepancy {
  sku: string;
  quantityDispatched: number;
  quantityDelivered: number;
  quantityAccepted: number;
  /** Dispatched but never acknowledged as delivered — lost in transit, or never loaded. */
  shortfallInTransit: number;
  /** Delivered but refused at goods-in. */
  rejected: number;
  rejectionReason: string | null;
}

export interface DiscrepancyReport {
  shipmentRef: string;
  clean: boolean;
  lines: LineDiscrepancy[];
  /** SKUs present in one document but not the other — a structural mismatch, not a quantity one. */
  unmatchedSkus: string[];
}

export function compareDispatchToAcceptance(
  dispatch: DispatchPayload,
  acceptance: AcceptancePayload
): DiscrepancyReport {
  const acceptanceBySku = new Map(acceptance.lines.map((line) => [line.sku, line]));
  const dispatchSkus = new Set(dispatch.lines.map((line) => line.sku));

  const lines: LineDiscrepancy[] = [];
  const unmatchedSkus: string[] = [];

  for (const dispatchLine of dispatch.lines) {
    const acceptanceLine = acceptanceBySku.get(dispatchLine.sku);
    if (!acceptanceLine) {
      unmatchedSkus.push(dispatchLine.sku);
      continue;
    }

    lines.push({
      sku: dispatchLine.sku,
      quantityDispatched: dispatchLine.quantity,
      quantityDelivered: acceptanceLine.quantityDelivered,
      quantityAccepted: acceptanceLine.quantityAccepted,
      shortfallInTransit: dispatchLine.quantity - acceptanceLine.quantityDelivered,
      rejected: acceptanceLine.quantityDelivered - acceptanceLine.quantityAccepted,
      rejectionReason: acceptanceLine.rejectionReason,
    });
  }

  for (const acceptanceLine of acceptance.lines) {
    if (!dispatchSkus.has(acceptanceLine.sku)) unmatchedSkus.push(acceptanceLine.sku);
  }

  const clean =
    unmatchedSkus.length === 0 && lines.every((line) => line.shortfallInTransit === 0 && line.rejected === 0);

  return { shipmentRef: dispatch.shipmentRef, clean, lines, unmatchedSkus };
}
