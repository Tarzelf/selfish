# selfish

Research, plan and production toolchain for a high-fidelity intimate audio app for iOS.

Two rooms, one engine: **Focus** (mostly-wordless soundscapes for work and sleep) and
**Desire** (human-performed intimate audio, organised by relational frame, with intensity,
pacing and ASMR profile as user-held dials).

The iOS client does not exist yet. What exists is the research that decides what to build,
and the offline studio pipeline that produces the audio.

## Start here

| Document | What it is |
| --- | --- |
| [`docs/plan/02-product-plan-v2.md`](docs/plan/02-product-plan-v2.md) | **The plan.** Read this one |
| [`docs/plan/03-round-2-corrections.md`](docs/plan/03-round-2-corrections.md) | What the final research wave changed, including two unresolved challenges to the plan |
| [`docs/plan/01-research-synthesis.md`](docs/plan/01-research-synthesis.md) | Eight research tracks condensed to the decisions they force |
| [`docs/plan/00-product-thesis.md`](docs/plan/00-product-thesis.md) | The original hypothesis, kept unedited so the reversals are visible |

## The five findings that shaped it

1. **There is a hard ceiling on explicitness.** Apple rates "erotic or sensual dialog" at 18+
   but classes "explicit, detailed depictions" as unpublishable at any frequency. The
   catalogue is suggestion and tension, not anatomy — and the evidence says that is also the
   better product, because the variable that matters is the ratio of anticipation to
   explicitness.
2. **No commercial TTS can whisper.** Real ASMR performers measure 91.8% unvoiced speech
   frames; the best commercial model manages 35.4%. A whisper is aperiodic, and what TTS
   produces is soft *voiced* speech — a different acoustic object. Hence human performers.
3. **The category leader tried AI voices with best-practice consent and reversed it** in June
   2026. So: AI writes and edits and masters; humans speak. That line is unoccupied, and it
   is the inverse of the one Dipsea drew.
4. **Every paid acquisition channel is closed by written policy** — Apple's ad policy names
   "erotica" explicitly. Distribution, not production, is the binding constraint, and it is
   the first thing to test.
5. **The differentiating feature is not AI. It is not playing erotica in your car.** Multiple
   users of competing apps have publicly threatened cancellation over exactly that, and
   nobody has claimed the fix.

## The studio

Everything expensive or clever happens offline, in batch, so the app stays a stereo player
with no native DSP to maintain.

```
studio/
  audio/
    hrtf.py         near-field binaural rendering (KEMAR + near-field ILD compensation)
    voice_chain.py  intimate voice chain: gentle de-essing, breath emphasis, light compression
    assemble.py     beat-level assembly with programmable pacing arcs
    beds.py         procedural room tone and non-repeating focus soundscapes
    master.py       bed mixing, loudness targeting, speaker-safe folding, encoding
    qc.py           automated defect detection and script-versus-audio verification
  content/
    taxonomy.py     the content model, with safety invariants enforced in code
    lint.py         safety, App Store ceiling, and prose-craft gates
  tools/
    fetch_hrtf.sh       download the HRTF dataset
    validate_chain.py   end-to-end signal-chain validation, with measurements
    validate_assembly.py beat-assembly validation, with measurements
```

Three deliberate inversions of normal practice, all explained in the source:

- **Do not master to −16 LUFS.** Podcast levels make a whisper as loud as a conversation.
  Delivery is −22 LUFS with loudness *range* protected rather than minimised.
- **Do not de-ess hard.** Capped at a few dB, because heavy de-essing removes detail the
  product is selling.
- **Do not brighten.** This one reverses most ASMR mixing guidance. Three studies find lower
  spectral centroid and *lower* 5 kHz envelope amplitude predict stronger tingling, so the
  defaults are warm. Bandwidth is still preserved end to end and QC fails a truncated source —
  losing the high band and choosing not to emphasise it are different acts. The conventional
  bright curve is kept as `VoicePreset.bright()` for a listening test.

`studio/audio/voicing.py` deserves separate mention: it measures the share of speech frames
with no detectable fundamental, which is what separates a real whisper (91.8% in published
measurement of real performers) from the soft *voiced* speech a synthesiser returns when asked
to whisper (35.4%). It is the only gate here that a convincingly breathy fake fails, and it is
the acceptance test for any voice source before a performer is booked or a vendor is paid.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
./studio/tools/fetch_hrtf.sh          # MIT KEMAR; see licence note in the script
sudo apt-get install -y espeak-ng     # placeholder voice for the validators only
```

## Verify

```bash
.venv/bin/python -m pytest studio/ -q            # 79 tests
.venv/bin/python -m studio.tools.validate_chain
.venv/bin/python -m studio.tools.validate_assembly
```

Both validators print measurements rather than assertions of success, and both use espeak as
their voice source. espeak sounds nothing like a shippable performance, which is the point:
these harnesses test signal-processing correctness, not artistry. They will correctly report
FAIL on espeak's monotone delivery (~1–3 LU of loudness range against a real performance's
8–15) and on its missing high-frequency content — those gates working is the result.

Measured results are written up in
[`docs/research/07-audio-pipeline-validation.md`](docs/research/07-audio-pipeline-validation.md)
and [`docs/research/08-assembly-validation.md`](docs/research/08-assembly-validation.md).

## Research and review

`docs/research/` holds six research tracks with sources, and two validation write-ups.
`docs/debate/` holds three adversarial reviews — an App Store and platform-risk red team, a
persona panel built on real competitor reviews, and an engineering review that found sixteen
correctness issues in this code, thirteen of which are now fixed.

The reviews are worth reading before the plan. They are what reversed most of it.
