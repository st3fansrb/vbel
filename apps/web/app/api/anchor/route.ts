import { NextResponse } from "next/server";
import { loadSolanaConfig } from "@vbel/config";
import { SolanaMemoAdapter } from "@vbel/adapter-solana";

/**
 * Anchoring needs the issuer's signing key, so it happens here and never in
 * the browser. The route returns only the receipt; the key never leaves the
 * server process.
 *
 * Verification deliberately has no counterpart route — it needs no secret
 * and no server, and runs entirely client-side.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;

export async function POST(request: Request) {
  let body: { eventHash?: unknown; metadata?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "body must be JSON" }, { status: 400 });
  }

  const { eventHash, metadata } = body;
  if (typeof eventHash !== "string" || !HASH_PATTERN.test(eventHash)) {
    return NextResponse.json({ error: "eventHash must match sha256:<64 hex chars>" }, { status: 400 });
  }

  // Only primitive metadata is accepted — this string ends up on a public
  // chain, so nothing structured or unbounded gets through by accident.
  const safeMetadata: Record<string, string | number | boolean> = {};
  if (metadata !== undefined) {
    if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) {
      return NextResponse.json({ error: "metadata must be a flat object" }, { status: 400 });
    }
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
        return NextResponse.json({ error: `metadata.${key} must be a primitive` }, { status: 400 });
      }
      safeMetadata[key] = value;
    }
  }

  try {
    const adapter = new SolanaMemoAdapter(loadSolanaConfig());
    const receipt = await adapter.anchor(eventHash, safeMetadata);
    return NextResponse.json(receipt);
  } catch (error) {
    // Configuration and RPC failures are operator problems, not client ones;
    // surface the message without leaking anything key-shaped.
    const message = error instanceof Error ? error.message : "anchoring failed";
    console.error("anchor failed:", message);
    return NextResponse.json({ error: "anchoring failed", detail: message }, { status: 502 });
  }
}
