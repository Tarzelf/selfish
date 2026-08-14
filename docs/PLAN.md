# Selfish — Product Plan (PRD v1, pre-debate draft)

> Working name: **Selfish** (from the repo name — it fits: "time that's just for you." Self-care framing, zero shame, slightly wicked wink.)
> Status: v1 draft synthesized from research pass 1 (`docs/research/01-04`). To be stress-tested by persona debate, then revised.

## 1. One-line vision

**A beautiful, women-first audio app where an intimacy engine — voice, breath, pacing, story — adapts to you: from "help me focus" to "help me fall asleep" to "tell me a story that's just for me."**

Not "AI erotica." Not a porn app. A personal audio companion for focus, rest, and desire, in that order of *visibility* and the reverse order of *revenue*.

## 2. Thesis (what research pass 1 established)

1. **The market is real and women-led.** Quinn: $12M+ ARR, 75–80% women. Dipsea: ~$6M ARR at exit. Audio is the erotic format women actually choose (75–82% of audio erotica listeners are women, vs ~36% of visual porn visitors).
2. **The incumbent weakness is discovery + personalization, not catalog size.** Loudest complaints: hard paywall, weak search, inconsistent quality. Nobody can give you *your* scenario, *your* pacing, *your* name, *your* heat level on demand. AI can.
3. **"AI-narrated" is a liability as a brand, an asset as infrastructure.** Dipsea publicly *removed* AI narration in 2026 to applause; communities call AI audio "slop." We never lead with "AI voices." We lead with personalization and let quality speak. Blind-test bar: our best track must be indistinguishable from a human recording before it ships.
4. **The compliance envelope is proven and narrow.** 18+ rating, wellness/romance metadata (never "erotica" in iOS copy), 4+ clean screenshots, curated first-party catalog (no user prompts in v1 → avoids UGC guideline 1.2), Declared Age Range API, IAP + US web-checkout link. Explicit-most tier lives on web only.
5. **The science gives us the design language.** Women's arousal is context-driven and brake-sensitive: privacy, trust, consent-forward stories, and emotional buildup do more than explicitness. ASMR and intimacy share one mechanism — simulated caregiving closeness — so one "intimacy engine" (close-miked breathy voice, binaural placement, slow pacing) genuinely serves both focus/sleep and desire.
6. **The tech stack exists and is cheap.** Soft content: ElevenLabs v3 (whisper tags, ~$0.10/finished-min). Spicy content: self-hosted Orpheus/Chatterbox (~$0.005–0.02/min, no content policy) + xAI Grok for scripts (only frontier API permitting fictional adult text). Pipelines fully separated. A 1,000-episode catalog costs hundreds of dollars in compute; the cost is QA and craft.

## 3. Who it's for

**Primary: "Maya," 24–38, romance reader / Quinn-curious.**
Listens to audiobooks and sleep stories. Reads BookTok romance ("yearning," enemies-to-lovers). Has tried Quinn or r/GoneWildAudio; frustrated by repetition, hit-or-miss quality, and content that doesn't match her mood tonight. Values discretion absolutely: nothing spicy on her lock screen, an app she isn't embarrassed to have on her home screen. Buys Calm-type annual subs.

**Secondary: focus/sleep users (all genders)** who come for adaptive soundscapes and voice-guided wind-downs and may never touch the spicy shelf. They make the app "defensible" in positioning, App Review, and ad channels — and they're real users, not camouflage: same engine, same craft.

**Explicitly not v1:** male-targeted companion/girlfriend experiences. The Grok-style "spicy chat" demand for men is proven but it's a different product, a different brand risk, and Apple's 4.3 graveyard is full of it. Revisit post-v1 on web only.

## 4. The product

### 4.1 Three shelves, one engine

| Shelf | What | Heat | Where |
|---|---|---|---|
| **Focus & Calm** | Adaptive soundscapes (Endel-style layers), ASMR attention tracks, voice-guided resets | — | iOS + web |
| **Rest & Sleep** | Wind-down stories, breath-paced body scans, "someone reads to you" closeness | Comfort | iOS + web |
| **Desire** | Second-person POV story sessions: boyfriend experience, praise, soft dom, friends-to-lovers, aftercare. Slow-burn by default. | Comfort → Slow burn → **Spicy** | iOS (to Spicy); **Explicit tier web-only** |

One continuous "heat" dial, defaulted low, opt-in per level. The same voice roster and audio engine across all shelves — the voice that helped you focus this afternoon can read you to sleep tonight. That continuity *is* the product's emotional moat.

### 4.2 The personalization wedge (why us and not Quinn)

v1 (curated catalog, no free-text prompts — compliance):
- **Tonight picker:** 3 taps — mood (comforted / teased / adored / in charge), voice, length, heat. The catalog is pre-generated across this matrix, so it feels made-to-order without UGC risk.
- **Name-drop:** sessions rendered with your name spoken (pre-rendered variants for top-N names; "love/you" fallback). No incumbent can do this.
- **"More like this, but…"** softer / slower / less explicit / more buildup — one-tap variation requests that map to pre-generated alternates.
- **Hard-limits filter set once:** themes you never want to hear are globally excluded, GWA-style content warnings on every session.

v2 (post-traction, with full 1.2 moderation stack): scenario composer (structured pickers, still not free text). v3: real-time interactive voice sessions (Grok speech-to-speech / Hume EVI class) — the true endgame the AI-companion data supports (voice sessions 2× text engagement), gated on trust and unit economics.

### 4.3 Craft bar (non-negotiables)

- **Headphone-first, binaural-always:** HRTF spatialization, breath and mouth micro-sounds, whisper-distance miking illusion. Prompt for headphones at session start.
- **Voice spec (M4F lead voices):** low-but-not-bass pitch, breathy, warm, audible smile; prosody directed at character level. Small curated roster (4–6 voices at launch) users can favorite — parasocial loyalty is Quinn's engine and we need our own.
- **Consent inside the fiction:** partners in stories ask, check in, give aftercare. Never an unflagged kink. This is both ethics and — per the science — what actually works for the audience.
- **Blind-test gate:** every voice/format ships only after passing indistinguishability testing against human-recorded reference clips with target-demo listeners.

### 4.4 Discretion & trust (brake-removal as feature list)

- Neutral notifications ("Your session is ready"), no spicy words on lock screen ever
- Optional disguised app icon; Face ID lock on the Desire shelf
- No social feed, no public profiles; history and account deletion that actually deletes
- Transparent AI sourcing page: which voices are synthetic, whose likenesses were licensed (if any), what data we keep (minimal), what we never do (no real-person voices, ever)

## 5. Content system

- **Format:** 8–20 min "sessions," second-person POV, GWA-informed structure (scene-setting → buildup → payoff → aftercare/wind-down). Series with recurring characters for retention.
- **Tags:** dynamic (BFE, praise, soft dom, friends-to-lovers, strangers, reunion…), mood, heat level, voice, length. Multi-tag filtering from day one (Quinn's top complaint).
- **Launch catalog:** ~150 sessions (100 Desire across heat levels, 30 Sleep, 20 Focus) + 6 soundscapes. All first-party, human-QA'd, mastered with room tone/soundscape layers.
- **Pipeline:** LLM script (Grok primary for spicy; any frontier model for soft) → human editorial pass (the craft moat — scripts are *written*, the LLM drafts) → TTS render (ElevenLabs v3 soft / Orpheus-Chatterbox self-hosted spicy) → post (binaural placement, breath layering, soundscape bed, mastering) → blind-test QA → publish.
- **Two fully separated pipelines** (accounts, keys, infra) so a policy strike on the spicy line can't touch the soft catalog.

## 6. Compliance posture (from `02-app-store-compliance.md`)

- iOS metadata: "Selfish — Audio stories, sleep & focus." Copy says "romantic fiction," "spicy stories," "wellness" — never "erotica/NSFW." Screenshots 4+-clean.
- 18+ age rating; declared birthdate gate at signup; Desire shelf behind explicit opt-in defaulted off; Declared Age Range API + Significant Change API + StoreKit age-rating property (iOS 26.2+ Texas/Utah/LA laws).
- v1 catalog is first-party curated → no UGC stack needed. The moment we add composer features, we ship report/block/filter + server-side moderation first.
- 5.1.2(i): disclose third-party AI processing, explicit consent at onboarding.
- Payments: IAP subscriptions + US storefront web-checkout link (lower price on web). Explicit tier sold and streamed on web only.
- App Review notes: honest description, demo account, comparable-app citations (Quinn, Dipsea).
- Google Play: later; soft catalog only + web link, per Play's stricter carve-out.

## 7. Business model

- **Free tier (real one):** full Focus shelf + rotating free Sleep/Desire sessions. Marginal cost ≈ 0; converts trust into trials (top category complaint is "nothing free").
- **Selfish+ :** $7.99/mo or **$59.99/yr (annual-first paywall)**, 21-day free trial (RevenueCat data: 17–32-day trials convert ~70% better). Unlocks full catalog, name-drop, downloads, variation requests.
- **Web-only Explicit tier** included in the same sub purchased via web checkout (Stripe — existing team competency), also unlocking iOS content. Web price $49.99/yr to shift mix off IAP.
- Benchmarks put a good outcome at Quinn-scale ($10–15M ARR); the interactive v3 is the bet that expands the ceiling (AI-companion category: 25M MAU, women 30–40% and rising).

## 8. Go-to-market sketch

- Channels where the category already converts: BookTok/romance TikTok, romance podcast sponsorships, Reddit (r/RomanceBooks etc. — carefully, no astroturf), Quinn-adjacent creator collabs.
- Brand voice: warm, witty, literate; "the most considerate voice in your life." Female creative lead on all copy/scripts. Never market explicit capability off-platform (the nudify-app killer).
- PR narrative available: "ethical AI intimacy" — licensed voices, no real-person cloning, transparency page.

## 9. Risks (top 5)

1. **Quality bar miss:** AI narration reads as slop → blind-test gate, human editorial pass, post-production craft; delay launch before shipping slop.
2. **Apple policy shift** on AI+adult adjacency → curated-catalog posture, wellness shelf is genuinely strong, web escape hatch for content and payments.
3. **TTS provider strike** (ElevenLabs interprets slow-burn as explicit) → self-hosted fallback already in the stack; pipelines separated; test marginal scripts on both.
4. **4.3 "AI girlfriend" pattern-match at review** → women-first brand, real wellness content, no chat UI in v1, cite Dipsea/Quinn comparables in review notes.
5. **Cold-start catalog feels thin/repetitive** → depth over breadth in 3 hero dynamics (BFE, praise, friends-to-lovers) at launch; series > one-offs; weekly drops.

## 10. MVP build scope (execution phase of this repo)

- **App:** Expo / React Native (Expo Router), TypeScript. Screens: age gate + onboarding (mood/voice/heat/hard-limits), Home ("Tonight"), Browse (multi-tag), Player (binaural badge, headphone prompt, heat indicator, skip-scene), Focus/Sleep shelves, Settings (privacy, discretion, subscription).
- **Backend:** Supabase (existing team competency) — auth (OTP), Postgres catalog schema (sessions, voices, tags, heat levels, entitlements), Storage/CDN for audio, edge functions for entitlement checks.
- **Pipeline (separate package):** Node/TS generation pipeline — script templates + LLM draft step (pluggable: Grok/OpenAI-compatible), TTS render step (pluggable: ElevenLabs / Orpheus server / mock), post-process hooks, manifest → Supabase publisher. Runnable locally with mock providers so the repo works without secrets.
- **Not in MVP build:** payments wiring (Stripe/IAP stubs only), real voice cloning, interactive chat.

## 11. Open questions for the debate

1. Is "Selfish" the right name, or too cute/negative? (Alternatives: Velvet, Hush, Blush, Undone, Softly.)
2. Free tier generosity: does a real free tier cannibalize the trial, or is it the trust unlock this category is missing?
3. Should Focus be in v1 at all, or is it scope creep that dilutes the Desire wedge? (Counter: compliance + brand cover + genuine retention glue.)
4. Name-drop feature: delightful or uncanny? Does hearing your name break immersion for some listeners?
5. Is 150 sessions enough to not feel thin against Quinn's thousands?
6. M4F-first: how fast do we need F4F/NB voices to be credibly "for all women"?
7. Web-explicit tier: real revenue or distraction in v1?
