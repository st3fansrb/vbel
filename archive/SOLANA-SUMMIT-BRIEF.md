# Solana Summit Serbia — Brief de decizie

*Ultima actualizare: 22 iulie 2026 (deadline aplicare corectat pe baza confirmării directe a lui Stefan).*

Document de lucru pentru pregătirea Demo Day. Consolidează: contextul evenimentului, propunerile Claude, propunerile Codex/ChatGPT, și concluziile la care s-a ajuns împreună. Marcaje folosite: **[VERIFICAT]** = confirmat din surse publice; **[NEVERIFICAT]** = afirmație care sună a fapt dar nu are dovadă; **[DE FĂCUT]** = acțiune deschisă.

---

## 1. Contextul evenimentului

- **Solana Summit Serbia** — Sava Centar, Belgrad. Parte din Belgrade Blockchain Week, co-locat cu ETH Belgrade; include Rust Summit. **[VERIFICAT]**
- Organizat de **Superteam Balkan** — capitolul oficial Solana pentru Balcani, comunitate non-profit. Peste $500.000 distribuiți în granturi non-equity; startup-uri sprijinite au strâns peste $10M; 2000+ membri. **[VERIFICAT]**
- Audiența declarată de organizatori: regulatori financiari, bănci, lideri fintech, companii mari de tech, investitori, mediu academic, plus ecosistemul Solana. Peste 50% din sală sunt fondatori/devi activi. **[VERIFICAT]**
- Track-uri de conținut: DeFi, Payments (+ stablecoins), Infra, RWA, AI & Agents. **[VERIFICAT]**
- Persoane relevante confirmate în program: **Ognjen Popović** (asistent de ministru, Departamentul Sistem Financiar, Ministerul Finanțelor); **Marko** (gazdă / contact sponsorizări, `t.me/solanamarko`). **[VERIFICAT]**

### Demo Day
- 10 echipe pe scena principală, câte **3 minute pitch/demo + 6 minute Q&A** în fața juriului. Rundă cu top 10, apoi finală cu top 5. Prize pool total $10.000. **[VERIFICAT]**
- Se acceptă startup-uri la nivel de idee, MVP sau produs live — deci nu e nevoie de MVP complet pentru a aplica. **[VERIFICAT]**
- **Deadline aplicare — [VERIFICAT, corectat]:** nu există un deadline hard pe 25 iulie. Formularul precizează că **aplicațiile depuse până pe 2 august 2026 au prioritate la review**. Separat, Vladislav a vorbit direct cu organizatorii și confirmă informal un interval de ~3 săptămâni pentru depunere de la data brief-ului — cade tot în zona 2 august. Semnal suplimentar pozitiv (via Vladislav, neverificat independent de organizatori dar considerat credibil): echipa are o poziție relativ puternică și șanse ridicate de a fi în top 10.
- Formular: `melted-replace-3a8.notion.site/352d7c260a4d803e8d62c9bd76344a21`
- **[DE FĂCUT]** Înregistrare la eveniment (separată de aplicație, gratuită, cu loc limitat) — de făcut azi, nu depinde de nimic.

### Follow-on
- Colosseum ca vehicul ulterior posibil. Datele exacte (28 sept – 2 nov) **[NEVERIFICAT]** — Colosseum confirmă doar modelul cu două hackathoane pe an, nu calendarul invocat.

---

## 2. Echipa

- **Core team: Stefan + Vladislav.** El a spus explicit „core team = noi doi" — te tratează ca partener, nu executant. **[VERIFICAT]**
- Ideea FMCG e a lui Stefan; i-a prezentat-o pe scurt lui Vladislav, explicația completă urmează.
- Roluri, equity, ownership: **nedefinite**. Nimic discutat încă.
- Adăugiri posibile, toate prin Vladislav, **niciuna confirmată** — a nu fi trecute ca membri ai echipei până nu confirmă explicit rol și timp:
  - fost C-level Deloitte, 15 ani experiență, acum freelance (credibilitate)
  - dev cu experiență blockchain, full-time, disponibilitate incertă (realist doar review)
  - cineva „bun pe cybersecurity" (informație de gradul doi)
- Stefan: student anul 3 CS la UPT, 30h/săptămână internship Aumovio (System Test Engineer). Zero cod Solana/Anchor/Rust scris până acum; în ramp-up.

### Capacitate reală pentru sprint
- **Fereastra sigură de construcție: 5–26 august**, cu săptămâna 21–26 iulie ca start.
- Dacă e acceptat la Google Summer School: e la București, dar doar 5 sesiuni de la 16:00 la 20:00 → cea mai mare parte a zilei liberă, laptopul la el. Neutru spre pozitiv pentru capacitate; se inversează doar ritmul (construiește dimineața, nu seara).
- Dacă nu e acceptat: poate folosi orele de overtime bancate la Aumovio ca să elibereze programul.
- **[DE FĂCUT]** Negociază orele cu Aumovio acum, nu în august — cererea sună altfel cu 5 săptămâni înainte.

---

## 3. Vladislav — ce știm, pe niveluri de certitudine

**[VERIFICAT]**
- Cunoscut ca jurat la HackTM 2026; a apreciat Frigo, a spus că ceilalți jurați nu i-au înțeles valoarea.
- Îl cunoaște pe Ciprian Man, co-fondator la Growceanu Business Angel și VestVentures.VC (dublul rol confirmat public).
- Rețea profesională din activitate cu administrația guvernamentală din Serbia.

**[NEVERIFICAT — afirmat de el]**
- Că s-a întâlnit recent în persoană cu oamenii din spatele Solana Summit.
- Că e într-un parteneriat cu o fundație implicată în Summit, ceea ce indirect ar asigura un loc în top 10. E intuiția lui, nu o confirmare de la organizatori.

**Semnal negativ**
- A existat o perioadă în care nu a dat follow-up cum era stabilit. Nu există încă dovada că livrează ceva împreună cu Stefan.

> **Test de partener (48h):** fiecare are un livrabil concret. Al lui Vladislav: o factură anonimizată + un interviu cu un distribuitor + descrierea procesului actual + confirmarea în scris a timpului alocat. Al lui Stefan: schema fluxului + prototip upload/extragere + o tranzacție pe devnet + draft aplicație. Nu se discută equity definitiv înainte de acest sprint comun.

---

## 4. Blocajul cu licența — și de ce nu e ce părea

- Factoringul e activitate reglementată în Serbia (Legea Factoringului). Factor poate fi doar: o bancă, o societate cu sediul în Serbia autorizată de minister, sau o bancă/societate străină — **exclusiv în factoring internațional**. **[VERIFICAT]**
- Se poate construi infrastructura, dar *operarea* factoring-ului cere colaborare cu o entitate licențiată.
- **Concluzie:** licența nu e un kill criterion. Pentru un demo day, dependența de un partener licențiat e normală (modelul BaaS: partenerul licențiat originează, protocolul e infrastructura). E un slide, nu un blocaj. Iar dacă *nu* se preia niciodată creanța, nu e nevoie de licență deloc — vezi produsul recomandat.

### Descoperire care schimbă poziționarea **[VERIFICAT]**
- Serbia a modificat Legea Factoringului (Official Gazette 109/2025, în vigoare 12 dec 2025). Introduce un **Registru Central al Factoringului (CFR)** — registru electronic unic al facturilor supuse factoringului, interconectat cu e-facturarea, cu scop explicit: **prevenirea cesiunii multiple a aceleiași creanțe**.
- Supravegherea trece la Comisia de Valori Mobiliare (competențe aplicabile din 13 iunie 2026); CFR devine operațional ulterior.
- **Implicații:**
  1. Statul tocmai a validat problema prin lege — cea mai bună validare posibilă.
  2. CFR e **național** (creanțe sârbești). O factură Serbia→România nu e în niciun registru comun.
  3. **Ușa deschisă = coridorul transfrontalier.** Registrele naționale rezolvă problema în interiorul granițelor; nimeni nu o rezolvă între ele. Acolo un registru neutru, multi-jurisdicțional, bate orice bază de date națională — și e singura variantă în care blockchain-ul nu poate fi înlocuit de stat.
- **[DE FĂCUT]** Citește textul amendamentelor înainte de Summit. Dacă cineva întreabă de CFR la Q&A (și Popović e în sală), răspunsul care câștigă: *„Registrul central sârbesc validează problema. Noi rezolvăm partea pe care el prin definiție n-o acoperă: creanțele care traversează granița."*

---

## 5. Propunerea recomandată — FMCG Receivables Passport

**Poziționare (o frază):** stratul comun de verificare pe care o factură devine o creanță confirmată de debitor, auditabilă și imposibil de finanțat de două ori. Nu se finanțează nimic, nu se cesionează nimic — e infrastructura pe care se conectează cei care fac asta.

**Relația cu viziunea inițială:** ăsta e **stratul 1** dintr-un FMCG Rail cu două straturi.
- Strat 1 (acum): verificare, confirmare, anti-dublă-finanțare. Fără licență.
- Strat 2 (mai târziu, cu partener licențiat): finanțarea propriu-zisă rulează peste registrul deja funcțional.

### De ce ea
- Rezolvă blocajul licenței prin arhitectură (nu se atinge creanța).
- Solana e **necesară, nu decorativă**: registrul anti-dublă-finanțare e shared state între finanțatori concurenți; niciunul nu acceptă ca un rival să opereze registrul. Nu există operator neutru → cazul canonic pentru blockchain.
- Se potrivește pe ce știe Stefan: extragere de date, orchestrare, reguli de eligibilitate. Program Anchor simplu, fără DeFi complex.
- Activează exact ce are Vladislav: proces FMCG real, documente, acces la distribuitori.

### Demo de 3 minute (momentul-cheie în centru, nu la final)
1. `0:00` Distribuitorul încarcă o factură. AI extrage datele, semnalează două neconcordanțe explicabile.
2. `0:45` Cumpărătorul confirmă din al doilea wallet că factura e reală. Status → `acknowledged`.
3. `1:30` **Al doilea finanțator încearcă să finanțeze aceeași factură. Programul îl respinge, live, on-chain.** ← aici se face liniște în sală.
4. `2:15` Primul finanțator decontează cu token de test. Status → `funded`. Link explorer.
5. `2:45` „Astăzi verificăm și prevenim frauda. Următorul strat e marketplace-ul de finanțare, împreună cu factori licențiați."

**Licența pe slide-ul 2, adresată frontal.** Într-o sală cu regulatori, „știm exact ce nu avem voie și de asta construim stratul de dedesubt" = credibilitate, nu slăbiciune.

### Contradicția strategică de evitat
Argumentul central e „niciun finanțator nu acceptă ca un concurent să opereze registrul". Dacă echipa se afiliază *strâns/exclusiv* cu un singur gigant licențiat, devine registrul acelui gigant → ceilalți factori nu-l vor folosi → teza moare.
- **Final A (de evitat ca implicit):** vendor de tehnologie pentru un factor. Rapid, dar un singur client, fără efect de rețea. E software house.
- **Final B (de protejat):** registru neutru folosit de mai mulți factori. Mai lent, dar singurul apărabil și singurul care justifică Solana.
- **Regula practică:** primul gigant = **design partner + prim utilizator**, NU partener exclusiv, NU cu control asupra registrului, NU equity în schimbul accesului. Prima ofertă va fi exclusivitate — sună a validare, e capcana.

### Ce omoară ideea
Vladislav nu obține nicio factură reală / interviu; dubla finanțare se dovedește problemă de manual, nu una simțită de distribuitori; demo-ul rămâne mockup; AI-ul pretinde un scor de credit; pitch-ul pretinde că problema juridică e rezolvată.

---

## 6. Propunerile Codex / ChatGPT

Codex a converis independent la aceeași concluzie principală: **nu se construiește factoring, se construiește stratul de verificare de dinaintea lui.** Convergență = semnal, nu coincidență.

### Ce a nimerit bine
- **Uciderea „AI credit score".** Cel mai important punct. Fără date de default (facturi plătite/neplătite, întârzieri, insolvențe, recuperări), un scor de credit e o minciună pe care regulatorii o detectează imediat. Formulare corecte: *risk evidence layer, invoice eligibility checks, anomaly detection, risk triage* — NU „AI credit score". Se poate demonstra credibil: duplicate, date lipsă, inconsecvențe comandă/factură/recepție, scadențe neobișnuite, lipsă confirmare cumpărător, concentrare pe un debitor.
- **Pool DeFi = teatru de demo.** Corect. Transfer cu SPL token de test e suficient pentru fluxul viitor.
- **Testul „dacă Firebase e suficient, Solana nu e justificată".** Criteriul care decide dacă pică.
- **Rețeaua lui Vladislav trebuie convertită în probe**, nu „cunoaște oameni".
- A prins că datele Colosseum din context nu sunt confirmate — se contrazice pe propriile date, semn bun.

### Unde e slab (corecțiile Claude)
1. **Demo-ul lui nu conține momentul care justifică blockchain-ul.** 6 din 7 pași rulează pe Firebase; dubla finanțare apare doar la „ce ar face ideea să pice". → Mută coliziunea în minutul 2. (Rezolvat în demo-ul de la secțiunea 5.)
2. **Șase opțiuni la 5 săptămâni = capcană.** Tabelul cu scoruri 4/5, 5/5 arată riguros dar sunt intuiții cu aparență de date. E nevoie de o direcție, nu de un clasament.
3. **Nu răspunde explicit la întrebarea de bază** (licența). O rezolvă implicit, dar merită să fie primul slide.
4. **„Balkan Order-to-Cash" cu 3/5 la justificare Solana NU e „cel mai sigur MVP".** La un Demo Day Solana, justificare slabă = descalificare, nu siguranță. Incoerență internă în tabelul lui.

### Clasamentul lui (pentru referință)
| Direcție | Verdict Codex |
|---|---|
| FMCG Receivables Passport | Cea mai bună |
| Balkan Order-to-Cash Agent | „Cel mai sigur MVP" (contestat mai sus) |
| AgentGuard (policy layer agenți Solana) | Cea mai bună variantă pur tehnică |
| Frigo Food Rescue Receipts | Demo bun, blockchain slab |
| Balkan Trade Document Rail | Promițător, dar prea larg |
| GrantProof (fonduri publice/UE) | Puternic conceptual, vânzare lentă |

### MVP-ul propus de Codex (include / exclude) — solid, adoptat
**Include:** upload factură; extragere AI; reguli de eligibilitate; hash off-chain/on-chain; două roluri cu wallet-uri diferite; confirmarea cumpărătorului; statusuri `submitted → flagged → acknowledged → funded → settled`; o plată cu token de test; explorer link + audit timeline.
**Exclude complet:** pool DeFi; marketplace; randamente; credit score ML; KYC complet; cesiune juridică automatizată; token tranzacționabil per factură; app mobilă complexă; integrare SAP; mainnet; afirmații despre capital garantat.

---

## 7. Alternativele, cu motivul respingerii

- **Balkan Order-to-Cash Agent** — cel mai ușor de construit, rămâne produs B2B valid dacă crypto cade. Dar justificare Solana slabă (agent de colectare, se face integral centralizat). → **Extensie comercială a Passport-ului, nu proiect separat.**
- **AgentGuard** (policy/approval layer pentru agenți pe Solana; refolosește Kage + CryptoAgent) — cea mai bună potrivire tehnică cu Stefan, se face fără nimeni altcineva. DAR nu folosește nimic din ce aduce Vladislav → cofondator decorativ. → **Plan B real** dacă Vladislav nu produce dovezi FMCG până la finalul săptămânii.
- **GrantProof / milestone-verification pentru funding on-chain** — fără licență, Solana nativ justificată (banii-s deja on-chain), se poate face solo. DAR: spațiul e ocupat de incumbenți maturi — **Karma** (intake, evaluare AI a aplicațiilor, disbursement pe milestone, flag-uri de risc) și **Questbook** (dApp complet on-chain, plăți pe milestone). Și, din nou, Vladislav dispare din ecuație. Risc de percepție: construirea unei unelte pentru juriul din fața ta citește mai des ca gudurare decât ca inteligență. → **Nu ca direcție principală.** Primitivul de dedesubt (escrow condiționat de dovadă verificată + audit trail) e însă identic cu al FMCG-ului — rămâne ca a doua aplicație a aceluiași primitiv, o propoziție în deck.
- **Frigo** (inclusiv varianta Food Rescue Receipts) — la un summit Solana trebuie inventat un motiv de blockchain și se vede. Piesă de portofoliu pentru recrutori, nu intrare de demo day.
- **Balkan Trade Document Rail** — reformulare mai largă, prea generală; documentație diferită per țară/industrie; fără coridor concret și prim client. Respins pentru timpul rămas.

---

## 8. Cum se prezintă lui Vladislav (nu meniu, ci recomandare argumentată)

Nu i se dau șase opțiuni deschise „să decidă el". Motive: fezabilitatea tehnică e o constrângere, nu un vot (risc să aleagă ceva ce nu se poate livra); un meniu repoziționează din partener în executant; iar dacă deadline-ul e aproape, un meniu produce o rundă de discuții, nu o decizie.

**În loc:** se vine cu **o recomandare (Receivables Passport) + raționamentul** + alternativele arătate ca muncă făcută și eliminată. Apoi i se dau explicit deciziile unde el are informația și Stefan nu:
1. Dubla finanțare e o durere reală la distribuitorii pe care îi cunoaște, sau e teorie de manual?
2. Ce încadrare prinde la bancherii/regulatorii lui: anti-fraudă / capital de lucru / infrastructură pentru factori licențiați?
3. Poate obține o factură anonimizată + un interviu până vineri?
4. La ce entități licențiate (Serbia/regiune) are efectiv acces — cine, la ce nivel, poate obține o discuție până la Summit?

Dacă răspunsul la (1) e „nu" → se trece pe AgentGuard fără regrete, și atunci chiar a decis el, pe baza a ceva ce numai el știe.

---

## 9. Pregătirea Q&A (6 minute — jumătatea importantă)

~8–12 întrebări, în fața unor avocați de reglementare, asistent de ministru finanțe, oameni de securitate (ChainSecurity/Helius gen), VC-uri. Roluri împărțite dinainte: **Stefan = tehnic + produs; Vladislav = piață, proces FMCG, relații instituționale.**

**Juridic / reglementare**
- *De ce fără licență de factoring?* → Nu se preia creanța (nu se cumpără, nu se cesionează, nu se avansează capital). Se înregistrează verificare + status. Factorul licențiat finanțează. E registrul, nu creditorul.
- *Înregistrarea on-chain e opozabilă juridic?* → Nu, și nu se pretinde asta. E probă, nu titlu. Cesiunea se perfectează în dreptul național.
- *GDPR?* → On-chain doar hash, chei publice, sumă, scadență, status, semnături. Documentul + datele comerciale off-chain. Nicio dată personală.
- *Dacă debitorul refuză să confirme?* → Rămâne neconfirmată — și asta e informație. Motivația lui să confirme: termene mai bune de la furnizor.
- *Ce faceți cu CFR-ul sârbesc?* → Vezi secțiunea 4: el e național, coridorul transfrontalier e acoperit de noi.

**Tehnic / Solana**
- *De ce nu Postgres?* (cea mai probabilă) → Finanțatorii sunt concurenți; niciunul nu acceptă ca un rival să opereze registrul. Nu există operator neutru. Asta e teza, nu blockchain de dragul lui.
- *De ce nu un lanț permisionat?* → Reintroduce operatorul de încredere. Plus cost la mii de evenimente/lună.
- *Ce oprește dubla finanțare dacă al doilea finanțator nu înregistrează?* → Nimic; funcționează cu adopție. De asta primul client sunt factorii. **E cel mai slab punct — recunoscut, nu apărat.** Un inginer care testează dacă vezi vulnerabilitatea te punctează pentru onestitate.

**Business**
- *Cine plătește?* → Factorul, per factură verificată sau abonament. Nu distribuitorul.
- *Piața de intrare?* → Un coridor, o categorie de produs. Nu „Balcanii".
- *Ce tracțiune?* → Exact ce există, fără înflorituri.
- *Ați vorbit cu un factor?* → Dacă nu, se spune nu — și se spune până când se face.

**Reguli de aur:** 3 cifre pe de rost (termen mediu de plată regional, cost actual factoring, dimensiune pierderi din dublă finanțare). „Nu știm încă, dar uite cum aflăm" punctează. Bluff-ul în fața unui avocat de reglementare termină prezentarea în 10 secunde. Nu se spune „foarte bună întrebare" — se răspunde.

---

## 10. Riscuri reale (nu licența)

1. ~~Deadline neconfirmat~~ — **rezolvat**: aplicații cu prioritate până pe 2 august 2026, confirmat de Stefan direct din formular + confirmare informală Vladislav.
2. **Zero cod Solana scris** — riscul de execuție, nu cel legal.
3. **Parteneriat nedovedit** — un episod de follow-up ratat, niciun livrabil comun încă.
4. **Afirmații neverificate tratate ca fapte** — „exact cum zicea Vladislav" nu e confirmare; două presupuneri care se potrivesc nu sunt dovadă.

---

## 11. Recomandarea finală

1. ~~Verifică deadline-ul~~ — **făcut**: prioritate până 2 august 2026. Rămâne: înregistrare la eveniment (separată de aplicație) — de făcut acum.
2. **Aplică cu FMCG Receivables Passport**, prezentat ca stratul 1 al FMCG Rail. Adresează licența frontal; pune coliziunea de dublă-finanțare în centrul demo-ului; poziționează pe coridorul transfrontalier (unde CFR-ul sârbesc nu ajunge).
3. **Construiește, nu delibera:** săptămâna 21–26 iulie → primul program Anchor + o tranzacție pe devnet. Fereastra mare: 5–26 august.
4. **Cere-i lui Vladislav** validare + materiale reale în câteva zile (test de 48h). Nu se discută equity înainte.
5. **Nu se contează pe** cei trei oameni neconfirmați până nu confirmă explicit rol + timp.
6. **AgentGuard rămâne pivot tehnic** dacă FMCG nu produce dovezi rapid. GrantProof rămâne o propoziție în deck, nu direcție.

> FMCG e cel mai bun avantaj specific echipei. Factoringul complet e produsul de anul viitor; verificarea, confirmarea și decontarea creanței sunt produsul care se poate demonstra luna viitoare.
