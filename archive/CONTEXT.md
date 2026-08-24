# FMCG Receivables Rail — Context Complet Proiect

*Document de context pentru dezvoltare cu Claude Code. Conține tot ce s-a decis, discutat sau clarificat despre proiect până în prezent. Ultima actualizare majoră: 22 iulie 2026 — pivot strategic post Solana Summit brief.*

---

## 0. Pivot strategic (citește asta primul)

Viziunea inițială (mai jos, §1) era un protocol complet de factoring on-chain. Due diligence-ul advers (`DUE-DILIGENCE-ADVERS.md`) și auditul reparațiilor (`RED-TEAM-ROUND-2.md`) au arătat că varianta completă cere licență de factoring, capital semnificativ, parteneriat cu un factor licențiat și 6-12 luni de execuție — nefezabil pentru un sprint de 5 săptămâni cu o echipă de 2 oameni, dintre care unul (Stefan) nu a scris încă niciun cod Solana/Anchor.

Pentru **Solana Summit Serbia (Demo Day)**, echipa a pivotat pe **FMCG Receivables Passport** — stratul 1 al viziunii inițiale: doar verificare + confirmare + anti-dublă-finanțare, fără să atingă vreodată creanța, deci fără blocaj de licență. Factoring-ul complet (viziunea din §1 de mai jos) rămâne stratul 2, de construit după ce stratul 1 are adopție.

Documente active pentru Demo Day (sursa de adevăr curentă):
- **`SOLANA-SUMMIT-BRIEF.md`** — contextul evenimentului, echipa reală, Vladislav, blocajul de licență explicat corect, propunerea recomandată, Q&A pregătit.
- **`VARIANTE-DEMO-DAY.md`** — toate variantele de proiect evaluate (nu doar Passport), cu verdict pe fiecare.

Documentele `AI-STORY-HONEST.md`, `DUE-DILIGENCE-ADVERS.md`, `LEGAL-STRUCTURE.md`, `POOL-ECONOMICS.md`, `VERIFICATION-FLOW.md`, `RED-TEAM-ROUND-2.md` descriu **viziunea completă (faza 2+)** — rămân valide ca analiză de risc pe termen lung, dar nu sunt planul pentru Demo Day.

---

## 1. Viziunea inițială (faza 2+, nu Demo Day)

**Nume:** FMCG Receivables Rail
**Ce face:** Protocol nativ pe Solana pentru tokenizarea facturilor (invoices) distribuitorilor FMCG (Fast-Moving Consumer Goods) ca Real-World Assets (RWA).
**Cum funcționează pe scurt:**
- Un distribuitor FMCG are facturi neîncasate (receivables) către retaileri.
- Aceste facturi sunt tokenizate on-chain pe Solana.
- Distribuitorul primește lichiditate imediată (factoring on-chain), în loc să aștepte 30-90-120 de zile scadența facturii.
- Capitalul vine dintr-un pool DeFi — funderii (furnizorii de capital) depun stablecoins/capital în pool și câștigă randament (yield) din diferența dintre suma acordată distribuitorului și valoarea nominală a facturii la scadență.
- Underwriting-ul se face pe reguli deterministe + limite hard + semnătură umană de comitet, cu datele verificate direct la sursa de stat (SEF/e-Factura). AI-ul face operațiuni și document intelligence — **nu** decizia de credit. Detalii complete în `AI-STORY-HONEST.md`.

**Piață țintă:** Distribuitori FMCG din Balcani (Serbia ca prim mercado, apoi regional).

**Blocajul principal (de ce nu e planul de Demo Day):** factoringul e activitate reglementată în Serbia — poate opera doar o bancă, o entitate locală licențiată, sau (doar pentru factoring internațional) o entitate străină. Capital minim ~340.000 EUR + 6-12 luni de licențiere. Nu e un „kill criterion" pe termen lung (rezolvabil prin parteneriat cu un factor licențiat — model BaaS), dar exclude varianta completă din fereastra de 5 săptămâni. Detalii în `SOLANA-SUMMIT-BRIEF.md` §4 și `LEGAL-STRUCTURE.md`.

**Descoperire recentă relevantă:** Serbia a introdus prin lege (Official Gazette 109/2025, în vigoare 12 dec 2025) un Registru Central al Factoringului (CFR) — anti-dublă-finanțare, dar **doar național**. Coridorul transfrontalier (facturi care traversează granița) rămâne nerezolvat de stat — acolo e portița pentru un registru neutru, multi-jurisdicțional, unde blockchain-ul chiar aduce ceva ce statul nu oferă. Vezi `SOLANA-SUMMIT-BRIEF.md` §4.

---

## 2. Track-uri Solana Summit acoperite

3 track-uri relevante la Solana Summit Serbia: **RWA**, **Payments**, **AI & Agents**.

---

## 3. Solana Summit Serbia — Demo Day

- **Eveniment:** Sava Centar, Belgrad — parte din Belgrade Blockchain Week, co-locat cu ETH Belgrade, include Rust Summit. Organizat de Superteam Balkan.
- **Format Demo Day:** 10 echipe pe scenă, 3 minute pitch/demo + 6 minute Q&A. Rundă top 10 → finală top 5. Prize pool $10.000. Se acceptă la nivel de idee/MVP/produs live.
- **Deadline aplicare:** aplicațiile depuse **până pe 2 august 2026 au prioritate la review**. Din discuția directă a lui Vladislav cu organizatorii: realist ~3 săptămâni pentru depunere (cade tot în zona 2 august). Nu e un hard cutoff confirmat public dincolo de asta.
- **Poziție:** echipa are semnal pozitiv — poziție relativ puternică, șanse ridicate de a fi în top 10 (per feedback-ul lui Vladislav din discuția cu organizatorii — neverificat independent, dar credibil).
- **Sponsori/audiență:** a16z, Visa, Raiffeisen, Mastercard, BlackRock + regulatori financiari (confirmat: Ognjen Popović, asistent de ministru, Ministerul Finanțelor Serbia).
- **Fereastra de construcție:** sigură între **5–26 august 2026**, cu start pe săptămâna 21–26 iulie.

Detalii complete, inclusiv Q&A pregătit pe juridic/tehnic/business: `SOLANA-SUMMIT-BRIEF.md`.

---

## 4. Echipa

**Core team confirmat: Stefan + Vladislav.** Vladislav a spus explicit „core team = noi doi" — tratează pe Stefan ca partener, nu executant.

| Persoană | Status | Notă |
|---|---|---|
| **Stefan** | Confirmat, core | Student anul 3 CS, UPT. 30h/săptămână internship Aumovio (System Test Engineer). Zero cod Solana/Anchor/Rust scris până acum — în ramp-up. Idea FMCG e a lui. |
| **Vladislav Petković, PhD** | Confirmat, core | 20+ ani FMCG/retail Serbia și Bosnia-Herțegovina. Acces la rețea de distribuitori. Jurat HackTM 2026 — l-a apreciat pe Frigo. Cunoaște pe Ciprian Man (Growceanu / VestVentures.VC). **Semnal de precauție:** un episod de follow-up ratat — încă nu există un livrabil comun. Test de partener în curs (vezi mai jos). |
| Fost C-level Deloitte (15 ani exp., freelance) | **Neconfirmat** — prin Vladislav | Nu trece ca membru al echipei până nu confirmă explicit rol + timp |
| Dev blockchain (full-time, disponibilitate incertă) | **Neconfirmat** — prin Vladislav | Realist doar review, nu implementare |
| Cineva „bun pe cybersecurity" | **Neconfirmat** — informație de gradul doi | — |

### Structura de equity
**Nedefinită.** Nimic discutat încă cu Vladislav — deliberat, până după testul de partener de mai jos.

### Test de partener (48h) — în curs
Fiecare livrează ceva concret înainte de a discuta equity:
- **Vladislav:** o factură anonimizată + un interviu cu un distribuitor + descrierea procesului actual + confirmare scrisă a timpului alocat.
- **Stefan:** schema fluxului + prototip upload/extragere + o tranzacție pe devnet + draft aplicație.

### Capacitate reală de construcție
- Fereastra sigură: **5–26 august 2026**, start pregătire 21–26 iulie.
- Dacă Stefan e acceptat la Google Summer School (București, 5 sesiuni 16:00–20:00): neutru spre pozitiv — restul zilei liber, laptop la el.
- Dacă nu: ore de overtime bancate la Aumovio pot elibera programul — **[de făcut]** negociat acum, nu în august.

---

## 5. Ce s-a construit / livrat până acum

- Analiză extinsă de due diligence advers + reparații pe 4 axe de risc (juridic, fraudă/verificare, economie pool, AI) — `DUE-DILIGENCE-ADVERS.md`, `LEGAL-STRUCTURE.md`, `POOL-ECONOMICS.md`, `VERIFICATION-FLOW.md`, `RED-TEAM-ROUND-2.md`.
- Repoziționare completă și onestă a poveștii AI (nu credit scoring) — `AI-STORY-HONEST.md`.
- Brief de decizie pentru Solana Summit, cu propunerea de pivot pe Passport — `SOLANA-SUMMIT-BRIEF.md`.
- Analiză convergentă independentă de la Codex/ChatGPT — ajunge la aceeași concluzie centrală (verificare înainte de factoring complet); detalii în `SOLANA-SUMMIT-BRIEF.md` §6.
- **Cod:** zero. Niciun program Anchor, nicio tranzacție pe devnet încă. Aceasta e prima prioritate de execuție.

**Important — framing onest:** nimic din arhitectură nu e încă implementat. Nu supraevalua în CV/comunicare externă.

---

## 6. Direcții explorate și verdictul lor

Vezi `VARIANTE-DEMO-DAY.md` pentru analiza completă a tuturor variantelor luate în calcul pentru Demo Day (FMCG Receivables Passport, Balkan Order-to-Cash Agent, AgentGuard, GrantProof, Frigo Food Rescue Receipts, Balkan Trade Document Rail), cu criterii de evaluare, ce omoară fiecare variantă, și recomandarea finală.

Direcții din istoric (pre-FMCG), abandonate definitiv:
1. **Frigo** — aplicație de consum împotriva risipei alimentare. Blockchain-ul nu era necesar pentru acest use-case.
2. **Smart contracts pentru discounturi automate în retail** — prea complex pentru capacitatea echipei la momentul respectiv.
3. **Tokenizarea creditelor de risipă alimentară** / **dashboard de conformitate B2B** — evaluate, dar echipa a pivotat spre FMCG.

---

## 7. Stack tehnic

- **Blockchain:** Solana, SPL, framework Anchor.
- **Smart contracts:** Rust (Stefan e în ramp-up; niciun dev Solana confirmat în echipă încă).
- **AI de operațiuni + document intelligence** (nu credit scoring — vezi `AI-STORY-HONEST.md`):
  - Ollama (rulare locală de modele)
  - Qwen2.5-Coder (extracție structurată din facturi/contracte → JSON cu schemă)
  - ChromaDB (RAG pe date publice de plătitori)
  - n8n (orchestrare workflow-uri)
  - MCP (Model Context Protocol)
- **Model de risc (v2, shadow mode, faza 2+):** regresie logistică / gradient boosting — nu LLM.
- **Hardware disponibil:** MacBook cu 48GB RAM.
- **Research:** Perplexity Pro cu Deep Research activat.

Pentru MVP-ul de Demo Day (Receivables Passport), scope tehnic redus — vezi `VARIANTE-DEMO-DAY.md` și `SOLANA-SUMMIT-BRIEF.md` §5 pentru include/exclude list.

---

## 8. Framework de evaluare a oportunității de business

Stefan aplică ~17 criterii, inclusiv (neexhaustiv):
- Clientul nu are de ales (lock-in structural / lipsă alternativă).
- Piața e deja adunată/agregabilă.
- Există buget B2B alocabil.
- Tailwind regulatoriu cu deadline concret.
- Lock-in structural odată adoptat.
- Primul client are un nume concret (nu ipotetic).

---

## 9. Ce urmează (roadmap imediat)

- [ ] **Cel mai urgent:** deschide formularul de aplicare (Notion) și confirmă vizual detaliile de deadline/proces — `SOLANA-SUMMIT-BRIEF.md` §1.
- [ ] Înregistrare la eveniment (separată de aplicație, gratuită) — de făcut acum.
- [ ] Negociază orele de overtime cu Aumovio, acum, nu în august.
- [ ] Rulează testul de partener (48h) cu Vladislav — vezi §4.
- [ ] Prezintă lui Vladislav recomandarea (nu meniu de opțiuni) — vezi `SOLANA-SUMMIT-BRIEF.md` §8.
- [ ] Aplică cu FMCG Receivables Passport (sau alternativa decisă în `VARIANTE-DEMO-DAY.md`), poziționat ca strat 1 al FMCG Rail.
- [ ] Săptămâna 21–26 iulie: primul program Anchor + o tranzacție pe devnet.
- [ ] Sprint principal 5–26 august: construcția MVP-ului pentru Demo Day.
- [ ] Pregătire Q&A (6 minute) — roluri împărțite Stefan (tehnic/produs) / Vladislav (piață/proces/relații instituționale).

---

## 10. Note despre stil de lucru / preferințe (relevante pentru colaborarea cu Claude Code)

- Stefan preferă evaluări **directe, oneste, "brutale"** — nu supra-validare.
- Pentru mesaje către contacte ocupate, preferă format cu **mesaje multiple scurte**, nu un paragraf dens.
- Folosește AI intensiv pentru coding și planificare strategică — confortabil să dirijeze sisteme AI mai degrabă decât să scrie tot codul de la zero.
- Produce documente markdown structurate pentru a transfera context de proiect între sisteme AI diferite.
- Folosește mai multe sisteme AI în paralel (Claude + Codex/ChatGPT) și compară concluziile — convergența independentă e tratată ca semnal de încredere.
- Disponibilitate: practic tot săptămâna (învață pentru examene doar cu o zi înainte).

---

*Acest document e punctul de plecare de context pentru sesiuni de lucru cu Claude Code pe acest proiect. Pentru planul curent de Demo Day, citește întâi `SOLANA-SUMMIT-BRIEF.md` și `VARIANTE-DEMO-DAY.md`. Actualizează pe măsură ce apar decizii noi.*
