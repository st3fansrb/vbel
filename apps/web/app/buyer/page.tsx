"use client";

import { useCallback, useEffect, useState } from "react";
import { signEnvelope, counterSignPreviousEvent, validateChain, type DerivedStatus, type KeyPair } from "@vbel/core";
import { buildAcceptanceEvent, type AcceptanceLine, type AcceptancePayload, type DispatchPayload } from "@vbel/domain-delivery";
import { AppShell, EmptyState, PageHeader, Panel, StatRow } from "@/components/shell";
import { RecordCard } from "@/components/RecordCard";
import { anchorRecord, type Chain } from "@/lib/anchor";
import { buildCorrection } from "@/lib/correction";
import { loadDemoKeys } from "@/lib/demoKeys";
import { BUYER_ID, getIdentityResolver } from "@/lib/identity";
import { ChainDecodeError, decodeChain, encodeChain } from "@/lib/recordCodec";
import { restore, tamperAcceptance } from "@/lib/tamper";
import type { LedgerRecord, RecordVerdict } from "@/lib/types";
import { verifyAll } from "@/lib/verify";

const NAV = [
  { href: "/supplier", label: "Supplier console" },
  { href: "/buyer", label: "Buyer console" },
  { href: "/verify", label: "Verify a record" },
];

export default function BuyerPage() {
  const [loadState, setLoadState] = useState<"empty" | "loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");

  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [buyerKeys, setBuyerKeys] = useState<KeyPair | null>(null);
  const [verdicts, setVerdicts] = useState<Map<string, RecordVerdict>>(new Map());
  const [anchoring, setAnchoring] = useState<{ id: string; chain: Chain } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);

  const [accepted, setAccepted] = useState<Record<string, number>>({});
  const [rejectionReason, setRejectionReason] = useState("");

  const loadFromFragment = useCallback(async (fragment: string) => {
    setLoadState("loading");
    setLoadError(null);
    try {
      const decoded = await decodeChain(fragment);
      setRecords(decoded);
      setLoadState("ready");
    } catch (err) {
      setLoadState("error");
      setLoadError(err instanceof ChainDecodeError ? err.message : "could not read this link");
    }
  }, []);

  useEffect(() => {
    loadDemoKeys().then(({ buyer }) => setBuyerKeys(buyer));
    const fragment = window.location.hash.slice(1);
    if (fragment) void loadFromFragment(fragment);
    else setLoadState("empty");
  }, [loadFromFragment]);

  useEffect(() => {
    if (records.length === 0) return;
    getIdentityResolver().then((resolver) => verifyAll(records, resolver).then(setVerdicts));
  }, [records]);

  useEffect(() => {
    const dispatch = records.find((r) => r.label === "Dispatch");
    if (!dispatch) return;
    const payload = dispatch.storedPayload as DispatchPayload;
    const initial: Record<string, number> = {};
    for (const line of payload.lines) initial[line.sku] = line.quantity;
    setAccepted((current) => (Object.keys(current).length === 0 ? initial : current));
  }, [records]);

  function handleLoadPasted() {
    const raw = pasted.trim();
    if (!raw) return;
    const fragment = raw.includes("#") ? raw.slice(raw.indexOf("#") + 1) : raw;
    void loadFromFragment(fragment);
  }

  async function handleAccept() {
    const dispatch = records.find((r) => r.label === "Dispatch");
    if (!dispatch || !buyerKeys) return;
    const dispatchPayload = dispatch.storedPayload as DispatchPayload;

    const lines: AcceptanceLine[] = dispatchPayload.lines.map((line) => {
      const quantityAccepted = Math.min(Math.max(0, accepted[line.sku] ?? line.quantity), line.quantity);
      const short = quantityAccepted < line.quantity;
      return {
        sku: line.sku,
        quantityDelivered: line.quantity,
        quantityAccepted,
        rejectionReason: short ? rejectionReason || "short at receipt" : null,
      };
    });

    setBusy(true);
    setError(null);
    try {
      const payload: AcceptancePayload = {
        shipmentRef: dispatchPayload.shipmentRef,
        buyer: dispatchPayload.buyer,
        receivedAt: new Date().toISOString(),
        lines,
      };
      let event = await signEnvelope({
        envelope: buildAcceptanceEvent({ issuerId: BUYER_ID, payload, previousEventHash: dispatch.event.eventHash }),
        signer: buyerKeys,
        signerId: BUYER_ID,
      });
      event = await counterSignPreviousEvent({ signed: event, counterSigner: buyerKeys, signerId: BUYER_ID });

      setRecords((current) => [
        ...current,
        { label: "Acceptance", event, storedPayload: payload, issuerPayload: payload, anchor: null, chainVerification: null },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not sign acceptance");
    } finally {
      setBusy(false);
    }
  }

  async function handleAnchor(record: LedgerRecord, chain: Chain) {
    setAnchoring({ id: record.event.envelope.eventId, chain });
    setError(null);
    try {
      const { anchor, chainVerification } = await anchorRecord(record, chain);
      setRecords((current) =>
        current.map((r) => (r.event.envelope.eventId === record.event.envelope.eventId ? { ...r, anchor, chainVerification } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "anchoring failed");
    } finally {
      setAnchoring(null);
    }
  }

  const acceptanceRecord = records.find((r) => r.label === "Acceptance");
  const isTampered = acceptanceRecord ? verdicts.get(acceptanceRecord.event.envelope.eventId)?.payloadValid === false : false;
  const hasCorrection = records.some((r) => r.label === "Correction");

  function toggleTamper() {
    setRecords((current) => current.map((r) => (r.label === "Acceptance" ? (isTampered ? restore(r) : tamperAcceptance(r)) : r)));
  }

  async function issueCorrection() {
    if (!buyerKeys || !acceptanceRecord) return;
    const previous = acceptanceRecord.issuerPayload as AcceptancePayload;
    setBusy(true);
    try {
      const correction = await buildCorrection({
        records,
        buyerKeys,
        lines: previous.lines,
        reason: "correction issued after a further discrepancy was found",
      });
      setRecords((current) => [...current, correction]);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyLink() {
    if (records.length === 0) return;
    const encoded = await encodeChain(records);
    const url = `${window.location.origin}/verify#${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("could not copy automatically — select the link below and copy it manually");
    }
    setLastLink(url);
  }

  const chain = records.length > 0 ? validateChain(records.map((r) => r.event)) : null;
  const dispatch = records.find((r) => r.label === "Dispatch");
  const dispatchPayload = dispatch?.storedPayload as DispatchPayload | undefined;

  return (
    <AppShell
      role="buyer"
      nav={NAV}
      headerRight={
        <span className="border border-white/30 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90">
          Dual-chain anchoring
        </span>
      }
    >
      {loadState === "empty" && (
        <>
          <PageHeader title="Buyer console" subtitle="No shipment loaded yet." />
          <div className="space-y-4">
            <EmptyState
              title="No shipment received"
              body="Open the link the supplier sent you, or paste it below. The record travels inside the link itself — nothing is fetched from a server."
            />
            <Panel title="Paste a shipment link">
              <div className="flex flex-wrap gap-2">
                <input
                  className="min-w-0 flex-1 border border-rule bg-paper px-2 py-1.5 text-sm font-mono"
                  placeholder="https://…/buyer#…"
                  value={pasted}
                  onChange={(e) => setPasted(e.target.value)}
                />
                <button onClick={handleLoadPasted} className="bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-strong">
                  Load
                </button>
              </div>
            </Panel>
          </div>
        </>
      )}

      {loadState === "loading" && <PageHeader title="Loading…" />}

      {loadState === "error" && (
        <>
          <PageHeader title="Could not load this record" />
          <EmptyState title="The link did not decode to a valid record" body={loadError ?? undefined} />
        </>
      )}

      {loadState === "ready" && dispatchPayload && (
        <>
          <PageHeader
            title={dispatchPayload.shipmentRef}
            subtitle={`${dispatchPayload.supplier} → ${dispatchPayload.buyer}. Received via a signed link — nothing here was fetched from a server.`}
            actions={
              acceptanceRecord && (
                <>
                  <button
                    onClick={toggleTamper}
                    className="border border-rule bg-paper px-3 py-1.5 text-sm text-ink-muted hover:bg-panel-sunk"
                  >
                    {isTampered ? "Restore stored payload" : "Tamper with stored payload"}
                  </button>
                  <button
                    onClick={issueCorrection}
                    disabled={hasCorrection || busy}
                    className="border border-accent/40 bg-paper px-3 py-1.5 text-sm text-accent hover:bg-accent-bg disabled:opacity-40"
                  >
                    Issue correction
                  </button>
                </>
              )
            }
          />

          <div className="space-y-6">
            <StatRow
              items={[
                { label: "Chain", value: chain?.valid ? "Unbroken" : "Broken", verdict: chain?.valid ? "verified" : "tampered" },
                { label: "Records", value: records.length },
                {
                  label: "Status",
                  value: acceptanceRecord ? "Accepted" : "Awaiting acceptance",
                  verdict: acceptanceRecord ? "verified" : undefined,
                },
              ]}
            />

            {records.map((record) => {
              const status = (chain?.derivedStatus.get(record.event.envelope.eventId) ?? "ACTIVE") as DerivedStatus;
              const isAnchoringThis = anchoring?.id === record.event.envelope.eventId ? anchoring.chain : null;
              return (
                <RecordCard
                  key={record.event.envelope.eventId}
                  record={record}
                  verdict={verdicts.get(record.event.envelope.eventId)}
                  status={status}
                  onAnchor={(c) => handleAnchor(record, c)}
                  anchoring={isAnchoringThis}
                  contaminatedByLabels={[]}
                  ensParentName={null}
                  ensNetwork="sepolia"
                />
              );
            })}

            {!acceptanceRecord && (
              <Panel title="Accept this shipment">
                <p className="mb-4 text-sm text-ink-muted">
                  What was actually received. Prefilled with the dispatched quantity — edit it to what really
                  arrived.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rule text-left">
                      <th className="label pb-1.5 font-medium">SKU</th>
                      <th className="label pb-1.5 text-right font-medium">Dispatched</th>
                      <th className="label pb-1.5 text-right font-medium">Accepted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchPayload.lines.map((line) => (
                      <tr key={line.sku} className="border-b border-rule/60 last:border-0">
                        <td className="py-2 font-mono text-xs">{line.sku}</td>
                        <td className="py-2 text-right tabular-nums text-ink-muted">{line.quantity}</td>
                        <td className="py-2 text-right">
                          <input
                            type="number"
                            min={0}
                            max={line.quantity}
                            className="w-24 border border-rule bg-paper px-2 py-1 text-right text-sm tabular-nums"
                            value={accepted[line.sku] ?? line.quantity}
                            onChange={(e) =>
                              setAccepted((current) => ({ ...current, [line.sku]: Number(e.target.value) }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <label className="mt-4 block">
                  <span className="label mb-1 block">Reason, if short</span>
                  <input
                    className="w-full border border-rule bg-paper px-2 py-1.5 text-sm"
                    placeholder="e.g. cases damaged in transit"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </label>
                {error && <p className="mt-3 text-sm text-tampered">{error}</p>}
                <button
                  onClick={handleAccept}
                  disabled={!buyerKeys || busy}
                  className="mt-4 bg-accent px-4 py-2 text-sm text-white hover:bg-accent-strong disabled:opacity-50"
                >
                  {busy ? "Signing…" : "Sign acceptance"}
                </button>
              </Panel>
            )}

            {acceptanceRecord && (
              <Panel surface="sunk">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-ink-muted">Anyone with this link can verify the record independently.</p>
                  <button onClick={handleCopyLink} className="shrink-0 bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-strong">
                    {copied ? "Copied ✓" : "Copy verify link"}
                  </button>
                </div>
                {lastLink && <p className="hash mt-3 break-all rounded-none bg-panel px-3 py-2">{lastLink}</p>}
              </Panel>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
