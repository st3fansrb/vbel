# The full picture — for Vladislav

**Stefan, 8 August 2026.**

This replaces the two documents I sent you on 26 July. Those were written for a Solana Summit
pitch we then decided not to apply for, so parts of them are out of date. Read this one instead.

It is long on purpose. You said you would put it into Codex, and an AI with no context will
re-propose ideas I already killed unless it knows why they died. So this contains not just the
current idea but the whole history: what I tried, what the research destroyed, and what I
concluded from it.

**This one is for you.** It is written to be argued with, so it says out loud where I am unsure,
what the competition already does better, and which of my own conclusions I no longer trust. That
is the right way to talk to you and the wrong way to talk to a producer. If we need something to
put in front of a customer later, that is a different, shorter document.

**Why this switches between "I" and "we".** Treat the pronoun as a marker of how much scrutiny
something has already had. Where it says **"I"** — the original idea, the two months on invoice
financing, the research, the eight abandoned directions — that was worked out with nobody else in
the room: one set of assumptions, and no second pair of eyes to catch what was wrong. **Those are
the least tested parts of this document, and the first ones worth attacking.** Where it says
**"we"**, it is either something we already went through together or something still ahead of us.

**How to read it.** Sections 1–7 are the idea as it stands. Sections 8–19 are how I got here and
what the research says. If you only read two sections closely, read **3 — why a producer would
pay**, because that is the part you said you need to work out and I think it decides everything,
and **24 — where your experience beats my research**.

## How claims are marked

I have marked every factual claim, so you and Codex know how hard each one is. Do not treat an
unmarked opinion as a fact, and do not treat my research as a source when you can check the law.

- **[checked 8 Aug 2026]** — I verified this directly against the law, the official gazette, or
  the statistics office, today.
- **[my research]** — from my earlier research passes. A source existed when I wrote it down, but
  I have not re-checked it today. Treat as probably right, worth confirming before quoting.
- **[unconfirmed]** — I looked for it and could not confirm it. Do not quote it.
- **[reasoning]** — my judgement, not a fact. This is where you should push hardest.

---
---

# PART I — THE IDEA AS IT STANDS

---

## 1. What it is, in one sentence

**A tool that finds a producer's stock that is about to expire, and sells it to restaurants
before it becomes waste.**

That is all. It is deliberately small, and the smallness is the point — see section 2.

---

## 2. The one problem

Stock that will expire unsold.

You said we should solve one painful problem completely rather than five partly, and I agree. So
here is what this deliberately does **not** do:

- Not track a producer's whole inventory
- Not replace or compete with SAP or any ERP
- Not touch invoices, payments, receivables or financing
- Not build anything for consumers
- Not move goods across borders
- Not build a blockchain product

Every one of those is a real business. Several are businesses I already tried to design and
abandoned for documented reasons (section 9). None of them is this one.

---

## 3. Why a producer would pay for it

This is the part you said you need to work out. Here is my best attempt. **All of section 3 is
[reasoning]** — correct it, you know these people and I do not.

**Do not sell waste reduction. Sell recovered cash, through a channel that does not touch their
retail price.**

Three arguments do the work.

**The money.** Stock that expires is not worth zero — it is worth *less* than zero, because
disposal costs money. So the value of selling it late is the price received **plus** the disposal
cost avoided. In their own numbers: *this is X thousand euros a year that you currently pay to
throw away.* Not sustainability, not compliance. Cash they have already lost and can partly
recover.

**The channel.** The first objection any producer will raise is that discounting the same product
damages the price agreed with the chains and may breach the supply contract. That objection is
correct, and restaurants are the answer to it. A restaurant does not put the branded pack on a
shelf next to the chain's. It uses it as an input and cooks it. The chain's shopper never sees a
lower price. **This is the single most important argument in the whole document**, because
without it a producer says no in the first meeting.

**The clock.** Restaurants also consume the product fast. If surplus goes through a supermarket
instead, it has to be resold before anyone eats it, so more of the remaining shelf life burns
inside the channel. Shorter channel, less waste, more value recovered.

**One thing I found today that helps this argument.** Serbia's new **Zakon o trgovačkim praksama
za određene vrste proizvoda** explicitly prohibits **commercial retaliation** — a trader
removing a supplier's products from its range because the supplier would not accept certain
conditions, and also reducing ordered quantities, reducing order frequency, or withdrawing
services previously provided. **[checked 8 Aug 2026]**

If that is enforced, then the producer's deepest fear — *the chain will punish me if I sell
elsewhere* — is now unlawful in Serbia, not merely unlikely. **I do not know whether it is
enforced in practice, and you will know better than any document.** But if it is, it is a
genuinely strong thing to be able to say in a producer's office.

**Where the first customer is.** Not a healthy producer with tidy warehouses. A producer with
**full warehouses and cancelled purchase contracts** — already sitting on stock with no buyer and
a date approaching. In Serbian dairy right now that is not hypothetical (section 15).

**The honest weakness here.** I do not know what happens to short-dated stock today. If there is
already a broker, a discounter chain, or an informal network that takes it, this has to beat that
route, and I cannot tell you whether it would. That is question 1 in section 20 and it is the
most important thing you can find out.

---

## 4. Why it is not an ERP, and the SAP question

You put this well and I want it written the way you said it.

This is not an ERP and not a replacement for one. Nobody rips out SAP for a startup — that is a
two-year sales cycle nobody wins. It is a layer **next to** the ERP that does one thing the ERP
does not: it looks at what is about to expire and turns it into an offer to someone who will buy
it.

**One technical detail that may decide how hard this is.** In SAP, shelf life is normally stored
on the **product** (material master) rather than on the individual batch, and the expiry date is
often *calculated* — production date plus total shelf life — rather than observed. There are also
reported cases of SAP extending expiry incorrectly when a product is reprocessed. So when a
producer says "SAP knows our expiry dates", it may be a calculated date, not a real one.
**[my research — this rests on SAP documentation plus SAP community answers, not on a single
authoritative source. Worth confirming with someone who administers a real installation, which
may be you.]**

Why it matters in both directions:

- **If the data is already there and reliable**, the job shrinks dramatically. Nobody has to type
  anything, we read from the ERP, and the biggest adoption risk disappears.
- **If it is not**, expiry has to be captured at the point of goods movement, which means a
  warehouse person using our tool — a much harder sale.

**You also mentioned a specific column in SAP — "column nine" — that most people ignore and you
use, and that it is much better.** I searched and could not identify it. **[unconfirmed]** SAP
uses named fields rather than numbered columns, so it is probably either a Serbian form generated
out of SAP, or a report layout specific to your company. It is not the KEP book — that form has
only five columns **[checked 8 Aug 2026]**. A screenshot or the exact Serbian term would settle
it in thirty seconds, and if it is what I suspect — batch-level shelf-life tracking — it is
directly load-bearing here.

---

## 5. The first test, before building anything

I do not want to build software and then discover nobody wants it. So the first thing to do uses
no software and no budget.

**The test.** One producer. Three real lots with short dates. Fifteen to twenty restaurants in
one category and one radius. A falling-price offer sent by message, by hand. **The buyer pays the
producer directly.** No money passes through anything we run, which means no licence, no company
in Serbia, no payment provider, nothing to build.

**Cost: your time and mine.** That is the point. If validating an idea requires spending money,
the validation is designed wrong.

**What it answers:** whether a producer will actually list, and whether restaurants actually bid.
Those are the only two questions that matter, and no amount of building answers either.

---

## 6. What the product looks like if the test works

Deliberately minimal. First version:

1. A producer's short-dated lots get into the system — read from their ERP if the data is usable,
   entered by hand if not.
2. The system flags lots approaching their date, before a person notices.
3. Those lots become offers to a list of restaurant buyers, at a price that falls as the date
   approaches.
4. A buyer accepts. The producer delivers. The buyer pays the producer.

That is it. No inventory management, no forecasting, no invoicing, no payments passing through us.
Each of those can come later, and only if a producer asks for it.

**One legal line the product must respect.** In the EU there is a hard distinction between **"use
by"** (*upotrebljivo do*) and **"best before"** (*najbolje upotrebiti do*). Food past its *use by*
date is treated as unsafe and must not be placed on the market. Past *best before* it may still be
sold — that is a quality date, not a safety date. **[my research for the EU rule. The Serbian
equivalent needs confirming separately — Serbia is aligned with EU food law as a candidate country
but is not bound by it, and the pilot is in Serbia.]**

The whole product lives on that line, so the system must treat the two as different kinds of date
from the first commit, not as one "expiry" field. Getting that wrong is not a bug, it is a
regulatory problem.

---

## 7. What I need from you, and when

You said the people worth talking to are mostly on holiday and realistically available in the
**last week of August**. That works — it gives us three weeks.

**Now, while you have time:**
- Sit with this and tell me where it breaks. Genuinely the most useful thing you can do.
- Your framing for a producer. Section 3 is my attempt; yours will be better, and better again in
  Serbian.
- The answers in section 20, especially questions 1, 2 and 3.
- The SAP column, and whether producers' expiry data in SAP is real or calculated.
- Whether the ban on commercial retaliation in section 3 means anything in practice.

**Last week of August:**
- One producer who will talk to us — ideally one with full warehouses.
- If that producer is willing, the test in section 5.

**The first real milestone** is not a demo and not a signed anything. It is **one producer moving
one real lot through a real channel.** Everything else is preparation for that.

---
---

# PART II — HOW I GOT HERE

This part exists so that an AI reading this document does not suggest something I already buried.
Every idea below was seriously designed and then killed for a specific reason.

---

## 8. Where the idea came from

The starting point was **Frigo**, an app built for the HackTM hackathon — consumer-facing,
tracking food in a fridge and flagging what was about to expire, with waste tracking built in.
You saw value in it because of food waste specifically: you know first-hand how much produce
expires when producers cannot sell it in time.

From there I took the project in a completely different direction for about two months — towards
invoice financing and factoring in FMCG supply chains — before my own research destroyed that path
and brought me back to something much closer to where Frigo started. The current idea is
essentially Frigo's core mechanic (see what is about to expire, act before it is waste) applied to
producers instead of consumers.

**Why there was a blockchain in all of it.** Worth stating plainly, because it looks strange in
hindsight: the target was the Solana Summit, so a blockchain was a requirement of the venue, not
a conclusion from the problem. Every design in that period had to have one. Once we decided not
to apply, the requirement disappeared — and so did the blockchain. That is why the current version
has none, and why section 19 is so short.

All of the above was before we started working together. I ran roughly nine deep research passes
across Serbian and Romanian primary sources myself, then had three separate AI systems attack the
results. Where several independent analyses reached the same conclusion, I treated that as a strong
signal. They converged on four things: do not build a registry, the layers do not stack the way I
had assumed, escrow cannot be run in-house, and the operational tool is the real product.

---

## 9. The eight ideas I killed, and why

**1. A full on-chain factoring rail** — the platform buys the invoice and advances the money.
*Killed by licensing.* In Serbia this requires being a bank, or a company licensed to conduct
factoring with a minimum capital requirement. In Romania it requires registration as a non-bank
financial institution (IFN) with the National Bank. Either way: months of process and serious
capital before one euro moves. **[my research for the licensing requirement in principle.
[unconfirmed] for the specific figure of RSD 40 million (~€340k) — I searched for it today and
could not confirm it in the law text, so do not quote that number.]**

**2. A verification registry to stop the same invoice being financed twice** (I called it
"Passport").
*Killed by the state.* Serbia's amended factoring law (Official Gazette RS 109/2025) creates a
**central factoring record** (*centralna evidencija faktoringa*) doing exactly this. The assignor
must register an invoice there immediately after it appears in the e-invoicing system, and at the
latest the next working day. **[checked 8 Aug 2026]**

**Important correction to what I previously believed.** I had written that this was "due mid-2027".
The law does not actually say that — the relevant provision applies **from the day the central
factoring record begins operating**, which is open-ended. **[checked 8 Aug 2026]** So the timing
is softer than I assumed, and see section 24.

**3. A goods receipt signed by both sides** — the delivery confirmed by producer and receiver, so
stock data could not be quietly rewritten. This is the idea your Bosnia story pointed at, and for
a while it was the whole product.
*Killed by the state.* Serbia's **Zakon o elektronskim otpremnicama** (Official Gazette RS 94/2024,
in force 6 December 2024) creates a state electronic delivery note, with a second document
(*e-prijemnica*) recording quantitative and qualitative acceptance and allowing rejection in whole
or in part. It arrives in two phases: **1 January 2026** for public-sector entities and for
movements of excise goods, and **1 October 2027** for private-sector sender-and-recipient pairs.
**[checked 8 Aug 2026]** It is mandatory, free, and carries legal force no private system could
give it. In Romania, large retail already does the same thing through EDI messages (DESADV out,
RECADV back) **[my research]**.

**See section 24 — I now think this may be the weakest of the eight kills.**

**4. Compliance tooling for the payment-term caps.**
*Killed by redundancy.* The same state systems plus a mature tax-reporting stack leave no room,
and the real problem is enforcement capacity, which software cannot fix. **[reasoning]**

**5. A payment-behaviour registry fed by suppliers** — suppliers report who pays late.
*Killed by three problems.* No state system records an actual payment date, so the data would be
self-reported and unverifiable **[my research]**. Immutability conflicts with the need to correct
errors **[reasoning]**. And the UK and Australian precedent suggests even legally mandatory payment
reporting barely changed payer behaviour **[my research]**.

**6. Issuing a coin or stablecoin.**
*Killed by EU law.* Under MiCA, a token referencing a fiat currency is an e-money token and can be
issued only by a credit institution or an authorised electronic money institution. And "investors
for the coin" turns it into a probable transferable security, triggering a prospectus obligation.
**[my research]**

**7. A consumer loyalty app.**
*Killed as a different business* — no consumer distribution, and out of scope. **[reasoning]**

**8. Getting payment-behaviour data out of marketplace escrow.**
*Killed by a design contradiction*, caught independently by two adversarial reviews: escrow means
the buyer prepays. Prepayment eliminates trade credit. No trade credit means there is no payment
behaviour left to observe. The mechanism destroys the data it exists to collect. **[reasoning, but
I consider it airtight]**

---

## 10. The pattern behind the failures

**Five of those eight (1–5) were registries of past events.** Trust products, in a market where
the state is actively nationalising the record layer and licensed institutions own the money. Any
new idea that is also a registry of what already happened deserves suspicion before analysis.
**[reasoning]**

**Why registries fail commercially.** Five well-funded blockchain trade platforms died between
2022 and 2023: **we.trade, Marco Polo, TradeLens, Contour, B3i** — backed by major banks, shipping
lines and insurers. The common cause was the same each time: value required everyone to join
before anyone got anything. I found no successful counter-example, though I would not claim none
exists anywhere. **[my research]**

**A market is structurally different, and that is the reason to prefer one.** A market works from
the first pair of participants — one seller and one buyer both get value immediately. Nobody waits
for an industry to adopt. **[reasoning — and see section 24, because those five were global
banking consortia, not regional food, so the analogy may not transfer.]**

---

## 11. The deepest trap, worth understanding rather than memorising

Append-only or blockchain storage does nothing at the point of data entry.

If a branch enters 96 units when there are really 90, putting that on an immutable ledger does not
prevent the lie. It **notarises** it, and makes it look verified to whoever reads it downstream.
That is strictly worse than a spreadsheet.

What immutability actually prevents is *later adjustment* — which, to be fair, is how this kind of
fraud is normally committed. But the claim has to be stated that narrowly. "Blockchain means the
data cannot be falsified" is false, and any competent person in the room will say so.

---
---

# PART III — THE RESEARCH

---

## 12. The EU food waste law

**Directive (EU) 2025/1892**, adopted 10 September 2025 and in force since **16 October 2025**,
amends the Waste Framework Directive and sets binding food waste reduction targets to be achieved
at national level by **31 December 2030**:

- **−10%** in **processing and manufacturing**
- **−30% per capita** across **retail and other food distribution, restaurants and catering
  services, and households, jointly**

both measured against the annual average for **2021–2023**. **[checked 8 Aug 2026]**

**The implementation timeline — this is the part that matters commercially.**

| Date | What must happen |
|---|---|
| 17 January 2026 | Member States designate competent authorities for the targets |
| **17 June 2027** | **Member States must have the directive in national law** |
| 17 October 2027 | Those authorities communicate their food waste prevention programme plans |
| 31 December 2030 | The targets themselves must be met |

**[checked 8 Aug 2026 — transposition date confirmed against two independent legal analyses]**

**One precision, and one correction to what I told you before.**
- The **directive** binds **Member States, not individual companies.** It sets national targets;
  it does not by itself tell a producer to cut its own waste by 10%.
- **But I was wrong to conclude from that that no law binds producers.** It does not follow, and in
  Romania it is already false. See section 14 — Romania has had its own food waste law since 2016,
  it was tightened in 2024, and the operator obligations came into full force in March 2026, with
  fines. Serbia is not an EU member and is not bound by the directive at all.

**So the real picture is the opposite of what I assumed.** The EU deadline is June 2027, but
Romania did not wait for it — it legislated ahead, and the obligations are live now.

**Corrected figures.** I previously wrote that processing and manufacturing is 18% of EU food
waste against 7% for retail. The actual Eurostat figures for 2022 are:

| Stage | Share of EU food waste |
|---|---|
| Households | 54% |
| **Processing and manufacturing** | **19%** |
| Restaurants and food services | 11% |
| Retail and other distribution | 8% |
| Primary production | 8% |

Total 59.2 million tonnes, about 132 kg per inhabitant. **[checked 8 Aug 2026, Eurostat]**

**Why it still matters.** The 10% target sits on processing and manufacturing, which is the
customer, and that is the largest share outside households — more than twice retail's. The bigger
number and the coming legal pressure are both on the producer, not the supermarket.

Also worth noting for the buyer side: restaurants and food services are 11%, larger than retail.

---

## 13. What the Serbian state has already built

- **Electronic delivery note** — *Zakon o elektronskim otpremnicama*, Official Gazette RS 94/2024,
  in force 6 December 2024. Phased: **1 January 2026** for public-sector entities and excise goods
  movements; **1 October 2027** for private-sector pairs, plus the obligation on carriers to
  present the electronic delivery note during inspections. A demo system is to be available nine
  months before each phase. **[checked 8 Aug 2026]**
- **Central factoring record** (*centralna evidencija faktoringa*) — *Zakon o faktoringu*, Official
  Gazette RS 109/2025. Invoices must be registered there immediately after appearing in the
  e-invoicing system. The provision applies **from the day the record begins operating** — no fixed
  date in the law. **[checked 8 Aug 2026]**
- **Zakon o trgovačkim praksama za određene vrste proizvoda** — in force. Perishable agricultural
  and food products must be paid within **30 days**; other agricultural and food products within
  **60 days**; longer terms prohibited without exception. Its scope is **wider than the EU
  requires**: besides agri-food it covers "products of particular importance for market supply" —
  household chemicals, paper and kitchen goods, personal hygiene and cosmetics, and diapers — plus
  plant nutrition and protection products and soil improvers. It also prohibits **commercial
  retaliation** and requires purchase conditions (price, payment terms, quality assessment,
  dispute resolution) to be defined in advance. **[checked 8 Aug 2026]** Enforcement history:
  effectively none yet.

---

## 14. Romania — and the law that matters most

### Romania's own food waste law: this is the strongest legal argument in the document

**All of this is [checked 8 Aug 2026].** I did not know it when we spoke, and it changes the case.

- **Legea nr. 217/2016** on reducing food waste, republished May 2024 after amendment by **Legea
  nr. 49/2024**. It obliges **all economic operators in the agri-food sector** — producers
  included, not just shops — to take concrete measures to prevent food waste.
- Law 49/2024 attached a target: **a 50% reduction in food waste by 2030.**
- The law imposes a **mandatory hierarchy** of measures. In order: prevent; then **sell products
  approaching their expiry date at a reduced price**; then transfer by donation or sponsorship for
  human consumption.
- **Every operator must be able to demonstrate the measures it adopted.** It is an evidentiary
  obligation, not just a behavioural one. An annual food waste reduction plan is required.
- **The obligations came into full force on 21 March 2026**, together with the implementing norms
  (HG 51/2019).
- **Reporting is mandatory.** Operators had to report their 2025 measures by **31 March 2026**, and
  reporting through the national platform became obligatory from **1 April 2026**.
- **The state runs the platform.** MADR operates `risipaalimentara.madr.ro`. It went live in
  **February 2026** — well past its own legal deadline of 30 June 2025.
- **Fines are 10,000–40,000 lei** for failing to report or reporting incompletely. The
  platform-upload penalty applies six months after the platform became functional.
- Estimated **400,000–450,000 operators** fall under this obligation, out of roughly 1.2 million
  active companies in Romania.

**Why this is the best news in the document.** Step two of a legally mandated hierarchy is
*selling near-expiry stock at a reduced price*. That is precisely what this product does. So in
Romania it is not only a way to recover cash — it is a way to discharge a legal obligation and
produce the evidence for the annual plan and the report. That is a far stronger conversation than
"you will waste less."

**And one warning that should sound familiar.** MADR has already built the reporting platform. That
is the state occupying the record layer — the same thing that killed ideas 2 and 3 in Serbia
(section 9). **So this must not become a compliance-reporting tool for Romania.** The product is
the *action* — moving the stock. Reporting is an export it produces as a by-product, never the
thing being sold.

**What this means for sequencing — decided: Serbia first, then Romania.**

Your network is in Serbia, and a warm door beats a legal argument when what we need is a first
producer. So Serbia is the pilot and Romania comes after. Two consequences worth being explicit
about:

- **The Serbian pitch cannot lean on this law.** Serbia has no equivalent obligation and, as a
  non-member, is not covered by the directive either. In Serbia the case is the economics of
  section 3 — recovered cash and a channel that does not touch the retail price — plus the ban on
  commercial retaliation. Not compliance.
- **Romania second is better than Romania first, not worse.** This argument gets *stronger* with
  time: the fines start biting, the MADR platform matures, and by the time we arrive, operators
  have been living with the obligation for a year or more. Nothing about it expires while we work
  in Serbia. It is the reason Romania is a real second market rather than a hope.

### Other Romanian law relevant here

All of the following is **[my research]** — I did not re-verify it today.

- **RO e-Factura** — full B2B invoice clearance through the state since 1 July 2024.
- **RO e-Transport** — transport monitoring with UIT codes. It does **not** record warehouse
  acceptance at line-item level. Romania has no equivalent of the Serbian e-otpremnica.
- **Law 81/2022** — payment terms capped at 14 days for perishable agri-food, 30 days for other
  agri-food. Detergents, cosmetics and paper goods fall outside it, under Law 72/2013 (30/60 days).
  Note this differs from Serbia, which covers those categories — see section 13.
- **Civil Code art. 1570** — a contractual ban on assigning a receivable is effective against the
  debtor, with no commercial override. The opposite of Serbia's position.

---

## 15. Serbian dairy — the current situation

You told me a lot of Serbian milk comes from Poland and local product gets wasted. The direction
is right, the details are not quite as you said them, and I would rather you have the accurate
version than be corrected by a producer. All figures **[checked 8 Aug 2026]** against Serbian
statistics reporting.

- **Poland is the largest dairy supplier by value** — about €34m in 2025, ahead of Germany (€29m)
  and Italy (€12.6m) — and a major source of **milk powder**, alongside Belarus and France. But for
  **liquid milk and cream by volume**, the 2025 leaders were **Bosnia (6,026 t)** and **Slovenia
  (4,678 t)**. The "milk comes from Poland" story was closer to true in 2023. *One caveat: I am
  confident Poland leads by value, less certain whether that figure covers all dairy or a
  subcategory.*
- **Imports are falling, not rising.** 2025: about **41,300 t** of milk and dairy products, roughly
  **29% below 2024**. Milk and cream fell from 31,785 t to 18,908 t (€28m). January 2026 was below
  January 2025. The state is also introducing **import levies** (*prelevmani*) to protect domestic
  production.
- **There is a reported claim** that imported Polish milk was packed in domestic packaging while
  purchase prices paid to Serbian farmers were cut. Reported as a claim, not established fact.
- **The domestic pain is real and well reported:** farmer protests, tractors blocking roads,
  **warehouses full of unsold stock, and cancelled purchase (*otkup*) contracts.**
- **One caution.** The farmers who poured out more than four tonnes of milk at Knić were
  **protesting**. That is not a measurement of routine waste, and no industry-wide waste figure
  exists. Presented as a statistic, it will be corrected.
- Serbia also has among the **lowest per-capita dairy consumption in Europe**, roughly 180–200
  litres a year, against Finland at 430 kg and Montenegro at 349 kg.

**My conclusion [reasoning].** Build the story on the symptom, not the cause. An import-based
argument gets weaker every month now that imports are down and the state is intervening. **Full
warehouses and cancelled purchase contracts** are not going anywhere, and they are the customer's
actual pain.

---

## 16. Payment terms, and the one real gap

Not part of this product. Here because it explains why I abandoned the financing direction, and
because it is the most durable thing the research found. All **[my research]** unless marked.

- Serbia: average agreed payment term **68.56 days**, contractual maxima up to **120 days** in some
  categories — the Serbian legislator's own figure.
- Romania: average receivables collection about **85 days**; wholesale and food production ~82.
- **"Producers are paid 100+ days" was never sourced. Do not use it.**
- Romanian factoring market about **€10.5bn in 2025**, with FMCG the largest sector at ~16.3%.

**The gap:** neither Serbia's SEF nor Romania's e-Factura records **when an invoice was actually
paid**. No state system in either country does. That is a genuine hole and potentially the most
valuable data asset in this market.

**But — and this is why it is not this product — reaching it requires seeing a producer's main
invoice flow, not their surplus.** Surplus is an adversely selected corner of the business. The
receivable a financier cares about is the main contracted invoice, which never touches a surplus
marketplace. So a surplus market does **not** lead to a financing business. Two separate paths.
I assumed for weeks that they connected; they do not. **[reasoning — see section 24, this one is
load-bearing and worth attacking.]**

---

## 17. Why nobody should hold the money

If a platform holds a buyer's funds before releasing them to a seller, that is a **regulated
payment service** — money remittance under Romanian Law 209/2019 and art. 10 of the Serbian Law on
Payment Services. The exemption for technical service providers survives only if the platform
never possesses the funds. Doing it with stablecoins is worse, not better, because MiCA is added on
top. The lawful structure is what every marketplace does: sit on a **licensed payment provider**
that holds the funds while the platform controls only the rules. One complication: no single
provider covers both markets — Stripe, for instance, does not support Serbia as an account
country. **[my research]**

**Which is why the first test has the buyer paying the producer directly.** It sidesteps all of
this, and it is why the test needs nothing set up in Serbia.

---
---

# PART IV — DESIGN WORK ALREADY DONE

Not needed for the first version. Here so it is not redesigned from scratch, and so Codex knows
what has been thought through. All of Part IV is **[reasoning]**.

---

## 18. The market mechanism, if it ever gets built

A descending price in discrete steps, plus funded standing maximum bids.

- The price falls on a fixed schedule: `price = max(floor, start − step × intervals_elapsed)`. A
  deterministic formula, so any participant can verify the price at any moment.
- A buyer either buys at the current price, or leaves a **standing maximum** with funds committed.
- When the falling clock reaches the highest standing maximum, that buyer wins — and pays **the
  step price, not their maximum.**
- The **best standing maximum is visible**, amount only. That is what creates competition: demand
  pushes up while the clock pushes down.
- A seller and their own organisation cannot bid on their own lot.

**Supply is context, not mechanism.** Showing "3 similar lots listed" is fine. Feeding supply into
the price curve destroys the determinism, which is the only honest reason to put any of this on a
blockchain.

---

## 19. Blockchain — where it honestly earns its place

Almost nowhere, and the first version has none. As explained in section 8, it was there because
the Summit required it, not because the problem did.

Recording stock is better done in a normal database with proper electronic signatures where legal
weight is needed. Worth knowing: blockchain records are not a recognised category of evidence in
either Serbia or Romania, while a qualified eIDAS timestamp carries a legal presumption that a
chain record does not. **[my research]**

The one place a chain would earn its place, much later, is as a **verifiable auction record** — it
answers the accusation *"the seller gave the lot to a friend at a lower price."* That is a
neutrality argument and a modest one. Nothing more should be claimed for it.

---
---

# PART V — WHAT IS STILL OPEN

---

## 20. What only you can answer

Ranked by how much the answer changes the product.

1. **How does short-dated stock move today?** Who buys it, at what discount, through whom? A
   broker, a discounter chain, an informal network — or is it simply written off? **This has to
   beat the route that already exists** and I do not know what that route is. The most important
   question here.
2. **Would a producer actually sell cheap, and does their supply contract allow it?** Section 3 is
   my answer; I need to know whether it survives contact with a real producer.
3. **The ten operating points you described — the producer's own branches, or independent
   distributors?** Own branches means one company decides, and this works. Independent distributors
   means two separate companies must both agree before anything happens, which is the pattern that
   killed the five platforms in section 10.
4. **Who inside a producer would own this** — sales, operations, or the warehouse? That is who it
   gets designed for.
5. **How far in advance would someone need to know**, for stock to still be sellable rather than
   donated or destroyed? Days, or weeks?
6. **Does the ban on commercial retaliation (section 3) mean anything in practice?** On paper it
   removes the producer's biggest fear. You will know whether anyone believes it.
7. **The Bosnia falsification story.** What exactly was changed — quantities, expiry dates,
   returns? By branches, by suppliers, or both? How was it discovered, and what did it cost? It is
   the strongest evidence there is for the original problem and I only have it in general terms.
   **Tell me this one on a call rather than in writing** — it concerns identifiable companies, and
   this document goes into an AI tool.
8. **Three anonymised documents:** an invoice, a delivery note, and a retail supply contract. The
   contract matters most — I need to see what it says about discounting.
9. **What share of your network is food and agricultural, versus detergents, cosmetics, paper, pet
   food?** A rough split. Not about which country any more — that is decided — but about which
   category to start with inside Serbia. Short shelf life is what makes this urgent, so food is the
   obvious first target; but it is worth knowing what else is there, since Serbian law covers
   household chemicals, cosmetics and paper too (section 13).
10. **Which Serbian producer, specifically.** The country is decided — Serbia first, Romania
    after (section 14). What I need now is which producer, and whether it is one with full
    warehouses.
11. **Is the 2030 waste target discussed concretely** by anyone you deal with, or is it still only
    on paper?
12. **Why did the Ethereum vending machine project die?** A free post-mortem on crypto payments in
    this region.

---

## 21. The competition — I have now checked, and it is crowded

I said before that I had not researched this. I have now, and you should read it before you talk to
anyone, because it changes what we can claim. All **[checked 8 Aug 2026]** unless marked.

**Live B2B surplus and near-expiry platforms in Europe:**

| Who | What they do |
|---|---|
| **Food Stock** (food-stock.de) | Positions itself as "Europe's marketplace for surplus food stock". B2B only. Buys surplus, overstock, short-dated and expired food **directly from manufacturers**, in bulk, across the EU. Claims thousands of verified partners |
| **PalletClearance.eu** | Food and non-food FMCG plus raw materials. Blocked, slow-moving, surplus, **near-expiry** and liquidation stock. **No public catalogue — qualification and routing only** |
| **Merkandi** | Large B2B wholesale marketplace with a dedicated short-dated food category |
| **ClearanceFood.com** | UK. Food liquidation and surplus, short-dated and best-before, sold by lot, pallet, case or unit |
| **Overstock Trader** | B2B platform connecting sellers to closeout food buyers |
| **Too Good To Go** | Best known for the consumer app, but now also runs a **B2B surplus food marketplace**. Large and well funded |

**In Romania specifically:** Best Angro and BursadeMarfuri.ro are general B2B wholesale
marketplaces; Nutrada is a B2B food trading platform; BonApp and Munch are consumer-facing
anti-waste apps; and the food bank network (Banca pentru Alimente) takes donations. None of these
is a producer-side near-expiry tool.

**The bad news, stated plainly.** Two things I thought were ours are not:

1. **The marketplace layer is occupied.** Multiple live EU players, one of them large. If this
   becomes "a marketplace for surplus food", it competes with Food Stock and Too Good To Go from a
   standing start. The descending-price auction in section 19 enters an occupied market.
2. **My channel-isolation argument is already a product.** PalletClearance explicitly runs **no
   public catalogue — only qualification and routing**, for exactly the reason I gave in section 3:
   sellers do not want public price exposure. So the insight is right, which is reassuring, but it
   is not differentiation. Someone got there first.

**What still looks open — and this is [reasoning], not established:**

- **Nobody appears to be finding the stock.** Every platform above waits for a seller to decide to
  list something. None of them integrates with the producer's own system to surface lots before a
  human notices. That is step 2 of section 6, and it may be the whole product.
- **HoReCa as the buyer.** These platforms sell to retailers, distributors, wholesalers and
  discounters. Restaurants as the primary buyer looks under-served.
- **Geography.** I found no evidence of any of them operating in Serbia, and nothing producer-side
  in Romania.
- **The Romanian legal hook** (section 14). None of these platforms is selling compliance with
  Legea 217/2016. A tool that moves the stock *and* produces the evidence for the annual plan is a
  different proposition from a clearance marketplace.

**What I conclude from this [reasoning].** It reinforces the decision in section 2 rather than
undermining it. Being a marketplace means fighting funded incumbents. Being the thing that sits on
the producer's side, finds the stock, and discharges a legal obligation is a narrower and less
crowded position. If anything, this argues for narrowing further toward the producer, not widening
toward the market.

### Still genuinely unknown

- Whether selling near-expiry food to restaurants creates liability for the producer, the
  restaurant, or an intermediary under Serbian food safety law. **[unconfirmed]**
- The Serbian equivalent of the EU *use by* / *best before* rule (section 6). **[unconfirmed]**
- Whether any of the platforms above has tried and failed in Romania or Serbia specifically, as
  opposed to simply never having entered. **[unconfirmed]**

---

## 22. Ideas from our conversation, and where they stand

None dismissed. None in the first version. Here is why.

**Delivery platforms (Wolt).** Wolt operates in Serbia in about 32 cities and has been a DoorDash
company since 2022 **[checked 8 Aug 2026]**. But Wolt is consumer last-mile — small orders, thirty
minutes, a courier on a bike. These lots are pallet-scale business-to-business, which is completely
different logistics. Where the idea *does* work is the other direction: Wolt already has
relationships with thousands of restaurants, so it is a way to **reach buyers**, not a way to
deliver. Genuinely worth doing — but a partnership negotiation with a large company, realistic only
once something works, and it would put the buyer relationship inside a platform that could build
this itself. Parked, not dropped.

**Romania–Serbia cross-border.** I looked at this properly and I think it is out for now. Serbia is
not in the EU, so moving products of animal origin — milk, dairy, meat — into Romania requires entry
through an EU Border Control Post with documentary, identity and physical checks, an official health
certificate signed by a Serbian state veterinarian (Commission Implementing Regulation (EU)
2020/2235), and the producing plant being on the EU approved list for that category, plus customs.
**[checked 8 Aug 2026 for the framework; I did not verify the exact position for each product
category.]** For a lot with twelve days left, that is fatal — it burns exactly the shelf life we are
trying to save. Non-food FMCG crosses far more easily, but detergent does not expire, so there is no
urgency to sell it cheap. The two facts cancel each other out. **One country, one city radius,
first.**

**Small shops.** Better than cross-border, and domestic. But a small shop puts the discounted pack on
a visible shelf, which brings back exactly the channel-conflict problem restaurants avoid.
Restaurants first for that reason; small shops as a second segment later. **[reasoning]**

**Delivery confirmation and payment terms.** My main idea in June, set aside because of the
e-otpremnica law in section 13. The state is building the confirmation layer for free, with legal
force, mandatory for private-sector pairs from October 2027. **But see section 24 — I now think this
kill deserves a second look.**

---

## 23. How to talk about it

Each of these is checkable, and the wrong version loses the room:

| Do not say | Say |
|---|---|
| "a replacement for ERP" | a layer next to the ERP |
| "blockchain means the data cannot be falsified" | it prevents **retroactive** rewriting; a false number entered at the start is recorded faithfully |
| "the EU directive requires producers to cut waste by 10%" | the **directive** binds Member States; but **Romanian law already binds producers directly** — Legea 217/2016 as amended by 49/2024, in force since March 2026, with fines |
| "no law tells a producer to reduce its own waste" | true of the directive, **false in Romania.** Do not say this — it is checkable and wrong |
| "we would be first" | we would not. Food Stock, PalletClearance, Merkandi and Too Good To Go all operate in EU surplus B2B (section 21) |
| "processing is 18% of food waste, retail 7%" | Eurostat 2022: processing and manufacturing **19%**, retail and other distribution **8%**, households 54% |
| "Serbian milk mostly comes from Poland" | Poland leads **by value** and in powder; by volume it is Bosnia and Slovenia, and imports fell ~29% in 2025 |
| "farmers throw away X tonnes of milk" | farmers poured out four tonnes **as a protest**; no industry-wide waste figure exists |
| "the Serbian factoring registry arrives mid-2027" | the law ties it to the day the record begins operating; no fixed date |
| "producers are paid 100+ days" | Serbia's own legislator: 68.56 days average, up to 120 contractual |
| "we reduce food waste" (to a producer) | this is cash you currently pay to throw away |

---

## 24. Where your experience beats my research

Everything in Parts II, III and IV I worked out **alone**, before we started working together, from
documents. You have twenty years inside these two markets. So there is a whole class of question
where you have information I structurally cannot get from a source, and I would rather you
correct me now than after something is built.

The split I would draw is this: **on what the law and the statistics say, trust the sources and my
marks above. On how this market actually behaves — what producers do, what chains tolerate, what
the state delivers — you have seen it and I have only read about it.** Those are the points below.
If you have encountered a similar situation before, that outranks my reasoning, and please say so
plainly.

**1. Whether a state building something actually kills an idea.** This one first, because I now
think I may have got it wrong. Killed ideas 2 and 3 both died because "the state is building
this". But I took the state's own timing at face value, and today's checking already softened it:
the factoring record has **no fixed date in the law at all** — it applies from whenever the record
starts operating. The e-otpremnica private-sector phase is 1 October 2027, still fourteen months
away.

**You have worked with the Serbian government. Do these things arrive when the law says?** If
e-otpremnica slips two years, or arrives technically but unusable in practice, then idea 3 is
alive again. And one more thing I think I got wrong: **e-otpremnica is Serbian law, and your
falsification story was in Bosnia, which it does not cover at all.** I may have killed that idea
on a law that does not reach the place where the only real evidence of the problem is.

**2. Whether restaurants are the right buyer.** Section 3 is channel isolation plus fast
consumption. Reasoning, not evidence. If producers already move surplus through some other route
that works, the whole channel choice is wrong.

**3. Whether surplus really never leads to financing** (section 16). I concluded the surplus flow
and the main invoice flow do not connect, and that closed an entire direction. If a producer would
open their main flow once someone is already useful to them, the conclusion is wrong.

**4. Whether a market really beats a registry** (section 10). I argued it from five dead
trade-finance consortia — but those were global banking and shipping consortia, not regional food.
The analogy may simply not transfer.

**5. Whether a surplus-only tool is too small to buy.** I narrowed the scope deliberately (section
2). But if producers would only buy something that covers their whole inventory, and see a
surplus-only tool as not worth installing, the scope is wrong.

**6. Whether the commercial-retaliation ban is real** (section 3). On paper it removes the
producer's largest objection. Whether anyone in the market believes it is a different question, and
not one a gazette can answer.

**7. What actually persuades a Serbian producer, given that the Romanian legal argument does not
apply there.** Serbia is decided as the first market (section 14), which means the strongest legal
lever in this document is unavailable for the first pilot. So the Serbian case rests entirely on
the economics in section 3 and on the retaliation ban. **Is that enough on its own, in a real
producer's office?** You have sat in those rooms and I have not.

**A note for Codex, or whatever AI reads this.** Do not treat Parts II–IV as settled. Respect the
claim marks: **[checked]** items were verified against the law or statistics on 8 August 2026;
**[my research]** items need confirming before being quoted; **[unconfirmed]** items must not be
quoted at all; **[reasoning]** items are one person's judgement and should be argued with. Where
Vladislav's direct market experience contradicts a **[reasoning]** item, his experience is the
better evidence.

---

## 25. Questions worth putting to Codex

These are the questions I would want answered by someone actively trying to kill the idea:

1. Go past section 21. For each of Food Stock, PalletClearance, Merkandi, ClearanceFood and Too
   Good To Go's B2B arm: how big are they, who funds them, which countries do they actually
   operate in, and has any of them entered Romania or Serbia and withdrawn? Then name anyone in
   this space who has died, and why.
2. Why would a food producer refuse to sell surplus at a discount to restaurants? List every
   objection — commercial, contractual, brand, tax, operational.
3. Does selling near-expiry food to restaurants create legal or food-safety liability in Serbia, for
   the producer, the restaurant, or an intermediary?
4. In Serbian law specifically, what separates *upotrebljivo do* from *najbolje upotrebiti do*, and
   what may still legally be sold after each?
5. **If a producer already sees expiry dates in their ERP and still lets stock expire, what is the
   real reason — information, incentive, or effort?**
6. What would a restaurant need in order to buy directly from a producer instead of from its usual
   wholesaler? What breaks in their normal ordering process?
7. Is there evidence anywhere that near-expiry B2B marketplaces have worked, and what did the
   successful ones do differently from the failures?
8. Do Serbian state IT and reporting systems historically launch on their legislated dates? Give the
   actual track record — e-fiskalizacija, SEF e-invoicing, e-otpremnica — with the original deadline
   and the real one.
9. Read sections 9 and 24. Which of the eight abandoned directions was killed on the weakest
   reasoning, and what specific evidence would bring it back? Argue for the strongest candidate
   rather than agreeing with me.
10. Is the prohibition of commercial retaliation in the Serbian trading practices law enforceable in
    practice, and has anyone been sanctioned under it yet?

**Question 5 is the one I most want an honest answer to.** If producers already know their stock is
about to expire and still do nothing, then the problem is not visibility — and this product, as
described, is solving the wrong thing and has to change shape.
