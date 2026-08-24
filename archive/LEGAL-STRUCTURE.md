# Structura juridică — decizia și pașii de executat

> **[Notă de pivot, 22 iulie 2026]** Cale A/B de mai jos rămân relevante pentru faza 2+ (factoring complet), dar NU sunt planul pentru Demo Day. MVP-ul curent (FMCG Receivables Passport) evită complet acest blocaj — nu se atinge creanța, deci nu e nevoie de licență de factoring. Vezi `SOLANA-SUMMIT-BRIEF.md` §4 pentru explicația corectă și `VARIANTE-DEMO-DAY.md` pentru plan.

*Răspunsul la Riscul existențial #1 (tokenul nu e creanța + factoring nelicențiat + cerința de plată în RSD) și la cea mai grea întrebare a juriului regulator (DUE-DILIGENCE-ADVERS.md §3c). Acesta e riscul ranked #1: în forma din CONTEXT.md, operațiunea e ilegală din ziua 1. Nu e o problemă de implementare, e o decizie de structură. Data: 2 iulie 2026.*

> **Nota juridică obligatorie (din raport):** afirmațiile de mai jos sunt fundamentate pe surse publice, dar **NU** înlocuiesc un aviz local. Înainte de Demo Day: minim un memo preliminar de la o firmă din Belgrad și una din București. Acest document e cadrul de decizie și briefing-ul pentru avocați, nu avizul în sine.

---

## 0. Problema, în trei fraze

1. **Tokenul nu transferă creanța.** Un SPL care „reprezintă" o factură nu mută niciun drept legal. Dreptul se transferă prin cesiune valabilă, perfectată **off-chain** (notificarea debitorului în Serbia; înscrierea RNPM în România). Fără asta, LP-ii dețin chitanțe digitale fără valoare juridică, iar în insolvența distribuitorului stau ultimii la coadă.
2. **Factoringul e activitate licențiată în ambele piețe.** Serbia: licență (de la 12 dec 2025 prin Comisia de Valori Mobiliare / SSC), capital minim **40M RSD (~340.000 EUR)**, entitate locală. România: factoringul e creditare rezervată băncilor și IFN-urilor înscrise la BNR (Legea 93/2009).
3. **Nici avansul nu poate curge ca USDC.** Legea valutară sârbă cere ca plățile domestice între rezidenți să se facă **în dinari** — deci avansul are nevoie de conversie printr-un furnizor licențiat și plată bancară în RSD, nu stablecoin direct în portofelul distribuitorului.

**Verdict raport:** fatal dacă nu e rezolvat; **rezolvabil prin SPV + parteneriat cu un factor licențiat.**

---

## 1. Decizia centrală (a ta, în iulie — nu în august)

Sub a cui licență cumperi **prima factură în ziua 1**? Două căi:

| | **Cale A — Parteneriat cu factor licențiat** *(recomandat de raport pentru anul 1)* | **Cale B — SPV propriu licențiat** |
|---|---|---|
| **Cum funcționează** | Un factor sârb licențiat existent (sau aranjament de fronting) face originarea și colectarea; protocolul vostru e stratul de capital + tehnologie. | Înființezi și licențiezi propriul vehicul de factoring în Serbia. |
| **Capital necesar anul 1** | ~0 pe partea de licență (îl are partenerul) | **~340.000 EUR** capital minim + costuri de licențiere |
| **Timp până la prima factură legală** | Săptămâni–luni (cât durează contractul de parteneriat) | **6–12 luni** de licențiere |
| **Potrivit pentru** | **Faza seed / Demo Day** | Faza post-seed, după ce ai capital și tracțiune |
| **Risc** | Dependență de partener; împărțire de marjă | Capital blocat + timp; îți omoară timeline-ul de Demo Day |
| **Ce spui juriului** | „Originarea se face prin factorul partener X, sub Legea factoringului, sub supravegherea SSC." | „Suntem în proces de licențiere la SSC; timeline estimat Y." |

**Recomandare (aliniată cu §3b.1 din raport):** **Cale A pentru anul 1.** Cei 340k EUR + 6–12 luni de licențiere nu sunt pentru faza seed. Alternativ, discută cu SSC un timeline de licențiere propriu — dar **nu înainte de Demo Day**. Cale B devine relevantă abia după seed.

> Aceasta e singura decizie pe care nu ți-o pot lua eu — cere să știi dacă Vladislav poate deschide ușa unui factor licențiat sârb dispus la fronting. Dacă da, Cale A e clară. **Acțiune: întrebarea către Vladislav pleacă săptămâna asta.**

---

## 2. Structura pe trei etaje (explicabilă în 30 de secunde)

Indiferent de Cale A sau B, arhitectura entităților e aceeași (din §3b.2):

```
┌─────────────────────────────────────────────────────────────┐
│  (i) OpCo Tech  (România sau Serbia)                         │
│      Dezvoltă protocolul. Ia fee de tehnologie.             │
│      NU atinge creanțele. NU e factor.                      │
└─────────────────────────────────────────────────────────────┘
                          │ licențiază tehnologia
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  (ii) Factor licențiat / SPV sârb                           │
│       Cumpără creanțele. Titular legal al cesiunilor.       │
│       Cont colector dedicat. Face perfectarea legală.       │
│       ── Cale A: partenerul licențiat  ── Cale B: al vostru │
└─────────────────────────────────────────────────────────────┘
                          │ garantează cu portofoliul
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  (iii) Vehicul de emisiune                                  │
│        Emite tokenul de pool ca INSTRUMENT                  │
│        (token digital sub ZDI cu white paper aprobat SSC /  │
│         titlu de creanță / participare), garantat cu        │
│         portofoliul SPV-ului. Doar investitori profesioniști.│
└─────────────────────────────────────────────────────────────┘
```

Separarea e esențială: **OpCo (tech) nu e factor** — nu atinge creanțele, deci nu are nevoie de licență de factoring. Factorul (partener sau SPV) e cel care cumpără creanțele. Tokenul e emis de un vehicul distinct, garantat cu portofoliul factorului.

---

## 3. Clasificarea tokenului — capcana MiCA (nu greși asta pe scenă)

**Cel mai frecvent răspuns greșit: „Suntem MiCA-compliant."** E greșit și te descalifică, pentru că arată că n-ai înțeles clasificarea.

- Tokenul de pool = deținere fracționată care dă **drept la randament dintr-un portofoliu administrat de altcineva** → arată ca un **instrument financiar** (unitate de fond / titlu de creanță).
- **Instrumentele financiare sunt EXCLUSE din MiCA** → intră sub **MiFID II + Regulament de prospect + AIFMD**. Dacă tokenul e security, a spune „MiCA-compliant" înseamnă că tocmai ai recunoscut că n-ai priceput regimul.
- Separat, **pool-ul însuși bifează definiția de AIF** (fond alternativ de investiții) sub AIFMD — capital de la mai mulți investitori, politică de investiții definită, beneficiu comun. Transpus în România prin Legea 74/2015. Administrarea unui AIF fără înregistrare e infracțiune reglementară.

**Cum evităm capcana:**
- **Serbia:** folosim ZDI **ofensiv** → token digital cu **white paper aprobat de SSC** (zece deja aprobate, trend crescător). Asta e singura cale prin care „tokenizarea" devine fapt juridic, nu metaforă. **Diferențiator de pitch: primul RWA de facturi cu white paper aprobat în Serbia.**
- **Distribuție doar către investitori profesioniști/calificați în anii 1–2** → plasament privat = ieși de sub obligația de prospect și de sub marketingul retail AIFMD. Sub pragul AIFMD (<100M EUR) → doar **înregistrare**, nu autorizare completă.
- **Renunți la retail-ul on-chain global** până ai licențe. Retail-ul e exact ce te omoară la regulator.

---

## 4. Perfectarea legală — cum obții prioritate reală pe creanță

Cesiunea trebuie perfectată off-chain, altfel tokenul nu apără pe nimeni (din §2.4 + §3):

| Piață | Mecanism de opozabilitate | Acțiune la fiecare finanțare |
|---|---|---|
| **România** | Înscriere în **RNPM** (Registrul Național de Publicitate Mobiliară). Cesiunea neînscrisă nu e opozabilă terților — un al doilea finanțator care se înscrie primul te bate chiar dacă ai finanțat primul. | Interoghezi RNPM înainte de finanțare (dubla finanțare devine vizibilă) + înscrii cesiunea ta. |
| **Serbia** | Nu există registru central al cesiunilor. Prioritatea se joacă pe **notificarea debitorului** — debitorul plătește valabil factorului notificat primul. | Notificare formală a retailerului **cu dată certă** + verificarea registrului de gaj APR + declarație pe proprie răspundere a distribuitorului cu răspundere penală. |

Plus, comun ambelor: **cont colector dedicat** controlat de SPV (plata retailerului merge acolo, nu în contul distribuitorului) — ucide deturnarea plății și e practica standard a oricărui factor serios.

*(Acesta e și miezul răspunsului la întrebarea Visa din §2c — vezi AI-STORY-HONEST.md și pipeline-ul de verificare; documentul de față acoperă etajul juridic, nu cel de fraudă.)*

---

## 5. Fluxul valutar (cine face conversia, legal)

- **Capital în pool:** EURC (stablecoin de EUR — taie expunerea FX principală, vezi POOL-ECONOMICS.md).
- **Avans către distribuitor:** **în RSD, prin bancă.** Niciodată stablecoin direct în portofelul distribuitorului (interzis de legea valutară sârbă).
- **Conversia EURC↔RSD:** prin partener licențiat (bancă sau DASP). Aceasta e o **întrebare deschisă de rezolvat cu avocatul**: cine e furnizorul licențiat de conversie.

---

## 6. Coada de conformitate (nu fatală, dar juriul o numără dacă tu n-o faci)

- **AML/KYC:** onboarding de LP-i = KYC pe finanțatori, travel rule. Serbia: regim DASP sub ZDI. România: CASP sub MiCA dacă atingi servicii de crypto-active.
- **GDPR / legea sârbă a datelor** pe datele din facturi.
- **EU AI Act (notă, nu improvizație):** scoringul B2B pe persoane juridice nu e per se high-risk, DAR dacă apar PFA-uri / *preduzetnik*-i (frecvenți în FMCG mic), intri în zona high-risk — obligații aplicabile **din august 2026, luna Demo Day-ului**. Merită o notă de subsol în pitch. *(Reținere: mitigat parțial de reframing-ul din AI-STORY-HONEST.md — AI-ul nu decide credit, deci nu face „creditworthiness assessment" în sensul Anexei III.)*
- **BiH:** declarată explicit **„faza 3, după cadru"** — arată disciplină, nu slăbiciune. Fără cadru federal pentru active digitale; e-invoicing B2B abia prin ~2029.

---

## 7. Răspunsul la cea mai grea întrebare a juriului (regulator, §3c)

> **Întrebarea:** „Sub a cui licență de factoring cumpărați prima factură în Serbia, în ziua 1? Și tokenul vostru de pool — e activ digital sub legea sârbă, instrument financiar sub MiFID, sau unitate de AIF? Dacă mâine vă sună Comisia de Valori Mobiliare și BNR în aceeași zi, care e răspunsul — și există un aviz scris care îl susține?"

**Răspunsul meu, gata de spus cu voce tare** *(fiecare paranteză pătrată = o decizie de luat în iulie)*:

> „Originarea se face prin [factorul licențiat partener / SPV-ul nostru licențiat], sub Legea factoringului, sub supravegherea SSC — care, din decembrie 2025, e și regulatorul tokenilor digitali, deci avem un singur interlocutor instituțional. OpCo-ul de tehnologie nu atinge creanțele; el doar licențiază protocolul.
>
> Tokenul de pool e structurat ca [token digital cu white paper aprobat de SSC / titlu de creanță plasat privat], oferit **exclusiv investitorilor profesioniști** — sub pragul AIFMD, cu înregistrare, fără ofertă retail. Nu spunem „MiCA-compliant", pentru că dacă tokenul e instrument financiar, MiCA nici nu se aplică — intrăm sub MiFID II și AIFMD, și suntem structurați pentru asta.
>
> Avem memo-uri preliminare de la [firmă Belgrad] și [firmă București] în data room, și am avut o întâlnire preliminară cu SSC în [luna]."

---

## 8. Ce trebuie executat — checklist iulie

**Decizii (doar tu le poți lua):**
- [ ] **Cale A vs. Cale B** — întrebarea către Vladislav: poate deschide ușa unui factor licențiat sârb dispus la parteneriat/fronting? *(săptămâna asta)*
- [ ] Jurisdicția OpCo tech: România sau Serbia.
- [ ] Clasificarea țintă a tokenului: token ZDI cu white paper / titlu de creanță / participare.

**Acțiuni (executabile acum):**
- [ ] **Două apeluri către firme de avocatură** — Belgrad (factoring + ZDI + valutar) și București (MiCA/MiFID/AIFMD + IFN + RNPM). Briefing-ul e în §9 mai jos.
- [ ] Cere fiecărei firme un **memo preliminar de 10–15 pagini** — chiar preliminar, în data room schimbă categoria în care te pune juriul.
- [ ] Solicită o **întâlnire preliminară cu SSC** — „am fost la SSC și știm exact ce aprobare ne trebuie" valorează mai mult decât orice slide despre TPS-ul Solanei.

---

## 9. Briefing pentru avocați (de trimis, gata de copiat)

**Către firma din Belgrad (dreptul sârb):**
1. Sub ce structură putem cumpăra creanțe FMCG în Serbia fără licență proprie de factoring în anul 1 — parteneriat/fronting cu un factor licențiat existent? Ce cere un astfel de aranjament?
2. Confirmați regimul post-12 dec 2025: SSC ca regulator unic pentru factoring și tokeni digitali. Ce înseamnă practic pentru un proiect care le folosește pe ambele?
3. Poate tokenul nostru de pool fi emis ca token digital sub ZDI cu white paper aprobat de SSC? Ce presupune procesul de aprobare a white paper-ului?
4. Cum perfectăm cesiunea pentru opozabilitate — notificarea debitorului cu dată certă, verificarea registrului de gaj APR? Ce dă prioritate față de un al doilea finanțator?
5. Fluxul valutar: cine poate face legal conversia EURC↔RSD și plata avansului în dinari către distribuitor?
6. Obligații AML/DASP pentru onboarding de LP-i profesioniști.

**Către firma din București (dreptul român + UE):**
1. Clasificarea tokenului de pool: instrument financiar sub MiFID II? Unitate de AIF sub AIFMD (Legea 74/2015)? Ce regim de plasament privat ne ține sub pragul de prospect și sub marketingul retail?
2. Pragul AIFMD sub 100M EUR — înregistrare vs. autorizare completă. Ce presupune înregistrarea?
3. Factoringul ca activitate de creditare (Legea 93/2009) — putem opera în România fără statut de IFN/bancă, sau doar prin partener?
4. Perfectarea cesiunii prin RNPM — procesul de înscriere și interogare înainte de finanțare.
5. EU AI Act din august 2026 — expunere dacă printre debitori apar PFA-uri; suficient că AI-ul nu decide credit (nu face creditworthiness assessment)?
6. GDPR pe datele din facturi.

---

*Următorul risc neacoperit după acesta: Riscul #2 (integritatea verificării facturilor / fraudă) — parțial acoperit de pipeline-ul SEF din AI-STORY-HONEST.md, dar merită documentul lui propriu. Și riscul transversal de echipă: un advisor cu experiență reală de risc de credit/factoring în regiune, care schimbă percepția juriului asupra întregii echipe.*
