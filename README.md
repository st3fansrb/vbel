# VBEL — Verifiable Business Event Ledger

Turn a business event — a delivery, an acceptance, a correction — into a signed, hash-chained
record whose integrity anyone can verify without our servers, with the fingerprint anchored on a
public chain so nobody can quietly rewrite history. Not even us.

*ETH Belgrade × Superteam Balkan, 26–27 August 2026.*

---

## The one idea

> **Delivered: 1,000. Accepted: 940.**
> Same shipment, two companies, two numbers — and the one holding the system of record can change
> their copy later.

**Whose number is real?** Today: whoever owns the database. With VBEL: the one anchored on chain,
and it can't move.

VBEL doesn't stop anyone from lying. It makes them commit to what they said — signed, ordered,
and anchored — so a later edit is provable instead of silent.

---

## What it actually does

- **Signs** every event with the issuer's key (ed25519).
- **Chains** each event to the hash of the one before it — no reordering, no silent gaps.
- **Anchors** the chain's fingerprint on **Solana** (devnet, via SPL Memo — no custom program).
- **Resolves issuer identity** from an **ENS** text record on Sepolia — who a signing key belongs
  to isn't a list we keep, it's read live from chain.
- **Verifies entirely in the browser.** Zero servers you have to trust. Tamper with a stored
  field and verification fails *and names the field that broke*.
- **Corrections supersede, they don't delete.** 940 → 900 and both records stay. Everything
  downstream of a disputed record is flagged automatically.

---

## Quick start

```bash
pnpm install
pnpm test          # 61 tests, no network required
pnpm typecheck
```

Run the web app (issue + verify UI, including the tamper button):

```bash
pnpm --filter @vbel/web dev
```

Run the same scenario headless in Node:

```bash
pnpm --filter @vbel/demo-cli demo
```

Anchor a real hash on Solana devnet (needs a funded devnet key in `.env`):

```bash
set -a && source .env && set +a && pnpm --filter @vbel/adapter-solana smoke:anchor
```

> **Gotcha:** the web app loads the root `.env` itself (see `apps/web/next.config.mjs`), but the
> CLI scripts do not. Without the `source .env` prefix the Solana scripts fail with
> `Invalid Solana configuration`.

---

## Architecture

Every package lives under `packages/` and the folder name matches the import name.

| Package | Folder | What it is |
|---|---|---|
| `@vbel/core` | `packages/core` | Envelope, canonical JSON, hashing, signing, identity, lifecycle. No I/O, no chain deps. |
| `@vbel/config` | `packages/config` | Environment parsing and validation. |
| `@vbel/domain-delivery` | `packages/domain-delivery` | Delivery / acceptance / correction payload schemas and event builders. |
| `@vbel/adapter-solana` | `packages/adapter-solana` | `LedgerAdapter` over SPL Memo, devnet. |
| `@vbel/adapter-identity-static` | `packages/adapter-identity-static` | `IdentityResolver` over an explicit trust registry (the fallback root). |
| `@vbel/adapter-ens` | `packages/adapter-ens` | ENS name resolution and subname management — the live issuer-identity root. |
| `@vbel/web` | `apps/web` | Issue + verify UI. |
| `@vbel/demo-cli` | `apps/demo-cli` | The same scenario in Node, as a stage fallback. |

**The rule that keeps it modular:** `packages/core` imports nothing from any other package.
Dependencies point inward only. Swapping Solana for Ethereum is one new file satisfying
`LedgerAdapter` plus one line of config.

### Inside `packages/core`

One concern per file, and the filename is the concern.

| File | Holds |
|---|---|
| `envelope.ts` | The event envelope schema. **Frozen at v0.1.** |
| `canonicalize.ts` | RFC 8785 canonical JSON, plus the guards that keep two implementations byte-identical. |
| `hash.ts` | `sha256(canonicalize(x))`. |
| `keys.ts` | ed25519 keypair generation. |
| `sign.ts` | Signing, counter-signing, and `verifyEvent` — the full verification entry point. |
| `identity.ts` | `IdentityResolver` + `IssuerAttestation`: who a signing key belongs to. |
| `lifecycle.ts` | Chain validation and derived status (`ACTIVE` / `SUPERSEDED` / `REVOKED`). |
| `ledger.ts` | The `LedgerAdapter` contract. Pure types. |
| `payload.ts` | Payload hash verification and field-level diffing. |

---

## Why now

**Serbia, 1 October 2027** — electronic delivery notes become mandatory, operated by the state.
That build covers the obvious case. It does **not** cover corrections *after* a delivery is
accepted — the short-shipped pallet found a week later at the store. That gap is the product.

---

## Known limitations

- **No persistence.** Records live in React state and are lost on refresh, anchor receipts
  included. Nothing can be independently audited until this exists.
- **`adapter-ens` predates the `IdentityResolver` contract** and carries a parallel identity
  concept; it needs reconciling to the formal contract.
- **`packages/config` knows about every adapter**, which slightly undercuts the plug-and-play
  claim — adding a chain still means touching config.

---

## What this does not claim

Integrity is not truth. VBEL proves a record has not changed since it was signed and anchored —
not that what it says was ever accurate. It is not a qualified electronic ledger under eIDAS 2.0,
not legal evidence in any jurisdiction, and not a compliance product.
