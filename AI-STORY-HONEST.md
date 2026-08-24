# AI Story — versiunea onestă și apărabilă

> **[Notă de pivot, 22 iulie 2026]** Documentul de față descrie AI-ul din viziunea completă (faza 2+). Principiul central — AI face document intelligence, NU decizie de credit, „AI credit score" e interzis din pitch — rămâne valabil și pentru MVP-ul de Demo Day (FMCG Receivables Passport). Pentru planul curent, vezi `SOLANA-SUMMIT-BRIEF.md` și `VARIANTE-DEMO-DAY.md`.

*Reîncadrarea completă a poveștii AI pentru FMCG Receivables Rail. Înlocuiește framing-ul „AI scoring în timp real" (Qwen2.5-Coder + ChromaDB + n8n ca motor de credit) cu poziționarea recomandată în DUE-DILIGENCE-ADVERS.md, Secțiunea 4b. Data: 2 iulie 2026.*

*Principiul director: în v1, AI-ul nu decide creditul. Underwriting-ul e determinist, pe reguli + date de stat, cu semnătură umană. AI-ul face document intelligence și operațiuni. Un model statistic real rulează în shadow mode și preia greutate doar după calibrare dovedită. Scoatem din TOATE materialele afirmația „AI-ul scorează riscul în timp real" — e singura din pitch care poate fi demonstrată falsă pe loc.*

---

## 1. Narativa de pitch (pentru scenă și one-pager)

> „În anul 1, creditul nu îl decide un model — îl decid reguli deterministe, date direct de la stat (SEF/e-Factura), plafoane de concentrare scrise în smart contract și o semnătură umană de comitet. Nu scorăm riscul cu un LLM, pentru că un LLM nu produce o probabilitate de default calibrată, iar noi nu confundăm un model de limbaj cu un model de risc. AI-ul face exact ce știe să facă onest și verificabil azi: citește și structurează facturi și contracte, reconciliază automat cu registrul de stat, detectează anomalii de fraudă și monitorizează sănătatea plătitorilor. În paralel, un model statistic clasic — interpretabil și calibrabil, nu generativ — rulează în shadow mode 6–12 luni pe outcome-urile noastre reale și primește greutate în decizie doar după ce își dovedește calibrarea în fața LP-ilor, cu un prag pre-înregistrat."

Această formulare transformă cea mai slabă axă într-un semnal de maturitate: arată că echipa cunoaște diferența dintre un model de limbaj și un model de risc, că respectă disciplina de underwriting a unui factor licențiat și că nu vinde magie AI unui juriu care a văzut modele de risc reale. Nu e o retragere — e demonstrația că știm unde AI-ul creează valoare reală (operațiuni, viteză, verificare la sursă) și unde ar fi iresponsabil să-l punem (decizia de credit, înainte de a avea date).

---

## 2. Ce face AI-ul concret azi vs. ce va face

| Componentă | Rol real (azi, v1) | De ce e legitimă | Cum o demonstrez în demo |
|---|---|---|---|
| **Extracție documente** (Qwen2.5-Coder rulat local pe Ollama, output JSON cu schemă strictă) | Citește facturi și contracte, extrage câmpurile structurate (emitent, cumpărător, sumă, tenor, scadență) și le normalizează. Nu atinge decizia de finanțare. | Extracția structurată din documente e o sarcină clasică și verificabilă pentru un LLM — nu cere calibrare de probabilități. Output-ul e JSON validat pe schemă, deci falsificabil și auditabil. | Încarc o factură reală (PDF), arăt câmpurile extrase → JSON structurat, comparat cu factura din SEF. |
| **Reconciliere SEF / e-Factura** (orchestrat prin n8n) | Trage factura direct din API-ul de stat (SEF Serbia / RO e-Factura) și confruntă datele extrase cu sursa oficială. O factură care nu există în SEF/e-Factura nu există legal. | Verificarea existenței și statutului la sursa de stat e un avantaj structural pe care factorii din vest nu-l au. AI-ul doar orchestrează și confruntă; adevărul vine de la stat, nu de la model. | Integrare SEF în sandbox: factură trasă din API, câmpurile comparate cu extracția, status de acceptare afișat. **Acesta e demo-ul care câștigă track-ul RWA, nu mint-ul de token.** |
| **Detecție de anomalii** (analitică pe date structurate; RAG pe ChromaDB pentru context istoric) | Semnalează tipare de fraudă: velocitate anormală de facturare per distribuitor, sume rotunde, retaileri apăruți brusc, facturi chiar sub praguri de aprobare, grafuri de afiliere emitent↔plătitor. | Sunt reguli și statistici simple, interpretabile — nu pretenții de scoring de credit. Atacă direct vectorii de fraudă din Secțiunea 2.2 (dublă finanțare, fresh-air invoicing, afiliați). | Rulez pipeline-ul pe un set de facturi cu câteva anomalii injectate; arăt flag-urile ridicate și motivul fiecăruia. |
| **Monitorizare plătitori** (n8n pentru workflow-uri; ChromaDB/RAG pe registre și știri) | Urmărește sănătatea retailerilor-plătitori: situații financiare publice (APR Serbia / MF-ANAF România), liste de datornici fiscali, știri de piață. Alimentează comitetul și circuit-breaker-ul, nu o decizie automată. | Riscul primar al unei facturi de factoring e *plătitorul*, iar pe retaileri există date publice reale. Monitorizarea continuă la sursă e operațiuni, nu underwriting automat. | Dashboard cu profilul unui retailer whitelisted: financiare publice, semnale recente, status. |
| **Model statistic de PD** (regresie logistică / gradient boosting — *nu* LLM) | **Nu face nimic în decizie azi.** Rulează în shadow mode (vezi Secțiunea 4), pe feature-uri structurate, comparat cu outcome-urile reale. | E interpretabil și calibrabil, spre deosebire de un LLM. Preia greutate doar după prag pre-înregistrat de calibrare. | Arăt arhitectura shadow mode și primul raport de calibrare (chiar dacă e pe date sintetice/pilot la Demo Day). |

**Regula de igienă care leagă totul (Secțiunea 4b.7 + 2.2.6):** extracția LLM rulează pe text extras și normalizat, niciodată pe PDF-uri brute; output-ul e strict structurat (JSON cu schemă); **nicio ieșire de LLM nu atinge direct o decizie de finanțare.** Asta închide vectorul de prompt injection prin conținutul documentelor.

---

## 3. Arhitectura de decizie v1 — motorul de reguli determinist

Underwriting-ul din anul 1 este un motor de reguli hard, nu un scor. Fiecare factură trece prin toate porțile de mai jos; dacă pică una, nu se finanțează. AI-ul de operațiuni *alimentează* aceste porți cu date verificate, dar nu decide niciuna.

### Porțile deterministe (toate obligatorii)

| Poartă | Regulă hard | Sursa datelor |
|---|---|---|
| **Whitelist plătitori** | Doar retaileri de pe lista aprobată (top lanțuri, scorate manual pe financiare publice). | APR / MF-ANAF, cunoașterea lui Vladislav (20 ani comportament de plată regional). |
| **Vechime distribuitor** | ≥ 3 ani. | Registrul comerțului. |
| **Tenor** | ≤ 90 de zile. | Factura din SEF/e-Factura. |
| **Avans** | ≤ 80% din nominal, cu holdback pentru diluție (retururi, rabaturi, taxe de raft). | Regulă de contract. |
| **Concentrare per plătitor** | ≤ 20–25% din pool pe un singur retailer. **În smart contract, nu în policy doc.** | On-chain. |
| **Concentrare per distribuitor** | ≤ 10% din pool. **În smart contract.** | On-chain. |
| **Regres** | Obligatoriu în v1 — distribuitorul răscumpără creanța dacă retailerul nu plătește (plus garanție personală a acționarului la început). | Contract de cesiune. |
| **Zero afiliați** | Nicio factură între părți afiliate (emitent ↔ plătitor). | Detecția de anomalii (grafuri de afiliere) + verificare manuală. |
| **PD floor** | Pierdere așteptată minimă hardcodată 2–3% anual per pereche distribuitor-retailer, până la ≥12 luni și N≥200 facturi încheiate. Prețul și avansul se calculează de la acest floor în sus. | Constantă de sistem. |
| **Comitet peste prag** | Fiecare finanțare peste un prag: aprobare de comitet, doi din trei (Stefan, Finance Lead, advisor ex-Deloitte). BD (Vladislav) e separat de comitetul de credit, cu veto pe fiecare finanțare. | Semnătură umană. |

### Unde se conectează AI-ul de operațiuni (fără să atingă decizia de credit)

```
                    ┌─────────────────────────────────────────────┐
                    │        AI OPERAȚIUNI (nu decide credit)     │
                    │                                             │
   Factură (PDF) ──▶│  Extracție (Qwen/Ollama) → JSON structurat  │
                    │           │                                 │
   API stat (SEF) ──▶│  Reconciliere SEF/e-Factura (n8n)          │──┐
                    │           │                                 │  │ date
   Registre/știri ──▶│  Monitorizare plătitori (RAG/ChromaDB)     │  │ verificate
                    │           │                                 │  │
                    │  Detecție anomalii (velocitate, sume,       │  │
                    │  grafuri afiliere) ──▶ FLAG-uri             │──┘
                    └─────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────────────────┐
                    │   MOTOR DE REGULI DETERMINIST (decide)      │
                    │   whitelist · vechime · tenor · avans ·     │
                    │   concentrare · regres · zero afiliați ·    │
                    │   PD floor · comitet peste prag             │
                    └─────────────────────────────────────────────┘
                                    │
                    PASS ──▶ finanțare + atestare on-chain (dual control uman)
                    FAIL ──▶ respins
                                    │
                    ┌─────────────────────────────────────────────┐
                    │   CIRCUIT BREAKER ON-CHAIN (independent)     │
                    │   delincvență 30d > X%  SAU  2 facturi ale   │
                    │   aceluiași plătitor întârzie → oprește      │
                    │   originarea automat, până la deblocare de   │
                    │   guvernanță. Nici echipa nu-l poate ocoli.  │
                    └─────────────────────────────────────────────┘
```

AI-ul livrează **date verificate și flag-uri** în motorul de reguli. Decizia rămâne o funcție deterministă de aceste date plus semnătura umană. Circuit-breaker-ul on-chain e un mecanism de siguranță care nu depinde de echipă — un kill-switch pe care nici noi nu-l putem ocoli.

**Guvernanță de model de la zi 0 (Secțiunea 4b.6):** versionarea regulilor și a oricărui model, log imuabil al deciziilor și al override-urilor (on-chain — utilizare legitimă a chain-ului), backtest trimestrial, raport de calibrare către LP-i.

---

## 4. Planul shadow mode

Scopul: să construim dreptul de a folosi un model în decizie, *dovedind* calibrarea înainte, nu declarând-o.

### Ce model
- **Regresie logistică** (baseline interpretabil) și/sau **gradient boosting** pe feature-uri structurate.
- **Explicit NU un LLM.** Un model de PD trebuie să fie interpretabil, determinist și calibrabil — proprietăți pe care un LLM nu le are.
- Ținta modelului: **probabilitatea de default a plătitorului** (retailerul), nu a emitentului — pentru că acolo stă riscul primar de credit al facturii (Secțiunea 4.3).

### Pe ce features (toate din date deja disponibile în cele două documente)
- Financiare publice ale retailerului (APR Serbia / MF-ANAF România).
- Liste de datornici fiscali, semnale din birouri de credit.
- Comportamentul istoric de plată al lanțurilor (cunoașterea lui Vladislav, codificată).
- Caracteristici ale facturii: tenor, sumă, pereche distribuitor-retailer, istoric de diluție al perechii.
- Semnale de anomalie din pipeline-ul de operațiuni.

### Cum măsor calibrarea
- Modelul produce o predicție pentru **fiecare** factură, dar predicția **nu intră în decizie** — se logează alături de decizia pe reguli.
- La încasare/default, comparăm predicția cu outcome-ul real.
- Măsurăm calibrarea explicit: curbă de calibrare / reliability diagram (predicția „PD 3%" corespunde unei frecvențe reale de ~3%?) și scor Brier pe portofoliu. Publicăm raportul LP-ilor.
- Onestitate statistică (Secțiunea 4.2): la 20–50 de facturi și rată de default de câteva procente, vom vedea 0–2 default-uri în primul an. De aceea pragul de activare e legat de volum și timp, nu de „modelul arată bine".

### Pragul pre-înregistrat la care capătă greutate
- **Minimum 12 luni de shadow mode ȘI N ≥ 200 de facturi încheiate** — pragul e fix și declarat înainte, nu ajustat retroactiv.
- Până atunci: **PD floor de 2–3% anual hardcodat**, indiferent ce spune orice model.
- Doar după pragul atins și calibrarea publicată LP-ilor, modelul primește greutate în decizie — și chiar și atunci, gradual, nu ca înlocuitor al regulilor.

---

## 5. Răspunsul la întrebarea dură a juriului Visa (Secțiunea 4c)

> **Întrebarea:** „Modelul vostru n-a văzut în viața lui un default real. Care e calibrarea probabilităților lui de default, pe ce ați validat-o, și — dacă modelul greșește sistematic în primele șase luni — ce mecanism *care nu depinde de voi* oprește pierderile înainte să ajungă la 20% din pool?"

**Răspunsul meu, gata de spus cu voce tare:**

> „Răspunsul scurt: modelul nu are încă o calibrare pe date proprii — și tocmai de aceea nu decide nimic în anul 1. Ar fi iresponsabil să lăsăm un model care n-a văzut un default să stabilească prețul riscului, și un model care n-a văzut niciun default va prezice cu încredere că nimic nu intră în default — exact până la primul eveniment corelat, când greșește pe tot portofoliul simultan.
>
> Așa că anul 1 e underwriting pe reguli, nu pe scor: plătitori whitelisted scorați pe financiare publice, avans maxim 80%, regres obligatoriu, plafoane de concentrare scrise în smart contract, și pierderea așteptată podită la 3% indiferent ce spune orice model — prețuim de la acel pod în sus. AI-ul face extracție de documente, reconciliere cu SEF la sursă și detecție de anomalii de fraudă — nu credit.
>
> Modelul statistic — regresie logistică și gradient boosting, interpretabil și calibrabil, nu un LLM — rulează în shadow mode: prezice pentru fiecare factură, dar predicția doar se logează lângă decizia pe reguli. Comparăm cu outcome-urile reale și publicăm curba de calibrare LP-ilor. Capătă greutate în decizie doar după un prag pre-înregistrat: minimum 12 luni și 200 de facturi încheiate.
>
> Iar mecanismul care nu depinde de noi există și e în smart contract: un circuit breaker oprește automat originarea nouă la [X]% delincvență la 30 de zile, sau când două facturi ale aceluiași plătitor întârzie. Nici echipa nu-l poate ocoli — asta e un argument de încredere pe care factoringul clasic nu-l poate replica."

Acest răspuns transformă cea mai slabă axă a proiectului într-o demonstrație de maturitate — dar funcționează **doar** dacă am renunțat sincer, în toate materialele, la „AI-ul scorează riscul în timp real". Nu poți da acest răspuns pe scenă dacă slide-ul din spate spune altceva.

---

## Anexă — ce scoatem din materiale

- Din CONTEXT.md §1 (bullet-ul „Un motor de scoring AI evaluează riscul fiecărei facturi în timp real…"): reformulat ca „underwriting pe reguli + date de stat; AI pe operațiuni (extracție, reconciliere SEF, anomalii, monitorizare); model statistic de PD în shadow mode".
- Din CONTEXT.md §7 („AI / motor de scoring risc"): redenumit „AI de operațiuni + document intelligence"; componentele (Ollama, Qwen2.5-Coder, ChromaDB, n8n, MCP) rămân, dar cu rolul corect — extracție, orchestrare, RAG pe date publice — nu credit scoring.
- Peste tot: eliminăm sintagma „AI scoring în timp real". E singura afirmație din pitch care poate fi demonstrată falsă pe loc.
