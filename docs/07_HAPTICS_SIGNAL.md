# Research: Vibration / Massage Apps on the App Store

> Cycle 2 addendum — founder signal: half a dozen ~4.8★ apps that turn the iPhone into a massager, reviews full of praise

---

## What the founder found

There is a whole category of one-feature iOS apps:

> Phone vibrates. You place it. That's the product.

They sit on the App Store under wellness / massage names. Ratings cluster **4.3–4.8**. Review sections are long, emotional, and specific. This is not a fluke.

Examples in-market: *Vibrator App: Strong Massager*, *VibRelax*, *Vybe*, *Good Vibrator*, plus many clones. Some are 17+. Many are Health & Fitness. Apple has not wiped the category.

---

## What the reviews actually say

Strip the fake 5-star farms. The real praise repeats:

| Theme | What people write | Product lesson |
|-------|-------------------|----------------|
| **It works now** | Open, pick a pattern, feel it in seconds | First session must *do something to the body* |
| **I already have the device** | Phone died / toy died / hotel / no drawer | Discretion + zero extra hardware |
| **I control the rhythm** | Slow vs fast, steady vs pulse, lock the screen | Agency. Same as Self + intensity |
| **Don't paywall the feeling** | Rage at apps that hide vibration behind IAP | Free tier must include the body, not tease it |
| **Don't interrupt** | Screen lock, no ads mid-session | Sacred session. We already knew this |
| **They won't say it in the listing** | Store copy = neck tension, sleep, massage gun | Reviews = intimate use, openly |

The listing is wellness. The reviews are the real product. Apple allows both.

---

## Why this matters for Selfish

### 1. App Store fear was overstated

We planned as if 1.1.4 would kill anything bodily. These apps are named *Vibrator* and still ship. Quinn and Dipsea already proved audio. Haptics prove **body** is allowed if you stay in wellness language and 17+/18+.

Selfish does not need to be more timid than a $0 massager clone.

### 2. Voice-only leaves a sense on the table

Maya's arousal path is imagination (audio). The body still wants a physical loop. These apps win because they close that loop with hardware she already holds.

**Audio = mind. Haptics = body. Together = the session she remembers.**

A dumb rumble app cannot do Elena. Elena without the body is still a chatbot with a nice voice.

### 3. Do not become one of those apps

| If we copy them | What happens |
|-----------------|--------------|
| Third mode: "Massage" | We compete with 4.8★ one-feature clones. Race to free. Tacky icon. |
| Market as a vibrator | We lose the Calm-on-the-home-screen cover. Maya said she'd delete that. |
| Paywall the rumble | Reviews will eviscerate us, same as the clones that did this. |

**Decision: Body is a layer, not a mode.**

```
Whisper session
  ├── Voice (Grok)     ← moat
  ├── Self             ← who they get to be
  └── Body (optional)  ← Taptic Engine follows intensity / her lines
```

Focus can use the same engine later for breath (wellness-legitimate). Never a separate "vibrator" tab.

### 4. Technical honesty (iPhone)

Modern iPhones use the **Taptic Engine**, not a cheap rumble motor. You get patterned pulses, not a continuous Android buzz. Those 4.8★ apps are already working inside that limit — rhythm and intensity matter more than raw power.

- `expo-haptics` for Light / Medium / Heavy pulses
- Loop a pattern while Body is on
- Pulse when Elena speaks (presence)
- Keep the screen awake; don't dim mid-session
- Cannot match a hardware toy. Don't claim to.

---

## Debate

### Should Body be on for session 1?

| Option | Verdict |
|--------|---------|
| Off by default | Safer, easier to miss the magic |
| On, gentle | Captivates. Matches "it works in 5 seconds" |
| On only if Self = Bold | Too clever. They won't find it |

**Recommendation:** Gentle Body **on** for first Whisper session. One tap to silence. Label it **Body**, not "vibrator."

### Should Focus get haptics?

Yes, later. Breath-synced Light taps. That's the App Store-safe half of the same system — and why the icon can still look like Calm.

---

## Maya

> "If the app looks like those vibrator apps I'm out. If Elena is talking and the phone answers in my hand, that's… actually the thing. Let me turn it off. Don't make me explain it to anyone."

**Verdict:** Layer. Tasteful. Optional. On for the first session. Never the brand.

---

## Implementation (this cycle)

- Session toggle: **Body**
- Pattern follows intensity (soft / warm / bold)
- Pulse when Elena's line arrives
- No new tab, no store-style mode grid, no IAP on the toggle
