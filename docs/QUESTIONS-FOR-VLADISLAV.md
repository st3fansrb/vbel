# Questions for Vladislav

*Rewritten 5 August 2026. The 25 July version is superseded: it was written before the
27 July decision to skip Solana Summit, so it assumed a three-week deadline and a stage.
It also asked eight questions about payment dates and nothing about waste — which is the
only reason Vladislav saw value in Frigo in the first place.*

*The plan itself is in [PLAN-FOR-VLADISLAV.md](PLAN-FOR-VLADISLAV.md).*

---

## Part 1 — The fork. Ask this first, get an answer, everything else follows.

There are two products in the documents, and they are not the same company. Twelve months
of work goes into one of them. I want him to pick, not to agree with both.

**Put it to him as a choice, in his terms:**

> Two versions. Which one would you actually walk into a producer's office with?
>
> **A. The goods that expire.** The producer sees, across all their locations, what stock is
> approaching its date and how much it is worth. Before it becomes waste, it becomes an offer
> to someone who can still sell it. What we build is the visibility and the matching.
>
> **B. The money that arrives late.** Every delivery gets an independent, timestamped record
> that both sides confirm. That record starts the legal payment clock and settles disputes
> about when goods actually arrived. Later, licensed factors can finance against it.
>
> Both rest on the same underlying record of a lot. But the first customer, the first screen
> and the first sales conversation are different. Which door opens easier for you?

**What to listen for.** If he answers A, the waste directive and the 2030 targets are the
tailwind and the first user is a producer's operations person. If he answers B, the tailwind
is payment-term law and the first user is finance. If he says "both", push once: *which one
would you put in front of the first producer?* Do not leave with "both".

---

## Part 2 — Questions that matter whichever way he answers

**2.1 Who signs the goods receipt, in reality?**
Warehouse manager, store manager, or the person entering the invoice? On what device —
desktop, scanner, phone? Is it signed on paper today? The whole interface depends on this,
and it is the adoption question anyone will ask.

**2.2 Delivery notes today — paper or electronic?**
Do producers and distributors already exchange delivery notes electronically, through EDI or
otherwise? If large chains already send electronic despatch and receipt messages, I need to
know before building a layer that duplicates it.

**2.3 The Bosnia story — what exactly was changed?**
Quantities, expiry dates, returns, or all three? By branches, by suppliers, or both? How was
it discovered, what did it cost, and is the producer identifiable? This is the strongest
evidence we have and it needs to be precise, not general.

**2.4 Agri-food or non-food, roughly?**
What share of his network's volume is food and agricultural, versus detergents, cosmetics,
paper goods, pet food? A rough split is enough. Romania caps payment terms on food only —
14 days perishable, 30 otherwise — while Serbia's new law covers food *and* household
chemicals, paper and personal care in one regime. The split changes which market goes first.

**2.5 Serbia or Romania first?**
Where does he get to a live user faster? Serbian law overrides contractual bans on assigning
receivables when a licensed factor is involved; Romania has no equivalent. That favours
Serbia for the financing layer later — but the first pilot goes wherever a door actually opens.

---

## Part 3 — Only if he picks A (waste)

These have never been asked. They are the equivalent of Part 4 for the other branch.

- **What happens today to stock approaching its date?** Who buys it, at what discount,
  through whom? Is there a broker, a discounter chain, an informal network, or does it simply
  get written off?
- **Does a producer have visibility of their own stock across locations**, or is it separate
  spreadsheets per warehouse?
- **How far in advance would someone need to know**, for the stock to still be sellable
  rather than donated or destroyed? Days, weeks?
- **Who inside a producer would own this?** Sales, operations, or the warehouse?
- **Is the 2030 waste-reduction target discussed concretely** by anyone he deals with, or is
  it still only on paper? This one decides whether Directive (EU) 2025/1892 is a real tailwind
  or just a good paragraph in a funding application.

---

## Part 4 — Only if he picks B (receivables)

- **How does a supplier prove the delivery date today?** When a supplier and a chain disagree
  about when goods were received, what settles it? Do chains send electronic receipt
  confirmations (EDI: DESADV out, RECADV back), or is reception confirmed on paper?
- **Does Serbia have a state electronic delivery note** — *elektronska otpremnica* — alongside
  e-invoicing? If the state already runs delivery notes with both parties confirming, the gap
  we would fill closes and this branch needs rethinking.
- **What payment terms are agreed on paper, and what happens in practice?** Serbia's own
  legislator put the average agreed term at 68.5 days, with maximums reaching 120 in some
  categories. Does that match what he has seen?
- **Does anyone actually pay early for a discount?** In Romania, Penny works with a licensed
  lender that pays suppliers early. Anything similar in Serbia?

---

## Part 5 — Parked until there is something to show

Not for this conversation. These were written for a Demo Day that no longer exists, and
asking them now spends credibility on a meeting that is not scheduled.

- Access to a licensed factor as a **non-exclusive** design partner.
- A producer willing to sign a letter of intent.
- Which framing lands with his banking contacts: fraud, working capital, or infrastructure.

Raise these once there is a working prototype to put in front of someone.
