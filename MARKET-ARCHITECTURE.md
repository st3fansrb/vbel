# Market architecture

> Written 27 July 2026. Scope: the surplus market, built for the Solana Summit demo but
> shaped so the production path does not require a rewrite.
>
> Layer context: [ECOSYSTEM-LAYERS.md](ECOSYSTEM-LAYERS.md). Program detail:
> [ANCHOR-PROGRAM.md](ANCHOR-PROGRAM.md).
>
> **[OPEN]** marks a decision not yet made. Do not silently resolve one in code.

---

## 1. The one decision everything hangs on

**Settlement is a port with two adapters.** The only thing that differs between the demo
and production is *who holds the money*.

```ts
interface SettlementAdapter {
  hold(saleId, buyerRef, amountMinor, currency): Promise<HoldRef>
  release(holdRef, sellerRef, feeMinor): Promise<void>
  refund(holdRef): Promise<void>
  status(holdRef): Promise<HoldStatus>
}
```

| Adapter | Holds the money | Used for |
|---|---|---|
| `OnChainEscrowAdapter` | Anchor program vault, SPL test token, devnet | the demo |
| `PspEscrowAdapter` | licensed PSP (Mangopay / Stripe / Adyen) | production |

Nothing else in the system knows which adapter is live. The lot, the auction, the price
curve, the pickup flow and the event log are settlement-agnostic. Switching to a PSP
replaces one implementation, not the product.

**Why this matters legally:** holding buyer funds ourselves is money remittance under
Romanian Law 209/2019 and Serbian Law on Payment Services art. 10. The technical-service
exemption survives *only* if we never possess the funds. See
[RESEARCH-FINDINGS.md](RESEARCH-FINDINGS.md) §4. The demo adapter is a devnet
demonstration of a mechanism, and must be labelled as such on stage.

**[OPEN]** No single PSP covers both markets — Stripe does not support Serbia as an
account country. Partner research pending.

---

## 2. Permanent vs. swappable

| Permanent | Swappable |
|---|---|
| lot identity and schema | who holds the money |
| the price curve | settlement currency |
| bid mechanics and winner determination | how much of the record is on-chain |
| pickup confirmation and dispute states | which chain, or none |
| the event log | client framework |
| org / location / role model | |

**If anything in the left column depends on anything in the right column, the layering is
wrong.** That is the single review question for any PR.

---

## 3. The shared lot schema

The same object in both products. Written once here so the market and the producer app
never diverge. Postgres is the operational source of truth; the chain anchors a subset.

```sql
lot
  id                uuid pk
  org_id            uuid not null      -- owning organisation, NEVER a user id
  location_id       uuid not null      -- operating point / branch
  gtin              char(14)           -- GS1; null when unbarcoded
  product_name      text not null
  brand             text
  category          text
  lot_code          text               -- the producer's own batch code
  quantity          numeric not null
  unit              text not null      -- kg | l | buc | pallet
  expiry_date       date not null
  expiry_kind       enum not null      -- use_by | best_before
  storage_temp      enum               -- ambient | chilled | frozen
  produced_at       date
  cost_basis_minor  bigint             -- off-chain only, never published
  status            enum               -- in_stock | listed | sold | written_off
  created_at        timestamptz
  created_by        uuid
```

Three fields carry more weight than they look:

- **`org_id` / `location_id`, never `user_id`.** Frigo scopes everything as
  `users/{uid}/pantry`. A producer with ten operating points needs organisation ownership
  with roles — branch operator writes, HQ reads everything. Getting this right now costs
  nothing; retrofitting it is a migration.
- **`expiry_kind`.** In the EU, selling after a *use by* date is prohibited; after a
  *best before* date it is permitted if the food is safe and labelled. The whole product
  lives on that line, so it must be a typed field the system can enforce on — not a note.
- **`cost_basis_minor` never leaves the org.** It is what makes a floor price sensible and
  it is exactly what a buyer must never see.

### On-chain subset

Only what the auction needs in order to be independently verifiable:

`seller_pubkey · lot_hash · gtin · quantity · unit_code · expiry_day · location_hash`

`lot_hash` is `sha256` over a canonical serialisation of the row above. Anyone holding the
off-chain record can prove it is the one that was listed. **No commercial terms, no
documents, no prices beyond the auction parameters.** This keeps the confidentiality
decision open instead of forcing it.

---

## 4. The auction

### Price curve

Discrete descending steps. Deterministic function of on-chain parameters only:

```
P(t) = max(floor_price, start_price − step × ⌊(t − start_ts) / interval⌋)
```

Parameters (`start_price`, `floor_price`, `step`, `interval`, `start_ts`, `end_ts`) live on
the `Listing` account. Anyone can compute the price at any timestamp without trusting the
server.

**This is the honest "why on-chain" argument:** the price is a function of time that
neither the seller nor the platform can manipulate. Not "data cannot be falsified" —
something narrow, true and checkable.

### Bids

- A buyer may **buy at the current price**, or leave a **standing maximum** with funds held.
- The **highest standing maximum wins** the moment the clock reaches it, and pays the
  **step price**, not their maximum.
- The **best standing maximum is visible** — amount only, never identity.
- Losing bids are refunded in full at settlement.

Buying now is not a separate instruction: it is a standing maximum placed at exactly the
current price, which settles immediately.

**Worked example.** 10,000 l of milk, 12 days left. Start €0.80/l, floor €0.30, step €0.05
per day. Buyer A leaves a maximum of €0.62. The clock steps 0.80 → 0.75 → 0.70 → 0.65 →
0.60; at 0.60 A's maximum is satisfied, so A wins **at 0.60**, below their own maximum. If
B sees the standing €0.62 and leaves €0.66, B wins earlier at **0.65** — €500 more to the
producer on that lot.

The visible best maximum is what creates the competition. Demand pushes the price up while
the clock pushes it down, and they meet.

### Two known risks

**Shill bidding by the seller.** Blocked in the program: the seller's authority and its
`org_hash` cannot bid on their own lot. Bids are funded, so faking one costs money.

**The clock going decorative** — buyers compete early and the lot sells on day one. That is
a good outcome for the seller, but know it can happen so it does not surprise you on stage.
The clock becomes the deadline, not the price setter.

### Supply is context, not mechanism

Showing *"3 similar lots listed"* next to the price is useful. Feeding available supply
*into the curve* is not: it turns the price back into a number computed by our server and
destroys the determinism that justifies the chain at all. Buyers adjust their own maximum.
Same economic effect, clean mechanism.

---

## 5. Pickup confirmation — the oracle, honestly

The chain cannot observe a pallet leaving a warehouse. The design says so:

1. Seller marks **handover**.
2. Buyer **confirms pickup** → escrow releases.
3. If the buyer does not confirm within `auto_release_after` (default 48h from handover),
   it releases automatically.
4. Either party may **open a dispute** → state becomes `Disputed`, the escrow freezes, and
   **resolution happens off-chain, by the operator.**

Do not pretend the program adjudicates. It records state; humans resolve. That is what
every real marketplace does, and having the answer ready beats improvising it in Q&A.

**[OPEN]** Partial acceptance — buyer takes 8 of 10 pallets. Out of scope for the demo;
the state machine should not make it impossible later.

---

## 6. Five rules that prevent a rewrite

1. **Organisation-scoped data from the first commit.** Never `user_id` on a lot.
2. **Postgres is the operational source of truth; the chain is an anchor** for the subset
   that needs verification. If the chain's role shrinks, the application does not collapse.
3. **On-chain: hashes and auction parameters only.** No commercial terms, no documents.
4. **`listing.visibility = public | invited` from day one.** A field now, a rewrite later —
   and it is the unresolved channel-conflict question (a public distress auction teaches
   contracted buyers to wait for the discount). The demo uses `public`.
5. **Every state change is an appended event, never an edited field.** Same rule in both
   products, so the histories are comparable.

---

## 7. Stack

| Piece | Choice | Why |
|---|---|---|
| Program | Anchor / Rust, devnet | the demo's settlement + auction record |
| API | TypeScript, Postgres | operational truth, indexing, off-chain reads |
| Client | React + TS, Solana wallet-adapter | wallet tooling is JS-first; fighting it in Flutter would cost the weeks we do not have |
| Producer app (later) | React + TS, fork of Frigo's *logic* | see §8 |

One language across market, app and API. For a solo developer already carrying Rust as a
new stack, that is the largest available simplification.

---

## 8. What actually ports from Frigo

The valuable part of [github.com/st3fansrb/frigo](https://github.com/st3fansrb/frigo) is
logic and data, not UI — a few hundred lines, roughly two to three days to port to TS:

- EAN-13 normalisation and the Open Food Facts resolution chain (`product_resolution_service.dart`).
  GTIN is the same identifier for FMCG.
- Waste computation in `deleteItemWithTracking` — it already distinguishes wasted from
  consumed and accumulates `kgWasted`. That is the metric the EU 2025/1892 argument rests on.
- Expiry maths (`daysUntilExpiry`) and the fresh-produce shelf-life dataset.
- The `FoodItem` shape, which is roughly 80% of the lot schema in §3.

Not portable: meal planner, recipes, shopping list, cart, Nutri-Score — 21 of ~72 Dart
files, all consumer-facing. And the Firestore per-user ownership model, which §6 rule 1
replaces.

---

## 9. What the chain still does in production — stated plainly

Once money moves through a PSP, the chain's remaining job is the **verifiable auction
record**: who committed what maximum, who won, at which price, at which timestamp.

That is modest. It is also real, because it answers the accusation that kills a
marketplace — *"the seller gave the lot to a friend at a lower price."* A bid log that the
operator itself cannot rewrite is a neutrality argument, not a security one.

The on-chain escrow path stays viable for a subset: crypto-native buyers and cross-border
Serbia→Romania settlement, through a licensed CASP. Not the main road. Not dead either.

Do not claim more than this on stage.
