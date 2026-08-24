# Integritatea verificării facturilor — apărarea anti-fraudă

> **[Notă de pivot, 22 iulie 2026]** Acest pipeline anti-fraudă e, de fapt, miezul tehnic al MVP-ului de Demo Day (FMCG Receivables Passport) — nu doar o reparație pentru faza 2+. Pașii 1-4 (SEF, confirmare debitor, cont colector, perfectare legală) rămân valabili conceptual; pentru scope-ul redus al MVP-ului (fără cont colector real, fără finanțare efectivă), vezi `SOLANA-SUMMIT-BRIEF.md` §5-6 și `VARIANTE-DEMO-DAY.md`.

*Răspunsul la Riscul existențial #2 (dubla finanțare + frauda pe factură pot goli pool-ul fără ca on-chain să se vadă nimic) și la cea mai grea întrebare a juriului Visa (DUE-DILIGENCE-ADVERS.md §2c). Frauda pe factură e modul standard în care mor factorii tineri. Data: 2 iulie 2026.*

> **Adevărul fundamental (de spus deschis, nu de ascuns):** blockchain-ul previne dubla cheltuire a *tokenului*, nu dubla cesiune a *creanței*. Creanța trăiește în drept civil sârb/român și poate fi cesionată de câte ori vrea distribuitorul, pe hârtie. Orice pitch care pretinde că „on-chain-ul securizează factura" se demontează la prima întrebare tehnică. Apărarea noastră e legal-operațională, nu criptografică.

---

## 0. Poziționarea onestă a blockchain-ului (miezul întregului pitch)

Blockchain-ul e:
- **rail de decontare** (fracționarea capitalului, distribuția către LP-i),
- **jurnal de audit imuabil** al deciziilor de underwriting și al override-urilor,
- **NU** sursa de adevăr despre facturi.

Sursa de adevăr e **stiva legal-operațională** de mai jos: SEF/e-Factura la sursă, confirmarea debitorului, contul colector, perfectarea legală. Cine spune altceva despre RWA minte — și un jurat de la Visa știe asta.

---

## 1. Vectorii de fraudă, în ordinea probabilității (§2.2)

| # | Vector | De ce e periculos | Ce îl blochează |
|---|---|---|---|
| 1 | **Dubla finanțare** — aceeași factură la voi și la un factor clasic, în aceeași săptămână | **Nedetectabil on-chain prin definiție** | Interogare RNPM (RO) înainte de finanțare; notificare cu dată certă (RS); integrare SEF |
| 2 | **Factura fictivă cu debitor complice** — retailerul confirmă la telefon o livrare inexistentă („fresh air invoicing") | A doborât factori cu zeci de ani experiență | Confirmarea debitorului obținută **independent**, niciodată de la distribuitor; existența în SEF |
| 3 | **Diluția** — retururi, rabaturi, discounturi promoționale, taxe de raft, compensări. **Specifică și severă în FMCG.** O factură de 100k „reală" poate valora la încasare 85k **fără nicio fraudă** | Dacă avansezi 90%+, pierzi bani pe facturi perfect legitime | Avans 75–80% cu **holdback pentru diluție**, calibrat pe istoricul perechii distribuitor-retailer |
| 4 | **Deturnarea plății** — retailerul plătește corect, dar în contul distribuitorului, care „uită" să remită | La un distribuitor în stres de cash (clientul vostru), banii se evaporă | **Cont colector dedicat** controlat de SPV; notificarea schimbă IBAN-ul de plată |
| 5 | **Facturi între părți afiliate** — distribuitorul își facturează firma soră | Underwriting-ul cedează exact la tranzacții cu afiliați | **Zero afiliați** (regulă hard v1) + grafuri de afiliere emitent↔plătitor |
| 6 | **Otrăvirea pipeline-ului AI** — PDF cu instrucțiuni ascunse (text alb, metadata) manipulează extracția | Vector nou, specific arhitecturii; genul de detaliu pe care Visa îl întreabă ca test | Extracție pe text normalizat, nu PDF brut; output JSON cu schemă; **nicio ieșire LLM nu atinge o decizie de finanțare** *(vezi AI-STORY-HONEST.md §2)* |

---

## 2. Problema oracolului, spusă fără menajamente (§2.3)

În v1, entitatea care atestă on-chain că factura e reală, neplătită și nefinanțată **sunteți voi**. Dacă oracolul minte sau e corupt (un angajat mituit, un fondator sub presiune de volum înainte de fundraise), pool-ul finanțează hârtie și nicio proprietate criptografică nu ajută.

Întrebarea juriului decurge natural: *„dacă tot sunteți voi sursa de adevăr, la ce folosește blockchain-ul?"* — **răspunsul e la §0.** Blockchain-ul e rail-ul de decontare și jurnalul de audit, nu sursa de adevăr. Sursa de adevăr e stiva de mai jos.

Mitigări ale riscului de oracol:
- **Dual control uman** pe fiecare atestare on-chain peste un prag.
- **Log imuabil** al deciziilor de underwriting (aici chiar ajută chain-ul).
- **Reconciliere lunară** cont colector ↔ stare on-chain, publicată LP-ilor.
- Adevărul nu vine de la noi, ci de la **statul sârb/român** (SEF/e-Factura) — vezi §3.

---

## 3. Atuul nefolosit: statul a construit deja jumătate din infrastructură (§2.4)

- **Serbia — SEF (Sistem eFaktura):** e-invoicing B2B obligatoriu, de stat, cu API, din ianuarie 2023.
- **România — RO e-Factura (ANAF):** obligatorie B2B din iulie 2024.
- **O factură B2B care nu există în SEF/e-Factura nu există legal.**

Arhitectura din CONTEXT.md nu menționa niciuna — simultan cea mai gravă omisiune **și** cea mai mare oportunitate. Verificarea la sursa de stat e un **avantaj structural pe care factorii din vest nu-l au**.

**Limitele SEF (spune-le tu, înainte s-o facă juriul):** SEF confirmă existența, acceptarea de către cumpărător și statutul fiscal — **NU** confirmă că factura n-a fost cesionată și **NU** vede diluția viitoare. De aceea SEF e prima poartă, nu singura.

*BiH: e-invoicing B2B abia prin ~2029 — încă un motiv pentru care nu e piață de lansare.*

---

## 4. Pipeline-ul de verificare, în ordinea în care blochează frauda (§2b)

```
 1. INTEGRARE SEF / e-Factura ─────────────▶ factura trasă din API-ul de stat,
    (existență, emitent, cumpărător,          NU PDF de la distribuitor
     sumă, status de acceptare)               ► ucide factura fictivă de bază
                    │
 2. CONFIRMAREA DEBITORULUI ───────────────▶ retailerul notificat de cesiune,
    (no confirmation, no funding)             confirmă factura + plata în noul cont.
    contactul obținut INDEPENDENT             ► ucide „complice la telefon"
    (registrul comerțului / Vladislav)
                    │
 3. CONT COLECTOR DEDICAT ─────────────────▶ plata retailerului merge în contul
    (controlat de SPV)                        SPV-ului, nu al distribuitorului.
                                              ► ucide deturnarea plății
                    │
 4. PERFECTARE LEGALĂ SISTEMATICĂ ─────────▶ RO: înscriere + interogare RNPM.
    (vezi LEGAL-STRUCTURE.md §4)              RS: notificare cu dată certă + APR.
                                              ► ucide dubla finanțare
                    │
 5. AVANS 75–80% + HOLDBACK DILUȚIE ───────▶ restul se eliberează la încasare
    calibrat pe istoricul perechii            integrală.
                                              ► ucide pierderea pe diluție legitimă
                    │
 6. ANALITICĂ ANTI-FRAUDĂ (înainte de AI) ─▶ velocitate anormală, sume rotunde,
    (vezi AI-STORY-HONEST.md §2)              retaileri noi bruști, facturi sub
                                              praguri, grafuri de afiliere.
                    │
 7. DUAL CONTROL UMAN + LOG IMUABIL ───────▶ pe fiecare atestare peste prag;
                                              reconciliere lunară publicată LP-ilor.
```

**Pentru Demo Day: o integrare SEF în sandbox e mai impresionantă decât orice mint de token** — și e demo-ul care câștigă track-ul RWA.

---

## 5. Răspunsul la cea mai grea întrebare a juriului (Visa, §2c)

> **Întrebarea:** „Ce mă împiedică, concret, ca distribuitor, să vând aceeași factură vouă luni și lui Instant Factoring miercuri? Arătați-mi pasul exact — legal, nu criptografic — care vă dă prioritate asupra creanței, și spuneți-mi dacă l-ați testat măcar o dată pe o factură reală."

**Răspunsul meu, gata de spus cu voce tare:**

> „Criptografic, nimic — și oricine vă spune altceva despre RWA vă minte. Tokenul nu e creanța; e jurnalul de decontare. Prioritatea noastră e legală, pe pași concreți.
>
> În România ne înscriem în RNPM înainte de a elibera fondurile și interogăm registrul la originare — o cesiune anterioară e vizibilă, a noastră devine opozabilă terților. În Serbia, finanțarea se eliberează doar după notificarea cu dată certă a retailerului și confirmarea lui că plătește în contul nostru colector — debitorul notificat primul plătește valabil doar factorului notificat, deci banii curg către noi structural. Contactul retailerului îl obținem independent, niciodată de la distribuitor, ceea ce închide și vectorul de complice.
>
> Peste tot: verificăm factura direct în SEF, la sursă — dacă nu există acolo, nu există legal, și nu o finanțăm. Am rulat acest flux cap-coadă pe [N] facturi pilot cu [distribuitorul cu LOI]."

**Rândul care contează cel mai mult e ultimul.** Un „am testat fluxul pe o factură reală" bate orice slide. **Acțiune concretă: treceți măcar o factură reală prin tot fluxul înainte de august** — LOI-ul cu distribuitorul să includă explicit consimțământul pentru notificarea retailerului și contul colector.

---

## 6. Ce trebuie executat

**Pentru Demo Day (tehnic):**
- [ ] **Integrare SEF în sandbox** — demo-ul care câștigă track-ul RWA.
- [ ] Analitica anti-fraudă simplă (velocitate, sume rotunde, grafuri de afiliere) — demonstrabilă pe facturi cu anomalii injectate. *(Se suprapune cu AI-STORY-HONEST.md §2 — e aceeași componentă.)*
- [ ] **O factură reală trecută cap-coadă prin tot fluxul** cu distribuitorul care dă LOI.

**Pentru LOI (contractual):**
- [ ] Consimțământ explicit pentru **notificarea retailerului** și **contul colector**.

**De reținut că se leagă cu celelalte documente:**
- Perfectarea legală (RNPM, notificare, cont colector) e detaliată în LEGAL-STRUCTURE.md §4.
- Analitica de anomalii + sanitizarea pipeline-ului AI sunt în AI-STORY-HONEST.md §2 și §3.
- Holdback-ul pentru diluție intră în modelul din POOL-ECONOMICS.md (avans ≤80%).
