# Product Plan: Selfish

> Plan v1 — synthesized from research cycle 1  
> Status: Draft for debate → persona review → iteration

---

## Vision

**Selfish** is a tasteful iOS app that helps women reclaim private time through voice — whether to focus deeply or explore desire through interactive audio that responds to them.

> "The voice in your headphones that actually listens."

---

## Product Thesis

1. **Women-first, not women-only** — Design for Maya's psychology (imagination, pacing, safety) but don't exclude others.
2. **Interactive > passive** — Our moat is conversation, not content library size.
3. **Wellness wrapper, intimate core** — App Store survival requires taste and positioning.
4. **Easy to maintain** — Expo + Supabase + managed APIs. No custom ML. No content farm.
5. **AI as co-author, not autopilot** — Curated personas with guardrails, not infinite unmoderated chat.

---

## Two Modes, One App

```
┌─────────────────────────────────────────────────────┐
│                    SELFISH                          │
├─────────────────────┬───────────────────────────────┤
│   FOCUS             │   WHISPER                     │
│   (public-safe)     │   (18+, intimate)             │
├─────────────────────┼───────────────────────────────┤
│ • ASMR soundscapes  │ • AI voice companions         │
│ • Breath pacing     │ • Interactive scenarios       │
│ • Work/focus timers │ • Responds to your voice/text │
│ • Pre-rendered      │ • Remembers preferences       │
│ • Free tier hook    │ • Premium subscription        │
└─────────────────────┴───────────────────────────────┘
```

### Mode A: Focus

- **Job**: Help me concentrate, calm my nervous system, feel the ASMR tingle
- **Content**: Pre-rendered ambient audio (rain, whisper, typing, brush sounds) + optional guided breath
- **AI role**: Minimal — maybe personalized session length based on time of day
- **Monetization**: Free (acquisition funnel) or bundled in subscription
- **App Store**: 4+ / 12+ safe

### Mode B: Whisper (working name for intimate mode)

- **Job**: Help me explore fantasy, feel desired, get emotionally + physically aroused through voice
- **Content**: AI personas (e.g., "The Stranger," "Slow Burn," "After Hours") with distinct voices and personalities
- **Interaction**: User speaks or types → AI responds in character → TTS plays response
- **AI role**: Core product — Grok powers dialogue, Grok TTS powers voice (with `[whisper]` tags)
- **Monetization**: Subscription ($9.99–14.99/mo), limited free sessions
- **App Store**: 18+ rating, age gate, wellness positioning

---

## Debate: Key Product Decisions

### Decision 1: Realtime voice vs turn-based?

| Option | Pros | Cons |
|--------|------|------|
| **A. Turn-based** (speak → pause → response) | Cheaper, easier to moderate, ship faster | Less magical, breaks immersion |
| **B. Full duplex realtime** (Grok Voice) | Scarily good, founder-validated for spicy 18+ dialogue | $0.08/min, harder to filter, complex |
| **C. Hybrid** | Free/cheap turn-based; premium realtime | Two systems to maintain |

**Recommendation: C (Hybrid)**  
- MVP ships with turn-based (hold-to-talk or tap-to-send)
- "Live" badge unlocks realtime for subscribers after we nail moderation
- Focus mode never needs realtime

**Counter-argument**: The founder's "scarily good" moment was realtime. If we ship turn-based first, we might lose the magic.  
**Rebuttal**: Turn-based with <3s latency and excellent voice can still work (see Candy AI voice messages). Realtime is Phase 2, weeks not months.

---

### Decision 2: Women-only marketing vs women-first?

| Option | Pros | Cons |
|--------|------|------|
| **A. Women-only** | Clear positioning, Quinn playbook | Shrinks TAM, may feel exclusionary |
| **B. Women-first** | Design for women, welcome all | Broader market, risk of male-gaze drift |
| **C. Dual apps** | Precise targeting | 2x maintenance, bad for "easy to maintain" |

**Recommendation: B (Women-first)**  
- Default personas voiced by women, scenarios from female POV
- Marketing speaks to women; app doesn't block men
- Male users who want spicy AI already have options; we win by being the best for women

---

### Decision 3: Scripted scenarios vs freeform?

| Option | Pros | Cons |
|--------|------|------|
| **A. Freeform chat** | Infinite variety, Grok strength | Hard to onboard, can go off-rails |
| **B. Scenario picker** | "You're at a hotel bar..." — clear start | Less emergent |
| **C. Scenario + freeform** | Guided entry, open play | Best of both |

**Recommendation: C**  
- User picks a scenario + persona (like choosing a Quinn story)
- First 2–3 exchanges are scenario-guided (AI sets scene)
- Then opens to freeform within persona guardrails
- Memory persists preferences across sessions ("last time you mentioned...")

---

### Decision 4: Name — "Selfish"?

| Name | Vibe | Risk |
|------|------|------|
| **Selfish** | Empowering, "me time," provocative | Could sound negative; hard to SEO |
| **Whisper** | Intimate, safe | Generic, SEO collision |
| **Tingle** | ASMR reference | Too cute? |
| **Elsewhere** | Escape, private world | Abstract |

**Recommendation**: Keep **Selfish** as codename; test with users before App Store submission. Tagline: *"Time that's just yours."*

---

### Decision 5: Tech stack for "easy to maintain"

| Layer | Choice | Why |
|-------|--------|-----|
| Mobile | **Expo (React Native)** | iOS-first, OTA updates, founder has Expo experience |
| Backend | **Supabase** | Auth, DB, Edge Functions, storage — proven in prior project |
| AI text | **Grok API** (xAI) | Founder-validated for sexy 18+ personas; responsive, in-character |
| Voice STT | **Grok STT API** (xAI) | Streaming transcription, single vendor |
| Voice TTS | **Grok TTS API** (xAI) | Speech tags (`[whisper]`, `[sigh]`) for intimate delivery |
| Voice realtime | **Grok Voice Agent** (Phase 2) | Same provider, full-duplex |
| Payments | **RevenueCat** | Subscription management (Dipsea uses RevenueCat) |
| Analytics | **PostHog** or **Amplitude** | Funnel + retention |

**Explicitly NOT in v1**: Custom ML, creator marketplace, Android, web app.

---

## MVP Scope (4–6 weeks of focused work)

### In scope

- [ ] iOS app (Expo, iPhone only, no iPad)
- [ ] Four-screen onboarding → first Whisper session (no home, no quiz)
- [ ] Self persona (soft / playful / bold) — who *they* get to be
- [ ] Auth (email OTP after first good session)
- [ ] Age gate (18+ self-declaration + terms)
- [ ] Focus mode: 3 ambient sessions (pre-loaded audio)
- [ ] Whisper mode: 2 personas, 3 scenarios each
- [ ] Turn-based voice interaction (hold to talk → Grok STT → Grok → Grok TTS → play)
- [ ] Text input fallback (for privacy in public)
- [ ] Session history (last 5 conversations)
- [ ] Paywall: 3 free Whisper sessions, then subscribe
- [ ] Subscription via RevenueCat ($9.99/mo)

### Out of scope (v1)

- Realtime full-duplex voice
- User-created personas
- Creator marketplace
- Android
- Social features
- Push notifications

---

## Personas (Whisper Mode, Launch)

> **Why Grok?** Founder testing confirmed Grok handles sexy 18+ persona dialogue exceptionally well — responsive, adaptive, convincingly in-character. Unlike filtered platforms (Replika, Character.AI), we own the prompts and age gate. Grok is the product moat for Whisper mode.

### Persona 1: "Elena" — Slow Burn
- **Voice**: Warm, lower register, unhurried
- **Vibe**: Literary romance, tension before touch
- **Sample opener**: "I've been watching you from across the room. You haven't noticed yet."
- **Best for**: Users who like Icebreaker, BookTok slow burn

### Persona 2: "James" — After Hours (optional male voice)
- **Voice**: Close-mic, soft, confident not aggressive
- **Vibe**: Established connection, intimacy not conquest
- **Sample opener**: "You stayed late again. I made coffee. We should talk about why you can't go home."
- **Best for**: Users who want male voice but not traditional porn energy

> Launch with Elena as default. James as secondary. Both written to center the listener's desire and agency.

---

## Monetization

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | Focus mode unlimited; 3 Whisper sessions/month |
| **Selfish+** | $9.99/mo | Unlimited Whisper; priority voice; memory |
| **Selfish+ Annual** | $79.99/yr | 33% discount |

**Unit economics (rough)**:
- Avg Whisper session: 15 min
- Cost: ~$0.02 (Grok text) + ~$0.01 (Grok TTS ~500 chars) + ~$0.05 (Grok STT 15min) ≈ **~$0.08/session**
- At 20 sessions/mo = ~$1.60 COGS → **84% gross margin** at $9.99

---

## Success Metrics (90 days post-launch)

| Metric | Target |
|--------|--------|
| App Store rating | ≥ 4.5 |
| D1 retention | ≥ 40% |
| Free → paid conversion | ≥ 8% |
| Avg session length (Whisper) | ≥ 12 min |
| NPS (paid users) | ≥ 50 |

---

## Open Questions for Cycle 2

1. Grok TTS speech tag tuning for Elena — map intensity (soft/warm/bold) to `[whisper]` / `[sigh]` density
2. ~~STT: Apple native vs Deepgram vs Grok~~ → Grok STT streaming
3. Content ceiling: how explicit can Whisper be while staying on App Store?
4. Should Focus and Whisper feel like different apps or one unified experience?
