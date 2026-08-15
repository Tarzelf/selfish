# Selfish

**A women-first audio app for rest and desire.** Intimate, ASMR-grade audio sessions — stories to fall asleep to, and stories that are very much not for sleeping — rendered by studio-crafted synthetic voices built from licensed human performances, and tunable ("more like this, but softer / slower / more buildup") in ways no fixed catalog can be.

This repository contains the research, product plan, and MVP scaffold, produced through a research → plan → debate → research → execute loop (see `docs/`).

## Repository layout

| Path | What |
|---|---|
| `docs/PLAN.md` | **PRD v2** — the product plan, post-debate |
| `docs/DEBATE.md` | Three-persona debate log (target user, skeptical investor, App Review/T&S red team) and every resulting decision |
| `docs/research/01-market.md` | Market & competitor research (Quinn, Dipsea, Bloom, AI companions) |
| `docs/research/02-app-store-compliance.md` | App Store compliance playbook (guideline 1.1.4 envelope, age stack, payments) |
| `docs/research/03-science-and-content.md` | Science of audio arousal, ASMR, focus audio; content design principles |
| `docs/research/04-tts-voice-landscape.md` | TTS/LLM provider survey incl. content policies; recommended stacks |
| `apps/mobile/` | Expo (React Native + TypeScript) app — iOS-first, exports to web for the smoke test |
| `packages/pipeline/` | Content pipeline: brief → LLM draft → safety classifier → editorial gate → TTS render → post → audit manifest |
| `supabase/migrations/` | Postgres schema: catalog, narrator licensing, entitlements, preference events, RLS |

## The product in one paragraph

Two shelves — **Rest** (sleep stories, wind-downs) and **Desire** (second-person POV romantic fiction: boyfriend experience, praise, friends-to-lovers, soft dom, aftercare) — served by one intimacy engine: close-miked, breathy, binaural voices with heat levels from Comfort to Spicy, capped by the user, filtered by their hard limits, and switchable mid-session to a softer/slower/longer-buildup variant. Every session is first-party, pre-rendered, safety-classified, and human-reviewed; **no user input ever reaches a generative model at runtime** (the core App Store compliance invariant). Every voice is disclosed as synthetic, built from licensed narrator performances with revenue share.

## Running the app (preview build)

```bash
cd apps/mobile
npm install
npm run web        # or: npx expo start (iOS simulator / Expo Go)
```

The preview build runs entirely on-device: seed catalog in `src/data/catalog.ts`, preferences in AsyncStorage. **Sessions with a ▶ badge play real audio** rendered by the live pipeline (Grok script → safety classifier → Grok TTS → automated audio-QA); the voice transparency page has playable engine previews for every voice persona. Sessions without bundled audio use a simulated clock.

**Shipped in the preview:** age gate, onboarding, Tonight / Browse / Rest / You, heat-cap variant gating, hard-limit filtering (including deep links), Continue rail, a permanent free tier (3 Desire + 3 Rest), and a 14-day Selfish+ preview that unlocks the rest of the catalog on-device. Stripe checkout and live Supabase sync are the next production step — they are not mocked as working payments.

### Web deploy (for user testing)

```bash
cd apps/mobile
npx expo export --platform web     # static site in dist/
npx netlify deploy --prod --dir dist   # or any static host; netlify.toml included
```

## Running the pipeline demo

```bash
cd packages/pipeline
npm install
npm run demo       # brief -> draft -> safety -> editorial -> render -> manifest, all with mock providers
```

Providers are selected by environment (mocks by default):

| Env | Effect |
|---|---|
| `PIPELINE_LLM=grok` + `XAI_API_KEY` | Script drafting via the Grok API (optional `GROK_MODEL`) |
| `PIPELINE_TTS=grok` + `XAI_API_KEY` | Audio rendering via Grok TTS (optional `GROK_TTS_VOICE` to map persona → provider voice) |
| `PIPELINE_TTS=elevenlabs` + `ELEVENLABS_API_KEY` | Soft pipeline only — ElevenLabs prohibits explicit content |
| `PIPELINE_TTS=self-hosted` + `SELF_HOSTED_TTS_URL` | Orpheus/Chatterbox server (OpenAI-compatible `/v1/audio/speech`) |

The two production pipelines (soft vs. spicy content) run on fully separated accounts/keys/infrastructure — see `docs/PLAN.md` §5.

## Grok TTS voice audition

With an xAI API key (Cursor Dashboard → Cloud Agents → Secrets → `XAI_API_KEY`, repo-scoped):

```bash
cd packages/pipeline
npm run tts:audition                  # whisper-closeness probe across every built-in voice (~$0.01 total)
npm run tts:audition -- --voice ara   # full 3-probe deep test of one voice (whisper / warmth / sleep cadence)
```

Clips land in `packages/pipeline/out/tts-audition/` with a `report.json` (latency, size, est. cost per clip). The probes map to the craft bar in `docs/PLAN.md` §4.3: whisper realism & breath, audible smile, slow sleep pacing.

## Compliance posture (read before shipping anything)

- 18+ app; wellness/romance metadata; 4+-clean screenshots; curated first-party catalog only.
- No disguised icons. No in-app references to more-explicit content elsewhere. Never show App Review a sanitized build.
- Safety stack (classifier → editorial → audit trail) is blocking, not advisory.
- Voice licenses must explicitly cover synthetic erotic performance before any fine-tuning.

Full playbook: `docs/research/02-app-store-compliance.md` and `docs/DEBATE.md`.
