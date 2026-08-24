# Research findings — FMCG receivables and delivery records, Serbia & Romania

> Everything established between 22 and 25 July 2026, across nine Perplexity Deep Research runs
> plus one cold second opinion. This is the durable asset from the work: whatever gets built
> next, these facts do not change.
>
> Tags carried through from the runs: **[PRIMARY]** law, gazette, regulator, official statistics ·
> **[SECONDARY]** practitioner or vendor sources · **[UNVERIFIED]** not confirmed, or searched
> for and not found. Do not quote an [UNVERIFIED] claim on stage.
>
> Prompts that produced this: [RESEARCH-PROMPTS.md](RESEARCH-PROMPTS.md).

---

## 1. The short version

Five product framings were tried and each was foreclosed by something already in place:

| # | Framing | Killed by |
|---|---|---|
| 1 | Full on-chain factoring rail | Factoring licence + capital in both countries |
| 2 | Verification registry, anti-double-financing ("Passport") | Serbia legislated a Central Factoring Registry doing exactly this |
| 3 | Dual-attested goods receipt | Serbia legislated e-otpremnica/e-prijemnica; EDI already does it in Romanian retail |
| 4 | Compliance-evidence tooling for payment caps | Same state systems, plus mature tax-reporting stack, leave little room |
| 5 | Supplier-fed payment-behaviour registry | UK/Australia precedent; immutability conflicts with correction; score changes no decision |

The pattern, only visible in retrospect: **all five were registries of past events — trust
products.** The state is nationalising the document layer, licensed institutions own the money,
and a neutral operator running Postgres with qualified electronic signatures answers most of the
"why a ledger" argument. The team's actual assets — an FMCG network and an AI engineer — support
operational tools and distribution, not trust infrastructure.

---

## 2. Where the Serbian state has already built it

This is the single most important section. Serbia is not behind on this; it is ahead of the
product.

### 2.1 Electronic delivery notes — the direct pre-emption

**Zakon o elektronskim otpremnicama**, Službeni glasnik RS 94/2024. Adopted 27 November 2024,
published 29 November 2024, in force approximately 6 December 2024. [PRIMARY]

What the law creates:

- **e-otpremnica** — the electronic delivery note accompanying goods, issued and transmitted
  through a central system run by a Central Information Intermediary, deployed as a module of
  SEF. [PRIMARY]
- **Confirmation of physical receipt** — defined as the act by which the recipient evidences in
  the system that delivery was completed at the place of unloading. The recipient is **obliged**
  to confirm on the day of takeover, or within three working days of the receipt process
  starting. [PRIMARY]
- **e-prijemnica** — the receipt note recording **qualitative and quantitative acceptance**,
  accepting or rejecting the delivery in whole or in part, within eight days. Failure by a
  public-sector recipient to respond within eight days is deemed full acceptance. [PRIMARY]
- Authenticity of origin and integrity of content are ensured by prescribed format and central
  storage. A delivery note on which physical receipt is not confirmed ceases to be valid 30 days
  after the goods start moving. [PRIMARY]

Timeline: [PRIMARY]

| From | Who |
|---|---|
| 1 January 2026 | Public sector; movements of excise goods and all participants in them |
| 1 April 2026 | Rules governing paper delivery notes in exceptional situations |
| **1 October 2027** | **All private-sector goods movements** |

A demo environment has existed since late 2024; API documentation is published on the
e-otpremnica portal. [PRIMARY]

**What this means.** Dual attestation of a delivery — sender declares, recipient confirms
receipt, recipient accepts or rejects on quantity and quality, all timestamped with legal force —
is a mandatory, free, state-run system. The product we were designing is the state's roadmap.

Two thin residues remain, both [SECONDARY]: the state system may not mandate lot codes and
expiry dates in detail for every category, and it carries no contractual or commercial logic
(payment triggers, discounting). Neither is a business on its own.

### 2.2 Electronic invoicing — SEF

**Zakon o elektronskom fakturisanju**, Sl. glasnik RS 44/2021, amended 129/2021, 138/2022,
92/2023, 94/2024, 109/2025. [PRIMARY]

| From | Obligation |
|---|---|
| 1 May 2022 | Public sector receives and stores e-invoices; e-VAT recording |
| 1 July 2022 | Public sector issues e-invoices to private sector (B2G) |
| 1 January 2023 | **VAT-registered private entities issue and receive e-invoices in B2B**; e-VAT recording |
| 2025–2026 | Extensions: preliminary VAT returns, internal invoices, import integration |

SEF uses UBL 2.1 with a Serbian CIUS aligned to EN 16931 [SECONDARY — asserted by vendor
documentation, not spelled out in the law itself]. Invoices are stored at least ten years.
[PRIMARY]

**Critical for anything payment-related: SEF does not record payment.** Documented statuses and
dates cover creation, sending/delivery, acceptance, rejection, cancellation and contractual
maturity date. There is no "paid" or "settled" status and no actual payment date for B2B
invoices. [PRIMARY]

### 2.3 Central Register of Invoices (CRF)

Rulebook on the Central Invoice Register, Sl. glasnik RS 45/2026, effective **1 July 2026**.
Mandates registration of all electronic invoices issued to public-sector entities. Operational
and enforced through SEF validation. **Private-sector FMCG flows are not in scope.** [PRIMARY]

Note this is a *different system* from the factoring registry below — they are frequently
confused.

### 2.4 Central Factoring Registry

**Zakon o faktoringu**, Sl. glasnik RS 62/2013, 30/2018, **109/2025**. The amending law was
published 4 December 2025 and entered into force 12 December 2025. [PRIMARY]

- Art. 32a creates a **centralna evidencija faktoringa** — a central electronic database of
  invoices subject to factoring, interconnected with the e-invoicing system, explicitly to
  prevent multiple assignment of the same receivable. [PRIMARY]
- The Ministry of Finance must establish it **within 18 months** of entry into force, i.e. by
  approximately mid-2027. Reporting obligations begin 30 days after it starts operating.
  [PRIMARY]
- **Not operational as of July 2026.** [PRIMARY]
- Supervision moved from the Ministry of Finance to the **Securities Commission**, which must
  assume competences within six months (mid-June 2026) and can sanction entities performing
  factoring without authorisation. [PRIMARY]

**Consequence:** the anti-double-financing argument for a blockchain is legislated away in
Serbia. There is a window until mid-2027, but a business built on a legal gap with a known
expiry date is not a business.

### 2.5 Unfair trading practices — the newest layer

**Law on Trading Practices for Certain Types of Products.** Adopted by Parliament 23 April 2026,
**in force 1 May 2026.** Enforced by the Commission for Protection of Competition. [PRIMARY]

Payment caps: **30 days** perishable agricultural/food, **60 days** other. Counted from the end
of the agreed delivery period or the date the amount payable is set, whichever is later; agreed
delivery periods may not exceed one month. [PRIMARY]

**Serbia went wider than the EU directive requires.** Scope covers agricultural and food products
**plus** products "of particular importance for market supply": household chemicals, paper and
kitchenware, personal hygiene and cosmetics, diapers; and for agricultural production, plant
nutrition and protection products and soil improvers. [PRIMARY]

This kills the "non-food FMCG is outside the caps" wedge in Serbia. It survives in Romania only.

Turnover bands follow the EU ladder: suppliers up to €350m are protected against buyers in the
higher band (≤€2m vs >€2m; €2–10m vs >€10m; €10–50m vs >€50m; €50–150m vs >€150m; €150–350m vs
>€350m). [PRIMARY]

**Zero enforcement history** — the law is three months old. Any claim about how it is enforced is
speculation. [PRIMARY]

### 2.6 General payment terms law

Zakon o rokovima izmirenja novčanih obaveza u komercijalnim transakcijama, Sl. glasnik RS
119/2012, 68/2015, 113/2017, 91/2019, 44/2021. Private undertakings: **60 calendar days**. Public
authorities: 45 days; health fund up to 90. Exceptions up to 90 days for secured or instalment
arrangements. Late payment is a misdemeanour: fines RSD 100,000–2,000,000 for undertakings and
RSD 5,000–150,000 for responsible persons. [PRIMARY]

The payment period runs from: receipt of invoice or payment request; the performance date if the
invoice date is unclear; the end of an agreed inspection period (max 30 days from receipt of
goods); or registration of an electronic invoice in the e-invoice system. [PRIMARY]

### 2.7 What Serbia has *not* built

- No public register of **who pays when**, per company. The legislator's own explanatory note
  could give only an aggregate average — the state does not hold company-level payment
  behaviour. [PRIMARY]
- No indication the Competition Commission will publish company-specific payment data.
  [SECONDARY / UNVERIFIED]
- Cross-border. e-otpremnica is domestic; SEF and RO e-Factura do not interoperate. [PRIMARY]

---

## 3. Romania — the mirror image

| System | Legal basis | Status |
|---|---|---|
| RO e-Factura | OUG 120/2021, amended by L.139/2022, OUG 115/2023, 70/2024, 138/2024 | B2G since 1 Jul 2022; B2B reporting 1 Jan 2024; **full B2B clearance 1 Jul 2024**; B2C 1 Jan 2025; from 1 Jan 2026, 5 working days to transmit, penalties up to 15% of VAT for off-platform B2B |
| RO e-Transport | OUG 41/2022; ANAF Order 1337/2024, in force 27 Jun 2024 | UIT code per declared transport. Records consignor, consignee, carrier, goods, quantities, values, route and time window |
| SAF-T (D406) | ANAF Order 1783/2021 | Large taxpayers 2022, medium 2023, small 2025 |

All [PRIMARY]. RO e-Factura uses RO_CIUS on EN 16931, UBL 2.1 or UN/CEFACT CII; the XML held by
ANAF is the legal original for tax purposes. [PRIMARY]

**Romania has no equivalent of e-otpremnica.** RO e-Transport declares and monitors *transport*,
mainly for high-fiscal-risk goods, with an optional "Confirmare Transport". It does **not**
capture warehouse acceptance at line-item level, and there is no evidence it records acceptance
or rejection at lot or expiry granularity. [PRIMARY]

**RO e-Factura also does not record a payment date.** Fields cover issue date, supply/tax point,
transmission date, validation status and due date. [PRIMARY]

### 3.1 Payment caps — Law 81/2022

Transposes Directive (EU) 2019/633. Published Monitorul Oficial 363 of 12 April 2022, in force
approximately 15 April 2022. [PRIMARY]

- **14 calendar days** beyond the contractual due date for perishable agri-food.
- **30 calendar days** for other agricultural and food products.
- Scope: Annex I TFEU products plus non-Annex-I products processed for use as food. [PRIMARY]

The earlier Law 321/2009 sets a 14-working-day cap for fresh food; the two coexist and are not
fully harmonised. [SECONDARY]

**In scope:** pet food (Annex I prepared animal fodder), wine and grape-based drinks, soft
drinks, most alcoholic beverages. **Out of scope:** detergents and household chemicals,
cosmetics and personal care, paper goods. Tobacco is formally Annex I but the law's object is the
agri-food chain — treatment uncertain, no Competition Council guidance found. [PRIMARY /
UNVERIFIED for tobacco]

Non-food FMCG therefore falls under **Law 72/2013** (transposing Directive 2011/7): 30 days by
default, 60 days by agreement, longer only if not grossly unfair. [PRIMARY]

Law 81/2022 also **prohibits delaying reception and the drafting of reception documents** for
agri-food products, and treats a buyer's refusal to confirm contract terms in writing as an
unfair practice. [PRIMARY]

Enforcement: Competition Council, with the Ministry of Agriculture as co-implementing body.
Complaints procedure approved by Government Decision 198/2023, in force 14 March 2023; complaints
require certified copies of contracts, invoices, **delivery notes** and correspondence. Sanctions
RON 250,000–600,000, or 1% of turnover for repeat offences. **No case counts, fine totals or
named respondents found.** [PRIMARY for the rules, UNVERIFIED for enforcement data]

### 3.2 Assignment of receivables

Civil Code (Law 287/2009) Art. 1566 defines assignment; **Art. 1570** provides that an assignment
prohibited or restricted by agreement between assignor and debtor does not produce effects
against the debtor unless the debtor consented. The assignment stays valid between assignor and
assignee; the sanction is contractual damages, not nullity. **There is no commercial override
equivalent to German §354a HGB.** [PRIMARY]

Contrast with Serbia — see §4.2. This single difference makes Serbia the stronger market for any
financing layer.

---

## 4. Regulatory perimeter — what is settled

### 4.1 Factoring licensing

| | Serbia | Romania |
|---|---|---|
| Instrument | Zakon o faktoringu 62/2013, 30/2018, 109/2025 | Law 93/2009 on non-bank financial institutions |
| Who may act | Bank; Serbian company (AD/DOO) licensed by the Securities Commission; foreign bank or company **only in international factoring** | Bank under OUG 99/2006; or IFN authorised by BNR and entered in the register |
| Capital | Minimum share capital **RSD 40,000,000** | Per BNR requirements |
| Prohibition | Performing factoring without authorisation is sanctionable by the Securities Commission | Art. 2(2): professional credit activity by anyone outside the authorised list is prohibited |

Both [PRIMARY]. Romanian law lists "operaţiuni de factoring" among IFN credit activities (Law
93/2009 Art. 14(1)); BNR Regulation 20/2009 and Order 27/2010 treat factoring as a credit
operation. [PRIMARY]

### 4.2 Serbia Art. 30 — the one genuine legal asset found

> A contractual prohibition on the sale of a receivable, agreed between assignor and debtor or
> contained in the debtor's general terms, **has no legal effect** on a sale of the receivable to
> a factor carried out under a factoring contract in accordance with this law.

[PRIMARY] Functionally equivalent to §354a HGB, and the opposite of the Romanian position. This
resolves what was flagged for a week as the highest-priority unknown, and resolves it favourably —
for Serbia.

Also relevant: Art. 19 — factoring contracts are not credit or loan contracts and, if notarised
with consent to enforcement, are enforceable instruments. Art. 18 defines reverse factoring; the
debtor must obtain creditor consent. [PRIMARY]

### 4.3 Dynamic discounting

Buyer-funded early payment — the buyer settles its own commercial debt early against a discount,
with no third party advancing funds — is **not factoring, not lending, and not a regulated
financial service** in either country. [PRIMARY, by absence: no provision captures it]

**No regulator statement, guidance, court decision or enforcement action was found in Serbia,
Romania or comparable EU jurisdictions treating pure buyer-funded dynamic discounting as a
regulated activity.** [UNVERIFIED — searched and not found, which is weaker than a positive
clearance]

The position holds only while: the buyer's own funds are used; no receivable is assigned; the
platform does not hold client money, initiate payments, guarantee payment, or decide which
invoices are funded and by whom. [PRIMARY]

Reverse factoring — a funder pays the supplier and the buyer repays the funder later — **is**
regulated credit and must be provided by a bank or IFN. [PRIMARY]

Fee structure matters: a **flat or per-transaction fee** is materially cleaner than a percentage
of the discount, which strengthens any argument that the platform shares in the economics of the
financing. [SECONDARY]

### 4.4 IAS 7 / IFRS 7 supplier finance amendments

Issued by the IASB 25 May 2023; EU-endorsed by Regulation (EU) 2024/1317 on 15 May 2024;
mandatory for annual periods beginning on or after **1 January 2024**. [PRIMARY]

A supplier finance arrangement requires a **finance provider paying amounts the entity owes its
suppliers**. Self-funded dynamic discounting is explicitly outside that definition and does not
create a new financial liability, so the reverse-factoring reclassification risk (trade payables
→ bank debt) does not arise. [PRIMARY]

This is a real, citable selling point to a CFO post-Greensill — and it evaporates the moment a
third-party funder is introduced.

### 4.5 Stablecoin settlement

- **Romania:** MiCA (Regulation (EU) 2023/1114) applies from 30 December 2024; stablecoin
  (EMT/ART) rules from 30 June 2024. A platform that professionally transfers, exchanges or
  custodies tokens becomes a CASP. Merely using a third party's stablecoin for payment does not
  by itself create a PSD2 payment-institution obligation. [PRIMARY]
- **Serbia:** Law on Digital Assets, Sl. glasnik RS 153/2020. Stablecoins are digital assets;
  service providers need a licence from the Securities Commission / NBS. Virtual currencies are
  not legal tender. [PRIMARY]
- Late-payment rules are agnostic to the payment rail. [PRIMARY]

**Conclusion for architecture: no stablecoin in any production path.** A test token on devnet for
a demo is fine; touching tokens in production is a licensing perimeter in both countries.

### 4.6 Evidentiary value and eIDAS

- eIDAS (Regulation (EU) 910/2014) gives **qualified electronic timestamps** an EU-wide
  presumption of accuracy of date/time and integrity of the data. [PRIMARY]
- Romania: Law 214/2024 on electronic signatures, timestamps and trust services, effective
  8 October 2024, updating Law 451/2004. Qualified timestamps carry the legal presumption.
  [PRIMARY]
- Serbia: aligning with eIDAS as a candidate country, but **not** covered by EU-wide recognition;
  hash-based evidence would be assessed under general rules on electronic documents and expert
  evidence. [SECONDARY]
- Neither Serbian nor Romanian law recognises a blockchain record as a category of evidence.
  Courts recognise invoices, contracts and official registry entries. [PRIMARY]

**This is the finding that most damages every "immutable record" framing.** A qualified timestamp
from a certification authority delivers legally recognised proof-of-moment, cheaply, with a
presumption a blockchain record does not have.

---

## 5. What the incumbents already do

### 5.1 EDI in Romanian retail

Large chains contractually require EDI: Metro, Kaufland, Lidl, Carrefour, Auchan, Mega Image,
Profi, Selgros, Penny, Cora. Without it, orders do not flow, deliveries are penalised at
reception, invoices are rejected. [SECONDARY — EDI vendor documentation, not a primary source]

Message flow: **ORDERS** → **ORDRSP** → **DESADV/ASN** (dispatch advice, SSCC pallet labels,
product codes, quantities, often lot and expiry) → **RECADV** (receiving advice: quantities
actually received, discrepancies, reasons) → **INVOIC**. Messages are logged, timestamped and
digitally signed at transport level (AS2, OFTP2, VAN). [SECONDARY]

**So electronic, two-party goods-receipt confirmation already exists in Romanian large retail.**
The residue: each party holds its own log, RECADV is issued unilaterally by the retailer from the
retailer's system, and there is no shared object neither side can withhold or delay. EDI also
does not reach small distributors, branches, and non-EDI relationships.

No equivalent Serbian documentation was found, though the same international chains operate there
and typically roll EDI out regionally. [UNVERIFIED]

### 5.2 Supplier finance live in the region

| Programme | Structure |
|---|---|
| **Penny + Next Capital Finance IFN** (RG-PJR-41-110025, licensed 06.11.2006) | Reverse factoring exclusively for Penny suppliers. Trigger is **Penny confirming the invoice**; Next Capital then pays the supplier immediately. E-Factor portal for status. No goods-receipt or lot data in underwriting [PRIMARY for the description] |
| **Profi + Banca Transilvania + EBRD** (Dec 2024) | EBRD unfunded risk participation of €10m enabling a €20m expansion of Profi's supply-chain finance programme, EBRD taking 50% of risk [PRIMARY] |
| **Ahold Delhaize** (Mega Image RO, Delhaize Serbia) | €1,286m of trade payables under SCF at 29 Dec 2024, of which €1,100m already paid by banks to suppliers. Terms 0–180 days, classified as trade payables [PRIMARY] |
| **Ifis Finance IFN** (Banca Ifis group) | Factoring, reverse factoring, maturity option [SECONDARY] |

Other Romanian IFNs authorised for factoring: Instant Factoring IFN, Invoice Cash IFN, plus
mixed-activity IFNs (Agricover Credit, BCR Leasing, Raiffeisen Leasing). [SECONDARY]

Serbia: **22 factoring companies** as of April 2024, alongside 20 banks, 9 payment institutions
and 6 e-money institutions. The APR Factoring Register is searchable but publishes no static
roster. [SECONDARY]

**None of these use dual-signed goods receipts, lot codes or expiry data in underwriting.** The
trigger is consistently the invoice plus the buyer's confirmation. [PRIMARY]

### 5.3 Dynamic discounting vendors

C2FO: 2.62m invoices accelerated per month, average 30.8 days paid early, 9.24% average global
funding rate (Q1 2023). Costco's early payment programme grew supplier participation 141%
year-on-year, from ~10k to ~90k participants over years 3–6. [PRIMARY]

Taulia (SAP): early payment was offered on roughly **5% of throughput** — significant, but far
from universal. [SECONDARY]

PrimeRevenue, Demica/FIS, Tradeshift (Romanian HQ office), Kyriba all operate regionally.
Country-level presence in Serbia and Romania is inferred through multinational clients, not
documented. [UNVERIFIED]

### 5.4 Commercial credit information

Creditreform, Coface, Dun & Bradstreet / Bisnode and Intrum operate across CEE including Romania
and, to varying degrees, Serbia, publishing company payment-behaviour indicators and sectoral
payment indices. [PRIMARY]

Their data sources: **voluntary corporate reporting via questionnaires, debt collection files,
court records and insolvency registers.** [SECONDARY]

**No documented European payment-behaviour product built on top of a mandatory e-invoicing
system.** [UNVERIFIED — searched and not found]

---

## 6. The graveyard — every comparable shared-ledger registry

| Platform | Backers | Money | End | Stated cause |
|---|---|---|---|---|
| **we.trade** | ~11 European banks + IBM (7%); Hyperledger Fabric; incorporated Ireland Feb 2018 | ~€5m round in 2020; under €20m cumulative estimated | Creditors' meeting and PwC liquidator June 2022 (notice 9 June) | Ran out of cash after bank shareholders declined further funding; insufficient live volume; 50% workforce cut already in 2020 |
| **Marco Polo** (TradeIX) | Bank of America, Commerzbank and others; R3 Corda | Liabilities €5.2m at insolvency; a planned $12m BofA partnership collapsed after FTX | Provisional liquidators, Irish High Court, Feb 2023 | Flagship deal collapse post-FTX; failed capital raise |
| **TradeLens** | Maersk + IBM; launched 2018 | Not itemised publicly | Discontinuation announced 28–29 Nov 2022, shut end Q1 2023 | "Full global industry collaboration has not been achieved"; not commercially viable. Rivals reluctant to feed a Maersk-led platform |
| **Contour** (ex-Voltron) | Bangkok Bank, BNP Paribas, Citi, HSBC, ING, SEB, SMBC, Standard Chartered + Bain, R3; 22+ bank members | Not public | Memo 27 Oct 2023, operations ceased 30 Nov 2023 | CEO: "the problem was the business funding model", not the technology. No lead investor. 60–70 transactions per month |
| **B3i** | 21 insurers and reinsurers; B3i Services AG, Switzerland, 2018 | >$20m / ~€23m raised | Swiss insolvency filing July 2022 | Swiss Re CFO: "we did not see the volumes in the demand" |

All [PRIMARY] for the shutdown facts, [SECONDARY] for the post-mortems.

**No counter-example exists** of a bank-centric shared-ledger trade registry reaching sustained
commercial adoption. The nearest adjacent success is IBM Food Trust (500+ participants, 25m+
products tracked) — but permissioned, and a traceability system, not a financing registry.
[SECONDARY]

Common failure mode: value required everyone to join before anyone got anything. **Any design
where both sides of a transaction must adopt before value exists should be assumed to fail.**

### 6.1 On-chain receivables — what defaults proved

- **Goldfinch / Tugende:** $5m loan October 2021, interest ~$53.4k monthly until May 2023,
  default from June 2023. Covenant breaches on loan-to-value and net-worth ratios; $1.9m of the
  Kenyan facility diverted to Ugandan operations without consent. Senior pool NAV write-down of
  ~3.95%, possibly reduced below 0.79% after restructuring. [PRIMARY]
- **Huma v2:** $1.6m of bad debt. [SECONDARY]
- **Centrifuge:** >$530m TVL in H1 2025 (+327%), later $1bn+, ~$1.34bn by 2026 — genuine
  adoption, but for fund tokenisation, not delivery receipts. [PRIMARY/SECONDARY]
- **Credix:** ~$40m loans outstanding late 2023, later a R$300m BTG-backed facility. No
  publicised defaults. [PRIMARY/UNVERIFIED]

Lesson: on-chain structure does not remove credit risk, covenant breaches or the need for
off-chain legal enforcement. Recovery happens in local courts.

### 6.2 Greensill

Administration March 2021; BaFin froze Greensill Bank AG and reportedly filed a criminal
complaint over unsubstantiated GFG Alliance receivables; Credit Suisse closed $10bn of linked
funds; FCA formal investigation; UK Treasury Committee "Lessons from Greensill", July 2021.
[PRIMARY]

Effect: durable regulator, auditor and bank scepticism toward supply chain finance opacity — and
the reason the IAS 7 distinction in §4.4 is worth something.

### 6.3 State-mandated payment-behaviour registries

The UK's payment practices reporting regime (2017) and Australia's Payment Times Reporting Scheme
(2021) are state-mandated payment-behaviour registers with full coverage and no cold start.
Australia's 2023 statutory review is reported to have concluded the scheme was not changing payer
behaviour and required overhaul. [UNVERIFIED — asserted in a cold second opinion, **not yet
confirmed against primary sources. Verify before quoting.**]

If it holds, it is decisive: compulsion plus complete data barely moved large buyers, so a
voluntary private version with partial data will not.

---

## 7. Numbers worth keeping

Payment behaviour — the evidentiary hole that took four runs to fill:

- **Serbia:** the explanatory materials to the Law on Trading Practices state an average agreed
  payment term of **68.56 days**, with contractual maxima **up to 120 days** in some categories
  (sweets cited), and delays extending beyond 60 days. [PRIMARY — the legislator's own figure]
- **Romania:** average receivables collection ~**85 days**; wholesale and food production ~82
  days; agriculture 160+ days. [PRIMARY]
- CEE generally: 53% of B2B credit sales overdue. [SECONDARY, Atradius 2025]

"100+ days" was never sourced and should not be used. The Serbian 68.56/120 figures should.

Factoring market:

- Romania: €9.4bn in 2024 (+8% YoY), €10.503bn in 2025. Domestic 88%. Reverse factoring €3.37bn
  in 2024 → €3.624bn in 2025. **FMCG is the largest sector at 16.3% of total factoring in 2024,
  ≈ €1.43bn.** [PRIMARY, Romanian Factoring Association]

Trade:

- Serbia–Romania bilateral goods trade €2.7bn in 2025 (Serbian exports €1.4bn, imports €1.3bn).
  [PRIMARY, Serbian MFA]
- Serbia total external goods trade 2024: €69.547bn, EU share 58.8%. [PRIMARY]
- The share invoiced **directly** cross-border versus through local subsidiaries is not published
  anywhere. [UNVERIFIED]

Food waste (EU 2020 baseline, Eurostat): 127 kg per inhabitant, ~57m tonnes. Households 55%,
processing and manufacturing 18%, primary production 11%, food services 9%, **retail and
distribution >4m tonnes, 7%, ~9 kg per inhabitant.** No Romania- or Serbia-specific figures
extracted, and no source isolates the share attributable to expiry. [PRIMARY / UNVERIFIED]

---

## 8. Blockers, ranked

1. **The Serbian state has legislated the dual-attested delivery record**, mandatory for the
   private sector from 1 October 2027, free, with legal force. [PRIMARY] Any product whose core
   is a goods-receipt record is competing with a statute.
2. **Both sides must adopt before value exists** — and five funded consortia died of exactly
   this. [PRIMARY]
3. **Postgres plus qualified electronic signatures answers most of "why a ledger."** A qualified
   eIDAS timestamp carries a legal presumption a chain record does not. [PRIMARY]
4. **The party whose signature is needed is the party that benefits from the status quo.** Large
   buyers gain from long terms and from opaque delivery records, and they control delisting.
5. **The payment-term wedge is legally, not commercially, available.** Caps of 14/30 (RO) and
   30/60 (RS) mean day-100 payment in covered categories is illegal, not a market gap — and
   Serbia's law also covers non-food FMCG. Enforcement is a state capacity problem software
   cannot fix. [PRIMARY]
6. **Reverse factoring is already live at scale** in Romanian retail, at €3.6bn a year, with FMCG
   the largest segment. [PRIMARY]
7. **No state system records a payment date.** Any payment-behaviour product needs bank or ledger
   integration per supplier, landing the integration burden on the smallest firms. [PRIMARY]
8. **Immutability conflicts with correction.** Reputation data about named companies needs
   dispute resolution; append-only means a wrong entry is permanent — a liability, not a feature.
9. **Anti-double-financing is legislated away in Serbia** from mid-2027. [PRIMARY]
10. **Food and feed are excluded from the Digital Product Passport** (ESPR 2024/1781), removing
    that regulatory tailwind entirely. [PRIMARY]
11. **No evidence that mutual cryptographic signing changes counterparty behaviour.** Blockchain
    traceability pilots show faster recalls and consumer trust; none show measured reductions in
    expiry falsification or stock misreporting. [PRIMARY/UNVERIFIED]
12. **Stock/expiry falsification is not documented as a systemic problem** in Serbia or Romania.
    Regulators find and fine expired products on sale, but nothing formally classifies distributor
    or branch data falsification as a recognised category. The Bosnia account remains a
    first-hand anecdote. [PRIMARY for enforcement actions, UNVERIFIED for the systemic claim]

---

## 9. Open items, still unverified

- UK and Australia payment-reporting schemes and the 2023 Australian statutory review — §6.3.
  **Verify before use.**
- Serbian foreign-exchange rules on domestic resident payments (RSD-only through licensed
  channels) and what they permit for any on-chain settlement leg. [UNVERIFIED]
- Whether Serbian ERP and bookkeeping vendors (SAGA, Pantheon, Minimax) will bundle e-otpremnica
  support for free, as they did for SEF. [UNVERIFIED] — decides whether an e-otpremnica overlay
  has any commercial room.
- Western Balkans SEPA accession status and timeline. [UNVERIFIED] — time-bombs any cross-border
  settlement premise.
- Whether Serbia has licensed account-information service providers a third party could rent,
  under the Law on Payment Services. [UNVERIFIED]
- Whether large Serbian retailers run EDI DESADV/RECADV with suppliers as Romanian chains do.
  [UNVERIFIED]
- Enforcement data for Law 81/2022 in Romania: case counts, fines, named respondents. [UNVERIFIED]
- Tobacco's treatment under Law 81/2022. [UNVERIFIED]
- Serbian factoring company roster by name — the APR register is interactive-only. [UNVERIFIED]

---

## 10. What survived as usable

Not everything here is negative. These are assets:

1. **Serbia is the stronger market for anything touching receivables**, because Art. 30 overrides
   non-assignment clauses for licensed factors and Romania has no equivalent. [PRIMARY]
2. **A citable, legislator-sourced payment-term figure** — 68.56 days average, up to 120
   contractual. [PRIMARY]
3. **Dynamic discounting is licence-free** in both countries, and is explicitly outside the
   IAS 7 supplier-finance definition, so it carries no reclassification risk. That is a real CFO
   argument. [PRIMARY]
4. **Named, licensed potential partners:** Next Capital Finance IFN, Ifis Finance IFN, Instant
   Factoring IFN, Invoice Cash IFN in Romania; 22 licensed factoring companies in Serbia.
5. **A forced-adoption wave with a date:** every Serbian private company must be on e-otpremnica
   by 1 October 2027, and on SEF already. Whatever gets built, that mandate is a distribution
   event.
6. **The FMCG network's real role is now clear** — distribution channel and pilot machine, not a
   data source. It grants proprietary pilot access no foreign competitor can match, and its
   natural position in finance is partner to banks and IFNs, never their competitor and never a
   registry.
