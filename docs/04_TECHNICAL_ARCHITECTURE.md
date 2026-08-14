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
              │ Grok API │              │ ElevenLabs  │  │ Deepgram  │
              │ (xAI)    │              │ TTS         │  │ STT       │
              │ text +   │              │             │  │ (or Apple)│
              │ voice v2 │              │             │  │           │
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
| **Upgradeable** | Swap STT/TTS/LLM providers without app update |

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
5. Edge function: ElevenLabs TTS → audio URL
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
  voice_id text,             -- ElevenLabs voice ID
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
| `whisper-chat` | Orchestrates full turn: STT → LLM → TTS | Grok, ElevenLabs, Deepgram |
| `transcribe-audio` | STT only (if split needed) | Deepgram or Grok |
| `synthesize-speech` | TTS only | ElevenLabs |
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
8. Call ElevenLabs TTS → audio buffer
9. Upload audio to Supabase Storage
10. Save messages to DB
11. Return { text, audioUrl, sessionId }
```

---

## AI Configuration

### Grok (Text Brain)

- **Model**: `grok-3` or latest chat model
- **System prompt structure**:

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

### ElevenLabs (Voice)

- **Voice**: Custom or stock female voice (warm, intimate, close-mic feel)
- **Settings**: stability 0.5, similarity 0.75, style 0.4 (more expressive)
- **Model**: `eleven_multilingual_v2` or `eleven_turbo_v2_5` for speed

### STT

- **MVP**: Deepgram `nova-2` (fast, accurate, $0.0043/min)
- **Alternative**: Apple Speech framework (free, on-device, iOS only)

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

1. **Grok Voice Agent API** — replace turn-based with full-duplex for premium tier
2. **Session memory across sessions** — vector store or summary compression
3. **Pre-rendered scenario intros** — hybrid scripted opening + AI continuation
4. **Focus mode personalization** — AI-generated ambient based on mood check-in
