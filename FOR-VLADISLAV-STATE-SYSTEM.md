# What I found about the Serbian state system — and why I think it helps us

**Stefan, 22 August 2026.**

You proposed delivery and acceptance evidence as the first wedge. I went and checked what the
Serbian state is already building in exactly that space, because if we are going to stand in front
of people next week claiming this problem is unsolved, someone will know that it partly is.

Short version: **the state is building more than I expected, and I think that is good news rather
than bad.** It gives us a dated, checkable, government-backed proof that the problem is real, and
it leaves three specific things uncovered. That is a much stronger position than arguing from
first principles that trust matters.

Self-contained — you should not need any other file. Claim marks: **[checked]** verified against
the law or a primary source; **[my research]** secondary sources, confirm before quoting;
**[reasoning]** my judgement, argue with it.

---

## 1. What the law actually creates

**Zakon o elektronskim otpremnicama**, Official Gazette RS 94/2024, adopted 27 November 2024.
**[checked]**

Two documents:

- **eOtpremnica** — a structured document accompanying goods. Article 6 requires sender, receiver
  and transporter identification with tax numbers, waybill number and date, planned and actual
  transport start and end times, loading and unloading addresses, goods description and quantity,
  vehicle identification, and a QR code.
- **ePrijemnica** — a document of **qualitative and quantitative acceptance**, generated from the
  received eOtpremnica.

Operated by the **Centralni informacioni posrednik** inside the Ministry of Finance. Retention is
permanent for the public sector and **ten years** for the private sector.

**Timeline:** 1 January 2026 for the public sector and private traders in excise goods.
**1 October 2027 for all private-sector pairs**, regardless of goods type or VAT status.

### The workflow, which is the part that surprised me **[my research]**

1. The sender creates and transmits the eOtpremnica **before the goods move**.
2. Once sent, **the document locks.** Only attachments and unplanned transshipment stay editable.
3. The recipient confirms physical receipt within three business days.
4. The recipient then has **eight days** to send an ePrijemnica stating **accepted versus received
   quantities, line by line**.
5. Partial acceptance is explicitly supported — the ePrijemnica carries noted discrepancies or
   defects.
6. The sender then has **30 days to align** with that ePrijemnica, or it counts as rejected.
7. Silence from a private-sector recipient means automatic rejection; the February 2026 rulebook
   amendment has the system stamp `automatski odbijeno` after 30 days.

A locked record, two-sided acceptance, per-line discrepancies, a structured objection window, ten
years of retention — free, mandatory, and carrying legal weight no private system can match.

I want to be straight that this is a large part of what I had assumed we would be demonstrating.

---

## 2. Is it arriving on time?

Yes, but wobbling — and the wobble is documented. **[checked]**

- **December 2025:** new exceptions added — aircraft fuelling within a single airport, goods
  returned on the same vehicle immediately after delivery, clinical trial medicines and devices.
- **December 2025:** the Ministry of Finance announced that from **1 January to 30 June 2026 it
  will not take errors in submitted eOtpremnice and ePrijemnice into account** — a six-month grace
  period declared before the first phase had even begun.
- **February 2026:** the rulebook amended again, adding import and export fields and the automatic
  rejection stamp.
- Paper-format provisions deferred to 1 April 2026.

So the public-sector phase launched with an immediate no-penalty window and has been amended twice
since. That is not a system collapsing, but it is not one arriving cleanly either. **You have
worked with the Serbian government and I have not — your read on whether the October 2027 date
holds is worth more than anything I can find.**

---

## 3. The three things it does not cover

This is the part I would build the pitch on.

**1. Nothing after acceptance.** The law lets the sender cancel an eOtpremnica only up to
confirmation of physical receipt. Nothing I found addresses amending a record once it has been
accepted. So the state handles the dispute **at the door**, and appears to have nothing for what
comes afterwards — a shortage found while unpacking, a quality problem that shows up in three
days, a return, a credit note, a retrospective adjustment. That is exactly our supersede-and-revoke
flow. **[my research — this needs a Serbian lawyer before we say it publicly.** "Not addressed in
what I read" is not the same as "does not exist".**]**

**2. Only the delivery moment.** One document type, one purpose: what moved, and what was
accepted, for tax and inspection. It does not link to a quality certificate, a temperature log, a
provenance claim, a payment, or anything before dispatch or after settlement. Our envelope is one
format for all of those, which is the whole point of building it generally. **[reasoning]**

**3. Only parties that Serbian law binds.** The law does cover cross-border movements — I had this
wrong earlier and want to correct it. But a foreign supplier is not an obligated subject and has no
account in a Serbian Ministry of Finance system. For imports, the February 2026 amendment tells the
sender to record the place "where they acquired disposal rights" as the dispatch point, which reads
as the record beginning when the Serbian party takes ownership. If that is right, **an import
record is effectively one-sided** — the Serbian party's own statement of what arrived, with nothing
counter-signed by whoever dispatched it. **[reasoning — worth checking properly.]**

I note without pressing the point that this is the shape of the story you told me about Bosnia, and
that it does not close in October 2027.

---

## 4. Why I think this strengthens us

My first reaction was that the state had taken our ground. On reflection I think the opposite.

Almost every team standing up next week will be asserting that some problem exists. We can point at
a law, with a number, a gazette reference and a date, and say:

> **Serbia is mandating this exact thing from 1 October 2027. Here is the law. Here are three
> things it does not cover. Here is the one we built.**

A government mandating something is far better evidence that a problem is real than any argument
either of us could make. It costs us nothing to say the state solved most of it — the part it did
not solve is where we are standing, and being precise about that makes us more credible, not less.

It also gives the demo a spine. We show the flow the state will run, then show what happens when a
shortage surfaces four days later: a correction that supersedes the record without deleting it,
signed, ordered, and verifiable by someone who trusts neither party.

---

## 5. The other thing I checked, and should have checked sooner

Retail deduction and dispute management is an established software industry. **[my research]**

Retailers deduct from supplier payments for alleged shortages, damages, compliance failures,
pricing discrepancies and freight disputes; suppliers dispute those deductions. Platforms competing
in 2026 include iNymbus, HighRadius, STAT Recovery Services, RetailPath and ValenceIntel, several
now marketing themselves as AI-native.

Two readings and both matter.

**It validates your instinct.** You picked a wedge with a real, expensive, recurring problem and a
software category built around it. That is better evidence than anything in my earlier research on
the evidence layer.

**And the lane is not empty.** One vendor publishes the claim that suppliers relying on deduction
software alone recover **less than half** of what they are owed — so the problem is imperfectly
solved rather than unsolved.

One structural difference I noticed: that industry is built around **US retailer portals** —
Walmart Retail Link, Target Partners Online, Amazon Vendor Central — and its motion is *claims
recovery after the fact*. Nobody in it appears to be selling *neutral evidence at the moment of the
event*. Whether that is a real opening or just a nicer description of the same job, I cannot settle
from a desk. **[reasoning]**

---

## 6. My honest reading of the wedge

Stated broadly — "delivery and acceptance evidence in fragmented supply chains" — it runs into a
free state system in Serbia from October 2027 and an established software category elsewhere.

Stated precisely, it survives in the three places in section 3: after acceptance, across other
event types, and wherever a counterparty is not bound by the same state system.

That is narrower than your document proposes, and I think it is the honest version of it. **It is
plenty for a demo.** Whether it is a company depends on one thing I cannot research: how much money
is actually lost in the gap after acceptance. That is question 6 below and I think it is the most
important sentence either of us will say this week.

---

## 7. A different opportunity, with no blockchain in it

I want to put this on the table because it would be dishonest not to, not because I am
recommending it.

From October 2027, several hundred thousand Serbian companies must connect their systems to the
Centralni informacioni posrednik. Every one of them needs an integration, and most of them will not
build it themselves. That is a dated, mandatory, unavoidable need with a known deadline — and it is
the same "we absorb the integration burden" argument I made in the previous document about ERP
vendors, except here the demand is created by law rather than hoped for.

Serbia's e-Faktura rollout created exactly this industry. It fits your network and my development
work more directly than the evidence layer does.

The honest trade: it is a services business rather than a venture-shaped one, it has no
defensibility beyond execution and relationships, and it is not what we would demo next week.
But it would make money in 2027 with near-certainty, and the evidence layer might not.

I am not arguing for it. I am saying somebody should have said it out loud before we spend six
months on the harder thing.

---

## 8. What I need from you

### Still open from the last document

**1. What does your network actually cover?**
I had assumed mostly food and agricultural and I now think I assumed that too early. Your strategy
targets ERP and logistics vendors, marketplaces and compliance platforms — which is not a document
you would write if food producers were the only door open. A rough split changes what we do next.

**2. Is the business the envelope, or something further up the stack?**
Hash anchoring on its own is close to free, and the companies charging for it are really charging
for certificates, legal weight and integrations wrapped around it.

**3. The Bosnia story — on a call, not in writing.**
It concerns identifiable companies and these documents go into AI tools. What I want to understand:
what exactly was altered, one branch or many, how it was eventually discovered, and what it cost.

**4. Anything you can get from the organisers.** This one is time-critical — the event is in four
days and almost nothing is published. What are they hoping to see, are there tracks or bounties
beyond the two public ones, how is it judged and by whom, and what has won there before. If you can
only get one answer, make it the judging criteria.

### New, from this research

**5. Do Serbian state IT systems arrive when the law says?**
The October 2027 date is the whole question. If it slips two years, or lands technically but
unusably in practice, the domestic market reopens.

**6. After acceptance, when a shortage or quality problem surfaces later — what actually happens
today?**
Credit note, phone call, deduction from the next invoice, argument for three weeks? This is the
single most valuable thing you can tell me. If the answer is that it gets sorted informally and
nobody much minds, then the gap we found is real and worthless. If it is weeks of argument and
money withheld, it is a product.

**7. Does anyone in your network already pay for deduction or dispute recovery, in any form?**
Including informally — a person whose job is chasing retailer deductions counts.

**8. In practice today, does a recipient sign anything the sender holds?**
Or does each side record acceptance only in its own system? That difference is what makes the
dispute possible in the first place.

### One build decision that blocks work

**9. ENS as issuer identity — yes or no, quickly.**
You asked for one live chain and a documented Ethereum adapter, and I agree with the reasoning. But
I think there is a conflation worth separating: **ENS is not an Ethereum deployment.** An Ethereum
anchoring adapter — registry contract, EIP-712, a second anchoring path to keep stable — is real
work and you are right to cut it. ENS identity is calling existing contracts: register a name,
create subnames, set text records. Nothing of ours is deployed, nothing needs to stay in sync, and
the cost is about five dollars a year.

So both can hold: **anchoring stays Solana-only exactly as you propose, and ENS carries issuer and
subject identity with its text records pointing at the Solana anchor.** Identity on one chain,
anchoring on another, one verification receipt — which demonstrates the chain-neutrality argument
better than two anchoring paths would.

It is also worth one of the two known bounties, which require working ENS-specific code rather than
a hard-coded demo.

On your wider point about issuer identity: you are right that "a publicly resolvable name" is a
principle and not an implementation. `did:web` is simpler but resolves through a server the issuer
controls, which reintroduces the trust problem we exist to remove. X.509 and eIDAS organisational
identity is where a real enterprise product ends up and is the only path that connects to qualified
trust services later. The envelope carries `issuerId` as a field, so this is pluggable by
construction — I would demo ENS and document `did:web` and X.509 as the enterprise path.
