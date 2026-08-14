# Selfish — Research Synthesis v1

**Date:** 2026-08-14  
**Repo:** `selfish` (greenfield)  
**Working name:** Selfish  
**Status:** Research loop 1 — pre–cloud-agent merge

---

## One-sentence thesis

A tasteful, women-first listening product that uses AI scripts + high-fidelity TTS to deliver *personalized* erotic ASMR — closing the gap between curated studio audio (Dipsea) and specific fantasy (Quinn / written erotica), while treating calm/focus as the arousal *on-ramp*, not a second product.

---

## What we know from the category

### Market shape
Audio erotica for women is a proven category (NYT, Mashable, 2026 academic book *Audio Erotica*). Two camps dominate:

| Camp | Examples | Strength | Ceiling |
|------|----------|----------|---------|
| Studio curated | Dipsea, Bloom, Ferly | Taste, consistency, safety | Library is someone else's fantasy |
| Community | Quinn, Reddit GWA | Range, specificity, free discovery | Quality variance, hunt friction |
| Guided wellness | Bloom, Ferly | Lowers "brakes" (Nagoski dual-control) | Soft intensity |

**Pricing benchmarks:** Dipsea ~$12.99/mo or $69.99/yr · Quinn ~$7.99/mo or $59.99/yr.

### Why audio works for women (research-backed)
- Imagination fills the blank space; less self-monitoring than visual porn.
- Responsive desire: context + safety turn brakes down before accelerator.
- Recurring fantasy themes: anticipation, being wanted, specific dynamics, caretaking / "boyfriend experience."
- Consent language, voice grain, naturalistic pacing, emotional intimacy > graphic montage.
- Agency and control (pace, stop, choose) are part of the pleasure.

### The gap this product attacks
Melt Stories frames it cleanly: studio audio's ceiling is *general audience*; written AI erotica answers personalization but loses voice; **personalized + voice** is the missing combination.

Founder signal: spicy *text* AI already works (Grok). The product bet is that **voice + ASMR delivery** is the wedge for women — intimacy in the ear, not a chat transcript.

---

## Hard constraints (non-negotiable)

### Apple App Store
Guideline **1.1.4** prohibits overtly sexual / pornographic material intended to stimulate erotic feelings. Curated apps (Dipsea/Quinn) survive under romance / creator framing; **generative AI NSFW** faces far higher rejection risk (1.1 + 1.2 + 4.7: you are responsible for model output).

**Implication:** Do not bet the spicy core solely on App Store approval.

### Distribution options (ranked for this product)
1. **Web / PWA first** — ship spicy product, validate retention, own payments.
2. **TestFlight private** — high-fidelity listening with invited women testers.
3. **AltStore PAL (EU/Japan/Brazil)** — notarization without content guidelines; limited geography.
4. **App Store soft shell** — optional later: calm intimacy / romance listening; spicy unlocked on web (careful with Apple rules on external content).
5. **Whop / membership** — community + payments for adult digital products.

### AI / TTS provider policy
- **LLM:** Prefer providers that allow consensual adult erotica (e.g. xAI Grok — founder-validated). OpenAI/Anthropic are hostile or unreliable for this use case.
- **TTS:** ElevenLabs is quality leader for intimate / whispered delivery; adult *original* voices appear in a grey/permissive zone; **non-consensual voice cloning of real people is banned**. Never clone celebrities or real partners without consent.
- Cartesia: strong for low-latency conversation; secondary if we go live interactive.

### Safety red lines
- Strict 18+ age gate.
- Hard bans: minors (fictional or otherwise), non-consent as default, real-person impersonation.
- Intensity dial + instant stop.
- Report / feedback on bad sessions.
- Intimate preference data treated as sensitive: minimize retention, encrypt, no ads based on kink profile.

---

## Positioning debate (v1 verdict)

| Question | Verdict |
|----------|---------|
| Focus + Desire as one product? | **Desire is the product.** Calm/focus is the *session prelude* (brake-lowering), not a Headspace competitor. Dual marketing confuses acquisition. |
| Women or men first? | **Women first.** Category, brand equity, and pricing power sit there. Men (spicy chat) is a later adjacent mode or separate SKU. |
| App Store native first? | **No.** Web listen MVP → prove "voice > text for her" → then native shell. |
| Name "Selfish"? | Provocative double meaning ("it's not selfish to want") can work if craft is tender. Risk: sounds male-gaze or edgelord. Keep as working title; test with 10 women. |

---

## Jobs to be done (women)

1. **Quiet the head** so desire can show up (brakes).
2. **Feel wanted / cared for** without performing for a camera.
3. **Explore a specific fantasy** without hunting a library for 20 minutes.
4. **Stay private** — lock screen, no visual trail, discrete billing descriptor.
5. **Control intensity** without shame or clinical quizzes.

---

## Differentiated product loop

```
Age gate → soft preference onboarding (moods, not a kink form)
  → pick tonight's shape (care / tension / power / soft)
  → intensity 1–5
  → AI writes a short, paced script for HER
  → TTS performs in an intimate voice
  → player: breathe, pause, intensify, stop, afterglow save
```

Success in session 1: she finishes (or pauses intentionally), feels *seen*, and opens again within 7 days.

---

## Competitive wedge statement

> Dipsea is HBO for your ears. Quinn is YouTube for desire.  
> **Selfish is a voice that learns what you want — and speaks it only to you.**

---

## Risks (ranked)

1. **App Store / distribution friction** — spicy generative audio may never be a clean App Store hit.
2. **TTS intimacy gap** — human erotic voice actors still beat AI on breath/moan/grain; must craft scripts + voice selection obsessively.
3. **Unit economics** — LLM + ElevenLabs per session can erase $8–13/mo margins without caps/caching.
4. **Trust & taste** — one sleazy default ruins the brand with women.
5. **Provider policy churn** — TTS/LLM ToS can tighten overnight.

---

## Falsifiable MVP (before full iOS)

**Web listening experiment (not a full app):**
1. Landing + 18+ gate.
2. 60-second onboarding (3 mood chips + intensity).
3. Generate ~8–12 min personalized audio (Grok → ElevenLabs).
4. Measure: completion rate, replay, return in 72h, qualitative "felt for me?" score.
5. A/B: personalized AI audio vs same voice reading a generic Dipsea-like script.

**Kill criteria:** If personalization does not beat generic on "felt for me" + return, do not build iOS.

---

## What "love and care" means here (craft standards)

- No porn-thumb visual language; no neon sleaze.
- Scripts honor consent, pacing, and aftercare beats.
- Silence and breath are features.
- Stop is always one tap, no guilt copy.
- Preferences feel like choosing a mood for the evening, not disclosing pathology.
- Billing descriptor and push notifications are discrete.
- Never train marketing on her private prompts.

---

## Open questions for next research loop

1. Exact voice casting: one signature voice vs few archetypes?
2. Interactive mid-session branching vs linear pre-generated sessions?
3. Couples mode later or never?
4. Working title alternatives if "Selfish" fails women-user tests?
5. Whop vs Stripe web checkout for membership?

---

## Next artifacts

- `01-market-brief.md` — cloud agent  
- `02-distribution-debate.md` — cloud agent  
- `03-tech-architecture.md` — cloud agent  
- `04-ux-women-listening.md` — local  
- `05-thesis-debate.md` — local  
- `docs/product/vision.md` — product decision record after merge  
