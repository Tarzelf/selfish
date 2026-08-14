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
- TTS: **ElevenLabs v3** on a paid plan + no-train DPA, never Music/Agents. **xAI TTS** as TOS-aligned backup. Self-host if a vendor flinches. Pre-render to AAC and cache. Device speech remains the v0 stand-in.
- Cache audio. Never put keys on the device. Never log the gift.

## What we will not add to keep the app small

A companion personality. A social graph. A creator marketplace. Android until iOS feels inevitable. Stripe on iOS (Apple IAP only).
