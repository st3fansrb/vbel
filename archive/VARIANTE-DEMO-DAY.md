# Variante pentru Solana Summit — cum ne prezentăm ca echipă

*Data: 22 iulie 2026. Nu doar recomandarea câștigătoare — toate variantele serios luate în calcul, explicate simplu, ca decizia să fie explicită înainte de a vorbi cu Vladislav.*

---

## Cum am ajuns aici

Viziunea inițială — un protocol complet de factoring on-chain (`CONTEXT.md` §1) — a fost testată prin due diligence advers (`DUE-DILIGENCE-ADVERS.md`). Verdict: cere licență de factoring, ~340.000 EUR capital, parteneriat cu un factor licențiat, 6-12 luni. Nefezabil într-un sprint de 5 săptămâni, cu o echipă de 2 oameni, unul dintre ei fără cod Solana scris încă.

Așa că întrebarea reală nu mai e „ce construim din viziunea mare", ci: **ce putem construi și demonstra credibil în 5 săptămâni, care să folosească Solana pentru un motiv real, și care să folosească ce aduce Vladislav?**

Două analize independente — a mea (Claude, pe baza due diligence-ului de mai sus) și a Codex/ChatGPT (analiză separată, cerută de tine) — au ajuns la **aceeași concluzie centrală**: nu se construiește factoring-ul complet, se construiește stratul de verificare de dinaintea lui. Convergența independentă e tratată ca semnal, nu coincidență.

Documentul de față pune pe masă toate variantele serios luate în calcul, nu doar câștigătoarea.

---

## Criteriile de evaluare (aceleași folosite în ambele analize)

1. **Solana e necesară sau decorativă?** Testul: „ar merge la fel de bine pe Firebase/Postgres?" Dacă da, nu e proiect de Solana Summit.
2. **Se poate construi de 2 oameni în ~5 săptămâni**, unul dintre ei zero-cod-Solana la start?
3. **Folosește ce aduce Vladislav** (rețea FMCG, acces la distribuitori) sau te lasă să lucrezi singur?
4. **Blocaj de licență/juridic** — oprește demo-ul, sau doar business-ul de după Demo Day?
5. **Concurență** — cine ocupă deja spațiul ăsta?

---

## Variantele

### 1. FMCG Receivables Passport — RECOMANDATĂ

**Ce e, într-o frază:** un registru on-chain unde o factură devine „confirmată de debitor" și „imposibil de finanțat de două ori" — fără să finanțezi sau să cesionezi nimic tu. Ești infrastructura de verificare, nu creditorul.

- **Solana:** necesară — e shared state între finanțatori care sunt concurenți între ei; niciunul n-ar accepta ca un rival să opereze registrul. Nu există operator neutru clasic pentru asta → cazul canonic pentru blockchain.
- **Fezabil în 5 săptămâni:** da — upload factură, extragere AI, reguli simple de eligibilitate, program Anchor simplu (fără DeFi complex), doi participanți cu wallet-uri diferite.
- **Folosește Vladislav:** da, direct — are nevoie exact de ce aduce el (proces FMCG real, acces la distribuitori, o factură reală).
- **Blocaj de licență:** niciunul — arhitectura evită complet problema, pentru că nu se atinge creanța.
- **Ce o omoară:** Vladislav nu obține o factură reală / interviu; demo-ul rămâne mockup; AI-ul pretinde scor de credit; pitch-ul pretinde că problema juridică e „rezolvată" quando nu e.
- **Verdict:** cea mai bună potrivire pe toate cele 5 criterii simultan. Detalii complete + demo pas-cu-pas: `SOLANA-SUMMIT-BRIEF.md` §5.

---

### 2. Balkan Order-to-Cash Agent

**Ce e:** un agent (AI + workflow) care ajută distribuitorii FMCG să urmărească și să colecteze plăți de la retaileri mai eficient.

- **Solana:** slabă — e un agent de colectare/reminder, s-ar face la fel de bine complet centralizat, fără blockchain.
- **Fezabil în 5 săptămâni:** cel mai ușor de construit dintre toate variantele.
- **Folosește Vladislav:** parțial — folosește procesul FMCG, dar nu are nevoie de nimic specific blockchain de la el.
- **Blocaj de licență:** niciunul.
- **Ce o omoară:** la un Demo Day Solana, o justificare slabă pentru blockchain = descalificare, nu „variantă sigură". Rămâne un produs B2B valid ca business, dar nu ca intrare de Demo Day.
- **Verdict:** nu ca proiect separat. **Extensie comercială posibilă a Passport-ului**, după Demo Day.

---

### 3. AgentGuard

**Ce e:** un strat de politici/aprobări (policy & approval layer) pentru agenți AI care operează pe Solana — controlează ce poate face un agent autonom on-chain, cu reguli și limite explicite. Refolosește proiecte tehnice anterioare ale lui Stefan (Kage + CryptoAgent).

- **Solana:** puternic justificată — agenții AI care ating fonduri on-chain sunt exact problema pe care track-ul „AI & Agents" o discută.
- **Fezabil în 5 săptămâni:** cea mai bună potrivire tehnică pură cu Stefan — se poate construi fără nimeni altcineva.
- **Folosește Vladislav:** deloc — nimic din rețeaua sau expertiza lui e relevant aici.
- **Blocaj de licență:** niciunul.
- **Ce o omoară:** dacă e prezentată ca proiect al echipei, Vladislav devine cofondator decorativ — nu e o poveste de echipă credibilă.
- **Verdict:** **plan B real**, nu variantă principală acum. Se activează dacă Vladislav nu produce dovezi concrete FMCG (testul de 48h din `SOLANA-SUMMIT-BRIEF.md` §3) până la termenul stabilit.

---

### 4. GrantProof (verificare de milestone-uri pentru fonduri publice/granturi on-chain)

**Ce e:** un sistem care ține banii unui grant/fond public în escrow on-chain și îi eliberează doar când o dovadă de milestone e verificată — reduce frauda și întârzierile în alocarea de fonduri.

- **Solana:** justificată nativ — banii sunt deja on-chain, nu trebuie inventat un motiv.
- **Fezabil în 5 săptămâni:** da, se poate construi solo.
- **Folosește Vladislav:** deloc — din nou, nimic FMCG aici.
- **Blocaj de licență:** niciunul.
- **Ce o omoară:** spațiul e deja ocupat de jucători maturi — **Karma** (intake, evaluare AI, disbursement pe milestone) și **Questbook** (dApp complet on-chain pentru plăți pe milestone). Plus riscul de percepție: construirea unei unelte pentru exact tipul de juriu din fața ta (fonduri/granturi) citește mai degrabă ca gudurare decât ca inteligență de produs.
- **Verdict:** nu ca direcție principală. Rămâne **o singură propoziție în deck** — „același primitiv (escrow condiționat de dovadă verificată) se aplică și la granturi" — nu un proiect separat.

---

### 5. Frigo / Food Rescue Receipts

**Ce e:** aplicație de consum împotriva risipei alimentare (proiectul anterior al lui Stefan), eventual cu o variantă „receipts" — chitanțe on-chain pentru donații/recuperare de alimente.

- **Solana:** slabă — motivul de blockchain trebuie inventat, și se vede la Q&A.
- **Fezabil în 5 săptămâni:** demo-ul e deja bun (a plăcut lui Vladislav la HackTM).
- **Folosește Vladislav:** parțial, indirect.
- **Blocaj de licență:** niciunul.
- **Ce o omoară:** un jurat tehnic la un summit Solana întreabă imediat „de ce blockchain aici?" și nu există răspuns bun.
- **Verdict:** piesă bună de portofoliu pentru CV/recrutori, **nu intrare de Demo Day**.

---

### 6. Balkan Trade Document Rail

**Ce e:** o versiune mai largă a Passport-ului — un rail generic pentru documente comerciale (nu doar facturi FMCG) în comerțul balcanic transfrontalier.

- **Solana:** potențial justificată, similar cu Passport-ul.
- **Fezabil în 5 săptămâni:** nu — documentația și regulile diferă per țară și industrie, scope prea larg pentru fereastra de timp.
- **Folosește Vladislav:** parțial — dar diluează exact avantajul lui specific (FMCG), nu-l concentrează.
- **Blocaj de licență:** variabil, per industrie/țară — mai greu de mapat.
- **Ce o omoară:** fără un coridor concret și un prim client numit, e prea general pentru un pitch de 3 minute.
- **Verdict:** respinsă pentru timpul rămas. Ideea de „rail" rămâne valabilă ca extensie pe termen lung a Passport-ului, dacă acesta prinde.

---

### 7. FMCG Receivables Rail complet (viziunea inițială)

**Ce e:** protocolul complet de factoring on-chain — tokenizare, pool DeFi, randament pentru investitori, decizie de finanțare. Detalii: `CONTEXT.md` §1.

- **Solana:** puternic justificată, dacă ar putea fi construită.
- **Fezabil în 5 săptămâni:** **nu.** Cere licență de factoring (~340.000 EUR capital minim în Serbia + 6-12 luni), parteneriat cu factor licențiat, structură juridică pe 3 niveluri, model economic complex care nici pe hârtie nu ține la audit riguros (`RED-TEAM-ROUND-2.md`).
- **Folosește Vladislav:** da, masiv.
- **Blocaj de licență:** da — fatal pentru un demo în 5 săptămâni, rezolvabil doar pe termen lung.
- **Ce o omoară acum:** nimic din arhitectura financiară (tranșe, first-loss, randamente) poate fi construit sau validat credibil până la Demo Day.
- **Verdict:** **nu pentru Demo Day.** Rămâne viziunea de fond, de construit doar după ce registrul (strat 1) și marketplace-ul (strat 2) au adopție dovedită — vezi extensia de mai jos.

---

## Extensie — al treilea strat: pool propriu de finanțare, post-adopție

*Adăugat 23 iulie 2026, din discuție ulterioară. Nu e o variantă alternativă pentru Demo Day — e roadmap-ul pe termen lung, corect secvențiat.*

Modelul complet, reordonat pe trei straturi:
1. **Passport** (acum) — registru neutru de verificare + anti-dublă-finanțare. Fără licență, fără capital.
2. **Marketplace** (după adopție) — mai mulți factori licențiați folosesc registrul independent unii de alții, plătind fee per verificare sau abonament. Rămâne neutru — asta e ce justifică Solana permanent.
3. **Pool propriu** (după ce 1+2 au tracțiune reală) — un vehicul de finanțare propriu (fie prin licențiere directă, fie prin parteneriat cu un factor, ca în `LEGAL-STRUCTURE.md` Cale A/B), prin care oricine poate finanța un pool de facturi verificate. Aceasta e, în esență, viziunea inițială din §1 al `CONTEXT.md` — dar construită la final, nu la început.

### De ce ordinea asta contează — rezolvă exact ce a fost identificat ca fatal

| Problema originală (`DUE-DILIGENCE-ADVERS.md` / `RED-TEAM-ROUND-2.md`) | Cum o rezolvă „registru + marketplace întâi" |
|---|---|
| Modelul de PD n-a văzut niciun default real | Operare 12+ luni ca registru cu date reale de la mai mulți factori = exact pragul de shadow mode cerut în `AI-STORY-HONEST.md` §4 (12 luni + N≥200 facturi) |
| Cifrele din `POOL-ECONOMICS.md` erau „ILUSTRATIV", nu reale | Date reale de pierdere așteptată, OpEx, comportament de plată — nu mai e nevoie de presupuneri |
| Niciun factor licențiat identificat pentru Cale A (`LEGAL-STRUCTURE.md`) | Se vine la masă cu adopție dovedită — negociere din poziție de forță, nu de la zero |
| „Documente declarate execuție" fără fapte în spate (`RED-TEAM-ROUND-2.md`) | Nu se mai promite execuție, există deja |

Practic, stratul 1 nu e doar un compromis de Demo Day — e faza de generare de date și leverage care lipsea ca viziunea inițială să fie vreodată credibilă.

### Tensiunea structurală care rămâne — de rezolvat abia la momentul respectiv

Dacă entitatea care operează registrul neutru (strat 1-2) devine și operator de pool propriu (strat 3), apare un conflict de interese: sunteți simultan infrastructură neutră ȘI concurent al clienților voștri (factorii care folosesc registrul). E problema clasică „marketplace care concurează cu propriii participanți" — nu fatală, dar erodează încrederea dacă nu e gestionată structural.

**Cum se rezolvă, dacă se ajunge acolo (nu acum):**
- Entitate juridică separată pentru pool — nu compania care operează registrul.
- Acces la infrastructura de pool rămâne deschis oricărui alt factor licențiat, nu exclusiv vouă — altfel se recreează exact contradicția „Final A vs Final B" de la Passport (§1 mai sus).
- Guvernanță transparentă, pregătită pentru întrebarea „nu concurați cu clienții voștri?": poolul e o entitate separată, la care orice factor licențiat poate participa ca sursă de capital, nu doar echipa fondatoare.

### Cum se prezintă la Demo Day (dacă deloc)

O singură propoziție de viziune, la finalul pitch-ului, niciodată ca plan activ:

> „Registrul creează încrederea și datele; peste el, pe termen lung, poate apărea și un strat de capital propriu — dar asta se decide cu date reale, nu presupuneri, exact motivul pentru care nu-l construim azi."

Orice detaliere suplimentară la Demo Day readuce exact scrutinul juridic/economic pe care pivotul pe Passport l-a evitat — nu se intră în cifre, structuri de entități sau tranșe pe scenă.

---

## Tabel comparativ rapid

| Variantă | Solana necesară | Fezabil în 5 săpt | Folosește Vladislav | Blocaj licență | Verdict |
|---|---|---|---|---|---|
| **FMCG Receivables Passport** | Da, tare | Da | Da, direct | Niciunul | **Recomandată** |
| Balkan Order-to-Cash Agent | Slabă | Da, cel mai ușor | Parțial | Niciunul | Extensie, nu proiect |
| AgentGuard | Da, tare | Da, singur | Deloc | Niciunul | Plan B |
| GrantProof | Da, nativ | Da, singur | Deloc | Niciunul | O propoziție în deck |
| Frigo / Food Rescue | Slabă | Da (deja există) | Parțial | Niciunul | Portofoliu, nu Demo Day |
| Balkan Trade Document Rail | Potențial | Nu (prea larg) | Parțial, diluat | Variabil | Respinsă acum |
| FMCG Rail complet (viziune) | Da, tare | Nu (licență + capital) | Da, masiv | Fatal pentru sprint | Faza 2+, nu Demo Day |

---

## Recomandarea finală

1. **Aplică cu FMCG Receivables Passport.** E singura variantă care bifează toate cele 5 criterii simultan: Solana reală, fezabilă solo+Vladislav în 5 săptămâni, fără blocaj de licență, folosește avantajul specific al echipei.
2. **Nu prezenta asta lui Vladislav ca meniu de 7 opțiuni.** Vino cu recomandarea + raționamentul, arată restul ca muncă deja făcută și eliminată. Detalii despre cum se face conversația: `SOLANA-SUMMIT-BRIEF.md` §8.
3. **AgentGuard rămâne plan B real**, nu ipotetic — dacă testul de 48h cu Vladislav nu produce o factură reală + interviu, pivotezi fără regrete, pentru că atunci decizia se bazează pe ceva ce doar el știe (dacă dubla finanțare e o durere reală sau teorie de manual).
4. **GrantProof și Balkan Order-to-Cash rămân idei de rezervă/extensie**, nu direcții active acum.
5. **Frigo și Balkan Trade Document Rail sunt închise** pentru acest ciclu — primul e piesă de portofoliu, al doilea are scope prea larg pentru timpul rămas.
6. **Viziunea completă (FMCG Rail) nu dispare** — devine stratul 2, de construit după ce Passport-ul are adopție reală și, eventual, un partener licențiat.
