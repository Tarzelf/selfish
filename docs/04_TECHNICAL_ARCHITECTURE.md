# Technical Architecture: Selfish

> Architecture v1 — designed for easy maintenance and cloud-agent development

---

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         iOS App (Expo)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Focus   │  │ Whisper  │  │  Auth    │  │  Subscription  │ │
│  │  Player  │  │  Session │  │  (OTP)   │  │  (RevenueCat)  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘ │
│       │             │             │                 │           │
└───────┼─────────────┼─────────────┼─────────────────┼───────────┘
        │             │             │                 │
        ▼             ▼             ▼                 ▼
┌──────────────┐ ┌────────────────────────────────────────────────┐
│ Local Audio  │ │              Supabase Backend                   │
│ (bundled)    │ │  ┌─────────────┐  ┌──────────────────────────┐ │
│              │ │  │ Auth + DB   │  │ Edge Functions (proxy)   │ │
│              │ │  │             │  │  • whisper-chat          │ │
│              │ │  │             │  │  • transcribe-audio      │ │
│              │ │  │             │  │  • synthesize-speech     │ │
│              │ │  │             │  │  • revenuecat-webhook    │ │
│              │ │  └─────────────┘  └───────────┬──────────────┘ │
└──────────────┘ └───────────────────────────────┼────────────────┘
                                                 │
                    ┌────────────────────────────┼────────────────┐
                    ▼                            ▼                ▼
              ┌──────────┐              ┌─────────────┐  ┌───────────┐
              │ Grok API │              │ Grok TTS    │  │ Grok STT  │
              │ (xAI)    │              │ (xAI)       │  │ (xAI)     │
              │ text +   │              │ [whisper],  │  │ streaming │
              │ voice v2 │              │ [sigh] tags │  │ WebSocket │
              └──────────┘              └─────────────┘  └───────────┘
```

---

## Why This Architecture

| Principle | Implementation |
|-----------|----------------|
| **Easy to maintain** | Managed services only. No servers to patch. |
| **Secure** | API keys live in Supabase Edge Functions, never in app bundle |
| **Cloud-agent friendly** | Edge functions are small, testable TypeScript files |
| **Cost-aware** | Text-first pipeline is 5–10x cheaper than realtime voice |
| **Single vendor** | xAI for text, STT, TTS, and realtime voice — one API key, one bill |
| **Upgradeable** | Abstract provider interfaces; can swap if needed |

---

## Mobile App (Expo / React Native)

### Stack

- **Expo SDK 52+** (managed workflow)
- **Expo Router** (file-based navigation)
- **TypeScript** (strict)
- **expo-av** (audio playback + recording)
- **expo-haptics** (subtle feedback)
- **@supabase/supabase-js** (auth + API)
- **react-native-purchases** (RevenueCat)
- **NativeWind** or **StyleSheet** (match existing project patterns — StyleSheet for simplicity)

### Key Screens

```
app/
├── (auth)/
│   ├── index.tsx          # Welcome + sign in
│   └── age-gate.tsx       # 18+ verification
├── (tabs)/
│   ├── index.tsx          # Home — mode picker
│   ├── focus.tsx          # Focus mode sessions
│   ├── whisper.tsx        # Persona + scenario picker
│   └── settings.tsx       # Account, privacy, subscription
├── session/
│   └── [id].tsx           # Active Whisper session
└── _layout.tsx
```

### Audio Session Flow (Whisper)

```
1. User holds mic button
2. expo-av records → uploads audio blob to edge function
3. Edge function: STT → text
4. Edge function: Grok chat (with persona prompt + history) → response text
5. Edge function: Grok TTS (with speech tags like `[whisper]`) → audio URL
6. App streams/plays audio
7. Repeat until user ends session
```

**Latency budget**: Record stop → audio playing = <4 seconds target

---

## Backend (Supabase)

### Database Schema

```sql
-- profiles
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  display_name text,
  birth_date date,           -- age gate
  memory_enabled boolean DEFAULT false,
  intensity_preference text, -- soft | warm | bold
  created_at timestamptz
)

-- personas (seeded, not user-generated in v1)
personas (
  id uuid PRIMARY KEY,
  name text,                 -- "Elena"
  voice_id text,             -- Grok TTS voice ID (e.g. ara, eve)
  system_prompt text,        -- character instructions
  is_active boolean
)

-- scenarios (seeded)
scenarios (
  id uuid PRIMARY KEY,
  persona_id uuid REFERENCES personas,
  title text,                -- "The Hotel Bar"
  description text,
  opening_line text,
  intensity text,            -- soft | warm | bold
  is_active boolean
)

-- whisper sessions
whisper_sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  persona_id uuid REFERENCES personas,
  scenario_id uuid REFERENCES scenarios,
  intensity text,
  status text,               -- active | completed
  message_count int,
  created_at timestamptz,
  ended_at timestamptz
)

-- messages (for history + memory)
whisper_messages (
  id uuid PRIMARY KEY,
  session_id uuid REFERENCES whisper_sessions,
  role text,                 -- user | assistant
  content text,
  audio_url text,            -- stored in Supabase Storage
  created_at timestamptz
)

-- subscriptions (synced from RevenueCat)
subscriptions (
  user_id uuid PRIMARY KEY REFERENCES profiles,
  status text,               -- active | expired | trial
  product_id text,
  expires_at timestamptz
)
```

### Edge Functions

| Function | Purpose | External APIs |
|----------|---------|---------------|
| `whisper-chat` | Orchestrates full turn: STT → LLM → TTS | Grok STT, Grok text, Grok TTS |
| `transcribe-audio` | STT only (if split needed) | Grok STT (streaming WebSocket) |
| `synthesize-speech` | TTS only | Grok TTS (REST or WebSocket) |
| `revenuecat-webhook` | Sync subscription status | RevenueCat |

### `whisper-chat` Flow (pseudocode)

```typescript
// POST /whisper-chat
// Body: { sessionId, audioBase64? , textMessage? }

1. Authenticate user (JWT)
2. Check subscription / free session limit
3. Load session + persona + scenario + last N messages
4. If audioBase64: transcribe → userText
   Else: userText = textMessage
5. Build messages array with system prompt (persona + scenario + intensity + guardrails)
6. Call Grok chat completions → assistantText
7. Content filter check on assistantText (block if too explicit for tier)
8. Call Grok TTS (inject speech tags like `[whisper]` per intensity) → audio buffer
9. Upload audio to Supabase Storage
10. Save messages to DB
11. Return { text, audioUrl, sessionId }
```

---

## AI Configuration

### Grok (Text Brain)

- **Model**: `grok-3` or latest chat model
- **Strength**: Sexy 18+ persona dialogue — founder-validated. Grok stays in character, escalates naturally, responds to user cues without breaking immersion. Key differentiator vs Quinn (passive) and filtered AI companions.
- **Content tiers**: Two prompt variants per persona — see below.

#### Content tiers (App Store vs full experience)

| Tier | Audience | Content ceiling | Use case |
|------|----------|-----------------|----------|
| **App Store** | 18+ verified, on iOS | Suggestive, sensual, fade-to-black. No graphic anatomy. Wellness-framed. | Quinn/Dipsea competitive — gets us on App Store |
| **Full** | 18+ verified, subscribers | Spicier, more direct. Still no minors/non-consent. Founder-validated Grok strength. | Web or post-App-Review "mature" tier if needed |

Start with App Store tier in v1. Grok can do more — we dial intensity via prompts, not platform limits.

#### System prompt structure (App Store tier)

```
You are {persona.name}, {persona.description}.

SCENARIO: {scenario.title}
{scenario.context}

INTENSITY: {intensity} — adjust pacing and suggestiveness accordingly.
- soft: romantic tension, emotional connection, minimal explicit content
- warm: sensual, suggestive, fade-to-black for explicit acts
- bold: more direct desire, still no graphic anatomical descriptions

RULES:
- Always speak in first person, directly to the listener ("you")
- Respond to what they say — never monologue
- Keep responses under 100 words (this is voice, not a novel)
- Remember details they share within this session
- Never break character
- Never produce content involving minors, non-consent, or violence
- For App Store tier: suggestive and sensual yes; graphic/explicit no

OPENING (if first message): {scenario.opening_line}
```

#### Full tier prompt delta (future)

For subscribers who want the founder-validated experience: relax the "fade-to-black" and anatomical constraints. Keep hard limits: no minors, non-consent, violence. Grok handles this well — prompt engineering, not model limitation.

### Grok TTS (Voice)

- **API**: Standalone Text-to-Speech endpoint ([announced Apr 2026](https://x.ai/news/grok-stt-and-tts-apis))
- **Pricing**: $15 per 1M characters
- **Voices**: Ara, Eve, Leo (same roster as Grok Voice Agent)
- **Speech tags**: Inline prosody controls — `[whisper]`, `[sigh]`, `[laugh]` — ideal for intimate/ASMR delivery
- **Modes**: REST (batch) or WebSocket (real-time streaming)
- **Why Grok over ElevenLabs**: Single vendor, speech tags for intimacy, same stack as Voice Agent

### Grok STT (Speech Input)

- **API**: Standalone Speech-to-Text endpoint ([announced Apr 2026](https://x.ai/news/grok-stt-and-tts-apis))
- **Pricing**: $0.10/hr batch, $0.20/hr streaming
- **Modes**: REST (batch) or WebSocket (lowest-latency realtime)
- **Features**: Word-level timestamps, speaker diarization, 25+ languages
- **Why Grok over Deepgram**: Single vendor, strong entity recognition, beats Deepgram on benchmarks
- **Fallback**: Apple Speech framework (free, on-device) if offline/privacy needed

---

## Security & Privacy

| Concern | Mitigation |
|---------|------------|
| API keys in app | All external API calls via Edge Functions |
| Voice recordings | Delete raw audio after STT; only store TTS output if user opts in |
| Conversation history | User can delete sessions; auto-delete after 90 days |
| Memory | Opt-in only; stored as text summaries, not raw audio |
| Age verification | Birth date required; block <18 |
| AI data sharing | Disclosed in privacy policy; required by Apple Nov 2025 |

---

## Deployment

| Component | Platform | Deploy command |
|-----------|----------|----------------|
| iOS app | EAS Build → TestFlight → App Store | `eas build --platform ios` |
| Edge functions | Supabase | `supabase functions deploy <name>` |
| Database | Supabase | `supabase db push` |
| Secrets | Supabase dashboard | XAI_API_KEY, ELEVENLABS_API_KEY, etc. |

---

## Phase 2 Upgrades (not MVP)

1. **Grok Voice Agent API** — replace turn-based with full-duplex for premium tier (same xAI stack)
2. **Session memory across sessions** — vector store or summary compression
3. **Pre-rendered scenario intros** — hybrid scripted opening + AI continuation
4. **Focus mode personalization** — AI-generated ambient based on mood check-in
