# Voice & TTS Stack for High-Fidelity Intimate Audio

**Research date:** 14 August 2026
**Scope:** Voice synthesis stack for an iOS app delivering whispered/breathy ASMR-style narration and erotic audio stories. Batch (offline) asset generation. Priorities: quality → controllability → cost per finished hour → licence/ToS permissiveness. Latency is irrelevant.

**Confidence markers used throughout:**
- ✅ **Verified** — read directly from vendor docs, licence files, or a peer-reviewed/arXiv paper.
- ⚠️ **Unverified** — from a secondary aggregator, a marketing page, or my own arithmetic. Treat as a starting estimate, re-check before committing budget.
- 🧮 **Derived** — my calculation from verified inputs; the inputs are cited, the arithmetic is mine.

---

## 0. Executive summary (read this if you read nothing else)

1. **No commercial TTS in mid-2026 can produce a true unvoiced whisper.** This is now measured, not anecdotal. A January 2026 paper (DeepASMR, SJTU) computed the *Global Unvoiced Ratio* — the share of active speech frames with no detectable F0 — for real ASMR performers versus leading models. Real ASMR: **91.8%**. ElevenLabs v3: **35.4%**. MiniMax speech-hd-02: **25.5%**. Commercial "ASMR" output is soft *voiced* speech with vocal-fold vibration, which is a categorically different acoustic object from a whisper. ✅
2. **The whisper has to come from a human larynx.** Every architecture that reliably produces high unvoiced ratios was trained on real whispered corpora, and the only such corpus of scale (DeepASMR-DB, 674 hours) is **CC BY-NC 4.0** — unusable commercially. ✅
3. **Voice conversion is the right tool, but only in the direction that preserves the whisper.** Normal→whisper conversion fails badly (Seed-VC cascade: 14.0% unvoiced ratio vs 91.8% ground truth). But whisper→X conversion *over-preserves* breathiness (cascade models produced 56–66% unvoiced when the source was whispered, versus 33.8% for genuine normal speech). Feed a real whispered performance in and the aperiodic texture survives the conversion. That asymmetry is the whole basis of the recommended architecture. ✅ (direct measurements) / 🧮 (the inference for our use case)
4. **Sample rate is a first-order product constraint here, not an audiophile detail.** Most open-weight models output 24 kHz → 12 kHz Nyquist, which discards the entire 12–20 kHz band where sibilance, lip/tongue transients and breath noise live. Those *are* the ASMR trigger. Only Zonos (44.1), Cartesia Sonic-3 (44.1), ElevenLabs on Pro+ (44.1 PCM), Hume Octave (48), Inworld (48) and MiniMax (up to 44.1) clear the bar. ✅
5. **Most vendors and most GPU platforms prohibit adult content — including the self-hosting platforms.** OpenAI, Google, PlayAI and (very likely) Microsoft/AWS ban it outright. Modal, Replicate, Baseten, RunPod and fal all carry obscenity/pornography clauses, which means "just self-host the open model" does *not* solve the ToS problem on mainstream GPU clouds. ✅
6. **Cost is not the deciding factor.** Synthesis lands between **$0.60 and $10 per finished audio-hour**; a human intimate performance lands between **$700 and $1,500**. That's a 100–1,000× gap, so the decision is entirely about whether the output is good enough, and the honest answer is *partly*. 🧮
7. **Recommended: a hybrid with a human spine.** Cast and buy out 4–8 voices; record real whispered performance at 48 kHz for the intimate/explicit core; use voice conversion to multiply each performance across characters; use self-hosted open-weight TTS (Apache-2.0 / MIT only) for bulk non-explicit narration; layer human-recorded non-verbal libraries (breath, sighs, moans, mouth sounds, smiles) in post regardless of source. Details in §8.

---

## 1. Commercial TTS APIs

### 1.1 Capability and fidelity matrix

| Provider / model | Whisper & breathy intimacy | Prosodic control surface | Output sample rate & format | Voice cloning |
|---|---|---|---|---|
| **ElevenLabs v3** (`eleven_v3`, GA March 2026) | Best-in-class *soft-spoken*; `[whispers]` works but is voice-dependent and inconsistent. Measured unvoiced ratio 35.4% vs 91.8% real ASMR ✅ | Inline audio tags (`[whispers]`, `[sighs]`, `[laughs]`, `[softly]`); **no SSML** (deliberately dropped); `stability` slider; `seed` ✅ | 44.1 kHz PCM via API — **gated to Pro plan ($99/mo) and above**; MP3 192 kbps ✅ | IVC (1–3 min), PVC (30 min–3 h) ✅ |
| **Hume Octave 2** (preview) | Natural-language acting instructions can request whispering; unmeasured for unvoiced ratio ⚠️ | Natural-language `description` acting instructions (**Octave 1 only — Octave 2 support "coming soon"**), `speed`, `trailing_silence`, phoneme editing, **voice conversion** ✅ | **48 kHz** (MP3 and raw) ✅ | Yes; Voice Design from text description ✅ |
| **Cartesia Sonic-3** | Emotion enum has `calm`, `content`, `hesitant`, `tired` — no whisper primitive; `[laughter]` native ✅ | `generation_config.emotion` (~30 enum values, "guidance not strict"), SSML tags, `speed`, `volume` ✅ | **44.1 kHz** WAV default ✅ | Instant (10 s) and Pro clone ✅ |
| **MiniMax speech-2.8-HD** | Measured unvoiced ratio 25.5% — the worst of the tested commercials ✅ | `emotion` enum (10 values incl. `calm`), `speed`, `volume`, `pitch`, `<#0.5#>` pause markers ✅ | 8k–**44.1 kHz**; mp3/wav/flac/pcm; **mono or stereo flag** ✅ | Rapid clone $1.50/voice; Voice Design $3/voice ✅ |
| **Inworld Realtime TTS-2** | Markup-based steering; whisper support claimed, unmeasured ⚠️ | Natural-language steering + markup tags ⚠️ | 8k–**48 kHz**; MP3/PCM/WAV/Opus ✅ | Instant clone from 5–15 s ✅ |
| **Fish Audio S2.1 Pro** | **15,000+ free-form inline tags**, incl. documented `[whisper in small voice]`, `[exhale]`, `[clears throat]` — the richest tag surface anywhere ✅ | Free-form natural-language bracket tags (not a fixed enum) ✅ | Not documented in searched sources ⚠️ | Yes (10–30 s, cross-lingual) ✅ |
| **Azure Neural HD V3** | Style list includes `whispering`, `quiet`, `secretive`, **`panting`**; paralinguistic elements `breathing`, `sigh`, `throat clearing` ✅ | SSML `mstts:express-as` with style + styledegree; custom lexicons; known to work poorly on single words — apply to whole phrases ✅ | Up to 48 kHz ⚠️ | Custom Neural Voice (gated, application required) ✅ |
| **Google Gemini 3.1 Flash TTS** | **200+ audio tags** incl. `[whispers]`, `[laughs]`, `[short pause]`, `[long pause]` ✅ | Natural-language prompt steering + 200+ tags; 70+ languages ✅ | 24 kHz PCM ⚠️; **SynthID watermark embedded in all output** ✅ | No public cloning ✅ |
| **Google Chirp 3 HD** | Standard neural, no expressive tags | Limited | 24 kHz ⚠️ | Instant Custom Voice ✅ |
| **OpenAI gpt-4o-mini-tts** | Instruction-following via `instructions` param | Natural-language instructions | 24 kHz ⚠️ | None public (Voice Engine still limited preview) ✅ |
| **Deepgram Aura-2** | Conversational, not expressive | Minimal | 24 kHz ⚠️ | None ✅ |
| **AWS Polly Neural** | SSML only; no whisper style | SSML | 24 kHz max ⚠️ | Brand Voice (enterprise) ⚠️ |
| **Speechify Simba 3.2** | Not evaluated for whisper ⚠️ | ⚠️ | ⚠️ | Yes ⚠️ |
| **Rime / LMNT / Neuphonic / Papla** | Optimised for conversational agents, not expressive narration. Rime and LMNT are enterprise-quoted with no public per-character rate. Neuphonic pitches on-device/edge. Papla has no substantive public documentation I could verify. ⚠️ | ⚠️ | ⚠️ | Rime: no. LMNT/Neuphonic: yes ⚠️ |
| **Resemble AI** | Not evaluated for whisper ⚠️ | Emotion controls ⚠️ | ⚠️ | Yes; **verbal consent from voice owner required by ToS** ✅ |
| **PlayAI / PlayHT** | Not evaluated ⚠️ | ⚠️ | ⚠️ | Yes ✅ |

**The tag-surface finding worth acting on:** Fish Audio S2.1 Pro accepts arbitrary natural-language direction inside brackets (15,000+ recognised tags, and `[pitch up]`/`[flirty]` both resolve) rather than a closed enum. For a product whose entire value is micro-prosody, a free-form direction channel is structurally better than a 10-value emotion enum. The catch is its licence and its ToS (§1.3, §2.2).

### 1.2 Pricing and cost per finished audio-hour

**Assumptions for all cost figures below** 🧮
- Slow intimate narration ≈ **110 wpm** → 6,600 words/hour → **~38,000 characters per finished audio-hour** (at ~5.8 chars/word including spaces). Standard audiobook pace (155 wpm) would be ~54,000 chars/hour; our slow delivery is *cheaper* on character-billed providers and *neutral* on duration-billed ones.
- **Retake overhead: discard 40% of takes → 1.67× multiplier** on generated volume.
- Audio tags themselves consume billable characters on ElevenLabs; add ~5% for tag-heavy scripts.

| Provider / model | Published rate | Billing basis | Raw $/finished hr 🧮 | **With 40% discard 🧮** |
|---|---|---|---|---|
| Speechify Simba 3.2 | $10/M chars ($6 at volume) ⚠️ | chars | $0.38 | **$0.63** |
| Fish Audio S2.1 Pro / S2 Pro / S1 | $15/M UTF-8 bytes ✅ | bytes (≈chars for English) | $0.57 | **$0.95** |
| Inworld Realtime TTS-2 (Growth) | $12.50/M chars ✅ | chars | $0.48 | **$0.79** |
| AWS Polly Neural | $16/M chars ⚠️ | chars | $0.61 | **$1.02** |
| Azure Neural HD | $22/M chars (cut from $30 in Mar 2026) ✅ | chars | $0.84 | **$1.40** |
| Google Gemini 2.5 Flash TTS | $10/M audio tokens @ 25 tok/s ✅ | duration | $0.90 | **$1.50** |
| Inworld Realtime TTS-2 (on-demand) | $25/M chars ✅ | chars | $0.95 | **$1.59** |
| Deepgram Aura-2 | $30/M chars ✅ | chars | $1.14 | **$1.90** |
| Google Chirp 3 HD | $30/M chars ✅ | chars | $1.14 | **$1.90** |
| Google Gemini 3.1 Flash TTS | $20/M audio tokens @ 25 tok/s ✅ | duration | $1.80 | **$3.01** |
| Azure Custom Neural Voice HD | $48/M chars ⚠️ | chars | $1.82 | **$3.05** |
| Cartesia Sonic-3 (Scale, $299/mo) | 15 credits/sec; 8M credits for $299 ✅ | duration | $2.02 | **$3.37** |
| Hume Octave 2 (Business tier) | $0.05/1k chars ⚠️ | chars | $1.90 | **$3.18** |
| MiniMax speech-2.8-Turbo | $60/M chars ✅ | chars | $2.28 | **$3.81** |
| **ElevenLabs v3 (API PAYG)** | **$0.10/1k chars** ✅ | chars | $3.80 | **$6.35** (+~$0.32 tags) |
| MiniMax speech-2.8-HD | $100/M chars ✅ | chars | $3.80 | **$6.35** |
| Hume Octave 2 (Creator tier) | $0.15/1k chars ⚠️ | chars | $5.70 | **$9.53** |
| ElevenLabs (Scale subscription credits) | $299 / 1.8M credits = $166/M ✅ | chars | $6.31 | **$10.54** |
| Resemble AI | ~$21.60/audio-hour ⚠️ | duration | $21.60 | **$36.07** |

**Two pricing traps worth internalising.**

First, **ElevenLabs' API pay-as-you-go rate ($100/M chars) is 40% cheaper than burning subscription credits ($166/M on Scale)** for the same v3 model. But 44.1 kHz PCM output is a *plan* feature gated at Pro ($99/mo) and above — so you need the subscription for the fidelity and should route generation through the metered API for the volume. ✅

Second, **duration-billed providers (Cartesia, Gemini TTS) don't reward slow delivery.** Our content is deliberately slow, which cuts character-billed cost by ~30% versus standard narration pace but does nothing on a per-second meter. Cartesia's dual metering is genuinely confusing — published as both "15 credits per second of audio" and "1 credit per character" depending on which document you read; get this confirmed in writing before modelling it. ⚠️

### 1.3 Adult content permissibility — the constraint that eliminates most vendors

This is the single most decision-relevant table in the document.

| Vendor | Adult/sexual content status | Evidence |
|---|---|---|
| **OpenAI** | ❌ **Explicitly banned.** "We decided to restrict the generation of erotic and violent speech." A moderation classifier runs over text transcriptions of prompts and blocks output containing erotic language. | GPT-4o System Card ✅ |
| **Google (Gemini TTS / Chirp)** | ❌ **Explicitly banned** under the Generative AI Prohibited Use Policy. The TTS docs additionally document a speech-synthesis classifier that returns `PROHIBITED_CONTENT`. All output carries a SynthID watermark. | Gemini API docs + Prohibited Use Policy ✅ |
| **PlayAI / PlayHT** | ❌ **Explicitly banned.** ToS §(j) prohibits generating content that "is pornographic, lascivious … or would be morally reprehensible." | play.ht/terms ✅ |
| **Resemble AI** | ❌ Effectively banned. ToS lets Resemble remove any content it deems "unacceptable, undesirable, inappropriate"; separate ToS documents prohibit sexually explicit material; cloning requires verified verbal consent from the voice owner. | resemble.ai/terms-of-service ✅ |
| **Microsoft Azure Speech** | ❌ Almost certainly banned — Microsoft's Generative AI Services Code of Conduct prohibits sexual content, and Custom Neural Voice is a gated/application-only program with its own review. **I did not fetch the Code of Conduct directly; verify before relying on this.** | ⚠️ |
| **AWS Polly** | ❌ Likely banned — AWS AUP prohibits obscene content. **Not directly verified.** | ⚠️ |
| **ElevenLabs** | 🟡 **The most permissive major vendor, with real residual risk.** The Prohibited Use Policy (last updated 3 Sep 2025) contains **no blanket ban on consensual adult audio**. It bans: sexually explicit material involving minors; facilitating sexualisation of children; **and "age-inappropriate material … that targets minors and promotes sexual material, graphic violence, obscenity, or other mature themes."** Separate ElevenAgents terms ban sexual content generated via customer-provided LLMs; separate Image & Video terms ban sexually explicit content. Enforcement is "at ElevenLabs' sole discretion." | elevenlabs.io/use-policy ✅ |
| **Hume AI** | 🟡 Ambiguous. The AUP has no explicit sexual-content prohibition for adults, but bans content "undermining human dignity or community well-being," requires adherence to The Hume Initiative's ethical guidelines, and the API returns error `E0801` for AUP violations and `E0809` specifically for child-voice generation attempts. | hume.ai/acceptable-use-policy ✅ |
| **Cartesia, MiniMax, Fish Audio, Inworld, Deepgram, Rime, LMNT, Neuphonic, Papla, Speechify** | ⚠️ **Not verified.** MiniMax is PRC-domiciled and PRC content regulation on sexual material is strict, so I would assume prohibited absent written confirmation. Fish Audio's AUP requires compliance with applicable law and requires proof of rights for cloned voices, but I found no explicit sexual-content clause either way. | ⚠️ |

**And the platforms you would self-host on are no better:**

| GPU / inference platform | Adult content status | Evidence |
|---|---|---|
| **Modal** | ❌ ToS defines "Prohibited Content" to include content that "contains indecent or obscene material." | modal.com/legal/terms ✅ |
| **Baseten** | ❌ Customer warranty: content will not "be deceptive, defamatory, obscene, pornographic or unlawful." | baseten.co/terms-and-conditions ✅ |
| **Replicate** | ❌ ToS bans creating "non-consensual nudity or illegal pornographic content"; AUP separately bans "distribution of obscene … content." | replicate.com/terms + /acceptable-use-policy ✅ |
| **fal** | ❌ AUP bans "generating … any other harmful, violent, or sexually explicit content." Their Trust & Safety page references an "NSFW content policy" that "balances platform openness" against illegal categories — the two documents are in visible tension. Do not rely on the friendlier one. | fal.ai/legal/acceptable-use-policy ✅ |
| **RunPod** | ❌ ToS prohibits pornography and graphic adult content. | ⚠️ (found in prior search, not re-fetched) |
| **Offshore / no-KYC bare-metal** (ServPrivate, XmrCloud, Impreza, DmcaIgnored) | 🟢 Explicitly permit legal adult content; AUP restricted to what is illegal in the host jurisdiction (CSAM zero-tolerance, CBRN, targeted harassment). Crypto billing, no-KYC, RTX 4090 / 5090 / H100 inventory. **No published hourly rates found — pricing entirely unverified.** Iceland is excluded from Impreza's adult-permitted locations. | ✅ (policy) / ⚠️ (pricing) |
| **Your own hardware** | 🟢 No third-party AUP at all. A single RTX 4090/5090 workstation covers our batch volume. | — |

**Implication.** The "obvious" plan — take an Apache-2.0 open model and run it on Modal or Replicate — is a ToS violation for explicit content on every mainstream serverless GPU platform I checked. The compliant options are owned hardware, a colocated box, or an offshore provider whose AUP explicitly permits legal adult material. Budget for this as an infrastructure decision made once, not a per-request one.

---

## 2. Open-weight / self-hostable models

### 2.1 Licence, capability and hardware

Elo figures are from the Artificial Analysis Speech Arena (blind pairwise listening), as reported July 2026. ⚠️ (secondary source; the leaderboard is live and will have moved)

| Model | Licence | Elo | Clone from ref? | Whisper / non-verbals | VRAM | Native SR |
|---|---|---|---|---|---|---|
| **Qwen3-TTS 12Hz (0.6B / 1.7B)** | **Apache 2.0** ✅ | — (proprietary Qwen-Audio-3.0-TTS-Plus tops the arena at 1,236) | **Yes, 3 s** ✅ | Tokenizer explicitly "preserves paralinguistic information and acoustic environmental features"; description-based control; VoiceDesign variant ✅ | 8 GB (0.6B) / 16 GB (1.7B) ✅ | ⚠️ |
| **Step Audio EditX** | **Apache 2.0** ✅ | **1,118 (best open weights)** | Yes | **20+ paralinguistic tags (breathing, laughter, sighing, chuckling), 14 emotions, 30+ styles; iterative token-space re-editing** ✅ | 12 GB (tested on L40S) ✅ | ⚠️ |
| **Fish Audio S2 Pro / S2.1 Pro** | ❌ **Fish Audio Research License — non-commercial.** Only the distilled S1-mini weights are downloadable, under CC-BY-NC-SA-4.0. Commercial self-host = Enterprise engagement. ✅ | 1,110 | Yes | **15,000+ free-form tags** incl. `[whisper in small voice]`, `[exhale]` ✅ | Unpublished; RTF 0.195 on one H200 ✅ | ⚠️ |
| **Voxtral TTS (Mistral)** | ❌ **CC BY-NC 4.0** ✅ | 1,077 | **Yes, 3 s, no transcript needed** ✅ | Infers prosody from voice prompt, no tags ✅ | 16 GB ✅ | 24 kHz ✅ |
| **Kokoro 82M v1.0** | **Apache 2.0** ✅ | 1,060 | **No** ✅ | **No emotion control at all** ✅ | <2 GB, or CPU via ONNX ✅ | 24 kHz ⚠️ |
| **Maya1** | **Apache 2.0** ✅ | 1,053 | No — **describe the voice in text instead** (sidesteps consent entirely) ✅ | **20+ inline tags: laugh, cry, whisper, gasp, sigh** ✅ | 16 GB ✅ | 24 kHz ✅ |
| **NVIDIA Magpie-Multilingual 357M** | NVIDIA Open Model (commercial OK) ✅ | 1,048 | **No — zero-shot removed on purpose** ✅ | **Emotion gated to enterprise NIM, not in open weights**; 20 s cap per inference ✅ | Unpublished | 22 kHz ✅ |
| **Higgs Audio v2 / v2.5 (Boson)** | **Apache 2.0** ✅ — **but Higgs Audio v3 (2026) is Research/Non-Commercial** ✅ | — | **Yes, 3–5 s** ✅ | `<\|emotion:...\|>` tags, `[laugh]`, `[music]`; **multi-speaker `[SPEAKER0/1]`**; humming; simultaneous speech+BGM ✅ | 18–20 GB full precision; 24 GB recommended; RTF ~2.0 on 8 GB with 4-bit + CPU offload ✅ | 24 kHz ⚠️ |
| **Chatterbox / Chatterbox Turbo v3 (Resemble)** | **MIT** ✅ | 1,011 | Yes, ~5 s ✅ | `[laugh]`, `[sigh]`, `[gasp]`, **`[whisper]`**; emotion-exaggeration control ✅ | Unpublished; Turbo ~6× realtime ✅ | 24 kHz ⚠️ |
| **Zonos-v0.1 (Zyphra)** | **Apache 2.0** ✅ | 1,000 | Yes, 10–30 s ✅ | Conditioning knobs: speaking rate, pitch, **max frequency**, audio quality, 4 emotions ✅ | **6 GB**; ~2× realtime on a 4090 ✅ | **44.1 kHz — highest of any open model** ✅ |
| **IndexTTS-2 (Bilibili)** | ⚠️ **Contested.** Reviews say Apache 2.0; the PyPI package declares `LicenseRef-Bilibili-IndexTTS`. **Read the LICENSE + DISCLAIMER in the repo before shipping.** | — | Yes, 5–15 s ✅ | **Best emotion control surface of any open model: separate emotion reference audio, 8-dim emotion vector `[happy, angry, sad, afraid, disgusted, melancholic, surprised, calm]`, natural-language emotion text, `emo_alpha` intensity — all decoupled from timbre** ✅ | 8 GB ✅ | 22 kHz (BigVGANv2) ⚠️ |
| **VibeVoice 1.5B / 7B (Microsoft)** | **MIT — but withdrawn by Microsoft.** TTS code stripped from the official repo 5 Sep 2025; weights pulled from HF. Community forks are lawful (MIT permits redistribution) and remain up. Microsoft's own guidance is research-use-only. ✅ | 958 | Yes | 90 min multi-speaker, **up to 4 speakers**, 64K context ✅ | 7B needs >12 GB ⚠️ | 24 kHz ⚠️ |
| **Dia 1.6B / Dia2 (Nari Labs)** | **Apache 2.0** ✅ | — | Yes, via audio prompt ✅ | **Non-verbals trained against real audio events, not text descriptions** — `(laughs)`, `(sighs)`, `(gasps)`, `(inhales)`, `(exhales)`, `(groans)`, `(sniffs)`, `(clears throat)`. Genuinely better laughs than commercial models. `[S1]`/`[S2]` dialogue tags ✅ | ~10 GB ⚠️ | ⚠️ |
| **CosyVoice 2 / 3** | Apache 2.0 ⚠️ | — | Yes | **The strongest baseline in the DeepASMR ASMR-MOS test (4.06 ZH / 2.90 EN A2A) — better at preserving ASMR texture than F5-TTS by a wide margin** ✅ | ⚠️ | ⚠️ |
| **XTTS-v2 (Coqui)** | ❌ **Coqui Public Model License — non-commercial, permanently.** Code is MPL-2.0 but weights are CPML; Coqui shut down Jan 2024, a relicensing request went unanswered, and `coqui.ai/cpml` is now a dead 404. **Nobody alive can sell you a commercial licence.** Use the Idiap fork only for the code. ✅ | 908 | Yes, ~3 s | — | ⚠️ | 24 kHz ⚠️ |
| **StyleTTS 2** | ⚠️ "MIT + conditions" — extra disclosure conditions in the README, with an open issue flagging the discrepancy ✅ | 882 | — | — | ⚠️ | 24 kHz ⚠️ |
| **F5-TTS / E2-TTS** | ⚠️ Code permissive, weights typically CC-BY-NC via the Emilia corpus — verify per checkpoint | — | Yes | **Worst tested performer on ASMR: ASMR-MOS 2.10 (EN), unvoiced ratio 22.4%, LLM style score −0.63 (i.e. it produced *normal* speech when asked for ASMR)** ✅ | ⚠️ | 24 kHz ⚠️ |
| **Spark-TTS, Llasa, MaskGCT, Parler-TTS, MegaTTS, Sesame CSM, Orpheus** | ⚠️ Mixed: Spark-TTS and Llasa weights are commonly CC-BY-NC-SA; Parler-TTS is Apache 2.0; MaskGCT ships under Amphion's non-commercial terms; Sesame CSM and Orpheus are Apache 2.0. **All need per-checkpoint verification — none is a leader on the current arena board, so the verification cost isn't obviously worth paying.** | — | — | — | — | — |
| **OpenVoice v2 / MetaVoice v1** | MIT / Apache 2.0 ✅ | 959 / 836 | Yes (OpenVoice has a decoupled tone-colour converter) ✅ | — | ⚠️ | ⚠️ |

### 2.2 The licence traps, stated plainly

Open-weight TTS is worse about licence-versus-marketing mismatch than the LLM world. Three specific traps:

1. **"Now open source" often means open weights + non-commercial.** Fish Audio's S2 Pro product page says "now open-source"; the weights are under the Fish Audio Research License and commercial use requires a separate agreement. Voxtral TTS is CC BY-NC 4.0. Neither is OSI open source, and neither can ship in a paid product without a negotiation. ✅
2. **Version numbers change the licence.** Higgs Audio v2/v2.5 are Apache 2.0; **v3 (2026) moved to a Research and Non-Commercial License** requiring a separate commercial licence for hosted/revenue-generating use. Pinning a model version is a legal act here, not just an engineering one. ✅
3. **XTTS-v2 is a dead end and its SEO says otherwise.** The dead original repo has ~45k stars versus the live Idiap fork's ~2k, so search results and star counts route you to the corpse. The weights are permanently non-commercial with no counterparty. ✅

**Commercially safe shortlist for us:** Qwen3-TTS (Apache 2.0), Step Audio EditX (Apache 2.0), Higgs Audio v2/v2.5 (Apache 2.0), Chatterbox (MIT), Zonos (Apache 2.0), Maya1 (Apache 2.0), Dia (Apache 2.0), Kokoro (Apache 2.0).

**One caveat on Chatterbox:** every output carries Resemble's PerTh neural watermark, embedded at generation time. That is a feature for provenance and a constraint if you don't want an inaudible signal in a product where the audio *is* the product. ✅

### 2.3 GPU rental rates and cost per audio-hour

Live rates, 13–14 August 2026: ✅

| GPU | VRAM | RunPod Community | RunPod Secure | Vast.ai (median / floor) |
|---|---|---|---|---|
| RTX 3090 | 24 GB | $0.22 | $0.50 | $0.15 / $0.05 |
| RTX 4090 | 24 GB | $0.34 | $0.74 | $0.36 / $0.13–0.14 |
| RTX A6000 | 48 GB | $0.33 | $0.53 | $0.41 / — |
| A40 | 48 GB | $0.35 | $0.44 | — |
| RTX 5090 | 32 GB | $0.69 | $0.99 | — |
| L40S | 48 GB | $0.79 | $0.99 | — |
| A100 SXM | 80 GB | $1.39 | $1.49–1.59 | $0.90 / $0.13 |
| H100 PCIe | 80 GB | $1.99 | $2.89 | $2.00 / $1.33 |
| H200 SXM | 141 GB | $3.59 | $4.59 | — |

**Cost per finished audio-hour = RTF × 1.67 × GPU $/hr** (RTF = generation seconds per audio second, single stream). 🧮

| Model | RTF (source) | GPU-hr per finished hr 🧮 | On 4090 @ $0.34 | On 4090 @ $0.74 |
|---|---|---|---|---|
| Kokoro 82M | ~0.03 on A100 ⚠️ | 0.05 | **$0.02** | $0.04 |
| Qwen3-TTS 1.7B | ~0.2 estimated ⚠️ | 0.33 | **$0.11** | $0.25 |
| Zonos-v0.1 | ~0.5 (2× realtime on 4090) ✅ | 0.84 | **$0.28** | $0.62 |
| Higgs Audio v2 3B | ~0.5 est. on 24 GB ⚠️ (2.0 measured on 8 GB w/ 4-bit ✅) | 0.84 | **$0.28** | $0.62 |
| IndexTTS-2 | ~0.7 estimated ⚠️ | 1.17 | **$0.40** | $0.87 |
| Step Audio EditX (3 refinement passes) | ~0.5 × 3 ⚠️ | 2.5 | **$0.85** (needs L40S: ~$2.00–2.50) | — |
| Fish S2 Pro | 0.195 on H200 ✅ | 0.33 | — | $1.17 on H200 @ $3.59 |
| Voxtral TTS @ 32 concurrent | 0.302/stream ⇒ ~106× realtime aggregate ✅ | 0.016 | — | **$0.06** on H200 |

The headline is that **raw GPU cost for self-hosted synthesis is between two cents and one dollar per finished audio-hour** and is therefore not a real line item. What *is* real: batching matters enormously (Voxtral goes from 9.7× to ~106× realtime aggregate between 1 and 32 concurrent requests), and a dedicated always-on box costs the same whether you generate 10 hours or 500. At a modest 200 finished hours/month on a dedicated offshore 4090, amortised infrastructure plausibly lands at **$1.50–3.00 per finished hour** — dominated by idle time, not compute. ⚠️ (offshore pricing unverified)

---

## 3. The whisper problem

### 3.1 The measurement that settles the argument

The DeepASMR paper (arXiv 2601.15596, Shanghai Jiao Tong University + VUI Labs, Jan 2026) is the first work to evaluate ASMR synthesis rigorously, and it introduces the metric this product needs: the **Global Unvoiced Ratio (R_UV)** — the percentage of *active* speech frames (excluding silence) where PYIN detects no fundamental frequency. A whisper has no vocal-fold vibration, so it has no F0; a soft voiced read does. R_UV separates "actually whispering" from "talking quietly," which no MOS score does. ✅

| System | Global Unvoiced Ratio | Interpretation |
|---|---|---|
| **Real human ASMR (ground truth)** | **91.8%** | The target |
| Reference prompts from commercial platforms | 38.7% | Even vendors' own ASMR demo voices are mostly voiced |
| **ElevenLabs v3 Alpha** | **35.4%** | Best commercial — still ~2.6× short |
| CosyVoice2 | 26.0% | |
| **MiniMax speech-hd-02** | **25.5%** | |
| F5-TTS | 22.4% | |
| CosyVoice2 → SeedVC cascade (normal→ASMR) | **14.0%** | Voice conversion in this direction actively destroys the whisper |
| DeepASMR (cross-style) | 73.8% | Research model, trained on real ASMR, NC-licensed corpus |

The authors' conclusion, in their words: commercial ASMR synthesis "is predominantly based on vocal cord vibrations. However, this represents only a limited subset of the ASMR domain. A substantial portion of authentic ASMR involves unvoiced speech with minimal vocal cord vibration. Commercial models currently struggle to replicate this characteristic, particularly when dealing with unseen speakers." ✅

**Why this is structural, not a tuning problem.** ASMR requires replacing a periodic glottal source with aperiodic broadband turbulence. Models trained overwhelmingly on read-style voiced speech have almost no examples of sustained unvoiced phonation to learn from, and their neural codecs/vocoders are optimised for harmonic structure. Layer on a second physical constraint: breathiness *is* noise. There is no such thing as noise-free breathiness — increasing perceived breathiness necessarily increases the noise floor, so you cannot get the texture by post-processing a clean voiced take without also getting hiss. ✅

The corresponding subjective numbers tell the same story. On ASMR-specific comfort MOS (the "tingle" axis), English A2A: ground truth **4.07**, CosyVoice2 **2.90**, F5-TTS **2.10**. That is not a small gap — 2.10 is "this does not produce the response at all." ✅

### 3.2 What practitioners report

- **A working erotic-audio voice actor, quoted in NBC News (2026):** he moved into erotica voice work specifically because generative AI would "rail over" traditional audiobook narration, and found "AI struggles to perform audio erotica. It can't moan well, and it often messes up the background noises these stories incorporate." ✅
- **ASMR production guides (2026)** advise flatly: "you won't get the breathy, unvoiced whisper quality of a human ASMRtist. Not yet. What you can get — soft-spoken narration, gentle affirmations, slow-paced guided meditations." And: "When authenticity is your brand … AI voices will alienate them." ⚠️ (secondary source, but it matches the paper)
- **ElevenLabs v2 vs v3 on whispering:** practitioners report v2 whisper techniques (inserting the word "whispering", ellipses for pauses) as unreliable — "in my case they never work" — while v3's `[whispers]` tag is "way better and much more consistent." So the tag genuinely helped; it just didn't cross the unvoiced threshold. ⚠️
- **ElevenLabs' own documented failure mode:** tags get *spoken aloud* instead of interpreted "when the selected voice doesn't match the requested delivery." Voice selection is therefore part of tag reliability, not separate from it. ✅
- **Reported artefacts relevant to us:** "slight digital sibilance on certain 's' sounds," most visible on female-leaning voices in dense scripts. For close-mic'd intimate content, sibilance artefacts are exactly the wrong failure mode. ⚠️
- **Google's own docs warn** that Gemini 3.1 Flash TTS may read your style instructions aloud if the prompt doesn't clearly trigger the synthesis classifier, and that pushing a voice far from its natural timbre degrades it. ✅

### 3.3 Techniques that actually help (in decreasing order of effect)

| Technique | Effect | Notes |
|---|---|---|
| **Record a human whispering** | Decisive | The only method that reaches R_UV ≈ 90%+ |
| **Reference audio that is itself whispered** (zero-shot in-context) | Large | CosyVoice2 hits 4.06 ASMR-MOS in ZH A2A — *when given an ASMR prompt*. This is the single best trick for pure TTS: clone from a whispered reference, don't ask a normal voice to whisper |
| **Separate emotion/style reference from timbre reference** | Large | IndexTTS-2's `emo_audio_prompt` + `emo_alpha`, decoupled from `spk_audio_prompt` — feed it a whispered emotion reference and a normal timbre reference |
| **Iterative re-feeding of output as the new prompt** | Medium, with a cost | DeepASMR: 2 passes raise style score +0.58→+0.80 and *reduce* WER, but speaker similarity drops 0.41→0.29. Step Audio EditX is built around this loop natively |
| **Free-form inline tags** (Fish 15k tags, Gemini 200+, ElevenLabs, Chatterbox `[whisper]`) | Medium | Shifts timbre and energy toward whisper; does not create unvoiced phonation |
| **Emotion enums** (Cartesia, MiniMax) | Small | No whisper primitive in either enum |
| **Post-processing** (EQ tilt, added breath noise, de-harmonics) | Small and risky | Cannot synthesise the aperiodic source that was never generated. Useful for polish, not for the core texture |

### 3.4 The hybrid path: human whisper + voice conversion

**Assess it seriously, because it is the recommendation.** The evidence is genuinely two-sided.

**Against:** the DeepASMR cascade experiments show TTS→VC pipelines failing at ASMR. `CosyVoice2 → SeedVC` scored ASMR-MOS **2.03** (EN) with LLM style score **−0.71** — negative, meaning the output read as *normal speech*. The authors' diagnosis is precise and worth quoting: SeedVC "produces clear 'whisper-like' normal speech rather than authentic ASMR. Listeners rated it higher on general impression due to audio clarity but penalized it on ASMR-MOS for lacking the true 'tingling' texture." A clean-sounding fake whisper is worse than useless for us. ✅

**For — and this is the load-bearing observation:** the failure was *directional*. In the reverse task (ASMR→Normal), the same cascade models produced **inflated** unvoiced ratios — 56.6–65.9% versus 33.8% for genuine normal speech. The paper describes this as a failure ("they fail to fully recover voicing from whispered inputs, resulting in output that remains perceptibly breathy or noisy"). For their purpose it is a bug. **For ours it is precisely the desired behaviour: when the source is a real whisper, the aperiodic texture survives the conversion and resists being re-voiced.** ✅ (measurement) / 🧮 (the inference)

So: **do not ask a model to invent a whisper. Ask it to move an existing whisper onto a different voice.**

| VC option | Licence | Native SR | Quality notes |
|---|---|---|---|
| **Seed-VC** (`seed-uvit-whisper-base`, SVC variant) | Repo permissive ⚠️ — verify | **44.1 kHz** via BigVGAN ✅ | Zero-shot from 1–30 s. Beats OpenVoice and CosyVoice on speaker similarity (SECS 0.868) and intelligibility (WER 11.99%). **Beats speaker-specific RVCv2 models on similarity and CER despite never seeing the target.** Authors concede DNSMOS audio quality is *slightly below* RVCv2 and flag it as a known weakness. Fine-tuning on custom data needs as little as 1 utterance/speaker and ~100 steps ✅ |
| **RVC / Applio** | MIT ✅ | Model-dependent | Higher raw audio quality (DNSMOS) than Seed-VC per Seed-VC's own eval; requires per-target training; huge practitioner community |
| **so-vits-svc** | ❌ **AGPL-3.0 — viral.** Avoid in a commercial product unless you intend to comply with AGPL network-service obligations ✅ | — | — |
| **Hume Octave 2 voice conversion** | Commercial API | **48 kHz** ✅ | "Exchange one voice for another while freezing the phonetic qualities and timing of the spoken utterance … making precise human touch-ups to AI voiceovers." This is exactly the primitive we need, in a supported product, at 48 kHz. Blocked only by Hume's ToS ambiguity (§1.3) ✅ |

**Critical architectural warning.** Seed-VC's content encoder is **OpenAI Whisper-small**, and its input is resampled to 16 kHz before semantic extraction. Whisper-family ASR degrades substantially on whispered speech — a 2026 SOTA paper reports baseline CER of 3.98% on whispered Mandarin and hallucination rates *above 25%* before mitigation. So a whispered source may be poorly encoded, causing dropped or garbled content. Two mitigations: (a) fine-tune the target-speaker model on whispered data, which Seed-VC supports cheaply; (b) validate every converted clip with ASR round-trip QC (§6.4) using a whisper-robust recogniser. This risk is specific and testable — put it in the first prototype. ✅ (Whisper ASR degradation) / 🧮 (the implication for Seed-VC)

**Also note:** in English, whispered ground truth transcribes at 5.11% WER versus 3.00% for normal speech — degraded but workable. In Mandarin the same comparison is **43.2% CER versus 4.4%** — catastrophic. English-only is a meaningful de-risking decision for the QC layer. ✅

### 3.5 Honest verdict on whispering

AI can produce a **convincing soft-spoken intimate read**. It cannot produce a **convincing whisper**. Those are different products, and the difference is measurable at roughly 2.6× on unvoiced ratio and ~2 full MOS points on the tingle axis.

If the app's promise is "close, breathy, someone is actually next to you," pure TTS fails the promise today. If part of the catalogue is "slow, warm, low-volume narration for sleep and relaxation," pure TTS clears that bar comfortably and cheaply.

---

## 4. Multi-character / dialogue audio

| Tool | Speakers | Turn-taking / interruption / overlap | Licence or cost | Assessment for two-person intimate scenes |
|---|---|---|---|---|
| **ElevenLabs Text to Dialogue** (`/v1/text-to-dialogue`, v3 only) | Up to **10 unique voice IDs** ✅ | **The best control surface available.** Explicit tags `[interrupting]`, `[overlapping]`, `[cuts in]`, `[jumping in]`; em-dash convention for trailing/unfinished lines; the model generates the joins natively including "audible breath and timing between speakers" ✅ | $0.10/1k chars | **Best available.** Hard limit: **2,000 characters total across all turns per request** — roughly 3 minutes of slow delivery, so a 20-minute scene needs 7+ stitched requests. Output is nondeterministic; `seed` gives "more consistent" (not identical) results ✅ |
| **Higgs Audio v2/v2.5** | Multi-speaker via `[SPEAKER0]`/`[SPEAKER1]`, voices described in a `scene` role ✅ | Zero-shot multi-speaker dialogue with double voice cloning; benchmarked on 1,000 two-speaker dialogues of 4–10 turns ✅ | **Apache 2.0** (v2 only — v3 is NC) ✅ | Strong self-hosted option. Community WebUIs already implement the right consistency trick: use the first generated clip per speaker as the reference for that speaker's later lines ✅ |
| **VibeVoice 1.5B / 7B** | **Up to 4 speakers, ~90 min continuous, 64K context** ✅ | Built for podcast-length multi-speaker; the longest continuous generation of anything here | MIT but **withdrawn by Microsoft**; community forks lawful and maintained ✅ | Technically the best fit for long two-hander scenes; carries reputational and supply risk. Microsoft pulled it *because of misuse*, which is a signal about how a vendor would view our use case |
| **Dia 1.6B / Dia2 (Nari Labs)** | 2 via `[S1]`/`[S2]`, strictly alternating ✅ | Non-verbals trained against **real audio events** rather than text descriptions, so `(laughs)`/`(sighs)`/`(gasps)`/`(inhales)`/`(exhales)` produce actual vocalisations instead of a spoken "haha" — the standout capability in this table for our content ✅ | **Apache 2.0** ✅ | Excellent for reaction sounds and breath. Limits: English only, must alternate S1/S2, "use non-verbal tags sparingly … overusing or using unlisted non-verbals may cause weird artifacts" ✅ |
| **Google Gemini TTS multi-speaker** | **Maximum 2 speakers** ✅ | Natural-language direction + 200+ tags | ~$3.01/finished hr | Adult content banned; SynthID watermark. Out. |
| **CoVoMix / CoVoMix2** | Multi-talker, fully non-autoregressive flow matching, designed for human-like multi-talker conversation ✅ | Research systems for simultaneous multi-talker generation | Research ⚠️ | Worth watching for genuine simultaneous overlap, which is the one thing tag-based systems fake rather than model |

**The honest limitation on overlap.** `[overlapping]` in ElevenLabs and its equivalents shape *delivery* — the model produces speech that sounds like it is overlapping. None of these systems gives you two independently controlled, time-aligned voice tracks. For real overlap, real interruption timing, and the ear-to-ear spatial separation an intimate two-hander needs, you generate each character's lines separately and align them in a DAW or programmatic mix. Which you must do anyway (§7.2).

---

## 5. Cost model

### 5.1 Synthesis vs. human, per finished stereo hour

Includes the 40% discard assumption. Post-production (stereo/binaural imaging, breath layering, mastering) is listed separately because **it is required on every path** — TTS output is mono and unmixed.

| Path | Talent / API | Compute or session | Post-production | **All-in per finished hour** | Notes |
|---|---|---|---|---|---|
| Kokoro 82M, self-hosted | — | $0.02–0.04 | $60–150 | **$60–150** | No cloning, no emotion. Unusable for our core content |
| Qwen3-TTS 1.7B, self-hosted (owned box) | — | $0.11–0.25 | $60–150 | **$60–150** | Apache 2.0; 3 s cloning; paralinguistic-preserving tokenizer |
| Higgs Audio v2, self-hosted | — | $0.28–0.62 | $60–150 | **$60–150** | Apache 2.0; multi-speaker |
| Self-hosted, amortised dedicated offshore box @ 200 hr/mo | — | $1.50–3.00 ⚠️ | $60–150 | **$62–153** | Realistic figure once idle time is counted |
| Inworld TTS-2 (Growth) | $0.79 | — | $60–150 | **$61–151** | 48 kHz; adult ToS unverified |
| Fish Audio S2.1 Pro (API) | $0.95 | — | $60–150 | **$61–151** | Best tag surface; adult ToS unverified |
| Azure Neural HD | $1.40 | — | $60–150 | **$61–151** | `whispering`/`panting` styles; adult content almost certainly banned |
| Cartesia Sonic-3 (Scale) | $3.37 | — | $60–150 | **$63–153** | 44.1 kHz |
| **ElevenLabs v3 (API PAYG)** | **$6.67** | — | $60–150 | **$67–157** | Best commercial quality + most permissive major-vendor ToS |
| Hume Octave 2 (Creator) | $9.53 | — | $60–150 | **$70–160** | 48 kHz + voice conversion |
| **Human VA, non-union straight read** | $150–500 PFH ✅ | — | $50–100 PFH ✅ | **$200–600** | Audiobook market rate; not intimate-specialist |
| **Human VA, SAG-AFTRA / ACX floor** | $250 PFH ✅ (union session $200–275 + ~19% H&R ⚠️) | — | $50–100 | **$300–450** | ACX union minimum |
| **Human VA, intimate/erotic specialist** | $400–800 PFH 🧮 (Dipsea: $400/session-hr recurring, $200/session-hr one-off, 2020 ✅; ~2 session-hrs per finished hr for intimate work 🧮; 2026-adjusted $500–1,000 ⚠️) | — | $100–200 (breath/SFX passes, more editing) | **$600–1,200** | The genuine comparator for our core content |
| **Human, fully produced two-hander with direction + intimacy coordination** | | | | **$1,200–2,500** ⚠️ | Quinn employs a dedicated intimacy coordinator / script consultant ✅ |
| **Solo creator model (reference point)** | | | | **~48 labour-hours per finished hour** ✅ | A working Dipsea/Quinn creator reports ~12 hours to produce a 15-minute audio, covering writing, recording, own SFX (panting, heavy breathing) and editing |

Post-production estimates are ⚠️ (my figures, based on $60–150/hr for an audio engineer at 1–2 hours of work per finished hour for the synthesis paths, more for human multi-take material).

### 5.2 What the cost model actually tells you

The synthesis paths are **within noise of each other** once post-production is included — the spread from cheapest to most expensive API is about $9 on a $60–160 total. **Choosing a TTS vendor on price is a mistake.** Choose on whisper quality, tag surface, sample rate, and ToS, then treat cost as a rounding error.

The real decision is the **~10× gap between any synthesis path (~$60–160) and human intimate performance (~$600–1,200)**. At 10×, a blend is obviously correct: the question is only what fraction of the catalogue justifies the premium.

---

## 6. Voice identity & casting

### 6.1 Options for ownable voices

| Route | What you get | What it costs | Risk |
|---|---|---|---|
| **Buy out a voice actor's recordings + AI rights (recommended)** | A perpetual, worldwide licence to a dataset you own, usable to train/clone in any model you choose, on any infrastructure | 2–3 h recording session + buyout. **$1,500–4,000 per voice** ⚠️ (my estimate from PFH rates + a buyout premium) | Contract must explicitly cover synthetic reproduction, adult content, perpetuity, and successor models. This is the clause that gets missed |
| **ElevenLabs Voice Library** | Instant access to 10,000+ voices | Base **$0.03 per 1,000 characters** to the actor, up to **$0.20/1k for HQ/Studio Quality** status ✅ (ElevenLabs has paid out >$5M total ✅). At 38,000 chars/finished hour that is **$1.14–7.60/hr in royalties on top of generation cost** 🧮 | ❌ **You do not own or control the voice.** The actor sets a *notice period* — from immediate removal up to two years — after which they can withdraw and you must transition away. A hit character's voice can disappear. Also: no evidence Voice Library actors consented to erotic use of their voice, which is both an ethical and a contractual problem ✅ |
| **ElevenLabs direct licensing deal** | Ultra-high-quality Default Voices | Negotiated ⚠️ | Locks you to one vendor for the life of the voice |
| **Voice Design from a text description** | A wholly synthetic speaker, no real person's identity, **no consent problem to manage** | ElevenLabs `eleven_ttv_v3`; Hume Voice Design; MiniMax Voice Design ($3/voice ✅); **Maya1 and Qwen3-TTS-VoiceDesign do this in open weights under Apache 2.0** ✅ | Least legal risk and genuinely ownable-feeling. But you inherit whatever whisper ability the base model has — which is the thing that doesn't work (§3). Also: Hume's API rejects descriptions that read as a child voice (`E0809`) ✅ |
| **Open model + your own recorded dataset** | Full ownership of voice, weights, and infrastructure | Recording cost + fine-tuning compute | Requires the buyout contract above; requires you to operate the stack |

### 6.2 Minimum audio for a high-quality clone, 2026

| Tier | Audio needed | What you get |
|---|---|---|
| Zero-shot in-context (Qwen3-TTS, Voxtral, Higgs v2) | **3 seconds** ✅ | Recognisable timbre. Style and prosody follow the reference clip, so a 3 s *whispered* clip is more useful than 3 s of normal speech |
| Zero-shot, better (Chatterbox, Inworld, Cartesia) | 5–15 s ✅ | Solid timbre match |
| Zonos, Seed-VC | 10–30 s ✅ | Zonos wants 10–30 s; Seed-VC works from 1–30 s |
| ElevenLabs Instant Voice Cloning | 1–3 min ✅ | Good for most voices; "may struggle with uncommon accents or unique voices" |
| **ElevenLabs Professional Voice Clone** | **30 min minimum, 2–3 h optimal** ✅ | Fine-tuned model, "virtually indistinguishable." Runtime matters, not sample count; split into ~30 min files; training takes 3–6 h. ElevenLabs notes **>2 h yields little improvement and can occasionally hurt** |
| Seed-VC speaker fine-tune | **1 utterance minimum, ~100 training steps** ✅ | Meaningfully improves a specific target beyond zero-shot — cheap enough to do per character |

**Practical recording spec for our buyout sessions** 🧮: 2–3 hours per voice at 48 kHz / 24-bit, close-mic'd, treated room, deliberately split across (a) neutral read-style, (b) sustained genuine whisper, (c) breathy/intimate delivery at conversational volume, (d) a **non-verbal library**: inhales, exhales, sighs, moans, swallows, lip parts, smiles-while-speaking, hesitations, laughs. That fourth category is what nothing else can give you, it is cheap to record, and it is reusable across every asset the voice ever appears in.

---

## 7. Pipeline engineering

### 7.1 Chunking and consistency across a 20-minute story

Every system here has a short generation window, so chunking is mandatory:

| System | Practical window |
|---|---|
| ElevenLabs Text to Dialogue | 2,000 chars total per request ✅ |
| Google Gemini TTS | 32K token context ✅ |
| OpenAI gpt-4o-mini-tts | 2,000 input tokens ✅ |
| MiniMax | 10,000 chars ✅ |
| Step Audio EditX | designed for <30 s clips ✅ |
| NVIDIA Magpie | 20 s per inference ✅ |
| VibeVoice 1.5B | ~90 min, 64K context — the outlier ✅ |

Techniques that hold voice and energy stable across chunks:

1. **Self-referencing chunk chaining.** Use the first generated clip for a speaker as the reference audio for all that speaker's subsequent chunks. This is what Higgs Audio community WebUIs implement as "Smart Voice Consistency," and it directly addresses drift ✅. In multi-speaker mode, keep one reference per speaker.
2. **Request-stitching with context, where the vendor supports it.** Pass previous/next text so the model knows the surrounding prosody rather than restarting cold at every boundary.
3. **Chunk on semantics, not characters.** Split at paragraph and beat boundaries; never mid-sentence, and never across an emotional turn.
4. **Pin the seed and the model version.** ElevenLabs' `seed` gives "more consistent" results, not determinism — output is explicitly nondeterministic ✅. Treat seeds as reducing variance, not eliminating it, and pin exact model IDs (`gpt-4o-mini-tts-2025-12-15`-style snapshots) so a silent vendor upgrade can't change a character's voice mid-catalogue.
5. **Normalise before stitching.** Per-segment RMS normalisation to a common level, sample-rate harmonisation across backends (24 kHz vs 44.1 kHz), and crossfades with format-dependent pause lengths that differ for same-speaker, speaker-change, and paragraph-end joins ✅.
6. **Beware the iterative-refinement trade-off.** Re-feeding output as the new prompt strengthens style but erodes identity: DeepASMR measured speaker similarity falling 0.41 → 0.29 → 0.25 across three passes ✅. Cap at 2 passes, and only where texture matters more than recognisability.

### 7.2 Stereo and the mono problem

**Every TTS system here outputs mono.** (MiniMax exposes a `channel: stereo` flag, but that is duplication, not imaging ✅.) The ear-to-ear spatial illusion that defines ASMR — a voice that moves, that is genuinely closer to one ear — has to be built in post: HRTF/binaural placement, close-mic proximity effect, room tone, breath layered slightly off-axis from speech.

This has a strategic consequence worth stating plainly: **since a DAW/DSP stage is mandatory on every path, the marginal cost of the hybrid approach is much lower than it first appears.** You are already going to be compositing tracks. Adding a human-recorded breath and non-verbal layer to a synthesised narration bed is one more track in a session you must build anyway.

Delivery format: MP3 at 128–192 kbps low-passes around 16–19 kHz and will audibly damage the sibilance and air that carry the effect. Ship AAC at 256 kbps+ or Opus at high bitrate; master at 48 kHz. Audiobook loudness convention is −18 LUFS ✅, but intimate ASMR is typically quieter and more dynamic — set your own target and hold it consistently across the catalogue, because inconsistent loudness between assets breaks immersion faster than any single asset's quality.

### 7.3 Pronunciation of unusual words

- **ElevenLabs:** pronunciation dictionaries, up to 3 locators per request, applied in order; plus `apply_text_normalization` with `auto`/`on`/`off` ✅. The docs note the dictionary "fixes most" mispronunciation issues "but you have to know it exists and configure it" ⚠️.
- **Azure:** custom lexicon files referenced from SSML ✅.
- **IndexTTS-2:** Pinyin-level pronunciation control ✅.
- **MiniMax:** `english_normalization` flag for numbers/dates ✅.
- **Qwen3-TTS:** the technical report claims improved handling of uncommon words, repeated words, numbers and symbols ✅.
- **Pattern to adopt:** maintain one canonical pronunciation dictionary per character/voice in version control, applied to every request. Character names, invented place names and brand terms are exactly where autoregressive TTS mispronounces and where listeners notice.

### 7.4 Automated QC: ASR round-trip

This is a real, established practice with real tooling, and there is a 2026 production case study with numbers. ✅

**The reference architecture** (from `ttsproof` / the `qa_tts` framework, Zenodo 2026-06-19, and the TTS-Suite platform):

1. **Structural checks first, no model needed.** Empty or truncated audio, duration explosions, long internal silences, clipping, repeated-chunk loop detection, end-of-clip artefacts. Just numpy + soundfile. These catch the failures WER misses entirely.
2. **Equivalence-aware WER/CER.** Canonicalise *both* the expected text and the ASR transcript to spoken form — numbers, decimals, dates, clock times, acronyms, single letters — before scoring. Otherwise `3:30 PM` vs "three thirty pee em" fails a perfectly good take.
3. **Per-category scoring policies.** `strict` (equivalence-aware WER) for normal prose; `keywords` (key tokens must survive) for URLs and currencies with many valid readings; `structural` (audio just has to survive) for emoji and punctuation storms.
4. **ASR-uncertainty quarantine — the finding that matters.** When audio is structurally clean but ASR disagrees on a very short utterance, route it to a human instead of auto-failing. The published blinded validation of that zone found it was a **45/55 mix — 19 real TTS mispronunciations and 23 ASR false negatives** across 42 quarantined cases (with 15/15 on ASR-passed controls). The conclusion is explicit: "ASR both over- and under-reports TTS failure."
5. **Selective regeneration.** Regenerate only flagged segments, optionally with a different emotion/seed. TTS-Suite does exactly this with Qwen3-ASR round-trip and a **default WER threshold of 10%, configurable per project** ✅.

**Our whisper-specific adjustment.** Whispered English transcribes at 5.11% WER versus 3.00% normal ✅ — so a flat 10% threshold will produce false failures on the very content we care most about. Two changes: **(a) calibrate the threshold per delivery style** (measure your own whispered baseline first, then set the threshold above it); **(b) use a whisper-robust recogniser.** Off-the-shelf Whisper hallucinates on whispered audio at rates above 25% before mitigation; 2026 whisper-aware ASR gets that to 4.5% ✅. Do not build your QC gate on a recogniser that hallucinates on your primary content type.

**What ASR round-trip will never catch:** whether the take is *arousing*. WER measures whether the words are there. Nothing automated measures micro-prosody. Budget for human listening on a sampled basis — the DeepASMR authors needed 12 human listeners scoring a dedicated ASMR-comfort MOS to separate models that WER ranked identically.

---

## 8. Recommendation

### 8.1 Primary stack

**Architecture: human-performed whisper as the spine; AI for multiplication and bulk.**

| Layer | Choice | Why |
|---|---|---|
| **Voice identity** | Cast **4–8 voices**; 2–3 h recording session each at 48 kHz/24-bit; **perpetual worldwide buyout explicitly covering synthetic reproduction and adult content**. Budget $1,500–4,000/voice ⚠️ | You own the dataset, so you are never hostage to a vendor's ToS change or a Voice Library actor's two-year withdrawal notice |
| **Core intimate / explicit content (~20–30% of catalogue)** | **Human whispered performance**, recorded per asset | The only thing that reaches R_UV ≈ 90%. This is the product's promise; do not synthesise it |
| **Character multiplication** | **Seed-VC**, fine-tuned per target voice (1 utterance minimum, ~100 steps), 44.1 kHz BigVGAN variant | One whispered performance → N character voices. Whisper→X conversion preserves aperiodic texture (§3.4). Fine-tune rather than zero-shot to close the DNSMOS gap vs RVC |
| **Bulk non-explicit narration (sleep, relaxation, soft-spoken, ~70%)** | **Qwen3-TTS-12Hz-1.7B** (Apache 2.0, 3 s cloning, paralinguistic-preserving tokenizer) with **IndexTTS-2** as the expressive alternative for its decoupled emotion-reference + 8-dim emotion vector — *pending IndexTTS-2 licence verification* | Both self-hostable, both clone from our owned dataset, no per-character fees, no vendor ToS exposure |
| **Two-person scenes** | **Higgs Audio v2** (Apache 2.0, `[SPEAKER*]`, double voice cloning) for the narration bed; generate each character separately and align in the DAW | Real overlap and interruption timing cannot be delegated to a tag |
| **Non-verbals and micro-prosody** | **Human-recorded per-voice sample libraries** (inhales, exhales, sighs, moans, swallows, lip parts, smiles, hesitations), composited in post on every asset regardless of source | This is the highest-leverage item in the whole document. It is cheap, it is fully owned, it works with any TTS backend, and it is the specific thing practitioners say AI cannot do ("it can't moan well") |
| **Non-verbal fallback where recording isn't available** | **Dia (Apache 2.0)** — `(sighs)`, `(gasps)`, `(inhales)`, `(exhales)` trained against real audio events rather than text | Produces actual vocalisations rather than a spoken "haha" |
| **Post-production** | Mandatory DAW/DSP stage: binaural/HRTF imaging, breath layering off-axis, RMS-normalised stitching with crossfades, −18 LUFS-class mastering, AAC 256 kbps+ or Opus delivery at 48 kHz | TTS is mono; stereo intimacy is engineered, not generated |
| **Infrastructure** | **Owned hardware (single RTX 4090/5090 workstation) or an offshore provider whose AUP permits legal adult content.** Explicitly **not** Modal, Replicate, Baseten, RunPod or fal | All five mainstream GPU platforms carry obscenity/pornography clauses. This is a one-time infrastructure decision, not a per-request risk |
| **QC** | Structural checks → equivalence-aware WER with a **whisper-robust** recogniser → ASR-uncertainty quarantine → selective regeneration. Per-delivery-style WER thresholds. Sampled human listening on an ASMR-comfort scale | Automated QC catches dropped words; only humans catch a take that isn't arousing |

### 8.2 Fallback stack

| Scenario | Fallback |
|---|---|
| **Prototyping, and non-explicit sleep/relaxation content** | **ElevenLabs v3 API** — best commercial quality, best tag surface, 44.1 kHz PCM (needs Pro plan for the format), and the most permissive adult-content policy of any major vendor. Route volume through the metered API at $0.10/1k chars rather than burning subscription credits at $166/M. **~$6.67/finished hour** 🧮 |
| **Fidelity-critical, need 48 kHz + voice conversion in one managed API** | **Hume Octave 2** — 48 kHz output and a purpose-built voice-conversion primitive that freezes phonetics and timing while swapping voice. Blocked only by ToS ambiguity; worth a direct written query to Hume before building on it |
| **Highest open-weight quality with Apache 2.0** | **Step Audio EditX** — top of the open board at 1,118 Elo, 20+ paralinguistic tags including breathing and sighing, and native iterative re-editing in token space. Costs: <30 s per inference, no European languages, and the least production shakedown of anything near the top |
| **Need 44.1 kHz from open weights** | **Zonos-v0.1** — the only open model with native 44.1 kHz output, runs on 6 GB, Apache 2.0. Caveats: still labelled v0.1 eighteen months on, and Zyphra publishes no quantitative benchmarks at all |
| **Voice identity without any consent exposure** | **Maya1** or **Qwen3-TTS-VoiceDesign** — describe a synthetic speaker in text, both Apache 2.0. You inherit the base model's whisper limitations |
| **Longest continuous multi-speaker generation** | **VibeVoice 1.5B/7B** via community fork — 4 speakers, ~90 minutes. Lawful under MIT; accept the reputational and supply risk of a model its author withdrew for misuse |

### 8.3 Explicitly rejected

| Rejected | Reason |
|---|---|
| OpenAI TTS | Erotic speech generation explicitly restricted; classifier blocks on prompt content ✅ |
| Google Gemini TTS / Chirp | Sexually explicit content prohibited; `PROHIBITED_CONTENT` classifier; SynthID watermark ✅ |
| PlayAI / PlayHT | ToS bans pornographic and "lascivious" generation ✅ |
| Resemble AI (as a vendor) | Discretionary content removal; consent-gated cloning. *Their MIT-licensed Chatterbox model remains usable self-hosted* ✅ |
| Azure Speech, AWS Polly | Adult content near-certainly prohibited ⚠️ — and Azure's `whispering`/`panting` styles are the most tempting trap in this document |
| XTTS-v2 | CPML non-commercial in perpetuity with no living counterparty ✅ |
| Fish Audio S2 Pro weights, Voxtral TTS, Higgs Audio **v3** | Non-commercial licences. (Fish's *API* remains an option if its adult ToS clears) ✅ |
| so-vits-svc | AGPL-3.0 viral licence ✅ |
| ElevenLabs Voice Library voices as primary characters | You don't own them; up to two-year withdrawal notice; no evidence of actor consent to erotic use ✅ |
| Modal / Replicate / Baseten / RunPod / fal for explicit generation | All carry obscenity or pornography prohibitions ✅ |
| Kokoro, NVIDIA Magpie | No voice cloning and no emotion control in the open weights ✅ |
| Pure-TTS whispering as the product's core | Measured at 35.4% unvoiced ratio versus 91.8% for real ASMR ✅ |

### 8.4 Where AI TTS is still not good enough — the brutal version

1. **It cannot whisper.** 35.4% vs 91.8% unvoiced ratio. Not a prompt-engineering problem; a training-data and vocoder-architecture problem.
2. **It cannot moan.** Reported directly by a working erotic-audio performer, and consistent with the unvoiced-phonation finding. Non-verbal sexual vocalisation is almost entirely aperiodic — the exact thing these models don't model.
3. **Most of it is 24 kHz**, which throws away the 12–20 kHz band that carries sibilance, lip transients and air. For ASMR that band is not detail, it is the payload.
4. **It is nondeterministic and drifts.** ElevenLabs documents output as nondeterministic with `seed` only improving consistency. Style-strengthening via iterative refinement costs speaker identity (0.41 → 0.25 over three passes). Long-form consistency is a pipeline problem you solve, not a model property you get.
5. **Tags are suggestions.** ElevenLabs will speak a tag aloud if the voice doesn't suit the direction. Cartesia states outright that emotion parameters are "guidance rather than strict adjustments." Google warns its model may read your director's notes aloud.
6. **It is mono.** No system generates the binaural intimacy the format depends on.
7. **The good stuff is often unlicensable.** The two best-sounding open models on the board are non-commercial; the only large ASMR corpus in existence is CC BY-NC 4.0; the best long-form multi-speaker model was withdrawn by its author.
8. **The infrastructure is closed to you too.** Every mainstream serverless GPU platform prohibits the content, so "self-host it" is an infrastructure project, not an afternoon.
9. **QC cannot measure the thing you sell.** WER measures words. Nothing automated measures whether a listener responds. Human listening is a permanent line item.

---

## 9. Open questions to resolve before committing budget

1. **Direct written confirmation of adult-content permissibility** from ElevenLabs, Hume, Cartesia, Fish Audio, Inworld and MiniMax. The ElevenLabs "age-inappropriate material … promotes sexual material" clause needs a lawyer's read, not mine.
2. **IndexTTS-2's actual licence** — read `LICENSE` and `DISCLAIMER` in the repo. Reviews claim Apache 2.0; PyPI declares `LicenseRef-Bilibili-IndexTTS`. These cannot both be right.
3. **Fish Audio S2.1 Pro output sample rate** — undocumented in everything I searched, and it matters given its otherwise best-in-class tag surface.
4. **Cartesia's real metering** — "15 credits/sec" vs "1 credit/char" appear in different documents.
5. **Offshore GPU pricing.** None of the adult-permitted providers publishes hourly rates. Get quotes; compare against simply buying two 5090 workstations.
6. **Measure R_UV yourself.** The DeepASMR metric is straightforward (PYIN F0 detection + RMS energy gating over frames). Implement it and score every candidate model and every VC configuration on your own scripts and your own voices. This is the single most valuable engineering hour in this project — it converts "does this sound whispery enough?" into a number you can gate on.
7. **Prototype the whisper→VC path end to end** before signing any voice buyouts: record 10 minutes of genuine whispered performance, convert it through Seed-VC to 3 target voices, and measure R_UV, ASR WER, and blind ASMR-comfort MOS against both the source and an ElevenLabs v3 `[whispers]` baseline.
8. **Test bandwidth extension / audio super-resolution** as a rescue path for 24 kHz open models. Whether a super-resolution model can plausibly reconstruct the 12–20 kHz breath/sibilance band or merely invents plausible-sounding hiss is an empirical question I did not research. ⚠️

---

## Sources

**ASMR & whispered speech research**
- DeepASMR: LLM-Based Zero-Shot ASMR Speech Generation for Anyone of Any Voice — https://arxiv.org/html/2601.15596v1
- DeepASMR demo page — https://vivian556123.github.io/deepasmr-demo/
- DeepASMR-DB samples — https://github.com/vivian556123/DeepASMR-DB-samples
- Whisper-Aware LLM: Robust Whispered Speech Recognition — https://arxiv.org/html/2608.10836v1
- FlowW2N: Whispered-to-Normal Speech Conversion via Flow-Matching — https://doi.org/10.48550/arxiv.2603.04296
- WhisperVC: Decoupled Cross-Domain Alignment for Low-Resource Whisper-to-Normal Conversion — https://arxiv.org/html/2511.01056v3
- WhispEar: Bi-directional Whispered Speech Conversion — https://doi.org/10.48550/arxiv.2603.08046
- Experience-Calibrated Contrastive Decoding for Mitigating Hallucinations in LM-Based TTS — https://arxiv.org/html/2608.00722
- Seed-VC: Zero-shot Voice Conversion with Diffusion Transformers — https://arxiv.org/html/2411.09943
- Seed-VC repo and evaluation — https://github.com/Plachtaa/seed-vc · https://github.com/Plachtaa/seed-vc/blob/main/EVAL.md
- Seed-VC architecture walkthrough — https://dev.to/orca_forge/in-depth-explanation-of-the-seed-vc-architecture-decomposing-voice-into-who-what-and-how-in-a-3hjh
- IndexTTS2 (AAAI) — https://doi.org/10.1609/aaai.v40i41.40820
- Qwen3-TTS Technical Report — https://arxiv.org/html/2601.15621

**Commercial TTS: capability, pricing, policy**
- ElevenLabs v3 overview — https://help.elevenlabs.io/hc/en-us/articles/35869054119057-What-is-Eleven-v3
- ElevenLabs v3 launch — https://elevenlabs.io/blog/eleven-v3
- ElevenLabs audio tags — https://elevenlabs.io/blog/v3-audiotags
- ElevenLabs models — https://elevenlabs.io/docs/overview/models
- ElevenLabs pricing — https://elevenlabs.io/pricing · API rate card — https://elevenlabs.io/pricing/api
- ElevenLabs Text to Dialogue — https://elevenlabs.io/docs/overview/capabilities/text-to-dialogue · https://elevenlabs.io/docs/api-reference/text-to-dialogue/stream.md
- ElevenLabs multi-character dialogue tags — https://elevenlabs.io/blog/eleven-v3-audio-tags-bringing-multi-character-dialogue-to-life
- **ElevenLabs Prohibited Use Policy** — https://elevenlabs.io/use-policy
- ElevenLabs Image & Video Terms — https://elevenlabs.io/image-and-video-terms · ElevenAgents Terms — https://elevenlabs.io/agents-terms
- ElevenLabs Professional Voice Cloning — https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/professional-voice-cloning
- ElevenLabs Voice Actor Payouts — https://help.elevenlabs.io/hc/en-us/articles/22976234546705-What-are-Voice-Actor-Payouts · https://elevenlabs.io/payouts · https://elevenlabs.io/docs/eleven-creative/voices/payouts.mdx
- ElevenLabs Voice Library monetisation — https://elevenlabs.io/blog/monetize-your-voice-with-elevenlabs-voice-library-and-create-passive-income
- Hume Octave 2 launch — https://www.hume.ai/blog/octave-2-launch
- Hume Octave original launch (48 kHz) — https://www.hume.ai/blog/octave-the-first-text-to-speech-model-that-understands-what-its-saying
- Hume acting instructions — https://dev.hume.ai/docs/text-to-speech-tts/acting-instructions.mdx · Voice Design — https://dev.hume.ai/docs/voice/voice-design.mdx · FAQ — https://dev.hume.ai/docs/text-to-speech-tts/faq.mdx · Errors — https://dev.hume.ai/docs/resources/errors.mdx
- **Hume Acceptable Use Policy** — https://www.hume.ai/acceptable-use-policy · Terms — https://www.hume.ai/terms-of-use
- Cartesia volume/speed/emotion — https://docs.cartesia.ai/build-with-cartesia/sonic-3/volume-speed-emotion
- Cartesia provider reference (44.1 kHz default) — https://www.speechsdk.dev/docs/providers/cartesia
- Cartesia pricing analyses — https://www.eesel.ai/blog/cartesia-sonic-3-pricing · https://theplanettools.ai/tools/cartesia
- MiniMax pay-as-you-go pricing — https://platform.minimax.io/docs/guides/pricing-paygo
- MiniMax Speech 2.6 HD/Turbo parameters — https://replicate.com/minimax/speech-2.6-hd/readme · https://replicate.com/minimax/speech-2.6-turbo/readme · https://wavespeed.ai/docs/docs-api/minimax/minimax-speech-2.6-turbo
- Fish Audio pricing & rate limits — https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits · https://fish.audio/text-to-speech-api/ · https://fish.audio/developers/
- Inworld TTS pricing & capability — https://inworld.ai/tts · https://inworld.ai/tts-api · https://docs.inworld.ai/tts/capabilities/generating-audio
- Inworld voice-agent cost model — https://inworld.ai/resources/voice-agent-cost-per-minute-2026
- Azure Neural HD voice updates (styles incl. whispering, panting; $22/M) — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-speech-%E2%80%93-neural-hd-text-to-speech-recent-voice-updates/4505380
- Azure TTS docs & FAQ — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech · https://learn.microsoft.com/en-us/azure/ai-services/speech-service/faq-tts
- Azure whispering-style SSML limitation — https://learn.microsoft.com/en-us/answers/questions/1863460/issue-with-the-azure-text-to-speech-(tts)-service
- Google Cloud TTS pricing — https://cloud.google.com/text-to-speech/pricing
- Gemini TTS docs (multi-speaker, limitations, PROHIBITED_CONTENT) — https://ai.google.dev/gemini-api/docs/speech-generation
- Gemini 3.1 Flash TTS (200+ audio tags) — https://cloud.google.com/blog/products/ai-machine-learning/gemini-3-1-flash-tts-on-google-cloud
- **OpenAI GPT-4o System Card (erotic speech restriction)** — https://openai.com/index/gpt-4o-system-card/ · https://cdn.openai.com/gpt-4o-system-card.pdf
- OpenAI gpt-4o-mini-tts model page — https://developers.openai.com/api/docs/models/gpt-4o-mini-tts
- **PlayAI Terms of Service** — https://play.ht/terms/ · https://play.ai/terms
- **Resemble AI Terms of Service** — https://www.resemble.ai/terms-of-service · Ethics — https://www.resemble.ai/company/ethics
- TTS API pricing roundups — https://onepin.ai/blog/tts-api-pricing-guide-2026 · https://gradium.ai/content/best-text-to-speech-apis-2026 · https://www.speechmatics.com/company/articles-and-news/best-tts-apis-in-2025-top-12-text-to-speech-services-for-developers
- AI adult-content policy tracker — https://aihaven.com/ai-adult-content-policy-tracker/

**Open-weight models**
- Best Open Source Self-Hosted TTS Models in 2026 (Elo board, licence audit) — https://pinggy.io/blog/best_open_source_self_hosted_text_to_speech_models/
- Qwen3-TTS repo, docs and weights — https://github.com/qwenlm/qwen3-tts · https://qwenlm-qwen3-tts.mintlify.app/resources/faq · https://qwenlm-qwen3-tts.mintlify.app/resources/changelog · https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base
- Higgs Audio repo (v3 non-commercial notice) — https://github.com/boson-ai/higgs-audio · v2 model card — https://huggingface.co/bosonai/higgs-audio-v2-generation-3B-base · Transformers docs — https://huggingface.co/docs/transformers/model_doc/higgs_audio_v2 · Boson blog — https://www.boson.ai/blog/higgs-tts-2
- Higgs Audio VRAM/RTF issue thread — https://github.com/boson-ai/higgs-audio/issues/117
- Higgs Audio community WebUIs (chunking, voice consistency) — https://github.com/Tenidus/Higgs-Audio-v2-Gradio-Interface · https://github.com/Saganaki22/higgs-audio-WebUI
- IndexTTS repo — https://github.com/index-tts/index-tts · inference package (licence declaration) — https://pypi.org/project/indextts2-inference/
- VibeVoice (Microsoft, withdrawal notice) — https://github.com/microsoft/VibeVoice · community fork — https://github.com/vibevoice-community/VibeVoice
- Dia (Nari Labs) — https://github.com/nari-labs/dia · https://deepwiki.com/nari-labs/dia/3-using-dia · https://okmiku.com/blog/dia-1-6b-dialogue-first-tts
- Higgs/IndexTTS/Chatterbox/Zonos secondary reviews — https://reviewnexa.com/higgs-audio-v2-review/ · https://knowara.com/ai-tools/voice/indextts-2-review/

**GPU pricing & infrastructure policy**
- RunPod pricing — https://www.runpod.io/pricing · https://www.runpod.io/product/cloud-gpus
- RunPod live-rate trackers — https://gpurentalprices.com/providers/runpod · https://computeprices.com/providers/runpod · https://gpucloudprices.com/provider/runpod/
- Vast.ai pricing — https://vast.ai/pricing · https://gpuhosted.com/en/vast-ai-review/ · https://gpufloor.com/rtx-4090/ · https://gpufinder.dev/gpu/rtx-4090
- **Modal Terms of Service (Prohibited Content)** — https://modal.com/legal/terms
- **Baseten Terms and Conditions (obscene/pornographic warranty)** — https://www.baseten.co/terms-and-conditions/
- **Replicate Terms** — https://replicate.com/terms · Acceptable Use Policy — https://replicate.com/acceptable-use-policy
- **fal Acceptable Use Policy** — https://fal.ai/legal/acceptable-use-policy · Trust & Safety — https://fal.ai/legal/trust-and-safety · Terms — https://fal.ai/legal/terms-of-service
- Adult-permitted / no-KYC GPU hosting — https://servprivate.com/uncensored-ai-hosting · https://servprivate.com/no-kyc-gpu · https://xmrcloud.com/node/gpu · https://impreza.host/servers/offshore-adult-hosting/ · https://dmcaignored.com/uncensored-ai-servers

**Voice actor economics**
- Dipsea erotic voice actor rates — https://www.businessinsider.com/what-its-like-to-apply-voice-actor-dipsea-audio-erotica-2020-8
- How to become an audio erotica narrator — https://www.backstage.com/magazine/article/how-to-become-an-audio-erotica-voice-actor-78589/
- **"AI struggles to perform audio erotica. It can't moan well"** — https://www.nbcnews.com/pop-culture/pop-culture-news/smut-audio-erotica-growing-trend-quinn-celebrities-collaborations-rcna263065
- Quinn's celebrity model and intimacy coordinator — https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/
- Working audio-erotica creator's production time — https://www.stylist.co.uk/life/careers/work-life-amanda-marie-audio-erotica-actor/977405
- Audiobook PFH rates — https://www.backstage.com/magazine/article/pfh-audiobook-rates-explained-76681/ · https://punchtrack.com/tools/audiobook-narrator-rates · https://www.realvotalent.com/voiceover-rates · https://tomevox.com/blog-audiobook-cost · https://voicebros.com/en/blog/voice-over-pricing-guide-2026

**Pipeline QC**
- ttsproof (structural checks, equivalence-aware WER, ASR-uncertainty quarantine) — https://github.com/Mormolykos/ttsproof
- An Automated Failure-Mode QA Framework for Neural TTS (production case study, blinded validation) — https://doi.org/10.5281/zenodo.20757553
- TTS-Suite (ASR round-trip, Qwen3-ASR, 10% WER default, stitching & mastering chain) — https://llm-enabled-development-41d6d8.pages.cms.hu-berlin.de/en/tools/tts-suite/ · https://llm-enabled-development-41d6d8.pages.cms.hu-berlin.de/en/tools/tts-suite/features/
- Word error rate is broken: evaluating STT in 2026 — https://www.assemblyai.com/blog/word-error-rate-is-broken

**ASMR production practice**
- How to Create AI ASMR and Ambient Sound Content (2026) — https://www.qwe.edu.pl/tutorial/how-to-create-ai-asmr-ambient-sound-content/
- Making a whisper voice in ElevenLabs (v2 vs v3 practitioner walkthrough) — https://www.youtube.com/watch?v=JH-P-2DL2Rg
- ElevenLabs long-form practitioner review (sibilance, breath, regeneration rates) — https://toolchase.com/blog/elevenlabs-review/ · https://chatforest.com/reviews/elevenlabs-voice-ai-text-to-speech-cloning/
