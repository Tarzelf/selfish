# Can we ship this now?

Honest answer: **we can ship a TestFlight spine soon. We cannot ship the App Store product this week.**

The idea is strong enough. The missing work is design lock + the live Grok loop — not more features.

---

## Confidence

| Layer | Confidence | Why |
|-------|------------|-----|
| **Product** | High | Women-first, Self, four-screen onboard, Body as layer. Maya-tested on paper. |
| **Market / App Store** | High | Quinn, Dipsea, 4.8★ haptic apps. Path exists. |
| **Tech stack** | High | Expo + Supabase + one xAI key. Easy to maintain. Cloud agents can keep building. |
| **Grok as the moat** | High | Founder-validated 18+ persona. STT/TTS/speech tags exist. |
| **Design quality** | Medium | Mood is right. Screens are still scaffold. 4.8★ apps win on feel. |
| **Live product** | Low until wired | Placeholder replies. No auth, no pay, no real voice yet. |

---

## What “ship” means

| Milestone | Ready when | Blocked by |
|-----------|------------|------------|
| **Internal demo** | Now | Run Expo, walk Welcome → Self → session |
| **TestFlight (friends)** | After Grok STT/TTS in `whisper-chat` + design board applied | API keys, voice pass |
| **App Store** | After paywall, privacy copy, 18+ rating, 5 real sessions that captivate | Review, screenshots, legal |

We should not build every remaining screen until the component board is the source of truth. That is this cycle.

---

## Build order from here

1. **Lock design** — mood + components (this PR)  
2. **Wire Grok** — one turn: text in → Grok → TTS → play  
3. **Voice in** — hold-to-talk → STT  
4. **Auth after first session** — email OTP when they have a Self to keep  
5. **Paywall** — 3 free sessions, then $9.99  
6. **TestFlight** — 5 Mayas, listen to the first session, change prompts  

No creator marketplace. No Android. No 20 personas. No vibrator tab.

---

## Risks that can still kill it

1. **Latency > 3s** — Maya leaves.  
2. **Voice sounds like a GPS** — speech tags must do the work.  
3. **Looks like a vibrator app** — we lose the home-screen cover.  
4. **Looks like a chatbot** — we lose the first-session spell.

Design board exists so (3) and (4) get decided once, not on every screen.
