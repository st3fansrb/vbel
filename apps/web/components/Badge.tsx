type Tone = "verified" | "tampered" | "superseded" | "neutral";

const TONES: Record<Tone, string> = {
  verified: "text-verified bg-verified-bg border-verified/20",
  tampered: "text-tampered bg-tampered-bg border-tampered/20",
  superseded: "text-superseded bg-superseded-bg border-superseded/20",
  neutral: "text-ink-muted bg-panel-sunk border-rule",
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
