import type { DeliveryPayload } from "@/lib/types";
import type { AcceptancePayload, DispatchPayload } from "@vbel/domain-delivery";

function isAcceptance(payload: DeliveryPayload): payload is AcceptancePayload {
  return "receivedAt" in payload;
}

/**
 * The business content, rendered as a document table rather than as JSON.
 * The quantities are the thing two companies actually argue about, so they
 * get the visual weight.
 */
export function PayloadSummary({ payload, changedPaths }: { payload: DeliveryPayload; changedPaths: Set<string> }) {
  const highlight = (path: string) =>
    changedPaths.has(path) ? "bg-tampered-bg text-tampered font-semibold" : "";

  if (isAcceptance(payload)) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rule text-left">
            <th className="label pb-1.5 font-medium">SKU</th>
            <th className="label pb-1.5 text-right font-medium">Delivered</th>
            <th className="label pb-1.5 text-right font-medium">Accepted</th>
            <th className="label pb-1.5 pl-4 font-medium">Reason</th>
          </tr>
        </thead>
        <tbody>
          {payload.lines.map((line, i) => (
            <tr key={line.sku} className="border-b border-rule/60 last:border-0">
              <td className="py-2 font-mono text-xs">{line.sku}</td>
              <td className="py-2 text-right tabular-nums">{line.quantityDelivered}</td>
              <td className={`py-2 text-right tabular-nums ${highlight(`$.lines[${i}].quantityAccepted`)}`}>
                {line.quantityAccepted}
              </td>
              <td className={`py-2 pl-4 text-ink-muted ${highlight(`$.lines[${i}].rejectionReason`)}`}>
                {line.rejectionReason ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const dispatch = payload as DispatchPayload;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-rule text-left">
          <th className="label pb-1.5 font-medium">SKU</th>
          <th className="label pb-1.5 font-medium">Description</th>
          <th className="label pb-1.5 text-right font-medium">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {dispatch.lines.map((line, i) => (
          <tr key={line.sku} className="border-b border-rule/60 last:border-0">
            <td className="py-2 font-mono text-xs">{line.sku}</td>
            <td className="py-2 text-ink-muted">{line.description}</td>
            <td className={`py-2 text-right tabular-nums ${highlight(`$.lines[${i}].quantity`)}`}>
              {line.quantity} {line.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
