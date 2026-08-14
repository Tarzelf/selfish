# Design System: Mood + Components

> Lock the look before we build every screen.  
> **Open `design-board.html` in a browser.** That is the living mood + component board. Figma can copy it later.

---

## Mood (what it should feel like)

Not a porn app. Not a meditation startup with a crystal. A **jewelry box at night**.

| Word | Yes | No |
|------|-----|----|
| Private | Closed door, headphones, candle | Neon, lips, silhouettes |
| Warm | Gold, rose, linen, skin-adjacent cream | Ice blue SaaS, pure black |
| Slow | Soft type, long line-height, one action | Carousels, badges, confetti |
| Adult | 18+ without announcing it | Playful cartoon, hearts |

References we already own:

- Atmosphere — woman, headphones, dusk, phone face-down  
  `docs/mood/mood-atmosphere.png`
- Materials — gold silk, pearl, rose, stone, candle  
  `docs/mood/mood-materials.png`
- Device — dark phone, gold crescent, linen  
  `docs/mood/mood-device.png`

**Competitor steal / don't steal**

| Steal from | Don't steal |
|------------|-------------|
| Calm — quiet home screen | Calm — clinical teal |
| Quinn — romance, not porn | Quinn — content store grid |
| A jewelry brand — gold on charcoal | Vibrator apps — neon dials, 20 modes |

---

## Color

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#0D0B0E` | App canvas |
| `surface` | `#1A1619` | Cards |
| `surfaceElevated` | `#241F23` | Inputs, raised |
| `border` | `#2E282C` | Hairline only |
| `text` | `#F5F0EB` | Primary (cream, not white) |
| `textMuted` | `#9A8F96` | Body secondary |
| `textSubtle` | `#6B6168` | Captions |
| `accent` | `#C9A87C` | Gold CTA, brand |
| `whisper` | `#B87D9E` | Intimate mode, Body on |
| `focus` | `#7BA7BC` | Focus mode only |
| `danger` | `#C45C5C` | Errors, never decoration |

Contrast: cream on `#0D0B0E` is the default. Gold buttons use dark text (`background`), not white.

---

## Type

System font. No display typeface in v1 (easy to maintain, feels native).

| Style | Size / weight | Use |
|-------|---------------|-----|
| Hero | 34 / 300 | Welcome, home greeting |
| Title | 24 / 400 | Screen titles |
| Subtitle | 17 / 400 | Card titles |
| Body | 16 / 400 | Everything readable |
| Caption | 13 / 400 | Hints |
| Label | 12 / 500 / +1.2 tracking / uppercase | Section labels only |

One idea per screen. If a paragraph needs a second sentence, cut the first.

---

## Space + radius

`4, 8, 16, 24, 28, 40`  
Radius: `12` inputs, `16` cards, `20` large cards, `28` pills.

Touch targets ≥ 44pt. Primary button is full-width pill.

---

## Component inventory (v1)

Build these once. Every screen is a composition.

| Component | Variants | Code |
|-----------|----------|------|
| **Button** | primary, secondary, ghost · disabled | `Button.tsx` |
| **ModeCard** | Focus / Whisper | `ModeCard.tsx` |
| **SelfCard** | selected / default | `SelfCard.tsx` |
| **FocusSessionCard** | — | `FocusSessionCard.tsx` |
| **IntensityDial** | soft / warm / bold | `IntensityDial.tsx` |
| **BodyToggle** | on / off | session header |
| **TextField** | default, error | age gate, name, chat |
| **MessageBubble** | user / assistant / thinking | session |
| **SettingsRow** | — | You tab |
| **PromiseLine** | large poetic line | onboarding |

**Out of v1:** tabs with icons-as-images, avatars, stories, badges, streaks, lottie.

---

## Screen list (do not invent more)

1. Welcome  
2. Age  
3. Promise  
4. Self  
5. Whisper session  
6. Home (after first session)  
7. Focus list  
8. Focus player  
9. Whisper picker  
10. Whisper setup  
11. You  

If a new screen is not on this list, it waits.

---

## Living board

Open the app → You → **Design board**  
or route `/dev/design-board`.

That screen is the component design board: tokens, buttons, cards, fields, bubbles. Change a component there first, then use it in product screens.

---

## When we get Figma

Recreate this file as:

1. **Mood** page — the three images + words  
2. **Foundations** — color, type, space  
3. **Components** — one page per component above  

Do not redesign in Figma and then rebuild. Figma follows this board.
