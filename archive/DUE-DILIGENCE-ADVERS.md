# Due Diligence Advers — FMCG Receivables Rail

> **[Notă de pivot, 22 iulie 2026]** Acest raport a dus direct la decizia de a NU construi protocolul complet pentru Demo Day — blocajul de licență (Risc #1) și complexitatea economică (Risc #3) l-au făcut nefezabil într-un sprint de 5 săptămâni. Planul curent (FMCG Receivables Passport) evită Riscul #1 prin arhitectură. Vezi `SOLANA-SUMMIT-BRIEF.md` și `VARIANTE-DEMO-DAY.md`. Acest document rămâne relevant ca analiză de risc pentru faza 2+ (factoring complet).

*Raport de due diligence advers, o singură trecere. Perspectivă: investitor instituțional sceptic + regulator. Data: 2 iulie 2026. Bazat pe arhitectura din CONTEXT.md, tratată ca ipoteză, nu ca fapt.*

*Notă: afirmațiile juridice de mai jos sunt fundamentate pe surse publice (listate la final) dar NU înlocuiesc un aviz juridic local. Înainte de Demo Day, minim un memo preliminar de la o firmă de avocatură din Belgrad și una din București.*

---

## Rezumat executiv

**Verdict general:** Piața e reală, gap-ul e plauzibil, iar Serbia e — contraintuitiv — una dintre cele mai bune jurisdicții din Europa pentru acest proiect (lege dedicată activelor digitale + e-invoicing obligatoriu de stat + acum un singur regulator pentru factoring și tokeni digitali). Dar **în forma din CONTEXT.md, protocolul nu ar supraviețui unui due diligence instituțional**. Problemele nu sunt de implementare, ci de design: partea grea a acestui business este integral off-chain (drept, fraudă, colectare, licențiere), iar arhitectura actuală tratează blockchain-ul ca sursă de adevăr când el este, în cel mai bun caz, un rail de decontare și un jurnal de audit.

Un corolar incomod: „nu există nicio soluție on-chain de FMCG receivables în Balcani" nu e doar un gap validat — e și un semnal. Factoringul clasic (Instant Factoring, Factris) există și crește; partea pe care ei o fac greu (verificare, colectare, licență, capital) nu devine mai ușoară pe Solana. Diferențiatorul vostru trebuie să fie accesul la capital și viteza de decontare, și trebuie să puteți articula exact de ce restul stivei rămâne la fel de solid ca la un factor licențiat.

### Top 3 riscuri existențiale

**1. Tokenul nu este creanța — și fără licență, operațiunea e ilegală din ziua 1.**
Un token SPL care „reprezintă" o factură nu transferă niciun drept legal asupra creanței. Dreptul se transferă prin cesiune valabilă conform legii sârbe/române, perfectată off-chain (notificarea debitorului în Serbia; înscrierea în RNPM în România). Fără asta, finanțatorii pool-ului dețin chitanțe digitale fără valoare juridică, iar în insolvența distribuitorului stau la coadă în spatele tuturor. Separat: factoringul în Serbia cere licență și capital minim de 40.000.000 RSD (~340.000 EUR) — din 12 decembrie 2025 licențierea și supravegherea au trecut de la Ministerul de Finanțe la Comisia de Valori Mobiliare; în România factoringul e activitate de creditare rezervată băncilor și IFN-urilor înscrise la BNR (Legea 93/2009). A finanța facturi fără această infrastructură = intermediere financiară nelicențiată. **Fatal dacă nu e rezolvat; rezolvabil prin SPV + parteneriat cu un factor licențiat.**

**2. Dubla finanțare și frauda pe factură pot goli pool-ul fără ca on-chain să se vadă nimic.**
Blockchain-ul previne dubla cheltuire a tokenului, nu dubla cesiune a creanței. Nimic din arhitectura actuală nu împiedică un distribuitor să vândă aceeași factură vouă și lui Instant Factoring în aceeași săptămână, sau să prezinte o factură fictivă confirmată de un retailer complice. Frauda pe factură este modul standard în care mor factorii tineri — iar în v1 „oracolul" care atestă realitatea facturii sunteți voi înșivă. **Fatal dacă rămâne self-attested; rezolvabil prin integrare SEF/e-Factura + confirmarea debitorului + cont colector dedicat + RNPM.**

**3. Economia pool-ului nu închide așa cum e descrisă: mismatch de lichiditate + selecție adversă + FX.**
Randamentul vine dintr-un discount de câteva procente pe facturi de 30–120 de zile, în dinari/lei, finanțate în stablecoin dolar, către IMM-uri balcanice fără istoric — după pierderi așteptate, costuri de hedging și costuri operaționale, marja netă pentru LP riscă să fie sub ceea ce cere rațional capitalul pentru risc de credit emergent și iliquid. Dacă pool-ul promite retragere la cerere pe active de 60 de zile, ați construit un bank run cu fitilul aprins. Și primii distribuitori care vin la un factor nou, nelicențiat, on-chain sunt disproporționat cei refuzați de bănci și de Instant Factoring — selecție adversă structurală. **Rezolvabil prin tranșare, epoci de retragere, regres și prețuri oneste — dar trebuie modelat pe cifre, nu pe narativ.**

**Risc №4, de pitch, nu de protocol:** motorul de scoring, așa cum e specificat (Qwen2.5-Coder + ChromaDB + n8n), nu este un motor de credit scoring și orice jurat tehnic de la Visa sau Raiffeisen va vedea asta în 30 de secunde. Detalii în Secțiunea 4 — dar reframing-ul pitch-ului AI este probabil cea mai urgentă acțiune pre-Demo Day, pentru că e singura gaură care vă descalifică *în timpul* prezentării, nu după.

**Risc transversal de echipă (spus direct):** vindeți underwriting de credit fără nicio persoană cu experiență reală de risc de credit sau colectare în echipă. Vladislav acoperă piața, nu riscul. Un advisor cu 10+ ani în risc de credit bancar/factoring în regiune (și un avocat de reglementare) valorează la Demo Day mai mult decât orice feature on-chain.

---

## Secțiunea 1 — Soliditatea economică a capital pool-ului

### (a) Slăbiciuni de design și moduri de eșec

**1.1. Mismatch de lichiditate = bank run încorporat.** Activele pool-ului sunt creanțe iliquide de 30–120 de zile. Dacă pasivele (depozitele LP) sunt retractabile la cerere sau aproape, orice semnal negativ (un default vizibil, o întârziere a unui retailer mare) declanșează dinamica clasică: LP-ii sofisticați ies primii la NAV întreg, pierderea se concentrează pe cei rămași, iar pool-ul intră în spirală. Nu e un scenariu teoretic — este exact ce s-a întâmplat în creditarea on-chain subcolateralizată: default-ul Orthogonal Trading (~36M USD) pe Maple Finance în decembrie 2022 și seria de default-uri Goldfinch din 2023 au demonstrat că pool-urile DeFi pe credit real mor prin combinația concentrare + retragere liberă + delegat de underwriting prost aliniat. Juriul vostru cunoaște aceste cazuri.

**1.2. Default-uri corelate prin concentrarea plătitorilor.** În FMCG balcanic, riscul nu e distribuit pe sute de debitori independenți: plătitorii finali sunt câteva lanțuri de retail (în Serbia, 3–4 lanțuri domină comerțul modern). Dacă un singur retailer mare își prelungește unilateral termenele de plată cu 30–60 de zile — practică obișnuită în retailul regional, în ciuda plafonului legal de 60 de zile — o fracțiune mare din portofoliu devine delincventă *simultan*. Modelul „diversificat pe N facturi" e o iluzie dacă N facturi au 3 plătitori.

**1.3. Marja netă e subțire și asimetrică.** Aritmetică pe un caz tipic: factură de 100k EUR echivalent, 60 de zile, avans 80%, fee de discount 2% pe nominal → venit brut 2.000 EUR pe 80.000 EUR avansați ≈ 15% anualizat brut. Din asta scazi: pierderea așteptată (2–4% anual e o presupunere *optimistă* pentru IMM-uri balcanice fără istoric, cu voi ca factor nou), costul de hedging valutar (pool în USDC, facturi în RSD/RON — expunere efectivă EUR/USD de 1–3% anual dacă o acoperi, volatilitate de 7–10% dacă nu), costuri operaționale și marja protocolului. LP-ului îi rămân realist 5–9% net — pentru risc de credit emergent, iliquid, pe o platformă nouă. T-bills dau ~4% fără risc; private credit pe piețe emergente cere 10–12%+. **Asimetria e brutală: la 2% fee, un singur default total de 80k șterge câștigul brut a 40 de facturi bune de aceeași mărime.** Dacă nu puteți arăta acest calcul înaintea juriului, îl va face juriul pentru voi.

**1.4. Selecție adversă la originare.** Distribuitorii cu facturi bune pe retaileri buni au deja acces la factoring bancar și la Instant Factoring, la prețuri competitive. Cine acceptă primul un factor nou, fără licență cunoscută, cu decontare în crypto? Disproporționat: cei refuzați în altă parte. Fără un mecanism explicit anti-selecție (whitelist de plătitori, regres, garanții), pool-ul devine groapa de facturi pe care piața le-a refuzat deja.

**1.5. Stimulente prost aliniate pe toate cele trei axe.** (i) Dacă protocolul câștigă fee pe volumul originat, echipa e plătită să crească volumul, nu calitatea — pierderile le suportă LP-ii. (ii) Scoringul e făcut in-house de aceeași entitate care vinde deal flow-ul — underwriter-ul și vânzătorul sunt aceeași persoană. (iii) Deal flow-ul vine din rețeaua personală a BD Lead-ului — facturile primilor clienți sunt de facto tranzacții cu părți afiliate relațional, exact unde disciplina de underwriting cedează prima. Niciun mecanism din arhitectura actuală nu pune capitalul echipei înaintea capitalului LP-ilor.

**1.6. FX pe trei picioare.** Pool USDC (USD) → avans către distribuitor care legal trebuie plătit în RSD (plățile domestice între rezidenți sârbi se fac în dinari, conform legii valutare) → retailerul plătește în RSD → conversie înapoi. Două conversii pe ciclu + expunere USD/EUR (dinarul e într-un float administrat cvasi-ancorat de EUR). Cost și fricțiune pe fiecare factură, plus întrebarea încă nerezolvată: cine face conversia licențiat?

### (b) Reparații concrete

1. **Elimină retragerea instant. Complet.** Retrageri pe epoci de 14–30 de zile, onorate din colectările scadente, cu un buffer lichid de 15–20% din pool. Scadențarul retragerilor trebuie să oglindească scadențarul facturilor. Spune-o explicit în pitch — pentru un jurat bancar, *absența* retragerii instant e un semn de maturitate, nu o slăbiciune.
2. **Tranșare senior/junior cu first-loss real.** Tranșa junior (10–20% din pool) absoarbe primele pierderi, e blocată 6–12 luni, și e finanțată de echipă/trezoreria protocolului/angel-i care cred în voi. „Avem skin in the game de X% first-loss" este singurul răspuns credibil la întrebarea despre aliniere.
3. **Factoring cu regres în v1.** Dacă retailerul nu plătește, distribuitorul răscumpără creanța (plus garanție personală a acționarului la început). Da, e mai puțin „pur" decât non-recourse — dar transformă un unsecured bet pe retailer într-o creanță cu doi obligați. Treci la non-recourse doar pe plătitori whitelisted, după 12+ luni de date.
4. **Plafoane hard de concentrare, în smart contract, nu în policy doc:** max 20–25% din pool pe un singur retailer-plătitor (realist la început; scade în timp), max 10% pe un distribuitor, tenor max 90 de zile, avans max 80%.
5. **Prețuiește onest, ca EM private credit:** discount rate brut de 14–18% anualizat, țintă LP net 9–12%. Argumentul de vânzare către distribuitor nu e „mai ieftin decât banca" — e viteza (ore, nu săptămâni) și accesul. Dacă modelul vostru închide doar la prețuri sub factoringul bancar, nu aveți business, aveți subvenție pentru LP-i.
6. **Denominați pool-ul în stablecoin de EUR (EURC), nu USDC.** Dinarul și leul trăiesc lângă euro; asta taie expunerea valutară principală aproape la zero fără hedging activ. Detaliu mic, semnal mare de competență financiară.
7. **Fee-ul protocolului legat de randamentul realizat (colectat), nu de volumul originat.** Plus comitet de credit separat de BD, cu drept de veto pe fiecare finanțare — advisorul ex-Deloitte e candidatul natural.

### (c) Cea mai grea întrebare a juriului (Raiffeisen)

> „Să zicem că cel mai mare lanț de retail din portofoliul vostru anunță unilateral că plătește la 120 de zile în loc de 60 — cum a mai făcut-o. În acea zi: ce se întâmplă cu retragerile LP, cum marcați NAV-ul, cine ia prima pierdere și cât din ea? Și după pierderi așteptate, FX și costuri — ce randament net oferă pool-ul și de ce ar accepta un investitor rațional acel randament pentru risc de credit balcanic nerated, pe o platformă fără istoric?"

**Răspuns solid:** „Retragerile sunt pe epoci, deci nu există run mecanic — coada se procesează din colectări, cu buffer de 20%. NAV-ul se marchează cu provizion automat la 30 de zile de întârziere. Prima pierdere, până la 15% din pool, e tranșa junior — banii noștri și ai angel-ilor, blocați 12 luni. Expunerea pe orice retailer e plafonată în contract la 20%, deci scenariul lovește maxim o cincime din portofoliu, cu regres asupra distribuitorilor pentru tot. Pe randament: brut 15–16%, net LP țintit 10–11% în EUR, adică 600–700bp peste risk-free — comparabil cu private credit EM, dar cu tenor de 60 de zile și transparență de portofoliu în timp real, pe care niciun fond de factoring clasic nu v-o dă." — Ca să poți da acest răspuns, mecanismele trebuie să existe. Asta e tema.

---

## Secțiunea 2 — Integritatea verificării facturilor

### (a) Slăbiciuni de design și moduri de eșec

**2.1. Adevărul fundamental: on-chain nu se vede nicio cesiune off-chain.** Tokenizarea previne dubla vânzare a *tokenului*. Creanța însă trăiește în drept civil sârb/român, iar acolo poate fi cesionată de câte ori vrea distribuitorul, pe hârtie, către oricine. Protocolul care nu se ancorează în mecanismul legal de opozabilitate nu are apărare: în România, cesiunea neînscrisă în RNPM (Registrul Național de Publicitate Mobiliară) nu e opozabilă terților — adică un al doilea finanțator care se înscrie primul vă bate chiar dacă ați finanțat primii. În Serbia nu există un registru central al cesiunilor de creanțe; prioritatea se joacă practic pe notificarea debitorului — debitorul plătește valabil factorului despre care a fost notificat primul.

**2.2. Vectorii de fraudă, în ordinea probabilității:**
1. **Dubla finanțare** — aceeași factură la voi și la un factor clasic, în aceeași săptămână. Nedetectabilă on-chain prin definiție.
2. **Factura fictivă cu debitor complice** — retailerul (sau un angajat al lui) confirmă la telefon o livrare care nu a existat. Clasicul „fresh air invoicing" care a doborât factori cu zeci de ani de experiență.
3. **Diluția** — specifică și severă în FMCG: retururi, rabaturi comerciale, discounturi promoționale, taxe de raft, compensări (retailerul deduce unilateral contribuții de marketing din plată). O factură de 100k „reală și neplătită" poate valora la încasare 85k fără nicio fraudă. Dacă avansați 90%+ pe nominal, pierdeți bani pe facturi perfect legitime.
4. **Deturnarea plății** — retailerul plătește corect, dar în contul distribuitorului, care „uită" să remită. La un distribuitor în stres de cash (adică exact clientul vostru), banii se evaporă în furnizori și salarii.
5. **Facturi între părți afiliate** — distribuitorul își facturează firma soră.
6. **Otrăvirea pipeline-ului AI** — dacă scoringul citește PDF-uri de facturi cu un LLM, un PDF cu instrucțiuni ascunse (text alb, metadata) poate manipula scorul. Vector nou, specific arhitecturii voastre, și genul de detaliu pe care un jurat de la Visa îl întreabă ca test.

**2.3. Problema oracolului, spusă fără menajamente.** În v1, entitatea care atestă on-chain că factura e reală, neplătită și nefinanțată sunteți voi. Dacă oracolul minte sau e corupt (un angajat mituit de un distribuitor, un fondator sub presiune de volum înainte de un fundraise), pool-ul finanțează hârtie și nicio proprietate criptografică nu ajută. Întrebarea jurатului decurge natural: *„dacă tot sunteți voi sursa de adevăr, la ce folosește blockchain-ul?"* Răspunsul onest — și singurul care ține — e că blockchain-ul e rail-ul de decontare, de fracționare a capitalului și jurnalul de audit imuabil al deciziilor, **nu** sursa de adevăr despre facturi. Sursa de adevăr e stiva legal-operațională de mai jos. Orice pitch care pretinde altceva se demontează la prima întrebare tehnică.

**2.4. Atuul nefolosit: statul a construit deja jumătate din infrastructura de verificare.** Serbia are SEF (Sistem eFaktura) — e-invoicing B2B obligatoriu, de stat, cu API, din ianuarie 2023. România are RO e-Factura (ANAF), obligatorie B2B din iulie 2024. O factură B2B care nu există în SEF/e-Factura *nu există legal*. Arhitectura din CONTEXT.md nu menționează niciuna. Asta e simultan cea mai gravă omisiune și cea mai mare oportunitate: verificarea existenței și statutului facturii direct la sursa de stat e un avantaj structural pe care factorii din vest nu-l au. (Atenție la limite: SEF confirmă existența, acceptarea de către cumpărător și statutul fiscal al facturii — nu confirmă că nu a fost cesionată și nu vede diluția viitoare.) BiH: abia din 2026 există legea de fiscalizare în Federație, cu e-invoicing B2B obligatoriu abia prin ~2029 — încă un motiv pentru care BiH nu e piață de lansare.

### (b) Reparații concrete

Pipeline-ul de verificare, în ordinea în care blochează frauda:
1. **Integrare SEF (Serbia) / e-Factura ANAF (România) la originare** — factura se trage direct din API-ul de stat, nu se acceptă PDF-uri de la distribuitor. Verifici: existență, emitent, cumpărător, sumă, status de acceptare. Pentru Demo Day, o integrare SEF în sandbox e mai impresionantă decât orice mint de token.
2. **Confirmarea debitorului ca precondiție de finanțare (no confirmation, no funding):** retailerul e notificat de cesiune și confirmă factura + angajamentul de plată către noul cont. Contactul retailerului se obține *independent* (registrul comerțului, relația directă a lui Vladislav), niciodată de la distribuitor — asta ucide vectorul „complice la telefon".
3. **Cont colector dedicat:** plata retailerului merge într-un cont bancar controlat de SPV, nu al distribuitorului. Notificarea de cesiune schimbă IBAN-ul de plată. Asta ucide deturnarea plății și e practica standard a oricărui factor serios.
4. **Perfectarea legală, sistematic:** România — înscriere RNPM la fiecare cesiune, plus interogare RNPM înainte de finanțare (dubla finanțare devine vizibilă). Serbia — notificare formală a debitorului cu dată certă + verificarea registrului de gaj de la APR + declarație pe proprie răspundere a distribuitorului cu răspundere penală.
5. **Avans 75–80% cu holdback pentru diluție:** restul se eliberează la încasarea integrală. Calibrați holdback-ul pe istoricul de retururi/rabaturi al perechii distribuitor-retailer.
6. **Analitică anti-fraudă simplă înainte de orice AI sofisticat:** velocitate anormală de facturare per distribuitor, sume rotunde, retaileri noi apăruți brusc, facturi chiar sub praguri de aprobare, grafuri de afiliere între emitent și plătitor.
7. **Dual control uman** pe fiecare atestare on-chain peste un prag, log imuabil al deciziilor de underwriting (aici chiar ajută chain-ul), reconciliere lunară cont colector ↔ stare on-chain, publicată LP-ilor.

### (c) Cea mai grea întrebare a juriului (Visa)

> „Ce mă împiedică, concret, ca distribuitor, să vând aceeași factură vouă luni și lui Instant Factoring miercuri? Arătați-mi pasul exact — legal, nu criptografic — care vă dă prioritate asupra creanței, și spuneți-mi dacă l-ați testat măcar o dată pe o factură reală."

**Răspuns solid:** „Criptografic, nimic — și oricine vă spune altceva despre RWA vă minte. Prioritatea noastră e legală: în România ne înscriem în RNPM înainte de a elibera fondurile și interogăm registrul la originare — o cesiune anterioară e vizibilă, a noastră devine opozabilă. În Serbia, finanțarea se eliberează doar după notificarea cu dată certă a retailerului și confirmarea lui că plătește în contul nostru colector — debitorul notificat primul plătește valabil doar factorului notificat; banii curg către noi structural. Plus verificarea facturii direct în SEF, la sursă. Am rulat acest flux cap-coadă pe [N] facturi pilot cu [distribuitorul cu LOI]." — Ultimul rând e cel care contează: **testați fluxul pe măcar o factură reală înainte de august.**

---

## Secțiunea 3 — Risc de reglementare

### (a) Slăbiciuni de design și moduri de eșec

**3.1. Trei jurisdicții = trei regimuri incompatibile, zero pașaportare.** Serbia nu e în UE: MiCA nu se aplică, se aplică Legea sârbă a activelor digitale (ZDI, în vigoare din iunie 2021) + Legea factoringului. România e în UE: MiCA + MiFID II + regimul IFN + ASF/BNR. BiH: fără cadru federal pentru active digitale, două entități cu reguli diferite, e-invoicing abia se naște. Nu există niciun mecanism prin care conformarea într-una din ele să conteze în celelalte. „Balcanii" nu sunt o piață reglementară; sunt trei. Planul realist: Serbia întâi, România a doua, BiH deloc în primii 2 ani.

**3.2. Capcana MiCA: nu MiCA e problema voastră.** Tokenul de pool — deținere fracționată care dă drept la randament dintr-un portofoliu administrat de altcineva — arată ca un instrument financiar (unitate de fond / titlu de creanță), iar instrumentele financiare sunt *excluse* din MiCA și intră sub MiFID II + Regulamentul de prospect + AIFMD. „Suntem MiCA-compliant" e un răspuns care sună bine și e greșit: dacă tokenul e security, MiCA nici măcar nu se aplică, și tocmai ați spus juriului că nu v-ați dat seama. Separat, pool-ul însuși — capital de la mai mulți investitori, politică de investiții definită, beneficiu comun — bifează definiția de AIF (fond alternativ de investiții) din AIFMD, transpusă în România prin Legea 74/2015. Administrarea unui AIF fără înregistrare e infracțiune reglementară, nu detaliu.

**3.3. Factoringul e activitate licențiată în ambele piețe de lansare.** Serbia: licență (acum de la Comisia de Valori Mobiliare, după amendamentele în vigoare din 12 decembrie 2025), capital minim 40M RSD, entitate locală. România: factoringul e creditare — bănci sau IFN-uri înscrise în registrele BNR (Legea 93/2009), cu propriile cerințe de capital și guvernanță. Un protocol care finanțează direct facturi fără această infrastructură face factoring nelicențiat, indiferent câte smart contracts are deasupra. Și un detaliu care taie și ultimul scurtcircuit: legea valutară sârbă cere ca plățile domestice între rezidenți să se facă în dinari — deci nici măcar avansul nu poate curge legal ca USDC direct în portofelul distribuitorului; e nevoie de conversie printr-un furnizor licențiat și plată bancară în RSD.

**3.4. Vestea bună, la fel de importantă: Serbia e neobișnuit de prietenoasă dacă o iei pe ușa din față.** ZDI e o lege funcțională, cu regim de white paper aprobat de Comisia de Valori Mobiliare (zece white paper-uri deja aprobate, trend crescător), care permite explicit emisiunea de tokeni digitali pentru finanțare. Iar din decembrie 2025, *același regulator* supraveghează și factoringul și tokenii digitali — puteți fi primul proiect care folosește ambele regimuri coerent, cu un singur interlocutor instituțional. Pentru un juriu, „am fost la SSC și știm exact ce aprobare ne trebuie" valorează mai mult decât orice slide despre TPS-ul Solanei.

**3.5. AML/KYC și restul cozii.** Onboarding de LP-i globali în pool = obligații AML/CFT (KYC pe finanțatori, travel rule, în Serbia regim DASP sub ZDI; în România, CASP sub MiCA dacă atingeți servicii de crypto-active). Plus GDPR/legea sârbă a datelor pe datele din facturi. Niciuna nu e fatală; toate costă timp și trebuie să apară în plan, altfel juriul le va număra el.

### (b) Reparații concrete — structura care reduce riscul

1. **Nu cereți licență de factoring proprie în anul 1 — parteneriați sau achiziționați.** Un factor licențiat sârb existent (sau un aranjament de fronting cu unul) face originarea și colectarea; protocolul vostru e stratul de capital și tehnologie. Capitalul de 340k EUR + 6–12 luni de licențiere nu sunt pentru faza seed. Alternativ, discutați cu SSC un timeline de licențiere — dar nu înainte de Demo Day.
2. **Structura pe trei etaje, standard și explicabilă în 30 de secunde:** (i) OpCo tech (România sau Serbia) — dezvoltă protocolul, ia fee de tehnologie; (ii) Factor licențiat / SPV sârb — cumpără creanțele, titular legal al cesiunilor, cont colector; (iii) vehicul de emisiune — emite tokenul de pool ca instrument (obligațiune / participare / token digital sub ZDI) garantat cu portofoliul SPV-ului.
3. **Pool doar pentru investitori profesioniști/calificați în anii 1–2.** Plasament privat = ieșiți de sub obligația de prospect și de sub marketingul retail AIFMD; sub-pragul AIFMD (sub 100M EUR) cere doar înregistrare, nu autorizare completă. Retail-ul on-chain global e exact ce vă omoară regulatorii — renunțați la el până aveți licențe.
4. **În Serbia, folosiți ZDI ofensiv:** white paper aprobat de SSC pentru tokenul de pool = singura cale prin care „tokenizarea" voastră devine un fapt juridic, nu o metaforă. Și e un diferențiator de pitch: primul RWA de facturi cu white paper aprobat în Serbia.
5. **Avans în RSD prin bancă, capital în stablecoin doar la nivelul pool-ului.** Conversia EURC↔RSD printr-un partener licențiat (bancă sau DASP), niciodată stablecoin direct către distribuitor.
6. **Două memo-uri juridice înainte de Demo Day** — Belgrad (factoring + ZDI + valutar) și București (MiCA/MiFID/AIFMD + IFN + RNPM). Chiar și preliminare, 10–15 pagini. Costul e mic; a le avea în data room schimbă categoria în care vă pune juriul.
7. **BiH: declarați-o explicit „faza 3, după cadru"** — arată disciplină, nu slăbiciune.

### (c) Cea mai grea întrebare a juriului (Raiffeisen/regulator)

> „Sub a cui licență de factoring cumpărați prima factură în Serbia, în ziua 1? Și tokenul vostru de pool — e activ digital sub legea sârbă, instrument financiar sub MiFID, sau unitate de AIF? Dacă mâine vă sună Comisia de Valori Mobiliare și BNR în aceeași zi, care e răspunsul — și există un aviz scris care îl susține?"

**Răspuns solid:** „Originarea se face prin [factorul licențiat partener / SPV-ul nostru licențiat], sub Legea factoringului, sub supravegherea SSC — care, din decembrie 2025, e și regulatorul tokenilor digitali, deci avem un singur interlocutor. Tokenul de pool e structurat ca [token digital cu white paper aprobat de SSC / titlu de creanță plasat privat], oferit exclusiv investitorilor profesioniști — sub pragul AIFMD, cu înregistrare, fără ofertă retail. Avem memo-uri de la [firmă Belgrad] și [firmă București] în data room, și am avut o întâlnire preliminară cu SSC în [luna]." — Fiecare paranteză pătrată e o decizie de luat în iulie, nu în august.

---

## Secțiunea 4 — Risc de model în scoring-ul AI

### (a) Slăbiciuni de design și moduri de eșec

**4.1. Spus fără anestezie: ce e descris în arhitectură nu e un motor de scoring de credit.** Qwen2.5-Coder e un model de *generare de cod*. ChromaDB e un vector store pentru RAG. n8n e orchestrare de workflow-uri. Niciuna dintre aceste componente nu produce o probabilitate de default calibrată. Un LLM întrebat „ce risc are factura asta?" produce un text plauzibil, nedeterminist (același input poate da alt scor mâine), necalibrat (nu există nicio relație verificabilă între „scor 7/10" și o frecvență reală de default), nefalsificabil și manipulabil prin conținutul documentelor pe care le citește (prompt injection — vezi 2.2.6). Pentru un jurat de la Visa care a văzut modele de risc reale, „LLM + RAG = credit scoring" e un dealbreaker de credibilitate — nu pentru că AI-ul n-ar avea loc aici, ci pentru că semnalează că echipa nu știe diferența dintre un model de limbaj și un model de risc.

**4.2. Cold-start-ul e mai adânc decât pare.** Nu aveți istoric de rambursare — dar problema reală e că *nici nu puteți învăța repede*: la 20–50 de facturi în primele luni și o rată de default de câteva procente, veți vedea statistic 0–2 default-uri în primul an. Orice model antrenat sau „ajustat" pe asta e zgomot cu interfață. Corolarul periculos: un model care n-a văzut niciun default va prezice cu încredere că nimic nu intră în default — și va avea dreptate aparent, până la primul eveniment corelat (vezi 1.2), când va greși pe tot portofoliul simultan. Încrederea modelului crește exact când riscul acumulat crește.

**4.3. Scorați entitatea greșită.** Riscul primar al unei facturi de factoring e *plătitorul* (retailerul), nu emitentul. Arhitectura vorbește despre „istoric distribuitor" — dar distribuitorul contează mai ales pentru fraudă și diluție, în timp ce banii vin sau nu vin de la retailer. Vestea bună: pe retaileri există date publice reale — situațiile financiare sunt publice la APR în Serbia și la Ministerul de Finanțe/ANAF în România, există birouri de credit, liste de datornici fiscali, iar Vladislav are 20 de ani de cunoaștere a comportamentului de plată al lanțurilor din regiune. Un scoring sobru al plătitorilor pe date publice bate orice LLM pe date inexistente.

**4.4. Automation bias + conflictul din 1.5(ii).** Un scor numeric pe un dashboard va fi tratat ca adevăr de oameni sub presiune de volum, mai ales când echipa care rulează modelul e aceeași care vrea deal-ul închis. Fără un mecanism care forțează dezacordul (comitet, veto, praguri), modelul devine ștampila care legitimează decizia deja luată.

**4.5. Nota de reglementare AI:** scoringul B2B pe persoane juridice nu e per se „high-risk" sub EU AI Act (Anexa III vizează creditworthiness pentru *persoane fizice*), dar dacă printre distribuitori/debitori apar PFA-uri sau *preduzetnik*-i (persoane fizice autorizate — frecvente în FMCG-ul balcanic mic), intrați în zona high-risk cu obligații de management de risc, documentație și supraveghere umană, aplicabile fix din august 2026 — luna Demo Day-ului. Merită o notă de subsol în pitch, nu o improvizație la Q&A.

### (b) Reparații concrete

1. **V1 = motor de reguli determinist + limite hard + semnătură umană. AI-ul nu decide credit în anul 1. Punct.** Regulile: plătitor pe whitelist (top lanțuri, scorate manual pe financiare publice), vechime distribuitor ≥3 ani, tenor ≤90 zile, avans ≤80%, plafoane de concentrare din 1(b)4, regres obligatoriu, zero facturi între afiliați. Fiecare finanțare peste un prag: aprobare de comitet (doi din trei: Stefan, Finance Lead, advisor).
2. **Repoziționați AI-ul acolo unde chiar ajută azi: document intelligence, nu credit decision.** Extracție automată din facturi/contracte, reconciliere SEF, detecție de anomalii (velocitate, sume, grafuri de afiliere), monitorizare de știri/registre pe plătitori. Asta e o poveste AI onestă, demonstrabilă în demo, și nimeni n-o poate ataca. Pitch-ul devine: *„underwriting bazat pe reguli + date de stat, cu AI pe operațiuni; modelul statistic de PD se antrenează pe outcome-urile noastre reale și preia treptat, cu validare"*. Scoateți cu totul framing-ul „AI scoring în timp real" din materiale — e singura afirmație din pitch care poate fi *demonstrată falsă pe loc*.
3. **PD floor conservator, hardcodat:** până la minimum 12 luni și N≥200 de facturi încheiate, nicio pereche distribuitor-retailer nu primește o pierdere așteptată sub 2–3% anual, indiferent ce spune orice model. Prețul și avansul se calculează de la acest floor în sus.
4. **Shadow mode:** dacă vreți ML (regresie logistică / gradient boosting pe feature-uri structurate — interpretabile și calibrabile, nu LLM), rulați-l în paralel 6–12 luni, comparați predicțiile cu outcome-urile, publicați calibrarea LP-ilor. Abia apoi îi dați greutate în decizie.
5. **Circuit breaker on-chain — cea mai bună fuziune a celor două lumi:** dacă delincvența la 30 de zile depășește X% din pool sau două facturi ale aceluiași plătitor întârzie, originarea nouă se oprește *automat, în contract*, până la deblocare de guvernanță. Un kill-switch pe care nici echipa nu-l poate ocoli e un argument de încredere pe care factoringul clasic nu-l poate replica — folosiți-l în pitch.
6. **Igienă minimă de model governance de la zi 0:** versionarea regulilor și a oricărui model, log imuabil al deciziilor și override-urilor (on-chain — încă o utilizare legitimă a chain-ului), backtest trimestrial, raport de calibrare către LP-i.
7. **Sanitizați pipeline-ul de documente:** extracția LLM rulează pe text extras și normalizat, nu pe PDF-uri brute; output-ul e strict structurat (JSON cu schemă); nicio ieșire de LLM nu atinge direct o decizie de finanțare.

### (c) Cea mai grea întrebare a juriului (Visa)

> „Modelul vostru n-a văzut în viața lui un default real. Care e calibrarea probabilităților lui de default, pe ce ați validat-o, și — dacă modelul greșește sistematic în primele șase luni — ce mecanism *care nu depinde de voi* oprește pierderile înainte să ajungă la 20% din pool?"

**Răspuns solid:** „Nu avem calibrare pe date proprii și de aceea modelul nu decide: anul 1 e underwriting pe reguli — plătitori whitelisted scorați pe financiare publice, avans max 80%, regres, plafoane de concentrare în smart contract. AI-ul face extracție de documente și detecție de anomalii, nu credit. Pierderea așteptată e podită la 3% indiferent de model, și prețuim de la acel pod în sus. Iar mecanismul independent de noi există: un circuit breaker în contract oprește automat originarea la [X]% delincvență 30d — nici noi nu-l putem ocoli. Modelul statistic rulează în shadow mode și primește greutate doar după 12 luni de calibrare publicată LP-ilor." — Acest răspuns transformă cea mai slabă axă a voastră într-o demonstrație de maturitate. Dar cere să fi renunțat, sincer, la „AI-ul scorează riscul în timp real".

---

## Priorități pre-Demo Day (iulie → august 2026)

1. **Săptămâna 1–2:** Rescrierea pitch-ului AI (4b.2) — singura gaură care explodează *în timpul* prezentării. Decizia de structură juridică (parteneriat cu factor licențiat vs SPV propriu) și primele apeluri către 2 firme de avocatură (Belgrad + București) pentru memo-uri preliminare.
2. **Săptămâna 2–4:** Modelul economic pe cifre (1a.3) cu stress-testul „retailerul mare plătește la 120 de zile" — un singur one-pager, dar cu numere reale. Redesign pool: epoci, tranșe, first-loss, circuit breaker — în specificația MVP-ului, ca Octav să le construiască de la început, nu retrofit.
3. **Săptămâna 4–6:** Integrare SEF în sandbox pentru demo — acesta e demo-ul care câștigă track-ul RWA, nu mint-ul de token. LOI-ul cu distribuitorul să includă explicit consimțământul pentru notificarea retailerului și contul colector — și, ideal, **o factură reală trecută prin tot fluxul**.
4. **Continuu:** un advisor cu experiență de risc de credit/factoring în regiune. Schimbă percepția juriului asupra întregii echipe.

---

## Surse principale

- [Serbia — Requirements for Conducting Factoring (capital minim 40M RSD, licență)](https://djordjevic-lawyer.co.rs/en/requirements-for-conducting-factoring/)
- [Serbia — New Regulatory Framework for Factoring: transferul supravegherii către Comisia de Valori Mobiliare, în vigoare 12 dec 2025 (Injac Attorneys)](https://injac.rs/new-regulatory-framework-for-factoring-in-serbia-key-changes-and-practical-effects/)
- [Serbia — Law on Digital Assets (text oficial, NBS)](https://www.nbs.rs/export/sites/NBS_site/documents-eng/propisi/zakoni/digitalna_imovina_e.pdf) și [pagina SSC](https://www.sec.gov.rs/index.php/en/regulations/legislation/laws/7335-law-on-digital-assets)
- [Serbia — Blockchain & Cryptocurrency Laws & Regulations 2026 (Global Legal Insights)](https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/serbia/)
- [România — Legea 93/2009 privind IFN-urile (Portal Legislativ)](https://legislatie.just.ro/Public/DetaliiDocument/181855)
- [România — Opozabilitatea cesiunii de creanță față de terți / RNPM (MF, studiu)](https://mfinante.gov.ro/documents/35673/250470/articol_nr1_2019.pdf)
- [BiH — Fiscalization law FBiH, e-invoicing B2B obligatoriu ~2029 (Fiscal Solutions)](https://www.fiscal-requirements.com/news/5321) și [EDICOM](https://edicomgroup.com/blog/bosnia-herzegovina-electronic-invoice-ereporting)
- [Serbia — Factoring: situația curentă (Foreign Investors Council, 2024)](https://fic.org.rs/wp-content/uploads/2024/11/29-Factoring-1.pdf)

*Precedentele DeFi citate (Maple/Orthogonal 2022, Goldfinch 2023) sunt fapte de piață publice, verificabile în presa de specialitate.*
