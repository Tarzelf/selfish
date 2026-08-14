# Onboarding: First Sessions, Self, and Return

> Research cycle 2 — how a customer actually starts  
> Goal: zero distraction, immediate intimacy, a private self they can grow

---

## The real job of onboarding

Most intimate apps fail here in opposite ways:

| App | What they do | What it feels like |
|-----|--------------|--------------------|
| **Quinn / Dipsea** | 55–70 screens of browsing + paywall | A store. You shop for a story. |
| **Replika** | 26-step quiz, then paywall | Homework. Then a chatbot. |
| **Clinical wellness** | Forms, medical tone | A doctor's office. Shame. |

**Selfish should do almost nothing.**

The first session *is* the onboarding. Everything before it exists only to make that session feel safe enough to start.

> Captivate in session 1. Deepen in session 2. Let them push limits in session 3+.  
> Never make them fill out a profile of their desires. Let desire appear in play.

---

## Insight: they are not picking Elena. They are building a Self.

The founder insight:

> People like to play being a virtual persona they can build for themselves. They're not being judged. It's healing. They can come back and push limits.

This is different from:

- **Quinn** — you consume someone else's fantasy
- **Replika** — you build the *AI's* personality
- **Character.AI** — you pick from a menu of strangers

**Selfish** — you get a private version of *you*. A self that can want things. Elena is the mirror, not the product.

| Layer | What it is | Who owns it |
|-------|------------|-------------|
| **Self** | Who the listener is allowed to be here | The user |
| **Companion** | Elena (or later voices) | The product |
| **Scene** | Hotel bar, rainy apartment… | A doorway, not a destination |

Healing, here, is not therapy. It is: *I can want this and nobody is watching.*

Do not claim medical benefit. Do not use clinical language. Do not ask "what's wrong."

---

## Debate: what to ask before the first voice

### Should we ask what they like?

| Option | Verdict |
|--------|---------|
| Long preference quiz (kinks, tropes, orientation) | **No.** Feels like judgment. Kills play. |
| "How do you want to feel tonight?" (3 cards) | **Yes.** One choice. Playful. Maps to intensity. |
| Skip everything, dump into a scene | Too abrupt. No safety. They freeze. |

### Should we ask their name?

Optional. Many people want to be unnamed here. "Skip — surprise me" is a first-class path.

### Should first session be Focus or Whisper?

**Whisper.** Focus is the safe icon on the home screen later. Captivation happens when a voice answers *them*. If we start with rain sounds, we become Calm.

### Should we show Home before the first session?

**No.** Home is a menu. Menus are where desire dies. After age + promise + self, they are already in the scene.

### How many screens before audio?

**Four taps. Then a voice.**

```
Welcome → Age → Promise → Self → Elena speaks
```

No account yet. No paywall yet. No tabs. No "learn more."

---

## The four screens

### 1. Welcome — one breath

- Brand + tagline only
- "Headphones recommended."
- One button: **Begin**
- No carousel. No features. No social proof wall.

Copy:
> Selfish  
> Time that's just yours.

### 2. Age — one number

Legal. Unavoidable. Keep it warm, not bureaucratic.

Copy:
> This is for adults.  
> What year were you born?

If under 18: stop. No lecture. "This space is for people 18 and over."

### 3. Promise — safety without a terms wall

Three lines. No checkboxes except implicit continue.

> Nobody is watching.  
> You can want things here.  
> You can leave whenever you want.

Small print: *This is not therapy. Your sessions stay on your terms. You can delete them.*

Button: **I understand**

### 4. Self — who are you here?

Not "create a character." Not a form.

> Tonight, who do you want to be?

Three cards. One tap.

| Self | Feeling | Intensity | First scene |
|------|---------|-----------|-------------|
| **Soft** | Held. Wanted. Unhurried. | soft | The Hotel Bar |
| **Playful** | Curious. A little reckless. | warm | Late at the Library |
| **Bold** | In charge. No apology. | bold | Rainy Apartment |

Then, optional:

> What should we call you here?  
> (skip is fine)

Button: **I'm ready**

---

## First session: captivate

The Self choice picks scene + intensity automatically. User does not see a scenario menu on first run.

Elena opens in character. The user talks or types. That is the product.

**Session 1 job:** They hear a voice respond to *their* words. Chills, smile, or "oh." If that happens, they come back.

**Do not** interrupt with:
- "Rate this session"
- "Unlock premium"
- Streaks, badges, tips
- A tour of Focus mode

When they leave the session: a single quiet line.

> You can come back as this version of you. Or try another.

Then Home appears for the first time — with their Self already on it.

---

## Sessions 2 and 3: return and push limits

| Session | Job | What the product does |
|---------|-----|------------------------|
| **1** | Captivate | One scene. Their Self. A voice that answers. |
| **2** | Remember | "Continue as [name]" — Elena references last time. Option to go a little further. |
| **3+** | Play / push | Intensity can move. New scenes unlock. Self can be edited. Limits are *their* choice. |

"Push limits" is user-paced, never the app's. No "level up your desire" gamification. Maya was clear: this is not Duolingo.

The Self grows by *use*, not by forms:

- After a few sessions, "You" shows who they've been here
- They can add a note: "Tonight I want slower" — optional
- They can start a new Self (play) without deleting the old one

---

## What we never ask in onboarding

- Sexual orientation (let it appear in play)
- Relationship status
- Kink checklist
- Trauma history
- Why they downloaded the app
- Email (until they want to keep the Self across devices)

Account creation happens *after* the first good session, when they have something to lose.

---

## Maya reviews this onboarding

> "If you ask me to pick my kinks on screen three I will close the app. If you ask me how I want to *feel*, I'll answer. If Elena is talking thirty seconds later, I'm yours."

> "The Self thing is actually what I wanted from Replika and never got. I don't want to build *her*. I want a place I can be a little different and not be weird about it."

> "Don't tell me it's healing. Let it feel that way. If you say 'healing' I think of a wellness brand that doesn't want to get me off."

**Verdict:** Four screens, then voice. Self over quiz. Healing as feeling, not copy. ✅

---

## Implementation notes

- Persist Self in app state (later: `profiles.self_feeling`, `profiles.self_name`)
- First-run flag: skip Home until `hasCompletedFirstSession`
- Self maps to existing intensity + scenario IDs — no new backend yet
- Headphones hint stays on Welcome and first session header
- Promise screen is the privacy moment Maya asked for
