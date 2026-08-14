# Research: Intimate AI Audio App ("Selfish")

> Research cycle 1 — August 2026  
> Purpose: Validate market, psychology, technical feasibility, and App Store constraints before building.

---

## 1. Problem Statement

People want two related but distinct experiences from audio:

| Mode | Need | Current solutions | Gap |
|------|------|-------------------|-----|
| **A. Focus** | Calm, tingling, attention-regulating audio | Headspace, Calm, YouTube ASMR | Generic, not personalized |
| **B. Desire** | Explore inner fantasy through voice + imagination | Quinn, Dipsea, romance novels | **Passive** — you listen, you don't participate |

The breakthrough insight from founder testing: **interactive AI voice conversation** (via Grok) creates a qualitatively different experience than scripted audio. It responds to *you*. It adapts. It feels alive.

**The opportunity**: Combine ASMR-quality production values with AI-driven interactivity — primarily for women who already prefer audio erotica over visual porn.

---

## 2. Market Landscape

### Competitors

| Product | Model | Users | Revenue signal | Weakness for us |
|---------|-------|-------|----------------|-----------------|
| **Quinn** | Creator marketplace, scripted audio | 24M min/month, 56% Gen Z | ~$12M ARR (2025) | No interactivity — passive listening |
| **Dipsea** | In-house scripted stories | 82% women, 5.4M listens (2022) | Acquired by RevenueCat (2024) | Same — passive, no AI response |
| **Replika** | AI companion, text + voice | 20M+ MAU | $19.99/mo Pro | Removed most erotic content (2023), wellness-framed |
| **Character.AI** | Character roleplay | Massive library | $9.99/mo | Strict filtering, no NSFW, interrupts |
| **OhCleo, Bloom, Voxxx** | Scripted audio variants | Smaller | — | Passive |

### Market size

- Global digital adult content: ~$7B (2024), growing ~6.8% CAGR
- Audio erotica is the fastest-growing segment within adult content
- Women are the **primary consumers** of audio erotica (82% of Dipsea listeners vs 36% women on Pornhub)

### What's working

1. **Wellness positioning** — Dipsea/Quinn deliberately look like meditation apps. This gets them on App Store and enables mainstream advertising.
2. **Romance tropes** — "enemies to lovers," "forbidden," "slow burn" — familiar from BookTok
3. **Subscription model** — $4.99–$69.99/year depending on tier
4. **Female-forward production** — ethical, consensual, story-driven

### White space (our wedge)

> **No major player combines**: high-fidelity voice + real-time AI conversation + intimate/desire exploration + tasteful iOS-native UX.

Quinn/Dipsea = Netflix (curated content).  
We = a voice that talks back.

---

## 3. Psychology & Science

### Why audio works for women (and many men)

1. **Mental framing** — 90% of women use imagination/scenario-building for arousal (Kinsey/OMGYes). Audio *activates* imagination rather than replacing it.
2. **Agency** — Listeners control the scene in their mind. No body-image comparison, no male-gaze camera angles.
3. **Emotional pacing** — Audio erotica includes foreplay, tension, emotional buildup. Visual porn often skips this.
4. **Safety** — Private, headphones, no visual evidence. Feels like self-care, not "watching porn."
5. **Identification** — "You are the person in each story" (voice actor quote). First-person POV is natural in audio.

### ASMR + arousal are related but distinct

Research shows ASMR:
- Reduces heart rate (parasympathetic activation)
- Increases skin conductance in some profiles (arousal/attention)
- Is **generally non-sexual** in scientific literature
- Involves proximity prediction (whispering = simulated gentle touch)

**Product implication**: Focus mode and Desire mode share audio craft (whisper, pacing, proximity) but differ in intent and content guardrails. They can coexist in one app with clear mode separation.

### Why interactivity matters

Passive audio = consuming someone else's fantasy.  
Interactive voice = **co-creating** your fantasy in real time.

This maps to the romance novel → choose-your-own-adventure → live conversation evolution. The Grok test proved the AI can hold character, escalate tension, and respond to user cues — the missing piece in Quinn/Dipsea.

---

## 4. Technical Landscape (Voice AI, 2026)

### Architecture options

| Approach | Latency | Voice quality | Cost/min | Best for |
|----------|---------|---------------|----------|----------|
| **Grok Voice Agent API** | Sub-second, full-duplex | Good (Ara, Eve, Leo) | $0.05–0.08 | Real-time conversation, proven spicy dialogue |
| **OpenAI Realtime API** | Low | Good presets | Higher | Tool use, reasoning-heavy |
| **ElevenLabs + LLM pipeline** | Moderate | Best-in-class | ~$0.09–0.14 assembled | Premium voice identity, character consistency |
| **Text LLM + TTS batch** | 2–5s per turn | Excellent (ElevenLabs) | Lower | MVP, scripted-with-branches |

### Recommendation for MVP → Scale

```
Phase 1 (MVP):     Text LLM (Grok) → ElevenLabs TTS → stream to app
Phase 2 (Premium): Grok Voice Agent API for live conversation mode
Phase 3 (Scale):   Hybrid — ElevenLabs voice + Grok brain via custom pipeline
```

**Why not start with full realtime voice?**
- Higher cost during iteration ($0.08/min adds up in testing)
- Harder to moderate/log/review conversations
- Text intermediary allows content filtering before speech
- Easier to maintain — one prompt change, not voice pipeline debugging

**Why Grok as the brain?**
- Founder-validated for intimate dialogue quality
- $0.05–0.08/min for voice when we upgrade
- OpenAI Realtime-compatible WebSocket protocol
- Voices: Eve (female), Leo (male) — test both, default Eve for women-first

### iOS audio requirements

- Background audio playback (AVAudioSession)
- AirPods / Bluetooth latency tolerance
- Offline fallback for Focus mode (pre-rendered ASMR loops)
- Haptic feedback on key moments (optional, tasteful)

---

## 5. App Store & Legal Constraints

### Apple guidelines (critical)

- **1.1.4**: Prohibits "overtly sexual or pornographic material" — explicit descriptions of sexual organs/activities intended purely to stimulate
- **Precedent**: Quinn, Dipsea, Bloom are on App Store with 17+/18+ ratings
- **Strategy**: Position as **sexual wellness / intimate audio**, not pornography
  - No explicit anatomical language in marketing
  - Age gate (18+) with date-of-birth verification
  - Content flagging system (required as of Nov 2025 for UGC/creator apps)
  - Disclose AI data sharing to third parties (new Nov 2025 requirement)

### What Quinn/Dipsea do right

- App icon and UI look like Calm/Headspace
- Categories: "Romance," "Self-discovery," "Confidence," "Sleep"
- Stories are **suggestive**, not graphic — imagination fills the gap
- Professional voice actors, not robotic TTS (we'll need ElevenLabs quality)

### Risk mitigation

1. Human review of AI system prompts (no user-generated personas at launch)
2. Hard content boundaries in system prompt (suggestive yes, explicit no for App Store tier)
3. Separate "Unfiltered" web experience later if needed (like many apps do)
4. COPPA/GDPR: no accounts under 18, clear privacy policy

---

## 6. Target User (Primary Persona)

**"Maya" — 28, marketing manager, Brooklyn**

- Reads romance on Kindle (Icebreaker, Fourth Wing)
- Listens to Quinn on commute, Dipsea before bed
- Tried Replika, found it too "therapy" and removed the spice
- Wants: a voice that feels like the love interest in her favorite book, but responds when she talks back
- Won't: download something that looks like a porn app
- Will pay: $9.99/month if the first session gives her chills

---

## 7. Key Research Questions (for Cycle 2)

- [ ] ElevenLabs vs Grok native voice — blind test for "Eve" intimate dialogue
- [ ] Optimal session length before fatigue (15 min? 30 min?)
- [ ] Branching narrative vs freeform conversation — which converts better?
- [ ] Focus mode: ambient soundscapes only, or guided voice?
- [ ] Pricing: $9.99/mo vs $14.99/mo vs freemium with 3 free sessions
- [ ] Name: "Selfish" — empowering or off-putting? Test alternatives.

---

## Sources

- NYT: Dipsea/Quinn market analysis (2023)
- Business Insider: Quinn Gen Z growth (2024)
- PLOS One: ASMR physiology study
- Frontiers: Proximity Prediction Hypothesis for ASMR
- Sexual Health Research Lab: Audio erotica psychology
- Healthline: Audio porn / mental framing
- xAI: Grok Voice Agent API docs
- Apple App Review Guidelines 1.1.4, 1.2.1, age rating updates (2025)
