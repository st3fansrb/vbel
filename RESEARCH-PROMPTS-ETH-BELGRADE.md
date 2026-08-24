# Research Prompts — Open Evidence Layer / ETH Belgrade

**Date:** 21 August 2026
**Purpose:** Validate or break `ETH-BELGRADE-HACKATHON-PLAN.md` and
`CHAIN-AGNOSTIC-TRUST-TOKENIZATION-STRATEGY.md` before committing the build week.
**Run before** sending the plan to Vladislav and Seba.

---

## Prompt A — Does this idea survive contact with reality?

> I am evaluating a B2B infrastructure product and need adversarial, source-backed research.
> Prioritise evidence over enthusiasm, and tell me where the idea is weak.
>
> **The product:** a chain-agnostic "trust layer" that takes a business event (a batch was
> created, goods were dispatched, a document was accepted, commercial rules were committed
> before an auction), serialises it to a canonical format, hashes it, signs it with an issuer
> key, and anchors only the hash on a public blockchain. The underlying data and documents
> stay off-chain. Anyone can independently verify integrity and chronological ordering. A
> later phase adds a product/batch passport; a much later phase researches tokenised
> commercial rights. Target buyers are ERP, WMS and TMS vendors, B2B marketplaces, and
> compliance and traceability platforms in the EU.
>
> Answer these, with citations and dates on every substantive claim:
>
> 1. **Prior art.** Who already sells this? Cover blockchain-anchored notarisation and audit
>    trail vendors, EU Digital Product Passport platforms, and supply-chain traceability
>    providers. For each: what they actually sell, pricing model if public, funding, current
>    status, and whether they are alive or dead.
> 2. **The graveyard.** Which comparable ventures failed, and precisely why? I specifically
>    want post-mortems on TradeLens (Maersk/IBM), Everledger, and any DPP or traceability
>    company that has shut down or been acqui-hired since 2023. Distinguish technology
>    failure from adoption, governance and business-model failure.
> 3. **Does anyone pay for this?** Find concrete evidence of customers paying for
>    hash-anchoring or blockchain audit trails as a standalone service — contract values,
>    case studies, public tenders. If the honest answer is that hash-anchoring is a feature
>    and not a product, say so and show the evidence.
> 4. **ESPR scope — highest priority.** Does Regulation (EU) 2024/1781 (Ecodesign for
>    Sustainable Products / Digital Product Passport) apply to **food and beverages**, or are
>    food and feed excluded from its scope? Quote the scope and exclusion articles directly.
>    Which product groups are covered by the first delegated acts, and on what timeline?
>    Where does the EU Battery Passport (Regulation 2023/1542) sit, and what is its
>    applicability date?
> 5. **If food is out of ESPR scope**, what EU regime *does* govern food traceability and
>    digital records — Regulation 178/2002, FIC 1169/2011, the Farm to Fork agenda, the food
>    waste reduction targets in the revised Waste Framework Directive? Is there any mandate
>    that creates buying pressure, or would a food passport be a purely voluntary sale?
> 6. **eIDAS 2.0 electronic ledgers.** What is the current status of the qualified electronic
>    ledger provisions in Regulation (EU) 2024/1183? Are the implementing acts and technical
>    standards published? Can a public blockchain anchor qualify, or does qualification
>    require an accredited QTSP? What would it actually take to become one?
> 7. **eFTI and Data Act Article 36.** Current applicability dates, certification
>    requirements, and whether any smart-contract or ledger vendors have been certified.
> 8. **The commoditisation question.** Given that anchoring a hash on a chain is trivially
>    replicable, where has durable differentiation actually come from in this category —
>    schemas, certification, integrations, data network effects, regulatory position? Cite
>    companies that achieved it and companies that did not.
>
> **Output:** organise by question. Flag anything where sources disagree or evidence is thin.
> End with the three strongest reasons this product fails and the three strongest reasons it
> works, ranked, each tied to specific cited evidence.

---

## Prompt B — What should we actually build in five days?

> I am building a hackathon project in five days plus a two-day event (ETH Belgrade x
> Superteam Balkan, 26–27 August 2026). I need current, practical, source-backed research to
> decide what to build and what to reuse instead of reinventing.
>
> **The plan:** a canonical business-event envelope (schema id, subject id, issuer id,
> timestamp, payload hash, previous-event hash, lifecycle status), hashed with SHA-256,
> signed by the issuer, anchored on **Solana** (Devnet), with **ENS** providing issuer
> identity and per-subject subnames whose text records point at the off-chain payload and at
> the Solana anchor transaction. A public verify page renders the event chain from a QR code,
> including supersede and revoke events. We demo three unrelated domains — a food lot, a
> freight delivery acceptance, and an auction rule commitment — to show the layer is
> domain-agnostic. Known bounties: $1,000 ENS, $2,000 Superteam Balkan; more tracks may be
> announced.
>
> Answer these, with citations, links to current documentation, and dates:
>
> 1. **Existing standards we may be reinventing — highest priority.** Compare our envelope
>    against **GS1 EPCIS 2.0** (the standard for supply-chain business events: what, when,
>    where, why), **GS1 Digital Link** (product QR identity), **W3C Verifiable Credentials
>    2.0** and **DIDs**, and **UN/CEFACT** models. For each: what it covers, whether adopting
>    it would strengthen or slow a five-day build, and whether ignoring it would be seen as
>    naive by anyone who knows the space. Is there an existing JSON-LD context we should be
>    using rather than inventing schema URNs?
> 2. **Canonical serialisation.** Is RFC 8785 (JSON Canonicalization Scheme) the right
>    choice? What are the mature, maintained JavaScript/TypeScript implementations? What are
>    the known failure modes for deterministic hashing across implementations?
> 3. **Solana attestation primitives.** Does Solana now have a native attestation standard —
>    Solana Attestation Service or equivalent? If so, should we use it instead of raw Memo
>    anchoring, and what does that cost in build time? Also compare: Memo program, a minimal
>    Anchor program with PDAs, state compression / compressed NFTs for cheap per-item records,
>    and Token Extensions metadata. Which gives the best ratio of demo impact to hours spent?
> 4. **ENS, current state.** ENS Labs cancelled Namechain in February 2026 and moved ENSv2 to
>    Ethereum L1. What does that mean practically today for issuing subnames? Confirm current
>    cost (gas plus annual registration fee) for a 5+ character .eth name. What is the state
>    of ENSIP-10 wildcard resolution and offchain resolvers (CCIP-Read), and is Durin still
>    the recommended path for L2 subnames or is it now obsolete? Which libraries are current —
>    viem, ensjs, others — and what is the minimal working path to issue subnames and set
>    custom text records?
> 5. **What wins ENS bounties.** Find ENS hackathon bounty descriptions and winning projects
>    from 2025–2026. What does ENS explicitly say it wants? Is ENS-as-identity-for-objects
>    (rather than for people or wallets) something they actively promote, or a misuse of the
>    primitive? What patterns do their judges reject as superficial?
> 6. **What wins Superteam / Solana bounties.** Find recent Superteam bounty criteria and
>    winning submissions. Do they reward working deployed code, business viability, or Solana
>    ecosystem fit? Does anything in the Superteam Balkan track history suggest a preference?
> 7. **Bounty-driven hackathon strategy.** Evidence on whether one project can credibly win
>    multiple sponsor bounties, or whether sponsors penalise projects that appear to be
>    spreading themselves across tracks.
> 8. **Adjacent directions worth considering.** Given the same primitives — canonical events,
>    hashing, signatures, cross-chain identity, lifecycle and revocation — what *other*
>    products could be built in the same window that would hit more sponsor bounties or have a
>    stronger demo? Include options we have not considered, and say honestly if one of them is
>    a better use of the week than the plan above.
>
> **Output:** organise by question. For every recommendation give a rough hours estimate for a
> competent TypeScript developer. End with a ranked list of what to build, what to reuse, and
> what to cut, assuming roughly forty working hours total.
