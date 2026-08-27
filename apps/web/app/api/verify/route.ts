import { NextResponse } from "next/server";
import { loadSolanaConfig, loadEthereumConfig } from "@vbel/config";
import { SolanaMemoAdapter } from "@vbel/adapter-solana";
import { EthereumAdapter } from "@vbel/adapter-ethereum";
import type { AnchorReceipt, LedgerAdapter } from "@vbel/core";

/**
 * SolanaMemoAdapter needs the issuer keypair to construct, even though
 * verify() only reads — the adapter has no read-only mode. So re-checking
 * an anchor, like anchoring itself, happens here rather than in the
 * browser.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
const NETWORKS = new Set(["solana-devnet", "solana-mainnet", "ethereum-sepolia", "ethereum-mainnet"]);
const SOLANA_NETWORKS = new Set(["solana-devnet", "solana-mainnet"]);
const ETHEREUM_NETWORKS = new Set(["ethereum-sepolia", "ethereum-mainnet"]);

function isAnchorReceipt(value: unknown): value is AnchorReceipt {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.network === "string" &&
    NETWORKS.has(r.network) &&
    typeof r.reference === "string" &&
    (typeof r.block === "string" || typeof r.block === "number" || r.block === null) &&
    typeof r.timestamp === "string" &&
    typeof r.anchoredHash === "string"
  );
}

export async function POST(request: Request) {
  let body: { eventHash?: unknown; receipt?: unknown; chain?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "body must be JSON" }, { status: 400 });
  }

  const { eventHash, receipt, chain = "solana" } = body;
  if (chain !== "solana" && chain !== "ethereum") {
    return NextResponse.json({ error: 'chain must be "solana" or "ethereum"' }, { status: 400 });
  }
  if (typeof eventHash !== "string" || !HASH_PATTERN.test(eventHash)) {
    return NextResponse.json({ error: "eventHash must match sha256:<64 hex chars>" }, { status: 400 });
  }
  if (!isAnchorReceipt(receipt)) {
    return NextResponse.json({ error: "receipt must be a valid AnchorReceipt" }, { status: 400 });
  }
  if (chain === "solana" && !SOLANA_NETWORKS.has(receipt.network)) {
    return NextResponse.json(
      { error: `receipt network "${receipt.network}" does not match chain "${chain}"` },
      { status: 400 }
    );
  }
  if (chain === "ethereum" && !ETHEREUM_NETWORKS.has(receipt.network)) {
    return NextResponse.json(
      { error: `receipt network "${receipt.network}" does not match chain "${chain}"` },
      { status: 400 }
    );
  }

  try {
    const adapter: LedgerAdapter =
      chain === "ethereum"
        ? new EthereumAdapter(loadEthereumConfig())
        : new SolanaMemoAdapter(loadSolanaConfig());
    const result = await adapter.verify(receipt, eventHash);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "verification failed";
    console.error("verify failed:", message);
    return NextResponse.json({ error: "verification failed", detail: message }, { status: 502 });
  }
}
