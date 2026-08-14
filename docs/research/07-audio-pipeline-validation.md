# Audio pipeline validation — measured results

Unlike the other documents in this folder, this one is not a literature review.
It reports what happened when the offline audio pipeline was actually built and
run, because the thesis in `docs/plan/00-product-thesis.md` rests on a technical
claim that deserved testing rather than assertion:

> Pre-render binaural intimacy offline, ship ordinary stereo files, and the iOS
> app stays a simple player with no native DSP module to maintain.

**Verdict: the claim holds.** The pipeline exists, runs, and produces measurably
correct near-field binaural audio. Reproduce with:

```bash
./studio/tools/fetch_hrtf.sh
.venv/bin/python -m studio.tools.validate_chain
```

## What was built

| Module | Role |
| --- | --- |
| `studio/audio/hrtf.py` | KEMAR HRIR loading, near-field compensation, static and moving binaural placement |
| `studio/audio/voice_chain.py` | Intimate-voice chain: EQ, gentle de-essing, light compression, breath emphasis, saturation |
| `studio/audio/beds.py` | Procedural room tone and non-repeating focus soundscapes |
| `studio/audio/master.py` | Bed mixing, loudness targeting, true-peak protection, delivery encoding |
| `studio/audio/qc.py` | Automated defect detection and script-versus-audio transcript verification |

## The near-field problem, and the measured fix

Publicly available HRTF sets are far-field. KEMAR was measured at 1.4 m.
Convolving with it puts a voice in the right *direction* but leaves it sounding
across the room, because the dominant close-range cue is missing: at short
distances the path-length ratio between the two ears diverges sharply, so
interaural level difference grows and — the important part — grows at *low*
frequencies, where far-field ILD is nearly zero.

The renderer therefore adds only the incremental near-field term on top of
KEMAR, below a 1.2 kHz crossover, so nothing is double-applied. Measured output
of that model, in dB of added low-frequency ILD:

| Distance | az 0° | az 30° | az 75° | az 90° |
| --- | --- | --- | --- | --- |
| 0.10 m | 0.00 | 4.18 | 15.57 | 22.43 |
| 0.15 m | 0.00 | 3.51 | 9.58 | 10.51 |
| 0.20 m | 0.00 | 2.80 | 6.65 | 7.06 |
| 0.30 m | 0.00 | 1.85 | 3.95 | 4.13 |
| 0.50 m | 0.00 | 0.95 | 1.91 | 1.98 |
| 1.00 m | 0.00 | 0.21 | 0.42 | 0.44 |
| 1.40 m | 0.00 | 0.00 | 0.00 | 0.00 |

Three properties confirm the model is behaving physically: it contributes
exactly nothing at KEMAR's own 1.4 m measurement distance, exactly nothing
for a source straight ahead at any distance, and it rises steeply as a source
moves close and off to one side — reaching ~22 dB at 10 cm, consistent with the
magnitudes reported in the near-field HRTF literature.

## Measured interaural cues in a finished render

| Placement | Broadband ILD | Low-band ILD | ITD | Channel corr. |
| --- | --- | --- | --- | --- |
| Left, 13 cm, slightly below ear level | −14.88 dB | −14.94 dB | −612 µs | −0.104 |
| Right, 13 cm, slightly below ear level | +14.88 dB | +14.94 dB | +612 µs | −0.104 |
| Ahead, 60 cm | 0.00 dB | 0.00 dB | 0 µs | +1.000 |

ITD of 612 µs sits just inside the human maximum of roughly 700 µs, the left and
right cases are exact mirrors, and channel correlation of −0.10 confirms a
genuine binaural image rather than a mono signal duplicated across two channels.
A centred source correctly produces zero ILD, zero ITD, and correlation 1.0.

For movement, a voice travelling from the left ear to the right across a single
take measured −7.98 dB ILD in its first half and +7.78 dB in its second, with
**zero** sample-to-sample discontinuities above 0.5 — the windowed overlap-add
crossfade between interpolated HRIRs avoids the clicks that naive per-block HRIR
switching produces.

## A real bug this exercise caught

The first run produced broadband ILD of **+2.18 dB** alongside low-band ILD of
**−4.19 dB** for the same source: the two cues disagreed about which side the
voice was on. That is not a subtle imperfection; it is an incoherent spatial
image, and it would have sounded like a voice smeared vaguely inside the
listener's skull — the exact opposite of the product's central sensation.

Cause: the KEMAR compact set's channel order was assumed rather than verified.
Measuring the data directly settled it — for a source at 90°, channel 1 is
14 dB louder and its onset arrives 27 samples earlier, so channel 0 is the
shadowed contralateral ear and channel 1 the ipsilateral one. My loader had the
two the wrong way round, so the far-field HRIR fought the near-field model.

Worth recording because of what it implies for the studio: **spatial defects are
not reliably audible on casual listening, but they are trivially measurable.**
Interaural measurement belongs in automated QC permanently, and it is now there
as the `stereo_correlation` gate.

## Delivery specification (measured)

Mastered to −22 LUFS integrated with a −1.5 dBTP ceiling. Encoding results:

| Codec | Bitrate | Size per minute | 20-minute episode |
| --- | --- | --- | --- |
| AAC-LC | 256 kbps | 1.88 MiB | ~38 MiB |
| Opus | 128 kbps | 1.23 MiB | ~25 MiB |

Two constraints shape this choice. Parametric-stereo modes (HE-AAC v2) must be
avoided outright: they reconstruct the stereo image from a mono downmix plus
side data, which would discard precisely the interaural detail the binaural
render exists to create. And iOS support for Opus through AVFoundation is
patchy, so AAC-LC is the safe delivery codec despite the size penalty.

Offline download budget is a genuine product constraint: at ~38 MiB per episode,
a listener downloading ten episodes spends 380 MiB. Worth testing AAC-LC at
192 kbps against 256 kbps in listening tests before settling.

## Loudness: quiet on purpose

Delivered level is −22 LUFS integrated, far below the ~−16 LUFS podcast norm.
That is deliberate. Broadcast targets assume a listener in a car who needs
everything intelligible; ours is in bed with headphones and the volume already
set. Mastering intimate audio to −16 LUFS makes a whisper as loud as a
conversation, destroying the effect the product sells.

Consequently QC treats loudness *range* as something to protect, failing renders
that fall below 5 LU rather than rewarding consistency.

## Two findings that constrain vendor selection

The validation harness uses espeak-ng as its source. espeak sounds nothing like
a shippable voice, and that is fine — this harness tests signal-processing
correctness, not aesthetics. But two of its limitations turn out to be the same
limitations real TTS vendors have, so the QC gates caught issues that matter:

**1. Sample rate is a hard requirement, not a preference.** espeak outputs
22.05 kHz, an 11 kHz Nyquist limit, and QC flagged that only 0.09% of energy sat
above 8 kHz. ASMR's tingle content lives at roughly 4–16 kHz. Many TTS APIs
return 24 kHz audio, which caps usable content at 12 kHz and silently truncates
the top of that band — no amount of post-processing recovers detail that was
never synthesised. **Any TTS vendor we adopt must deliver 44.1 or 48 kHz.** This
should be treated as a disqualifying criterion in `03-voice-and-tts.md`.

**2. Flat delivery is detectable automatically.** The source measured 1.18 LU of
loudness range and the chain passed it through at 0.96 LU, so the chain is not
the culprit — a monotone read is. Real intimate performance arrives with roughly
8–15 LU. This gives the studio an objective, cheap screen for the single most
likely failure of synthetic narration: technically correct speech delivered
without expressive dynamics. A voice that cannot produce loudness range cannot
produce intimacy, and now we can reject it without a human listening.

## Transcript verification works

Word-error-rate diffing between the source script and an ASR transcript of the
render: 0.0% on a clean transcript, correctly failing at 14.3% on one with words
dropped and mangled the way a bad TTS take does. This is the highest-leverage QC
check available, because dropped and mispronounced words are synthetic speech's
most frequent and most immersion-breaking defect, and this catches them at scale
without a human hearing every minute of output.

## Throughput (measured, single CPU core)

| Stage | Speed | Per 20-minute episode |
| --- | --- | --- |
| Voice chain (EQ, de-ess, compression, breath) | 0.018× realtime | ~22 s |
| Static binaural placement | 0.005× realtime | ~6 s |
| Moving binaural (blockwise, interpolated HRIRs) | 0.046× realtime | ~55 s |

So a finished 20-minute episode costs roughly **90 seconds of single-core CPU**, and the
work is embarrassingly parallel across episodes and variants. Even a 200-episode library
rendered across a dozen voice/intensity combinations is on the order of tens of core-hours
— a few dollars of compute, trivially absorbed by CI or a laptop overnight.

This matters strategically. The envelope followers are per-sample Python loops, which
looked like an obvious bottleneck worth optimising; measured, they are not. Nothing in
audio post-production constrains how fast this catalogue can grow. **The binding
constraint on catalogue growth is human editorial review, not compute** — which is where
tooling investment should go.

## Open items

- KEMAR's licence permits research use; commercial terms need confirming, or
  swap to an explicitly commercially-licensed HRTF set. The renderer takes the
  HRTF directory as a parameter so this is a data swap, not a code change.
- Near-field compensation is a parametric approximation over far-field data.
  Measured near-field HRTF databases exist and would be more accurate; worth
  evaluating, though the parametric approach is already coherent and tunable.
- Everything above is objective measurement. None of it establishes that the
  result *feels* intimate, which requires a real TTS voice and real listeners.
  That is the next validation step, and it needs API credentials.
