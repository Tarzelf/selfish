# Research brief — Selfish

Last updated: 14 August 2026 (loop 2 after Maya’s first listen). Adult product. 18+ only. All fantasy is fictional and consensual.

This brief is the study behind the product, not a pitch deck. It exists so we do not build the wrong thing: a male spicy-chat port wearing a prettier skin.

## What we are actually building

Two jobs live in one listening room:

1. **Still** — help someone focus, come down, inhabit a body that has been performing all day.
2. **Want** — help a woman explore inner desire through voice, the way a well-written erotic novel can, without asking her to watch porn or perform in a chat.

The founder already knows spicy AI conversation can work for men. That is a solved sensation, not this product. The harder, more valuable problem is **women + voice + being received**.

## Why voice, not video, not chat

### Auralism is a real pathway

Emerging work treats sound as a primary erotic gateway, not decoration:

- Audio erotica can change heart rate, affect, and subjective arousal (Gao et al., 2023; Pfaus & Safron, 2024).
- ASMR produces reliable physiological change (heart rate down, tingles, immersion) but is **not** reliably sexual (Poerio et al., PLOS One, 2018). We steal the craft of close-mic intimacy, not the claim that tingles equal sex.
- An auralism survey (Psychology of Desire, 2026) found preferred voice qualities were **sensuality, praise, storytelling, flirtation**. Dirty talk ranked fifth. Only about 1% most enjoyed “sex sounds.” Comfort, safety, feeling seen, and embodiment showed up as often as heat.

Implication: if we optimize for moans and explicit nouns, we will lose the women this product is for.

### Why women over-index on audio

Visual porn audiences are still majority men. Audio erotica products (Quinn, Dipsea) are **~75–80% women**, mostly 18–44, with a thick 25–34 core. As erotic media becomes less visual and more psychological, female participation rises. Imagination is not a compromise. It is the feature.

NYT (2023) and The Conversation (2023) both describe the same fantasy underneath the “boyfriend experience”: a competent adult who has already done the emotional and domestic labor, and who wants her. That is the opposite of the second shift. It is also the opposite of “type something dirty so the model has material.”

### Why a naive Grok port fails for women

Male spicy chat works because many men enjoy **directing** the scene and being visually/verbally explicit in a tight loop. A lot of women who love smut do not want to **author their own porn in real time**. They want to lean back, be seen, and have the pacing held. Asking them to prompt is asking them to work.

GoneWildAudio, Quinn tags, and Dipsea reviews converge on:

| She often wants | She often does not want |
| --- | --- |
| Praise, aftercare, body worship, apology | Being the director / the prompt engineer |
| Slow burn, specificity, “he sees me” | Generic porn voice, organ inventory |
| Consent treated as heat, not a disclaimer | Mean-for-the-sake-of-mean |
| A door she can close (heat levels) | A chatbot that escalates past her |
| To receive | To perform |

Quinn’s most frequent tags have included **praise**, **boyfriend**, and **MDom**. That is not “more explicit.” That is **relational intensity**.

## Market map

| Product | What it is | Lesson |
| --- | --- | --- |
| **Quinn** | Creator + celebrity audio erotica. ~$8/mo or $60/yr. 17+/18+. Hundreds of thousands of subs, $10M+ raised, $12M+ ARR reported. | Catalog + famous voices win distribution. Categories like aftercare / apology / body worship / praise are the product, not a sidebar. |
| **Dipsea** | In-house written stories + sleep/wellness. ~$13/mo or $70/yr. | Wellness wrapper is how you stay on the App Store **and** how a wary woman gives herself permission. Sleep + spice in one app is proven. |
| **GWA / Soundgasm** | Amateur, tagged, raw. | Proof of hunger. Also proof that taste and production are the paid layer. |
| **Replika / Character.AI / Nomi** | Companion chat. | Chat is a different job. Apple and safety pressure keep pushing explicit companions off the store or into the web. |
| **Uncensored AI girlfriends** | Web-only, visual, male-skewed. | Do not copy. They cannot live tastefully on iOS and they train the wrong user. |

We do not beat Quinn at celebrity catalog. We do not beat Dipsea at industrial writing. We beat both at **a night that is hers** — a ritual that already knows the gift she asked for.

## App Store — how this survives review

Apple Guideline **1.1.4** bans “overtly sexual or pornographic material”: explicit descriptions or displays of sexual organs or activities **intended to stimulate erotic rather than aesthetic or emotional feelings**. Hookup apps and porn facilitation are in the same bucket.

And yet Quinn and Dipsea are on the store, 17+/18+, with spicy audio. The pattern that works:

1. **Literary / wellness framing**, not “AI porn girlfriend.”
2. **No visual sex.** No genitals on screen. Ever.
3. **Curated listening**, not an unmoderated generative sex chat.
4. **Age gate + 18+ rating override.** Apple’s 18+ bucket includes implied sexual activity and erotic or sensual dialog. **Graphic** sexual content is **Unrated** and cannot ship on the store. Stay in implied + sensual language for the binary we submit.
5. **IAP** for digital access (Guideline 3.1.1). StoreKit, not Stripe, on iPhone.
6. If anything is generated: treat it like UGC (filter, report, contact — 1.2 / 4.7). Named third-party AI consent before any prompt leaves the phone (5.1.2(i), Nov 2025).
7. Be **distinctive** (4.3 spam). A thin Grok wrapper will be rejected.
8. **Declared Age Range** plus our own 18+ lock. Metadata (icon, screenshots, preview audio) must read 4+. Desire data is GDPR Article 9 — form a legal entity before first submit (5.1.1(ix)).

2025–2026 reality: uncensored companion apps fled to the web. AI chat apps without moderation get 1.1 rejections. Fully live erotic generation on iOS is the highest-risk shape.

**Go-to-market for review:** ship a listening sanctuary with authored sessions, heat levels, aftercare, and a Still room. Personalization is parameter assembly plus (later) server-side script adaptation from pickers — not an open spicy chat in v1. *Closer* (wide) may stay off the first binary we show Apple, or be rewritten to implied sensual dialog.

## Vendor reality (do not be naive)

| Layer | Who | Adult fictional OK? | Use |
| --- | --- | --- | --- |
| Script LLM | **xAI Grok** | Yes, with conditions. AUP bans CSAM, real-person pornographic likeness, non-consensual imagery. Fictional adult text is allowed. | Server-side adaptation only. Never on device. No images. |
| Script LLM | Mistral hosted | Yes, with conditions. Do not attach their sexual moderation category. | Backup drafts. |
| Script LLM | OpenAI / Anthropic / Google / Meta / Azure | **No** (or not a business you can bet on). | Do not use for Want. |
| TTS | **ElevenLabs v3** | Conditionally yes on **paid TTS**. No blanket porn ban. Never **Music** or **Agents** (those ban sexual / adult-entertainment use). No real-person voice sexualization. Get a no-train DPA — default TOS lets them train on input. | Quality pick for catalog + intimate scenes after legal review. |
| TTS | **xAI TTS** | Inherits xAI AUP. Whisper/ASMR quality unproven. | TOS-aligned backup. |
| TTS | PlayHT, Azure, Sesame, MiniMax | **No.** Written bans on sexual / pornographic use. | Do not touch. |
| TTS | Cartesia / Hume | Unclear. Discretionary filters. | Written approval only. |
| TTS | Device / Web Speech | Fine for prototype. Quality is not the product. | v0 narrator so the app is feelable without keys. |
| Payments on iOS | Apple IAP | Required for digital subscriptions. | Stripe is for web later, not the iPhone unlock. |

**Never put API keys on the phone.** Desire profiles are more sensitive than typical health data. Log nothing about what she asked for.

## Cost sketch (later)

A 10-minute personalized session is roughly 1.2–1.8k words.

- Grok adaptation: cents.
- ElevenLabs v3 is about **$0.90 per first 10-minute render**; Flash about half that. Cache by script hash + voice. A cache hit is ~$0.
- Live TTS on every play breaks a $9.99 subscription. Pre-render the library.

If we cannot cache, we cannot afford intimacy.

## Product principles (from the study)

1. She leans back. The app holds the pace.
2. Voice quality and writing quality are the product. Features are furniture.
3. Praise, specificity, and aftercare outrank explicitness.
4. Still is a real room, not a fig leaf for review.
5. Heat is a door she opens, not a slider we push.
6. No minors, no school settings, no ageplay branding, no real people, no non-consent as a default.
7. Fantasy is fiction. We say so.
8. Privacy is part of seduction. If she fears a receipt, she will never tell the truth.
9. Do not make her perform. Chat is a later, optional, advanced mode — if ever.
10. Taste is how far we go **after** she comes down. Aftercare is first-class.
11. Easy to maintain: small surface, authored core, server hooks, no companion-app sprawl.
12. Judge every screen as Maya (see `REVIEW-PERSONA.md`). If she flinches, we rewrite.

## Sources (selected)

- Apple App Store Review Guidelines, 1.1.4, 1.2, 3.1.1, 4.2, 4.3, 4.7
- Quinn App Store listing; Fast Company; Variety (2026); NBC; Slate (2026)
- Dipsea site and App Store listing; NYT interactive (2023)
- The Conversation, “boyfriend experience” audio (2023)
- Poerio et al., PLOS One (2018), ASMR physiology
- Psychology of Desire, “Auralism” (2026)
- ElevenLabs Prohibited Use Policy (3 Sept 2025)
- xAI Acceptable Use Policy
- Best Kept Secret / GWA genre notes on praise and aftercare
