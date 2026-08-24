# Anchor program spec — `surplus_market`

> Written 27 July 2026. This is the build artifact for the next three weeks and will change
> weekly. The durable reasoning is in [MARKET-ARCHITECTURE.md](MARKET-ARCHITECTURE.md).
>
> Written for someone who has not shipped Rust before. Scope is deliberately small: no CPI
> beyond SPL token transfers, no cross-program composition, target under ~600 lines.

---

## 1. Scope discipline

**In:** lot registration, listing with a descending step curve, funded standing bids,
settlement at the step price, handover and pickup confirmation, refunds.

**Out, and it stays out:** partial acceptance, disputes resolved on-chain, reputation
counters, multi-currency, fee splitting to third parties, upgradeable authority games,
state compression, confidential transfers.

Every one of these was cut for a stated reason. Reintroducing one silently is how three
weeks becomes three months.

---

## 2. Accounts

```rust
// PDA ["party", authority]
pub struct Party {
    pub authority: Pubkey,
    pub org_hash: [u8; 32],      // groups branches of one company — blocks self-bidding
    pub jurisdiction: [u8; 2],   // "RS" | "RO"
    pub bump: u8,
}

// PDA ["lot", seller, lot_hash]
pub struct Lot {
    pub seller: Pubkey,
    pub lot_hash: [u8; 32],      // sha256 of the canonical off-chain lot row
    pub gtin: [u8; 14],          // zeroed when unbarcoded
    pub quantity: u64,           // in the unit's smallest sensible increment
    pub unit_code: u8,           // 0 kg · 1 l · 2 buc · 3 pallet
    pub expiry_day: i64,         // unix day, not seconds
    pub location_hash: [u8; 32],
    pub status: LotStatus,       // InStock | Listed | Sold
    pub bump: u8,
}

// PDA ["listing", lot]
pub struct Listing {
    pub lot: Pubkey,
    pub seller: Pubkey,
    pub mint: Pubkey,            // SPL test token on devnet
    pub start_price: u64,        // minor units, per unit_code
    pub floor_price: u64,
    pub step: u64,
    pub interval_secs: i64,
    pub start_ts: i64,
    pub end_ts: i64,
    pub visibility: Visibility,  // Public | Invited
    pub best_bid: u64,           // 0 when none — this is the publicly visible number
    pub best_bidder: Option<Pubkey>,
    pub status: ListingStatus,   // Open | Sold | Expired | Cancelled
    pub bump: u8,
}

// PDA ["bid", listing, bidder]
pub struct Bid {
    pub listing: Pubkey,
    pub bidder: Pubkey,
    pub max_price: u64,
    pub vault: Pubkey,           // token account owned by the bid PDA
    pub created_at: i64,
    pub status: BidStatus,       // Active | Won | Refunded
    pub bump: u8,
}

// PDA ["sale", listing]
pub struct Sale {
    pub listing: Pubkey,
    pub buyer: Pubkey,
    pub price: u64,              // the STEP price, not the bidder's maximum
    pub vault: Pubkey,
    pub status: SaleStatus,      // Held | HandedOver | Released | Disputed
    pub settled_at: i64,
    pub handover_at: i64,
    pub auto_release_after: i64, // handover_at + 48h by default
    pub bump: u8,
}
```

Note `expiry_day` as a unix **day**, not a timestamp — expiry is a date, and storing it as
a date avoids an entire class of timezone bug.

---

## 3. The price function

One function, used by the program and re-implemented identically in the client:

```rust
pub fn current_price(l: &Listing, now: i64) -> u64 {
    if now <= l.start_ts { return l.start_price; }
    let steps = ((now - l.start_ts) / l.interval_secs) as u64;
    l.start_price
        .saturating_sub(l.step.saturating_mul(steps))
        .max(l.floor_price)
}
```

`saturating_sub` and `saturating_mul` are not stylistic — an overflow here is a free lot.

The client must compute the same number from the same on-chain fields. **If the client ever
receives a price from the API rather than deriving it, the central design claim is dead.**

---

## 4. Instructions

| # | Instruction | Signer | Effect |
|---|---|---|---|
| 1 | `register_party` | self | creates `Party` |
| 2 | `create_lot` | seller | creates `Lot`, status `InStock` |
| 3 | `open_listing` | seller | creates `Listing`, lot → `Listed`, validates curve params |
| 4 | `place_bid` | buyer | creates `Bid`, transfers `max_price × qty` into the bid vault, updates `best_bid` if higher |
| 5 | `settle` | permissionless | if `current_price(now) ≤ best_bid`: create `Sale` at the **step price**, move funds, listing → `Sold` |
| 6 | `cancel_bid` | bidder | refunds, only if not currently `best_bidder` |
| 7 | `refund_losing_bid` | permissionless | after `Sold`, returns a non-winning bid in full |
| 8 | `mark_handover` | seller | `Sale` → `HandedOver`, sets `auto_release_after` |
| 9 | `confirm_pickup` | buyer | releases escrow to seller minus fee → `Released` |
| 10 | `auto_release` | permissionless | same, only after `auto_release_after` |
| 11 | `open_dispute` | buyer or seller | → `Disputed`, freezes the vault. Resolution is off-chain |
| 12 | `expire_listing` | permissionless | past `end_ts` with no winner → `Expired`, lot back to `InStock` |

**Buying at the current price is not a separate instruction.** It is `place_bid` at exactly
`current_price(now)` followed immediately by `settle` — one client action, two instructions,
no extra program surface.

`settle` being permissionless matters: neither party can stall a sale by refusing to act.
Any crank, including our own scheduler, can call it.

### Overpayment refund

A bid escrows `max_price × quantity` but settles at the step price, which is lower. The
difference must return to the buyer inside `settle`, in the same transaction. Test this
first — it is where money silently disappears.

---

## 5. Guards, and the tests to write before the feature

These are what a judge probes and what an auditor would open with.

| Guard | Test |
|---|---|
| Seller cannot bid on their own lot | `place_bid` where `bidder.org_hash == seller.org_hash` → reject |
| No bidding after the deadline | `place_bid` at `now > end_ts` → reject |
| Cannot settle early | `settle` where `current_price(now) > best_bid` → reject |
| Settlement price is honest | `Sale.price == current_price(settled_at)`, asserted on-chain, not trusted from the client |
| Price never goes below the floor | property test across the whole time range |
| Escrow cannot be released without confirmation | `confirm_pickup` by anyone other than the buyer → reject; `auto_release` before the timeout → reject |
| Losing bids are fully refunded | sum of refunds + seller payout + fee == sum of deposits |
| One listing per lot at a time | second `open_listing` on a `Listed` lot → reject |
| A `Disputed` sale is frozen | `auto_release` on a disputed sale → reject |

The last line of the refund test is the one that matters: **the token maths must balance
exactly.** Write it as a property test over random bid sets.

---

## 6. Build order

**Week 1 — nothing else until step 1 exists.**
1. Toolchain, `anchor init`, one transaction on devnet. Solve tooling before design.
2. `Party`, `Lot`, `Listing` + instructions 1–3, no money involved.
3. `current_price` with the property test across the full curve.

**Week 2 — the risky part, budget it fully.**
4. SPL test token, bid vault PDAs, `place_bid`.
5. `settle`, including the overpayment refund. Then `refund_losing_bid`.
6. Every guard in §5.

**Week 3 — freeze.**
7. `mark_handover`, `confirm_pickup`, `auto_release`, `expire_listing`.
8. React client, wallet-adapter, the four-field lot form, the live price clock.
9. **Feature freeze.** Rehearse three minutes, drill six minutes of Q&A.

If the deadline lands earlier, cut in this order: `open_dispute`, `auto_release`,
`cancel_bid`, `expire_listing`. **Never cut `settle` or the refund maths** — those two are
the demo.

---

## 7. Traps specific to this program

- **One account per lot, never one shared record.** Concurrent writes to a single account
  serialise and fail under load — Solana executes in parallel only across disjoint accounts.
  This is why "all branches write to one record" belongs in Postgres, not in the program.
- **Rent and account sizing.** Fix every account's size up front; `Option<Pubkey>` costs 33
  bytes, not 32.
- **Clock as the only time source.** `Clock::get()?.unix_timestamp`, never a client-supplied
  timestamp. A client-supplied `now` is a free lot at the floor price.
- **`init_if_needed` is off.** It is the standard re-initialisation footgun; use explicit
  `init` and let a second attempt fail.
- **Do not write a novel escrow.** Adapt a known, audited SPL escrow pattern for the vault
  mechanics. Week one of learning Rust is not when to invent custody code.

---

## 8. Demo honesty

The escrow runs on devnet with a test token. That is a demonstration of a mechanism, not
the production path — production settles through a licensed PSP, for the reasons in
[MARKET-ARCHITECTURE.md](MARKET-ARCHITECTURE.md) §1.

Say that out loud on stage. In a room containing banks, being the team that already knows
which licence it would need is worth more than the team that has not asked.
