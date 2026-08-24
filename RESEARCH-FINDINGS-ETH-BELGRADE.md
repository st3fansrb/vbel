# Research Findings — Open Evidence Layer

**Date:** 21 August 2026
**Method:** Two adversarial Perplexity passes (prompts in `RESEARCH-PROMPTS-ETH-BELGRADE.md`)
**Purpose:** Primary-source record, so any session or reader can re-derive conclusions
independently rather than inheriting someone else's.

> Findings only. Conclusions drawn from them live in `ETH-BELGRADE-HACKATHON-PLAN.md`.
> Kept separate deliberately, so this file can be handed to a cold reader.

## A. Regulation

**ESPR excludes food and feed.** Regulation (EU) 2024/1781 Article 1(2): does not apply to
"food as defined in Article 2 of Regulation (EC) No 178/2002" or "feed as defined in Article
3(4)". Recital 13 confirms. The Digital Product Passport framework sits inside ESPR, so there
is no DPP mandate for food under this Regulation.

**What governs food instead.** Regulation 178/2002 Article 18 requires the *ability* to trace
and make records available to authorities on demand — deliberately technology-agnostic;
conventional ERP satisfies it. FIC 1169/2011 covers labelling, permits "modern technology
tools" without requiring them. Revised Waste Framework Directive (2025) sets binding 2030
food-waste targets: 10% reduction at processing and manufacturing, 30% per capita at retail,
food service and households, against a 2021–2023 baseline. Pressure, not a mandate.

**DPP timeline where mandates do exist.** EU DPP Registry live 19–20 July 2026. Battery
passports mandatory **18 February 2027** (Regulation 2023/1542, EV/LMT/industrial >2 kWh).
Iron and steel ~2026; textiles, tyres, aluminium 2027; furniture 2028; mattresses and ICT
2029. Minimum 18-month transition after each delegated act.

**eIDAS 2.0 qualified electronic ledgers.** Regulation (EU) 2024/1183 Article 45l(1) requires
a QEL be "created and managed by one or more qualified trust service providers". Implementing
Regulation 2025/2531 (16 December 2025) sets standards. A bare public-chain anchor is not a
QEL. Becoming a QTSP requires conformity assessment by accredited bodies under Regulation
765/2008, plus recurring audits. No public evidence of any certified QEL provider yet.

**eFTI.** Regulation (EU) 2020/1056 applies from 21 August 2024, but the obligation on
authorities to accept electronic information starts **9 July 2027**. Implementing Regulation
2025/2243 (6 November 2025) sets platform requirements; certification runs through accredited
conformity assessment bodies. Technology-agnostic — no blockchain or smart contract mandated.
No ledger vendor publicly certified.

**Data Act Article 36.** Regulation (EU) 2023/2854, applies from 12 September 2025.
Requirements for smart contracts executing data-sharing agreements: robustness, access
control, safe termination, archiving and continuity. Conformity is currently **self-declared**
— harmonised standards still in development, no certification scheme, no certified vendors.

## B. Market

**Anchoring is commoditised.** Free or open-source: OpenTimestamps, FreeTSA, EverCert launch
tier. Paid vendors all bundle it: Bernstein $54–329/month (blockchain + qualified TSA +
certificates + IP workflow), OriginStamp (enterprise API; OriginVault model described at
~CHF 25k setup, CHF 120k annual licence, CHF 60k support). Comparison guides consistently
identify the differentiators as legal validity, UX and integration — never the hashing.

**Institutional deployments exist.** Luxembourg Notary Blockchain (with Telindus), live since
2018–19, hash-anchored notarisation log for notaries. EUIPO Authenticity Infrastructure —
identity register of verifiable credentials plus blockchain notarisation of shipment audit
trails. Both public-sector, neither sold as generic infrastructure.

**DPP platform pricing.** DPP-Tool from €29/month (SME); PicoNext and Tappr ~€520/month
(mid-market); Substantio, ProductPass, DPP Automate, Circular.fashion €30k–100k+/year plus
€15k–50k implementation. Differentiation is regulatory coverage, registry integration, GS1
Digital Link support, JSON-LD schemas — anchoring is never the headline.

**Traceability incumbents.** Circularise (~€11M Series A Nov 2022, Brightlands-led, with
Neste and Asahi Kasei; SEKISUI SAFE Dec 2023) — schemas plus zero-knowledge proofs, ledger
under the hood. Eviden/Atos + IOTA "EDPS" (July 2024) — battery-first DPP. Spherity — battery
passports via W3C VCs and DIDs. Note: **SAP retired its blockchain service in May 2025**;
its traceability is now database-backed.

**The graveyard.** *TradeLens* (Maersk/IBM, Hyperledger Fabric, 2018): discontinued 28
November 2022, offline end Q1 2023. Maersk's stated reasons — had "not reached the level of
commercial viability necessary" and "full global industry collaboration has not been
achieved". Academic post-mortems attribute failure to governance, not technology: competitors
would not share data on a platform controlled by Maersk. *Everledger* (blockchain provenance,
Tencent- and Australian-government-backed): Australian subsidiary into voluntary
administration April 2023, Everledger Ltd closed 9 May 2023, reportedly AU$10–19M debts.
Trigger was an investor failing to deliver a second funding tranche — capital structure, not
technology.

**Evidence gap.** No clear cases found of EU DPP platforms shutting down or being acqui-hired
since 2023. Absence of post-mortems is not evidence of low risk; the category is young enough
that failures may not have surfaced yet.

**Where differentiation has come from.** Schemas and standards alignment (GS1 Digital Link,
EN 18216–18223, DPP registry formats, eFTI datasets, W3C VCs/DIDs); certification and
regulatory position (QTSP, certified eFTI platform); integrations and network effects;
domain-specific workflows and analytics.

## C. Build

**Standards.** W3C VC Data Model 2.0 became a Recommendation May 2025; base context
`https://www.w3.org/ns/credentials/v2`. UN/CEFACT **UNTP Digital Traceability Events** already
models supply-chain events (Make / Move / Modify) *as* Verifiable Credentials, and publishes
an EPCIS 2.0 profile. GS1 **EPCIS 2.0** is the established supply-chain event standard
(what/when/where/why, JSON-LD, REST). GS1 **Digital Link** is the product-QR URI standard
(URI syntax v1.7.0, July 2026). Research verdict: adopt VC 2.0; reference UNTP, EPCIS and
Digital Link rather than implementing them in a five-day window.

**Canonicalisation.** RFC 8785 (JCS) confirmed as the correct choice — I-JSON, keys sorted by
Unicode code point, no whitespace, normalised numbers. Maintained JS implementations:
`canonicalize` (erdtman), `json-canonicalize`. Failure modes: `undefined` vs `null` handling
differs between libraries; integers beyond IEEE-754 precision raise domain errors or coerce;
lone surrogates, NaN and Infinity must fail rather than serialise; locale- or UTF-8-based key
ordering diverges from code-point ordering.

**Solana.** Solana Attestation Service launched mainnet May 2025 — real, but wallet-credential
oriented (KYC, jurisdiction, membership), not general data anchoring. Estimates: SPL Memo
anchoring 4–6h; Token-2022 `MetadataPointer`/`TokenMetadata` 8–12h; custom Anchor program with
PDAs 14–20h; compressed NFTs / state compression 16–24h and designed for 10k+ item
collections. Verdict: Memo for the core, Token Extensions as the richer stretch.

**ENS.** ENS Labs cancelled Namechain February 2026; ENSv2 deploys on Ethereum L1 only.
Registration gas fell ~99% (roughly $5 → under $0.05) after Ethereum's 2025 gas-limit
increase; the **annual registration fee is separate — $5/year for 5+ character names**, $160
for 4, $640 for 3. Libraries: ENSjs ≥ 4.2.3 (now built on viem), viem ≥ 2.35.0. Durin /
CCIP-Read (ERC-3668) is **not** obsolete — still the pattern for offchain and L2 resolution,
handled transparently by viem and ENSjs. ENSIP-10 gives wildcard resolution.

**ENS bounty criteria.** Published prize language requires ENS-specific code — "simply using
RainbowKit does not count" — functional demos with no hard-coded values, and open source.
They explicitly ask for more than name-to-address lookup. ENS markets itself for "wallets,
contracts, agents, websites", so **ENS-for-objects is on-thesis**. Precedent: clawMarket used
ENS subnames carrying agent identity cards as text records. At ETHGlobal New York 2025, 32
projects integrated ENS and $10k went to six teams.

**Superteam.** Rewards deployed working code and Solana ecosystem fit. **Winners must complete
KYC.**

**Multi-bounty.** Precedent exists for one project taking both a track prize and an ENS bounty
at the same event. No evidence sponsors penalise multi-track alignment; the stated risk is
dilution — each integration must feel central rather than bolted on.
