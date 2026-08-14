# Selfish — App Store & Distribution Debate

**Working name:** Selfish  
**Product:** Generative AI scripts + high-fidelity TTS for personalized spicy/ASMR listening (primarily women exploring desire; secondary focus/relaxation)  
**Founder constraint:** Tasteful iOS on phones, easy to maintain  
**Date:** 2026-08-14  
**Stance:** Prefer shipping a real product over fantasy App Store success.

---

## Verdict (primary recommendation)

**Do not bet the company on shipping generative erotic AI as a first-class App Store product.**

Ship a **web-first (or Whop/membership) spicy core** for adults 18+, with optional **thin iOS companion** that stays App Store–safe (library, player shell, account, soft wellness/romance framing). Treat App Store erotic generative AI as a *later* experiment only after you have revenue, retention proof, and a moderation stack Apple (and payment processors) would recognize as serious.

**Why this wins:** Dipsea/Quinn are *curated audio*, not open generative NSFW. Guideline 1.1.4 + 4.7 + AI content rules make “personalized spicy scripts on-device via App Store” a high-rejection, high-maintenance trap. Web/membership is where adult audio already monetizes; iOS can be distribution theater and habit, not the erotic engine.

**Secondary recommendation (product split):** Build **one brand, two surfaces** — not two unrelated apps on day one. Surface A = desire/erotic generative (web). Surface B = focus/ASMR wellness (can live on App Store). Same account optional later; separate binaries only if Apple review forces it.

---

## Steelman debate

### Side A — “Ship tasteful erotic generative AI on the App Store”

**Steelman:** Apple already hosts Dipsea, Quinn, and romance/erotica audio. If Selfish is framed as *intimacy wellness / relationship imagination / women’s sexuality education*, with strong editorial tone, 17+ rating, no visual porn, no chat-with-minors edge cases, and human-in-the-loop or heavily constrained generation, reviewers might treat it like premium audio erotica rather than porn. Generative AI could be limited to “remix within approved scenario packs,” not free-form porn. High production TTS + beautiful UX signals “tasteful brand,” which historically helps curated apps survive.

**How Dipsea/Quinn likely survive (inferred, not insider):**

| Factor | Curated apps (Dipsea/Quinn) | Generative Selfish |
|--------|-----------------------------|--------------------|
| Content source | Human writers, pre-vetted library | Model output per user |
| Review surface | Finite catalog Apple can sample | Infinite / unpredictable |
| Guideline 1.1.4 exposure | “Erotica audio” still gray; they walk the line with romance framing, fade-to-black, soft language in metadata | Explicit *intent to stimulate erotic feelings* is harder to deny when product copy says “spicy personalized desire” |
| Guideline 1.2 / UGC | Limited UGC; studio content | User prompts ≈ UGC + AI; needs filtering, reporting, blocking |
| Guideline 4.7 (AI) | N/A or light | Must disclose AI; content must meet all other guidelines; jailbreak/prompt injection = your problem |
| Moderation cost | Editorial pipeline | Continuous classifiers, prompt filters, output scanners, appeals |
| App Review sample | Reviewer hears a few tracks | Reviewer can prompt “explicit X” and reject |

**Framing that *might* work (still not a promise):**

1. **Romance / intimacy fiction**, not “porn ASMR.” Metadata, screenshots, and keywords avoid “NSFW,” “erotic,” “orgasm,” etc.
2. **Closed scenario packs** — generation only fills dialogue within rated templates (consent-forward, fade-to-black options).
3. **No free-form prompt box** in the App Store build; “customize vibe / relationship / setting” via constrained controls.
4. **17+**, age gate at account creation, no social feed of user-generated erotica.
5. **Wellness adjacent copy:** stress relief, body comfort, sleep, partner communication — erotic function implied, not marketed as masturbation aid in App Store assets.
6. **Human review queue** for novel generations before they become reusable library assets (expensive; undercuts “generative” magic).

**Honest counterweight:** Even perfect framing fails often for *generative* NSFW. Rejection, forced 1.1.4 remediation, or silent “spam/misleading” loops are common. Surviving once ≠ surviving updates, competitor reports, or policy tightening. Side A is a *lottery ticket with high burn rate*, not a strategy.

### Side B — “App Store will reject generative erotic AI; need alternative distribution”

**Steelman:** Guideline 1.1.4 is explicit about material *intended to stimulate erotic rather than aesthetic or emotional feelings*. A product whose core loop is personalized spicy desire scripts is definitionally erotic stimulation. Generative AI makes every session a new piece of potentially overtly sexual content Apple cannot pre-approve. Guidelines 1.1, 1.2, and 4.7 stack: prohibited content categories, UGC/AI safety, and AI apps that must not violate other rules. Dipsea/Quinn are not a precedent for *your* architecture — they are a precedent for *studio erotica*. Betting on App Store as primary distribution for the spicy generative core is founder fantasy; it delays shipping, burns review cycles, and forces product compromises that gut differentiation.

**Implications if Side B is correct (it usually is):**

- Spicy generative = **web / PWA / membership platform**, Stripe or adult-friendly processors as needed.
- App Store binary = **player + account + soft catalog** or pure wellness ASMR — or skip native until traction.
- “Easy to maintain iOS app” ≠ “easy to keep erotic generative AI approved.” Maintenance of moderation + review theater exceeds maintenance of a Flutter/React Native shell.

**Blunt synthesis:** Side A describes a *possible* constrained App Store product that is mostly *not* the generative spicy product the founder wants. Side B describes how to ship the *actual* product. Choose Side B for the core; optionally run a Side A experiment later with a neutered SKU.

---

## Debate table — distribution options (iOS adults)

| Option | Fit for spicy generative | Reach / trust | Maintainability | Monetization | Risk | Verdict |
|--------|--------------------------|---------------|-----------------|--------------|------|---------|
| **App Store 17+ (full spicy generative)** | Poor–hostile | Best discovery | High policy churn | IAP (30%); Apple can nuke | Rejection, 1.1.4, 4.7 | **Do not primary** |
| **App Store soft “wellness/romance” + web unlock** | Good hybrid | Strong install habit | Two surfaces; careful deep links | Web sub avoids erotic IAP | Review may still probe web content / “spam” if unlock is obvious | **Best App Store compromise** |
| **PWA (Safari / Add to Home Screen)** | Strong | Weaker discoverability; fine for intent traffic | One codebase | Stripe/web | iOS PWA limits (notifications, storage); no App Store halo | **Strong core vehicle** |
| **TestFlight private beta** | Temporary only | Tiny | Easy | Limited | Not a store; expires; not marketing | **Dev/validation only** |
| **AltStore / sideload** | Technically possible | Tiny, technical audience | Cert/reload pain; support hell | Direct | Trust, malware stigma, Apple hostility | **Ignore for women’s consumer brand** |
| **Android-first (Play + sideload APK)** | Better than iOS for adult | Large market; women iPhone-skew in US/West may hurt | Play also has porn/sex policies; not free lunch | Play Billing or web | Policy still bites; brand split | **Secondary platform, not escape hatch alone** |
| **Whop / web membership + companion app** | Excellent for spicy core | Membership community, payments, content delivery | Ops on Whop + thin app | Membership native to model | Companion must stay clean on App Store | **Top-tier for adult audio GTM** |
| **Desktop/web-first** | Excellent | Headphones + phone is the use case; desktop is secondary listening | Fastest ship | Web sub | Misses “in bed with phone” unless mobile web is excellent | **Ship web mobile-first; desktop is bonus** |

### Option notes (blunt)

1. **App Store 17+ full product** — Fantasy path. Budget review rejection as default. If you insist, constrain generation so hard you no longer have a generative porn moat.
2. **Soft App Store + web unlock** — Classic adult/gaming pattern. App has focus tracks, romance teasers, account. “Full Desire library & custom scripts” live on `listen.selfish.app`. Risk: Apple dislikes bait-and-switch; keep App Store build *useful alone*, not a hollow door.
3. **PWA** — Closest to “tasteful iOS on phones, easy to maintain.” One React app, install prompt, push is weaker on iOS — acceptable for listening apps if sessions are user-initiated.
4. **TestFlight** — Use for design partners and TTS quality, not GTM.
5. **AltStore/sideload** — Wrong demographic, wrong trust model for intimate audio.
6. **Android-first** — Useful expansion; does not solve “founder wants iPhone.” Google also restricts sexual content; generative NSFW still needs web-grade moderation.
7. **Whop/web membership + companion** — Aligns with creator/membership economics, age-gated communities, and adult-tolerant payments culture. Companion = bookmarks, offline download of *approved* files, reminders — not the prompt box.
8. **Desktop/web-first** — Fine for production/QA; real usage is mobile web in bed. Optimize mobile web before Electron cosplay.

---

## Recommended phased GTM

### Phase 0 — Proof (2–6 weeks of product work, not calendar promises)

**Goal:** Prove women will *finish* personalized spicy sessions and pay.

- Mobile-web MVP: onboarding → desire preferences → constrained scenario → TTS playback → tip/subscribe.
- Manual or semi-manual script QA before full open generation.
- Age gate 18+ (hard), payment via web.
- **No App Store submission.**
- Metrics that matter: completion rate, return within 7 days, willingness to pay — not downloads.

### Phase 1 — Spicy core as membership (web / Whop)

**Goal:** Recurring revenue without Apple as landlord of desire.

- Launch **Selfish Desire** (or clear spicy SKU) on web + optional Whop.
- High-fidelity TTS, library of hit scenarios, limited personalization knobs.
- Content safety stack live before open prompts (see Policy red lines).
- Marketing: creators, newsletters, TikTok/IG *careful* (platform sexual content rules), SEO, partnerships with sex-positive educators — not App Store featuring fantasy.

### Phase 2 — Thin iOS companion OR wellness SKU (optional)

**Goal:** Habit + credibility without putting generative erotica in review’s mouth.

**Pick one:**

- **2A — Companion:** Account, playlist of *purchased/entitled* audio, downloads, soft romance/wellness catalog. Generation and explicit library browsing on web.
- **2B — Selfish Calm / Focus:** Separate App Store product: ASMR, breath, non-sexual intimacy journaling audio. Cross-promote Desire on web in allowed ways (support site, email) — not a porn unlock button in v1 if review risk is high.

Prefer **2A** if engineering budget is one app; prefer **2B** if you want App Store ads/ASO for a clean category.

### Phase 3 — Constrained generative experiment on App Store (only if Phase 1 works)

**Goal:** Learn if a *neutered* generative feature survives review.

- No free-text porn prompts.
- Template slots only; classifiers + blocklists; 17+; AI disclosure (4.7).
- Be ready to kill the feature or the binary without killing the web business.

### Phase 4 — Android + deepen platform

- Play Store soft companion mirroring iOS policy posture.
- Deeper personalization, couples modes, creator marketplace — still web-authoritative for explicit.

**What “easy to maintain” actually means under this plan:** One web listening stack + one thin native shell. Not two full erotic products fighting two app stores.

---

## One app vs two apps

| | **One app (Desire + Focus together)** | **Two apps / two products** |
|--|--------------------------------------|-----------------------------|
| **Pros** | One brand, one account, cross-sell, less engineering | App Store SKU stays clean; Desire never diluted; clearer ASO; review blast radius contained |
| **Cons** | Soft features get the binary banned when Desire leaks; confused positioning; Apple samples worst path | Split attention; users hate two installs; brand fragmentation; duplicate player stacks |
| **Brand risk** | “Wellness app that does porn” invites 1.1.4 | “Selfish Calm” and “Selfish” (Desire web) can share visual system without sharing binary |

**Recommendation:** **One brand, two surfaces** (not necessarily two native apps on day one).

- **Surface Desire:** Web/Whop — generative spicy.
- **Surface Calm:** Optional App Store — focus/ASMR wellness.
- Same login *eventually*; do not require it for MVP.
- Only merge into one native binary if legal/review counsel (or repeated approval of constrained generative) says it’s safe — i.e., almost never as v1.

**Do not** hide a full porn generator behind a focus mode toggle in a single App Store app. Reviewers and competitors will find it; you’ll lose both modes.

---

## Policy red lines

### Product & content

1. **No minors, ever** — characters, voice “young,” school settings, “barely 18” aesthetics, age-play. Hard refusal in model + classifiers + human audit. Default character age ≥ 21 in copy and system prompts.
2. **No non-consensual themes as defaults** — CNC/non-con only behind explicit adult opt-in *if ever*, with clear labeling; many brands should ban entirely for App Store-adjacent and payment-processor safety.
3. **No real-person deepfakes / celebrity voices** without rights.
4. **No incest, extreme illegal fetish categories** that trip processor and store bans — maintain an explicit prohibited list.
5. **Overt visual porn** — out of scope; audio-first brand. Don’t add explicit imagery to “help conversion.”
6. **UGC / prompts** — treat as UGC: filter, report, ban, retain logs for abuse.

### Age & access

7. **18+ hard gate** before any Desire content (DOB + checkbox + re-prompt on purchase). 17+ store rating ≠ 17-year-old users for erotic generative.
8. **No child-directed design** (cartoon mascots, school UI) on Desire surfaces.

### Privacy (intimate data is toxic waste)

9. Minimize retention of raw erotic prompts/scripts; encrypt at rest; strict access control; deletion/export flows (GDPR/CCPA posture).
10. Don’t sell intimate preference data. Don’t use spicy prompts to train public models without clear consent and legal review.
11. Separate analytics from script content where possible (event: “completed session” not “transcript dump”).

### Consent & safety logging

12. Log: age affirmation, ToS/Privacy acceptance version, consent to AI-generated intimate content, opt-ins for risky categories.
13. Clear crisis / “not a therapist” disclaimers; escape to grounding content; block self-harm sexualization patterns per safety policy.

### AI provider ToS (high level — verify current terms before build)

| Provider posture (typical / check live) | Implication for Selfish |
|----------------------------------------|-------------------------|
| **OpenAI** | Generally restrictive on erotic/pornographic content; poor fit for core spicy generation without heavy sanitization that destroys product. Use only for non-erotic Calm features if policy allows. |
| **xAI / Grok** | Often more permissive on adult content than OpenAI — *still* subject to change, rate limits, and abuse policies. Candidate for Desire scripts; do not assume perpetual NSFW allowance. |
| **Anthropic** | Typically restrictive on explicit sexual content; better for safety tooling / Calm than core erotica. |
| **Open / specialty NSFW TTS & LLM hosts** | More aligned to adult audio; higher ops burden (uptime, voice rights, compliance). Likely necessary for spicy TTS if mainstream TTS bans erotic. |
| **Mainstream TTS (e.g., many cloud voices)** | Check ToS: erotic use often prohibited. Budget for adult-capable voice vendors or licensed voice actors + cloning with contracts. |

**Rule:** Contract and architecture so you can **swap providers**. Never build Desire so it only works on a provider that can kill you with a ToS email.

### Payments

14. App Store IAP for digital erotic generative unlocks = double jeopardy (guideline + Apple as morals police). Prefer **web subscription** for Desire.
15. Have a backup processor path if Stripe risk-matches adult content; disclose product accurately to processors.

### App Store-specific

16. Don’t lie in review notes. Misleading metadata gets you 1.1.6 / fraud-shaped removals.
17. If companion exists, App Store screenshots must reflect *in-app* experience, not web porn.
18. Guideline 4.7: disclose AI; generated content must meet 1.1; provide filter/report.

---

## Decision checklist for founder

Use this as a go/no-go. Honest answers only.

### Strategy

- [ ] Am I willing to ship **Desire on web first** even if there’s no App Store icon for 3–6+ months?
- [ ] Is “tasteful iOS app, easy to maintain” actually **companion/PWA**, or am I addicted to App Store featuring?
- [ ] Have I accepted that **Dipsea/Quinn ≠ generative AI precedent**?
- [ ] What is the **minimum delightful spicy session** without free-form porn prompts?

### Distribution

- [ ] Primary distribution for spicy generative: **web / Whop / PWA** (circle one).
- [ ] App Store role: **none / companion / separate Calm app** (circle one).
- [ ] If Apple rejects forever, does the business still work? **Yes required.**

### Product split

- [ ] Desire vs Calm: **one brand two surfaces** confirmed?
- [ ] Will the App Store binary remain useful if web is blocked in-app? **Yes required for 2A.**

### Compliance readiness (before open generative)

- [ ] 18+ gate + consent logging designed?
- [ ] Minor/NC/illegal theme refusals in model + post-filter?
- [ ] Intimate data retention & deletion policy drafted?
- [ ] AI + TTS providers chosen with **adult-content-allowed** ToS in writing?
- [ ] Payment processor fit checked for erotic audio subscriptions?

### Kill criteria

- [ ] If App Store review demands removal of personalization, do we **keep web generative** and ship soft catalog only? (Should be yes.)
- [ ] Max engineering weeks we’ll burn on App Store theater before returning to web growth: ____ (set a number; stick to it).

---

## Closing blunt take

**Selfish’s spicy generative core is a web/membership product that happens to be consumed on iPhones.**  
The App Store can host a polite roommate (player, calm audio, account). It should not be landlord of the bedroom.

Ship Desire where adults already pay. Earn the right to negotiate Apple’s gray zones later — with revenue, moderation receipts, and a product that still exists if Guideline 1.1.4 is enforced to the letter tomorrow.
