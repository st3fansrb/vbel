# Red Team — Runda 2: Auditul advers al reparațiilor

> **[Notă de pivot, 22 iulie 2026]** Concluziile acestui audit (execuție zero pe reparațiile juridice/economice, contradicții reale între documente, cifra de randament nu ține) au cântărit direct în decizia de a pivota planul de Demo Day pe FMCG Receivables Passport, care evită majoritatea problemelor identificate aici prin arhitectură mai simplă. Vezi `SOLANA-SUMMIT-BRIEF.md` și `VARIANTE-DEMO-DAY.md` pentru planul curent. Documentul rămâne valid ca analiză pentru faza 2+.

*Nu e un red-team nou pe protocol. E un audit al celor patru documente de reparație (AI-STORY-HONEST.md, LEGAL-STRUCTURE.md, POOL-ECONOMICS.md, VERIFICATION-FLOW.md) față de cele 4 probleme din DUE-DILIGENCE-ADVERS.md. Documentele de reparație sunt tratate ca afirmații de testat, nu ca adevăr. Data: 2 iulie 2026.*

**Metoda, per problemă:** (1) închidere reală vs. aparentă — și, dacă problema doar s-a mutat, unde s-a mutat și cine o plătește acum; (2) contradicții introduse de reparație; (3) optimism strecurat — fiecare loc unde soluția depinde de ceva neverificat; (4) întrebarea dură a juriului, reevaluată după reparație. Verdictele și lista de contradicții inter-documente sunt la final.

**Concluzia pe scurt, înainte de detalii:** o singură reparație e *executată* efectiv (AI — retractarea e făcută, CONTEXT.md chiar a fost rescris). Celelalte trei sunt planuri corecte, nu închideri. Iar reparațiile au introdus contradicții de fond între ele: costul partenerului licențiat (soluția problemei #1) lipsește complet din modelul economic (soluția problemei #3), pipeline-ul anti-fraudă (soluția problemei #2) rupe argumentul de vânzare „viteza" pe care se sprijină răspunsul la selecția adversă, iar cifra-titlu a pool-ului — senior ~9–10%, ~600bp peste risk-free — **nu supraviețuiește propriei structuri**, chiar înainte de orice presupunere ostilă.

---

## Problema #1 — „Tokenul nu e creanța + factoring nelicențiat" → LEGAL-STRUCTURE.md

### 1a. Închidere reală vs. aparentă

Documentul face două lucruri corect: alege exact calea prescrisă de raport (Cale A — fronting cu factor licențiat) și e onest că e un cadru de decizie, nu un aviz. Dar trebuie spus fără menajamente ce NU face: **nu schimbă cu nimic statutul juridic al operațiunii de azi.** Raportul a spus „fatal dacă nu e rezolvat". La data acestui audit:

- **Partenerul licențiat nu există.** Nu e identificat, nu e contactat — documentul însuși recunoaște că întrebarea către Vladislav „pleacă săptămâna asta", adică n-a plecat. Toată Cale A atârnă de o ușă neîncercată.
- **Memo-urile juridice nu sunt comandate.** Întâlnirea cu SSC nu e solicitată. Fiecare element pe care raportul l-a cerut „în data room" e încă în stadiul de checklist.
- **Mecanica Căii A e desenată, nu rezolvată.** Diagrama spune că vehiculul de emisiune e „garantat cu portofoliul SPV-ului" — dar în Cale A portofoliul stă pe bilanțul *partenerului*, o entitate terță. Cum obține vehiculul vostru de emisiune o garanție reală pe portofoliul altcuiva? Cesiune în doi pași (partenerul originează, apoi cedează SPV-ului)? Atunci SPV-ul care *cumpără* creanțe de la factor are el însuși nevoie de licență? Gaj pe portofoliu? Fiecare variantă e o structură diferită, cu costuri diferite — și briefingul pentru avocați atinge doar tangențial problema (Q1 Belgrad), iar **tranșarea senior/junior nu apare deloc** în niciunul dintre cele două briefinguri, deși un pool tranșat cu first-loss arată și mai mult a securitizare/AIF, nu mai puțin.
- **Întrebarea comercială nepusă:** de ce ar accepta un factor licențiat sârb să-și pună licența la dispoziția unui protocol care declară explicit (Cale B, „post-seed") că intenționează să devină concurentul lui? Fronting-ul are un preț — și prețul ăsta nu apare nicăieri (vezi contradicția C1).

**Unde s-a mutat problema:** din „nu știm că e ilegal" (închis — acum știți) în „legalitatea depinde de rețeaua lui Vladislav + de apetitul unui partener necunoscut + de doi avocați necontactați". **Cine plătește dacă Cale A eșuează:** timeline-ul. Cale B = 340k EUR + 6–12 luni de licențiere = moartea narativei de Demo Day. Nu există Cale C în document.

### 1b. Contradicții introduse

Vezi C1, C3, C4 în lista finală — toate au originea aici: reparația legală a creat o entitate intermediară (partenerul) ale cărei costuri și consecințe operaționale nu au fost propagate în celelalte documente.

### 1c. Optimism strecurat — promisiuni, nu rezolvări

| Presupunerea | Statut real |
|---|---|
| Există un factor sârb dispus la fronting | NEVERIFICAT — întrebarea n-a fost pusă nimănui |
| Memo-urile vor confirma structura | Memo-urile nu sunt comandate |
| White paper ZDI e fezabil pentru *acest* token (tranșat, garantat cu portofoliul unui terț) | NEVERIFICAT — cele 10 white paper-uri aprobate nu sunt precedent pentru o structură de acest tip |
| Sub pragul AIFMD → „doar înregistrare" | Formularea presupune un AIFM din UE. Dacă vehiculul de emisiune e sârb (non-UE) și marketați către profesioniști din UE, regimul e plasamentul privat național (NPPR), stat cu stat — care în unele state e restrictiv. Exact genul de nuanță pe care memo-ul de la București trebuie s-o tranșeze; până atunci, „doar înregistrare" e o speranță, nu un fapt |
| Conversia EURC↔RSD are furnizor licențiat | Marcată onest ca întrebare deschisă în §5 — dar POOL-ECONOMICS o tratează deja ca rezolvată la cost de 0,7% (vezi #3) |

### 1d. Întrebarea juriului, acum

Întrebarea originală („Sub a cui licență cumpărați prima factură în ziua 1?") **stă în picioare aproape intactă.** Răspunsul adevărat, azi: „Nu știm încă — depinde dacă Vladislav găsește un factor dispus la fronting, și n-am sunat încă avocații." Versiunea actualizată, mai dură:

> „Numiți factorul partener. Ce parte din marjă ia el și unde apare asta în modelul vostru economic? Și de ce ar accepta un factor licențiat să front-eze pentru un protocol care își declară în scris intenția de a-l concura după seed?"

---

## Problema #2 — „Dubla finanțare și frauda pe factură" → VERIFICATION-FLOW.md

### 2a. Închidere reală vs. aparentă

Pipeline-ul în 7 pași e transcrierea aproape verbatim a reparațiilor din §2b al raportului. Designul e corect *prin construcție* — e al raportului — deci întrebarea de audit nu e „e bun designul?", ci „e reparația mai mult decât o transcriere?". Răspuns: doar parțial.

**Ce e real:** poziționarea onestă a blockchain-ului (§0) e o închidere autentică a problemei oracolului *la nivel de pitch* — nimeni nu mai poate demonta povestea la prima întrebare tehnică. Sanitizarea pipeline-ului AI (text normalizat, JSON cu schemă, nicio ieșire LLM în decizie) închide curat vectorul 6.

**Ce e overclaim:** tabelul din §1 spune că perfectarea legală „ucide dubla finanțare". **Pentru România, da** — RNPM e un registru real: interogare + înscriere = dubla finanțare devine vizibilă și opozabilitatea e a voastră. **Pentru Serbia — piața 1 — nu.** Documentul însuși admite (§3) că SEF nu arată cesiunile și că Serbia nu are registru central. Deci în Serbia nu poți *verifica* dacă factura a fost deja cesionată; poți doar să notifici primul și să speri că retailerul îți spune adevărul la confirmare. Asta înseamnă că vectorul 1 (dubla finanțare) și vectorul 2 (debitor complice) **se prăbușesc unul în altul**: apărarea comună, în Serbia, e onestitatea retailerului + descurajarea penală + regresul. E o apărare rezonabilă — dar e o *cursă de notificare cu asigurare prin regres*, nu o „ucidere". Formularea onestă pentru juriu: „în România o blocăm prin registru; în Serbia câștigăm prioritatea prin notificare primul și purtăm riscul rezidual pe regres și garanții". Dacă spuneți „o ucidem" și juratul Visa știe că Serbia n-are registru, ați pierdut exact credibilitatea pe care §0 o construise.

**Problema oracolului, rezidual:** atestarea on-chain acoperă trei afirmații — „reală" (SEF o acoperă), „neplătită" (parțial), „**nefinanțată**" (în Serbia: nimeni în afară de voi). Dual control = doi oameni din aceeași echipă de fondatori; scenariul explicit al raportului — „un fondator sub presiune de volum înainte de fundraise" — nu e închis de dual control intern. Mitigat, nu eliminat; documentul ar trebui s-o spună.

**Unde s-a mutat problema:** din criptografie (abandonată corect) în (a) API-urile statului — acces nedemonstrat, (b) cooperarea retailerilor — nedemonstrată, (c) operațiunile partenerului din Cale A (contul colector e al lui, nu al vostru). **Cine plătește:** viteza de onboarding și linia de OpEx — adică problema #3 (vezi C2).

### 2b. Contradicții introduse

C2 (viteza vs. verificare) și C6 (Vladislav ca sursă „independentă") — în lista finală.

### 2c. Optimism strecurat

- **„Integrare SEF în sandbox"** — piesa centrală a demo-ului — presupune că un terț (voi, care nu sunteți parte în factură) poate accesa API-ul SEF. Realist, accesul se face cu credențialele contribuabilului, adică *prin distribuitor* — ceea ce nu invalidează datele (conținutul SEF rămâne al statului), dar nuanțează framing-ul „independent de distribuitor" și, mai important, **nimeni n-a confirmat că accesul sandbox e obtenabil pentru voi, în ce condiții, și în cât timp**. Tot demo-ul care „câștigă track-ul RWA" stă pe această verificare nefăcută.
- **Cooperarea retailerilor.** „No confirmation, no funding" presupune că lanțurile mari răspund la notificări de cesiune și acceptă redirectarea plății către contul unui factor nou. Marii retaileri sunt notoriu de lenți la asta — și contractele de furnizare FMCG conțin frecvent **clauze anti-cesiune** (interzicerea cesiunii fără acordul cumpărătorului). Niciun document nu verifică dacă lanțurile din whitelist au asemenea clauze. Dacă au, mecanismul central al reparației e blocat exact la plătitorii pe care vă bazați.
- **„Am rulat acest flux pe [N] facturi pilot cu [distribuitorul cu LOI]"** — azi, N=0 și LOI-ul nu există (e încă pe roadmap în CONTEXT.md). Răspunsul-script nu poate fi rostit fără a minți. Ambele paranteze sunt chiar partea grea.

### 2d. Întrebarea juriului, acum

Prima parte a întrebării Visa are acum un răspuns bun pe hârtie. **Ultima clauză stă intactă: „l-ați testat măcar o dată pe o factură reală?" — Nu.** Versiunea actualizată:

> „Pipeline-ul pe hârtie e corect — e pipeline-ul oricărui factor serios. Aveți acces funcțional la API-ul SEF? Ați notificat vreodată un retailer și v-a confirmat? Și câte zile durează, în practică, de la factura emisă la bani în cont — mai e «ore, nu săptămâni»?"

---

## Problema #3 — „Economia pool-ului nu închide" → POOL-ECONOMICS.md

Raportul a descompus problema în trei: mismatch de lichiditate, selecție adversă, FX. Reparația le tratează inegal.

### 3a. Închidere reală vs. aparentă, pe sub-probleme

**(i) Mismatch de lichiditate — design închis pe hârtie.** Epoci + buffer + provizionare automată + tranșare e exact arhitectura cerută, și e specificată pentru MVP (§6), nu doar narativ. Cea mai reală parte a reparației. Rezervă: nimic nu e construit încă, iar buffer-ul introduce o gaură de aritmetică (mai jos).

**(ii) Selecția adversă — NU e închisă; e posibil agravată.** Prețuirea onestă la 16% + regres + garanție personală a acționarului + avans max 80% + notificarea retailerului tău face produsul **mai scump și mai oneros** decât Instant Factoring sau banca, pentru orice distribuitor care are acces la ele. Deci filtrul de auto-selecție împinge spre voi și mai apăsat exact clienții refuzați în altă parte. Contra-argumentul documentului — „viteza și accesul" — e contrazis frontal de propriul pipeline anti-fraudă (C2): prima finanțare a unei perechi distribuitor-retailer, cu notificare cu dată certă, confirmare de debitor și cont colector, nu durează ore. Distincția care ar salva argumentul (onboarding lent *o singură dată* per pereche, apoi facturi repetate rapid) nu e făcută nicăieri. Și nimeni n-a testat că vreun distribuitor real acceptă acești termeni — e un parametru marcat corect în §7 ca „de măsurat", dar până atunci răspunsul la selecția adversă e un narativ, exact ce raportul a interzis.

**(iii) FX — închisă direcțional, condiționată.** EURC e mutarea corectă. Dar coridorul EURC↔RSD nu are furnizor identificat (LEGAL-STRUCTURE §5 o recunoaște ca întrebare deschisă), iar costul de 0,7% e un placeholder tratat ca linie fermă în cascadă. În plus: LP-ii crypto globali stau în USDC; un pool EURC adaugă fricțiune de intrare nemenționată.

### 3b. Aritmetica ce nu ține — verificată pe cifrele documentului

1. **Propriul calcul senior dă 8,8%, nu „9,0–10,0%".** Formula scrisă în §2: (9,8% − 15,5% × 15%) / 85% = (9,8 − 2,325) / 0,85 = **8,79%**. Documentul își supraevaluează propria formulă cu 0,2–1,2pp.
2. **Cash drag-ul buffer-ului nu e nicăieri.** Pool-ul de 1M ține 20% (200k) lichid. Cascada de 9,8% net se aplică însă întregului pool, ca și cum 100% ar fi desfășurat în facturi. Corectat: 80% × 9,8% = 7,84% blended (buffer la 0%), maxim ~8,6% dacă buffer-ul stă în risk-free. Senior devine **6,5–7,4%**. Spread-ul peste risk-free EUR (3,5–4%): **~250–390bp, nu ~600bp.** Jumătate din cifra-titlu a dispărut fără nicio presupunere ostilă — doar aplicând structura documentului asupra cascadei lui.
3. **Marja partenerului licențiat: zero linii.** LEGAL-STRUCTURE numește explicit „împărțirea de marjă" drept costul Căii A. Cascada are OpEx 1,5% (care trebuie să acopere originare, colectare, perfectare legală ȘI tech) — un factor licențiat care originează, colectează și își pune licența și bilanțul la dispoziție nu va lucra pentru o felie din 1,5%. Fiecare 1% de marjă a partenerului pe capitalul desfășurat mai taie ~0,9pp din senior. La o marjă realistă de partener, senior-ul coboară spre 5–6%.
4. **PD „floor" de 3% e optimism rebranduit.** Raportul a spus: „2–4% anual e o presupunere *optimistă*". Reparația ia mijlocul intervalului numit optimist și îl botează „podea prudentă". Regresul și whitelist-ul chiar reduc EL față de creditare negarantată — dar asta e un argument de făcut explicit, nu o relabelare. Dacă EL real e 4–5% (plauzibil pentru flux advers-selectat, la un factor nou), senior-ul — deja la 5–7% după punctele 2–3 — coboară sub T-bills.
5. **Cei 150k de first-loss nu au sursă.** „Banii echipei + angel-i": echipa e doi studenți și un BD; nu există niciun angajament scris de la vreun angel. Răspunsul de aliniere („skin in the game de 15%") — singurul răspuns credibil la întrebarea despre stimulente, per raport — e **nefinanțat**. Dacă junior-ul nu se umple, ori lansați fără first-loss (și răspunsul de aliniere moare), ori senior-ul ia primele pierderi (și tot pitch-ul §2 moare).
6. **Conflatarea buffer–pierderi în script.** Răspunsul-script pentru Raiffeisen spune că buffer-ul de 20% „acoperă singur întreaga expunere pe orice retailer". Buffer-ul finanțează *retrageri*; pierderile le absoarbe junior-ul. A le amesteca în fața unui jurat bancar e o eroare nefortată — fix genul de confuzie lichiditate/solvabilitate pe care un bancher o taxează instant.
7. **Definițional:** plafonul de „20% din pool" pe un retailer = 25% din capitalul efectiv investit (800k), dacă buffer-ul face parte din pool. Nu e fatal, dar cineva o va observa.

**Unde s-a mutat problema:** riscul de run s-a mutat (corect și onest) din LP-i în randamentul LP — dar mai mult decât recunoaște documentul; plus în tranșa junior, care nu există; plus în distribuitor (prețul de 16%, netestat); plus în timp — lansarea e acum blocată de 150k nefinanțați + partener negăsit + feature-uri de contract nebuildate.

### 3c. Întrebarea juriului, acum

Jumătatea de mecanism a întrebării Raiffeisen are acum un răspuns arhitectural bun (epoci, tranșe, plafoane, provizionare — dacă ajung în contract). **Jumătatea de cifre s-a redeschis, mai rău:** cifra oferită nu ține la propria aritmetică. Versiunea actualizată:

> „Cei 150.000 de first-loss — ai cui bani sunt, concret, astăzi? Și după ce scazi buffer-ul care stă degeaba și marja factorului partener pe care nu l-ați numit — senior-ul vostru mai dă 9%, sau dă 6% pentru risc de credit balcanic pe o platformă fără istoric? La 6%, de ce n-aș sta în T-bills?"

---

## Problema #4 — „Motorul AI nu e un motor de credit scoring" → AI-STORY-HONEST.md

### 4a. Închidere reală vs. aparentă

**În esență, reală — și e singura reparație executată, nu doar promisă.** Problema din raport era o *afirmație falsificabilă în timpul prezentării*; retractarea elimină falsificabilitatea. Povestea de înlocuire (extracție, reconciliere SEF, anomalii, monitorizare, shadow mode cu prag pre-înregistrat) e demonstrabilă și coerentă cu ce știu componentele să facă. Verificabil: CONTEXT.md §1 și §7 chiar au fost rescrise conform Anexei — dovadă de execuție, nu de intenție. Pragul pre-înregistrat (12 luni ȘI N≥200) e onest până la a fi auto-penalizant (la volumele din raport, N≥200 înseamnă realist 18–24 de luni — de asumat public, nu de descoperit).

### 4b. Rezervele — unde reparația își strecoară propriul optimism

1. **Circuit breaker-ul e supravândut ca „independent de noi".** Trigger-ul e delincvența la 30 de zile — dar delincvența e o stare *off-chain* (plăți în conturi bancare, în Cale A ale partenerului), scrisă on-chain de un oracol care sunteți... voi. Un breaker alimentat de propriul oracol nu e „un mecanism care nu depinde de voi" — e disciplină automată pe date self-reported. Exact scenariul din §2.3 al raportului (fondatorul sub presiune întârzie marcarea delincvenței) îl dezarmează complet. Formularea apărabilă: „elimină discreția *odată ce datele sunt scrise*, iar scrierea e supusă dual control și reconciliere lunară publicată" — nu „nici noi nu-l putem ocoli". În forma actuală, răspunsul-script pentru Visa (§5) conține o afirmație nouă demontabilă la Q&A — adică recreează, la scară mică, exact tipul de problemă pe care documentul l-a reparat.
2. **Comitetul de credit conține un membru care nu și-a acceptat rolul.** „Doi din trei: Stefan, Finance Lead, advisor ex-Deloitte" — dar per CONTEXT.md, advisorul s-a angajat doar la o analiză de piață *înainte ca echipa să se angajeze pe direcție*. Un membru de comitet neconfirmat e un placeholder, nu guvernanță. Iar riscul transversal din raport — nicio persoană cu experiență reală de risc de credit/colectare — rămâne neatins de toate cele patru documente de reparație.
3. **Frazarea vetoului inversează controlul.** AI-STORY §3: „BD (Vladislav) e separat de comitetul de credit, cu veto pe fiecare finanțare" — se citește că *Vladislav* are veto. Raportul (§1b.7) dădea vetoul comitetului, cu BD separat. Aproape sigur eroare de redactare — dar dacă ajunge într-un material, ați documentat singuri conflictul de interese pe care voiați să-l eliminați.
4. **„Primul raport de calibrare, chiar dacă pe date sintetice" la Demo Day.** O curbă de calibrare pe date sintetice nu demonstrează nimic — e chiar argumentul vostru din §4 („zgomot cu interfață"). A o prezenta ca „raport de calibrare" invită exact atacul pe care reframing-ul l-a dezamorsat. Arătați arhitectura shadow mode; nu o „calibrare" goală.
5. **Demo-ul central moștenește dependența SEF** nedemonstrată din problema #2.

**Unde s-a mutat problema:** din pitch în execuție — povara diferențierii cade acum pe integrarea SEF + motorul de reguli + transparența on-chain, toate nebuildate (țintă: august). Și povestea pentru track-ul „AI & Agents" s-a subțiat prin retractare — de rezolvat prin poziționarea onestă pe operațiuni agentice, nu prin re-umflarea scoringului.

### 4c. Întrebarea juriului, acum

Întrebarea Visa e, în substanță, **răspunsă** — cu condiția ca materialele să fie efectiv curățate (CONTEXT.md este; restul materialelor de pitch trebuie verificate) și comitetul să fie real. Reziduul care rămâne atacabil:

> „Circuit breaker-ul vostru se declanșează pe date de delincvență. Cine scrie acele date on-chain? Deci e independent de voi... cum, exact?"

---

## Contradicții inter-documente

**C1. Marja partenerului: LEGAL-STRUCTURE ↔ POOL-ECONOMICS.** LEGAL-STRUCTURE numește „împărțirea de marjă" drept costul Căii A (calea recomandată). Cascada economică nu are nicio linie pentru ea. Cele două documente descriu economii diferite ale aceluiași business; nemodelat, costul cade pe senior LP sau pe fee-ul protocolului. Cea mai gravă contradicție din set, pentru că lovește simultan răspunsurile la #1 și #3.

**C2. „Ore, nu săptămâni" ↔ „no confirmation, no funding".** Argumentul anti-selecție-adversă (viteza) e rupt de pipeline-ul anti-fraudă (notificare cu dată certă + confirmare debitor + cont colector + comitet peste prag). Distincția salvatoare — onboarding lent o dată per pereche, facturi repetate rapide — nu e făcută în niciun document.

**C3. „În smart contract, nici noi nu-l putem ocoli" ↔ realitatea operațională a Căii A.** Plafoanele, breaker-ul și provizionarea trăiesc on-chain, dar originarea, plata în RSD prin bancă și colectarea trăiesc la partenerul licențiat, off-chain. On-chain-ul e o oglindă atestată de voi (și de partener). Enforcementul real e contractual, nu criptografic — afirmațiile de independență din AI-STORY §5 și POOL-ECONOMICS §5 depind de date furnizate chiar de părțile de care mecanismul ar trebui să fie independent.

**C4. Junior = „banii echipei + angel-i" ↔ „exclusiv investitori profesioniști/calificați".** Studenții din echipă nu sunt investitori calificați; tranșa junior nici nu apare în briefingurile pentru avocați. Structura de sponsor co-invest care ar împăca cele două afirmații nu e nici măcar pusă ca întrebare.

**C5. Comitetul ↔ CONTEXT.md.** AI-STORY așază advisorul ex-Deloitte în comitet cu semnătură; CONTEXT.md spune că el s-a angajat doar la o analiză preliminară, pre-angajament.

**C6. „Contact obținut independent" ↔ separarea BD de credit.** VERIFICATION-FLOW obține contactul retailerului prin „relația directă a lui Vladislav" — canalul relațional pe care raportul (§1.5) și AI-STORY îl separă de underwriting e reciclat în funcția de verificare. Independent de *distribuitor*, da; independent de rețeaua relațională a echipei, nu.

**C7. CONTEXT.md e actualizat pe jumătate.** Rescris pentru AI (§1, §7), dar §1 încă descrie pool-ul fără epoci/tranșe/„doar profesioniști", iar roadmap-ul (§9) nu conține niciuna dintre acțiunile-cheie din reparații (avocați, întrebarea de fronting, SSC, factura pilot). Documentul al cărui rol declarat e transferul de context între sisteme AI transportă acum o versiune pe jumătate reparată a proiectului.

**C8 (minor). Vetoul.** AI-STORY §3 vs. raport §1b.7 — frazarea actuală mută vetoul de la comitet la BD.

---

## Registrul promisiunilor — ce e declarat rezolvat dar e de fapt neverificat

Fiecare rând de mai jos e un loc unde o reparație depinde de ceva încă nedemonstrat. **Acestea NU sunt rezolvate. Sunt promisiuni.**

| # | Presupunerea | Documentul care se sprijină pe ea | Ce ar transforma-o în fapt |
|---|---|---|---|
| P1 | Există un factor sârb licențiat dispus la fronting | LEGAL (toată Cale A) | Răspunsul lui Vladislav + un term sheet |
| P2 | Memo-urile juridice vor valida structura | LEGAL, toate scripturile | Comandarea lor (2 apeluri) + livrarea |
| P3 | Întâlnirea SSC | LEGAL §8, scriptul §7 | Solicitarea ei |
| P4 | White paper ZDI fezabil pentru un token tranșat garantat cu portofoliul unui terț | LEGAL §3 | Memo Belgrad Q3 |
| P5 | „Sub prag AIFMD → doar înregistrare" valabil pentru emitent non-UE marketat în UE | LEGAL §3 | Memo București Q1–Q2 |
| P6 | Acces API SEF (+ sandbox) obtenabil pentru voi | VERIFICATION §4, AI-STORY §2, demo-ul central | Un cont demo funcțional, săptămâna asta |
| P7 | Retailerii cooperează la notificare + confirmare; fără clauze anti-cesiune la lanțurile din whitelist | VERIFICATION §4 (pașii 2–3) | Un retailer real care confirmă o factură pilot; citirea unui contract de furnizare real |
| P8 | LOI-ul distribuitorului | Toate scripturile („[distribuitorul cu LOI]") | Semnătura |
| P9 | Factura pilot cap-coadă ([N] azi = 0) | VERIFICATION §5 | Execuția, înainte de august |
| P10 | Coridor EURC↔RSD cu partener licențiat, la 0,7% | POOL (cascadă), LEGAL §5 | O cotație reală |
| P11 | EL 3% e o „podea" | POOL (toată cascada) | 12+ luni de outcome-uri; până atunci, spuneți „ipoteză, la mijlocul unui interval pe care propriul nostru red-team l-a numit optimist" |
| P12 | 150k EUR tranșă junior de la echipă + angel-i | POOL §2, răspunsul de aliniere | Angajamente scrise |
| P13 | Distribuitori care acceptă 16% + regres + garanție personală + notificarea retailerului lor | POOL §1, răspunsul la selecția adversă | Primul term sheet semnat de un distribuitor |
| P14 | Advisorul ex-Deloitte în comitetul de credit | AI-STORY §3 | Acceptul lui explicit pentru rol |
| P15 | Parantezele din scripturi: [X]% breaker, [firmă], [luna], [N] | Toate cele patru documente | Deciziile din iulie — fiecare paranteză goală e un răspuns care azi nu poate fi rostit |

---

## Verdictele

| # | Problema din raport | Verdict | Ce mai lipsește |
|---|---|---|---|
| **1** | Tokenul nu e creanța + factoring nelicențiat | **PARȚIAL** — planul e cel corect (chiar cel prescris de raport), dar riscul juridic real e neschimbat: operațiunea ar fi la fel de ilegală azi ca la data raportului | Partenerul (neidentificat, neîntrebat — P1), memo-urile (P2), mecanica garanției pe portofoliul terțului, și propagarea costului Căii A în modelul economic (C1) |
| **2** | Dubla finanțare + frauda pe factură | **PARȚIAL** — designul e corect prin construcție, execuția e zero, plus un overclaim: în Serbia dubla finanțare nu e „ucisă", e o cursă de notificare purtată pe regres | Acces SEF demonstrat (P6), o factură reală prin flux (P9), cooperarea unui retailer real (P7), și reformularea onestă a apărării pentru Serbia |
| **3** | Economia pool-ului nu închide | **PARȚIAL — cu DOAR APARENT pe cifra-titlu.** Mecanismele (epoci, tranșe, plafoane) închid mismatch-ul de lichiditate pe hârtie. Dar randamentul-titlu nu supraviețuiește propriei structuri (8,8% după propria formulă; 6,5–7,4% după cash drag; mai puțin după marja partenerului), first-loss-ul e nefinanțat, iar selecția adversă rămâne deschisă și e agravată de C2 | Recalcul onest al cascadei (drag + marja partenerului + EL ca ipoteză, nu podea), sursa celor 150k (P12), și un răspuns la selecția adversă care supraviețuiește propriului pipeline anti-fraudă |
| **4** | Motorul AI nu e credit scoring | **ÎNCHIS (cu rezerve)** — singura reparație executată, nu doar planificată; retractarea elimină afirmația falsificabilă, iar CONTEXT.md e dovada execuției | Reformularea breaker-ului („elimină discreția pe datele scrise", nu „independent de noi"), un comitet cu membri care și-au acceptat rolul (P14), corectarea frazei cu vetoul (C8), fără „calibrare" pe date sintetice la demo |

### Nota finală

Modelul de eșec al rundei 1 era **„blockchain-ul declarat sursă de adevăr"**. Modelul de eșec al rundei 2, dacă nu e corectat, e **„documentul declarat execuție"**: trei din patru reparații sunt planuri bune care se citează reciproc ca și cum ar fi fapte împlinite, iar scripturile de juriu conțin propoziții care azi nu pot fi rostite fără a minți. Ce ar muta #1–#3 în ÎNCHIS nu mai sunt documente — sunt trei fapte: **un term sheet de fronting semnat, o factură reală trecută cap-coadă prin flux, și 150k angajați în scris.** Următoarea iterație a acestui audit ar trebui să aibă ce verifica, nu ce citi.
