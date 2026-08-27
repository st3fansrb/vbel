"use client";

import { useEffect, useState } from "react";
import { signEnvelope, validateChain, type KeyPair } from "@vbel/core";
import { buildDispatchEvent, type DispatchPayload } from "@vbel/domain-delivery";
import { AppShell, EmptyState, PageHeader, Panel } from "@/components/shell";
import { RecordCard } from "@/components/RecordCard";
import { anchorRecord, type Chain } from "@/lib/anchor";
import { loadDemoKeys } from "@/lib/demoKeys";
import { SUPPLIER_ID, getIdentityResolver } from "@/lib/identity";
import type { LedgerRecord, RecordVerdict } from "@/lib/types";
import { verifyAll } from "@/lib/verify";

const NAV = [
  { href: "/supplier", label: "New shipment" },
  { href: "/buyer", label: "Buyer console" },
  { href: "/verify", label: "Verify a record" },
];

function newShipmentRef(): string {
  return `SHP-${Math.floor(Date.now() / 1000)}`;
}

export default function SupplierPage() {
  const [shipmentRef, setShipmentRef] = useState(newShipmentRef());
  const [supplierName, setSupplierName] = useState("Supplier A");
  const [buyerName, setBuyerName] = useState("Buyer B");
  const [sku, setSku] = useState("SKU-1");
  const [description, setDescription] = useState("Cases of goods");
  const [quantity, setQuantity] = useState(1000);
  const [unit, setUnit] = useState("case");

  const [supplierKeys, setSupplierKeys] = useState<KeyPair | null>(null);
  const [record, setRecord] = useState<LedgerRecord | null>(null);
  const [verdict, setVerdict] = useState<RecordVerdict | undefined>(undefined);
  const [anchoring, setAnchoring] = useState<Chain | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    loadDemoKeys().then(({ supplier }) => setSupplierKeys(supplier));
  }, []);

  useEffect(() => {
    if (!record) return;
    getIdentityResolver().then((resolver) =>
      verifyAll([record], resolver).then((verdicts) => setVerdict(verdicts.get(record.event.envelope.eventId)))
    );
  }, [record]);

  async function handleCreate() {
    if (!supplierKeys) return;
    if (quantity <= 0) {
      setError("quantity must be greater than zero");
      return;
    }
    setError(null);
    setSigning(true);
    try {
      const payload: DispatchPayload = {
        shipmentRef,
        supplier: supplierName,
        buyer: buyerName,
        dispatchedAt: new Date().toISOString(),
        lines: [{ sku, description, quantity, unit }],
      };
      const event = await signEnvelope({
        envelope: buildDispatchEvent({ issuerId: SUPPLIER_ID, payload }),
        signer: supplierKeys,
        signerId: SUPPLIER_ID,
      });
      setRecord({ label: "Dispatch", event, storedPayload: payload, issuerPayload: payload, anchor: null, chainVerification: null });
    } finally {
      setSigning(false);
    }
  }

  async function handleAnchor(chain: Chain) {
    if (!record) return;
    setAnchoring(chain);
    setError(null);
    try {
      const { anchor, chainVerification } = await anchorRecord(record, chain);
      setRecord({ ...record, anchor, chainVerification });
    } catch (err) {
      setError(err instanceof Error ? err.message : "anchoring failed");
    } finally {
      setAnchoring(null);
    }
  }

  async function handleCopyLink() {
    if (!record) return;
    const { encodeChain } = await import("@/lib/recordCodec");
    const encoded = await encodeChain([record]);
    const url = `${window.location.origin}/buyer#${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("could not copy automatically — select the link below and copy it manually");
    }
    setLastLink(url);
  }

  const chain = record ? validateChain([record.event]) : null;

  return (
    <AppShell
      role="supplier"
      nav={NAV}
      headerRight={
        <span className="border border-white/30 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90">
          Dual-chain anchoring
        </span>
      }
    >
      <PageHeader
        title={record ? shipmentRef : "New shipment"}
        subtitle={
          record
            ? "Signed and hash-linked. Copy the link below and open it on the buyer's device — the record travels in the URL, no server holds it."
            : "Fill in what is actually being sent. This becomes the first signed event in the chain."
        }
      />

      {!record ? (
        <Panel title="Dispatch">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label mb-1 block">Shipment ref</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm font-mono"
                value={shipmentRef}
                onChange={(e) => setShipmentRef(e.target.value)}
              />
            </label>
            <div />
            <label className="block">
              <span className="label mb-1 block">Supplier</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label mb-1 block">Buyer</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label mb-1 block">SKU</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm font-mono"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label mb-1 block">Description</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label mb-1 block">Quantity</span>
              <input
                type="number"
                min={1}
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm tabular-nums"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="label mb-1 block">Unit</span>
              <input
                className="w-full border border-rule bg-paper px-2 py-1.5 text-sm"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-tampered">{error}</p>}

          <button
            onClick={handleCreate}
            disabled={!supplierKeys || signing}
            className="mt-5 bg-accent px-4 py-2 text-sm text-white hover:bg-accent-strong disabled:opacity-50"
          >
            {signing ? "Signing…" : "Sign & create dispatch"}
          </button>
        </Panel>
      ) : (
        <div className="space-y-6">
          <Panel surface="sunk">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                Hand this to the buyer. Anchoring first is optional — the link always carries whatever the record
                currently holds.
              </p>
              <button
                onClick={handleCopyLink}
                className="shrink-0 bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-strong"
              >
                {copied ? "Copied ✓" : "Copy link for buyer"}
              </button>
            </div>
            {lastLink && (
              <p className="hash mt-3 break-all rounded-none bg-panel px-3 py-2">{lastLink}</p>
            )}
          </Panel>

          <RecordCard
            record={record}
            verdict={verdict}
            status={chain?.derivedStatus.get(record.event.envelope.eventId) ?? "ACTIVE"}
            onAnchor={handleAnchor}
            anchoring={anchoring}
            contaminatedByLabels={[]}
            ensParentName={null}
            ensNetwork="sepolia"
          />

          {error && <p className="text-sm text-tampered">{error}</p>}

          <EmptyState
            title="No response from the buyer yet"
            body="Once they accept, the acceptance record exists only on their device until they send it back."
          />
        </div>
      )}
    </AppShell>
  );
}
