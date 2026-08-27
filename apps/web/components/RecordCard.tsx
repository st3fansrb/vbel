"use client";

import type { DerivedStatus } from "@vbel/core";
import { Badge } from "./Badge";
import { Field, Mono, truncateHash } from "./Field";
import { PayloadSummary } from "./PayloadSummary";
import type { LedgerRecord, RecordVerdict } from "@/lib/types";

function explorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

function ensExplorerUrl(name: string, network: "mainnet" | "sepolia"): string {
  return network === "mainnet" ? `https://app.ens.domains/${name}` : `https://sepolia.app.ens.domains/${name}`;
}

export function RecordCard({
  record,
  verdict,
  status,
  onAnchor,
  anchoring,
  contaminatedByLabels,
  ensParentName,
  ensNetwork,
}: {
  record: LedgerRecord;
  verdict: RecordVerdict | undefined;
  status: DerivedStatus;
  onAnchor: () => void;
  anchoring: boolean;
  contaminatedByLabels: string[];
  /** Set only when ENS resolution is actually configured — see page.tsx. */
  ensParentName: string | null;
  ensNetwork: "mainnet" | "sepolia";
}) {
  const { envelope } = record.event;
  const tampered = verdict !== undefined && !verdict.payloadValid;
  const disputedUpstream = !tampered && contaminatedByLabels.length > 0;
  const changedPaths = new Set((verdict?.differences ?? []).map((d) => d.path));
  const ensName = ensParentName ? `${envelope.issuerId.replace("urn:vbel:org:", "")}.${ensParentName}` : null;

  return (
    <article
      className={`border bg-paper ${tampered ? "border-tampered/40" : disputedUpstream ? "border-superseded/40" : "border-rule"}`}
      style={
        tampered
          ? { boxShadow: "inset 3px 0 0 var(--color-tampered)" }
          : disputedUpstream
            ? { boxShadow: "inset 3px 0 0 var(--color-superseded)" }
            : undefined
      }
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold tracking-tight">{record.label}</h3>
          {status === "SUPERSEDED" && <Badge tone="superseded">Superseded</Badge>}
          {status === "REVOKED" && <Badge tone="tampered">Revoked</Badge>}
          {status === "ACTIVE" && <Badge tone="neutral">Active</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {disputedUpstream && <Badge tone="superseded">⚠ Downstream dispute</Badge>}
          {verdict && (
            <Badge tone={tampered ? "tampered" : "verified"}>
              {tampered ? "✗ Payload altered" : "✓ Verified"}
            </Badge>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5 py-4">
        <PayloadSummary payload={record.storedPayload} changedPaths={changedPaths} />

        {disputedUpstream && (
          <div className="border border-superseded/30 bg-superseded-bg px-4 py-3">
            <div className="label mb-2 text-superseded">Downstream of a disputed record</div>
            <p className="text-xs text-ink-muted">
              This record's own hash and signature still verify — the problem is inherited, not local. It chains
              from <span className="font-medium text-ink">{contaminatedByLabels.join(", ")}</span>, whose stored
              payload no longer matches what was signed. Once one record is caught, everything built on it is
              suspect too.
            </p>
          </div>
        )}

        {tampered && (
          <div className="border border-tampered/30 bg-tampered-bg px-4 py-3">
            <div className="label mb-2 text-tampered">Stored document does not match what was signed</div>
            <table className="w-full text-xs">
              <tbody>
                {verdict.differences.map((difference) => (
                  <tr key={difference.path}>
                    <td className="py-0.5 pr-4 font-mono text-tampered">{difference.path}</td>
                    <td className="py-0.5 pr-3 text-ink-muted">
                      signed <span className="font-mono text-ink">{JSON.stringify(difference.expected)}</span>
                    </td>
                    <td className="py-0.5 text-ink-muted">
                      stored <span className="font-mono text-tampered">{JSON.stringify(difference.actual)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-ink-muted">
              The signed record itself is untouched and still verifies. Only the stored copy was changed.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 border-t border-rule pt-4 sm:grid-cols-4">
          <Field label="Issuer">{envelope.issuerId.replace("urn:vbel:org:", "")}</Field>
          <Field label="Issued">{new Date(envelope.issuedAt).toLocaleString()}</Field>
          <Field label="Signature">
            {verdict?.signatureValid ? (
              <span className="text-verified">valid</span>
            ) : (
              <span className="text-tampered">invalid</span>
            )}
            {verdict?.counterSigned && <span className="text-ink-faint"> · counter-signed</span>}
            {verdict?.identityChecked && (
              <span className="text-ink-faint">
                {" "}
                ·{" "}
                {ensName ? (
                  <a
                    className="text-accent underline underline-offset-2 hover:no-underline"
                    href={ensExplorerUrl(ensName, ensNetwork)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    resolved via {ensName}
                  </a>
                ) : (
                  "identity confirmed"
                )}
              </span>
            )}
          </Field>
          <Field label="Anchor">
            {record.anchor ? (
              <div className="flex flex-col gap-0.5">
                <a
                  className="text-accent underline underline-offset-2 hover:no-underline"
                  href={explorerUrl(record.anchor.reference)}
                  target="_blank"
                  rel="noreferrer"
                >
                  slot {record.anchor.block}
                </a>
                {record.chainVerification === null ? (
                  <span className="text-xs text-ink-faint">checking chain…</span>
                ) : record.chainVerification.valid ? (
                  <span className="text-xs text-verified">✓ re-read from chain, matches</span>
                ) : (
                  <span className="text-xs text-tampered">✗ chain re-read failed</span>
                )}
              </div>
            ) : (
              <button
                onClick={onAnchor}
                disabled={anchoring}
                className="bg-accent px-2 py-0.5 text-xs text-white hover:bg-accent-strong disabled:opacity-50"
              >
                {anchoring ? "anchoring…" : "Anchor on Solana"}
              </button>
            )}
          </Field>
        </div>

        <div className="space-y-1 border-t border-rule pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="label">Event hash</span>
            <Mono title={record.event.eventHash}>{truncateHash(record.event.eventHash, 24)}</Mono>
          </div>
          {envelope.supersedes && (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="label">Supersedes</span>
              <Mono>{envelope.supersedes}</Mono>
              <span className="text-xs text-ink-muted">— {envelope.supersedeReason}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
