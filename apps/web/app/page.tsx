import Link from "next/link";

/**
 * A role chooser, not a landing page — nobody has picked a role yet, so
 * there is no nav to show. The three doors are the whole product: a
 * supplier issues, a buyer accepts or disputes, anyone can verify. See
 * app/supplier, app/buyer, app/verify.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-accent">
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-2 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight text-white">VBEL</span>
            <span className="text-xs text-white/70">Verifiable Business Event Ledger</span>
          </div>
          <span className="border border-white/30 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90">
            Solana devnet · Ethereum Sepolia
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-12 bg-accent-bg px-6 py-8 sm:px-8 sm:py-10">
          <h1 className="mb-3 max-w-prose border-l-4 border-accent pl-4 text-2xl font-semibold leading-tight tracking-tight text-ink">
            We don't stop you from lying. We make you commit to it.
          </h1>
          <p className="max-w-prose pl-[calc(1rem+4px)] text-sm leading-relaxed text-ink-muted">
            Two companies depend on one shared record — a delivery, an acceptance, a correction. Today that record
            lives in one party's system, and that party can quietly change it later. Pick a role below to see it
            work.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/supplier" className="group border border-rule bg-paper p-5 transition-colors hover:border-accent">
            <div className="label mb-2">Step 1</div>
            <h2 className="mb-1.5 text-base font-semibold text-ink group-hover:text-accent">I'm the supplier</h2>
            <p className="text-xs leading-relaxed text-ink-muted">
              Sign a dispatch and send a link — the record travels in the URL, no server holds it.
            </p>
          </Link>
          <Link href="/buyer" className="group border border-rule bg-paper p-5 transition-colors hover:border-accent">
            <div className="label mb-2">Step 2</div>
            <h2 className="mb-1.5 text-base font-semibold text-ink group-hover:text-accent">I'm the buyer</h2>
            <p className="text-xs leading-relaxed text-ink-muted">
              Open the supplier's link, accept what actually arrived, and send back a signed acceptance.
            </p>
          </Link>
          <Link href="/verify" className="group border border-rule bg-paper p-5 transition-colors hover:border-accent">
            <div className="label mb-2">Step 3</div>
            <h2 className="mb-1.5 text-base font-semibold text-ink group-hover:text-accent">Verify a record</h2>
            <p className="text-xs leading-relaxed text-ink-muted">
              Paste any link. Verification runs entirely in this browser — nothing is taken on trust.
            </p>
          </Link>
        </div>

        <footer className="mt-12 border-t border-rule pt-5 text-xs leading-relaxed text-ink-faint">
          Integrity is not truth. VBEL proves a record has not changed since it was signed and anchored — not that
          what it says was ever accurate. Not a qualified electronic ledger under eIDAS 2.0, and not legal evidence
          in Serbia or Romania.
        </footer>
      </main>
    </div>
  );
}
