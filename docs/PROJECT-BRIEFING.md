# FMCG project — full briefing

> **Read this first if you are picking this project up cold.** It is written to be
> self-contained: everything current, everything already ruled out, and what is verified
> versus assumed. Last updated **27 July 2026**.
>
> Claim tags carried through from research: **[PRIMARY]** law, gazette, regulator, official
> statistics · **[SECONDARY]** practitioner or vendor sources · **[UNVERIFIED]** searched
> for and not confirmed. Never present an [UNVERIFIED] claim as fact.
>
> **Two rules for anyone advising on this project:**
> 1. Read §4 before proposing anything. Eight directions are already dead, each for a
>    documented reason. Re-proposing one wastes the session.
> 2. Read §11. Certain phrasings are banned because they are checkable and wrong.

---

## 1. What this is, in one line

**A software product for FMCG producers in Serbia and Romania that tracks stock and expiry
across all their operating points, reduces waste — and later, a market where stock nearing
its expiry date is sold at a descending price.**

The app comes first. The market comes second. Nothing else is being built.

---

## 2. The people

**Stefan** — technical founder. AI/ML engineer. Strong TypeScript (two prior projects at
~200–250k LOC each), Python, Flutter/Dart. **Has never written Rust or Anchor.** Student at
UPT Timișoara. Based in Timișoara, Romania.

Important: **Stefan does not intend to remain CTO long-term.** He is closer to a
CEO/founder profile — technical enough to direct and evaluate engineering work, but the
long-term role he wants is product and direction, not being the engineer. This has **not
yet been said to Vladislav**, who is planning as though he has found a technical
co-founder. That conversation is pending and is the highest-priority interpersonal item.

**Vladislav** — commercial founder. 20+ years in FMCG and retail in Serbia and Bosnia. His
agent brought a large share of international brands into Serbia; he also has a contact in
Timișoara. Past experience working with the Serbian government. Available from roughly
**7–8 August 2026**; part-time before and after. Will be a **judge at UniHack**, which
creates a conflict-of-interest issue if Stefan enters with a shared project.

**Nobody else is on the team.** An ex-Deloitte C-level freelancer has been mentioned but has
never confirmed a role. Until he does, he does not exist for planning purposes.

**Equity has not been discussed or agreed.** No entity exists yet.

---

## 3. Current strategy

### 3.1 What changed on 27 July

Vladislav asked the Solana Summit organisers directly how selection works. Answer: many
teams applied, a large share already have traction or funding, so reaching the top ten
without either is not realistic.

**Consequences:**
- **Not applying to Demo Day.** Attending the Summit only — for conversations, intelligence
  and relationships. No demo to build.
- **The three-week build deadline is gone.** The real horizon is ~12 months.
- **The goal is now funding and traction**, not a pitch.

### 3.2 Why this reopened the product decision

The producer app had the highest probability of working and the lowest difficulty of every
option considered. The **only** thing that disqualified it was: no blockchain → no Summit
demo → no ecosystem grant.

That constraint has now fallen three times over — no Summit demo, ecosystem grants do not
fit a non-crypto project anyway, and the Romanian funding channels do not require crypto.

**So: the producer app is the first build. This is settled.**

### 3.3 The sequence

1. Build the producer app (stock, expiry, waste, later forecasting).
2. Sell it to 2–3 Serbian producers through Vladislav's network, on subscription.
3. Revenue proves the business — it is **evidence, not fuel**. Realistically €1–2k/month.
4. Use warm introductions into Vest Ventures **only once there is a paying producer**.
5. Seed round, where dilution is normal and the price is far better.
6. The market layer comes after, and only if the demand for it is proven separately.

### 3.4 Geography

**Entity in Romania. Pilot in Serbia.** Romania has the EU funding, legal certainty, eIDAS,
MiCA clarity, and it is where Stefan lives. Serbia has the network.

Key insight: **the first pilot needs no legal presence in Serbia at all**, because the test
design has money flowing directly between producer and buyer. Serbian structure is only
needed when money starts flowing *through* the company — which is much later than assumed.

**[OPEN]** Whether EU/regional Romanian funds allow expenses incurred in Serbia. Regional
funds normally require activity in the region. Must be asked, not assumed.

### 3.5 Serbian political risk

Vladislav's read, from direct past experience: the people currently running things are
self-interested and not the good kind, there is unrest, and the situation may change. He
will know what is possible and with whom once it settles. Nothing should be assumed about
the Serbian state for now.

**Impact on the plan: small.** All state dependency lived in the product that was already
killed (the dual-attestation registry, which would have had to interoperate with
e-otpremnica). The app needs nothing from the state. The market needs nothing from the
state. What remains is general climate risk — currency, contract enforcement, whether a
pilot producer stays solvent.

---

## 4. Dead directions — do not re-propose

Each was killed for a documented reason. Full evidence in `RESEARCH-FINDINGS.md`.

| # | Direction | Killed by |
|---|---|---|
| 1 | Full on-chain factoring rail | Licence + capital in both countries. RS: bank, or company licensed by the Securities Commission with RSD 40m minimum capital. RO: IFN registered with BNR. [PRIMARY] |
| 2 | Verification registry / anti-double-financing ("Passport") | Serbia legislated a Central Factoring Registry doing exactly this (Zakon o faktoringu 109/2025, due mid-2027) [PRIMARY] |
| 3 | Dual-attested goods receipt | Serbia legislated e-otpremnica / e-prijemnica — free, mandatory, with legal force. EDI DESADV/RECADV already does this in Romanian large retail [PRIMARY / SECONDARY] |
| 4 | Compliance-evidence tooling for payment caps | Same state systems plus a mature tax-reporting stack leave no room; enforcement is a state capacity problem software cannot fix |
| 5 | Supplier-fed payment-behaviour registry | No state system records a payment date; immutability conflicts with correction; UK/Australia precedent suggests even mandatory schemes barely moved payer behaviour |
| 6 | Own coin / stablecoin | MiCA: fiat-referencing stablecoins are e-money tokens, issuable **only** by credit institutions or authorised EMIs. "Investors for the coin" turns it into a probable transferable security → prospectus obligation [PRIMARY] |
| 7 | Consumer loyalty app now | Different business, no consumer distribution, and it was already ruled out of scope |
| 8 | Payment-behaviour data from marketplace escrow | **Design contradiction.** Escrow means prepayment; prepayment eliminates trade credit; no trade credit means no payment behaviour to observe. Caught independently by two adversarial reviews |

**The pattern behind 1–5:** all five were registries of past events — trust products — in a
market where the state is nationalising the record layer and licensed institutions own the
money. Any ninth idea that is also a registry can be rejected without analysis.

**A second pattern worth naming:** after each failure the product was reframed so that the
blockchain survived. That is technology-preserving thesis drift, and it was diagnosed
explicitly by an adversarial review. The chain is now optional, so the pattern should stop.

---

## 5. Verified research — the load-bearing facts

### 5.1 The law that helps

**Directive (EU) 2025/1892**, in force 16 October 2025. Binding national food-waste
reduction targets for 2030: **−10% in processing and manufacturing**, −30% per capita at
retail and consumption, against the 2021–2023 average. Member States must adapt national
food-waste prevention programmes by 17 October 2027. [PRIMARY]

Two precisions that must not be dropped:
- The targets bind **Member States, not individual companies.** No law today tells a
  producer to cut its own waste by 10%.
- **Romania is bound. Serbia is not** — it is not an EU member. It aligns as a candidate
  country, nothing more.

Why it still matters: the 10% target sits on processing and manufacturing — the customer.
EU figures put processing and manufacturing at **18%** of all food waste, against **7%** for
retail and distribution. [PRIMARY]

### 5.2 What the Serbian state has already built

- **Zakon o elektronskim otpremnicama**, Sl. glasnik RS 94/2024. State electronic delivery
  note; recipient **obliged** to confirm physical receipt within three working days; a
  second document (e-prijemnica) records quantitative and qualitative acceptance. Public
  sector from 1 Jan 2026; **all private-sector goods movements from 1 October 2027.** [PRIMARY]
- **Central Factoring Registry** — Zakon o faktoringu 109/2025, due mid-2027, not
  operational as of July 2026. [PRIMARY]
- **Law on Trading Practices**, in force 1 May 2026. Payment caps 30 days perishable food /
  60 days other — and Serbia went **wider than the EU requires**, covering household
  chemicals, cosmetics, paper goods and diapers. Zero enforcement history. [PRIMARY]

### 5.3 Romania

- **RO e-Factura** — full B2B clearance since 1 July 2024. **RO e-Transport** — UIT codes,
  transport monitoring only, no warehouse acceptance at line-item level. No equivalent of
  e-otpremnica. [PRIMARY]
- **Law 81/2022** — 14 days perishable agri-food, 30 days other agri-food. Detergents,
  cosmetics and paper goods fall outside, under Law 72/2013 (30/60 days). [PRIMARY]
- **Civil Code art. 1570** — a contractual ban on assignment is effective against the
  debtor. **No commercial override**, unlike Serbia. [PRIMARY]

### 5.4 Facts that constrain any design

- **Neither SEF nor RO e-Factura records a payment date.** [PRIMARY] This is a real, verified
  gap and the most durable data asset available — but reaching it requires seeing a
  producer's main invoice flow, not surplus transactions.
- **Holding buyer funds is a regulated payment service** — money remittance under Romanian
  Law 209/2019 and Serbian Law on Payment Services art. 10. The technical-service exemption
  survives only if the platform never possesses the funds. Stablecoin escrow is worse, not
  better. The only lawful structure is a licensed PSP holding the money. [PRIMARY]
- **No single PSP covers both markets** — Stripe does not support Serbia as an account
  country. [PRIMARY]
- **Serbia Art. 30 (factoring law)** overrides contractual bans on assignment when a
  licensed factor is the buyer. Romania has no equivalent. This makes Serbia the stronger
  market for any future financing layer. [PRIMARY]
- **Blockchain records are not a recognised category of evidence** in either country. A
  qualified eIDAS timestamp carries a legal presumption that a chain record does not.
  eIDAS 2.0 also recognises **qualified electronic ledgers** (art. 45k–45l). [PRIMARY]
- **Five funded blockchain trade consortia died** — we.trade, Marco Polo, TradeLens,
  Contour, B3i, all between 2022 and 2023. No successful counter-example exists. Common
  cause: value required everyone to join before anyone got anything. [PRIMARY]

### 5.5 Numbers worth quoting

- Serbia: average agreed payment term **68.56 days**, contractual maxima up to **120 days**
  — the legislator's own figure. [PRIMARY]
- Romania: average receivables collection ~**85 days**; wholesale and food production ~82.
  [PRIMARY]
- **"100+ days" was never sourced. Do not use it.**
- Romanian factoring market €10.5bn in 2025; **FMCG is the largest sector at 16.3%.** [PRIMARY]

---

## 6. The product

### 6.1 Layer structure

| Layer | What it is | Status |
|---|---|---|
| **L0 — the record** | Producer records every lot: product, quantity, expiry, location, across all operating points. Append-only. | **Being built first** |
| **L1 — the market** | Lots nearing expiry enter a descending-price auction with funded standing bids. | Later, and only if demand is proven |
| **L2 — behaviour** | Payment timing per buyer; demand forecasting. | Payment half is **broken** (see §4 #8). Forecasting survives |
| **L3 — financing** | Licensed factors finance over the record. Platform never owns a receivable, never advances funds. | Far future |

**The dependency that matters:** L1 does not feed L3. Surplus is an adversely selected corner
of a producer's business; the receivable a factor would finance is the main contracted
invoice, which never touches a surplus marketplace. The path to L3 runs through **L0 seeing
the producer's main flow** — which is where the missing payment date lives.

**Degradation, which is the real robustness:** each failed layer leaves the layer below it,
which is already a sellable product. L0 is the only true dependency.

### 6.2 The auction mechanism (for when L1 is built)

Descending price in discrete steps, plus funded standing maximum bids.

- `P(t) = max(floor, start − step × ⌊(t − start_ts) / interval⌋)` — a deterministic function
  of on-chain parameters, so anyone can verify the price at any moment.
- A buyer either buys at the current price or leaves a **standing maximum** with funds held.
- The **highest standing maximum wins** when the clock reaches it, and pays the **step
  price**, not their maximum.
- The **best standing maximum is visible** (amount only). This is what creates competition:
  demand pushes up while the clock pushes down.
- The seller and their org cannot bid on their own lot.

**Supply is context, not mechanism.** Showing "3 similar lots listed" is fine. Feeding supply
into the curve destroys the determinism that is the only honest reason to be on-chain.

### 6.3 Where a blockchain earns its place — honestly

Only at settlement and as a verifiable auction record. Everything else is better on Postgres
plus qualified electronic signatures. **The current first build has no blockchain in it at
all**, and that is correct.

In production, once money moves through a licensed PSP, the chain's remaining job is the
bid log — which answers *"the seller gave the lot to a friend at a lower price"*. That is a
neutrality argument, and it is modest. Do not claim more.

---

## 7. Technical

### 7.1 Stack decision

**React + TypeScript, web first.** Native mobile only if a pilot proves branch operators
need offline capture.

Reasoning: HQ is the buyer and works on desktop; Solana wallet tooling is JS-first; one
language across everything is the largest available simplification for a solo developer;
and the React/TS hiring pool in RO/RS is far larger than Flutter — which matters because
Stefan is not staying CTO.

### 7.2 Frigo — what is reusable

Repo: `github.com/st3fansrb/frigo` (private). Flutter + Firebase, Riverpod, go_router,
~16,900 lines of Dart, feature-sliced. Built for HackTM.

**Ports to TS in roughly 2–3 days — logic and data, not UI:**
- EAN-13 normalisation and the Open Food Facts resolution chain. GTIN is the same
  identifier for FMCG.
- `deleteItemWithTracking` — already distinguishes wasted from consumed and accumulates
  `kgWasted`. This is the metric the EU directive argument rests on.
- Expiry maths (`daysUntilExpiry`) and the fresh-produce shelf-life dataset.
- The `FoodItem` shape — roughly 80% of the lot schema.

**Not reusable:** meal planner, recipes, shopping list, cart, Nutri-Score — 21 of ~72 Dart
files, all consumer-facing.

**Must change:** Firestore scopes everything as `users/{uid}/pantry`. A producer with ten
operating points needs `orgs/{orgId}/...` with roles. This is the single biggest structural
change and it is cheap now, a migration later.

### 7.3 Rules that prevent a rewrite

1. **Organisation-scoped data from the first commit.** Never `user_id` on a lot.
2. Postgres is the operational source of truth; any chain is an anchor for a subset.
3. On-chain: hashes and auction parameters only. No commercial terms, no documents.
4. `expiry_kind` as a typed enum — `use_by` vs `best_before`. Selling after *use by* is
   prohibited in the EU; after *best before* it is permitted. The product lives on that line.
5. Every state change is an appended event, never an edited field.
6. Settlement behind an interface with two adapters, so the demo path and the PSP path are
   swappable.

---

## 8. Commercial

### 8.1 Pricing

- **Per location, unlimited users.** Per-seat pricing is a trap: if accounts cost money, HQ
  limits them, branches share logins, and the data coverage — the entire product — thins out.
  Three bands is enough.
- **Roughly €150–500/month per producer** is the credible band. Below €100 reads as not
  serious; above €1,000 triggers a procurement process. *This is reasoning, not measured
  market data — Vladislav can validate it in one conversation.*
- **Subscription for the app, commission per lot for the market.** Two products, two pricing
  logics, both correct. Usage pricing on the app taxes exactly the behaviour that produces
  the data asset.
- **The first two or three are priced for commitment, not revenue.** Free is worse than
  cheap: a producer paying €200/month answers the phone; one getting it free does not.

### 8.2 Realistic expectations

Networks produce **meetings, not customers.** Conversion from warm intro to paying B2B
customer is 10–30% at best, over a 2–6 month sales cycle. With one part-time commercial
person, **year one is 3–10 paying producers**, not tens. Tens is a year-two number and needs
someone selling full time.

### 8.3 Traction, defined

Not users, not MRR. **One producer moving one real lot through a real channel.** That is the
bar, and it is months away, not a year.

---

## 9. Funding landscape

| Source | Fit | Size | Status |
|---|---|---|---|
| **Vest Ventures** — €16.6m, €7m direct + €6m acceleration, West Region (Timiș, Arad, Hunedoara, Caraș-Severin), Seed/Series A, software & AI | Strong. Stefan has attended their demo day | direct or accelerator | **Warm intros exist — see below** |
| **Asternova Vest** — €37m target, €26m+ ADR Vest anchor, tickets €500k–€4m | Right region, later stage | €500k–4m | For the seed round |
| **PoCIDIF Action 2.1** — AI and advanced technologies | Good, but likely needs an existing SRL with history | €200k–3m | Opened 30 June, **closes 30 Sept 2026** |
| **FIRST** (ADR Vest, launched March 2026, €3m, 46 months) | **Connector, not funder.** Routes to the above | — | Contact exists via LinkedIn |
| Solana / Ethereum ecosystem grants | **Weak — this is not a crypto project** | small | Deprioritised |

**Warm access already exists into Vest Ventures:** a contact named Radu, and a family friend
who knows one of the cofounders. Vladislav knows people in that circle too.

**The discipline that matters: do not spend these introductions yet.** One first impression
per fund. Used now with nothing to show, they are wasted. Used in four to six months with a
paying producer, the same door converts. They are an asset to time, not to spend.

**Dilution:** bootstrap to revenue, dilute at seed. Accelerator equity would buy network
access that already exists.

---

## 10. Calendar

| When | What |
|---|---|
| **~7–8 August 2026** | Vladislav becomes available. The planning session: role, equity, product, pilot. Everything waits on this |
| **31 August 2026** | **EU Agri-Hackathon application deadline.** Applying as an individual. See [EU-AGRI-HACKATHON.md](EU-AGRI-HACKATHON.md) |
| **30 September 2026** | PoCIDIF deadline — probably a target for next year, not this one |
| **September 2026** | Solana Summit — attending only, no application. Value is conversations and intelligence |
| **16–18 October 2026** | **EU Agri-Hackathon**, online, 48h. DG AGRI, first edition |
| **~mid-November 2026** | UniHack Timișoara. *Inferred from the pattern: 2023 was 17–19 Nov, 2025 was 14–16 Nov. Not confirmed* |
| **8–9 December 2026** | EU Agri-Food Days, Brussels — award ceremony, only if the hackathon is won |
| **May 2027** | HackTM — **Best Startup track.** The legitimate venue for the real company |

**EU Agri-Hackathon** is the best-aligned event on this calendar: DG AGRI's own initiative,
the same policy machine that produced Directive (EU) 2025/1892, which is the project's legal
argument. Unlike the Solana Summit, nothing has to be translated to fit the room. Applying
as an individual specifically because the assigned teammates — farmers and agri-food
professionals from other member states — are the actual prize, being the network this
project entirely lacks.

**UniHack:** 48h, teams of **2–5** (so going solo is not possible), students and high
schoolers, ~300 participants, ~81 projects, 16 prize categories in 2023, €2,000 grand prize
plus €500 track prizes. Past tracks have included Green Future (Timișoara City Hall),
Knowledge Bridge, Unity Rising, Healthcare Revolution. **Tracks change yearly with sponsors.**

**HackTM 2026** ran 11–16 May, six-day format, €10,000 total across five tracks: Best
Startup, Best Impact, Best Open Innovation, Best Security & Defense, Best AI. Organised by
Banat IT.

**The clean split:** UniHack is a 48h student event where code is written on site — bring
something **new and adjacent** there, not the company's product, and not pre-built code.
HackTM has a Best Startup track where a real company belongs openly.

**Two cautions:**
- Vladislav judging UniHack is a conflict if Stefan enters with a shared project. Declare it
  to the organisers in advance.
- Do not build the company's product at any hackathon. Hackathon rules often grant organisers
  and sponsors licences over submitted work, and teammates met 48 hours earlier may
  reasonably claim ownership. That ambiguity surfaces at due diligence.

---

## 11. Language discipline — non-negotiable

These are banned because each is checkable and wrong, and each would be attacked in a room
containing banks or lawyers.

| Never say | Say instead |
|---|---|
| "blockchain means the data cannot be falsified" | the ledger prevents **retroactive** rewriting; a branch entering 96 when there are 90 is recorded faithfully |
| "a substitute for ERP" | a layer on top of ERP |
| "we penalise late payers" | we price money by payment behaviour |
| "an advisor from Deloitte" | an advisor with fifteen years at Deloitte, freelance |
| "the EU directive requires producers to cut waste 10%" | it binds **Member States**, not companies; Romania is bound, Serbia is not |
| "producers are paid 100+ days" | Serbia's own legislator: 68.56 days average, up to 120 contractual |

**The deepest trap, worth understanding rather than memorising:** append-only storage does
nothing at the point of data entry. Putting a false number on a ledger does not prevent the
lie — it notarises it, and makes it look verified to whoever reads it downstream. That is
strictly worse than a spreadsheet. What immutability actually prevents is *later adjustment*,
which is how this fraud is normally committed.

---

## 12. Open items

| # | Item | Owner |
|---|---|---|
| 1 | **Role and equity conversation with Vladislav** — he is planning as though Stefan is the long-term CTO. Include vesting (4 years, 1-year cliff) | Stefan, ~7 Aug |
| 2 | The ten operating points Vladislav described: the producer's **own branches** or **independent distributors**? Own branches means one adopter. Independent means two, which is the pattern that killed five consortia | Vladislav |
| 3 | The Bosnia falsification story in precise detail — what, by whom, how discovered, what it cost, can it be told publicly | Vladislav |
| 4 | Register a Romanian SRL. Required for any grant, fund or invoice | Stefan |
| 5 | Are EU/regional Romanian funds usable for expenses in Serbia? | Stefan — ask ADR Vest |
| 6 | Do Food Stock and PalletClearance already operate in RO/RS? | Stefan |
| 7 | Real software spend of producers Vladislav knows — validates the pricing band | Vladislav |
| 8 | Why did the Ethereum vending machine project die? A free post-mortem on crypto payments | Vladislav |
| 9 | UniHack rules on pre-existing projects, and the next edition's date | Stefan — ask Liga AC |
| 10 | Who is who at Vest Ventures — partners, decision-makers, portfolio | Stefan |
| 11 | Anonymised invoice, delivery note, retail supply contract | Vladislav |

**The cheapest unrun experiment:** three real short-dated lots from one producer, 15–20
qualified buyers in one category and radius, a falling-price offer by message, buyer pays the
producer directly, no software and no money through the company. ~€300 and one week. It needs
Vladislav, so it can run from August. **Preregistered kill rule:** if fewer than two of three
lots attract two binding bidders within 24 hours, or net recovery does not beat the seller's
existing route, the market layer is dead — not postponed.

---

## 13. Working style

- Stefan prefers direct, blunt assessment over validation. Say when something is wrong.
- Multiple AI systems are used in parallel and **independent convergence is treated as
  signal**. Three separate analyses converged on: do not build L0 as a registry, the layers
  do not compound, escrow cannot be self-run, the chain is decorative for most of the design,
  and the operational tool is the real product.
- For messages to busy contacts: several short messages, not one dense paragraph.
- Documents get trimmed hard. Draft in chat, agree, then write the file.

---

## 14. Files

**Current:**
- `PROJECT-BRIEFING.md` — this file
- `EU-AGRI-HACKATHON.md` — the October event: facts from the official kit, challenge choice,
  selection scoring, strategy, and the two application drafts
- `ECOSYSTEM-LAYERS.md` — the layer structure, gates, and the L1→L2 break recorded so it is
  not rebuilt
- `MARKET-ARCHITECTURE.md` — the market design, settlement port, shared lot schema
- `ANCHOR-PROGRAM.md` — Anchor program spec. **On hold** — no chain in the first build
- `RESEARCH-FINDINGS.md` — the durable research asset. Nine deep research runs plus a cold
  second opinion. Everything tagged
- `RESEARCH-PROMPTS.md` — the prompts that produced it, plus running notes
- `AI-STORY-HONEST.md` — kept for one binding rule: **the AI extracts and flags; it never
  scores credit and never decides**
- `FMCG-Plan-for-Vladislav.docx` / `FMCG-What-I-Need-From-Vladislav.docx` — current
  commercial-side documents

**Superseded, in `archive/`:** the full factoring vision, the "Passport" pivot, the
dual-attestation plan (`PROJECT_CONTEXT.md`, `ARCHITECTURE.md`). See `archive/README.md` for
what stays useful. `PLAN-FOR-VLADISLAV.md` and `QUESTIONS-FOR-VLADISLAV.md` in root are
superseded by the two .docx files and should be archived.
