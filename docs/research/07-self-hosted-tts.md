# Self-Hosted TTS Stack Decision (Research Loop 3, Aug 2026)

> Triggered by user listening tests (Grok TTS judged not expressive enough vs. the [tts-bench](https://5uck1ess.github.io/tts-bench/listen.html) leaders) and an external expert's tier list. This pass verified every model on that list, checked licenses for commercial adult-content use, and gathered fine-tuning/cost evidence. Local CPU experiments: `samples/local-tts/` (Kokoro + Chatterbox rendered on a 4-core, no-GPU VM).

## Verified corrections to the expert tier list

The models all exist, but **three have license traps for us**:

- **OmniVoice** (k2-fsa): weights are **CC-BY-NC — unusable commercially**, despite the expert's endorsement.
- **Higgs Audio v3** (Boson AI, 4B): research/non-commercial license — "avoid" confirmed.
- **Fish Audio S2 Pro**: actually open-weights (not closed as the expert said) and **#1 open model on the Speech Arena (Elo ~1124)** — but the Fish Audio Research License is non-commercial without a paid deal, and it's heavy (~20 GB VRAM). Off the table either way.
- **Supertonic 3**: OpenRAIL-M weights *and* the repo was archived July 2026 — dead end.

Clean-license contenders: **Chatterbox family (MIT)**, **Qwen3-TTS (Apache 2.0)**, **VoxCPM2 (Apache 2.0)**, **Gepard (Apache 2.0)**, **Kokoro (Apache 2.0)**, **Zonos2 (Apache 2.0)**, Orpheus (Apache 2.0, stagnant). **DramaBox** (Resemble's 3.3B acting model — whispers, purrs, weeping via screenplay prompts) is free under the LTX-2 Community license below $10M revenue, but its "harmful content" restrictions need counsel review against an adult catalog before adoption.

## The chosen stack (four slots)

| Slot | Model | Why |
|---|---|---|
| **Primary — spicy/intimate pipeline** | **Qwen3-TTS-12Hz-1.7B-Base + per-voice LoRA** | Apache 2.0 (zero content policy on our infra); lineage is #1 on the Speech Arena (hosted sibling Elo 1233); 3-sec cloning; >10-min stable long-form; mature LoRA recipes proven on consumer GPUs; instruction control (emotion/whisper styles) in the 1.7B variant; 97 ms first-packet streaming for future interactive reuse |
| **Backup + 48 kHz hero ASMR** | **VoxCPM2 (2B)** | Apache 2.0; natural-language Voice Design incl. tone/breathiness; official SFT+LoRA on 5–10 min of data; 48 kHz output (matters for close-mic ASMR); RTF 0.13 with Nano-vLLM on a 4090 |
| **CPU bulk tier — sleep/neutral content** | **Chatterbox-Nano (110M, MIT)** | 3× realtime on 8 CPU cores; 5-sec cloning; `[sigh]`-class tags; **built-in PerTh watermarking (EU AI Act Art. 50 for free)**. Kokoro (82M) stays as the zero-cloning fallback — our CPU test hit 4× realtime on 4 cores |
| **Real-time streaming (v3 interactive)** | **Gepard 1.0** (economics: RTF 0.04, 32 ms TTFA, 204× aggregate on stock vLLM) or **streaming Qwen3-TTS** (quality; one stack, two modes) | Cartesia-compatible WebSocket; drops into Pipecat/LiveKit |

**Grok TTS is demoted to what the audition showed it is**: a fine batch renderer with a warm-male roster but a lower expressive ceiling than the 2026 open models — kept as a hosted fallback, not the primary.

## Fine-tuning plan (licensed narrator voices)

1–3 h of licensed intimate/ASMR recordings per voice is *more* than enough — Qwen3-TTS LoRA sweet spot is 10–30 min, plateauing ~3 h (LR 2e-6, rank 16/alpha 32, 24 kHz prep; runs on a 3090). The existence proof that adult vocalization fine-tuning works on token-LM TTS is the [mOrpheus NSFW finetune](https://huggingface.co/MrDragonFox/mOrpheus_3B-1Base_early_preview) (moans, gasps, panting on Orpheus 3B) — same data-pipeline approach transfers. **Precondition unchanged:** no fine-tune before an AB 2602/ELVIS-grade license explicitly covering synthetic erotic performance is signed (docs/research/05 §4).

## Economics (verified, RunPod/Vast 4090 at $0.13–0.74/hr)

- VoxCPM2 @ RTF 0.13 → ~460 finished min/GPU-hr → **~$0.0007/min raw**.
- Qwen3-TTS batched on vLLM (8–16 streams) → $0.0002–0.001/min.
- Realistic all-in with 2–3× regeneration for take selection: **$0.002–0.01 per finished minute** — a 20-min episode costs $0.04–0.20 of GPU. 10–100× cheaper than hosted APIs; content policy: none.

## CPU-only experiment results (this repo, 4 cores, no GPU)

| Model | Result |
|---|---|
| Kokoro 82M | 9 probes rendered at **RTF ~0.25 (4× faster than realtime)**; `af_nicole` is a genuine whisper-register voice; no cloning/emotion — bulk tier only |
| Chatterbox 0.5B | 2 probes at RTF ~2–3 on CPU (→ faster than realtime on any GPU); exaggeration/CFG knobs work as advertised |

Clips: `samples/local-tts/`. Answer to "can we self-host near-real-time?" — **yes**: small models run realtime on CPU; mid models run realtime on a single cheap GPU; Gepard-class runs 25 concurrent realtime streams per GPU.

## Compliance note

Only the Resemble family ships built-in watermarking. Qwen3/VoxCPM output must be paired with Resemble's open-source [Perth watermarker](https://github.com/resemble-ai/perth) (or AudioSeal) in the post stage to satisfy EU AI Act Art. 50(2) machine-readable marking — already a planned pipeline stage.

## Next validation step

Rent one 4090 (~$0.40/hr), run Qwen3-TTS-1.7B and VoxCPM2 on the three Selfish probes + one full session script, side-by-side with the Grok and Kokoro clips already in `samples/`, and ear-test. Then LoRA a scratch voice on ~30 min of any licensed/self-recorded audio to validate the recipe end to end before signing narrator contracts.
