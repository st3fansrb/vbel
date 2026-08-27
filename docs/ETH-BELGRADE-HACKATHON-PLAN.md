# ETH Belgrade Hackathon — Build Plan (v3)

**Date:** 21 August 2026
**Event:** ETH Belgrade x Superteam Balkan Hackathon, 26–27 August 2026, Sava Congress Center
**Status:** For review by Vladislav, then Seba
**Companion:** `CHAIN-AGNOSTIC-TRUST-TOKENIZATION-STRATEGY.md`,
`RESEARCH-FINDINGS-ETH-BELGRADE.md`, `ENTIRE-CONTEXT-FMCG.md`

## 0. What changed from v2, and why

v2 named a vertical — it made a food lot the centrepiece and leaned on regulatory framing.
That was a mistake for one specific reason: **nobody currently knows what Vladislav's network
actually reaches.** The assumption that it is food-only comes from July and has not been
re-checked. His own strategy document targets ERP, WMS and TMS vendors, B2B marketplaces,
logistics and compliance platforms — which is a strange document to write if food producers
were the only door available.

So this returns to the original call: **build domain-agnostic, demonstrate across several
domains, and let whichever partner actually converts decide the vertical.** That decision was
correct precisely because the network question is open.

Two corrections carried in from the research and from re-reading our own documents:

- **The three demo domains are now the three from the strategy document's own §8** — product
  or batch passport, delivery acceptance, and auction-rule audit. Not domains we invented.
- **`ENTIRE-CONTEXT-FMCG.md` §21 flags that a descending-price auction "enters an occupied
  market"**, and that PalletClearance already runs the channel-isolation model. The auction is
  therefore a good *demo* and an unproven *business*. It gets the deep slot on technical
  merit, not commercial merit.

## 1. Decision

Build **Phase 1 of the Open Evidence Layer** — the canonical event envelope, signed, hashed
and anchored — and demonstrate it across three unrelated domains on two chains.

Give the deep slot to **auction-rule commitment**, for one reason: it is the only domain in
the set that fails the removal test. Take the blockchain out of a passport or a delivery
record and you have signed records in a database, which in Serbia and Romania carry *more*
legal weight than a chain entry. Take it out of a committed auction and the rules return to
the operator's control, which reinstates exactly the distrust the sale is failing on.

That gives the demo a moment where the chain is load-bearing, while the other two domains
show the layer is not married to it.

## 2. What we build

### 2.1 The envelope

Unchanged from the strategy document's §6, with one substitution: rather than inventing
schema URNs, wrap it as a **W3C Verifiable Credential 2.0** (`@context:
https://www.w3.org/ns/credentials/v2`), with the ENS name as `issuer`, the subject identifier
as `credentialSubject`, the RFC 8785 digest as a digest field, and lifecycle status
(`ACTIVE` / `SUPERSEDED` / `REVOKED`) as credential metadata.

Roughly four to six hours, and it aligns us for free with UN/CEFACT's UNTP, which already
models traceability events as Verifiable Credentials.

### 2.2 The three domains

| | Domain | Depth | What it shows |
|---|---|---|---|
| 1 | **Auction-rule audit** | deep | The chain doing work nothing else can do |
| 2 | **Product/batch passport** | thin | A mandated market — batteries, 18 Feb 2027 |
| 3 | **Delivery acceptance** | thin | Correction without deletion |

**Deep — auction-rule commitment.** The seller publishes the terms before the sale: lot,
opening price, floor, decay schedule, deadline. A hash of those terms is anchored. The price
descends in the open. The first buyer to accept takes it, and that acceptance is anchored too.
Afterwards anyone can verify that the rules which produced the outcome are byte-identical to
the rules committed before anyone knew who would win.

Mechanically this is **two anchors and a hash comparison**. No custom Solana program.

**Thin — product/batch passport.** Thirty seconds. Carries the regulatory weight: the EU DPP
Registry went live 19–20 July 2026, and battery passports become mandatory 18 February 2027
under Regulation 2023/1542. Note that food is explicitly excluded from ESPR by Article 1(2),
so the mandated example must not be a food one.

**Thin — delivery acceptance.** Thirty seconds, and it carries the best single beat we have.
Goods arrive, part of the consignment is rejected at goods-in, and the issuer **supersedes**
the original record with a correction naming what it replaces. Nothing is deleted, nothing
hidden — the original stays visible, marked `SUPERSEDED`, with the reason attached.

Together: a commercial commitment with no physical object, a regulated product record, and a
logistics document — running on one envelope, one hash, one verify page.

### 2.3 Standards posture

| Standard | Posture | Why |
|---|---|---|
| **W3C VC 2.0** | **Adopt** | Cheap; ignoring it reads as naive to anyone in identity |
| **RFC 8785 (JCS)** | **Adopt** | Correct for deterministic hashing. Use `json-canonicalize` — do not hand-roll |
| **UNTP Digital Traceability Events** | Reference, borrow vocabulary | Already VC-shaped; full conformance is not a five-day job |
| **GS1 EPCIS 2.0** | Reference, ship one sample payload | The real supply-chain event standard. Say our envelope *carries* an EPCIS event |
| **GS1 Digital Link** | Reference only | Production QR standard; a conformant resolver is a multi-month lift |

Knowing precisely what we are not implementing, and why, is what separates this from a team
that reinvented EPCIS badly.

## 3. Technical decisions

**Canonicalisation.** RFC 8785 via `json-canonicalize`. Guard the known failure modes: never
emit `undefined`; encode large integers as strings; reject lone surrogates, NaN and Infinity;
rely on the library's Unicode code-point key ordering. Ship one cross-language test vector.

**Solana.** SPL **Memo program**, Devnet. Not a custom Anchor program (14–20h), not compressed
NFTs (16–24h, built for 10k+ collections), not Solana Attestation Service — SAS is real, live
since May 2025, but it is a wallet-credential system and our subjects are objects and events.
Reference it as future work.

*Stretch:* Token-2022 `MetadataPointer` / `TokenMetadata` on the auction domain, holding the
ENS name and rules hash. 8–12h — only if the core lands early.

**ENS.** Mainnet L1; ENSv2 is L1-only since Namechain was cancelled in February 2026. A 5+
character `.eth` name costs **$5/year plus under $0.05 gas**. Libraries: **ENSjs ≥ 4.2.3,
viem ≥ 2.35.0**. Register parent → `createSubname` per subject → `setText` for
`oel.payload`, `oel.anchor`, `oel.status`.

For the auction domain the ENS name earns more: `lot-4471.<parent>.eth` **is** the auction,
with text records carrying current price and state as it descends. A live object rather than
a static pointer — a materially stronger answer to ENS's "show us more than name-to-address."

Durin / CCIP-Read (ERC-3668) is **not** obsolete; it remains the offchain and L2 resolution
pattern, handled transparently by viem and ENSjs. ENSIP-10 wildcard resolution is a stretch.

## 4. Bounties

Known: $1,000 ENS, $2,000 Superteam Balkan. Treat as partial — past editions ran eleven tracks
against $60,000, and the Superteam bounty is not yet listed on Superteam Earn. Two chains
already anchored means a newly announced track is cheap to absorb.

**ENS.** Their published language requires ENS-specific code — "simply using RainbowKit does
not count" — functional demos with no hard-coded values, open source, and more than
name-to-address lookup. **ENS for objects is on-thesis**, not a misuse; precedent exists in
projects using subnames to carry identity cards as text records.

**Superteam Balkan.** Deployed working code and Solana ecosystem fit. **Winners must complete
KYC** — worth settling how anything splits before it is won.

**Both at once is fine.** Precedent exists for one project taking a sponsor bounty and a track
prize at the same event. The risk is dilution, not penalty — each integration must feel
central. Ours do: the ENS record points at the Solana anchor, so neither side is decorative.

## 5. Scope and hours

| Work | Hours |
|---|---|
| Envelope + RFC 8785 + SHA-256 + signature + VC 2.0 wrapper | 12–14 |
| Solana Devnet Memo anchoring + verify-page decoder | 10–12 |
| ENS parent registration, subnames, text records | 8–10 |
| Auction domain — commit, descending price, accept, verify | 3–4 |
| Two thin domains — schemas, sample data, render templates | 3–4 |
| Supersede / revoke flow | 2–3 |
| Submission polish — video, write-up, repo | 4–6 |
| **Total** | **42–53** |

**This is over budget and the plan should say so rather than pretend.** Cut order if we run
late:

1. The third domain — two still prove the point
2. Token-2022 stretch — first thing to go, it was never core
3. Submission polish compressed
4. VC wrapper degrades to a plain signed envelope

**The Solana anchor, the ENS integration and the auction commit cannot be cut.** They are the
two bounties and the one reason the demo has stakes.

### Explicitly out

Custom Anchor program with PDAs. Compressed NFTs. SAS as the event backbone. Full EPCIS or a
GS1 Digital Link resolver. A separate Ethereum registry contract — **ENS is our Ethereum
leg**. EIP-712. Threat and privacy model documents. Everything in strategy Phase 3. The five
B2B interviews from strategy §8 — those happen after, and they are the genuinely valuable part.

## 6. Schedule

Bringing existing work is explicitly permitted by the event listing, so the window is five
days plus the event.

| When | Work |
|---|---|
| Fri 21 – Sat 22 | Freeze envelope. **Register the ENS name.** RFC 8785, hashing, signing, VC wrapper, local verification. No chain yet. |
| Sun 23 | Solana Devnet Memo anchoring. Anchor receipt format. |
| Mon 24 | ENS subnames and text records including the Solana pointer. The cross-chain link. |
| Tue 25 | Auction domain end to end. **Supersede flow** — pulled forward from Wednesday. |
| Wed 26 (event) | Two thin domains. Verify page polish. **Talk to the ENS and Superteam people in the room.** |
| Thu 27 AM | Submit. Rehearse. |

Supersede moves to Tuesday because it is the most differentiating thing we show and Wednesday
is the most chaotic slot available. Register the ENS name early in the week — do not discover
the registration flow on Wednesday.

The Wednesday sponsor conversations are not optional. With no main track, the people who
decide the prizes are standing in the room.

## 7. What we must not claim

- **Not a qualified electronic ledger.** eIDAS 2.0 Article 45l(1) requires a QTSP. We are not
  one. "Designed toward" is honest; "qualified" is not.
- **Not legal evidence in Serbia or Romania.** Blockchain records are not a recognised
  evidentiary category in either; a qualified eIDAS timestamp carries a presumption a chain
  record does not.
- **ESPR and the DPP do not apply to food.** Article 1(2) excludes food and feed by name.
- **Not a certified eFTI platform.** Certification runs through accredited conformity
  assessment bodies under Implementing Regulation 2025/2243.
- **Data Act Article 36 conformity is self-declared.** In force since 12 September 2025, but
  no certification scheme exists.
- **Proof of integrity is not proof of truth.** A rigged auction described accurately still
  anchors perfectly. We prove the terms did not change, not that they were fair.
- **No transferable economic right is created.** Nothing here is a financial instrument.

## 8. Questions for Vladislav

1. **What domains does your network actually reach?** This does not block the build — the
   layer is domain-agnostic by design — but it decides everything afterwards. If any of it
   touches batteries, textiles, tyres, steel, furniture or ICT, those are **mandated** markets
   with dated deadlines. Food is not, and will not be.
2. **Given that hash anchoring is commoditised** — free at the bottom, bundled into compliance
   products at the top — is the intended business the envelope and its standards position, or
   something further up the stack?
3. **The strategy puts the pain in Phase 3 and the buildable product in Phase 1, with nothing
   earning money in between.** What bridges that gap?
4. Confirm the hackathon start time, submission deadline, and whether the bounty list is final.
