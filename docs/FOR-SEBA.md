# VBEL — context for Seba

Written 27 August 2026, for the ETH Belgrade × Superteam Balkan hackathon (26–27 Aug, Sava
Congress Center). This is background, not a spec — `TECHNICAL-BRIEF.md` in the repo root is the
spec. This document exists because the brief was written 22 August and several things have moved
since.

---

## 1. What this is, in one paragraph

Two companies depend on one shared business record — a delivery, an acceptance, a correction.
Today that record lives in one party's system, and that party can quietly change it later. VBEL
turns each event into a signed, hashed record whose integrity anyone can check without our
servers, chained to the event before it, and anchored on a public chain so the ordering can't be
rewritten. It does not prove the goods were real. It proves the record wasn't altered after the
fact.

## 2. The framing we're pitching under

The honest objection to any append-only ledger is that it does nothing at the point data is
entered — a false number written to a chain is still false, just notarized-looking. We're not
claiming otherwise. What we're claiming is narrower and defensible: you can't stop the lie at
entry, but you can make it expensive to maintain. Every later event chains to the earlier one and
is counter-signed by the other party. Keeping a lie alive means re-committing to it in front of a
counterparty, permanently, in public. Break it once — one physical recount, one whistleblower —
and every downstream record that depended on it is provably contaminated, not just disputed.

Two lines carry this in the pitch: *"we don't stop you from lying, we make you commit to it"* and
*"break it once, it breaks everywhere."*

## 3. Format and room

3-minute pitch, 4-minute live Q&A, ETH-track judging in the room. Solana-track judging is async —
a submission video and a deployed link, watched with no chance to ask a follow-up. These are
different deliverables: the live pitch can leave gaps for Q&A to fill, the async submission has to
be self-evident in the first ten seconds with nobody there to explain it.

13 teams total. Ten of them are asset-tokenization plays of one kind or another — tokenized
silver, tokenized fossils, tokenized beehives, equity-linked rounds, stablecoin shopping agents,
yield aggregators. Three aren't: an on-chain analytics tool, an AI tutoring product, and this one.
Most teams have some AI/agent angle; Superteam Balkan's own framing at the opening was that most
transactions online will soon be agent-handled.

That last point connects to something already in our own research from before this hackathon was
scoped: the same primitive — knowledge with provenance, rules that can't be skipped, proof they
weren't — showed up independently in an unrelated project (a rule-governance tool for an
automotive internship) a month before this event started. An agent that transacts on someone's
behalf can't be cross-examined and doesn't keep an email thread; either it signed at the time or
the fact is gone. That's the same gap this fills for two human counterparties, applied to a
non-human one.

## 4. Architecture as built

Monorepo, pnpm workspaces, TypeScript strict throughout.

```
packages/core              no I/O, no chain dependency — envelope, hash, sign, verify, lifecycle
packages/config             env parsing/validation per adapter
packages/domain-delivery    dispatch / acceptance / correction payload schemas + builders
packages/adapter-solana     LedgerAdapter over SPL Memo, devnet
packages/adapter-identity-static   IdentityResolver over an explicit signed registry
packages/adapter-ens        ENS read + subname/text-record management — not yet an IdentityResolver
apps/web                    Next.js issue+verify UI
apps/demo-cli               same scenario in Node, stage fallback if the browser fails
```

The rule that makes this modular: `packages/core` imports nothing from any adapter or domain.
Everything else plugs into it through one of three interfaces:

- **Domain** — which document types exist, what fields they carry. `domain-delivery` is the only
  one built.
- **Ledger** — `LedgerAdapter`: `anchor()`, `verify()`, `network()`. `adapter-solana` is the only
  implementation.
- **Identity** — `IdentityResolver`: given an `issuerId` and a timestamp, return the
  attestation binding a key to that issuer at that time, or null. `adapter-identity-static`
  implements this. `adapter-ens` does not yet — it predates the interface and carries its own
  parallel concept.

`issuerId` on the envelope is a plain string. Nothing in `core` cares whether it resolves to a
company, an ENS name, a `did:web`, or a delegated agent key — that's entirely what the resolver
decides.

## 5. What's cryptographically solid

- RFC 8785 canonical JSON, own implementation with guards against `undefined`, large integers as
  numbers, `NaN`/`Infinity`/lone surrogates — not the `json-canonicalize` library the brief named,
  written and tested directly.
- `eventHash = sha256(canonicalize(envelope))`, envelope never contains its own signature.
- ed25519 signing (`@noble/ed25519`) — issuer signature always present, counter-signature
  optional, signed over the *previous* event's hash rather than the current event's own hash (a
  claim of "I've seen and agree with exactly that prior content").
- `payloadHash` on the envelope commits to an off-chain document; `verifyPayload` recomputes and
  compares.
- `diffPayloads` names which field changed between two JSON documents, for the case where a hash
  mismatch alone isn't informative enough to show on stage.
- Lifecycle: `ACTIVE` / `SUPERSEDED` / `REVOKED`. An event's own envelope never mutates — status is
  derived by scanning later events for `supersedes`/`revokes` pointers. A correction is a new
  event, the old one stays visible with a reason attached.
- `validateChain` checks that `previousEventHash` links resolve and that `supersedes`/`revokes`
  point at events that exist.
- Identity: `IssuerAttestation` (`issuerId`, `publicKey`, `attestedBy`, `validFrom`/`validUntil`,
  optional signature) plus `IdentityResolver`. Resolution is time-scoped — an event from January
  checks against whatever key was valid in January, not whatever the issuer rotated to since.
  `verifyEvent` reports `identityChecked: false` when no resolver was passed, rather than silently
  implying identity was confirmed.
- `SolanaMemoAdapter`: anchors `{ h: eventHash, ...metadata }` as an SPL Memo transaction on
  devnet, and separately can re-fetch a transaction, parse the memo, and confirm it matches — that
  read-back path exists and is tested but is currently only exercised from `demo-cli` and a smoke
  script, not from the web app.
- 52 tests passing across the workspace as of this writing.

One divergence from `TECHNICAL-BRIEF.md` worth knowing about explicitly: the brief's frozen v0.1
envelope shows `status: ACTIVE | SUPERSEDED | REVOKED` as a field the issuer sets directly. The
shipped schema only allows `ACTIVE | REVOKED` on the envelope itself and derives `SUPERSEDED`
externally, for the reason above — an old envelope can't change without breaking its own hash.
The code's approach is the one that's actually consistent with "records are never overwritten";
the brief's example just predates it.

## 6. What's built but not wired together

- `adapter-identity-static` is fully implemented and tested, but the web app never constructs one
  or passes it into `verifyEvent`. Every keypair in the browser demo is generated fresh on page
  load (`generateKeyPair()` in `scenario.ts`), with no binding to any real-world identity at all.
- `SolanaMemoAdapter.verify()` — the function that actually re-checks a transaction on-chain — is
  not called anywhere in `apps/web`. The UI shows an explorer link after anchoring but never
  fetches it back and confirms it.
- `adapter-ens` has working read (`resolve.ts`) and write (`manage.ts`, subname + text record
  management) but implements no shared contract, so nothing else in the system can call it
  generically the way it calls `LedgerAdapter` or `IdentityResolver`.
- `.env` currently targets ENS `sepolia`, with `ENS_PARENT_NAME` unset — no name has been
  registered yet.

## 7. What doesn't exist at all

- **Persistence.** Records live in React state in the browser and are lost on refresh, anchor
  receipts included. The "tamper with the stored payload" demo step mutates that same in-memory
  state — it's a real mutation of a real document, not a canned invalid state, but nothing outside
  that browser tab ever sees it.
- **Transport between the two parties.** Both the supplier's and the buyer's keypairs are
  generated in the same browser session. Nothing moves an event from one company to another —
  no delivery, no pending/received state, no notification. The counter-signing logic is correct;
  there's no channel for it to operate over in practice.
- **Auth on `/api/anchor`.** The route holds the issuer's Solana secret key and will anchor
  whatever hash is POSTed to it. No authentication exists. Fine on devnet, not fine anywhere real
  money or a real issuer key is involved.
- **A view of the "blast radius"** — given one event marked as false, walking forward through
  `previousEventHash` and `supersedes`/`revokes` links to show everything downstream that depends
  on it. The chain-validation graph this would read from (`validateChain`'s output) already
  exists; nothing currently renders it as a graph.
- **Any index or search over anchored events.** The Solana memo already carries a `ref` field
  (the subject id) alongside the hash, so `getSignaturesForAddress` filtered by that field is a
  workable lookup path at small scale — but nothing implements it yet.
- **A live deployment.** Nothing is currently hosted anywhere; the app only runs locally.
- **A submission video.**

## 8. Regulatory grounding behind the pitch, briefly

Serbia's *Zakon o elektronskim otpremnicama* (94/2024) mandates state-run e-delivery-notes,
private-sector-obligatory from 1 October 2027 — free, legally binding, and it will cover most of
what a delivery-acceptance demo shows. The three things it doesn't cover, as far as the research
found: correction after physical-receipt confirmation, a foreign supplier with no account in the
Serbian system, and any document that isn't a delivery note. ESPR (product passports) explicitly
excludes food and feed by article. None of this is a claim we make onstage as compliance — it's
the reason the wedge exists rather than competing with something the state is already building for
free. Full sourcing with confidence tags is in `docs/RESEARCH-EOTPREMNICA.md` and
`docs/RESEARCH-FINDINGS-ETH-BELGRADE.md`.

What we explicitly don't claim, anywhere: not a qualified electronic ledger under eIDAS 2.0, not
legal evidence in Serbia or Romania, not a compliance product, not proof that the underlying goods
or facts were real — only that the record of them hasn't been altered since it was signed.
