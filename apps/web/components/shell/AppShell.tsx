import Link from "next/link";
import type { AppShellProps } from "./contract";
import { SideNav } from "./SideNav";

/**
 * The application frame: brand bar, role-scoped navigation, content well.
 *
 * The navy bar is structure and brand, never a verdict — see globals.css.
 * Record status colour lives inside the content well and nowhere else, so
 * the chrome can never be mistaken for a judgement about a record.
 */
export function AppShell({ role, nav, headerRight, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-accent">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight text-white">VBEL</span>
            <span className="hidden text-xs text-white/70 sm:inline">Verifiable Business Event Ledger</span>
          </Link>
          {headerRight}
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <SideNav role={role} nav={nav} />
        <main className="min-w-0 flex-1 bg-panel px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
