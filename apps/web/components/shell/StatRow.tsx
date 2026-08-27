import type { StatRowProps, Verdict } from "./contract";

const VERDICT_INK: Record<Verdict, string> = {
  verified: "text-verified",
  tampered: "text-tampered",
  superseded: "text-superseded",
};

/**
 * The handful of facts that decide whether a shipment is in dispute, across
 * the top of a screen. Quantities are tabular so two numbers that differ by
 * sixty cases line up their digits and the gap is visible, not arithmetic.
 */
export function StatRow({ items }: StatRowProps) {
  return (
    <dl className="grid grid-cols-2 border border-rule bg-paper sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 border-b border-r border-rule px-4 py-3 last:border-r-0 sm:border-b-0"
        >
          <dt className="label mb-1">{item.label}</dt>
          <dd className={`truncate text-lg tabular-nums ${item.verdict ? VERDICT_INK[item.verdict] : "text-ink"}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
