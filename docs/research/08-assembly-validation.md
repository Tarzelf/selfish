# Beat assembly validation — measured results

Tests the architectural bet the v2 plan rests on. Reproduce with:

```bash
.venv/bin/python -m studio.tools.validate_assembly
```

## The claim

Human performers are required (TTS cannot produce a true whisper, and the market has
rejected synthetic voices in this category), but recording whole episodes to a fixed mix
means every variant needs another session — which is what makes the incumbents' catalogues
expensive and shallow.

The proposed escape: **record beat by beat, and let software own assembly.** If that works,
one session yields many deliveries — different pacing arcs, spatial treatments, ASMR
profiles, runtimes and cuts.

**Verdict: the mechanism works.** The measurements below are of the assembly, not of
artistry; espeak stands in for a performer, so nothing here says the result is *moving*.

## Three arcs from one set of recordings

Ten beats, 63.3 s of fixed speech content, deliberately mis-levelled by up to 4.23 dB
between takes to give loudness matching something to do.

| Arc | Runtime | Worst join step | Arc level range | Level error vs target | Distance | Pause |
| --- | --- | --- | --- | --- | --- | --- |
| unhurried | 79.30 s | 0.22009 | 2.00 LU | **0.000 LU** | 0.35 → 0.20 m | 2.64 → 1.34 s |
| slow_burn | 73.79 s | 0.21531 | 3.00 LU | **0.000 LU** | 0.30 → 0.13 m | 1.92 → 0.72 s |
| direct | 69.35 s | 0.21227 | 1.50 LU | **0.000 LU** | 0.18 → 0.12 m | 0.96 → 0.56 s |

The separation between the last two columns is the point. "Arc level range" is the change the
arc *deliberately* composes across the story; "level error" is how far any beat missed the
level it was asked for. Intended variation of 1.5–3 LU with zero unintended deviation means
level movement reads as performance rather than as inconsistent takes.

The distance column is the feature that only exists because placement is decided per beat:
the voice moves from roughly arm's length to a few centimetres over the course of an episode.
That is a physical sensation of someone leaning in, and a competitor recording whole episodes
to a fixed mix cannot produce it without re-recording.

## Are the joins audible?

| Measure | Value |
| --- | --- |
| Worst single-sample step at any join | 0.21531 |
| 99.99th percentile step across the episode | 0.17750 |
| Maximum step anywhere in the episode | 0.33100 |

Joins are not outliers against the episode's own signal — the largest step at a join is
smaller than the largest step occurring naturally elsewhere. A click would appear as a step
far above the surrounding audio. The 18 ms equal-power crossfades are doing their job.

## The room tone is doing the real work

| Condition | Background floor between lines |
| --- | --- |
| No bed | −240.00 dB (digital silence) |
| Continuous bed | −59.64 dB |

Without a bed, every gap is true digital silence, so each join announces itself as the room
appearing and disappearing — the single most recognisable signature of spliced audio. With a
continuous bed spanning the whole episode, the room is always present and only the voice is
discontinuous, which is exactly what the ear expects when a person pauses.

**This is why the bed is not decorative.** It is the mechanism that makes beat-level
recording viable at all.

## Runtime targeting

| Requested | Produced | Error |
| --- | --- | --- |
| 95.0 s | 94.84 s | −0.16 s |
| 150.0 s | 149.84 s | −0.16 s |
| 210.0 s | 209.84 s | −0.16 s |

Only silence is negotiable — speech length is fixed — so a target below the total speech
duration cannot be met. That belongs in studio-side validation rather than arriving as a
surprise.

## Delivery

Both masters produced from the same assembly: headphone (binaural) at −22.0 LUFS, and
speaker-safe at −18 LUFS target. The speaker master reported a 2.17 dB loudness shortfall
because it reached the true-peak ceiling before its target — which is now surfaced explicitly
rather than swallowed, since a phone speaker has no level to spare. Real limiting on that
master is an open item.

## What this does not establish

Everything above is mechanical. The open question is whether a *human performance* survives
being cut into beats and reassembled — whether the emotional energy carries across a join
that the ear accepts but the listener still feels as a discontinuity, and whether a performer
can deliver beat 7 of an intimate scene in isolation with the right accumulated charge.

That is a question for one performer, one script, and an afternoon. It is Phase 0 item 3 in
`docs/plan/02-product-plan-v2.md`, and it is the highest-value experiment remaining.

There is a plausible mitigation if isolated beats prove flat: record the episode
**continuously**, then segment at the pauses in post. The performer keeps a whole-scene arc,
and assembly still gets independent beats to retime and re-place. Worth testing alongside.
