# Product — Selfish

**An hour that is only yours.**

Tasteful iOS listening app. Adult, 18+. Primarily for women. Easy to maintain.

## North star

A private room on a phone where a voice helps her **focus** or **be received**. She leans back. We hold the pace. The writing is as good as the book she would hide in public. The come-down is as considered as the heat.

This is not an AI girlfriend. This is not Quinn with a generate button. This is not Grok spicy chat in a gold theme.

## Who it is for

Women (and anyone who wants the female-gaze version of this) who already know that words and voice can move the body. Readers of smut. Listeners who tried visual porn and felt like a tourist. People who need a Still hour before they can want anything.

## Who it is not for

Men looking for an obedient chat partner. People who want video. People who want to direct a scene in real time. Anyone under 18.

## The debate, then the decision

### Catalog vs live generative vs hybrid

- **Catalog** (Quinn/Dipsea): proven, review-safe, expensive, not hers.
- **Live chat**: works for men; makes many women perform; App Store poison.
- **Hybrid**: authored ritual, personalized opening, heat and voice as doors, later a server that rewrites the middle without turning the home screen into a prompt box.

**Decision:** hybrid. v1 is authored + assembly. The AI is a craftsman in the back room, not the product face.

### One app or two

Dipsea already proved Still and Want can share a house if the house is tasteful. Two apps double the maintenance and split the night.

**Decision:** one app, two rooms. Still is real. Want is honest. Aftercare is the hallway between them.

### Conversation vs lean-back

She can talk to Grok anytime. She cannot easily find a voice that will take her somewhere and bring her back.

**Decision:** lean-back first. No chat in v1.

### The name

**Selfish** is a dare and a permission. Women are trained to give the hour away. The name says she can keep it. Risk: it can sound cruel. The subtitle has to work: *An hour that is only yours.* If Maya flinches at the word on the icon, we keep the repo name and shop a store name. For now we keep it. It is the most honest word we have.

### Visual design

Not pink wellness. Not black porn chrome. **Warm dark sanctuary** — lamp light, cream paper, a little gold, a little blush. It should look like a room she would actually sit in.

### Onboarding

Three questions. Not a kink quiz.

1. What would feel like a gift tonight?
2. How should a voice arrive?
3. How far do you want the door open?

### Aftercare

Every Want session ends in aftercare. *Stay* exists as a session of its own. The player always offers “skip to aftercare.” That is not prudish. That is how you treat a nervous system.

### Money

Subscription, later, through Apple IAP. v1 is the feeling. Do not bolt on a paywall before the voice is good.

## Core loop

Open the phone → age and quiet welcome (once) → “what do you need tonight” → enter Still or Want → a voice arrives → she does not type → aftercare → she closes the app feeling **kept**, not used.

## Information architecture (six screens)

1. Age gate
2. Welcome (help me choose, or show me the rooms)
3. Onboarding (three questions — optional)
4. Home (Tonight + Still + Want)
5. Session (synopsis, heat, voice, begin)
6. Player (chapters, listen, skip to aftercare always in the top bar)

Settings is a seventh, small door: voice, heat, wipe, about.

## Voice system

Personas, not girlfriends. First-person “I.” No celebrity clones. No real-person likeness.

| Id | Arrival |
| --- | --- |
| **Ash** | Low, unhurried, close. |
| **Vale** | Warm, precise, literary. |
| **Juniper** | Soft, knowing, a woman’s voice. |
| **Rowan** | Quiet, androgynous, intelligent. |

Device / Web Speech in v0. Server TTS later, only after TOS review.

## Safety rails

- 18+ birth-year gate (conservative: year ≤ now − 18)
- Characters are adults in adult rooms. No school, no ageplay brand, no “barely.”
- Consent is part of the writing.
- Fiction disclaimer.
- Report a line.
- Local profile. Wipe in one tap.
- Lock screen title stays discreet: “Selfish — listening.”
- Content linter in CI.

## What we will not build in v1

- Open erotic chat
- User-generated audio
- Images of bodies
- Voice cloning of real people
- Social, likes, roses, tips
- Android (iOS first)
- Stripe on iOS
- A companion that texts her during the day

## Maintainability

One Expo app. Authored JSON-like TypeScript sessions. A tiny assembler. A narrator. No backend required to feel the product. A documented server contract for Grok + TTS when keys exist.

## v1 success

Maya finishes a session. She does not feel sleazy. She would listen again tomorrow. A reviewer at Apple can open Still and a heat-1 Want session and understand this is a listening room, not a porn store.
