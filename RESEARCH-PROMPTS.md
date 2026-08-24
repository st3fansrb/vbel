# Research prompts — Perplexity Deep Research

> Eight independent research runs. Each prompt is standalone: paste **Block 0** first, then the
> prompt. Run order matters — R1, R2 and R5 can kill the project, so run those first.
>
> Every prompt states our own assumptions explicitly and asks for them to be **falsified**, not
> confirmed. A run that comes back agreeing with everything has failed.

---

## Block 0 — shared context (paste at the top of every run)

```
CONTEXT — read before answering.

I am researching a B2B product for the FMCG (fast-moving consumer goods) sector in Serbia
and Romania. Assess it as a skeptical analyst, not as a supporter.

What it is:
A shared record where a delivery between a producer and a retailer/distributor is attested by
BOTH parties — lot code, quantity, expiry date — so that neither side can later alter the
record unilaterally. The same dual-signed goods receipt is then used as the trigger for an
early-payment discount: the buyer pays its own invoice on, say, day 10 instead of day 100 in
exchange for a discount. The record is kept on a public blockchain (Solana), with documents
stored off-chain and only their hashes recorded on-chain.

Deliberate design constraints:
- We never buy, own, finance or take assignment of any receivable. No lending, no advancing of
  funds, no fractionalisation, no securities.
- The launch model is "dynamic discounting": the buyer settles its own commercial debt early
  for a discount. No third party provides capital.
- Later phases (not now) would involve licensed factors financing over the same record.
- Two motivations: (a) suppliers/branches falsifying stock and expiry data, reported first-hand
  by an FMCG operator in Bosnia; (b) payment terms of 100+ days for FMCG producers.

Answer requirements for every run:
1. Cite primary sources wherever they exist: official gazettes, EUR-Lex, national bank and
   ministry publications, regulator guidance, court decisions, standards bodies, audited
   statistics. Secondary reporting only where no primary source exists, and label it as such.
2. Tag every material claim: [PRIMARY] / [SECONDARY] / [UNVERIFIED]. If you cannot verify
   something, say so explicitly instead of approximating.
3. Give dates. Laws in this area changed in 2024-2026 and stale answers are worse than none.
   Note the "in force from" date separately from the "adopted on" date.
4. Search in Serbian, Romanian and English. National sources are often untranslated and the
   English coverage of Balkan regulation is thin and frequently out of date.
5. For every one of my assumptions listed in the prompt, return one of: CONFIRMED /
   PARTIALLY CORRECT / FALSE / CANNOT VERIFY — with the source and what it changes.
6. End with: the three findings that most damage this project, ranked.
```

---

## R1 — Regulatory perimeter: does this need a licence?

**Highest priority. Run first.**

```
Determine precisely what, if any, financial licensing this product triggers in SERBIA and
ROMANIA, and where the boundary sits.

Assumptions to verify or falsify:
A1. In Serbia, factoring may only be performed by a bank, a domestic company licensed for it,
    or a foreign entity in international factoring only, with minimum capital around
    RSD 40 million.
A2. Serbia amended its Law on Factoring in Official Gazette 109/2025, in force 12 December
    2025: supervision moved from the Ministry of Finance to the Securities Commission
    (powers applicable from 13 June 2026), and a Central Factoring Registry interconnected
    with e-invoicing was created to prevent multiple assignment of the same receivable.
A3. In Romania, factoring requires registration as a non-bank financial institution (IFN) with
    the National Bank of Romania.
A4. "Dynamic discounting" — a buyer paying its OWN invoice early in exchange for a discount,
    with no third party providing capital — is NOT factoring, NOT lending, and NOT a regulated
    financial service in either country. It is early settlement of a commercial debt under
    civil/commercial law.
A5. An operator that only records attestations and never touches the receivable needs no
    financial licence in either country.

Questions:
1. Cite the exact provisions defining factoring and the licensed-entity requirement in each
   country. Quote the operative text and give the article numbers.
2. Is there any regulator statement, guidance, court decision or enforcement action —
   in Serbia, Romania, or in comparable EU jurisdictions — that treats dynamic discounting,
   supply chain finance platforms, or early-payment-discount platforms as a regulated activity?
   This is the crux: has anyone ever been caught by "substance over form" here?
3. At what point does a platform that sets the discount rate, controls the workflow, or takes a
   fee out of the discount stop being neutral infrastructure and start being a regulated
   participant? Look for the tests regulators actually apply.
4. Does taking a percentage of the discount (as opposed to a flat fee or subscription) change
   the analysis in either country?
5. Is the Central Factoring Registry actually operational as of today? Is use of it mandatory,
   who must report, and is there any evidence of enforcement or of adoption levels?
6. Non-assignment clauses: under Serbian and Romanian civil law, is a contractual prohibition
   on assigning a receivable enforceable against a third party? Note that some jurisdictions
   (e.g. under the UNIDROIT/UNCITRAL approach, and in Germany §354a HGB) override such clauses
   in commercial contexts. Does either country do this?
7. Does the EU Late Payment framework, MiCA, PSD2/PSD3, or any e-money rule get triggered if
   settlement occurs in a stablecoin rather than bank transfer?
8. What licence, if any, would be needed at the LATER stage where licensed third-party factors
   finance over this record, and what is the standard structure used elsewhere (a "BaaS"-style
   arrangement between a tech platform and a licensed factor)? Cite real examples with names.

Also report: any pending legislative proposal in either country that would change these answers
within 24 months.
```

---

## R2 — Is the problem already solved by law?

**The premise-killer. Run second.**

```
Establish whether long payment terms in FMCG are already legally capped in Serbia and Romania,
and whether that makes a market-based early-payment product redundant or, conversely, gives it
a compliance-driven tailwind.

Assumptions to verify or falsify:
B1. FMCG producers in Serbia and Romania are routinely paid 100+ days after invoice.
B2. Statutory remedies (EU Late Payment Directive 2011/7 and national equivalents) exist but
    are not used, because suppliers will not sue their largest customer.
B3. EU Directive 2019/633 on unfair trading practices in the agri-food supply chain caps
    payment terms at 30 days for perishable and 60 days for non-perishable agri-food products.
B4. The EU is replacing Directive 2011/7 with a directly applicable Regulation imposing a hard
    payment-term ceiling.

Questions:
1. What are the current statutory maximum payment terms for B2B, and specifically for
   agri-food, in Romania (as an EU member) and in Serbia (as a candidate country)? Cite the
   national transposition instruments and their in-force dates.
2. Serbia has its own Law on Deadlines for Settlement of Monetary Obligations in Commercial
   Transactions. What limits does it impose, what are the exceptions, and what is the evidence
   on enforcement?
3. What is the current status of the proposed EU Late Payment Regulation (COM(2023)533)? Was it
   adopted, amended, or abandoned? What terms and enforcement mechanism does the final or
   current text contain, and from when does it apply?
4. Is there enforcement data: fines, investigations, or rulings by the Romanian and Serbian
   authorities responsible for unfair trading practices in the food supply chain? How many
   cases, what size, against whom?
5. Empirically — not legally — what are actual average payment durations (DSO) between FMCG
   suppliers and large retail chains in Romania, Serbia and the wider Balkans? Use Intrum
   European Payment Report, Atradius Payment Practices Barometer, Coface, national statistics
   offices, and any academic studies. Give numbers with years.
6. Critical question: if statutory caps of 30-60 days already exist for food products, what
   remains of the "paid on day 100" premise? Distinguish carefully between what the law
   requires and what actually happens, and quantify the gap if any source does.
7. Counter-argument to test: does a legal cap make an early-payment product MORE valuable
   (buyers need to demonstrate compliance, suppliers gain leverage) or LESS (the problem is
   already solved on paper and the remaining gap is enforcement, which software cannot fix)?
   Find evidence from markets where such caps were introduced.
```

---

## R3 — E-invoicing and data infrastructure

```
Assess whether state e-invoicing systems in Serbia and Romania can be used as an authoritative
data anchor by a third-party platform, and what the compliance landscape requires by when.

Assumptions to verify or falsify:
C1. B2B e-invoicing is mandatory and government-validated in both countries: SEF/eFaktura in
    Serbia, RO e-Factura in Romania.
C2. A third-party platform can, with the taxpayer's consent, access invoice data through an API.
C3. These two national systems do not interoperate, so a cross-border Serbia-Romania invoice
    exists in neither counterpart's registry.

Questions:
1. For each country: what exactly is mandatory today, for which transaction types, since when,
   and what is still scheduled? Include Romania's e-Transport and any SAF-T/e-VAT obligations.
2. Is there a public API? What are the authentication model, the access conditions for
   third-party software providers, rate limits, certification or accreditation requirements,
   and the costs? Link the actual technical documentation, not summaries.
3. Can a third party legally retrieve or verify an invoice on behalf of a taxpayer that has
   granted consent? What is the legal basis, and what data protection constraints apply
   (GDPR in Romania; Serbia's Law on Personal Data Protection)?
4. Can a document identifier or hash obtained from these systems serve as evidence of an
   invoice's existence and content in a dispute? Is there any legal recognition of hash-based
   or timestamped evidence in either jurisdiction, e.g. through eIDAS qualified timestamps?
5. What does ViDA (VAT in the Digital Age) require, and by when, and how does it interact with
   national systems and with Peppol and EN 16931? What happens to national formats?
6. Is Serbia's SEF aligned with EN 16931 and any EU accession commitment on e-invoicing?
7. How much genuine cross-border B2B invoicing exists between Serbia and Romania, and between
   Serbia and the EU generally? Give trade statistics and, if possible, the share invoiced
   directly across the border versus through separate local legal entities.
8. **The decisive question — answer this first and in depth.** Does either state system capture
   the GOODS RECEIPT (delivery confirmation), or only the invoice? Specifically:
   - Does Serbia have, or is it building, a state electronic delivery note — "elektronska
     otpremnica" / "e-otpremnica" — alongside SEF? What is its legal basis, its status, its
     timeline, and does it require confirmation by the receiving party or only by the sender?
   - Does Romania's e-Transport (RO e-Transport, UIT codes) amount to the same thing? What does
     it record, who confirms it, and is the arrival confirmed in the system?
   - In either system, is the recorded delivery or receipt date legally authoritative — can it
     be used to establish when a statutory payment period started?

   This determines whether a dual-attestation layer duplicates a free state system with legal
   force, or fills a real gap. If the answer is that the state already records a
   counterparty-confirmed delivery event, say so plainly.
```

---

## R4 — Traceability, expiry and food waste: is the pain real and regulated?

```
Assess the evidence for supply-chain data falsification and expiry-date mismanagement in FMCG
distribution, and map the regulatory obligations that would force better record-keeping.

Assumptions to verify or falsify:
D1. Distributors, branches and suppliers falsify stock quantity and expiry data, and this is a
    recognised problem rather than an isolated anecdote.
D2. EU law already requires one-up/one-down traceability for food, so the records exist but are
    fragmented and unverifiable across company boundaries.
D3. Digital Product Passport rules will force machine-readable product-level data.
D4. Food waste in retail and distribution is large enough to fund a product that reduces it.

Questions:
1. What documented cases, audits, court decisions, regulatory findings or academic studies
   exist on falsification of expiry dates, date relabelling, or stock record manipulation in
   FMCG distribution — in the Balkans, in the EU, and globally? Name incidents, years, scale
   and penalties. Include national food safety inspectorates in Serbia and Romania.
2. What does Regulation 178/2002 Article 18 actually require, and what does it NOT require?
   Where exactly does traceability break down between companies in practice? Cite audit or
   inspection findings.
3. Status, scope and timeline of the Ecodesign for Sustainable Products Regulation (2024/1781)
   and the Digital Product Passport: which product categories, from when, and does food or FMCG
   packaging fall in scope?
4. What binding food-waste reduction targets did the EU adopt in the 2025 revision of the Waste
   Framework Directive? Which actors are bound, by when, and with what reporting obligations?
   Does Romania have national implementing rules, and does Serbia have anything comparable?
5. Quantify food waste and write-offs at the distribution and retail stage in Romania, Serbia
   and the EU: tonnage, monetary value, and share attributable to expiry. Use Eurostat, FAO,
   national statistics.
6. GS1 EPCIS 2.0 and GS1 Digital Link: what is the actual adoption level among FMCG producers
   and retailers in Central and Eastern Europe? Is it used in practice or only specified?
   Is there an EPCIS-compatible way to record a dual-signed goods receipt?
7. Do large retail chains in Romania and Serbia already run electronic goods-receipt
   confirmation with suppliers, e.g. EDI DESADV/RECADV messages? If EDI already carries
   despatch and receipt advice between these parties, what is left for a new layer to add?
   Answer this directly — it is the strongest objection to the whole product.
8. Is there evidence that mutual, cryptographically signed confirmation changes counterparty
   behaviour, from any industry?
```

---

## R5 — Competitors, and the blockchain trade-finance graveyard

**Run third. This is where most of the risk is.**

```
Map who already does this, and analyse in depth why the blockchain-based attempts at
supply-chain and trade finance failed.

Part 1 — the graveyard. For EACH of these, establish what it was, who backed it, how much
capital it raised, when it shut down, and the specific reason for failure:
we.trade, Marco Polo Network, TradeLens, Contour, B3i, and any Serbian, Romanian or Balkan
equivalent. For each, state whether the failure cause was: insufficient network adoption,
banks' unwillingness to share a registry, the cost of onboarding, the technology itself, unit
economics, or governance. Be specific and cite post-mortems, insolvency filings and interviews.

Then answer directly: what would a new entrant have to do differently to avoid the same
outcome, and is there any counter-example of a shared-ledger B2B registry that DID reach
sustained adoption? If there is none, say so plainly.

Part 2 — the incumbents. For C2FO, Taulia (SAP), PrimeRevenue, Demica, Tradeshift, Kyriba and
any regional player active in Romania or Serbia: what do they do, what do they charge, who
pays, what onboarding do they require, and are they present in these two markets? Specifically
for C2FO and Taulia, find published data on supplier participation rates and typical discount
rates achieved.

Part 3 — the on-chain receivables players. Centrifuge, Goldfinch, Credix, Huma Finance,
Defactor, Polytrade and any Solana-native RWA receivables project: what volumes did they
actually reach, what defaults occurred, and what is their status today? Credix and Goldfinch
had loan defaults — establish what happened and what it proved about on-chain underwriting of
real-world receivables.

Part 4 — direct competitors to the specific idea: is anyone running a dual-attested goods
receipt registry, a blockchain-based delivery confirmation, or an early-payment product
triggered by confirmed delivery? Search patents as well as products.

Part 5 — Greensill. Summarise what happened, and what it did to the reputation of supply chain
finance with regulators, auditors and banks. Also: what did the 2024 IAS 7 / IFRS 7 supplier
finance disclosure amendments change, and does dynamic discounting escape the reclassification
risk that reverse factoring carries? This is a potential selling point — verify it or kill it.
```

---

## R6 — Market size and economics

```
Quantify the market for this product in Serbia and Romania, using only sourced figures.

1. Number and revenue of FMCG producers and distributors in each country. Use national
   statistics offices, company registries, and industry associations. Break down by size band.
2. Retail concentration: market shares of the largest chains in each country. Which chains, what
   share, and how concentrated is buying power? A highly concentrated buy side means very few
   counterparties must say yes — quantify exactly how few.
3. Factoring market size in both countries: annual volumes, number of licensed factors, names of
   the largest, growth rate. Use FCI statistics, national bank data, and Serbia's Securities
   Commission or Ministry of Finance registers. List the licensed factors by name — I need to
   know who a real design partner could be.
4. What do factors currently charge, and what does the verification/underwriting step cost them
   per invoice in time and money? Anything that quantifies manual verification cost is
   especially valuable, because that is what this product claims to reduce.
5. Dynamic discounting economics: what discount rates do buyers actually obtain, what
   participation rates do suppliers show, and what annualised return does the buyer earn on
   early payment? Find real published figures, not vendor marketing.
6. Willingness to pay: is there evidence of FMCG suppliers or factors paying for a verification
   or data service on a per-transaction or subscription basis? What price points appear?
7. Working capital position of large retail chains in Romania and Serbia — do they hold cash
   they could deploy into early payment, or do they run negative working capital by design and
   therefore have structural incentive NOT to pay early? Use published financial statements of
   the largest chains. This determines whether the entire dynamic-discounting premise holds.
```

---

## R7 — Technical and crypto-regulatory feasibility on Solana

```
Assess whether the technical design is sound and whether using a public blockchain creates
regulatory exposure in Serbia and Romania.

1. Serbia's Law on Digital Assets: what does it regulate, and does a non-transferable on-chain
   record that represents no financial claim fall within scope? Does merely writing attestations
   to a public chain trigger any registration, and what is the Securities Commission's remit
   over digital assets? Cite the law and any published guidance.
2. Romania under MiCA: at what point would recording attestations, or settling in a stablecoin,
   trigger CASP authorisation or e-money rules? What is Romania's national implementation status
   and which authority supervises it?
3. If a receivable were later represented as a transferable token, at what point does it become
   a financial instrument or transferable security under MiFID II and the Romanian implementation,
   and under Serbian securities law? Give the tests, not generalities.
4. Solana Token-2022 confidential transfers: current mainnet status, what exactly is hidden and
   what remains public, auditor/regulator visibility mechanisms, known limitations, and real
   production usage. Can transaction amounts genuinely be kept confidential while a public score
   is derived from them, and how is that done elsewhere?
5. Solana state compression: current cost per record, constraints, and whether it fits
   high-frequency per-lot event recording. Give actual measured costs.
6. Solana Attestation Service and any comparable attestation primitive: does it already provide
   what a dual-signed goods receipt needs, and would using it be better than a custom Anchor
   program?
7. Evidentiary value: is a blockchain record admissible as evidence in Serbian or Romanian civil
   proceedings? Any statute, court decision, or eIDAS interaction on electronic records and
   qualified timestamps? If a hash on a public chain has no evidentiary standing, the whole
   anti-falsification argument weakens — test this seriously.
8. GDPR and Serbia's data protection law versus an immutable public ledger: what must never be
   written on-chain, and does storing only hashes of commercial documents avoid the problem?
   Cite EDPB guidance on blockchain and personal data, including anything published in 2024-2026.
9. Comparable production deployments: any live system using a public blockchain for B2B
   supply-chain attestations, with real users and volumes. What did they learn?
```

---

## R8 — Red team

**Run last, after R1-R7. Paste the key findings from the earlier runs into this one.**

```
Act as an adversarial reviewer whose job is to kill this project. You are not balanced. You are
looking for the fatal flaw. Assume the team is capable and honest, and that flattery is useless
to them — the only useful output is the strongest possible case against.

Build the strongest evidence-based argument for each of the following, and rank them by how
likely each is to be fatal:

1. The problem is not real enough. Attack the two premises separately: (a) that stock/expiry
   falsification is a widespread, budgeted pain rather than one operator's bad experience;
   (b) that payment delay is a pain the intended payer will spend money on.
2. Someone already solves this. EDI DESADV/RECADV, existing ERP integrations, e-invoicing
   systems, the state factoring registry, or the incumbent dynamic-discounting vendors.
3. The blockchain is decorative. Make the strongest possible case that a Postgres database with
   two signature fields, run by a neutral third party or an industry association, delivers
   everything this design delivers, at a fraction of the cost. Then state precisely what — if
   anything — is left that genuinely requires a decentralised ledger, and whether that residue
   is worth a business.
4. The adoption maths do not work. Both sides must adopt for any single transaction to be
   useful. Quantify the cold-start problem, and use the failures of we.trade, Marco Polo,
   TradeLens and Contour as evidence for what happens to two-sided B2B registries.
5. The wrong party pays. The party that benefits from long payment terms and from opaque stock
   data is exactly the party whose signature is required. Explain why a retailer would ever
   sign up, and what happens to the product if they do not.
6. The regulatory position is more fragile than assumed. Attack the claim that dynamic
   discounting plus attestation is licence-free, particularly if the platform sets the discount
   rate, controls the flow, or earns from the spread. Find the substance-over-form precedents.
7. The team cannot execute it. One technical founder with no prior Solana/Rust experience and
   roughly three weeks, plus a commercial co-founder available for two and a half of those
   weeks. Assess honestly against comparable projects.
8. The demo proves nothing. A demo with simulated data, two wallets controlled by the same
   person, and a synthetic discrepancy — what does a technical judge or an investor conclude
   from it, and what is the single most damaging question they would ask?

For each of the eight, state: the argument, the evidence with sources, how likely it is to be
fatal (high/medium/low), and — only after making the case — the strongest available rebuttal,
including whether that rebuttal requires evidence the team does not yet have.

Finish with three things:
- The single question that, if answered badly, ends this project.
- The cheapest experiment that would answer it, and how long it would take.
- What you would build instead with the same team, the same network and the same three weeks.
```

---

## R2b — follow-up: scope of the payment caps, and the evidentiary hook

**Added after R2 came back. Run before R3-R7 — it decides which product framing is correct.**

```
Follow-up to research on statutory payment caps in Romania (Law 81/2022) and Serbia (Law on
Trading Practices, in force 1 May 2026).

1. SCOPE BY PRODUCT CATEGORY. Precisely which products fall inside and outside each law?
   Quote the definitions of "agricultural and food products" used. State explicitly whether
   each of these is covered: detergents and household chemicals; cosmetics and personal care;
   pet food; tobacco; alcoholic beverages; soft drinks; paper goods. This determines where long
   payment terms remain LEGAL and therefore where a voluntary early-payment discount has room
   to operate.

2. SCOPE BY PARTY SIZE. Both laws apply only where there is an imbalance of bargaining power,
   assessed via turnover thresholds. State the exact thresholds and how they are measured. What
   share of FMCG suppliers in each country falls outside protection?

3. WHEN DOES THE CLOCK START? For each law, from which event is the payment deadline counted —
   delivery, goods receipt, end of an agreed delivery period, invoice date, or the date the
   amount payable is determined? Quote the operative text. Then: what document proves that event
   in practice, who signs it, and what happens in a dispute where the parties disagree about the
   delivery date? Is there any case, guidance or inspection finding on contested delivery dates?

4. DOCUMENTATION DUTIES. Does either law require written contracts, delivery documentation, or
   record retention? What evidence must a complainant produce to open a case? Cite the procedural
   rules of the Romanian Competition Council and the Serbian Competition Commission, including
   anonymity, deadlines, burden of proof, and whether electronic records are admissible.

5. ENFORCEMENT DATA. Romanian Competition Council: number of UTP cases opened and concluded
   since 2022, fines imposed, sectors, and any named decisions. Serbia: any activity at all since
   1 May 2026. If no data is published, say so explicitly rather than inferring.

6. NON-AGRI DSO. Actual payment durations for NON-food FMCG suppliers to large retail chains in
   Romania and Serbia. This is the number the whole commercial case now rests on, and the earlier
   research found no source for it. Search company financial statements, supplier association
   publications, trade press in Romanian and Serbian, and academic work.

7. COMPLIANCE DEMONSTRATION. Is a buyer required to be able to demonstrate compliance with the
   caps to a regulator? Is there any reporting obligation, audit duty, or inspection regime? If
   yes, what does a buyer currently use as proof of the delivery date?

End with a direct verdict: given the answers above, is the stronger commercial wedge
(a) an early-payment discount in the non-covered categories, or (b) evidence tooling for
compliance with the caps in the covered categories? Argue for one.
```

## R5b — follow-up: is the regional wedge already occupied?

**Added after R5 found Next Capital Finance IFN running reverse factoring for Penny suppliers.**

```
Follow-up on supplier finance actually operating in Romanian and Serbian retail.

1. Next Capital Finance IFN S.A. and its Penny supplier programme: how does it work, how many
   suppliers participate, what does it cost them, what onboarding is required, and what data does
   it use to verify an invoice before funding? Who owns it, and what volumes does it report?
2. Which other retail chains in Romania and Serbia run supplier finance or early payment
   programmes — Kaufland, Lidl, Carrefour, Mega Image, Profi, Auchan, Delhaize/Maxi, Mercator,
   Univerexport? For each: is there a programme, who funds it, and is it publicly documented?
3. Ifis Finance IFN and other Romanian factors: list the licensed IFNs with factoring in their
   authorised activities, from the BNR register. Same for licensed factoring companies in Serbia,
   from the Ministry of Finance or Securities Commission register. Names, size, ownership.
4. Do any of these verify delivery before funding, and how? Is the goods receipt part of their
   underwriting today, or do they rely on the invoice and buyer confirmation alone?
5. What would it take for one of them to accept an external verification record as evidence?
   Look for published underwriting criteria, and for any statement about fraud losses from
   fictitious or duplicated invoices in these markets.
```

## R9 — the payment reputation registry: can it exist?

**Run this alone, before committing to anything. It replaces the earlier concept — do not paste
Block 0 for this one, the context below supersedes it.**

```
CONTEXT — read before answering. Assess this as a skeptical analyst, not a supporter.

The product: a payment-behaviour registry for B2B trade in Serbia and Romania, built on top of
the mandatory state e-invoicing systems (SEF / eFaktura in Serbia, RO e-Factura in Romania).

How it works: a supplier connects its own account on the state e-invoicing system and authorises
the platform to read its issued invoices. The platform determines, for each of that supplier's
customers, how long they actually took to pay. Contributions from many suppliers are aggregated
into a portable payment-behaviour score for each buyer. Each contribution is cryptographically
signed and written to a public blockchain so that no participant — including the platform
operator, and including anyone who later acquires the operator — can alter or delete an entry
under commercial or legal pressure.

Nobody is asked to buy, finance or assign a receivable. Buyers are not asked to consent or to
sign anything; suppliers report their own commercial payment experience.

Answer requirements: cite primary sources (official gazettes, EUR-Lex, national bank and
regulator publications, competition authority guidance, court decisions, technical
documentation). Tag every material claim [PRIMARY] / [SECONDARY] / [UNVERIFIED]. Give "adopted"
and "in force" dates separately. Search in Serbian, Romanian and English — English coverage of
Balkan regulation is thin and often stale. Say "cannot verify" rather than approximating.

FIVE QUESTIONS. Answer 1 and 2 first and in depth — they decide whether the product can exist
at all.

1. WHERE DOES THE PAYMENT DATE COME FROM?
   This is the load-bearing technical question. Do the state e-invoicing systems record when an
   invoice was actually PAID, or only when it was issued, delivered and accepted?
   - For Serbia's SEF: list every status and date field an invoice carries. Is there a settlement
     or payment status? Does the Central Register of Invoices (CRF) record payment? Does the
     electronic VAT recording reveal payment timing?
   - For RO e-Factura: same question.
   - If neither records payment, what is the authoritative source of the payment date — the
     supplier's bank statement, its ERP, or something else? Is there open banking in Serbia (a
     PSD2-equivalent account information service under the Law on Payment Services), and can a
     third party read a company's incoming payments with its consent? Same for Romania under
     PSD2.
   - Bluntly: is a payment date derived from a supplier's own records verifiable by anyone else,
     or is it self-reported? What would make it trustworthy?

2. IS A PAYMENT-BEHAVIOUR SCORE A REGULATED ACTIVITY?
   - Does EU Regulation 1060/2009 on credit rating agencies capture a commercial score about
     companies' payment behaviour, or is it limited to ratings of financial instruments and
     issuers? Quote the scope provisions and any ESMA guidance on the boundary between credit
     ratings, credit scores and commercial credit information.
   - Romania: is commercial credit information regulated? What is the legal basis of Biroul de
     Credit and the Centrala Riscului de Credit, do they cover B2B trade credit, and does
     operating a private trade-payment registry require any authorisation?
   - Serbia: same question — the Credit Bureau of the Association of Serbian Banks, any NBS or
     Securities Commission remit, and whether a private B2B payment registry needs a licence.
   - Data protection: scores about legal persons are outside GDPR, but sole traders and
     entrepreneurs are natural persons. What follows under GDPR / Law 190/2018 in Romania and
     Serbia's Law on Personal Data Protection? Cite any DPA guidance on commercial credit
     information and on the right to object.
   - Defamation, unfair competition and business-reputation claims: has any European company
     been successfully sued for publishing another company's payment behaviour? Cite cases.

3. WHO ALREADY DOES THIS?
   - Creditreform, Coface, Dun & Bradstreet / Bisnode, Intrum, and any local providers: do they
     publish B2B payment-behaviour data or indices for Serbia and Romania? What data feeds them
     — voluntary corporate reporting, debt collection files, court records, or something else?
     How current is it, what does it cost, and who buys it?
   - Do any of them use e-invoicing data? Has anyone in Europe built a payment-behaviour product
     on top of a mandatory e-invoicing system? Name it and say how it went.
   - Will the Serbian Competition Commission, under the Law on Trading Practices in force since
     1 May 2026, collect or publish payment-term data per company? If the state ends up
     publishing this, the product is duplicated — assess the likelihood.

4. IS SUPPLIER-SIDE DATA POOLING A COMPETITION PROBLEM?
   Suppliers who compete with each other would be contributing information about a common
   customer. Under EU and national competition law, when does information exchange between
   competitors become unlawful, and what safe-harbour conditions apply to benchmarking and
   credit-information pools — minimum number of contributors, aggregation, anonymisation, age of
   data, reciprocity of access? Cite the Commission's horizontal guidelines and any decisions on
   credit-information exchanges (including the ASNEF-Equifax judgment and anything more recent).
   State the concrete design rules that would keep such a pool lawful.

5. RETALIATION — THE COMMERCIAL QUESTION.
   Is there evidence, from any market, that suppliers will report payment behaviour about their
   largest customers? Look at how commercial credit bureaus solved this, at trade-association
   payment indices, and at any documented cases of buyers retaliating against suppliers who
   reported them. What proportion of contributors do such schemes typically achieve, and what
   protections made participation possible?

End with:
- A verdict on whether this product can lawfully exist in Serbia and in Romania, separately.
- The three findings that most damage it, ranked.
- If it cannot exist as described, the nearest lawful version that preserves the core idea.
```

## Running notes

- **Order.** Originally R1 → R2 → R5 first, because those three carried the kill risk. Those are
  done. Revised order for what remains, after what they returned:

  1. **R2b + R4 + R5b, in parallel.** R2b decides which product this is and blocks everything
     else. R4 rose sharply — its question 7 (do EDI DESADV/RECADV messages already carry
     electronic goods-receipt confirmation between these same parties?) is now the last remaining
     risk that can kill the product for technical rather than legal reasons. Prefix R4 with
     *"Prioritise questions 1 and 7. Answer those in depth even if the rest is brief."*
  2. **R3 + R7.** R3 after R4, since its goods-receipt question overlaps with R4 q7. R7 rose in
     priority: if the record functions as evidence in a proceeding, the evidentiary standing of a
     hash and its interaction with eIDAS stops being a technical detail and becomes the product.
  3. **R6.** Market sizing changes the deck, not the build.
  4. **R8** last, with the findings from everything above pasted in.
- **Serbian and Romanian sources are the point.** English-language coverage of Balkan regulation
  is thin and often two years stale. If a run returns only English secondary sources on a legal
  question, re-run it demanding national-language primary sources.
- **Watch for agreement.** Perplexity tends to confirm the framing it is given. Every prompt
  above asks for falsification for that reason. A run with zero FALSE or PARTIALLY CORRECT
  verdicts should be treated as a failed run, not as validation.
- **Feed results back into** [PROJECT_CONTEXT.md](archive/PROJECT_CONTEXT.md) §8 (regulatory), §9 (why a
  ledger) and §12 (open items), and into [ARCHITECTURE.md](archive/ARCHITECTURE.md) where an `[OPEN]`
  marker is resolved. Keep the `[PRIMARY]/[SECONDARY]/[UNVERIFIED]` tags when copying claims
  across — the honesty of the pitch depends on them.
