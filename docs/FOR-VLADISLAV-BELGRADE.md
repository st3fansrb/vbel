# Why we build this — and why this way

**Stefan, 21 August 2026.**

This is my answer to the chain-agnostic trust and tokenization strategy you sent. Short version:
I think you are right, and I want to explain why I now think so, because my reasoning took a
detour and the detour is useful.

Written to be read by you and to be pasted into an AI tool, so it is self-contained. You should
not need any other file to follow it. Where I am confident, I say so. Where I am guessing, I say
that too.

The last section is what I need from you. It is short, and none of it blocks the build.

---

## 1. The thing I got wrong first

My first reaction to your document was that the product had no pain in it. An evidence layer
proves records were not altered — and my instinct was that nobody lies awake worrying about that.
Contracts and relationships already handle it. So I went looking for a way to attach the idea to
something that hurt more.

That was backwards, and here is what changed my mind.

**A record only needs to be tamper-evident when two parties who do not fully trust each other
both depend on it.** Inside one company, nobody needs this — you trust your own database. The
moment a record crosses a boundary between counterparties, and one side can quietly change it
after the fact, it becomes worth something.

That is not a hypothetical. It is the thing you described to me about Bosnia. Someone changed
stock data — quantities, expiry dates, returns — and it took real effort to discover and it cost
real money. I only have that story in general terms, and I am not going to write more of it down
here (see the last section).

But it is the clearest example I have of the actual problem, and it is worth noticing that **you
proposed a tamper-evidence layer after having seen tampering.** That is not a coincidence, and it
is a better reason to build this than anything I reasoned my way to.

---

## 2. What the pain actually is

I want to be careful here rather than persuasive, because getting this wrong costs us months.

Integrity proof is worth paying for when **four conditions hold at once**:

1. Two parties depend on the same record
2. One of them can alter it after the fact
3. There is real money attached to the difference
4. Discovering the alteration is currently slow, expensive, or accidental

Most business relationships fail this test. A producer and a long-standing buyer have a contract,
a relationship and each other's phone numbers. When something is disputed they call each other.

But the test is passed cleanly in specific situations, and these are the candidates:

**Records that cross a boundary between adversarial or unfamiliar parties.** A new supplier, a
cross-border shipment, a counterparty you have no history with. Nobody's internal system is
authoritative to the other side.

**Records where one side benefits from the difference.** Quantities, expiry dates, returns,
acceptance quantities, quality gradings. Every one of those has money on it and a party with a
motive.

**Records that outlive the relationship.** Something read years later by someone who never met
whoever wrote it — a recycler, an auditor, a regulator, a subsequent owner. There is nobody to
call and nothing to fall back on.

**Records where the writer is grading their own homework.** Self-reported quality, provenance,
composition, sustainability claims. The party with the incentive to overstate is the party
holding the pen.

**Records that decide who gets something scarce.** Who was offered a lot, at what price, and
when. The suspicion that the good stock quietly went elsewhere is what stops people engaging.

I do not know which of these you have actually watched happen. That is the most useful thing you
could tell me, and I ask for it properly at the end.

---

## 3. Why a blockchain — and where it is honestly not needed

I want to be strict about this, because "we used a chain" is not an argument and the room in
Belgrade will not be impressed by one.

**The test I use: remove the chain and see whether the product still works.**

For most of what an evidence layer does, removing it changes very little. Signed records in a
normal database with a qualified electronic timestamp are legally *stronger* in both Serbia and
Romania than a blockchain entry — blockchain records are not a recognised category of evidence in
either country, while a qualified eIDAS timestamp carries a legal presumption. So for pure
record-keeping, a chain is a preference, not a requirement. I think we should say this out loud
rather than let someone catch us on it.

**Where removing the chain genuinely breaks the product** is anywhere the operator of the system
is also a party with an interest. If we hold the records and we also run the marketplace, or the
seller runs the system that records what the seller offered, then "trust us" is doing all the
work — and that is exactly the trust that is missing.

A public chain removes the operator's discretion without removing the operator. Somebody still
runs the process; they just cannot alter what was already committed. That is a narrow claim and I
think it is the true one.

---

## 4. Why these specific methods

Each of these is a choice, and each one has a cheaper alternative we rejected for a reason.

**Only a hash goes on the chain — never the data.** The record contains customer names, prices,
facility codes. Publishing that would be a data protection incident, not a feature. A hash is 32
bytes that reveal nothing about the contents but change completely if one character of them
changes. One caution I want on the record: a public identifier can still become personal data
when it is reliably linkable to a person. Pseudonymisation is not anonymisation.

**The data is canonicalised before hashing.** This looks pedantic and everything rests on it. Two
systems can write the same facts as JSON differently — different key order, different spacing —
and produce completely different hashes from identical data. There is a published standard
(RFC 8785) that defines one exact way to write it, so the same facts always produce the same
bytes on any machine in any language. Without this the whole thing silently fails to verify.

**Each record names the one before it.** That is what turns a pile of records into an ordered
chain, and it is what makes it detectable if one is quietly removed rather than altered.

**Corrections supersede rather than overwrite.** When a figure turns out to be wrong, a new record
is issued that carries the corrected version *and* names the record it replaces. The original
stays visible and is marked superseded, with the reason attached. This matters more than
immutability does: an auditor does not want a record that cannot be changed, they want a record
where every change is visible. A system that can only append ends up with two contradictory
records and no way to say which is current. That is the single feature I would most want to
demonstrate.

**We use existing standards instead of inventing formats.** The envelope is expressed as a W3C
Verifiable Credential — a published standard since May 2025 — rather than a schema we made up.
It costs a few hours and it means anyone in this field recognises what they are looking at. There
are heavier standards in this space (GS1's EPCIS for supply chain events, GS1 Digital Link for
product QR codes) that we reference and deliberately do not implement; they are months of work
and we should be able to say precisely why we did not, rather than looking as though we had never
heard of them.

**Identity comes from a name, not from our database.** The issuer and the subject are identified
by names that resolve publicly and are not controlled by us. If our company disappears, the
records are still attributable. Using our own internal identifiers would put us back in the middle
of a system whose whole point is that nobody has to trust the middle.

**Chain-agnostic, and that is a design constraint, not marketing.** The same record produces the
same hash and the same verification result whether it is anchored on Solana or Ethereum. Which
chain a customer's world runs on is their decision and it will change. If our business logic knows
which chain it is on, we have built something that has to be rewritten when the answer changes.

---

## 5. What we actually build next week

The hackathon in Belgrade is 26–27 August, run by ETH Belgrade together with Superteam Balkan. The
requirement is something live and deployed. Bringing existing work is explicitly allowed.

We build the first layer of your document — the canonical event envelope, signed, hashed, anchored
— and demonstrate it across **the three use cases your own §8 names**: a product or batch passport,
a delivery acceptance, and an auction-rule audit. Two chains, one envelope, one verification page.

I am not going to argue here about how many hours it takes; that is in a separate working note.
What matters for this document is why those three and not one.

**We do not name a vertical, on purpose.** The generality *is* the product. A demo of one industry
hides that; a demo of three unrelated ones proves it. It also keeps the commercial question open
until we have evidence to close it, rather than guessing now and building around the guess.

The auction case gets the most attention for one reason only: it is the one where removing the
chain breaks the product, per section 3. Everything else in the demo would work with a database.
That gives us one honest moment where the technology is necessary rather than decorative.

One thing I should flag rather than let you discover it: a descending-price auction is not an
empty market. There are live European players in surplus B2B, and at least one operator already
runs the "no public catalogue, qualification and routing only" model. So the auction is a good
demonstration and an unproven business, and I do not want a win on Thursday read as evidence of
the second thing.

---

## 6. How this connects to everything above it

This is the part I think your document gets right and that I initially undersold. The evidence
layer is not interesting on its own. It is interesting because of what cannot be built without it.

**Layer 1 — verifiable records.** What we build now. Modest on its own. Its job is to make a
record attributable, ordered, correctable and checkable by someone who does not trust whoever
produced it.

**Layer 2 — product and batch passports.** The same identity, signature and lifecycle machinery,
carrying a defined schema for one product category. This is where regulation actually creates
buyers: battery passports become mandatory in the EU on 18 February 2027, and the EU registry went
live last month, with textiles, tyres, steel, furniture and ICT following through 2029. Worth
knowing, and I had it wrong until last week: **food is explicitly excluded** from that regulation
and always will be. So a food passport is a voluntary sale and a battery passport is a mandated
one, and we should not confuse the two when we talk about this.

**Layer 3 — financing against verified goods.** This is where the pain concentrates and where the
money is. Nobody lends against a lot they do not believe exists. A producer waiting months to be
paid has a problem that recurs every single month and that they can put a number on. Your document
is right to defer this: the moment a token carries a right to goods or payment, it is a different
legal object entirely, and that needs counsel and a regulated partner rather than a hackathon.

**And the honest structural problem, which I do not think either of us has said out loud:** the
pain is concentrated in layer 3, the buildable thing is layer 1, and there is nothing obviously
earning money in between. I do not have an answer to this. I think it is the most important
question in front of us and it deserves a proper conversation rather than a paragraph.

Two other things the same machinery supports, which I mention because they widen the market rather
than because I am confident in them: **insurance and claims**, which have the same shape as
financing, and **accountability for autonomous software agents** — proving what an agent was
authorised to do and what it actually did. The second is fashionable right now and I have no
evidence anyone pays for it, but it is the one the room in Belgrade cares about most.

---

## 7. How this reaches anyone — my understanding, for correction

The part of your direction I find genuinely attractive is that it does not require us to gather
customers one at a time. We sell to whoever already holds the customer relationship — an ERP or
warehouse vendor, a B2B platform, a compliance provider — and reach their users through one
integration. One vendor with four hundred customers beats four hundred conversations. It also
avoids the trap a marketplace always has, where it is useless to each side until the other side
is already there.

That much I am confident about. Below is where I am not, and this is your side of the table
rather than mine, so treat it as me checking my own reasoning rather than arguing with yours.

- **The demand does not disappear, it moves further away from us.** The first thing a vendor asks
  is whether their own customers are asking for this. Their roadmap is already oversubscribed and
  they do not add things speculatively. So we still need the end pain to be real — we have just
  put a layer between ourselves and any evidence of it.
- **Our pace becomes their pace.** Integration cycles with established vendors are long, and we
  cannot influence how they prioritise.
- **Build versus buy is sharp for this particular component.** A vendor's own engineers could
  anchor hashes in a week, and they know it. What we would really be selling is the schemas, the
  standards work and the maintenance we lift off them. That is a legitimate product, but it is a
  different pitch, and I would like us to agree which one we are making.

One fact worth having in front of us rather than discovering later: **SAP retired its own
blockchain service in May 2025** and moved its traceability to a conventional database. That is
exactly the buyer profile we are describing, and the largest example of it, and they exited. I do
not read that as fatal. I read it as meaning "vendors want this" is something to verify rather
than assume.

If any of this is wrong, that is one of the most useful corrections you can give me.

---

## 8. Where AI fits — possibilities, not commitments

This is not the main argument and I do not want it to read as one. But AI, blockchain and
security are converging right now, and being credibly in all three is worth something — both in
the room next week and afterwards. So it is worth writing down what is actually plausible, as
opposed to what would be decoration.

**One principle first, because it decides everything else: AI belongs on the edges, never in the
verification path.** The whole value of this layer is that it is deterministic — anyone recomputes
the same hash and gets the same answer, with no judgement involved. Put a probabilistic model in
the middle of that and the guarantee is gone. So AI gets data *in*, and finds meaning *across*
data. It never decides whether something verifies. Anything like an "AI trust score" would
actively destroy the product.

Within that boundary, five things look real:

**Agents as users.** If autonomous software agents start transacting on anyone's behalf, each
action needs a verifiable record of what the agent was authorised to do and what it actually did.
That is the same envelope, the same signature, the same revocation — with an agent as the subject
instead of a pallet. This layer is a natural audit trail for agent activity, and making
verification something an agent can call directly is small work.

**Agents as the interface.** "Show me every lot where the delivered quantity was revised down
after acceptance" is a better way into this data than a dashboard, and it works precisely because
the records are already canonical and structured.

**Turning documents into events.** Delivery notes, invoices and transport documents arrive as
PDFs, scans and phone photographs. Extracting structured events from them is well-solved document
AI — and if the record is extracted and anchored at the moment of receipt, altering it afterwards
becomes detectable rather than invisible.

**Making integration cheap.** Every ERP and warehouse system writes its data differently, and
mapping a customer's fields into our envelope is expensive consulting work. That expense is
exactly what makes vendors slow to adopt infrastructure, per section 7. Field mapping is something
current models do well. If onboarding drops from weeks to hours, what we are selling stops being
"we anchor hashes" and becomes "we absorb the integration burden" — which is a much better answer
to build-versus-buy.

**Finding things nobody is looking for.** Two versions. The first is something I wrote down weeks
ago and never acted on: every surplus platform waits for a human to decide to list something, and
none of them watches the producer's own data to surface a lot before anyone notices it is at risk.
The second matters more to me now — once there are signed, ordered event chains across many
parties, patterns become visible that no single party can see. Returns that are statistically
abnormal at one branch. Quantities revised downward after delivery far more often in one place
than anywhere else. **That is the Bosnia problem from the other direction:** the chain proves
nothing was changed, and a model finds where something should have been.

**None of this is scoped for next week, and I do not want it to be.** We do not know yet how much
of the core we can finish, and adding to it before that is settled would be a mistake. What I
would like to do is agree a short priority list — which one or two of these are genuinely the most
valuable — but that decision should come *after* you have answered the questions below, not
before. Several of them change the answer.

---

## 9. What we must never claim

I would rather agree these now than have one of us say something checkable and wrong in front of
people who know the field.

- **Proof of integrity is not proof of truth.** A false record anchored honestly is still a false
  record. We prove nothing changed since it was written — never that it was accurate when written.
- **This is not a qualified electronic ledger.** The EU created that category, and it requires
  being a qualified trust service provider. We are not one. "Designed toward" is honest.
- **Blockchain records are not recognised evidence in Serbia or Romania.**
- **Product passport regulation does not cover food.** It excludes food and feed by name.
- **No transferable right is created.** Nothing we build is a financial instrument.

---

## 10. What I need from you

None of this blocks the build. All of it decides what happens after Thursday.

**1. Which of the situations in section 2 have you actually watched happen?**
Not which sounds most promising — which you have personally seen, in a real company, with a
consequence. If none of them are quite right and the real one is something I did not list, that is
the most valuable answer you can give me. I have deliberately not said which one I think it is,
because I would rather have your answer than my own reflected back.

**2. What does your network actually cover?**
This is the question section 7 turns on. I have been assuming it is mostly food and agricultural,
and I now think I assumed that too early.
Your strategy targets ERP and logistics vendors, B2B marketplaces and compliance platforms, which
is not a document you would write if food producers were the only door open to you. A rough split
would change what we do next — some categories sit under dated regulatory deadlines and food does
not. And if any of it reaches the vendors and platforms themselves rather than the producers, that
is the wedge for everything in section 7, and it changes which of the two models we should be in.

**3. Hash anchoring on its own is close to free.**
Open-source tools do it for nothing, and the companies that charge for it are really charging for
certificates, legal weight and integrations wrapped around it. So: is the business the envelope and
its standards position, or something further up the stack? I think this is a real question rather
than a rhetorical one, and your answer changes what we build in October.

**4. The Bosnia story — on a call, not in writing.**
It concerns identifiable companies and this document goes into an AI tool, so I do not want it
typed anywhere. What I want to understand: what exactly was altered, whether it was one branch or
many, how it was eventually discovered, and what it cost. If the answer is that it was found by
accident and took months, that is the strongest argument for this product that either of us has —
and it would be the thing I would build the demo around.

**5. Everything you can find out about what the organisers actually want.**
This is the one where you have an advantage nobody else competing has, and I think it is worth
more than another day of building. Almost nothing is published — there is no hackathon page, no
submission platform listed, and only two bounties named anywhere. So anything you can get from
the people running it is information the other teams will not have:

- What are they hoping to see come out of this? Is there a kind of project they are trying to
  attract, or a gap they want filled?
- Are there more tracks or bounties than the two that are public, and are any of them still being
  decided? If a sponsor is still choosing a theme, that is worth knowing now rather than Wednesday.
- How is it actually judged — a panel, sponsor-by-sponsor, audience vote? Weighted toward working
  code, originality, business case, or ecosystem fit?
- Who are the judges, and what are they into? A judge who builds infrastructure and a judge who
  invests will not be impressed by the same demo, and we can prepare for both if we know.
- What has won there before, and is there anything they are visibly tired of seeing?

Even partial answers change what we prioritise in the last two days. If you can only get one, make
it the judging criteria.
