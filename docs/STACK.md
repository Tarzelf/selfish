# Stack — easy to keep

## Why Expo

The founder already ships an Expo iOS app. Selfish should be maintainable by one person. Expo 57, TypeScript, no native project until we need background audio polish or IAP.

iOS first. Web exists so the room can be felt in a browser while we write.

## What is in v1

- Authored sessions in TypeScript
- A tiny assembler (gift opening + heat door)
- Device / Web Speech as a stand-in narrator
- Local profile only

## What comes next, on a server we control

```
POST /v1/listen
  profile: { gift, heat, pace, voiceId }
  sessionId
→ { chapters: [...], audioUrl? }
```

- LLM: xAI Grok, server-side, to rewrite the middle of an authored session — not an open chat.
- TTS: chosen only after TOS review. ElevenLabs is quality-best and legally gray for Want. Still can use it more safely. Always have a fallback.
- Cache audio. Never put keys on the device. Never log the gift.

## What we will not add to keep the app small

A companion personality. A social graph. A creator marketplace. Android until iOS feels inevitable. Stripe on iOS (Apple IAP only).
