"use client";

import { useCallback, useEffect, useState } from "react";
import { validateChain, type AnchorReceipt, type DerivedStatus, type KeyPair, type LedgerVerificationResult } from "@vbel/core";
import type { StaticIdentityRegistry } from "@vbel/adapter-identity-static";
import { RecordCard } from "@/components/RecordCard";
import { computeBlastRadius } from "@/lib/blastRadius";
import { buildCorrection, buildScenario } from "@/lib/scenario";
import { restore, tamperAcceptance } from "@/lib/tamper";
import { verifyAll } from "@/lib/verify";
import type { LedgerRecord, RecordVerdict } from "@/lib/types";

export default function Page() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [resolver, setResolver] = useState<StaticIdentityRegistry | null>(null);
  const [buyerKeys, setBuyerKeys] = useState<KeyPair | null>(null);
  const [verdicts, setVerdicts] = useState<Map<string, RecordVerdict>>(new Map());
  const [anchoringId, setAnchoringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    buildScenario().then(({ records, resolver, buyerKeys }) => {
      setRecords(records);
      setResolver(resolver);
      setBuyerKeys(buyerKeys);
    });
  }, []);

  // Every change to the records re-runs verification from scratch, in the
  // browser. Nothing is cached, so nothing can go stale and quietly lie.
  useEffect(() => {
    if (records.length > 0) verifyAll(records, resolver ?? undefined).then(setVerdicts);
  }, [records, resolver]);

  const chain = records.length > 0 ? validateChain(records.map((r) => r.event)) : null;
  const blastRadius = computeBlastRadius(records, verdicts);
  const labelById = new Map(records.map((r) => [r.event.envelope.eventId, r.label]));
  const acceptance = records.find((r) => r.label === "Acceptance");
  const isTampered = acceptance
    ? verdicts.get(acceptance.event.envelope.eventId)?.payloadValid === false
    : false;
  const hasCorrection = records.some((r) => r.label === "Correction");

  const anchor = useCallback(async (record: LedgerRecord) => {
    setAnchoringId(record.event.envelope.eventId);
    setError(null);
    try {
      const response = await fetch("/api/anchor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventHash: record.event.eventHash,
          metadata: { ref: record.event.envelope.subjectId, type: record.label.toLowerCase() },
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail ?? body.error ?? "anchoring failed");

      const receipt = body as AnchorReceipt;
      setRecords((current) =>
        current.map((r) => (r.event.envelope.eventId === record.event.envelope.eventId ? { ...r, anchor: receipt } : r))
      );

      // The anchor call returning a receipt only proves the transaction was
      // submitted. Re-fetching it from the chain and confirming the memo
      // still carries this hash is a separate check — see /api/verify.
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ eventHash: record.event.eventHash, receipt }),
      });
      if (verifyResponse.ok) {
        const chainVerification = (await verifyResponse.json()) as LedgerVerificationResult;
        setRecords((current) =>
          current.map((r) =>
            r.event.envelope.eventId === record.event.envelope.eventId ? { ...r, chainVerification } : r
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "anchoring failed");
    } finally {
      setAnchoringId(null);
    }
  }, []);

  const toggleTamper = () => {
    setRecords((current) =>
      current.map((r) => (r.label === "Acceptance" ? (isTampered ? restore(r) : tamperAcceptance(r)) : r))
    );
  };

  const issueCorrection = async () => {
    if (!buyerKeys) return;
    setBusy(true);
    try {
      const correction = await buildCorrection(records, buyerKeys);
      setRecords((current) => [...current, correction]);
    } finally {
      setBusy(false);
    }
  };

  if (records.length === 0) {
    return <main className="mx-auto max-w-3xl px-6 py-16 text-sm text-ink-muted">Signing records…</main>;
  }

  const shipmentRef = records[0]!.event.envelope.subjectId.replace("urn:vbel:shipment:", "");

  return (
    <div className="min-h-screen">
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-2 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight">VBEL</span>
            <span className="text-xs text-ink-muted">Verifiable Business Event Ledger</span>
          </div>
          <span className="label">Solana devnet</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
          <div>
            <div className="label mb-1">Shipment</div>
            <h1 className="font-mono text-2xl tracking-tight">{shipmentRef}</h1>
          </div>
          <div className="text-right">
            <div className="label mb-1">Chain integrity</div>
            <div className={chain?.valid ? "text-sm text-verified" : "text-sm text-tampered"}>
              {chain?.valid ? "✓ hash-linked, unbroken" : "✗ chain broken"}
            </div>
          </div>
        </div>

        <p className="mb-2 max-w-prose text-base font-medium leading-snug text-ink">
          We don't stop you from lying. We make you commit to it.
        </p>
        <p className="mb-8 max-w-prose text-sm leading-relaxed text-ink-muted">
          Two companies, one shared record. Every event below is signed by its issuer and hash-linked to the one
          before it. Verification runs entirely in your browser against the same library that issued them — no
          server is asked to vouch for anything.
        </p>

        <p className="mb-2 text-xs text-ink-faint">
          Try it — tamper the stored payload and watch it get caught, then issue a correction and watch it
          supersede without deleting. If a correction chains from a disputed record, it gets flagged too, even
          though its own signature still verifies.
        </p>
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={toggleTamper}
            className="border border-rule-strong bg-paper px-3 py-1.5 text-sm hover:bg-panel-sunk"
          >
            {isTampered ? "Restore stored payload" : "Tamper with the stored payload"}
          </button>
          <button
            onClick={issueCorrection}
            disabled={hasCorrection || busy}
            className="border border-rule-strong bg-paper px-3 py-1.5 text-sm hover:bg-panel-sunk disabled:opacity-40"
          >
            Issue a correction
          </button>
        </div>

        {error && (
          <div className="mb-6 border border-tampered/30 bg-tampered-bg px-4 py-3 text-sm text-tampered">{error}</div>
        )}

        <ol className="relative space-y-5 border-l border-rule pl-6">
          {records.map((record) => {
            const status = (chain?.derivedStatus.get(record.event.envelope.eventId) ?? "ACTIVE") as DerivedStatus;
            return (
              <li key={record.event.envelope.eventId} className="relative">
                <span
                  className="absolute -left-[1.6875rem] top-4 h-2 w-2 rounded-full border-2 border-panel"
                  style={{
                    background:
                      status === "SUPERSEDED" ? "var(--color-superseded)" : "var(--color-ink)",
                  }}
                />
                <RecordCard
                  record={record}
                  verdict={verdicts.get(record.event.envelope.eventId)}
                  status={status}
                  onAnchor={() => anchor(record)}
                  anchoring={anchoringId === record.event.envelope.eventId}
                  contaminatedByLabels={[...(blastRadius.get(record.event.envelope.eventId) ?? [])].map(
                    (id) => labelById.get(id) ?? id
                  )}
                />
              </li>
            );
          })}
        </ol>

        <footer className="mt-10 border-t border-rule pt-5 text-xs leading-relaxed text-ink-faint">
          Integrity is not truth. VBEL proves a record has not changed since it was signed and anchored — not that
          what it says was ever accurate. Not a qualified electronic ledger under eIDAS 2.0, and not legal evidence
          in Serbia or Romania.
        </footer>
      </main>
    </div>
  );
}
