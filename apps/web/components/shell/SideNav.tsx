"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, Role } from "./contract";

/**
 * Which company you are is the single most important fact on screen. The
 * whole premise is two parties holding different numbers for one shipment,
 * so a viewer who loses track of which console they are looking at has lost
 * the argument. Hence the role sits above the navigation, not inside it.
 */
const ROLE_LABEL: Record<Role, string> = {
  supplier: "Supplier console",
  buyer: "Buyer console",
  verifier: "Verifier",
};

/**
 * Horizontal strip on small screens, sidebar from `lg` up. The handoff is
 * demonstrated on two phones passing a link, so the narrow layout is the
 * one that has to hold up — it is not a courtesy breakpoint.
 */
export function SideNav({ role, nav }: { role: Role; nav: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-b border-rule bg-panel-sunk lg:w-56 lg:border-b-0 lg:border-r">
      <div className="hidden px-5 py-5 lg:block">
        <div className="label mb-1">Signed in as</div>
        <div className="text-sm font-medium text-ink">{ROLE_LABEL[role]}</div>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-3 py-2 lg:flex-col lg:gap-0.5 lg:px-3 lg:pb-5 lg:pt-0">
        <li className="shrink-0 lg:hidden">
          <span className="flex items-center px-3 py-2 text-sm font-medium text-ink">{ROLE_LABEL[role]}</span>
        </li>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between gap-3 whitespace-nowrap px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-bg font-medium text-accent"
                    : "text-ink-muted hover:bg-paper hover:text-ink"
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="bg-rule px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-ink-muted">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
