# Research synthesis — the decision brief

Seven research documents, condensed to what actually changes the product. Read this
one; go to `docs/research/` for evidence and citations.

The headline: **the original concept survives, but three of its central assumptions were
wrong, and one of them was wrong in a way that would have produced a product that could
not be sold.**

---

## 1. The five findings that reshape the product

### 1.1 There is a hard ceiling on explicitness, and it is lower than instinct suggests

Apple's age-rating taxonomy has two adjacent tiers, and the boundary between them is the
most important line in this entire project:

| Descriptor | Definition | Outcome |
| --- | --- | --- |
| *Sexual Content or Nudity* | "**Non-explicit** depictions of sexual behavior… mild romantic intimacy, **implied sexual activity, or erotic or sensual dialog**" | *Frequent* → **18+, publishable** |
| *Graphic Sexual Content and Nudity* | "**Explicit, detailed depictions** of sexual activity… pornographic portrayals of sex" | Any frequency → **Unrated, "can't be published on the App Store"** |

There is no "infrequent" safe harbour on the second row. Answering anything but *None* to
the graphic-sexual-content question makes the app undistributable. Guideline 1.1.4 points
the same way, and note that it bans "explicit **descriptions**" — "we have no visuals" is
not a defence for audio.

**So the shippable register is suggestion, tension and sensual dialogue — not anatomical
explicitness.** This directly contradicts the starting instinct. The very explicit
Grok-generated material that felt "scarily good" in testing is *not* what can ship on the
App Store, and building toward it would produce a catalogue we cannot distribute.

Two independent research tracks reached this conclusion separately, and both noted the
same consolation, which is worth taking seriously rather than treating as a concession:
**the constrained register is also the better product.** The category's loudest complaint
about AI erotica is that it is hollow and mechanical, and mechanical is exactly what
anatomical description produces. Anticipation, restraint and subtext are what the evidence
says this audience responds to, and they are what a language model can be pushed to do
well. The constraint and the quality target point the same direction.

### 1.2 No commercial TTS can actually whisper — this is now measured, not anecdotal

The biggest technical risk resolved against the naive plan. A Jan 2026 paper (DeepASMR,
SJTU) measured *Global Unvoiced Ratio* — the share of speech frames with no detectable
vocal-fold vibration — for real ASMR performers versus leading models:

| Source | Unvoiced ratio |
| --- | --- |
| Real human ASMR performers | **91.8%** |
| ElevenLabs v3 | 35.4% |
| MiniMax speech-hd-02 | 25.5% |

A true whisper is *aperiodic*: the vocal folds do not vibrate. What commercial TTS produces
when asked to whisper is **soft voiced speech**, which is a categorically different acoustic
object. That is precisely why AI "ASMR" sounds subtly wrong — the physics of the thing that
causes tingles is absent, not merely imperfect.

The same research found the asymmetry that solves it. Normal→whisper conversion fails
badly (14.0% unvoiced). But **whisper→character conversion over-preserves breathiness**
(56–66% unvoiced when the source was a real whisper). Feed a genuine whispered human
performance into voice conversion and the aperiodic texture survives.

**Therefore the voice architecture must have a human spine.** Not for ethics — for physics.

### 1.3 The category leader tried AI voices with best-practice ethics and reversed it

Dipsea used AI voices on under 3% of its catalogue, with about the best consent story
available: licensed clones of *its own* actors, actors choosing how their voice was used,
an upfront fee **plus a monthly retainer**, human recording continuing in parallel, and a
"Virtual Voice" label on every AI item in the app. In June 2026 it completed six months of
re-recording everything with humans to become "100% AI-free", and published a post about
why.

If that configuration was indefensible for the incumbent, "AI voices, tastefully done" is
not a positioning. Combined with 1.2, the conclusion is the same from two directions:
**AI-as-substitute-for-performers is both technically inadequate and commercially toxic in
this category.**

The defensible line — which is also honest — is that AI does the thing a fixed recording
*cannot* do: multiply one paid human performance across characters, tiers and variants, and
personalise. Humans are not displaced; they are the source, and they are paid for the
capability.

### 1.4 Nobody will process payments for this except Apple

Stripe's prohibited list explicitly covers "pornography and other mature audience content
(including **literature, imagery, and other media**) designed for the purpose of sexual
gratification" and, separately, "any **artificial-intelligence generated content** that
meets the above criteria." PayPal and Paddle prohibit it too. RevenueCat's *Billing*
product inherits Stripe's position.

Apple IAP has no adult-content restriction, and Dipsea and Quinn both run IAP subscriptions
today. So: **Apple IAP is the only mainstream rail**, and RevenueCat's mobile SDK is fine
because it never touches the money. The 15–30% is the cost of being the only processor that
will take this business. A web rail, if ever wanted, means a high-risk adult processor at
10–15% plus registration fees.

This is simplifying. IAP-only means less payment code, no PCI surface, and no dual-rail
reconciliation.

### 1.5 Six AI vendors prohibit this outright, and so do most GPU clouds

| Prohibited | Usable |
| --- | --- |
| Anthropic · Google (Gemini/Vertex) · OpenAI · Azure Speech · PlayAI · Resemble AI · Stability | ElevenLabs (no blanket ban, but "sole discretion") · AWS Polly (no adult clause) · Mistral open weights (Apache 2.0, AUP excludes open weights) · xAI Grok (no fictional-adult clause) |

Azure's is worth quoting because it is broader than the others: it bans "the use of
Microsoft AI Services **in applications that are sexually explicit**" — so clean input does
not help.

And the trap: **Modal, Replicate, Baseten, RunPod and fal all carry obscenity/pornography
clauses**, so "just self-host an open model" does not escape the ToS problem on mainstream
GPU clouds. Compute needs its own diligence.

---

## 2. What the science says to build

The desire research is the highest-quality document in the set, and it corrected my thesis
in one important place.

**I over-applied responsive desire.** My draft assumed the user always arrives wanting
nothing. The evidence is more careful: Sand & Fisher found roughly equal proportions of
women endorsing the Masters & Johnson, Kaplan and Basson models, and Basson-endorsers had
*lower* sexual-function scores — so the circular/responsive model "may best reflect women
with sexual concerns rather than a single normative response pattern."

The correct stance: **never assume she arrives already wanting sex, and never make her feel
abnormal either way.** A warm-up path as the *default* is right; a warm-up path as the
*only* route is wrong and will irritate users with spontaneous desire. Offer both, make the
express route obvious.

**Inhibition is often the binding constraint, not insufficient stimulation.** Dual-control
research says that for a meaningful fraction of users the brakes matter more than the
accelerator: self-consciousness, fear of interruption, fear of discovery, performance
concern. Adding more intensity does nothing for them; removing brakes does.

This promotes privacy and discretion from "trust-building" to **a primary arousal
mechanism**. The discretion engineering is not a compliance feature sitting beside the
product; it is part of how the product works.

**Relational frame beats physical detail.** Who the voice is *to the listener* predicts
response better than any anatomical specificity. Stranger and established-partner frames
both perform well; the "friend" frame underperforms; and vague, unplaced narrators are
weakest of all. So the catalogue should be organised by **relational frame**, not by act.

**The anchor context is bed, at night, in the dark.** Which means: one-handed or no-handed
operation, minimal decision load, no bright screens, gentle endings that do not jolt
someone out of a pre-sleep state — and a genuine **speaker-mode mix**, because a binaural
headphone mix collapses on a phone speaker. That last point has a direct pipeline
consequence (see §5).

**Hurt/comfort is the single most popular trope**, by a wide margin, in the largest
revealed-preference corpus available (AO3 canonical tag usage over a year: Hurt/Comfort
278,299; Slow Burn 110,596; Emotional Hurt/Comfort 73,519; Friends to Lovers 68,393;
Enemies to Lovers 49,106). The most-wanted content in this space is about **being cared
for**. That is a striking and useful fact: it means the gentlest content is also the most
commercial, and the warm-up path is not a ramp toward the real product — for many users it
*is* the product.

**Consensual non-consent needs building and needs handling.** Prevalence is high (Bivona &
Critelli: 62% of women report having had such a fantasy) but valence is mixed: 45%
experience them as wholly erotic, **46% as both erotic and aversive**, 9% wholly aversive.
The operative mechanism is *control over the terms*. And 37% of women in Lehmiller's sample
reported a history of sexual victimisation. Conclusion: build it, but only behind explicit
opt-in, never in a default, autoplay, or algorithmically surfaced position.

**Do not build cycle-phase targeting.** The science is contested, between-person variance
swamps within-person cycle effects, and post-*Dobbs* a cycle model is a privacy liability.
A tempting feature, correctly killed before it was specced.

---

## 3. What the market says

**The category is real but smaller than the coverage implies, and the leader is shrinking.**
Dipsea went from ~93,847 subscribers / ~$6M ARR (Sept 2024) to 65,592 / $4.14M (Aug 2026) —
roughly −30% — under the ownership of a company whose entire business is subscription
optimisation. Quinn is the healthy one: **$12M+ ARR on $10M raised, with 12 staff.**
femtasy is around €9M. Emjoy, Ferly and Bloom are stale or zombie; Rosy shut down in Nov
2025; Tingles died. Plan for a low-tens-of-millions ceiling, not a land grab. Quinn's
12-person/$12M shape is the model to study.

**The top two complaints are both things we can actually beat.** First, catalogues run dry —
"same content pinned for months". Second, and startling in volume: the apps are just
*broken*. No autoplay to the next chapter, no sleep timer, no queue, no search or
favourites, crashes, cancellation dead-ends. One Emjoy review: *"This feels like a side
project from the pandemic that was abandoned when the developers went back to work
full time."*

That second complaint is the cheapest wedge available. A competent, polished player is
table stakes that nobody has met.

**Discretion failures are a live cancellation reason.** A Quinn reviewer: the app
*"will still auto connect and start playing in my car and with my AirPods"* even when fully
closed — and says they will cancel over it. A Bloom user could not identify a renewal charge
because the billing descriptor did not say Bloom. Another writer created a separate Apple ID
to keep purchases off a family account. Nobody has deliberately assembled the discretion
feature set.

**ASMR is polarising, and must be controllable rather than baked in.** From an Emjoy
review: *"The kissing sounds are getting louder and wetter and it's a sensory nightmare.
I'm not joking - they need a trigger warning. The world is pretty split on ASMR, some love
it and some hate it. Tag it."* Meanwhile a Dipsea reviewer complained of the opposite — that
recordings sound like *"the actors are in big, empty, white rooms."* Both complaints are
about the same missing control.

**Hard paywall, long trial.** RevenueCat's 2026 dataset (115,000+ apps): hard paywalls
convert at 10.7% median day-35 trial-to-paid versus 2.1% for freemium, and produce ~8×
revenue per install by day 60, with statistically identical 12-month retention. Trials of
17–32 days convert at 42.5% versus 25.5% for sub-4-day trials. femtasy runs a 30-day trial.

**The closest analogue sells credits, not unlimited.** hearr.me generates personalised
erotic audio on demand and prices it as €4.99 one-off, €12.99/mo for 10 audios, €29.95/mo
for 30 — because per-user generation has per-user marginal cost. This is a real constraint
on the personalisation story and is addressed in §4.

---

## 4. The economics, corrected

| Line item | Figure |
| --- | --- |
| LLM script generation | **~$0.12 per 15-min episode** (~$25 for 200 episodes) |
| Human editorial pass | **$34–83 per episode** |
| Licensed human style exemplars (one-time) | $7k–25k |
| Synthetic voice rendering | $0.60–10 per finished audio-hour |
| Human intimate voice performance | **$700–1,500 per finished audio-hour** |
| Audio post-production compute | ~90 seconds of CPU per 20-min episode (measured) |

Two conclusions fall out.

**The AI is free and the humans are not.** LLM cost is a rounding error; editorial review
and voice performance dominate. So **catalogue growth is bound by human editorial
throughput**, not by compute or tokens. Engineering effort should therefore go into
*editorial tooling* — making review fast, making regeneration targeted, making the linters
catch everything a human would otherwise catch by reading. That is a very different
priority list from "scale the generation."

**Cacheable variants and bespoke generation are different businesses.** A variant shared
across all users amortises to zero. A story unique to one user never does. So:
subscription covers the shared catalogue; anything genuinely bespoke is metered. hearr.me's
credit model is not a quirk, it is arithmetic.

---

## 5. Consequences for the already-built audio pipeline

The offline pipeline in `studio/audio/` is validated and its central bet holds — but the
research adds two requirements it does not yet meet.

**A speaker-safe mix is mandatory, not optional.** The anchor listening context is bed at
night, and a meaningful share of that is phone speaker, not headphones. A near-field
binaural render is *designed* around interaural difference; played on a speaker it
collapses and can sound thin or phasey. We need at least two masters per episode —
`headphones` (binaural) and `speaker` (mono-safe, no HRTF, gentler EQ) — with the app
choosing by output route.

**Mouth-sound and ambience intensity must be user-controllable.** Given ASMR's polarity,
one baked mix cannot serve both the listener who wants wet closeness and the one for whom
it is "a sensory nightmare". Two implementable options, in order of preference:

1. **Render mix variants** (`intimate` / `clean`) and pick at download time. Keeps the app a
   dumb single-stream player. Costs storage.
2. **Ship stems** (voice + ambience) and mix on device with a gain control. More flexible,
   but requires synchronised multi-stream playback and pushes complexity into the client.

Option 1 preserves the architecture that makes the app maintainable, so it is the default
unless listening tests demand otherwise.

---

## 6. What still needs answering

1. **Can a human whisper plus voice conversion actually hold up?** The measurements say the
   physics survives conversion. Nobody has confirmed it *sounds* right. This is the single
   most important experiment to run, and it needs a real performer and API credentials.
2. **Does the ceiling register still satisfy users?** We are shipping suggestion, not
   explicitness. If the audience's power users want more, we cap our own retention — and the
   web rail is the only answer, with all its payment consequences.
3. **How much of the age-assurance stack is actually required at launch,** and can it be
   built in Expo? Texas SB 2420 has been enforceable since 4 June 2026 and Apple says the
   Declared Age Range API is required *even for 18+ apps* in regions where law demands it.
   This is native iOS 26.2+ API surface and it is the biggest threat to the "Expo, easy to
   maintain" premise. Under review in `docs/debate/03-engineering-review.md`.
4. **Whether "audio fiction" is caught by UK OSA Part 5 and US state AV statutes.** Audio is
   explicitly in OSA scope and Texas's statute says "**describes**, displays, or depicts".
   Whether *our* catalogue is "produced solely or principally for the purpose of sexual
   arousal" depends on how much of it is calm/sleep content — which makes the Focus room a
   legal argument as well as a product one. Needs counsel.
5. **How this gets acquired.** Most ad platforms restrict sexual-wellness advertising. If
   paid acquisition is closed, the go-to-market has to be organic, and that changes
   everything about the plan. Under review in `docs/debate/01-red-team.md`.
