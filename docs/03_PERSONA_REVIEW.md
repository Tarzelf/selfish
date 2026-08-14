# Persona Review: "Maya" Evaluates the Plan

> Simulated user review from primary persona (see 01_RESEARCH.md)  
> Purpose: Stress-test product plan before execution

---

## Who is reviewing

**Maya, 28** — Romance reader, Quinn subscriber, tried Replika, wants more interactivity.  
Reviewing Plan v1 as if she saw it in a focus group.

---

## First Impressions

### On the name "Selfish"

> "Honestly? I kind of love it. It sounds like something I'd tell my friends about — 'I was being selfish last night' — and they'd know exactly what I mean without me having to say it. But I'd never search for it in the App Store. I'd find it through TikTok or a friend's recommendation. The tagline 'Time that's just yours' works better than the name for App Store screenshots."

**Verdict**: Keep for brand, use tagline for discovery. ✅

---

### On two modes (Focus + Whisper)

> "The Focus mode is smart because I'd download it without feeling embarrassed. My boyfriend could see it on my home screen and think it's a meditation app. Whisper being separate but inside the same app — that's exactly how I'd want it. I don't want my horny app and my work app to be the same icon, but I also don't want two subscriptions."

**Verdict**: Two modes, one app, one subscription. ✅

---

### On turn-based vs realtime

> "Here's the thing — Quinn is passive and I still love it. If you told me I could *talk back* to the voice, even with a slight pause, I'd lose my mind. I don't need it to be a phone call. I need it to feel like he's responding to *me*, not reading a script. If there's a 'Live' mode later for premium, fine, but don't gate the core experience behind something that feels like a tech demo."

**Concern**: If turn-based latency is >5 seconds, she'd bail.  
**Requirement**: Sub-3 second response time, with a "thinking" ambient sound during wait (breath, pause — not a loading spinner).

**Verdict**: Turn-based MVP is acceptable IF latency and audio craft are excellent. ⚠️

---

### On personas

> "Elena sounds like my kind of story. Slow burn is everything. But please don't give me a menu of 50 characters — that's Character.AI energy and it overwhelms me. Two or three really good ones beats twenty mediocre ones."

> "James is fine but he's not why I'd download this. If you market this to women, lead with Elena. Put James in 'more voices' later."

**Verdict**: Launch with 1 primary persona (Elena), 1 secondary. Not 6. ✅

---

### On scenarios

> "I need a starting point. 'What do you want to talk about?' is what Replika does and it makes me feel like I'm doing homework. 'You're at a hotel bar and a stranger sits down' — yes. That's a story. That's Quinn but I get to answer."

**Verdict**: Scenario picker is essential, not optional. ✅

---

### On pricing

> "$9.99 is less than Quinn ($4.99) + a coffee. I'd pay $9.99 if the first free session actually got me there. Three free sessions is enough to know. Don't give me one — I won't trust it."

**Verdict**: 3 free sessions, $9.99/mo. ✅

---

### On App Store safety / discretion

> "If this looks like a porn app, I'm out. If it looks like Calm with a secret room, I'm in. The icon matters. The screenshots matter. Show me a woman with headphones, eyes closed, smiling — not lips or silhouettes."

**Verdict**: Wellness aesthetic is non-negotiable. ✅

---

### On privacy

> "I need to know my voice recordings aren't being stored forever. Tell me what the AI remembers and let me delete it. If I find out my whisper sessions are training data, I'm gone and I'm telling everyone."

**Requirement**: Clear privacy policy. Session deletion. Opt-in memory only.

**Verdict**: Privacy UX must be designed upfront, not bolted on. ⚠️

---

### On what's missing from the plan

1. **"Continue where we left off"** — She wants serialized intimacy. Session 2 should reference Session 1.
2. **Text mode for public** — "Sometimes I'm on the subway. Let me type instead of talk."
3. **Intensity dial** — "Some nights I want slow burn. Some nights I want more. Let me set that before we start."
4. **No gamification** — "Don't give me streaks or badges. This isn't Duolingo."
5. **Sleep ending** — "Let me set a timer so the voice gently winds down and I fall asleep."

---

## Persona Verdict

| Area | Score | Notes |
|------|-------|-------|
| Concept | 9/10 | "This is what I've been waiting for since Quinn" |
| Name/branding | 7/10 | Love the vibe, worried about discovery |
| Mode structure | 9/10 | Focus as trojan horse is smart |
| Personas | 8/10 | Fewer is better; Elena first |
| Pricing | 9/10 | Fair, comparable to Quinn |
| Privacy | 6/10 | Plan doesn't address this enough yet |
| Missing features | — | Memory, intensity dial, text fallback, sleep timer |

**Overall**: Would download. Would convert if first free session delivers. Would churn if latency sucks or it feels like a chatbot.

---

## Plan Updates Required (Cycle 2)

Based on persona review:

1. ✅ Add **intensity dial** (Soft / Warm / Bold) to scenario setup
2. ✅ Add **text input fallback** to MVP scope (was optional, now required)
3. ✅ Add **session memory** ("continue where you left off") to MVP
4. ✅ Add **privacy controls** (delete session, memory opt-in) to MVP
5. ✅ Add **"thinking" audio** during AI latency (not spinner)
6. ✅ Reduce launch personas to 1 primary + 1 secondary
7. ⏳ Sleep timer → v1.1 (not MVP blocker)
8. ⏳ Test App Store name/tagline with 5 real users before submission

---

## Cycle 2: Maya reviews onboarding

> "If you ask me to pick my kinks on screen three I will close the app. If you ask me how I want to *feel*, I'll answer. If Elena is talking thirty seconds later, I'm yours."

> "The Self thing is actually what I wanted from Replika and never got. I don't want to build *her*. I want a place I can be a little different and not be weird about it."

> "Don't tell me it's healing. Let it feel that way."

**Onboarding verdict**: Four screens, then voice. Self over quiz. No home until after session 1. ✅

See `docs/06_ONBOARDING.md`.

---

## Cycle 2: Maya on vibration apps

> "If the app looks like those vibrator apps I'm out. If Elena is talking and the phone answers in my hand, that's actually the thing. Let me turn it off. Don't make me explain it to anyone."

**Verdict**: Body as a quiet layer. On for session 1. Never the brand. See `docs/07_HAPTICS_SIGNAL.md`.
