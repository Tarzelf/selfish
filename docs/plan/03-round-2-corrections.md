# Round 2 — what the final research wave changed

Plan v2 was written while three research tracks and one review were still running.
This records what they changed when they landed, so the plan's history stays legible
rather than being quietly overwritten.

Four items contradicted code that was already written. Those are fixed. Two are
unresolved challenges to the plan's central decision, and are stated as such.

---

## 1. Corrected in code

### 1.1 The brightness assumption was backwards

The pipeline boosted presence at 3.4 kHz and added an air shelf, on the standard
premise that ASMR tingles live in 4–16 kHz sibilance. Three studies point the other
way — Barratt (2017), listeners preferred lower-pitched ASMR 56% to 12%; Kondo
(2019), effective material sits below a 1.5 kHz spectral centroid; Terashima (2024),
*lower* 5 kHz envelope amplitude predicted *stronger* tingling at r = 0.52.

The useful distinction is **bandwidth versus brightness**, and conflating them was
the actual error:

- **Bandwidth is a defect question.** A 24 kHz source or an over-lossy encode
  imposes a ceiling nothing downstream can undo. QC now measures where spectral
  content stops and *fails* below 12 kHz, replacing a vague "may lack ASMR detail"
  warning with a diagnosis. It correctly fails espeak's 8.7 kHz ceiling.
- **Brightness is an aesthetic choice**, and the evidence says not to. Defaults are
  now warm: no air boost, and −2 dB at 3.2 kHz where close speech turns harsh.

The old curve survives as `VoicePreset.bright()` rather than being deleted. The
studies are small and mostly on non-speech triggers; the practitioners are numerous
but uncontrolled. That is a question for a listening test, not for whichever source
was read last.

### 1.2 There is now a number for "is this actually a whisper"

The single most useful measurement to come out of the whole research effort, and it
was buildable immediately. A whisper is *aperiodic* — the folds do not vibrate — so
the share of active speech frames with no detectable fundamental separates real from
synthetic decisively: real performers 91.8%, best commercial TTS 35.4%.

`studio/audio/voicing.py` implements it. Validated against known signals:

| Signal | Unvoiced ratio | Verdict |
| --- | --- | --- |
| Harmonic stack (clearly voiced) | 0.074 | voiced speech, not a whisper |
| Band-shaped noise (clearly whispered) | 1.000 | genuine whisper |
| **Harmonics + noise (a convincing fake)** | **0.074** | **voiced speech, not a whisper** |
| espeak-ng | 0.204 | voiced speech, not a whisper |

The third row is why this exists. A breathy fake whisper passes every level,
spectral and spatial check in the suite; this is the only gate that catches it. And
espeak landing at 0.204, just below the published 0.255–0.354 range for commercial
engines, is a reasonable sanity check on the implementation.

Operationally it becomes the acceptance test for any voice source — before a
performer is booked or a vendor is paid — and it lets a director give feedback on a
take that is a number rather than "breathier, please".

### 1.3 Two plan features contradicted the wellbeing evidence

- **Trigger-warning interstitials before playback: do not build.** Meta-analysis
  finds they raise anticipatory distress (d = 0.43) without changing the response.
  Tag structurally and gate by opt-in instead. The taxonomy's `warnings` field is
  therefore filtering and browse metadata, never a pre-playback modal.
- **Autoplay needs splitting in two.** Plan v2 §3.2 lists autoplay among the player
  fundamentals competitors lack, which the market evidence supports. The wellbeing
  evidence says no autoplay, streaks or infinite feed on sexual content. Both are
  right about different things: continuing to the next chapter *of a story the user
  chose* is the missing feature; queueing an endless stream of new sexual content is
  not. Autoplay is scoped to within-story continuation only.

### 1.4 Dependencies are pinned, and the KEMAR licence question is closed

The pipeline promised reproducible renders while depending on unpinned scipy, whose
filter defaults could silently change every master. Now pinned to the tested set.

And the open HRTF licensing item has an answer: **SADIE II is Apache 2.0**, so the
commercial ambiguity around KEMAR is avoidable by swapping datasets — which the
renderer already supports, since it takes the HRTF directory as a parameter.

Two further confirmations worth recording: an independent implementation of the
near-field model (Duda & Martens rigid sphere) measured +10.48 dB of added low-band
ILD against a predicted +10.5, converging with this pipeline's approach; and
ffmpeg's `sofalizer` provides SOFA convolution directly, which is a simpler path if
the custom renderer ever becomes a maintenance burden.

---

## 2. Unresolved challenges to the plan's central decision

These are not fixed, because they should not be fixed quietly.

### 2.1 AI-written scripts tested *worse* than AI voices

The persona panel scored disclosed AI provenance as the concept's worst element —
and **AI-written scripts scored worse than AI-voiced narration (−5 versus −4)**.

That is the opposite of the industry's assumption, the opposite of where Dipsea drew
its line, and a direct challenge to plan v2, which moved AI *into* scripts on the
grounds that voices were the sensitive half. If the panel is right, v2 kept the more
damaging half of the pipeline and discarded the less damaging one.

Three things bear on it, and none settles it:

1. The panel is composites built on real review language, not real users. It is a
   hypothesis generator, not evidence.
2. The disclosure asymmetry is real and favours v2 regardless of preference: EU AI
   Act Article 50 compels disclosure of synthetic *voice*, and there is no equivalent
   duty for AI-assisted *prose*. So the label penalty attaches to voice whether or
   not the sentiment penalty does.
3. Every credible mitigation runs through the same place: a **named human editor and
   named performers**, with AI positioned as a drafting tool rather than an author.
   That is also what the panel says drives word of mouth — its likeliest recommenders
   recommend by proper noun, a named voice or a named story, which a faceless
   generated catalogue cannot supply.

**Action: this is a question for the Phase 0 organic test, not for another debate.**
The cheapest resolution is to publish sample episodes under both framings and measure
which one people actually share. Until then the plan holds, with credited humans on
both the writing and the performing.

### 2.2 ASMR may need to be a separate, explicitly non-sexual surface

The desire research reports that only ~5% of people use ASMR sexually and 84% reject
the sexual framing. Plan v2 treats intimacy and ASMR as one aesthetic with a
user-controlled mouth-sound profile. If the framing collision is as strong as that
figure suggests, the ASMR audience may be actively repelled by proximity to the
Desire room — which would argue for Focus and Desire being more separated than
planned, possibly to the point of distinct brands.

This interacts with the App Store positioning decision (lead with the intimate
product, per the red team) and with the name question, so it should be resolved as
one decision rather than three.

---

## 3. Smaller corrections

| Item | Correction |
| --- | --- |
| **Expo audio libraries** | `expo-av` was removed in SDK 55; react-native-track-player V4 is frozen and V5 is now €999/yr commercial. The "mature free track player" the plan assumed does not exist. Use `expo-audio` plus the ~250-line session shim |
| **Name candidates** | The panel recommends testing *Quiet Hours*, *Undivided* and *Nearer* against holding "Selfish" — with low-desire and lives-with-family users, not enthusiasts |
| **Storage** | The full 7,200-variant grid is $3.40/month on R2. Storage was never the constraint; performer time is |
| **Loudness target** | Independent recommendation is −23 LUFS against our −22, and measured that ffmpeg's `loudnorm` costs 2.5 LU of dynamic range *and* misses its target — which validates the custom normaliser |
| **Encoding** | AAC-LC 192 kbps measured sufficient (~15 MB per 10 min); 96 kbps introduced 1.1 dB of low-band ILD error, damaging the proximity cue specifically. Revise the 256 kbps assumption down |
| **Head tracking** | Skip it. A whisper that follows your head is more intimate than one anchored to the room, and the use case is lying down with eyes closed |
| **Voice licensing** | Perpetual buyout explicitly covering synthetic reproduction *and* adult content, ~$1,500–4,000 per voice. Owning the dataset means no vendor policy change can strand a character |
| **Non-verbal library** | Record a per-voice library of inhales, sighs, swallows, lip parts and smiles, composited in post on every asset. Cheap, fully owned, backend-agnostic — and named as the highest-leverage item in the voice research |
| **Licence traps** | XTTS-v2 (non-commercial in perpetuity, no living counterparty), so-vits-svc (AGPL), Fish S2 Pro weights, Voxtral, Higgs **v3** — all unusable. Seed-VC (MIT), Qwen3-TTS (Apache 2.0) and Higgs **v2** (Apache 2.0) are clean |
| **Life stage** | Postpartum (41–83% report difficulty) and perimenopause are the largest unserved needs in a category built for 25–34s, and the taxonomy does not yet address them. A genuine gap, and it sits naturally beside the best-evidenced trope we already lead with — being taken care of |
| **TikTok ad policy** | Names **audio** explicitly: "sexually explicit content, text, and audio are not allowed", and bans merely suggestive content too |
