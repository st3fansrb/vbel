/**
 * TEMPORARY — delete before the final deploy.
 *
 * Renders every shell component in its real states so the frame can be
 * checked on its own, before feat/console-flow puts live records inside it.
 */
import { AppShell, EmptyState, PageHeader, Panel, StatRow } from "@/components/shell";

const NAV = [
  { href: "/shell-preview", label: "Shipments", badge: 3 },
  { href: "/shell-preview/disputes", label: "Disputes", badge: 1 },
  { href: "/shell-preview/issuers", label: "Issuers" },
];

export default function ShellPreview() {
  return (
    <AppShell
      role="buyer"
      nav={NAV}
      headerRight={
        <span className="border border-white/30 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90">
          Solana devnet
        </span>
      }
    >
      <PageHeader
        title="SHP-1756304891"
        subtitle="Supplier A → Buyer B. Two companies, one record, and a sixty-case disagreement about what arrived."
        actions={
          <>
            <button className="border border-rule bg-paper px-3 py-1.5 text-sm text-ink-muted hover:bg-panel-sunk">
              Copy verify link
            </button>
            <button className="bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-strong">
              Issue correction
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <StatRow
          items={[
            { label: "Dispatched", value: "1,000" },
            { label: "Accepted", value: "940", verdict: "superseded" },
            { label: "Corrected", value: "900", verdict: "verified" },
            { label: "Chain", value: "Unbroken", verdict: "verified" },
          ]}
        />

        <Panel title="Dispatch" verdict="verified">
          <p className="text-sm text-ink-muted">
            Signed by supplier-a, hash-linked as the first event in the chain.
          </p>
        </Panel>

        <Panel title="Acceptance" verdict="tampered">
          <p className="text-sm text-ink-muted">
            The stored document no longer hashes to what was signed. The changed field is named below.
          </p>
        </Panel>

        <Panel title="Correction" verdict="superseded">
          <p className="text-sm text-ink-muted">
            Supersedes the acceptance without deleting it. Both records remain.
          </p>
        </Panel>

        <Panel title="Raw envelope" surface="sunk">
          <span className="hash">sha256:9f2b4c7e1a8d3f60b5c2e9a740d1f83b6c4e2a97e5d8b3610f4a2c9d7e6b1a834</span>
        </Panel>

        <EmptyState
          title="No open disputes"
          body="Every record on this shipment verifies against its signature and its anchor."
          action={
            <button className="border border-rule bg-paper px-3 py-1.5 text-sm text-ink-muted hover:bg-panel-sunk">
              View anchor history
            </button>
          }
        />
      </div>
    </AppShell>
  );
}
