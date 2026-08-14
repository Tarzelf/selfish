# whisper-chat

Orchestrates a single Whisper conversation turn: **Grok STT → Grok text → Grok TTS**.

Uses the all-xAI stack ([Grok STT & TTS APIs](https://x.ai/news/grok-stt-and-tts-apis), Apr 2026).

## Endpoint

`POST /functions/v1/whisper-chat`

## Request

```json
{
  "sessionId": "uuid (optional, creates new if omitted)",
  "personaId": "uuid",
  "scenarioId": "uuid",
  "intensity": "soft | warm | bold",
  "textMessage": "user text (if no audio)",
  "audioBase64": "base64 audio (if voice input)"
}
```

## Response

```json
{
  "sessionId": "uuid",
  "text": "assistant response text",
  "audioUrl": "https://...",
  "messageCount": 3
}
```

## Pipeline

1. **Grok STT** — transcribe `audioBase64` via streaming or REST API ($0.20/hr streaming)
2. **Grok text** — chat completion with persona/scenario/intensity system prompt
3. **Grok TTS** — synthesize response with speech tags (`[whisper]`, `[sigh]`) based on intensity ($15/1M chars)
4. Upload audio to Supabase Storage, return URL

## Intensity → Speech Tags

| Intensity | TTS treatment |
|-----------|---------------|
| soft | `[whisper]` on key phrases, slow pacing |
| warm | Mix of normal + `[whisper]`, `[sigh]` |
| bold | Confident delivery, occasional `[laugh]` |

## Environment Variables

- `XAI_API_KEY` — Grok text, STT, and TTS (single key)

## Status

🟡 Scaffold only — implementation in Phase 2
