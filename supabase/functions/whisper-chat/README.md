# whisper-chat

Orchestrates a single Whisper conversation turn: STT → Grok → ElevenLabs TTS.

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

## Environment Variables

- `XAI_API_KEY` — Grok text completions
- `ELEVENLABS_API_KEY` — TTS synthesis
- `DEEPGRAM_API_KEY` — STT (optional, can use Grok)

## Status

🟡 Scaffold only — implementation in Phase 2
