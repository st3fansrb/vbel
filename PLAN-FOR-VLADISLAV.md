# What we're building — concrete plan

*Stefan, 25 July 2026. Short on purpose. The last section is what I need from you, in priority order.*

---

## 1. The thing itself, in one line

**A shared ledger where a delivery is signed by both sides — so stock data cannot be quietly rewritten, and a confirmed goods receipt becomes a receivable a third party can trust.**

One event. Two products out of it:
- **Inventory truth** — lots, quantities, expiry dates, agreed by both parties. This is your BiH problem.
- **Cash flow** — the same confirmed receipt lets the buyer pay early at a discount instead of on day 100.

## 2. Why this and not the full factoring protocol

The full version — we buy the invoice, we advance the money — requires a factoring licence in Serbia (bank, or licensed company with ~€340k minimum capital) and a registered non-bank financial institution in Romania. Six to twelve months, before a single euro moves.

So we do not touch the receivable. Nobody buys it, nobody lends against it. The buyer simply pays **its own invoice** early in exchange for a discount — that is early settlement of a commercial debt under civil law, not factoring. No licence, in either country.

The financing layer comes later, on top of a registry that already works, with a licensed partner. That sequence is deliberate: by then we have real payment data instead of assumptions.

## 3. The demo — 3 minutes, one flow

1. **Producer ships.** Writes the event: lot, 100 units, expiry 12.03.
2. **Receiving confirms from a second wallet: 96 units.** The mismatch appears live, signed by both. Today someone would quietly fix that in a spreadsheet. Here neither side can close it alone, and nobody can rewrite it tomorrow. ← *this is the moment of the pitch, and it is your story*
3. **The confirmed receipt creates the receivable.** Terms come from the contract.
4. **The money moment:** buyer sees *"pay on day 10 instead of day 100 → 1.8% discount"*, clicks, settles. Nobody bought a receivable.
5. **Second harvest from the same event:** a lot nearing expiry surfaces automatically, producer offers a discount to move it. Waste reduction as a side effect, not as the product.

Then one vision sentence: the same confirmed event becomes, with licensed factors, a financeable receivable priced by payment history. Nothing more on stage — no numbers, no structures.

## 4. Why a blockchain and not a normal database

Expect this question from the judges. The honest answer, which is also the strong one:

- A ledger does **not** make data true. It makes it impossible to rewrite retroactively, and it forces two parties with opposing interests to sign the same fact.
- The real difference from an ERP: **nobody owns the registry.** A producer will not let its distributor host the truth about its own stock. Two competing producers will never accept one another's database. There is no neutral operator for this — that is the textbook case for a shared ledger.
- Secondary: Serbia→Romania. SEF and e-Faktura are both mandatory and they do not talk to each other. National registries stop at the border.

## 5. Timeline, given your constraints

| Window | Who | What |
|---|---|---|
| now → 8 Aug | Stefan alone | application, first on-chain program, data model, the two-signature flow |
| 8 → 26 Aug | both | full MVP, real documents, pitch and Q&A rehearsal |

I do not need you full-time before 8 August. I need roughly **one hour of your time this week**, listed below.

---

## 6. What I need from you — in priority order

**P0 — this week, ~1 hour total. Everything else waits on these.**

1. **Confirm the deadline with the organisers** (you said Monday). Until we know it, every plan here is a guess.
2. **30 minutes on a call, recorded — the BiH story in detail.** What exactly was falsified: quantities, expiry dates, returns? By whom — branches, suppliers, both? How was it discovered? What did it cost? This is the strongest evidence we have and it has to be precise, not general.
3. **One anonymised invoice and one anonymised delivery/receipt note.** These two documents are what the whole system models. Without them the demo is a mockup.
4. **Written confirmation of how much time you can commit 8–26 August.** Not a formality — I plan the build around it.

**P1 — before 8 August**

5. **The two agents:** name and level of your Serbian contact and of the Timișoara one. Can we get 20 minutes with each?
6. **One retail supply contract template.** I need to check whether it prohibits assigning the receivable without written consent. If it does, the financing layer changes shape entirely. This is the highest-value unknown we have and it is not a technical one.
7. **Which framing lands with your banking and regulatory contacts:** anti-fraud, working capital, or infrastructure for licensed factors?

**P2 — during 8–26 August**

8. **One producer willing to sign a letter of intent.** A signed LOI is worth more to the judges than any of the architecture.
9. **Access to one licensed factor** as a *non-exclusive* design partner — for the vision slide, not for the MVP. Non-exclusive matters: if we become one factor's registry, the neutrality argument dies and so does the pitch.
10. **Q&A split:** 6 minutes, roughly twice the weight of the pitch. Stefan takes technical and product, you take market, FMCG process, institutional relationships.

---

## 7. Questions where only you have the answer

1. Who physically signs the goods receipt at the retailer — warehouse manager, store manager, the person entering the invoice? On what device? Our entire interface depends on this.
2. Do producers and distributors already exchange delivery notes electronically, or is it still paper?
3. Have you ever seen a retailer actually pay early for a discount? If none of them ever would, the money moment in the demo needs to change.
4. Is the BiH producer identifiable from the story? Can it be told on stage?
5. Serbia or Romania for the first real pilot — where do you get to a live user faster?

---

## 8. How we talk about it — three phrasings that matter

These are not cosmetic. Each one is a question a judge, a lawyer or a regulator will ask, and the wrong version loses the room.

- Not *"a substitute for ERP"* → **a layer on top of ERP.** Producers run SAP and Navision. Nobody rips out an ERP for a startup — that is a two-year sales cycle. We are the layer where two companies agree on the same fact.
- Not *"we penalise late payers"* → **we price money by payment behaviour.** The buyer has to sign up voluntarily. An early-payment discount is clean margin for a retail CFO; a penalty is a reason not to sign.
- Not *"an advisor from Deloitte"* → **an advisor with 15 years at Deloitte, freelance.** Checkable, and fatal if it is phrased the first way.
