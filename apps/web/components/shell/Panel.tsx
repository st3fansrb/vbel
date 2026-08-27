import type { PanelProps, Verdict } from "./contract";

/**
 * Verdict is expressed as a left rule rather than a fill. A record whose
 * payload no longer matches its signature is a serious claim, and a
 * full-bleed red panel says it loudly enough to drown the content the
 * viewer needs to read — the changed field itself. The stripe marks; the
 * table underneath explains.
 */
const VERDICT_RULE: Record<Verdict, string> = {
  verified: "border-l-2 border-l-verified",
  tampered: "border-l-2 border-l-tampered",
  superseded: "border-l-2 border-l-superseded",
};

export function Panel({ title, surface = "default", verdict, children }: PanelProps) {
  const ground = surface === "sunk" ? "bg-panel-sunk" : "bg-paper";
  const rule = verdict ? VERDICT_RULE[verdict] : "";

  return (
    <section className={`border border-rule ${ground} ${rule}`}>
      {title && (
        <div className="border-b border-rule px-5 py-3">
          <h2 className="label">{title}</h2>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
