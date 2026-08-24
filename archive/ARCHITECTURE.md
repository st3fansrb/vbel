# MVP Architecture — dual-attested goods ledger

> ## ⚠️ SUPERSEDED — 27 July 2026
>
> This describes a product that is not being built. Serbia legislated dual attestation of
> deliveries as a free mandatory state system (e-otpremnica / e-prijemnica, private sector
> from 1 October 2027), and electronic goods-receipt confirmation already runs as EDI
> between large Romanian chains and their suppliers. Evidence:
> [RESEARCH-FINDINGS.md](../RESEARCH-FINDINGS.md) §2.1 and §5.1.
>
> **Current build spec:** [MARKET-ARCHITECTURE.md](../MARKET-ARCHITECTURE.md) ·
> [ANCHOR-PROGRAM.md](../ANCHOR-PROGRAM.md)
>
> **Still worth reading:**
> - **§1** — the append-only invariant and "a correction is a new event, never an edit".
>   Carried forward into the new design.
> - **§2 [OPEN — C7]** — public amounts vs. commercial secrecy. Still unresolved, now
>   tracked as `listing.visibility` in [MARKET-ARCHITECTURE.md](../MARKET-ARCHITECTURE.md) §6.
> - **§9 risk register** — the risks were about the team, not the product, and they still apply.
>
> **Dead:** the entire data model, all eight instructions, the demo flow in §6, and the
> build order in §8.
>
> ---
>
> Working document for the build. Scope is the Solana Summit demo, nothing beyond it.
> Written 25 July 2026. Anything marked **[OPEN]** is a decision not yet made — do not
> silently resolve it in code.

---

## 1. The invariant everything is built around

**No party can unilaterally change a value another party attested.**

This is the whole product in one sentence. It is what makes the BiH falsification problem
solvable, and it is what makes the goods receipt trustworthy enough to hang a receivable on.

Three rules that follow, and that no instruction may break:

1. **Append-only.** A correction is a *new* event referencing the previous one. There is no
   instruction that mutates an attested field. Not for admin, not for demo convenience.
2. **Two signatures, or no status.** A shipment declared by the producer and not confirmed by
   the receiver never reaches `Confirmed`, and therefore never produces a receivable.
3. **A discrepancy is a first-class state, not an error.** Declared 100 / received 96 is
   recorded, visible to both, and closable only by a further signed event from both sides.
   This is the demo's key moment — it must be a real program state, not UI.

---

## 2. On-chain vs off-chain

| On-chain | Off-chain |
|---|---|
| goods events (declare, confirm, discrepancy) | invoice PDFs, delivery notes, contracts |
| lot identity, quantity, expiry date | prices, commercial terms, negotiated discounts |
| receivable object: amount, due date, status | AI extraction, OCR, document parsing |
| payment events, early-settlement discount | score computation, dashboards, alerts |
| payer counters that feed the score | e-invoice API traffic (SEF / e-Factura) |

Documents never go on-chain. Only `sha256(document)` does, so anyone holding the file can
prove it is the one that was attested.

**[OPEN — C7]** Amounts are public in the MVP. Confidential transfers (Token-2022) are the
right long-term answer for commercially secret figures, but they conflict with a publicly
derived score and would consume the whole build window. Decision: ship public, say so on
stage, name confidential transfers as the next step.

---

## 3. On-chain data model (Anchor)

Deliberately small. Stefan has written zero Anchor code so far; the program stays under
~500 lines and uses no CPI beyond a single SPL token transfer.

```
Party            PDA ["party", authority]
  authority: Pubkey
  role: Producer | Receiver | Financier
  jurisdiction: [u8; 2]        // "RS" | "RO" | "BA"
  name_hash: [u8; 32]

Shipment         PDA ["shipment", producer, ref_hash]
  producer: Pubkey
  receiver: Pubkey
  ref_hash: [u8; 32]           // sha256 of the delivery note
  status: Declared | Confirmed | Discrepancy | Superseded
  declared_at / confirmed_at: i64
  supersedes: Option<Pubkey>   // append-only corrections
  lines: Vec<LotLine>          // capped, see note

LotLine
  gtin: [u8; 14]
  lot_code_hash: [u8; 32]
  qty_declared: u32
  qty_confirmed: Option<u32>
  expiry: i64                  // unix day

Receivable       PDA ["receivable", shipment]
  shipment: Pubkey
  einvoice_ref_hash: [u8; 32]  // SEF / e-Factura document id, hashed
  amount_minor: u64
  currency: [u8; 3]
  issued_at / due_at: i64
  status: Draft | Confirmed | Offered | Settled | Cancelled
  discount_bps: u16            // 0 unless an early-payment offer was accepted
  settled_at: i64

PayerRecord      PDA ["payer", receiver]
  invoices_total: u32
  invoices_settled: u32
  sum_days_to_pay: u64         // score is derived off-chain from these counters
  sum_days_early: u64
  last_event_at: i64
```

`lines` as a `Vec` inside `Shipment` caps how many lots fit in one account. Fine for the
demo (≤ 20 lines). The scaling answer — one compressed account per lot, via state
compression — is a talking point, not a build item.

---

## 4. Instructions

| # | Instruction | Signer | Effect |
|---|---|---|---|
| 1 | `register_party` | self | creates `Party` |
| 2 | `declare_shipment` | producer | creates `Shipment` with lot lines, status `Declared` |
| 3 | `confirm_receipt` | receiver | fills `qty_confirmed`; all match → `Confirmed`, any mismatch → `Discrepancy` |
| 4 | `supersede_shipment` | both | new `Shipment` pointing at the old one; old becomes `Superseded`, never edited |
| 5 | `anchor_invoice` | producer | creates `Receivable` from a `Confirmed` shipment + e-invoice hash |
| 6 | `offer_early_payment` | producer | sets `discount_bps` and a validity window → `Offered` |
| 7 | `settle_early` | receiver | SPL transfer to producer at discounted amount → `Settled`, updates `PayerRecord` |
| 8 | `settle_at_maturity` | receiver | same without discount |

Guards worth writing tests for first, because they are what a judge will probe:

- `anchor_invoice` **must** reject a shipment in `Declared` or `Discrepancy`. No confirmation → no receivable. This is the licence-safe boundary and the trust boundary at once.
- `confirm_receipt` is callable exactly once per shipment; corrections go through `supersede_shipment`.
- No instruction accepts the producer's signature for a receiver-owned field, or vice versa.

Expiry alerts are **not** an instruction. Expiry dates live on-chain; the job that scans them
and raises an alert is an off-chain reader. Do not put scheduling logic in the program.

---

## 5. Off-chain components

- **Capture client** — derived from Frigo. Reuse: lot/expiry data model, inventory screens, FEFO logic. Discard: everything consumer-facing, and Firebase as the source of truth (truth moves to the ledger). Two roles, two wallets, one screen each. **[OPEN]** Flutter reuse vs. a fresh web client — depends on how much of Frigo is actually salvageable.
- **Document pipeline** — upload → `sha256` → local extraction (Ollama + Qwen2.5-Coder) into a strict JSON schema → human confirms or corrects → transaction. The AI extracts and flags inconsistencies. It never scores credit and never decides anything. That framing is non-negotiable; see [AI-STORY-HONEST.md](AI-STORY-HONEST.md).
- **Score service** — reads `PayerRecord` counters, computes days-to-pay statistics, renders them. At launch there is no real history, so the demo shows the *mechanism* with history explicitly labelled as simulated, and the discount rate comes from contractual terms. Saying this out loud on stage is the strongest available answer, not a weakness.
- **e-invoice anchor** — the MVP hashes an e-invoice reference in the real SEF / e-Factura format without calling the live API. **[OPEN]** Verify API access for both systems before claiming any integration anywhere.

---

## 6. Demo flow → code path

| Beat | What runs |
|---|---|
| producer ships, lot 100 units, exp 12.03 | `declare_shipment` |
| receiving confirms 96 → mismatch, live | `confirm_receipt` → `Discrepancy` |
| confirmed receipt creates the receivable | `confirm_receipt` (clean lines) → `anchor_invoice` |
| pay day 10 instead of day 100, −1.8% | `offer_early_payment` → `settle_early` + SPL transfer |
| lot near expiry surfaces | off-chain reader over `LotLine.expiry` |

The demo needs two shipments: one that goes clean through to settlement, one that produces
the discrepancy. Do not try to make a single shipment do both.

---

## 7. Explicitly out of scope

Pool, marketplace, yields, tranches, ML credit scoring, full KYC, automated legal assignment,
a tradable token per invoice, SAP/Navision integration, mainnet, multi-tenant anything,
production auth, confidential transfers, state compression, and any claim about guaranteed
capital.

Each of these was rejected for a stated reason in [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) §5.
Reintroducing one silently is how a three-week build becomes a three-month one.

---

## 8. Build order

**Window A — 26 July → 8 Aug, Stefan alone**
1. Anchor toolchain, `hello world`, one devnet transaction. Nothing else until this exists.
2. `Party`, `Shipment`, `LotLine`, `declare_shipment`, `confirm_receipt` incl. the discrepancy path.
3. Tests for the three guards in §4.
4. Application submitted.

**Window B — 8 → 26 Aug, both**
5. `Receivable`, `anchor_invoice`, `offer_early_payment`, `settle_early` with an SPL test token.
6. Capture client, two roles, two wallets, real anonymised documents from Vladislav.
7. `PayerRecord` counters + score dashboard, history labelled as simulated.
8. Document extraction pipeline.
9. Expiry reader.
10. Final week: freeze features, rehearse the 3 minutes, drill the 6 minutes of Q&A.

**Deadline is unconfirmed** — Vladislav checks with the organisers on Monday. If it lands
before 26 August, cut in this order: expiry reader, extraction pipeline, score dashboard.
Never cut the discrepancy path or the settlement — those two *are* the pitch.

---

## 9. Risk register for the build

| Risk | Mitigation |
|---|---|
| Zero Anchor experience, three weeks | Small program, no complex CPI, ship §8.1 before touching anything else |
| Vladislav unavailable until 8 Aug | Window A depends on nothing from him except the 1 hour listed in [PLAN-FOR-VLADISLAV.md](PLAN-FOR-VLADISLAV.md) §6 |
| No real documents arrive | The demo stays a mockup and the pitch loses. This is the single highest-impact dependency |
| Non-assignment clauses in supply contracts | Unknown. Does not block the MVP (we never assign anything), blocks the financing layer. Read a real contract before promising layer 3 |
| "On-chain means it can't be falsified" said on stage | It is false and it will be attacked. The correct formulation is in [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) §9 |
