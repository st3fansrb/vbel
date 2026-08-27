# VBEL — Verifiable Business Event Ledger

Turns a business document event — a delivery, an acceptance, a correction — into a signed,
hashed record whose integrity anyone can verify without our servers, anchored on a public chain
so nobody can quietly rewrite history.

**The specification is [TECHNICAL-BRIEF.md](TECHNICAL-BRIEF.md).** If you read one file, read
that one. This file is only a map.

> **Why this map exists.** This repository was written across two months and at one point held
> 23 loose documents in its root, describing at least two different products. As of 25 August
> 2026 the root holds only this file and the spec; everything else has been sorted into `docs/`
> (current, in-repo) or moved out to the Obsidian vault (superseded, or business-only). See
> below for what went where and why.

---

## Quick start

```bash
pnpm install
pnpm test          # 61 tests, no network required
pnpm typecheck
```

Run the web app:

```bash
pnpm --filter @vbel/web dev
```

Anchor a real hash on Solana devnet (needs a funded devnet key in `.env`):

```bash
set -a && source .env && set +a && pnpm --filter @vbel/adapter-solana smoke:anchor
```

> **Gotcha:** the web app loads the root `.env` itself (see `apps/web/next.config.mjs`), but the
> CLI scripts do not. Without the `source .env` prefix above they fail with
> `Invalid Solana configuration`. This trips everyone once.

---

## Where the code is

All source was committed on **24 August 2026**. Every document dated July predates the code by a
month — that alone settles most "is this still true?" questions.

Every package lives under `packages/`, and the path matches the import name — no translation
needed between "what do I import" and "where do I look."

| Package | Folder | What it is |
|---|---|---|
| `@vbel/core` | `packages/core` | The envelope, hashing, signing, identity, lifecycle. No I/O, no chain dependencies. |
| `@vbel/config` | `packages/config` | Environment parsing and validation. |
| `@vbel/domain-delivery` | `packages/domain-delivery` | Delivery/acceptance payload schemas and event builders. |
| `@vbel/adapter-solana` | `packages/adapter-solana` | `LedgerAdapter` over SPL Memo, devnet. |
| `@vbel/adapter-identity-static` | `packages/adapter-identity-static` | `IdentityResolver` over an explicit trust registry. |
| `@vbel/adapter-ens` | `packages/adapter-ens` | ENS name resolution and subname management. Not yet wired to `IdentityResolver`. |
| `@vbel/web` | `apps/web` | Issue + verify UI. Demo-shaped; being rewritten into a real flow. |
| `@vbel/demo-cli` | `apps/demo-cli` | The same scenario in Node, as a fallback if the browser fails on stage. |

**The one rule that makes this modular:** `packages/core` imports nothing from any other
package. Dependencies point inward only. Swapping Solana for Ethereum is one new file satisfying
`LedgerAdapter` and one line of configuration.

### Inside `packages/core`

One concern per file, and the filename is the concern:

| File | Holds |
|---|---|
| `envelope.ts` | The event envelope schema. **Frozen at v0.1.** |
| `canonicalize.ts` | RFC 8785 canonical JSON, plus the guards that keep two implementations byte-identical. |
| `hash.ts` | `sha256(canonicalize(x))`. |
| `keys.ts` | ed25519 keypair generation. |
| `sign.ts` | Signing, counter-signing, and `verifyEvent` — the full verification entry point. |
| `identity.ts` | `IdentityResolver` + `IssuerAttestation`: who a signing key actually belongs to. |
| `lifecycle.ts` | Chain validation and derived status (`ACTIVE` / `SUPERSEDED` / `REVOKED`). |
| `ledger.ts` | The `LedgerAdapter` contract. Pure types. |
| `payload.ts` | Payload hash verification and field-level diffing. |

### Known structural debt

Not urgent, but real, and better written down than rediscovered:

1. **`adapter-ens` implements no formal contract.** `adapter-solana` implements `LedgerAdapter`,
   `adapter-identity-static` implements `IdentityResolver`, but `adapter-ens` predates
   `IdentityResolver` and carries its own parallel identity concept (`resolveIssuerRecords`,
   `EnsIssuerRegistry`). Reconcile it to `IdentityResolver` once ENS is back in scope.
2. **`packages/config` knows about every adapter** (`solana.ts`, `ens.ts`). Adding a chain means
   touching config, which slightly undercuts the plug-and-play claim.
3. **No persistence.** Records live in React state and are lost on refresh, anchor receipts
   included. Nothing can be audited by a third party until this exists.

---

## Where the documents are

### Root — the two files everyone reads

[README.md](README.md) (this file) and [TECHNICAL-BRIEF.md](TECHNICAL-BRIEF.md), the spec.
Nothing else. If a third document seems to belong here, it almost certainly belongs in `docs/`
instead.

### `docs/` — current, and moves with the code

Everything that describes *this build* — the hackathon plan, the standards it targets, the legal
research behind the wedge, and the messages exchanged with Vladislav while deciding it. These go
stale when the code or the plan changes, which is why they stay in the repository rather than
the vault.

| Document | Date | What it is |
|---|---|---|
| [docs/ETH-BELGRADE-HACKATHON-PLAN.md](docs/ETH-BELGRADE-HACKATHON-PLAN.md) | 21 Aug | Build plan v3. ⚠️ Calls for *three* domains; the newer brief §3 scopes to *one*. Unresolved. |
| [docs/CHAIN-AGNOSTIC-TRUST-TOKENIZATION-STRATEGY.md](docs/CHAIN-AGNOSTIC-TRUST-TOKENIZATION-STRATEGY.md) | 21 Aug | Strategy and technical direction. Companion to the plan. |
| [docs/RESEARCH-EOTPREMNICA.md](docs/RESEARCH-EOTPREMNICA.md) | 22 Aug | What the Serbian e-delivery-note law actually does. Feeds brief §2. Claims marked checked/unverified. |
| [docs/RESEARCH-FINDINGS-ETH-BELGRADE.md](docs/RESEARCH-FINDINGS-ETH-BELGRADE.md) | 21 Aug | Two adversarial research passes on the Open Evidence Layer. |
| [docs/RESEARCH-PROMPTS-ETH-BELGRADE.md](docs/RESEARCH-PROMPTS-ETH-BELGRADE.md) | 21 Aug | The prompts behind the findings above. Method, not conclusions. |
| [docs/FOR-VLADISLAV-BELGRADE.md](docs/FOR-VLADISLAV-BELGRADE.md) | 21 Aug | Why we build this, and why this way. Written to Vladislav. |
| [docs/FOR-VLADISLAV-STATE-SYSTEM.md](docs/FOR-VLADISLAV-STATE-SYSTEM.md) | 22 Aug | Why the Serbian state system helps rather than blocks us. |
| [docs/ENTIRE-CONTEXT-FMCG.md](docs/ENTIRE-CONTEXT-FMCG.md) | 8 Aug | The full picture for Vladislav. Replaces two 26 July documents that are now in the vault. Long. |
| [docs/PROJECT-BRIEFING.md](docs/PROJECT-BRIEFING.md) | 3 Aug | Was the "read this first" entry point before this README existed. Predates the 21 Aug strategy shift and all code. ⚠️ Its internal links to `CONTEXT.md`/`README.md` (an older pair, now in the vault) no longer resolve — read it as history, not as a live index. |
| [docs/QUESTIONS-FOR-VLADISLAV.md](docs/QUESTIONS-FOR-VLADISLAV.md) | 5 Aug | Open questions. Some since answered. |
| [docs/RESEARCH-FINDINGS.md](docs/RESEARCH-FINDINGS.md) | 25 Jul | Nine deep research runs on FMCG receivables in Serbia and Romania. The product moved on; the research is still a durable asset. |
| [docs/EU-AGRI-HACKATHON.md](docs/EU-AGRI-HACKATHON.md) | 3 Aug | A different event, submitted 3 Aug. Separate track. |

### Moved to the vault — superseded, or business rather than code

Everything describing the **earlier product** — a surplus-goods auction market with a custom
Rust program, built for the Solana Summit demo (skipped by a decision on 27 July 2026) — plus
the repository's own older `archive/`, moved on 25 August 2026 to
`StefanBrain/archive/fmcg-protocol-repo/`:

`ANCHOR-PROGRAM.md`, `ARCHITECTURE.md`, `MARKET-ARCHITECTURE.md`, `ECOSYSTEM-LAYERS.md`,
`RESEARCH-PROMPTS.md`, `PLAN-FOR-VLADISLAV.md`, `AI-STORY-HONEST.md`, the two
`FMCG-Plan-for-Vladislav.*` files and `FMCG-What-I-Need-From-Vladislav.docx`, and the repo's
former `archive/` folder (an even older generation, kept as `repo-archive/` inside the same vault
folder).

`ANCHOR-PROGRAM.md` is worth naming specifically: it is a spec for a custom Solana program, and
brief §3 explicitly says *"Not building: a custom on-chain program."* It was the single most
actively misleading document in the repository, which is exactly why it no longer lives here.

None of these are in this repository any more — this section exists so a search for the old
filename ends here instead of nowhere. They are not linked, on purpose: nothing here should
invite a click into the previous product.

**The rule that decided every move:** the repo holds what is true about the code; the vault
holds what we think about the business. A document that goes stale when the code changes belongs
in `docs/`; one that goes stale when the market changes belongs in the vault.

---

## Remaining cleanup

1. Reconcile `adapter-ens` to the `IdentityResolver` contract once ENS is back in scope (debt
   item 1 above).
2. The cross-references *within* the moved documents (their own prose links to each other) were
   not rewritten — several now point across the repo/vault boundary and will not resolve. They
   are archival; treat citations inside them as historical, not navigable.

---

## What this does not claim

Integrity is not truth. VBEL proves a record has not changed since it was signed and anchored —
not that what it says was ever accurate. It is not a qualified electronic ledger under eIDAS 2.0,
not legal evidence in Serbia or Romania, and not a compliance product.
