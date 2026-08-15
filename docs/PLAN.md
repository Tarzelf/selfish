# Selfish — Product Plan (PRD v2, post-debate)

> Working name: **Selfish** ("time that's just for you" — pending trademark scan + coworker-glance test, see `DEBATE.md`).
> Status: v2 — revised after the three-persona debate (`docs/DEBATE.md`). Research: `docs/research/01-05`.

## 1. One-line vision

**A beautiful, women-first audio app where an intimacy engine — voice, breath, pacing, story — adapts to you: sessions for falling asleep and sessions for desire, rendered by studio-crafted synthetic voices built from licensed human performances, and tunable in ways no human catalog can be.**

Two shelves. One engine. Radical honesty about how it's made.

## 2. Thesis (established in research pass 1, hardened by debate)

1. **The market is real and women-led.** Quinn: $12M+ ARR, 75–80% women. Dipsea: ~$6M ARR at exit. Women are 75–82% of audio-erotica listeners vs ~36% of visual porn visitors — audio is the format women choose.
2. **The incumbent weakness is personalization, not catalog size.** Loudest complaints: hard paywall, weak one-tag search, mood mismatch. Nobody can give you *your* scenario at *your* heat at *your* pace, tonight. AI can — via a pre-generated variant matrix, not runtime generation.
3. **The core risk is disclosure, not detectability.** Dipsea removed AI narration *to applause*; communities call AI audio "slop." The debate killed half-stealth: we adopt the **Bloom posture, fully** — named human narrators license their voice likenesses for revenue share, the app says plainly that performances are synthetic, and the licensing story ("never cloned without consent, humans get paid") is the brand's spine, not its fine print. The blind-test bar remains as a *quality* gate.
4. **The compliance envelope is proven and narrow** — 18+, wellness/romance metadata, clean 4+ screenshots, curated first-party catalog, age-declaration stack, IAP + US web-checkout link. Plus, from the red team: no disguised icons (2.3.1), no in-app marketing of anything more explicit elsewhere (1.1.4), and a documented **no-runtime-generation invariant**: in v1, user input never reaches a generative model.
5. **The science gives the design language.** Arousal for women is context-driven and brake-sensitive: privacy, trust, consent-forward stories, buildup > explicitness. ASMR closeness and intimacy share one mechanism, which is why Sleep and Desire belong in one app with one voice roster.
6. **The stack is cheap; the craft isn't.** TTS render cost is $0.002–0.10/finished-minute; the real cost is editorial + QA (target < $8/finished-minute all-in). Soft pipeline: ElevenLabs v3. **Spicy pipeline (updated after research loop 3, `research/07`): self-hosted Qwen3-TTS-1.7B + per-voice LoRA (primary), VoxCPM2 (backup/48 kHz hero ASMR), Chatterbox-Nano on CPU for bulk sleep content, Gepard for future real-time** — all clean commercial licenses, fine-tuned on licensed data (license must explicitly cover synthetic erotic performance). Grok TTS demoted to hosted fallback after live audition (`research/06`): economics and reliability proven, expressive ceiling below 2026 open models. Script drafting: Grok API (spicy) / any frontier model (soft). Pipelines fully separated (accounts, keys, infra).

## 3. Who it's for

**Primary: "Maya," 24–38, romance reader / Quinn-curious.** Audiobooks, BookTok tropes, tried Quinn/GWA, frustrated by repetition and mood mismatch. Privacy-absolutist. Stays for *people* (voices/characters), not catalogs — so we build voice loyalty deliberately: small roster, named (pseudonymous) personas with continuity, series with recurring characters.

**Secondary: sleep users** who want "someone reads you down" closeness with zero spice. Same engine, honest shelf.

**Explicitly not v1:** male-targeted companion experiences; interactive chat of any kind; user free-text anything.

## 4. The product

### 4.1 Two shelves, one engine

| Shelf | What | Heat | Where |
|---|---|---|---|
| **Rest** | Wind-down stories, breath-paced body scans, ambient beds, "read to me" closeness | Comfort only | iOS + web |
| **Desire** | Second-person POV sessions: boyfriend experience, praise, soft dom, friends-to-lovers, reunion, aftercare | Comfort → Slow burn → Spicy | iOS + web (18+, opt-in, default off) |

- Heat dial with **per-context memory** (weeknight vs weekend profiles).
- **Explicit tier: deferred post-launch entirely** (web-only when it comes; zero in-app references ever — the web link in iOS is checkout-only with neutral copy).
- Focus/adaptive-soundscape shelf: cut from v1 (debate D1); ambient production assets live on in Rest.

### 4.2 The hero: Close loops (spicy) and the variation engine (warm)

**Close is the unit of value when she opts spicy.** 3–7 min, no plot, ASMR dirty talk, four recycles (Again · Slower · Closer · After). Home becomes a ritual: one voice, one play, last loop cued. See `docs/EXPERIENCE.md`.

Warm stories still ship as a **family**: the same story rendered in ~4 deliberate variants along heat, pace, and buildup. The player exposes it as **"More like this, but…"** — softer · slower · more buildup · less explicit — an instant switch that keeps place in the story where possible.

- Launch catalog: **100 Desire session-families (≈400 renders) + 30 Rest sessions**, deep in three dynamics (BFE, praise, friends-to-lovers), plus F4F and NB-voiced sessions at launch (≥15 sessions; roster of ~6 voices: 3 M, 2 F, 1 NB).
- Marketed as "hundreds of ways to hear it," never as "150 tracks."
- **Tonight picker:** mood (comforted · adored · teased · wanted · missed · in charge) × voice × length × heat → retrieval over the pre-rendered matrix. UI copy says *"find your session"* — never "we'll create one for you."
- **Name-drop:** opt-in, off by default, hard-locked to a pre-rendered whitelist of names (never free text, never runtime rendering). A delight, not the hero.
- **Series:** recurring characters and dynamics with a "Continue" rail — the retention loop GWA proves.
- **Anonymous social proof:** listener ratings and play-derived chips ("loved for: buildup"). No comments, no profiles, no feed.

### 4.3 Craft bar (non-negotiables)

- **Headphone-first, binaural-always:** HRTF spatialization, breath/mouth micro-sounds, whisper-distance illusion; headphone prompt at session start.
- **Voice spec (M lead voices):** low-but-not-bass, breathy, warm, audible smile; prosody directed per character beat. F/NB voices directed with the same closeness spec.
- **Consent inside the fiction:** partners ask, check in, give aftercare; never an unflagged kink; GWA-style content warnings on every session.
- **Blind-test gate (quality, not disguise):** no voice/format ships until target-demo listeners can't reliably distinguish it from human-recorded reference clips.

### 4.4 Trust, discretion, disclosure

- **Disclosure, proudly and first:** every session page carries "Performed by [Voice] — a studio-crafted synthetic voice, built with [Narrator]'s licensed performance. Humans paid, nothing cloned without consent." Transparency page with the full story. Machine-readable synthetic-audio marking embedded in files (EU AI Act Art. 50 — see §6).
- **Discretion:** neutral notifications; discreet-mode Now Playing metadata ("Selfish — Session") across lock screen/Control Center/CarPlay; Face ID lock on the Desire shelf; **neutral abstract branded alternate icons only** (no disguise icons — 2.3.1); history & account deletion that deletes.
- **No implied humanity anywhere** (FTC Section 5): narrator personas are presented as crafted characters with real licensed humans behind them, never as fake human bios.

## 5. Content system & pipeline

- **Format:** 8–20 min second-person POV sessions; scene-setting → buildup → payoff → aftercare/wind-down; series > one-offs.
- **Tags:** dynamic, mood, heat, voice, length; multi-tag filtering day one.
- **Pipeline stages (each blocking):**
  1. Script draft — LLM (Grok primary for spicy; frontier model for soft) from an editorial brief; every character's adult age established in-text (checklist requirement).
  2. **Safety classifier** — independent automated screen of every script for minors/age-ambiguity, non-consent (vs. flagged CNC-adjacent themes: reject in v1), incest tropes, real-person references. Runs *before* human review; failures quarantined.
  3. Human editorial pass — craft gate: rewrite, pacing, consent-forward beats. (Editorial is the moat and the cost center: track $/finished-minute, target < $8.)
  4. TTS render — ElevenLabs v3 (soft pipeline) / self-hosted Orpheus or Chatterbox (spicy pipeline); separated accounts/keys/infra.
  5. Post — binaural placement, breath layering, ambient bed, mastering, loudness normalization; synthetic-audio watermark/metadata embed.
  6. Blind-test QA sample → publish to catalog with full **audit trail** (brief → prompt → script → classifier verdict → approver → render hash).
- **Voice licensing precondition:** no fine-tuning or rendering until a written license explicitly covering *synthetic erotic performance* (ELVIS-Act-aware) is executed per voice. Paper must match the transparency page.
- **Incident-response plan** (takedown, comms, root-cause) written before scale generation.

## 6. Compliance posture

Everything in `research/02-app-store-compliance.md` plus red-team corrections (`DEBATE.md`) plus loop-2 findings (`research/05-regulatory-loop2.md`):

- iOS: 18+ rating; birthdate gate; Desire shelf opt-in default-off; Declared Age Range API stack; 5.1.2(i) third-party-AI consent screen; honest App Review notes + demo account with the real catalog visible (**standing rule: never show review a sanitized build or remotely enable anything post-approval — that's the termination pattern**).
- **No-runtime-generation invariant** documented in review notes and enforced architecturally: the v1 client has no path to any generation endpoint.
- Payments: IAP $6.99/mo · $49.99/yr; US storefront web-checkout link, checkout-only neutral copy (don't bank on 0% link-out forever — Epic rate-setting live).
- Interactive voice (v3 ambition) is a chatbot under 4.7 *and* 1.2 per the Feb 6, 2026 update — costed as such, not assumed cheap.

Loop-2 regulatory findings (`research/05-regulatory-loop2.md`), now binding on the roadmap:

- **US state AV laws cover audio.** Texas HB 1181 ("descriptions"), Tennessee ("text, audio"), Florida ("describes") et al. — a dedicated erotica service exceeds every content threshold. Integrate an age-verification vendor (ID + transactional options, zero retention) for AV-law states from day one; the same integration serves the UK.
- **UK OSA:** audio-only erotica is Part 5 pornographic content requiring **highly effective age assurance** (self-declaration non-compliant; Ofcom fines have hit small foreign operators). Launch decision: HEAA (~£0.10–0.25/check) or geoblock the UK — documented either way.
- **EU AI Act Art. 50:** machine-readable synthetic-audio marking (signed metadata + AudioSeal-class watermark) is mandatory with **no artistic carve-out**, plus a public detection means; the fictional-work carve-out only softens user-facing disclosure to an unobtrusive episode-page label (already our design). Applies immediately to systems on the EEA market from Aug 2, 2026.
- **Voice licenses re-papered to AB 2602/ELVIS standard:** reasonably specific description of erotic-AI use, counsel/union acknowledgment, fine-tune consent, category exclusion rights, takedown terms. Boilerplate "all media" clauses are unenforceable in California.
- **FTC posture:** "Narrated in the voice of [Actor], AI-rendered under license" is the safe pattern; never imply human performance; never deny AI use in-app. The FTC 6(b) companion-app study means intimacy apps are on the radar.
- **Naming resolved:** "Selfish" is viable (clearance search before filing, classes 9/41/42); "Hush" is blocked by five live sleep/ASMR apps. Working title is now the name candidate.

## 7. Business model & moats

- **Free tier (small, permanent):** rotating 3 Desire + 3 Rest sessions. Answers the category's loudest complaint; costs ≈ 0.
- **Selfish+:** **$6.99/mo · $49.99/yr** (at/below Quinn until voice loyalty exists), annual-first paywall, **14-day trial** (giveaway-stacking trimmed per debate; revisit with data at day 60).
- Explicit web tier: post-launch, priced within the same sub.
- **Moats, named honestly:** (1) per-variant preference data — skip/replay/dial-down signals at a granularity no fixed catalog can collect, compounding into recommendation and commissioning decisions; (2) **exclusive voice-likeness contracts** for synthetic erotic performance — lockable now, expensive to copy later; (3) the trust brand ("the app that pays humans and tells the truth"), which converts the inevitable exposé into a press release.
- Ceiling honesty: as scoped this is a Quinn-class ($10–15M ARR) outcome; the composer (v1.5) and interactive voice (v3) are the ceiling-expansion bets, sequenced behind trust and unit economics.

## 8. Go-to-market

1. **Web smoke test first** (operator's demand, shared build): Expo web deploy, 25–40 BFE-dynamic sessions, Stripe paywall, AI disclosed, traffic via 3 romance-TikTok creators. Thresholds: ≥3% visitor→paid; disclosure-aware retention ≥ non-disclosed cohort. iOS submission proceeds on signal.
2. Channels: BookTok/romance TikTok, romance podcasts, creator collabs; never market explicit capability off-platform.
3. Brand voice: warm, witty, literate; female creative lead on all scripts/copy; "ethical AI intimacy" narrative led by the licensing story.

## 9. Risks (updated)

1. **Disclosed-AI rejection** — the smoke test measures exactly this before scale spend; licensing story is the mitigation.
2. **Quality miss** — blind-test gate; delay > slop.
3. **Apple policy shift / review variance** — curated posture, honest notes, web escape hatch.
4. **Provider strike** (ElevenLabs classifier tightening on slow-burn) — self-hosted fallback warm; pipelines separated.
5. **Editorial throughput bounds catalog velocity** — $/finished-minute tracked from session one; commissioning guided by preference data, not volume.
6. **Fast-follow by Quinn/Bloom** — voice exclusivity + data moat + shipping the composer before they notice.

## 10. MVP build scope (this repo)

- **App:** Expo / React Native + TypeScript (Expo Router), iOS-first, web output for the smoke test. Screens: age gate → onboarding (moods, voices, heat, hard limits, AI-disclosure consent) → Home ("Tonight" picker + Continue rail) → Browse (multi-tag) → Player (variant switcher, heat indicator, headphone prompt, content notes, discreet mode) → Rest shelf → Settings (privacy, discretion, subscription stub, transparency page).
- **Backend:** Supabase — OTP auth, Postgres schema (voices, narrators/licenses, series, session families, variants, tags, heat levels, ratings, entitlements, preference events), Storage/CDN for audio, RLS everywhere; edge function for entitlement checks.
- **Pipeline package:** Node/TS CLI — brief → LLM draft (pluggable Grok/OpenAI-compatible; mock provider default) → safety classifier stage (pluggable; rule-based baseline + LLM screen) → editorial gate (human-in-the-loop file workflow) → TTS render (pluggable ElevenLabs / Orpheus server / mock) → post hooks → audit-trail manifest → Supabase publisher. Runs end-to-end locally with mocks, no secrets required.
- **Explicitly stubbed:** payments (RevenueCat/Stripe interfaces only), real TTS keys, watermarking (interface + TODO to AudioSeal-class implementation).

## 11. Resolved questions (from v1's open list)

1. Name → **Selfish confirmed viable** by loop-2 trademark scan ("Hush" is blocked by five live sleep apps); full clearance before filing; user-test pre-launch.
2. Free tier → small + permanent, with shorter (14-day) trial.
3. Focus in v1 → **cut**; Rest + Desire only.
4. Name-drop → opt-in, default off, whitelist-only.
5. 150 sessions → reframed as 100 families × 4 variants + 30 Rest; depth in 3 dynamics.
6. F4F/NB → launch requirement (≥15 sessions, 3 of 6 voices non-male).
7. Web explicit tier → deferred post-launch; never referenced in-app.
