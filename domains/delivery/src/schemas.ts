import { z } from "zod";

/**
 * Business payloads for the delivery domain. These are the off-chain
 * documents: only their hash ever reaches a chain (TECHNICAL-BRIEF.md §4.1).
 *
 * Quantities are plain integers deliberately — they are counts of physical
 * goods, comfortably inside the safe-integer range that core's
 * canonicalizer permits. Money is not modelled here at all; the moment it
 * is, it must be minor units as a string, never a float.
 */

export const SCHEMA_DISPATCHED = "urn:vbel:event:delivery-dispatched:v1";
export const SCHEMA_ACCEPTED = "urn:vbel:event:delivery-accepted:v1";

const quantity = z.number().int().nonnegative();

export const DispatchLineSchema = z.object({
  sku: z.string().min(1),
  description: z.string().min(1),
  quantity,
  unit: z.string().min(1),
});
export type DispatchLine = z.infer<typeof DispatchLineSchema>;

export const DispatchPayloadSchema = z.object({
  shipmentRef: z.string().min(1),
  supplier: z.string().min(1),
  buyer: z.string().min(1),
  dispatchedAt: z.string().datetime({ offset: true }),
  lines: z.array(DispatchLineSchema).min(1),
});
export type DispatchPayload = z.infer<typeof DispatchPayloadSchema>;

export const AcceptanceLineSchema = z
  .object({
    sku: z.string().min(1),
    quantityDelivered: quantity,
    quantityAccepted: quantity,
    rejectionReason: z.string().min(1).nullable().default(null),
  })
  .refine((line) => line.quantityAccepted <= line.quantityDelivered, {
    message: "quantityAccepted cannot exceed quantityDelivered",
  })
  .refine((line) => line.quantityAccepted === line.quantityDelivered || line.rejectionReason !== null, {
    message: "a short acceptance must carry a rejectionReason",
  });
export type AcceptanceLine = z.infer<typeof AcceptanceLineSchema>;

export const AcceptancePayloadSchema = z.object({
  shipmentRef: z.string().min(1),
  buyer: z.string().min(1),
  receivedAt: z.string().datetime({ offset: true }),
  lines: z.array(AcceptanceLineSchema).min(1),
});
export type AcceptancePayload = z.infer<typeof AcceptancePayloadSchema>;
