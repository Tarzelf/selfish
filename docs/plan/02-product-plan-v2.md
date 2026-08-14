# Product plan v2

> Supersedes `00-product-thesis.md`. That document was written deliberately before the
> research so it could be falsified rather than confirmed. This one is written after six
> research tracks, three adversarial reviews, and a working audio pipeline.

## 0. What changed, and why

Five things in v0 were wrong. Recording them plainly, because the reasoning matters more
than the conclusions.

| v0 said | Evidence | v2 says |
| --- | --- | --- |
| AI-synthesised voices, tastefully done | Real ASMR performers measure **91.8%** unvoiced speech frames; ElevenLabs v3 manages **35.4%**. TTS cannot whisper — it produces *soft voiced speech*, a different acoustic object. Separately, Dipsea reversed a more ethical version of this plan in June 2026 | **Human performers on the microphone.** AI everywhere else |
| Catalogue depth is the wedge | Content volume is a vanity metric; the binding constraints are discovery and merchandising. The incumbents' second-loudest complaint is that their apps are simply *broken* | **Discretion and player craft are the wedge.** Depth is a cost saving |
| Whisper the listener's name as the "how did it know" moment | Persona panel split 2 delighted / 3 unsettled / 1 security concern. It also breaks cache sharing and puts a user's name inside an erotic audio file | Off by default, closed allow-list, pronunciation preview, never synced. Not a launch feature |
| Assume she arrives wanting nothing | Roughly equal proportions of women endorse linear and circular desire models, and circular is over-represented among women *with sexual difficulties* | Warm-up is the **default** path, never the only one. A visible express route always exists |
| No analytics at all | A hard paywall is won by paywall optimisation; tailored paywalls move trial-to-paid ~24%. On-device-only leaves no gradient to improve on, and over-claiming a privacy label is unrecoverable | **Aggregate, identifier-free measurement.** The promise becomes "we never build a profile of what you listen to" — which is true and defensible |

And one thing v0 got right for the wrong reason: it argued against a prompt box on quality and
psychology grounds. The stronger argument is legal. UK OSA s.79(6)(a)(iii) expressly reaches
"pornographic content that is generated on the service by means of an automated tool or
algorithm in response to a prompt by a user and is only visible **or audible** to that user".
A prompt box writes us into the statute by name.

---

## 1. The product

**A private, beautifully-built intimate audio player, with a catalogue produced by human
performers and an automated studio.**

Two rooms sharing one engine and one voice roster:

- **Desire** — human-performed intimate audio, entered by mood, organised by relational
  frame, with intensity, pacing and ASMR profile as user-held dials.
- **Focus** — mostly-wordless soundscapes for work and sleep, bookended by short spoken
  rituals. A genuine second pillar, not a cover story.

### 1.1 The editorial ceiling, stated once and permanently

Apple rates "erotic or sensual dialog" and "implied sexual activity" at 18+. It classes
"explicit, detailed depictions of sexual activity" as content that **cannot be published on
the App Store at any frequency**. There is no infrequent safe harbour.

**So this catalogue is suggestion, tension and sensual dialogue. It is not anatomically
explicit, at any tier, ever.** The very explicit material that felt compelling in early
Grok testing is not distributable, and building toward it would produce a catalogue we
cannot sell.

Worth internalising rather than resenting: the evidence says the variable that matters is
the **ratio of anticipation to explicitness**, not explicitness; that decontextualised
explicitness underperforms for women specifically; and that shame rises with explicitness,
suppressing *reported* arousal. The ceiling and the quality target point the same way.

This is enforced mechanically in `studio/content/lint.py`, tier-aware, as a blocking gate.

---

## 2. The voice architecture

### 2.1 Humans on the microphone, AI everywhere else

Three independent lines of evidence converge on the same answer.

**Physics.** A whisper is aperiodic — the vocal folds do not vibrate. Every architecture
that reliably produces high unvoiced ratios was trained on real whispered speech, and the
only corpus of scale is CC BY-NC (commercially unusable). What TTS gives you when you ask
for a whisper is quiet voiced speech, which is why AI ASMR sounds subtly wrong rather than
merely imperfect.

**Market.** Dipsea used AI voices on <3% of its library with licensed clones of its own
actors, actor-chosen usage, upfront fees *plus* monthly retainers, and in-app "Virtual
Voice" labels — then spent six months re-recording all of it. "100% human" is now an
actively marketed competitive claim, and users review companies favourably for taking that
stand. Listeners treat "AI" as a synonym for "bad" and adjudicate authenticity while
listening.

**Law.** EU AI Act Article 50 has applied since 2 August 2026, so synthetic voice must be
disclosed. We cannot quietly use it, and disclosure is precisely what damages perception.
Notably, AI-*written* fiction carries no equivalent duty.

So the position is the inverse of Dipsea's: **they drew the line at scripts and crossed it
at voices. We cross it at scripts and hold it at voices.** That line is unoccupied, it
satisfies consent/control/compensation in full, and it preserves what the paying audience
says it pays for — "the hitch in a voice actor's breath midway through a recording".

Crucially, the automated pipeline's value is almost entirely intact: research found ~99.8%
of production cost sits in writing and editorial, at **$0.12 of model spend per episode
against $34–83 of human editorial time**. We were never buying much by synthesising voices.

### 2.2 Record beat-by-beat, assemble in the pipeline

This is the design that makes human voices and combinatorial variety compatible, and it is
the technical centrepiece of v2.

Performers record **per beat**, not per episode, against the structured script. The
automated pipeline then owns assembly. What that buys, from a single session:

| Variant axis | Cost after recording |
| --- | --- |
| ASMR profile (`close` / `soft` / `clean`) | **Free** — post-processing only |
| Headphone binaural vs speaker-safe master | **Free** — already built |
| Spatial placement and movement | **Free** |
| Pacing and arc: silence lengths, build rate, total runtime | **Free** — retiming between beats |
| Short cut and long cut | **Free** — beat selection |
| Intensity tier, POV, partner gender | Needs recording |

Two of those matter disproportionately. **ASMR profile control is an accessibility
requirement**, not a nicety — misophonia affects roughly a fifth of the population and the
loudest complaint in competitor reviews is distress, not dislike: *"it's a sensory
nightmare… they need a trigger warning. Tag it."* And **programmable pacing** addresses the
single most repeated craft complaint in the corpus. Both come free from beat-level
recording, and neither is available to a competitor recording whole episodes to a
fixed mix.

So the differentiator is not "more content". It is **the same performance, delivered the
way this particular listener needs to hear it.**

### 2.3 Where synthesis is still used

- Focus beds and procedural soundscapes (no voice, no disclosure issue)
- Name splices, only if a blind seam test passes, from a closed pre-rendered allow-list
- Nothing else, at launch

---

## 3. Priorities, inverted from v0

v0 treated the production pipeline as the moat and craft as the risk. That is backwards.
Ranked by defensibility per unit of effort:

### 3.1 Discretion engineering — the actual differentiator

The word-of-mouth feature is not AI. It is **not playing erotica in your car.**

A Quinn reviewer, verbatim: the app *"will still auto connect and start playing in my car
and with my AirPods"* even when fully closed — and threatens cancellation over it. Another
user could not identify a renewal charge because the billing descriptor did not name the
app. Another created a separate Apple ID to keep purchases off a family account. Three
independent users of two competitors have publicly threatened or executed cancellation over
this, and no competitor has claimed the fix.

It is also, per the dual-control literature, an **arousal mechanism** and not merely a trust
feature: for a large fraction of users the binding constraint is inhibition — fear of
discovery, fear of interruption — and removing brakes is a distinct lever from adding
stimulation. Privacy work is product work here.

The subsystem:

- Never auto-resume on Bluetooth or CarPlay connection. Playback starts only from an
  explicit in-app action.
- No titles or artwork on the lock screen or in Control Center; neutral placeholder only.
- Face ID / passcode lock, with an immediate panic-stop gesture.
- Neutral billing descriptor and neutral IAP display names.
- Notifications off by default, and never containing content titles.
- Listening history on device; no per-user content profile server-side, ever.

One correction from review: **the decoy app icon plan does not survive Guideline 2.3.8**,
which requires alternate icons to be "similar" to the primary. Discretion has to be
achieved through the items above, not through disguise.

### 3.2 Player competence — table stakes nobody has met

Two years of competitor reviews describe missing basics: no autoplay to the next chapter,
no sleep timer, no queue, no search, no favourites, crashes on launch, cancellation
dead-ends. One review: *"This feels like a side project from the pandemic that was
abandoned when the developers went back to work full time."*

Autoplay, queue, sleep timer with fade, search, favourites, reliable offline download,
resume-where-you-left-off, and a working in-app cancel path. None of this is interesting.
All of it is why people cancel.

### 3.3 The pacing engine — the one place generation beats performance

Complaint C2 across the corpus is pacing: escalation arriving too early, scenes ending
abruptly. Because we record per beat, arc shape becomes a *parameter* — a user-visible
control over build rate and length. A competitor with fixed episode recordings cannot
match this without re-recording.

### 3.4 Catalogue depth — last

Useful, cheap, and not a moat.

---

## 4. Distribution is the binding constraint, and it is untested

The single most important finding in the adversarial review, and the one that should
determine sequencing:

**Every major paid acquisition channel is closed by written policy.** Apple Ads Policies
§3.4 prohibits ad content promoting "adult-oriented themes", naming **erotica**
explicitly, and Apple enforces it in its published DSA transparency reports. Meta, Google's
install products and TikTok carry equivalent restrictions. Ads for apps rated 15+ serve only
to 18+ users regardless of targeting.

The obvious workaround — advertise the Focus product — does not survive contact: Apple Ads
permits only creative drawn from approved App Store assets, all major platforms review
landing pages at domain level, and Guideline 2.3.1(a) makes marketing an app by "promoting
content or services that it does not actually offer" grounds for removal *and developer
account termination*. That workaround builds a growth engine on a rule violation.

**Therefore: test organic distribution before building the app.** A six-week test of
whatever organic channels are actually available, with kill thresholds written down *first*.
This is the highest-information, lowest-cost action available, and every engineering
decision below is downstream of it.

Levelling consideration: this constraint binds every competitor equally. It is why Quinn's
celebrity-collaboration playbook exists, and why organic, PR and creator distribution is
the only game in the category. It flattens the field rather than tilting it against us.

---

## 5. Positioning, resolved

Review correctly identified a contradiction: v0 marketed hearr.me's "made only for you"
differentiation on Dipsea's cached-variant cost structure. Those are different businesses
and we cannot claim both.

**Resolution: sell craft and control, not bespokeness.**

> Not "a story made only for you."
> "The same story, told the way you need to hear it tonight."

That is honest about cached combinatorics, it is what the beat-assembly architecture
actually delivers, and it does not promise per-user generation we would have to meter.

Subscription covers the shared catalogue. If genuinely bespoke content is ever offered, it
is metered separately — because per-user generation has per-user marginal cost, which is
exactly why the closest analogue sells credits rather than unlimited.

### 5.1 Store positioning

Lead the listing with the intimate-audio product, in the register the incumbents use, with
wellness as a real second pillar. **The incumbents survive by framing, not hiding**, and
Guideline 2.3.1 requires metadata to reflect the core experience. Metadata itself — screens,
IAP names, icons — must meet a 4+ standard under 2.3.8 even though the app is 18+.

### 5.2 Pricing

Hard paywall, long trial. Hard paywalls convert at 10.7% median day-35 trial-to-paid versus
2.1% freemium with statistically identical 12-month retention; trials of 17–32 days convert
at 42.5% versus 25.5% for sub-4-day trials. So: **30-day trial, Apple IAP only**, anchored
near the category's ~$70/yr. Plus a proactive notification three days before the first
charge — the category's most reputation-destroying failure is a surprise renewal, and a
30-day trial makes that worse, not better.

Apple IAP is not a preference. Stripe prohibits "mature audience content (including
literature… and other media) designed for the purpose of sexual gratification" *and* "any
artificial-intelligence generated content that meets the above criteria"; PayPal and Paddle
concur; RevenueCat's Billing product inherits Stripe. Apple is the only mainstream rail
that will take this business, and IAP-only is simplifying: no PCI surface, no dual-rail
reconciliation.

---

## 6. Architecture

```
STUDIO  (offline batch; a repo of scripts, not a service)
  taxonomy + story bible                        studio/content/taxonomy.py   [built]
    LLM: outline -> beat draft -> cross-family critique -> targeted revision
      deterministic gates: safety / ceiling / craft   studio/content/lint.py  [built]
        HUMAN EDITORIAL GATE  (the compliance boundary and the throughput limit)
          performer records BEAT BY BEAT
            assembly + retiming (arc shape, runtime, cuts)
              voice chain -> binaural -> bed mix -> masters   studio/audio/*   [built]
                automated QC + ASR round-trip                 studio/audio/qc.py [built]
                  encode; publish variants to CDN

APP  (thin by design)
  catalogue metadata cached locally · on-device history and recommendations
  stereo playback · offline download · sleep timer · Face ID · discretion subsystem
  RevenueCat entitlements over Apple IAP

BACKEND  (deliberately minimal)
  catalogue tables · signed CDN URLs · subscription webhooks
  aggregate identifier-free events · NO per-user content profile
```

**No path from the app triggers rendering.** The full variant matrix is pre-rendered before
submission. Client-triggered generation would convert us, simultaneously, into an "AI
generation app" for Apple, a prompt-generation service under OSA s.79(6)(a)(iii), and a
policy problem for our TTS vendor.

### 6.1 What is already built and validated

| Component | Status |
| --- | --- |
| Near-field binaural renderer with measured near-field ILD compensation | Built, measured |
| Intimate voice chain (gentle de-essing, breath emphasis, light compression) | Built |
| Speaker-safe master + mono-compatibility gate | Built, verified |
| Procedural focus soundscapes and room tone | Built |
| Automated QC: loudness, true peak, LRA, silence, spatial collapse, mono fold | Built |
| ASR round-trip transcript verification | Built |
| Safety / ceiling / craft linters | Built, 28 tests |
| Evidence-derived content taxonomy with enforced invariants | Built |

Measured throughput: ~90 s of single-core CPU per finished 20-minute episode. Audio
production is not a bottleneck; **human editorial review is**, which is where tooling
investment belongs.

### 6.2 Client platform

Pending the engineering review's verdict in `docs/debate/03-engineering-review.md`. The
question is not audio — pre-rendering all DSP offline means the app only needs to play a
stereo file well, which Expo can do. The question is whether **Apple's Declared Age Range
API** (`AgeRangeService`, `PermissionKit`, StoreKit age-rating property,
`RESCIND_CONSENT` notifications — all iOS 26.2+ native surface, required even for 18+ apps
in mandated regions since Texas SB 2420 became enforceable on 4 June 2026) forces native
Swift or can live behind a config plugin.

---

## 7. Compliance checklist

| Item | Position |
| --- | --- |
| Age rating | 18+. *Sexual Content or Nudity* = Frequent; **Graphic Sexual Content and Nudity = None** (an editorial commitment, enforced by the linter) |
| In-app age gate | Yes — the compliant pattern is 18+ rating **plus** an in-app gate, as Quinn's declared "Age Assurance" control shows |
| Declared Age Range API | Required in mandated US regions even at 18+ |
| UK | Decide before launch: third-party highly-effective age assurance, or geo-block the intimate tier. Audio is expressly in OSA Part 5 scope; self-declaration is statutorily excluded; **Apple's Declared Age Range API returns declared ages and does not satisfy Ofcom**; penalties reach £18m or 10% of worldwide revenue. This collides with "no account required to listen" and the collision must be resolved deliberately |
| Payments | Apple IAP only |
| TTS/LLM vendors | Never Anthropic, Google, OpenAI, Azure Speech, PlayAI, Resemble, Stability. Note most GPU clouds (Modal, Replicate, Baseten, RunPod, fal) also carry obscenity clauses — self-hosting does not escape ToS diligence |
| Written vendor permission | Required before committing the stack. Policy silence is not permission, and Guideline 5.2.2 lets Apple demand proof |
| AI disclosure | EU AI Act Art. 50 in force since 2 Aug 2026 |
| Performer contracts | Named, paid, per-render royalties, explicit adult-content scope, revocation terms |
| Review notes | Disclose everything, including the ceiling rubric. Guideline 2.3.1(a) prohibits hidden features and carries account-termination language |
| Never produced | Minors, incest, bestiality, real-person likenesses, depictions of actual assault — blocked mechanically, not by policy |

Expect rejection: probability of at least one rejection across the first three submissions
is high, with **metadata** the most likely cause. Budget review cycles into the schedule.

---

## 8. Sequencing

**Phase 0 — falsify the cheap things first.** Nothing here needs an app.

1. Organic acquisition test, six weeks, kill thresholds written first.
2. Measure real vendor TTS against the thresholds the pipeline already enforces (≥8 LU
   loudness range, 44.1/48 kHz output) — an afternoon and some API credits, and it settles
   the residual voice question with data.
3. Record one performer, one script, beat-by-beat. Run it through the built pipeline. Does
   beat assembly and retiming hold together? This is the make-or-break technical test of §2.2.
4. Write the ceiling rubric with worked pass/fail examples.
5. Subscribe to hearr.me and assess it directly. It is running the abandoned thesis in
   production and costs €4.99 to evaluate.

**Phase 1 — the player.** Discretion subsystem and player fundamentals, against a small
hand-made catalogue. Priority-1 tropes only: devotion, being wanted, being taken care of.
The gentlest content is the best evidenced.

**Phase 2 — the studio.** Editorial tooling to raise review throughput, since that is the
binding constraint. Then catalogue depth and the remaining tropes, opt-in machinery before
any gated content ships.

**Phase 3 — decisions deferred on purpose.** UK age assurance, name splices, bespoke
metered content, Android.

### 8.1 Business shape

Model to a **$3–5M ARR ceiling** and capitalise accordingly. $5M ARR needs roughly
85–100k paying subscribers net of Apple's cut — more than the category leader has today.
Quinn's shape is the one to study: $12M+ ARR, $10M raised, **12 staff**. Raising against a
venture growth curve in a category this size is how good products with real users end up
shut down, as Rosy and Emjoy did.

---

## 9. Not building

- No prompt box, no free-text fantasy input, no client-triggered generation.
- No conversational AI companion. Different product, far worse review risk, and it invites
  parasocial-attachment harms we are not equipped to manage.
- No synthetic voices for narration at launch.
- No cycle-phase targeting. The science is contested, between-person variance swamps
  within-person effects, and post-*Dobbs* a cycle model is a privacy liability.
- No UGC, no social features, no sharing.
- No decoy app icon — Guideline 2.3.8 forbids it.
- No Android at launch.
- No cloned voices of real public figures, ever.

---

## 10. The honest risk list

1. **Distribution.** Every paid channel is closed. If organic does not work, nothing else
   matters. Untested — and therefore first.
2. **Beat-level recording may not assemble cleanly.** Retiming between separately recorded
   beats could produce audible seams or inconsistent performance energy. The whole variant
   story depends on it. Testable cheaply, and it is in Phase 0.
3. **The ceiling may cap retention.** We ship suggestion, not explicitness. If power users
   want more, the only answer is a web rail with a high-risk processor and age assurance.
4. **Human performance cost bounds the catalogue** at $700–1,500 per finished audio-hour.
   Beat-level recording helps by multiplying each session, but the constraint is real.
5. **Category size.** The leader shrank ~30% in under two years while owned by a
   subscription-optimisation company. Some of that is company-specific, not all.
6. **Age assurance may force native Swift** and a materially larger maintenance burden than
   "very easy to maintain" allows.
