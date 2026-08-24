# Chain-Agnostic Trust and Tokenization Strategy

**Date:** 21 August 2026  
**Status:** Strategy and technical direction — not legal advice  
**Initial implementation:** Solana  
**Architecture goal:** Solana first, Ethereum/EVM next, without changing the core data and verification model

## Executive Summary

The FMCG surplus marketplace will remain available for potential future development, but it should not define the infrastructure we build now.

The immediate opportunity is to extract a standalone, chain-agnostic trust layer that can turn a business event, document, product, batch, shipment or commercial right into a standardized digital record that can be independently verified.

The recommended sequence is:

1. Build a **Verifiable Business Event Ledger** as the core product.
2. Add a **Digital Product/Batch Passport** as the first vertical module.
3. Research **Tokenized Commercial Rights / RWA** with legal and regulated partners, without issuing real-value transferable assets yet.

Solana should be the first reference implementation because it allows us to build and demonstrate the product quickly. The business logic, canonical event format, signatures and verification rules must remain independent of Solana so that Ethereum/EVM and other ledger adapters can be added later.

The blockchain is not the database. Confidential documents and personal or commercially sensitive data remain off-chain. The chain stores only the minimum proof required for independent verification.

---

## 1. Core Product Definition

The proposed infrastructure is:

> A trust layer that converts a business event, document or right into a standardized record, binds it to an issuer and policy, and anchors a verifiable proof on a selected ledger.

A public on-chain record should normally contain only:

- schema identifier and version;
- subject identifier or opaque reference;
- payload hash;
- issuer or signer reference;
- timestamp;
- lifecycle status;
- previous-event hash or related proof reference;
- non-sensitive policy metadata.

The underlying document, personal data and confidential business information stay off-chain under access control.

### Two meanings of tokenization

We must distinguish between two materially different concepts:

1. **Digital twin or attestation:** a token or ledger record represents an object, state or claim but is not designed for trading and does not itself transfer an economic right.
2. **Transferable economic right:** a token carries a right to goods, payment, revenue, a receivable or another asset. This may trigger MiCA, MiFID II, the EU DLT Pilot Regime, payments, custody and national property or contract law.

The first category is the appropriate starting point. The second requires use-case-specific legal classification before implementation with real value.

---

## 2. Direction A — Verifiable Business Event Ledger

### Product

An API and SDK that any business application can use to prove that an event existed in a specific form, sequence and status.

Example events:

- a batch or lot was created;
- commercial rules were committed before an auction or sale;
- a document was issued, accepted or rejected;
- goods were dispatched, received or returned;
- an offer was accepted;
- a previous record was superseded or revoked.

The product proves integrity and chronology. It does not prove that the original input was factually true.

### Target users

- ERP, WMS and TMS vendors;
- B2B marketplaces;
- manufacturers and distributors needing an audit trail;
- logistics and compliance platforms;
- eFTI, Digital Product Passport and traceability implementers.

### EU relevance

- **eIDAS 2.0** creates an EU framework for electronic ledgers. Qualified electronic ledgers can benefit from a legal presumption concerning integrity and chronological ordering. A public blockchain deployment is not automatically a qualified trust service.
- **EU Data Act Article 36** contains requirements for smart contracts used to execute data-sharing agreements, including robustness, access control, safe termination and data continuity/archiving.
- **GDPR and commercial confidentiality** favour an off-chain-by-default architecture. Public wallet addresses and hashes can still become personal data when they are linkable to identifiable people, so pseudonymisation is not automatically anonymisation.

### Solana MVP

- TypeScript SDK;
- canonical JSON serialization;
- SHA-256 hashing;
- issuer signature;
- Solana Devnet anchoring;
- Memo-based prototype or a small program with PDA records;
- public Verify page;
- lifecycle states such as `ACTIVE`, `SUPERSEDED` and `REVOKED`.

### Ethereum/EVM adapter

- reuse the same canonical payload and payload hash;
- use EIP-712 typed signatures for off-chain signing;
- use a minimal registry contract or emitted events for anchoring;
- return the same chain-neutral verification receipt structure.

### Assessment

This is the recommended first product. It has the lowest regulatory exposure, can be demonstrated immediately and can support multiple industries.

Its main commercial risk is commoditisation. A simple timestamp and hash service is not enough. Differentiation must come from standardized business schemas, organizational identity, lifecycle and revocation rules, policy enforcement, integrations and audit-ready evidence packages.

---

## 3. Direction B — Digital Product/Batch Passport

### Product

A digital identity and lifecycle record for a product, batch, pallet or shipment.

It can link:

- manufacturer and facility;
- lot or batch identifier;
- origin, composition and certifications;
- lifecycle dates and events;
- transport and acceptance documents;
- corrections, recalls and revocations;
- proofs produced by the Verifiable Business Event Ledger.

The on-chain representation should initially be a **non-transferable attestation or digital twin**. Holding the token must not be presented as automatic legal ownership of the physical goods.

### EU relevance

The **Ecodesign for Sustainable Products Regulation (ESPR)** establishes the Digital Product Passport framework. It calls for persistent unique identifiers, data carriers, open standards, interoperability and machine-readable data. Detailed obligations are introduced by product group through delegated acts.

This must not be marketed as a universal food or FMCG compliance product. The applicability of ESPR and specific Digital Product Passport requirements must be confirmed for each product category. For food-related use cases, the passport may initially be a voluntary business standard or may fall under other sector-specific rules.

The **eFTI Regulation** is relevant to electronic regulatory information for freight transport. It includes requirements concerning machine-readable data, access control and confidentiality. Our product must not be described as a certified eFTI platform unless it has completed the applicable conformity and certification process.

### MVP

- open and versioned data schema, potentially using JSON-LD;
- persistent unique identifier and QR/data carrier;
- issuer signature;
- public and role-restricted data layers;
- on-chain hash and lifecycle registry;
- human-readable and machine-readable evidence export;
- integration with the core Event Ledger.

### Assessment

This is the best second step and the first strong vertical module for the core platform.

The main risk is building a generic passport without a customer or selected product category. The DPP market is already crowded, and requirements vary by vertical. We should choose one category and one design partner before expanding the schema.

---

## 4. Direction C — Tokenized Commercial Rights / RWA Engine

### Product

Infrastructure for representing a physical lot, warehouse receipt, contractual right or receivable as a transferable token.

A token could represent a right to:

- collect specified goods;
- take over a contractual position;
- receive sale proceeds;
- receive payment under a receivable;
- exercise collateral or security rights.

### Why it is attractive

- potential secondary liquidity;
- access to financing;
- higher potential value per customer;
- strong relevance to banks, funds, logistics providers and regulators;
- a direct connection to the broader RWA market.

### Regulatory boundary

This direction should not begin with a public, permissionless real-value token.

- If the token qualifies as a financial instrument, MiFID II and the **EU DLT Pilot Regime** become relevant. The DLT Pilot applies to authorised market infrastructure for DLT financial instruments.
- If the asset is a crypto-asset but not a financial instrument, **MiCA** may apply depending on the token structure and manner of offering.
- Fiat-referenced, redemption-backed or portfolio-backed designs may raise additional e-money-token or asset-referenced-token requirements.
- Custody, exchange, execution, placement and transfer services may require regulatory authorisation.
- Token creation alone does not transfer legal ownership of goods or receivables unless the applicable contract and national law recognise and enforce that transfer.

### Safe research path

- use valueless test tokens in a closed sandbox;
- select one precisely defined legal instrument and one EU jurisdiction;
- obtain a written legal classification and enforcement analysis;
- work with a regulated institution instead of operating custody or trading independently;
- design allowlists, transfer restrictions, identity/role credentials and legally required freeze or revocation controls;
- document how on-chain state maps to the enforceable off-chain agreement.

### Assessment

This direction has the greatest long-term upside and the longest route to market. It should remain a research and partnership track until the legal right, jurisdiction and regulated operating model are defined.

---

## 5. Recommended Product Sequence

### Phase 1 — Open Evidence Layer

Build the Verifiable Business Event Ledger as a standalone product with a Solana reference adapter.

### Phase 2 — Product/Batch Passport module

Use the same identity, signature, lifecycle and verification system to support one carefully selected product category.

### Phase 3 — Regulated RWA track

Choose one transferable legal right and develop it with qualified legal counsel and a regulated partner. Do not add real-value trading or custody before that work is complete.

### Target architecture

```text
Business application / ERP / DPP / eFTI connector
                    |
          Canonical Event Envelope
                    |
     Identity + Signature + Policy Engine
                    |
           Chain Adapter Interface
              /              \
        Solana adapter    Ethereum adapter
              \              /
           Verification API/UI
```

---

## 6. Chain-Agnostic Technical Standard

### Canonical Event Envelope v0.1

```json
{
  "schema": "urn:example:event:lot-created:v1",
  "subjectId": "urn:example:lot:opaque-id",
  "issuerId": "urn:example:org:opaque-id",
  "issuedAt": "2026-08-21T12:00:00Z",
  "previousEventHash": null,
  "payloadHash": "sha256:...",
  "policyId": "urn:example:policy:v1",
  "privacy": "off-chain",
  "nonce": "..."
}
```

### Design principles

1. **Chain-neutral hashing:** the same source payload produces the same proof on Solana and Ethereum.
2. **Crypto-agility:** the data format is not permanently tied to one signature scheme.
3. **Off-chain by default:** personal, documentary and confidential business content does not go onto a public chain.
4. **Correction instead of deletion:** a new event supersedes or revokes an earlier event while preserving history.
5. **No legal overclaim:** proof of integrity is not proof of truth, legal title or regulatory compliance.
6. **Independent verification:** a third-party client can validate evidence without relying on our backend.
7. **Role-based disclosure:** regulators, commercial partners and the public receive different data views.
8. **Versioned schemas:** every schema change receives a version and migration policy.
9. **Deterministic serialization:** every compliant implementation produces the same hash for the same payload.
10. **Portable receipts:** verification results use one common receipt structure across ledgers.

### Adapter interface

```ts
interface LedgerAdapter {
  anchor(eventHash: string, metadata: PublicMetadata): Promise<AnchorReceipt>;
  verify(receipt: AnchorReceipt, eventHash: string): Promise<VerificationResult>;
  revoke?(receipt: AnchorReceipt, reasonHash: string): Promise<AnchorReceipt>;
  network(): LedgerNetwork;
}
```

The business application must not need to know whether the adapter uses Solana Memo, a Solana program, an Ethereum contract or a qualified electronic ledger provider.

---

## 7. Regulatory Checklist

Before implementing any use case, we must answer:

1. Does the record provide evidence only, or does it transfer a right?
2. What exact right does the holder receive, and from which legal agreement does it arise?
3. Could the token qualify as a financial instrument or create an expectation of profit?
4. Is it offered to the public or only to identified business counterparties?
5. Does the platform hold money, tokens or user private keys?
6. What personal data exists, and can a wallet address be linked to an identifiable person?
7. How are errors corrected, rights revoked and court or regulatory orders enforced?
8. Who is the controller and processor of the off-chain data?
9. Does the applicable EU or national regime require certification or a qualified trust service?
10. Are we claiming technical compatibility, formal certification or legal compliance?

No real-value mainnet token should be issued until these questions have documented answers.

---

## 8. Eight-Week Delivery Plan

### Weeks 1–2 — Core specification

- finalise Canonical Event Envelope v0.1;
- define the threat and privacy models;
- implement canonical serialization, hashing, signing and local verification;
- publish cross-implementation test vectors;
- define the portable Anchor Receipt format.

### Weeks 3–4 — Solana reference adapter

- implement Solana Devnet anchoring;
- build the public Verify UI;
- implement supersede and revoke flows;
- add automated tests;
- measure cost and confirmation time per event.

### Weeks 5–6 — Ethereum reference adapter

- implement EIP-712 signing;
- deploy a testnet registry/event contract;
- demonstrate that the same payload hash works on both chains;
- complete cross-chain verification tests.

### Weeks 7–8 — First vertical package

- select one use case: product/batch passport, delivery acceptance or auction-rule audit;
- define its schema and sample data;
- build a connector API and end-to-end demonstration;
- interview at least five B2B platforms, ERP vendors or logistics implementers;
- obtain a design-partner commitment before expanding the product.

---

## 9. What We Should Not Build Yet

- a proprietary coin or stablecoin;
- custody of customer funds or assets;
- a permissionless secondary market;
- a token without a precisely defined and enforceable off-chain right;
- personal data or complete contracts on a public ledger;
- a cross-chain token bridge;
- an “EU compliant” label without use-case-specific assessment and required certification;
- multiple vertical products at the same time.

---

## 10. Decision and Proposed Working Name

The proposed working name is **Open Evidence Layer**.

Its first value proposition is not financial tokenization. It is **portable proof**:

> A business system creates a proof once, anchors it on Solana today and optionally on Ethereum tomorrow, while independent verifiers obtain the same result.

This is a real product we can begin building without claiming that we have issued a financial asset. The Digital Product/Batch Passport becomes its first commercial module. Tokenized Commercial Rights becomes a later regulated product line developed with qualified counsel and licensed partners.

---

## 11. Primary EU Regulatory Sources

- [Regulation (EU) 2024/1183 — European Digital Identity Framework / eIDAS 2.0](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1183)
- [Regulation (EU) 2023/2854 — Data Act](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R2854)
- [Regulation (EU) 2024/1781 — Ecodesign for Sustainable Products Regulation](https://eur-lex.europa.eu/eli/reg/2024/1781/2024-06-28/eng)
- [Regulation (EU) 2020/1056 — Electronic Freight Transport Information](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32020R1056)
- [Regulation (EU) 2023/1114 — Markets in Crypto-Assets Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114)
- [Regulation (EU) 2022/858 — DLT Pilot Regime](https://eur-lex.europa.eu/eli/reg/2022/858)

This strategy deliberately separates technical compatibility, regulatory applicability and formal certification. The final legal classification of any real token must be confirmed by qualified counsel in the target jurisdiction.
