# Economia pool-ului — model pe cifre + stress-test

> **[Notă de pivot, 22 iulie 2026]** Pool-ul DeFi descris aici e „teatru de demo" pentru faza 2+ — NU face parte din MVP-ul de Demo Day. `RED-TEAM-ROUND-2.md` a arătat că randamentul-titlu din acest document nu supraviețuiește propriei formule (8,8% real, nu 9-10% cum e afirmat), ceea ce a cântărit direct în decizia de a nu construi pool-ul acum. Pentru MVP-ul curent (FMCG Receivables Passport, fără pool, fără randamente), vezi `SOLANA-SUMMIT-BRIEF.md` și `VARIANTE-DEMO-DAY.md`.

*Răspunsul cantitativ la Riscul existențial #3 (mismatch de lichiditate + selecție adversă + FX) și la cea mai grea întrebare a juriului Raiffeisen (DUE-DILIGENCE-ADVERS.md §1c). Toate cifrele sunt marcate ca **ILUSTRATIV** — sunt un model, nu date măsurate. Se înlocuiesc cu numere reale pe măsură ce apar din pilot. Data: 2 iulie 2026.*

> **Regula de aur a acestui document:** dacă nu putem arăta noi acest calcul înaintea juriului, îl face juriul pentru noi — și îl face în defavoarea noastră. Scopul e să intrăm cu aritmetica deja pe masă.

---

## 0. Teza în cifre (TL;DR de spus pe scenă)

- Prețuim ca **EM private credit**, nu ca „mai ieftin decât banca": discount brut **~16% anualizat**, nu 2%.
- După pierderi așteptate, conversie și costuri, **randament net LP țintit ~9–11% în EUR** — adică **~600bp peste risk-free EUR** (~3.5–4%).
- Pool denominat în **EURC**, nu USDC — taie expunerea valutară principală aproape la zero (dinarul și leul trăiesc lângă euro).
- **Fără retragere instant.** Epoci de 14–30 zile, onorate din colectări, buffer lichid 20%. Absența retragerii instant e **semn de maturitate**, nu slăbiciune.
- **Tranșă junior de 15% first-loss** (banii echipei + angel-i, blocați 12 luni) stă înaintea capitalului LP.
- Plafoane de concentrare **în smart contract**: max 20% pe un retailer-plătitor, max 10% pe un distribuitor.
- **Regres obligatoriu în v1**: fiecare creanță are doi obligați (retailer + distribuitor), plus garanție personală a acționarului.

Aceste șapte mecanisme nu sunt cosmetice — sunt exact ce transformă răspunsul la întrebarea de stress-test dintr-un narativ într-o demonstrație.

---

## 1. Unit economics — o factură tipică

**ILUSTRATIV.** Parametri de bază:

| Parametru | Valoare | Notă |
|---|---|---|
| Nominal factură | 100.000 EUR | echivalent; factura reală e în RSD/RON |
| Tenor | 60 zile | plafon hard v1: ≤90 zile |
| Avans | 80% = **80.000 EUR desfășurați** | plafon hard v1: ≤80%; restul e holdback pentru diluție |
| Discount brut (anualizat pe capital desfășurat) | **16%** | mid al recomandării 14–18%; onest ca EM private credit |

Randament brut pe această factură = 16% × (60/360) × 80.000 = **~2.133 EUR** pe cei 80.000 desfășurați (≈ 2,13% din nominal). Comparabil cu „2% pe nominal" din raport, dar prețuit onest, nu la subvenție.

### Cascada de la brut la net LP (anualizat, pe capital desfășurat)

| Linie | % anualizat | Explicație |
|---|---|---|
| **Randament brut** | **+16,0%** | discount rate pe capital desfășurat |
| − Pierdere așteptată (EL) | −3,0% | **PD floor hardcodat** până la ≥12 luni și N≥200 facturi; „2–4% e optimist pentru IMM balcanic" → folosim 3% ca podea |
| − Conversie + FX rezidual | −0,7% | EURC↔RSD prin partener licențiat; cu EURC, expunerea principală ≈ 0 (peg administrat), rămâne doar costul de conversie pe ciclu |
| − OpEx (originare, colectare, perfectare legală, tech) | −1,5% | |
| − Fee protocol | −1,0% | **legat de randamentul colectat, nu de volumul originat** (anti-conflict, §1.5) |
| **= Randament net distribuibil (blended)** | **≈ 9,8%** | înainte de tranșare |

**Sensibilitate:** la discount brut de 18% (capătul superior al recomandării), net blended urcă spre ~11,8%. La 14%, coboară spre ~7,8%. Prețul e pârghia dominantă — de aceea nu concurăm pe preț cu banca, ci pe viteză și acces.

---

## 2. Structura pool-ului (tranșare, buffer, epoci)

**ILUSTRATIV — pool de 1.000.000 EUR** pentru aritmetică curată (scalează liniar).

| Componentă | Sumă | Rol |
|---|---|---|
| **Tranșă senior** (LP profesioniști) | 850.000 (85%) | capital protejat; primește randament ținta mai mic, protejat de junior |
| **Tranșă junior** (echipă + angel-i, blocată 12 luni) | 150.000 (15%) | **first-loss**; absoarbe primele pierderi; randament ținta mai mare |
| **Buffer lichid** | 200.000 (20%) | onorează retragerile pe epoci fără a vinde active |
| **Retrageri** | epoci de 14–30 zile | onorate din colectările scadente + buffer; scadențarul retragerilor oglindește scadențarul facturilor |

### Împărțirea randamentului pe tranșe (din cei ~9,8% net blended)

- **Junior** (15% din pool): țintă **~15–16%** — compensat pentru poziția de first-loss și blocajul de 12 luni.
- **Senior** (85% din pool): (9,8% × 100% − 15,5% × 15%) / 85% ≈ **~9,0–10,0% net EUR**.
- **~600bp peste risk-free EUR** (~3,5–4%) — comparabil cu EM private credit, dar cu tenor de 60 de zile și transparență de portofoliu în timp real.

**De ce e apărabil:** un LP profesionist primește ~9–10% net în EUR pentru risc de credit balcanic, dar cu (i) first-loss de 15% sub el, (ii) regres pe fiecare creanță, (iii) concentrare plafonată în contract, (iv) tenor scurt de 60 de zile. Nu e randament de retail DeFi — e private credit structurat.

---

## 3. Asimetria — de ce disciplina nu e opțională

La 16% brut, o factură bună aduce ~2.133 EUR pe 80.000 desfășurați. **Un singur default total de 80.000 EUR șterge câștigul brut a ~37 de facturi bune de aceeași mărime.**

```
  1 default total (80.000 EUR)  ═══════════════════════════════▶  −80.000 EUR
  37 facturi bune (2.133 EUR ea) ══════════════════════════════▶  +78.900 EUR
```

Concluzia care contează pentru juriu: la aceste marje, **modelul nu tolerează selecție adversă**. De aici, direct, fiecare mecanism defensiv:
- **Whitelist plătitori + regres** → tai probabilitatea și severitatea default-ului.
- **PD floor 3%** → nu subprețuim niciodată riscul, indiferent ce spune un model optimist.
- **Concentrare plafonată** → un eveniment nu poate lovi mai mult de 20% din portofoliu.
- **Tranșă junior** → primele pierderi le luăm noi, nu LP-ii.

---

## 4. Stress-test: „cel mai mare retailer plătește la 120 de zile în loc de 60"

**Setup ILUSTRATIV** (pool 1.000.000 EUR, structura din §2):
- Expunere pe cel mai mare retailer: la plafonul de concentrare = **20% = 200.000 EUR** desfășurați.
- Toate creanțele: **regres** pe distribuitori + garanție personală a acționarului.
- Provizionare NAV: automată la **30 de zile de întârziere**.

### Ce se întâmplă, zi cu zi

| Moment | Eveniment | Reacția sistemului |
|---|---|---|
| Ziua 0–60 | Normal | Facturile celor 200k performează ca restul. |
| **Ziua 60** (scadență) | Retailerul nu plătește; anunță 120 zile | Creanțele de 200k intră în întârziere. Restul portofoliului (800k) e neatins și continuă să încaseze normal. |
| **Ziua 90** (30z întârziere) | Trigger de provizion | NAV-ul marchează automat provizion pe cei 200k. Marcarea e temporară dacă plata vine la ziua 120. |
| Continuu | Cereri de retragere LP | Onorate din **buffer (200k) + colectările celor 800k performanți**. Coada se procesează pe epoci — **fără vânzare forțată de active, deci fără spirală NAV**. Buffer-ul de 200k acoperă singur întreaga expunere blocată. |
| Ziua 120 | Rezolvare | Vezi cele trei scenarii. |

### Cele trei scenarii de rezolvare

**Scenariul A — doar întârziere (cel mai probabil).** Retailerul plătește la ziua 120.
- Pierdere principal: **0 EUR.**
- Cost: 60 de zile suplimentare de carry pe 200k + drag temporar de provizion, care se reversează la încasare.
- Impact senior/junior: **niciun principal pierdut.**

**Scenariul B — retailerul intră în default, dar regresul ține.** Distribuitorii răscumpără creanțele (obligație contractuală + garanții personale).
- Pierdere pentru pool: **~0 EUR** (presupunând distribuitori solvabili).
- **Acesta e exact motivul pentru care regresul e obligatoriu în v1**: transformă un pariu nesecurizat pe retailer într-o creanță cu doi obligați.

**Scenariul C — dublu default (coada reală).** Retailerul nu plătește ȘI distribuitorii nu pot onora regresul.
- Pierdere brută până la **200.000 EUR** (înainte de recuperări/executarea garanțiilor).
- **Junior (150k) absoarbe primul** → tranșa junior e ștearsă ~100%.
- **Senior absoarbe restul: 50.000 EUR = −5,9% din NAV senior.** Combinat cu randamentul anual pe restul portofoliului, senior rămâne aproximativ la break-even pe an — **un an prost, nu un wipeout.**
- **Plafonul de concentrare garantează** că un singur retailer nu poate lovi mai mult de 20%. Scenariul e mărginit prin design, nu prin noroc.

### Sinteza stress-testului

| Scenariu | Pierdere pool | Impact tranșă junior | Impact tranșă senior |
|---|---|---|---|
| A — întârziere | 0 | 0 | 0 (doar carry) |
| B — default + regres ține | ~0 | 0 | 0 |
| C — dublu default | până la 200k | −100% (150k) | **−5,9% (50k)** |

**Mesajul:** chiar în coada cea mai neagră modelabilă, capitalul LP senior pierde ~6%, nu se evaporă — pentru că first-loss-ul, regresul și plafonul de concentrare lucrează în serie. Iar retragerile nu declanșează niciodată un run mecanic, pentru că sunt pe epoci și onorate din lichiditate, nu din vânzarea activelor.

---

## 5. Răspunsul la cea mai grea întrebare a juriului (Raiffeisen, §1c)

> **Întrebarea:** „Să zicem că cel mai mare lanț de retail din portofoliul vostru anunță unilateral că plătește la 120 de zile în loc de 60 — cum a mai făcut-o. În acea zi: ce se întâmplă cu retragerile LP, cum marcați NAV-ul, cine ia prima pierdere și cât din ea? Și după pierderi așteptate, FX și costuri — ce randament net oferă pool-ul și de ce ar accepta un investitor rațional acel randament?"

**Răspunsul meu, gata de spus cu voce tare:**

> „Retragerile sunt pe epoci de 14–30 de zile, deci nu există run mecanic — coada se procesează din colectările celor ~80% din portofoliu care performează normal, plus un buffer lichid de 20% care acoperă singur întreaga expunere pe orice retailer. Nu vindem active ca să onorăm ieșiri, deci nu există spirală NAV.
>
> NAV-ul se marchează cu provizion automat la 30 de zile de întârziere — la ziua 90 în scenariul vostru. Dacă plata vine la 120, provizionul se reversează; e un drag de timing, nu o pierdere.
>
> Prima pierdere, până la 15% din pool, e tranșa junior — banii noștri și ai angel-ilor, blocați 12 luni. Și fiecare creanță are regres: dacă retailerul nu plătește, distribuitorul răscumpără, plus garanție personală a acționarului. Expunerea pe orice retailer e plafonată în smart contract la 20%, deci scenariul lovește maxim o cincime din portofoliu. Chiar în coada cea mai neagră — retailerul intră în default ȘI distribuitorii nu pot onora regresul — junior-ul absoarbe 150k din 200k, iar senior-ul pierde ~6% din NAV într-un an. Un an prost, nu un colaps.
>
> Pe randament: brut ~16%, net LP senior țintit ~9–10% în EUR, adică ~600bp peste risk-free — comparabil cu private credit pe piețe emergente, dar cu tenor de 60 de zile și transparență de portofoliu în timp real, pe care niciun fond de factoring clasic nu v-o dă. Prețuim ca EM private credit, nu ca subvenție sub banca — argumentul către distribuitor e viteza și accesul, nu prețul."

---

## 6. Ce trebuie construit ca acest răspuns să fie adevărat

Răspunsul de mai sus funcționează **doar dacă mecanismele există în specificația MVP-ului**, nu în policy doc. Pentru Octav, de construit de la început (nu retrofit):

- [ ] Retrageri pe **epoci**, nu instant — la nivel de smart contract.
- [ ] **Buffer lichid** de 20% ca parametru de pool.
- [ ] **Tranșare senior/junior** cu first-loss de 15% și blocaj de 12 luni pe junior.
- [ ] **Plafoane de concentrare hard**: 20% pe retailer, 10% pe distribuitor — în contract.
- [ ] **Provizionare NAV automată** la 30 de zile de întârziere.
- [ ] **Regres** codificat în contractul de cesiune (off-chain) + reflectat în starea on-chain.
- [ ] **Circuit breaker** (din AI-STORY-HONEST.md §3): oprește originarea la X% delincvență 30d.
- [ ] Pool denominat în **EURC**.

---

## 7. Parametri de calibrat cu date reale (nu inventa, măsoară)

Toate cifrele ILUSTRATIV de mai sus se înlocuiesc cu date reale pe măsură ce apar:

| Parametru | Valoare model | Sursa datelor reale |
|---|---|---|
| Discount brut | 16% | ce acceptă efectiv primii distribuitori |
| Pierdere așteptată | 3% (floor) | outcome-urile reale din shadow mode (12+ luni) |
| Cost conversie + FX | 0,7% | cotații reale de la partenerul licențiat EURC↔RSD |
| OpEx | 1,5% | costuri reale de originare/colectare/legal |
| Diluție (retururi, rabaturi, taxe de raft) | reflectată în holdback 20% | istoricul real al perechii distribuitor-retailer |
| Rată de întârziere a retailerilor | scenariile A/B/C | comportamentul istoric știut de Vladislav + monitorizare |

*Onestitate statistică (din §4.2 al raportului): la 20–50 de facturi în primul an vom vedea 0–2 default-uri. Aceste cifre sunt un cadru de decizie prudent, nu o predicție validată — de aceea PD floor-ul e hardcodat la 3% până la N≥200.*
