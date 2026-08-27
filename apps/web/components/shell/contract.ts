/**
 * CONTRACT ONLY — components land on `feat/shell`, consumers on
 * `feat/console-flow`. Both branches compile against this file, so neither
 * has to guess what the other is building.
 *
 * The one rule this encodes at the type level, from globals.css: status
 * colour belongs to record verdicts alone, and the navy accent belongs to
 * brand, structure and primary actions. Neither borrows the other's
 * meaning. That is why `Surface` and `Verdict` are separate types instead
 * of one `tone` prop — a panel cannot accidentally be styled "tampered"
 * because it happens to be important.
 */
import type { ReactNode } from "react";

/** Which console is being viewed. Two companies, two screens, one record. */
export type Role = "supplier" | "buyer" | "verifier";

/** Record state. Never used for structural emphasis. */
export type Verdict = "verified" | "tampered" | "superseded";

/** Structural elevation. Never used to imply a verdict. */
export type Surface = "default" | "sunk";

export interface NavItem {
  href: string;
  label: string;
  /** Live counts only — never a "TBD" or "soon" marker. */
  badge?: string | number;
}

export interface AppShellProps {
  role: Role;
  nav: NavItem[];
  /** Network badge and similar chrome, pinned to the top right. */
  headerRight?: ReactNode;
  children: ReactNode;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export interface PanelProps {
  title?: string;
  surface?: Surface;
  /** Set only on panels that represent a record's verification state. */
  verdict?: Verdict;
  children: ReactNode;
}

/**
 * Shown where the real product would have more rows. Always states a true
 * fact about an empty collection ("No open disputes") — never a promise
 * about unbuilt features.
 */
export interface EmptyStateProps {
  title: string;
  body?: string;
  action?: ReactNode;
}

export interface StatItem {
  label: string;
  value: ReactNode;
  verdict?: Verdict;
}

export interface StatRowProps {
  items: StatItem[];
}
