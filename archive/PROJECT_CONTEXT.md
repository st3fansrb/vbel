# FMCG Protocol — Project Context

> ## ⚠️ SUPERSEDED — 27 July 2026
>
> The product described here — a dual-attested goods receipt ledger — was killed by the
> research two days after this document was consolidated. Serbia legislated the same thing
> as a free, mandatory state system (`Zakon o elektronskim otpremnicama`, Sl. glasnik RS
> 94/2024, private sector from 1 October 2027). Evidence:
> [RESEARCH-FINDINGS.md](../RESEARCH-FINDINGS.md) §2.1 and §8.
>
> **Current plan:** [ECOSYSTEM-LAYERS.md](../ECOSYSTEM-LAYERS.md) ·
> [MARKET-ARCHITECTURE.md](../MARKET-ARCHITECTURE.md)
>
> **Still live in here, and still binding:**
> - **§13 language discipline** — the phrases that must never appear in a pitch or deck.
>   Unchanged and still the rule.
> - **§2 team**, including the warning that an ex-Deloitte freelancer is never
>   "Deloitte is our consultant".
> - **§5** — the register of rejected alternatives and why. Do not re-litigate these.
> - **§14 working style.**
>
> **Dead:** §1 thesis, §4 the flow, §6 truth anchors, §10 demo scope, §12 open items.
> §3 and §8 are superseded by [RESEARCH-FINDINGS.md](../RESEARCH-FINDINGS.md), which is
> sourced and current.
>
> ---
>
> Single source of truth. English, for use alongside the codebase.
> Last consolidated: 25 July 2026, after the call with Vladislav and a full reconciliation
> of the earlier documents.
> Companion documents: [ARCHITECTURE.md](ARCHITECTURE.md) (what gets built),
> [PLAN-FOR-VLADISLAV.md](../PLAN-FOR-VLADISLAV.md) (what is being sent to the commercial side).

---

## 1. Thesis

**A shared ledger where a delivery is signed by both sides — so stock data cannot be quietly
rewritten, and a confirmed goods receipt becomes a receivable a third party can trust.**

One event, two products harvested from it:

- **Inventory truth** — lot, quantity, expiry, agreed by both parties. Verified pain (see §3).
- **Cash flow** — the same confirmed receipt lets the buyer pay early at a discount instead of
  on day 100, priced over time by payment behaviour.

Everything that does not serve this loop is out of scope.

## 2. Origin and team

- Merger of two threads: **Frigo** (Flutter/Firebase food-management app) and the FMCG
  receivables concept. Frigo is repurposed as the *capture client* — the interface for the end
  of the chain that has no ERP. It is a data source, not the product.
- **Stefan** — technical lead. Zero Anchor/Rust written so far; ramping up.
- **Vladislav** — commercial side, 20+ years FMCG/retail in Serbia and Bosnia. Has an agent who
  brought a large share of brands into Serbia, plus a local contact in Timișoara. This network
  is the project's strongest asset, stronger than the technology.
- **Availability:** Vladislav is committed to another project until 8 August; fully available
  8–26 August. Window A (now → 8 Aug) is Stefan alone.
- Possible additions, all **unconfirmed**: ex-Deloitte C-level (freelance), blockchain dev
  (review only), security person. None of them counts as team until they confirm role and time.

> ⚠️ An ex-Deloitte freelancer is **not** "Deloitte is our consultant". That phrasing must never
> enter a pitch, deck or README. It is checkable and fatal if wrong.

## 3. The problem — what is verified and what is not

**Verified, first-hand (Vladislav, producer in Bosnia):** keeping stock and expiry data
accurate across the chain was manual and heavy, and branches/suppliers falsified the numbers.
This is the load-bearing pain. It is lived, not deduced, and Vladislav can tell it on stage
with authority.

**Structural, well documented:** FMCG producers in the region are paid 100+ days after invoice.
Terms are routinely ignored. The EU Late Payment Directive (2011/7) already provides statutory
interest and goes unused — suppliers will not sue their largest customer. **This is a power
asymmetry, not a technology gap.** Any design premised on punishing large retailers will not be
signed by large retailers. Design around incentives.

**Not verified — do not build on it:** that double financing of the same invoice is a felt pain.
It was the load-bearing assumption of the earlier "Passport" framing and nobody ever confirmed
it. See also §8: Serbia is building a state registry for exactly this.

**Secondary:** stock nearing expiry is written off. Waste is an economic loss the same data
addresses — as a side effect, not as the product.

## 4. The flow

1. Producer ships and declares the event: lot, quantity, expiry.
2. **Receiver confirms the goods receipt from its own wallet.** Match → confirmed. Mismatch →
   a recorded discrepancy that neither side can close alone, and that nobody can rewrite later.
3. A confirmed receipt, anchored to the state e-invoice, becomes a **receivable** — an object a
   third party can underwrite.
4. **Launch model: dynamic discounting.** The buyer pays *its own* invoice early in exchange for
   a discount. Nobody buys a receivable, nobody lends, no licence in either country.
5. Over time, payment behaviour accumulates on-chain and becomes the price of money: pays on
   day 20 → cheap; day 110 → expensive, or none.
6. Lot expiry data feeds the second harvest: stock approaching its date surfaces automatically
   and triggers discount offers.
7. Later, with licensed factors, third-party capital runs over a registry that already works.

## 5. Design decisions and rejected alternatives

Record of what was considered and discarded. Do not silently reintroduce these.

| Decision | Rejected alternative | Reason |
|---|---|---|
| One receivable = one object, price varies | Token quantity rebases with late/early payment | Variable supply makes the receivable *harder* to underwrite. Also reads as algorithmic-stablecoin rebasing — investors react badly |
| Late interest is **calculated**, not minted | Smart contract "penalises" late payers | A contract cannot pull funds from a bank account. Without pre-funded escrow, on-chain penalties are fiction |
| Incentive framing (early-payment discount) | Punishment framing | The buyer must sign up voluntarily. An early-payment discount is clean margin for a retail CFO. "We penalise you" is not sellable |
| Overlay on existing ERP | "Substitute for ERP" | Producers run SAP/Navision. Nobody rips out an ERP for a startup — two-year sales cycle |
| Frigo as capture client for the ERP-less end of the chain | Frigo as a full ERP-style platform | Same trap as above, one layer down. Frigo is the keyboard for warehouse/branch/small distributor, where paper and Excel live today — and where the falsification happened |
| Dual attestation + state e-invoicing as truth anchor | Trusting single-party data entry | Immutability ≠ truth. The party being disintermediated by transparency has the least incentive to enter accurate data |
| One flow, end to end | ERP + traceability + rail + marketplace + consumer loyalty | That is four companies. Three-week build, three-minute pitch → one flow |
| Dynamic discounting as launch model | Buying/assigning the receivable in the demo | Assignment is factoring. It cannot be demonstrated on stage while claiming no licence is needed |
| Consumer loyalty = one vision sentence | Building the consumer app now | Out of scope |

## 6. Truth anchors (the oracle problem)

The largest design risk. A ledger guarantees that what was written is unchanged, not that it
was true. Answers in priority order:

1. **Dual attestation at goods receipt.** Producer writes, receiver confirms. No confirmation →
   no receivable. This is the primary anchor and the demo's core.
2. **State e-invoicing.** B2B e-invoicing is mandatory and government-validated in both target
   markets — RO (e-Factura) and RS (eFaktura / SEF). Free, legally authoritative anchor for the
   receivable side. **[TODO]** verify current scope and API access for both.
3. **GS1 / EPCIS** for lot and expiry events. Use the standard, not a bespoke format.

**Settlement is the remaining weak point.** Money moves over banking rails (SEPA B2B direct
debit or local equivalent), off-chain. For the MVP, settlement is attested the same way as the
goods receipt — both parties sign that it happened — and an SPL test token demonstrates the
mechanism. Say this plainly; do not imply the chain observes the bank.

## 7. On-chain vs off-chain

**On-chain:** goods events and attestations, the receivable, payment events, payer counters.

**Off-chain:** documents (only hashes go on-chain), prices, contracts, commercial terms,
extraction, scoring, dashboards.

**Answer to "why not a database":** no producer will hand stock or payment data to a platform
owned by a counterparty or a competitor, but all of them can write to a ledger none of them
owns. See §9.

⚠️ **Do not use "prevents double-financing of the same invoice" as the blockchain argument in
Serbia.** See §8 — the state is building exactly that registry, with legal force, for free.

## 8. Regulatory perimeter

**Three models, three answers on licensing:**

| Model | Licence needed? |
|---|---|
| We buy the receivable ourselves | **Yes.** RS: factor must be a bank, a licensed company (min. capital 40m RSD ≈ €340k), or a foreign entity in international factoring only. RO: non-bank financial institution registered with BNR. Not viable |
| Pure infrastructure — never own the receivable, never advance funds, match producers with licensed factors, take a platform fee | **No licence for us.** Risk: if we set the price, control the flow and take part of the spread, a regulator may look through form to substance |
| **Dynamic discounting** — buyer pays *its own* invoice early for a discount | **No factoring at all.** Early settlement of a commercial debt under civil law. This is the launch model, and it is how C2FO started |

**Decision: model 3 is the launch model.** Model 2 is the growth path once a licensed partner
exists. Model 1 is not on the roadmap as a self-operated activity.

**Trap:** fractionalising the receivable and offering it to multiple investors swaps a
factoring-licence problem for a **securities / prospectus** problem. Bigger, not smaller.

**Serbia — regulatory change, December 2025.** The Law on Factoring was amended: supervision
moved from the Ministry of Finance to the **Securities Commission**, which now licenses and can
sanction unauthorised factoring; and a **central electronic factoring registry**, interconnected
with e-invoicing, is being established to prevent multiple assignment of the same receivable.
Consequences: an active regulator polices unlicensed factoring, and the anti-double-financing
argument for a blockchain is gone in this market.

*None of this is legal advice. Before any commitment, get an hour with a Serbian lawyer.*

**Unresolved and high priority: non-assignment clauses.** Retail supply contracts frequently
prohibit assignment of the receivable without written consent. This does not block the MVP —
we never assign anything — but it shapes the entire financing layer. **Action: get a template
supply contract from Vladislav's network and read it.** Not a coding task.

## 9. Why Solana (expect this in Q&A)

**Do not say "on-chain data cannot be falsified".** It is false, it contradicts §6, and it is
the easiest claim in the pitch to demolish: if a branch writes 96 when there are 90, the ledger
faithfully stores the lie.

The correct answer, in this order:

1. **Dual attestation.** Falsification is not stopped by immutability. It is stopped by
   requiring two parties with opposing interests to sign the same fact — and neither can close
   a discrepancy alone.
2. **Append-only.** History cannot be rewritten retroactively. This kind of fraud is almost
   always committed *after* the fact, by "adjustment".
3. **Nobody owns the registry.** A producer will not let its distributor host the truth about
   its own stock, and vice versa. Two competing producers never accept one another's database.
   There is no neutral operator — the textbook case for a shared ledger. Each new counterparty
   is a connection, not an integration project.

**Stage formulation:** *"A ledger does not make data true. It makes it impossible to rewrite
retroactively, and it forces two parties with opposing interests to sign the same fact. The
difference from an ERP is that the registry belongs to neither of them."*

Secondary, if pushed: **the RS→RO corridor** — SEF and e-Factura are both mandatory and do not
talk to each other; national registries stop at the border. Then: near-zero cost for a high
volume of small writes, with state compression as the scaling path for per-lot records.

## 10. Demo scope (Solana Summit)

**In — one complete flow, no screen-hopping.** Full beat-by-beat script and the code path for
each beat: [ARCHITECTURE.md](ARCHITECTURE.md) §6.

1. Producer declares a shipment: lot, 100 units, expiry 12.03.
2. Receiving confirms 96 → **the discrepancy appears live, signed by both.** The moment of the
   pitch.
3. A clean confirmed receipt creates the receivable.
4. Buyer pays on day 10 instead of day 100 at a discount, settled with a test token.
5. A lot nearing expiry surfaces automatically.
6. One vision sentence about the financing layer. No numbers, no entity structures on stage.

**Pricing in the demo:** the discount rate comes from contractual terms; the score is shown as
mechanism with history **explicitly labelled as simulated**. Saying "we have no real payment
data yet, we are showing the mechanism" is the strongest available answer in front of this
audience, not a weakness.

**Out:** pool, marketplace, yields, ML credit scoring, full KYC, automated legal assignment,
per-invoice tradable token, ERP integration, mainnet, multi-tenant, production auth,
confidential transfers.

**Judging format:** 3 min pitch/demo + 6 min Q&A. The Q&A is the heavier half.

## 11. Markets

**Serbia and Romania, both.** Vladislav has the Serbian agent and a Timișoara contact; both
countries have mandatory state e-invoicing. Bosnia is the region with no state registry at all
and is the strongest future gap, but the access there is a past engagement, not a live channel.

**[OPEN]** Which country produces a live first user faster — Vladislav's call.

## 12. Open items

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | Demo Day deadline confirmed with organisers | Vladislav | Monday |
| 2 | The BiH story recorded in detail | Vladislav | this week |
| 3 | One anonymised invoice + delivery note | Vladislav | this week |
| 4 | Written time commitment for 8–26 Aug | Vladislav | this week |
| 5 | Retail supply contract — non-assignment clause | Vladislav | before 8 Aug |
| 6 | Who physically signs the goods receipt, on what device | Vladislav | before 8 Aug |
| 7 | SEF / e-Factura API scope and access | Stefan | before 8 Aug |
| 8 | How much of Frigo is salvageable | Stefan | before 8 Aug |
| 9 | Project name — "Receivables Rail" no longer describes half the product | both | before applying |
| 10 | Letter of intent from one producer | Vladislav | Aug |
| 11 | Equity structure | both | after the joint sprint |

A signed letter of intent from one producer is worth more to the judges than any of the
architecture.

## 13. Language discipline

Phrases that must not appear in a pitch, deck, README or code comment:

- "substitute for ERP" → *a layer on top of ERP*
- "we penalise late payers" → *we price money by payment behaviour*
- "Deloitte is our consultant" → *advisor with 15 years at Deloitte, freelance*
- "blockchain guarantees the data is accurate" / "on-chain it cannot be falsified" →
  *the ledger records attestations from two parties with opposing interests, plus
  state-validated e-invoices, and nobody can rewrite them afterwards*

## 14. Working style notes

- Stefan prefers direct, honest, "brutal" assessment over validation.
- For messages to busy contacts: several short messages, not one dense paragraph.
- Multiple AI systems used in parallel; independent convergence treated as signal.

## 15. Files

**Active — root:** this document, [ARCHITECTURE.md](ARCHITECTURE.md),
[PLAN-FOR-VLADISLAV.md](PLAN-FOR-VLADISLAV.md), and [AI-STORY-HONEST.md](AI-STORY-HONEST.md)
— the last one because its core rule is still binding: the AI extracts and flags, it never
scores credit and never decides.

**Superseded — [archive/](archive/):** the earlier full-factoring vision and the "Passport"
pivot, including the three Passport-era diagrams. Still valuable as risk analysis, but they are
**not** the current plan and they contradict this document in places. See
[archive/README.md](archive/README.md) for what is reusable and what is dead.
