# Selfish — Product Thesis (v0, pre-research)

> Status: **hypothesis**. Written before the round-1 research landed, deliberately, so that
> the research can falsify it rather than rationalise it. Every claim tagged `[ASSUMPTION]`
> must be confirmed, corrected, or killed in `docs/plan/02-product-plan.md`.

## 1. What we are building

A tasteful iOS app that delivers **produced intimate audio**: high-fidelity, close-mic'd,
binaural narration that helps a listener (a) drop into focus, and (b) explore desire.

The name in the repo — *Selfish* — is the product. It is permission. "Be selfish with your
attention. Be selfish with your pleasure." It carries both use cases without shame and
without either one contaminating the other.

## 2. The naive version of this product, and why it fails

The obvious build is: *user types a fantasy → LLM writes it → TTS speaks it → user listens.*
An AI erotica vending machine. It is the version that demos well in a week. It fails on four
independent axes, and any one of them is fatal:

**It fails App Store review.** Guideline 1.1.4 prohibits "*explicit descriptions or displays
of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional
feelings*". Note that **descriptions** are named explicitly — audio erotica is squarely inside
the definition's scope. The only exit is the final clause: *rather than aesthetic or emotional*.
Story-driven, character-based, emotionally contextualised work has a defensible claim to being
aesthetic and emotional. A prompt box that returns arousal on demand does not — it is, by
construction, content whose sole purpose is erotic stimulation. Worse, user-prompted generation
drags us into Guideline 1.2 (user-generated content: moderation, reporting, blocking
obligations) and Guideline 4.7 (chatbots, which require age restriction via verified or
declared age under 4.7.5). We would be volunteering for the three hardest guidelines at once.

**It fails on quality.** The market's loudest complaint about AI erotica is that it is hollow
and repetitive. Real-time generation means no human editorial pass, no retakes, no audio
post-production — it means shipping first drafts read by a robot. Arousal is destroyed by
uncanniness, and a flat synthetic read is uncanny in exactly the way that matters most.

**It fails on unit economics.** Per-user generation means paying LLM + TTS + GPU costs on every
listen, forever, with a 100% cache miss rate. A subscription business whose marginal cost scales
linearly with engagement punishes its best users.

**It fails on the psychology — and this is the important one.** We have anecdotal evidence that
free-form spicy chat works well for *men*. That is exactly why it is the wrong template. A
prompt box optimises for *access to explicitness on demand*, which is a recognisably male-coded
consumption pattern. `[ASSUMPTION]` The literature on female desire points elsewhere: toward
responsive rather than spontaneous desire, narrative and emotional context over stimulus
intensity, anticipation over explicitness, and being *desired and chosen* over being *serviced*.
If that holds, the prompt box is not merely risky — it is aimed at the wrong target.

## 3. The thesis

> **Put the AI in the supply chain, not in the user's hands.**

We are not building an AI erotica generator. We are building **a boutique audio studio whose
production line happens to be automated**, and shipping its catalogue in a beautiful,
obsessively private player.

The user never sees a prompt box. They see curation, voices they choose, and audio craft so good
it feels like a person is in the room. Everything generative happens upstream, offline, behind a
human editorial gate.

### Why this wins commercially

The incumbent (Dipsea) is human-written and human-voiced. That buys them craft, and it caps
their catalogue. Human production means every hour of audio costs hundreds to low-thousands of
dollars, so their library grows slowly. `[ASSUMPTION — market research must confirm]` The
predictable #1 complaint in this category is therefore *"I've run out of things to listen to"*.

An automated supply chain attacks precisely that ceiling:

|                     | Human studio (incumbent) | Selfish (automated studio) |
| ------------------- | ------------------------ | -------------------------- |
| Cost per audio-hour | High (talent + booth + edit) | Low (LLM + TTS + scripted DSP) |
| Catalogue growth    | Slow, linear in budget   | Fast, limited by editorial review |
| Personalisation     | None — one fixed recording | Combinatorial (voice × POV × intensity × name) |
| Craft ceiling       | Very high                | The thing we must fight for |

So the strategy is: **beat them on catalogue depth and personalisation per dollar, then spend
the savings on matching them on craft.** Craft is the risk, and it is where most of our
engineering effort should go. Not on the AI.

## 4. The four design commitments

### 4.1 Assume she arrives wanting nothing

`[ASSUMPTION]` If desire is substantially *responsive* rather than spontaneous, then opening the
app onto a grid of explicit thumbnails asking "what do you want?" is a design error, because the
honest answer at open time is usually "I don't know yet."

So the front door is not a content grid. It is a question about **how you want to feel**, and the
default path is a *warm-up*: low-stakes, high-care content (being looked after, praise,
attention, ASMR) that builds, then escalates only with permission. The app's core UX belief:

> Arousal is something we help build, not something we assume you brought with you.

This is the single most differentiating idea in the product, and it falls directly out of the
science rather than out of taste.

### 4.2 Personalisation without generation-on-demand

We get the *feeling* of bespoke content from combinatorics, not from live inference. One story is
authored once as a **script family**, then rendered across axes:

- **Voice** — you choose who is speaking to you (the highest-value knob by far)
- **Intensity** — slow burn / warm / explicit, as genuinely re-authored variants, not bleeped text
- **POV & partner gender** — he / she / they
- **Length** — a 6-minute cut and a 20-minute cut
- **Your name**, whispered. A single-word render, spliced at marked points. Trivially cheap,
  disproportionately intimate. `[ASSUMPTION]` Likely the strongest single "how did it know"
  moment available to us.

Combinatorial explosion is managed by **lazy rendering with a permanent cache**: the first
listener to request a given combination triggers the render, everyone after that hits the CDN.
Marginal cost per listen trends to zero as the catalogue warms, which is the opposite of the
naive architecture's economics.

### 4.3 Do the hard DSP offline; ship a dumb player

Binaural intimacy — the sense of a mouth ten centimetres from your ear — is the product's
physical signature. The tempting build is live spatialisation on device, which means native
audio graph work, a custom module, and a permanent maintenance burden.

Instead: **pre-render the binaural mix into ordinary stereo files.** HRTF convolution, breath
placement, ear-to-ear movement, room tone, loudness targeting — all of it happens once, offline,
in a scripted Python/ffmpeg pipeline where we can iterate, A/B, and version it.

The app then only has to play a stereo file well. That collapses the whole "Expo vs native
Swift" debate: with no live DSP requirement, Expo plus a mature track-player library is
sufficient, and "very easy to maintain" is satisfied. All the cleverness sits in a batch
toolchain that cannot page anyone at 3am.

### 4.4 Privacy as a feature, not a policy page

For this category, privacy is not compliance overhead — it is a purchase driver and a retention
driver. The fear is not abstract data misuse; it is *someone finding out*.

- No account required to listen. Account only for sync and billing.
- **Listening history lives on the device.** Recommendations computed on-device from a
  downloaded catalogue metadata blob. For a catalogue of thousands of items this is entirely
  tractable — and it is *less* infrastructure than a server-side recommender, so it makes the
  app both more private and easier to maintain.
- No third-party analytics SDKs. No ad SDKs, ever.
- Alternate app icon and neutral display name.
- Face ID lock. Notifications that never name content.

## 5. Product shape

Two rooms, one engine.

**Focus.** Non-verbal soundscapes for actual work, bookended by a short whispered ritual
(settle in / come back). `[ASSUMPTION]` The irrelevant-speech literature suggests continuous
speech *harms* focused cognitive work, so a "whispered focus session" is likely an
anti-feature — the voice belongs at the boundaries, not underneath the work. Focus is also the
non-explicit surface that the App Store listing must lead with, since Guideline 2.3.8 requires
metadata to suit a 4+ rating regardless of the app's own rating.

**Desire.** The curated catalogue, entered through mood rather than category, with the warm-up
path as the default and intensity as an explicit, user-held dial.

Focus earns the download and the daily habit; Desire earns the subscription. They share the
voice roster, the production pipeline, and the audio signature — so the second room costs
comparatively little to run once the first exists.

## 6. Architecture sketch

```
STUDIO (offline batch, a repo of scripts — not a service)
  taxonomy + story bible
    → LLM: outline → draft → critique/revise   (banned-slop list, style guide)
      → HUMAN EDITORIAL GATE  ← non-negotiable; also the compliance gate
        → structured script JSON (beats, breath, pause, name-slots, intensity variants)
          → TTS render per voice
            → audio post: denoise → EQ → de-ess → comp → near-field HRTF → bed mix → loudness
              → automated QC (loudness, true peak, clipping, gaps, ASR round-trip vs script)
                → encode + publish to CDN + catalogue metadata

APP (Expo + RN track player)
  catalogue metadata (cached locally)  ·  on-device recommendations  ·  stereo playback
  offline downloads  ·  sleep timer + fade  ·  Face ID lock  ·  RevenueCat entitlements

BACKEND (Supabase — deliberately thin)
  catalogue tables  ·  signed CDN URLs  ·  lazy-render job queue  ·  subscription webhooks
```

The ASR round-trip in QC deserves a note: transcribe every rendered file and diff it against the
source script. This catches TTS's most common and most immersion-breaking failure — dropped or
mispronounced words — automatically, at scale, without a human listening to every minute.

## 7. Monetisation

`[ASSUMPTION — payments research must confirm]` Mainstream processors broadly restrict adult
content, which likely rules out Stripe for this catalogue and pushes us to **Apple IAP only**.
That is a constraint, but a clarifying one: IAP-only is less code, less PCI surface, and less
maintenance. Subscription via RevenueCat, with a trial. Price anchored against the category
(~$70/yr territory) rather than invented.

## 8. What must be true for this to work

The honest list of things that could kill it, in order of how much they scare me:

1. **Can synthetic voices actually whisper with enough intimacy to arouse?** If TTS cannot do
   breath, hesitation, and closeness convincingly, the core promise is dead and the fallback is
   a hybrid: real performers plus AI voice conversion, or human talent for hero content.
2. **Do the premium TTS vendors permit adult content at all?** Several likely prohibit it,
   which would force self-hosted open-weight models and change our cost model and quality
   ceiling.
3. **Does Apple tolerate an AI-produced erotic catalogue** even when it is pre-generated and
   human-reviewed? Precedent from AI companion app removals matters enormously here.
4. **Does age-verification law reach audio fiction?** If yes, compliance cost and friction rise
   sharply in several jurisdictions.
5. **Is the writing good enough?** Prose quality is the difference between arousal and
   embarrassment, and LLM prose defaults to cliché.
6. **Will the audience accept AI voices** once they know? Disclosure may be legally required
   under synthetic-media transparency rules, and disclosure may itself dampen response.

Items 1–4 are researched in `docs/research/`. Items 5–6 shape the studio pipeline and the
brand.

## 9. Deliberate non-goals for v1

- No prompt box. No free-text fantasy input.
- No real-time conversational AI companion. (Different product, far worse review risk, and it
  invites parasocial-attachment harms we are not equipped to manage.)
- No user-generated content, no social features, no comments, no sharing of content.
- No video, no images beyond tasteful abstract cover art.
- No Android at launch. One platform, done beautifully.
- No cloned voices of real public figures, ever.
