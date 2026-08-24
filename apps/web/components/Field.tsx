export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="label mb-1">{label}</div>
      <div className="min-w-0 text-sm text-ink">{children}</div>
    </div>
  );
}

/** Cryptographic material. Monospace signals "a machine produced this". */
export function Mono({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <span className="hash" title={title}>
      {children}
    </span>
  );
}

export function truncateHash(hash: string, keep = 12): string {
  const [prefix, hex] = hash.split(":");
  if (!hex) return hash;
  return `${prefix}:${hex.slice(0, keep)}…`;
}
