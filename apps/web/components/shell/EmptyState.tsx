import type { EmptyStateProps } from "./contract";

/**
 * States a true fact about an empty collection — "No open disputes" — and
 * never a promise about something unbuilt. A placeholder that advertises a
 * missing feature makes the working ones look smaller; an honest empty
 * state is just what the screen looks like on a quiet day.
 */
export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="border border-rule bg-panel-sunk px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink-muted">{title}</p>
      {body && <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-ink-faint">{body}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
