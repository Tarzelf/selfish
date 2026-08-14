# Grok TTS Audition Results (Aug 14, 2026)

> Live test of xAI's Grok TTS API against the Selfish craft bar (`docs/PLAN.md` §4.3), run with a real API key. Harness: `packages/pipeline/src/tts-test.ts` (`npm run tts:audition`). Listenable shortlist clips: `samples/tts-audition/`.

## What was tested

1. **Whisper audition** — all 28 built-in voices rendered a ~30s "whisper-close" probe (BFE comfort register: `<whisper>` wraps, `[breath]`, `[pause]` tags, speed 0.9).
2. **Acoustic screen** — every clip analyzed for median F0, pitch spread, pause fraction, and a spectral warmth proxy (energy <2 kHz vs 2–8 kHz), scored against the research-backed male voice spec: *low-but-not-bass pitch + warmth/breathiness* (`docs/research/03` §5).
3. **Deep test** — top 4 male + top 2 female candidates rendered all three probes: whisper-closeness, warm-praise (audible smile), sleep-winddown (speed 0.8).

## API facts (measured)

| Metric | Result |
|---|---|
| Latency | 2.4–4.0 s per ~30 s clip (unary REST; streaming WS exists for real-time) |
| Cost | $15/M chars → ~$0.004 per 30 s probe; **~$0.13 for the full 28-voice audition** |
| Output | MP3 44.1 kHz/192 kbps as requested; clean, no artifacts in file handling |
| Roster | 28 built-in voices (19 M / 9 F), all multilingual; gender exposed via `GET /v1/tts/voices` |
| Tags | `<whisper>`, `[breath]`, `[pause]`, `[laugh]` all accepted; `speed` 0.7–1.5 honored |
| Reliability | 46/46 renders succeeded after credits enabled (403 with clear error before) |

Full 15-min-session estimate at ~110 wpm ≈ 8,500 chars ≈ **$0.13/session-variant** — in line with the ~$0.015/min research estimate.

## Acoustic screen — male voices vs. the Jasper spec

Target: F0 ~105–125 Hz (low but not bass), high warmth ratio, generous pausing.

| Voice | F0 median | Warmth (low/high) | Pause ratio | Read |
|---|---|---|---|---|
| **castor** | 107 Hz | **2.09** | 0.44 | Lowest *warm* voice — prime Jasper candidate |
| **rigel** | 114 Hz | 1.89 | 0.40 | Low + warm, balanced |
| **naksh** | 120 Hz | **2.15** | **0.49** | Warmest + most unhurried — strong for Rowan (soft-spoken) |
| **perseus** | 123 Hz | 1.96 | 0.49 | Warm, patient — Elias candidate |
| helix | 123 Hz | 2.36 | 0.42 | Warmest overall but densest delivery (voiced 0.34) |
| helios | 100 Hz | 1.08 | 0.31 | Lowest pitch but spectrally thin — "announcer bass," fails the warmth spec |
| orion | 105 Hz | 0.97 | 0.34 | Same pattern — low ≠ warm |

Female candidates: **ursa** (168 Hz, warmth 2.03 — Noor profile: velvet certainty) and **luna** (147 Hz, lowest F voice — alternative Noor). Full table: `packages/pipeline/out/tts-audition/acoustics.json` (not committed; regenerate with `scripts/analyze_voices.py`).

## Shortlist mapping to the Selfish roster

| Persona | Primary candidate | Backup |
|---|---|---|
| Jasper (low, unhurried, smile) | **castor** | rigel |
| Rowan (soft-spoken, close) | **naksh** | perseus |
| Elias (warm gravel, patient) | **perseus** | rigel |
| Noor (velvet, certainty) | **ursa** | luna |

Deep-test clips for all six (3 probes each) are committed at `samples/tts-audition/<voice>--<probe>.mp3` — **human listening is the deciding gate**; the acoustic screen only ranks candidates.

## Verdict & caveats

- **Grok TTS is viable as the pilot spicy-pipeline renderer**: cost is trivial, latency is fine for batch pre-rendering, tags work, and the male roster contains genuinely warm low voices.
- Still to validate by ear (cannot be measured mechanically): whisper *realism* vs. "stage whisper," breath naturalness at close-mic distance, and whether the smile is audible in warm-praise.
- **Content-policy caveat stands** (`docs/research/04`): these probes were tasteful by design. Before committing to Grok for spicy content, pilot actual slow-burn/spicy scripts — xAI's operational moderation is reportedly stricter than its AUP text.
- Custom voice cloning (`POST /v1/custom-voices`) is **Enterprise-gated** — relevant later for licensed-narrator voices; built-ins carry no likeness-license story of our own, so production still needs the licensed-voice plan.
- Binaural/HRTF post-processing is not provided by the API; stays in our post stage as planned.

## End-to-end pipeline test (Grok LLM → safety → Grok TTS)

Ran the full production chain live with `PIPELINE_LLM=grok PIPELINE_TTS=grok GROK_TTS_VOICE=castor` on a tasteful slow-burn smoke brief (`briefs/e2e-smoke.json`):

- **Draft (grok-4):** 768-char script in ~5 s; followed the mandated adult-age header, used tags sparingly, and modeled consent unprompted-quality ("Is that alright?", "May I?"). Tone: warm slow-burn, restraint over explicitness — exactly the brief.
- **Safety classifier:** passed all 6 checks (and the header requirement is now enforced in the Grok system prompt).
- **Render (castor):** 39 s of audio in ~3.5 s.
- **Audit manifest:** full provenance chain recorded.

Artifacts: `samples/e2e-smoke--castor.mp3` + `samples/e2e-smoke--script.md`. This validates the entire v1 content factory on real providers; remaining production gaps are the post stage (binaural, watermark) and human editorial workflow.

## Reproduce

```bash
cd packages/pipeline
XAI_API_KEY=... npm run tts:audition                    # 28-voice whisper audition (~$0.13)
XAI_API_KEY=... npm run tts:audition -- --voice castor  # 3-probe deep test
python3 scripts/analyze_voices.py out/tts-audition '{"castor":"M",...}'  # acoustic screen
```
