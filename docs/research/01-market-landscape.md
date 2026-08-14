# Market Landscape: Audio Erotica & ASMR Audio for Women

**Research date:** 14 August 2026
**Scope:** Competitive landscape, user sentiment, market sizing, AI-voice reception, failure post-mortems, pricing/retention benchmarks, and whitespace analysis for a planned iOS app producing AI-scripted, TTS-voiced ASMR-style audio (focus/calm + erotic exploration) targeted primarily at women.
**Confidence convention used throughout:** `[VERIFIED]` = confirmed against a primary or reputable secondary source with a URL in the Sources section. `[SINGLE-SOURCE]` = one source only, plausible but uncorroborated. `[UNVERIFIED]` = could not confirm; treat as rumour. `[VENDOR CLAIM]` = self-reported by the company, i.e. marketing.

---

## Top 10 things that should change our product decisions

1. **The category leader tried exactly our thesis and publicly reversed it seven weeks ago.** Dipsea used AI voice simulation (via ElevenLabs) on under 3% of its 1,200+ stories, plus 204 AI-generated illustrations. It spent six months re-recording all of it with humans, hit a self-imposed "100% AI-free by end of June 2026" deadline, and published a post explaining why. Notably, its AI programme was already best-practice: voices were **licensed clones of its own actors**, actors chose how their voice was used, they got an upfront fee **plus a monthly retainer**, human recording continued in parallel, and every AI item carried a **"Virtual Voice" tag in the app**. It still got pulled — on values and brand grounds, not because listeners revolted en masse. If consent-based, paid, labelled AI voice was not defensible for the incumbent, "AI voices, tastefully done" is not a positioning. It is a liability we must actively engineer around. `[VERIFIED]`

2. **Do not build an "AI erotica app." Build an app whose AI is invisible or reframed.** The one differentiated thing AI genuinely unlocks here is **personalisation that a fixed catalogue cannot do** — the top recurring complaint in the category is that catalogues run dry and repeat. hearr.me already sells exactly this (a questionnaire → a unique story in ~3 minutes, no catalogue) and prices it as **credits, not unlimited** (€4.99 one-off; €12.99/mo for 10 audios; €29.95/mo for 30). That is the honest business model for generative audio, and it is a different product from Dipsea/Quinn. Our pitch should be "a story that is only yours," not "AI-narrated erotica." `[VERIFIED]`

3. **The revenue in this category is smaller than the press coverage implies, and the leader is shrinking.** Dipsea's numbers are publicly visible because RevenueCat acquired it as a live demo environment. At acquisition (Sept 2024): **93,847 paying subscribers, ~$6M ARR, $505,920 in the prior month**. As of 10 Aug 2026: **65,592 active subscriptions, $345.2K MRR, $4.14M ARR, MRR growth −1.3% over 28 days**. That is roughly **−30% subscribers and −31% ARR in under two years**, under the ownership of a company whose entire business is subscription optimisation. Quinn, the healthiest player, is at **$12M+ ARR on $10M raised**. Plan for a niche with a low tens-of-millions revenue ceiling per player, not a land grab. `[VERIFIED]`

4. **Apple caps how explicit we can be, and the cap is below what the category's power users want.** Guideline 1.1.4 bans "overtly sexual or pornographic material." Apple's age-rating reference is explicit that **"Graphic Sexual Content and Nudity"** content "can't be published on the App Store" and may only ship via alternative marketplaces or the web; the 18+ ceiling is "frequent sexual content or nudity." This is why Bloom Stories tells users to use **bloomstories.com in a browser for "unrestricted access,"** ships its iOS app rated "Infrequent Sexual Content" in **Health & Fitness**, and takes payment off-platform. A web-first or web-payment-plus-thin-iOS-client architecture is not a growth hack here — it is a content-policy requirement. Decide this before designing. `[VERIFIED]`

5. **Hard paywall, and a longer trial than instinct suggests.** RevenueCat's 2026 dataset (115,000+ apps, $16B+ revenue): hard paywalls convert at a **10.7% median Day-35 trial-to-paid vs 2.1% for freemium (~5x)** and generate **8x revenue per install at day 60 ($3.09 vs $0.38)**, while 12-month retention is statistically identical (27% vs 28%). Separately, **trials of 17–32 days convert at 42.5% vs 25.5% for sub-4-day trials**, and **55.4% of 3-day trial cancellations happen on Day 0**. Dipsea is effectively already a hard paywall (96.2% paid subscriber share) and Femtasy runs a **30-day free trial**. Our default should be hard paywall + long trial + an onboarding that delivers an "aha" inside the first session. `[VERIFIED]`

6. **The #1 complaint is not price or voice quality — it is that the well runs dry, and the #2 is that the app itself is broken.** Across Dipsea, Quinn, Bloom, and Emjoy reviews, the recurring themes are "not enough content / same content pinned for months," and then a startling volume of basic product failures: **no autoplay to the next chapter, no sleep timer, no queue management, no search/favourites, crashes on launch, cancellation dead-ends.** Emjoy's most detailed negative review reads: *"This feels like a side project from the pandemic that was abandoned when the developers went back to work full time."* Content velocity plus boring player-app competence is where this category is losing, and both are things generative pipelines and a competent iOS build can actually win. `[VERIFIED]`

7. **"Embarrassment surface" is a real, under-served product requirement.** A Quinn reviewer: *"even when the app is fully closed on my phone, it will still auto connect and start playing in my car and with my AirPods... if I can't find a way to prevent that from occurring, I'll have to cancel my subscription."* A Bloom reviewer could not identify a renewal charge because the billing descriptor did not say "Bloom." A Her Campus writer created a separate Apple ID because purchases surfaced on a family account. hearr.me advertises that billing shows as "hearr media" with no indication of erotic content. Discretion engineering — CarPlay/AirPlay suppression, no lock-screen artwork or titles, neutral billing descriptor, decoy app icon/name, no push notifications by default, Screen Time footprint — is a genuine feature set nobody has assembled deliberately. `[VERIFIED]`

8. **ASMR is a polarising trigger, not a universal good, and must be a tagged, controllable layer.** From an Emjoy review: *"The kissing sounds are getting louder and wetter and it's a sensory nightmare. I'm not joking - they need a trigger warning. The world is pretty split on ASMR, some love it and some hate it. Tag it."* Another Dipsea reviewer complained the opposite way, that the audio sounds like *"the actors are in big, empty, white rooms."* Given we are building on ASMR as a core aesthetic, mouth-sound intensity, breath level, and room ambience must be **user-controllable and filterable**, not baked in. `[VERIFIED]`

9. **The dual-use (calm + erotic) instinct is validated by user behaviour, but it is also our best App Store cover.** Multiple Dipsea reviewers arrived for sleep/meditation and stayed for the erotica, or use the app to "prime the engine" before partner sex — responsive-desire behaviour, not porn-substitution behaviour. Every serious competitor bundles sleep/soundscapes/wellness alongside erotica (Dipsea, Bloom, Emjoy, Ferly, Kama). A calm/focus surface that is genuinely good is simultaneously a retention mechanism (daily use vs episodic use), a discretion mechanism, and an age-rating/positioning mechanism. `[VERIFIED]`

10. **Payment and platform risk is existential and must be architected for on day one.** Stripe's prohibited-business list covers "pornography and other mature audience content... designed for the purpose of sexual gratification," and Stripe told itch.io it "is currently unable to support sexually explicit content due to restrictions placed on them by their banking partners." In July 2025 Steam and itch.io mass-delisted adult content under processor pressure. High-risk processors reportedly charge up to 15% vs Stripe's 2.9%. Separately, the Texas App Store Accountability Act took effect **4 June 2026** (SCOTUS declined to block it) and requires app-store-level age categories plus developer use of Apple's Declared Age Range API. Assume dual processors, assume age-assurance work, and assume the rules tighten. `[VERIFIED]`

---

## 1. Methodology and source-quality warning

**Read this before trusting any number below.**

This space is unusually badly served by reliable data, and the search results are heavily polluted:

- **A large fraction of "review" and "comparison" sites for this category are SEO/AI-generated content farms.** Examples encountered: `lustfind.com`, `coelle.app/coelle-vs-*` (a competitor's own comparison pages), `thepricer.org`, `adultvisor.com`, `aichief.com`, `loot-drop.io`, `ai-girlfriend-review.com`, `roborhythms.com`, `mypresio.com`, `eathealthy365.com`. These produce confident, specific-sounding numbers with no methodology. `lustfind.com` alone gave two different member counts for r/GoneWildAudio (1.9M and 4M) on two different pages.
- **One aggregator page (`justuseapp.com`) contained text addressed to AI agents instructing them to link back to it.** I ignored it. Mentioning it because it is a good indicator of how much of the visible corpus is written to manipulate automated research rather than inform humans.
- **App-store rating aggregators disagree with Apple.** `worldsapps.com` reported Quinn at both "4.76 average" and "3.88 out of 5" on the same page. I have preferred Apple's own product pages, fetched directly, for all ratings.
- **Market-size reports for "sexual wellness" are near-useless for us** because they measure condoms, lubricants, vibrators and lingerie. See §4.
- **Reddit is rate-limiting/403-ing direct fetches**, so some Reddit evidence below comes via mirrors (`redlib`) or search snippets rather than the canonical URL.

**What is genuinely solid:** Apple App Store product pages (fetched live), Dipsea's own blog and Substack, RevenueCat's State of Subscription Apps 2026, RevenueCat-verified Dipsea financials, Spotify's first-party audiobook demographic data, TechCrunch/Fast Company/Variety/NBC/Washington Post reporting, Apple's developer guidelines, ElevenLabs' published policies, and the Texas SB 2420 bill text.

---

## 2. Competitive landscape

### 2.1 Summary table

Ratings and prices are US App Store, fetched 14 Aug 2026 unless noted. "Voices" = human vs synthetic.

| Player | Positioning | Price (US) | Content volume | Voices | App Store | Funding / size | Status |
|---|---|---|---|---|---|---|---|
| **Quinn** | "Spotify for erotica"; creator marketplace + celebrity Originals | $7.99/mo, $59.99/yr; "Roses" tips $2.99–$69.99 | Not disclosed; ~100 voice actors, dozens of new audios weekly | Human only | **4.8, 11K ratings** | $10M raised; **$12M+ ARR**; 12 FTE | Healthiest player; shipped v4.3.2 two days ago |
| **Dipsea** | "HBO for your ears"; premium in-house studio production | $12.99/mo, $69.99/yr (many legacy tiers $8.99–$59.99; $399.99 lifetime seen) | **1,200+** original stories | Human only (**AI removed June 2026**) | **4.7, 7.7K ratings** (Play Store: **2.9**) | Raised $13.63M–$15.1M; **acquired by RevenueCat Sept 2024**; ~7 staff | **Declining: −30% subs since acquisition** |
| **femtasy** (Pink Internet GmbH, Berlin) | Largest EU/DACH audio erotica platform | **€99.99/yr**, ~€12.99/mo; **30-day free trial** | 700–800+ audios live; ~2,400 produced in DE/EN/FR | Human (50+ voices) | Web/PWA-first, no major iOS presence | 3 oversubscribed rounds; **~€9M annual revenue, 1M registered users, 170M+ plays, 35 staff** `[VENDOR CLAIM via OMR]`; "2 million women" on site | Active, profitable-looking |
| **Bloom Stories** (Quicku GmbH; formerly **Audiodesires** — same company) | Sensual wellness + romance audiobooks + **AI roleplay chatbots** | $10.95/mo on annual (~$131.40/yr); Audiodesires page shows $29.99/mo | **1,000+** spicy audios + licensed romance audiobooks | Human narration; **AI text/voice chat** | **3.5, only 40 ratings**; last update **Jan 2025** | 500K users (2023) | App effectively stale; **severe cancellation complaints** |
| **Emjoy** | Science-backed female "wellcare"; sex therapists/OB-GYNs | $10.99/mo, $99.99/yr; one-time $59.99/$79.99 | 500+ wellbeing sessions, 300+ stories | Human | **4.8, 1.7K ratings**; last update **Oct 2024** | Raised **$4.11M** (Nauta, JME); now owned by **CleverDeal ApS / Bedbible.com** | **Zombie**: acquired by an affiliate/SEO operator, not shipping |
| **Ferly** | Clinical: CBT/ACT, sex therapy, trauma-informed | ~$9.99/mo | 100s of audio sessions | Human | Play app not updated since **Aug 2024**, crash reports | "500,000 women" `[VENDOR CLAIM]` | Barely maintained |
| **Kama** | Guided practices for desire/pleasure, solo + couples | $12.99/mo, $69.99/yr, 7-day trial | 100s of sessions | Human | **4.8, 2,100+ reviews**; former Apple **App of the Day** | Not disclosed | Active, well-executed |
| **hearr.me** (Hearr Media UG) | **Fully AI-generated, personalised** erotic audio; "no catalogue" | **€4.99 single**; €12.99/mo (10 audios); €29.95/mo (30 audios) | Generated on demand | **100% synthetic** | Web-first, DE/EN | Small German UG | **Our closest analogue** |
| **Whisper Stories** (AK Development, MB) | "Personalised romantic audio stories" | IAP **$39.99 / $74.99 / $119.99** | Undisclosed | Claims "real human voices" | iOS, v2.5.5 (May 2026) | Unknown, likely tiny | Active; opaque |
| **Sssh.com** | 22-year ethical adult cinema for women/couples; audio is one line item | Membership (not surveyed) | Films + erotic fiction + **audio stories, ASMR, guided masturbation** | Human | Web only | Founder-led (Angie Rowntree) | Active; adjacent |
| **r/GoneWildAudio ecosystem** | Free, creator-driven, `[Speaker4Listener]` tagging, script-offer culture | **Free** | Immense, unfiltered | Human; **AI voice posts banned** | n/a | Founded 2012; 1.9M–4M members (sources conflict) | The real substitute good |
| **Audible / Storytel / Spotify** | Spicy romance audiobooks at scale | Bundled in general subs | Vast | Human | n/a | Public/large | Structural competitor for listening hours |
| **Tingles** (original, YC-backed) | Dedicated ASMR platform | Freemium | 200+ ASMRtists, 60K MAU (2018) | Human | **Defunct** | ~$1.5M burned `[SINGLE-SOURCE]` | **Dead**; name now squatted by unrelated apps |
| **Rosy** | Clinician-built low-libido platform w/ erotica + CBT | Subscription | 1000s of hours | Human | n/a | 7 years operating | **Shut down 20 Nov 2025** |

### 2.2 Corrections to the brief

- **"Aporia / Aurore" is not an audio erotica company.** Aporia was an ML observability startup acquired by Coralogix. There is an **Aurore** (`readaurore.com`) — a Brooklyn-based, **reader-supported** feminist erotica magazine with amateur non-fiction erotica and an ASMR/Audio tag — but it is a magazine, not an app, and not AI-related. `[VERIFIED]`
- **Audiodesires and Bloom Stories are the same company** (Quicku GmbH). Audiodesires is described as Bloom's "sister page"; Bloom is the app, Audiodesires the web brand. Do not count them as two competitors. `[VERIFIED]`
- **"Coral," "Blueheart," "Juicy," "Frolic," "Lust Stories," "Silk," "Craving ASMR"**: I could not verify current, material operations for any of these as significant competitors. Coral appears in Emjoy's own competitor list and in a SaaSHub "alternatives" widget but has no discoverable live product footprint. Treat all as `[UNVERIFIED]` / immaterial. Notably, **Emjoy's own App Store description name-checks "coral, blueheart, ferly, ohcleo, rosy, yuu, eros, &jane"** as competitors — a useful list of the 2020-vintage cohort, most of which are now gone or dormant.
- **Tingles**: the original YC-backed Slovenian ASMR platform is gone. The apps now on the App Store under "Tingles" are unrelated — one is a generic ASMR library by a solo developer (4.4, **18 ratings**), another is "Tingles: AI ASMR Video Maker" by "AutoTasker" selling credit packs up to $99.99. The ASMR-app tier is a low-quality, high-churn segment, not a serious competitive set.

### 2.3 Player notes that matter

**Quinn** is the one to study. Its moat is not technology, it is a **two-sided creator marketplace plus celebrity supply**. ~100 voice actors get revenue share based on engagement **plus direct tips** ("Roses" IAP, $2.99–$69.99). Quinn Originals feature Andrew Scott, Tom Blyth, Jamie Campbell Bower, Christopher Briney, Luke Newton, Sam Heughan, Jesse Williams, Kate Moennig, Tyriq Withers. "Ember & Ice" (with the *Heated Rivalry* leads Connor Storrie and Hudson Williams) has **3.5M+ listens** since its December debut. Spiegel says roughly **50% of celebrity approaches are refused** and deals take weeks to months. Production detail worth stealing: **binaural microphones** shaped like a head, so "the listener hears it as if someone's whispering in their ear," and intimacy coordinators on 8–12 hour sessions. Director Monahan's note is a good creative brief: *"I'm not asking to hear how you orgasm. I'm asking how this character orgasms in this scene."* Timing is deliberate — Briney's series dropped two days after *The Summer I Turned Pretty* finale. Quinn is winning on cultural velocity, and that is the axis AI does **not** help with.

**Dipsea** is the cautionary tale on two axes at once: AI reversal (§5) and quiet decline (§6). Also note its Play Store rating is **2.9 against 4.7 on iOS** — a 1.8-star platform gap, driven by billing/cancellation and crash complaints in Android reviews.

**Bloom Stories** is the cautionary tale on operations. It is the only major player already shipping AI (Bloom Chat: text + character voice notes, free users get unlimited text, premium gets 15 voice messages/month with more purchasable) — and its App Store rating is **3.5 on 40 ratings** with an app last updated January 2025. Its reviews are dominated not by AI complaints but by **cancellation dark patterns**: users routed from app → website → support → back to app with no working cancel button, unrecognisable billing descriptors, and a no-refunds ToS. This is how you destroy trust in a category built on trust.

**Emjoy's ownership change is the most underrated signal in the table.** An app with a 4.8 rating and 1.7K ratings, $4.11M raised from institutional VCs, and a founding story about sex therapists and OB-GYNs is now owned by **CleverDeal ApS**, listed on Apple's page with the developer name **Bedbible.com** — a sex-toy review/affiliate operation. It has not shipped since October 2024. That is what a soft landing looks like in this category: the content library becomes SEO inventory.

---

## 3. Voice of the customer: verbatim-flavoured themes

This is the richest section and the one I would act on first. Sources: App Store review pages (fetched), Google Play review excerpts, justuseapp/worldsapps aggregations of App Store reviews, Reddit, and Substack commentary. Quotes are verbatim from the cited pages; I have preserved their typos.

### 3.1 Top recurring COMPLAINTS

**C1. "I ran out of content" / the library is static and mislabelled.** The single most common structural complaint.
> *"The same 'new' content has been pinned on the 'today' tab for more than 6 months."* — Emjoy, App Store
> *"I subscribed for a bit but there's honestly not enough content to justify continuing my membership."* — Emjoy, App Store
> *"there aren't as many men such as myself who are interested"* / *"I don't think the dozen or so stories available currently from the male perspective are worth the subscription price."* — Dipsea, App Store

**C2. The scripts get female pleasure wrong — specifically, pacing and male orgasm timing.** This is the most product-relevant complaint in the whole corpus.
> *"I was only able to get off on 1 of the audios—this was the only audio where the guy didn't finish in 30 seconds... And 30 seconds—this is not nearly enough time for a woman, unless on a steamy 5 min break at work. Drives me crazy how uncreative the writers are with female pleasure. I'm never turned on by these audios."* — Dipsea, App Store
> *"there are some men who frankly make it sound like they've never given a woman an orgasm."* — Emjoy, App Store

**C3. Bad male voices / bad male performances.** Consistent and specific — this is a supply-quality problem, not a preference problem. The Emjoy quote above; Dipsea Play Store: *"just not good voices and stories seem luke warm at best."* Quinn users have asked for a **male-voice-only filter** that was removed: *"I do miss the filter feature for selecting only male voices and the list of tags though!! Please bring those back in some form!!"*

**C4. Sound design that breaks immersion.**
> *"It always sounds like the actors are in big, empty, white rooms. Very uncomfortable, awkward, and not stimulating in the least for me."* — Dipsea, App Store

**C5. ASMR mouth sounds as a sensory hazard — the "tag it" complaint.**
> *"The more recent stories seem to be increasing in ASMR content. The kissing sounds are getting louder and wetter and it's a sensory nightmare. I'm not joking - they need a trigger warning. The world is pretty split on ASMR, some love it and some hate it. Tag it."* — Emjoy, App Store
> *"The slurping is too much."* — same reviewer

**C6. Too expensive / hard paywall resentment, with a specific repeated ask for an ad-unlock option.** Users are not just complaining about price, they are proposing a mechanic.
> *"barely anything is accessible without paying for an expensive subscription... i would MUCH prefer that they put ads at the beginning and end of stories, or at least... a system where you have the option of watching ads to unlock a story for a certain amount of time."* — Dipsea, App Store
> *"There's no option to watch ads to unlock stories and that's troubling."* — Dipsea, App Store
> *"I came from TikTok a few weeks ago and and I don't have enough money to afford this and I want listen to stories and I think it's unfair that we don't have a free trial for this"* — Quinn, App Store
> Counterpoint from a satisfied subscriber, worth remembering: *"for the folks complaining about $47? Watching an ad before or after would take you out of the mood... $47/year is nothing. That's a four hour shift as a cashier these days."*

**C7. Trial-to-charge shock and cancellation dark patterns.** Ubiquitous and reputation-destroying.
> *"I tried out the one week free trial... my alarm to cancel it didn't go off so I'm now stuck paying $50 (for an app...) at once."* — Dipsea, App Store
> *"It's still attempting to charge me after canceling my free trial... it has attempted to pull $69.99 from my account 4 times... the 'Delete My Account' option is a joke. The button to confirm deleting your account is under my home screen button 😅 so I can't press it."* — Dipsea, Google Play
> *"it is very difficult to cancel your subscription. If you try in the app, go to plans, then click cancel, it tells you to log in online at their website to cancel. When you log in online it tells you to go to plans and cancel, but there is no cancel button online."* — Bloom Stories, App Store
> *"I have been trying to cancel my subscription for days... I have sent multiple emails over multiple days and have been ignored. There is NO WAY to cancel."* — Bloom Stories, App Store
> *"I discovered a recurring subscription renewal from Bloom Stories that I did not recognize... their name didn't come up as 'Bloom'... They blamed me for their lack of transparency."* — Bloom Stories, App Store

**C8. Embarrassment / leakage into the rest of the user's life.** The exact failure mode named in the brief, and it is real.
> *"even when the app is fully closed on my phone, it will still auto connect and start playing in my car and with my AirPods. This is not a problem that occurs with Spotify or Libby audiobooks when those apps are closed, so it is specific to this app. Unfortunately if I can't find a way to prevent that from occurring, I'll have to cancel my subscription :("* — Quinn, App Store
> *"if you're anything like me and still living on your parents' AppleID, those purchases can easily show up on your parents' subscription records (talk about awkward). So, I finally girlbossed and grew up: I created my very own AppleID"* — Her Campus on Quinn

**C9. Basic player-app incompetence.** Astonishingly common for a category whose entire product is an audio player.
> *"when I added stories and sleep sounds to my queue, they would play automatically. Now they just play the current one and I have to hit play to move to the next... That defeats the purpose of why I'm using Dipsea. I'm going to have to discontinue use and cancel my subscription."* — Dipsea
> *"Love the content but developers absolutely must install a sleep timer please!!"* — Quinn
> *"I don't like that it won't automatically play the next chapter. After every one you have to go to the app and tell it what you think of the chapter or decline to then manually go to the next chapter."* — Bloom Stories
> *"there's no way to listen to them in a continuous way. Basically if a topic covers 7 sessions of 2 minutes, every 2 minutes I have to turn on the phone and manually start playing the next session."* — Emjoy
> *"a search box and/or a way to bookmark, favorite, or make a playlist... As it is now, I have to spend a lot of time trying to find something again that caught my interest."* — Emjoy
> *"The app crashes at least twice when I open it, without fail... In order for me to use the app I then have to uninstall then reinstall the app."* — Bloom Stories, Google Play
> *"I can't find a way to remove stories from the queue... little mechanical things like that kinda spoil the mood."* — Dipsea

**C10. Inauthentic representation, especially tagged-but-fake ethnic voice casting.** Directly relevant to synthetic voices.
> *"as a Black person, I'm doubtful the narrators of most of the stories tagged as 'Black Voices' are actually black voices. The cadence doesn't match, the culture doesn't match, the language isn't ours...it's just OFF... The story called Deep Tissue is tagged as Black Voices, but that's a blatant Nope."* — Dipsea, App Store
> *"As a black women who has been on the app for I wanna say three years... you don't highlight your black creators as much... you made a new tag which is labeled POC I was offended"* — Quinn, App Store
> *"what it's really missing is something for plus size/fat babes and dudes... If they did Dipsea would be five stars and worth all the money."* — Dipsea, App Store
> *"there aren't enough of them, especially for queer people. The trans and nonbinary section must be an actual joke."* — Emjoy, App Store

**C11. Kink drift — the catalogue moving toward content the core user doesn't want.** A churn cause nobody talks about.
> *"Not to yuck anyone's yum, but the Daddy moniker and degradation are inescapable now. It's hard to find audios that don't give me the ick. It was a good couple years, but I don't think I'll be renewing."* — Quinn, App Store

**C12. Discovery/filtering is unreliable.**
> *"Since the labels on the stories appear to be arbitrary, it's a roll of the dice even when you use the filters."* — Emjoy
> *"The FAQ are mostly about how much it costs and how to pay not how to use Dipsea."* — Dipsea

### 3.2 Top recurring PRAISES (what earns the money)

**P1. Trauma-informed self-reconnection. The most emotionally intense praise in the entire corpus, and clearly the highest-value use case.**
> *"Being queer, coming from the church, and experiencing sexual abuse lead to a very very disconnected and traumatized relationship with my body. I have never been able to touch myself without having a panic attack unless there is some distraction. Dipsea has guided me home... Though you can get off quick here if you want, it's not designed for that. It's designed for deep connection with yourself and your desires. It's totally opposite of the porn industry."*

**P2. Clinical/medication-adjacent low libido.**
> *"As someone on antidepressants and finding that a lot of visual erotica is male dominant and less on female pleasure, this app has helped me reconnect with myself."*
Ferly, Emjoy, Kama and (formerly) Rosy all sell into this. Rosy's founder framed it as *"nearly 50% of women were struggling with a sexual health complaint, but there was almost no help for them."*

**P3. "Room for imagination" — the core format advantage, repeated everywhere.**
> *"the auditory visuals are so well done—there's room for imagination still but a lot of wonderful guidance."*
> Spiegel: *"it's the things you don't see — the mystery, the kind of tension and slow burn of a story — that [are] the most appealing and erotic... sometimes actually visual depictions of sex can detract from the overall appeal, which is counterintuitive."*

**P4. Responsive desire / partnered priming — a distinct, non-obvious job-to-be-done.**
> *"the best way for me to use it when all is well and I anticipate that we will likely be having sex that night as a means to 'prime my engine' so it doesn't take nearly as much time to reach climax with my husband."*

**P5. Second-person POV and "made for me."**
> *"especially the Him/Her + You ones that put you in the second person! AMAZING!"*
> *"When I go back to other mediums I miss the feeling like they were made for me and not just using female bodies."*
> *"I've never felt my sexuality respected to and catered to before and it's so beautiful and relieving."*

**P6. Slow burn, yearning, and permission to explore taboo-but-safe fantasy.** Quinn's most popular 2025 category was **"yearning."** Its top-performing emotional categories are *"aftercare," "apology," "body worship," "praise"* — emotional-connection tags, not act tags. A Substack writer on why she pays: audio erotica lets her explore infidelity fantasies that mainstream romance sanitises, *"the safest way to handle some wedding day nerves."*

**P7. Sleep and dual-use.**
> *"I was looking for a sleep and meditation app to help me wind down and fall asleep... I never expected it to be as good as it was. The stories are steamy and quick. They provide fantasy for me. They help me sleep."*
> On character sleep content: *"I decided to listen to my favorite complete a chore for 45 minutes. I hit play; he said some sweet things; and the next thing I knew, it was morning."*

**P8. Production quality as the justification for price.** The satisfied cohort explicitly reasons about craft: *"Think of all the work that goes into these productions."* This is exactly the reasoning that AI narration attacks — see §5.

### 3.3 The pattern to take away

Complaints cluster into **supply volume/variety, script craft (especially pacing), and app competence**. Praise clusters into **safety, imagination, personalisation-feel, and craft**. Generative AI is strong on the first cluster and structurally weak on "craft" — which is precisely the thing the paying cohort cites when justifying the price. That tension is the central strategic problem of this product.

---

## 4. Market size, growth, and demographics

### 4.1 Be honest: there is no credible TAM for audio erotica

The market reports that surface for "sexual wellness" measure physical goods and are **not** a usable TAM:

- Research and Markets (Feb 2026): sexual wellness market **$51.17B (2025) → $55.66B (2026) → $75.17B (2030)**, CAGR 8.8% historic / 7.8% forecast. Segments driving it: supplements, condoms, contraceptives, wearables, STD prevalence. `[VERIFIED — but wrong denominator for us]`
- Business Research Insights: **$84.35B (2026) → $158.71B (2035)**, CAGR 7.28%. Segments listed: "Sex Toys/Vibrators, Condoms and Female Contraceptives, Personal Lubricants, Erotic Lingerie, Pregnancy Testing Products." `[VERIFIED — same problem]`

These two "authoritative" 2026 estimates of the same market differ by **51%** ($55.7B vs $84.4B), which tells you what the methodology is worth. **Do not put either number in a deck as our TAM.**

The most honest available sizing is a founder's guess. Caroline Spiegel told the Washington Post that erotic storytelling *"could be worth several billion dollars"* across romance books, audio erotica, self-published smut and audiobooks combined, while acknowledging *"It's hard to estimate just how much the erotic storytelling industry is worth because it encapsulates so many different forms."* `[VERIFIED as a quote; it is an estimate, not research]`

**A defensible bottom-up floor for the addressable subscription market**, built only from figures I verified: Quinn $12M+ ARR + Dipsea $4.14M ARR + femtasy ~€9M revenue ≈ **$28–30M** across the three leaders. Add the long tail (Bloom, Emjoy, Kama, Ferly, hearr, Whisper, dozens of micro-apps) and the standalone audio-erotica app category is plausibly **$40–80M/yr globally today**. That is a real business but a small pond, and it explains the acquisitions and shutdowns.

### 4.2 Growth signals that are real

- **Spicy audiobooks on Spotify** (first-party platform data, the best-quality growth datapoint available): a 2024 promotional campaign generated **100M+ impressions across 14M users** and triggered a **65x spike in spicy listening vs the monthly average.** Spotify's read: "revealing how substantial the addressable market for spicy content really is." `[VERIFIED]`
- **Quinn**: ~$4M revenue and 740,000 monthly sessions after its first year on the App Store (2022) → **$12M+ ARR** now; 24M listening minutes/month as of mid-2024; celebrity Originals moving from ~15 total to a target of **one per month**. `[VERIFIED]`
- **Cultural tailwind is genuine and specific**: the NYT-dubbed "smut renaissance"; *Heated Rivalry* (2025 TV adaptation of Rachel Reid's hockey romance) driving audio erotica interest; Rebecca Yarros's *Onyx Storm* as the fastest-selling adult novel in 20 years; BookTok/romantasy. Academic legitimation too — Dr Jodi McAlister (Deakin) and Dr Athena Bellas have published the first book-length academic study of contemporary audio erotica. `[VERIFIED]`
- **Counter-signal**: Dipsea is shrinking and Rosy died during this same "boom." Category tailwind ≠ per-app tailwind. The growth is accruing to **Quinn, Spotify/Audible, and free Reddit**, not evenly.

### 4.3 Demographics — the most reliable numbers in this document

**Spotify's first-party spicy-audiobook data** `[VERIFIED]`:
| Metric | Spicy audiobooks | Regular romance |
|---|---|---|
| Female listenership | **80%** | 91% |
| Male listenership | **15%** | 9% |
| Share aged 35–44 | **43%** | 23% |
| Top markets | US & UK; >50% of listeners in both choose **5-pepper** titles | — |

**Quinn's disclosed demographics** — note these have shifted over time, which matters:
| Source & date | Female share | Age |
|---|---|---|
| Business Insider, Jun 2024 | 77% | **56% aged 18–24** |
| NBC News, 2026 | "more than three-quarters" | skews 18–44 |
| Washington Post, 2026 | "nearly 80%" | **60% aged 18–34** |
| Variety, 2026 | — | **41.6% aged 25–34**; 25.6% aged 35–44; ~20% aged 18–24 `[reported]` |
| AOL/Fast Company | **80%+ / "more than three-quarters"** | — |

**Read this carefully:** Quinn's audience appears to have **aged from a 56%-Gen-Z base in 2024 to a 25–34-centred base in 2026**. Meanwhile Spotify's spicy-audiobook cohort centres on **35–44**. If we index our creative and pricing on TikTok-native 18–24 users, we may be targeting the cohort with the least willingness to pay (*"I don't have enough money to afford this"*) and chasing an audience that the leader has already aged out of.

**Other demographic datapoints** `[SINGLE-SOURCE / secondary]`: femtasy recorded 5.4M listens in 2022 with **82% female listeners**, against Pornhub's ~36% female visitors; romance novel readership ~82% female with an average reader age of 35–39. Dipsea's own marketing claims 85% of listeners feel more emotionally connected to themselves, 73% feel more confident exploring desires, 70% report improved sexual confidence, 65% say it helped them communicate wants in bed — all `[VENDOR CLAIM]`, unaudited, but useful as evidence of how the category *positions* outcomes.

---

## 5. How the market feels about AI-generated voices in erotic audio

**Verdict: hostile-to-skeptical among the paying core and the creator supply base; tolerated only when it buys personalisation that humans cannot provide.** This is the best-evidenced section here and it should be treated as a hard constraint, not a marketing challenge.

### 5.1 The decisive datapoint: Dipsea's public reversal

Dipsea's own blog (updated 29 June 2026) and Substack post (15 July 2026), corroborated by trade coverage 2 Aug 2026. `[VERIFIED — primary source]`

What Dipsea actually did, in its own words:
- **Audio:** "less than 3% of 1,200+ original stories" used AI voice simulation, "created in partnership with our actors. Actors decided how their voice would be used and were compensated with an upfront fee to create a virtual version of their voice and an ongoing monthly retainer for continued licensed use. Creating a virtual voice did not replace in-person recording... All AI-voiced content was clearly labeled with a **'Virtual Voice' tag** in the app."
- **Art:** "204 pieces of art out of 1,200+ were made with AI."
- **Scripts:** "Our stories have never been written by or with AI." (Note: they drew the line at scripts from the start.)
- **The reversal:** six months of work, all AI voice content re-recorded with human actors, all 204 illustrations re-commissioned, deadline of a "100% AI-free library by the end of June."

Why, in their words:
> *"It's those very tiny, human details that make our stories feel magically alive. It's the extra turn of phrase a writer adds in at the last minute, or the hitch in a voice actor's breath midway through a recording, that always seems to elevate a story from hot into something truly erotic. So we felt that when it came to those AI-assisted stories, there was something missing."*
> *"We also believe great creative work deserves fair pay... Using AI to replace creative labor doesn't align with that ethos."*
> Olivia Taylor, Editorial Lead: *"In many ways, AI art and voices are the opposite of personal, it's an amalgamation of many sources. It's also pretty bad at getting the details right, which is something we care about a lot. We spend a lot of time thinking about where to add in a little casual laugh or sigh."*
> Kara, Senior Audio Producer, on cost: *"Yes, we've allocated the financial resources, but in many ways, that's the easiest part... There are only two of us on the creative team who write & produce all of the content on our app."*

Three things to extract:
1. **Their AI programme was more ethical than anything we are likely to ship**, and they still killed it. The objection was not "you cloned people without consent." It was "the output is missing something and the practice is off-brand."
2. **The re-recording effort was affordable but operationally brutal** for a 2-person creative team. Reversal is expensive.
3. **Trade coverage framed the reversal as a marketing win**: "The AI U-turn has ended up being a mild publicity win for Dipsea, helping position it as an exclusively human-led audio company amid a sea of AI slop." Expect "100% human" to become an actively marketed competitive claim against us.

### 5.2 Creator supply is organising against AI, with license terms in the posts

From live r/gonewildaudible posts (Aug 2026), creators append AI clauses to every upload. Verbatim: `[VERIFIED]`
> *"As always, all my files are intended for listeners 18+ only, are protected by copyright, and are **not to be used for any kind of AI training**."*
> *"I do not give permission for my content to be used in AI, reposted, reuploaded, clipped or shared anywhere without my explicit consent."*

- **r/GoneWildAudio bans AI voice posts outright** to protect creators. `[SINGLE-SOURCE, secondary]`
- **r/gonewildaiaudio** — the AI-friendly alternative — was created around **27 June 2026** and is tiny. Its welcome post has **2 upvotes**; AI-generated audio posts from its most active poster sit at **0 upvotes** after a day. Whatever demand exists, it is not showing up as engagement. `[VERIFIED]`
- Within weeks of founding, that subreddit hit a governance crisis: the mod removed an AI audio because writer u/Mrs-Keats *"contacted me directly and made it clear that she does not allow AI use related to her work,"* then opened a rules consultation whose first principle was *"creator consent has to come first."* The community now uses explicit script labels — **"Human Only"** vs open-to-AI-use — and requires per-post AI disclosure. `[VERIFIED]`
- Even AI-friendly posters pre-emptively disclaim cloning: *"AI disclosure: AI tools were used to create the adult female voice and audio production. **No real person's voice was cloned or intentionally imitated.**"* `[VERIFIED]`

**Implication:** the script/scenario corpus this genre runs on is being explicitly licensed *against* AI use. Sourcing training or prompt material from GWA scripts is both an ethical and a legal exposure, and doing it visibly would make us the villain of a 1.9M+ member community that is also our best organic marketing channel.

### 5.3 Do listeners detect it? Does it break arousal?

Practitioner testimony is specific about *where* TTS fails, and it is the erotic-critical parts:
- Voice actor Ethan Gray moved into erotica precisely because he judged it AI-resistant: *"he quickly realized that AI struggles to perform audio erotica. **It can't moan well**, and it often messes up the background noises these stories incorporate."* `[VERIFIED]`
- Creator NeonDextrose: *"In terms of giving a heartfelt performance and delivering emotion in a way that is so intimate and so personal, **AI could never**."* `[VERIFIED]`
- Quinn's production process is built around the exact features TTS lacks: binaural capture, *"There's breath work; there's vocal range. When you find someone really attractive, the voice sits in a different place in your body."* `[VERIFIED]`
- Dipsea's editorial lead on the same axis: the deliberate placement of *"a little casual laugh or sigh."* `[VERIFIED]`

From the AI-companion adjacent market, the recurring failure taxonomy (`[SINGLE-SOURCE]`, from AI-companion review sites of mixed quality, but internally consistent and consistent with the practitioner testimony above): **unnatural breath patterns; over-smooth delivery** ("real people stumble slightly. Perfect delivery sounds fake"); **mismatched emotion timing**; and **narrative contamination**, where stage directions like *"she whispers softly"* or asterisk actions get read aloud — flagged for Candy AI and Kindroid. Also reported: voices drifting between turns so a character doesn't sound like themselves, and the chat "rushing intimacy" — *"The AI gets spicy fast... I wanted more slow build."* That last one is a direct hit on the category's most-praised quality (P6: slow burn, yearning).

Honest counter-evidence: reviewers of Replika Pro call its prosody *"the most natural in the category,"* and Kindroid's V3 voices reportedly do *"breathing, laughing."* Quality is clearly improving. But the same sources say Replika's TTS is *"like a GPS reading lines"* and that most paying subscribers *"end up reverting to text within a month of upgrading."* **Voice is what converts them to paid, and voice is what disappoints them.** For our purposes, the 12-month picture is worse: RevenueCat's 2026 data shows AI apps sustain a **41% Year-1 LTV premium ($30.16 vs $21.37 median)** but **retain 36% worse over 12 months**. AI sells; AI does not stick. `[VERIFIED]`

### 5.4 Apps already shipping AI in this category, and how they land

| App | AI use | Reception |
|---|---|---|
| **Bloom Stories** (Bloom Chat) | Text + character voice-note roleplay using characters' original voices, launched Sept 2023; free unlimited text, premium 15 voice msgs/mo | Not the main complaint driver — its reviews are about **cancellation and crashes**. Suggests AI chat is neither a hit nor a scandal; it's a bolt-on. |
| **Dipsea** | ElevenLabs voice cloning of own actors, labelled, <3% of library | **Removed entirely, June 2026.** Users who commented "praised the company for the move, with some saying they had noticed the AI artwork and disapproved of it." |
| **hearr.me** | 100% AI-generated, personalised, no catalogue | Marketed on **personalisation, not voice quality** — and priced per-audio (credits), not unlimited. Its own copy positions against Femtasy/Audiodesires on "someone else's fantasy." Traction unknown. |
| **Character.AI / Replika / Nomi / Candy AI / Kindroid** | Real-time voice companions | Large but troubled. Character.AI voice reportedly dropping mid-call since ~April 2026; a paying-user complaint thread reads *"cancel your subscription. paying these guys anymore money is diabolical"* — though note that thread's actual grievance is **content filtering on an age-verified 18+ paid app**, not voice: *"What gets me is this is an 18+ app. The app does the verification to make sure each user is 18+. So…I guess I'm just confused on why mature scenes aren't allowed?"* |
| **Whisper Stories** | "Personalised" stories, claims **"real human voices"** | Note the claim itself: even a tiny opaque app markets *human* voices as the feature. |

Scale context for the AI-companion comparison `[SINGLE-SOURCE, treat as rough]`: Replika ~40M cumulative users / ~$14M ARR; Character.AI ~20M MAU / ~$32M revenue; Nomi ~8M registered / ~$80M run-rate. Even at the top, these are not enormous revenue businesses relative to their user counts — and their conversion engine (voice) is their weakest feature.

### 5.5 The three lessons for us

1. **"Human" is becoming an actively marketed premium claim.** We will be competing against explicit anti-AI positioning. We need an answer that is not defensive.
2. **The defensible use of generative AI here is personalisation and volume, not impersonation of craft.** Nobody credibly claims AI out-performs a good voice actor. Several credible people claim AI does things a catalogue cannot: your fantasy, your names, your pacing, your limits, generated now. Sell that.
3. **A hybrid is available and mostly unexplored: AI scripts + AI *structure*, human voice.** Dipsea drew its line at scripts (never AI) and crossed it at voices. The opposite line — human/licensed voice talent, generatively assembled and personalised scripts, with per-performance revenue share — is the strategy nobody in this table has run. It preserves the "hitch in the breath" the paying cohort pays for while still giving us infinite variety. Cost and latency are the obvious problems; a hybrid model (pre-recorded human phrase/performance banks stitched per-user, TTS only for connective or naming material) is worth prototyping before we commit to full TTS.

---

## 6. What has failed or shut down, and why

| Company | Outcome | Why (evidence) |
|---|---|---|
| **Rosy** (Rosy Wellness) | **Shut down 20 Nov 2025** after 7 years | Clinician-founded (Dr Lyndsey Harper, OB-GYN), award-winning, thousands of hours of evidence-based content, trained hundreds of HCPs, ran clinical trials. Founder: "This was not an easy decision." Peer founders attributed it to the difficulty of sustaining women's health startups in the current **healthcare, funding, and advertising** landscape. A peer noted Rosy "survived years longer than Ruth Health (YC S21)" and that she'd have bet on Rosy to last a decade. **Lesson: clinical credibility and awards do not produce a viable consumer subscription business in this category.** `[VERIFIED]` |
| **Dipsea** | **Acquired Sept 2024**, all-cash, by RevenueCat — a subscription-infrastructure company that bought it as a live demo and testbed | Had raised $13.63M (PitchBook) / $15.1M (Tracxn) from Thrive, Bedrock and others. TechCrunch: "It's not likely RevenueCat blew the entirety of its Series C on the app, so this was **probably not a big win for Dipsea's investors**." RevenueCat bought out the whole cap table. **Lesson: ~$6M ARR and profitability was the ceiling on $14M+ raised — an infrastructure-vendor soft landing, not a venture outcome.** `[VERIFIED]` |
| **Emjoy** | **Zombie / acqui-parked.** Now owned by CleverDeal ApS, developer name **Bedbible.com**; no release since Oct 2024 | Raised $4.11M from Nauta Capital and JME; last round Sept 2020; headcount reported at 10 by Apr 2026. Content library now sits under an affiliate/review operator. `[VERIFIED]` |
| **Ferly** | Dormant | Play Store build not updated since Aug 2024 with unresolved crash-on-play reports; developer replies acknowledge "certain android models are experiencing technical issues." A user: *"I'm not even sure if it's a going concern anymore."* `[VERIFIED]` |
| **Tingles** (original) | **Dead** | YC-backed dedicated ASMR platform (Slovenia, 2017–18); 60K MAU, 200+ ASMRtists poached from YouTube. Killed by **platform dependency** — creators wouldn't leave YouTube's audience and monetisation. ~$1.5M burned. `[SINGLE-SOURCE for the burn figure; the disappearance itself is evident]` |
| **The 2020 femtech cohort** | Mostly gone | Emjoy's own App Store copy name-checks "coral, blueheart, ferly, ohcleo, rosy, yuu, eros, &jane" as peers. Most are now dead, dormant, or unfindable. **Lesson: this is the second graveyard in this category, not the first.** `[VERIFIED]` |
| **Adult content on Steam / itch.io** | **Mass delisting, July 2025** | itch.io "deindexed" all NSFW-tagged content with no notice; 20,000+ works affected; Steam removed titles and added a rule against material that "may violate the rules and standards set forth by Steam's payment processors." Trigger: a **Collective Shout** campaign pressuring Visa/Mastercard/PayPal. itch.io: *"The situation developed rapidly, and we had to act urgently to protect the platform's core payment infrastructure."* Mastercard denied involvement in Aug 2025. `[VERIFIED]` |
| **Ongoing creator debanking** | Continuous | Stripe to itch.io: *"Stripe is currently unable to support sexually explicit content due to restrictions placed on them by their banking partners, despite card networks generally supporting adult content."* Stripe's prohibited list covers "pornography and other mature audience content (including literature, imagery, and other media) designed for the purpose of sexual gratification." A platform founder: *"Stripe takes only 2.9 percent... while high-risk processors willing to take on adult content can charge up to 15 percent."* Mitigating trend: an Aug 2025 executive order directing regulators to investigate politically motivated debanking, and regulators removing "reputational risk" from compliance criteria. `[VERIFIED]` |

**I found no evidence of a major audio-erotica app being removed from the App Store or deplatformed by a processor.** The incumbents' survival strategy is visible and consistent: sit at the 18+ ceiling in-app, keep the explicit tail on the web, and (in Bloom's case) take payment off-platform entirely.

---

## 7. Pricing and retention benchmarks

### 7.1 Observed price points (all verified from store pages or company pricing pages, Aug 2026)

| Player | Monthly | Annual | Other |
|---|---|---|---|
| Quinn | $7.99 | $59.99 | Tips: Roses $2.99 / $29.99 / $69.99. Historically $4.99/mo, $47.99/yr — **Quinn has raised prices** |
| Dipsea | $12.99 | $69.99 | Legacy/test SKUs live simultaneously: $59.99, $47.99, $34.99, $25.99 quarterly, $8.99, **$6.99 three-day**, **$399.99 lifetime** |
| Bloom Stories | ~$10.95 effective on annual | ~$131.40 | Quarterly; permanent 66%-off annual promo code (`BLOOMSECRET`) |
| Audiodesires (same co.) | $29.99 | $131.40 | — |
| Emjoy | $10.99 | $99.99 | One-time $59.99 / $79.99; quarterly |
| Kama | $12.99 | $69.99 | 7-day trial |
| Ferly | ~$9.99 | — | 7-day trial |
| femtasy | ~€12.99 | **€99.99** | **30-day free trial** |
| hearr.me | €12.99 (10 audios) | — | **€4.99 single audio**; €29.95/mo (30 audios) |
| Whisper Stories | — | — | $39.99 / $74.99 / $119.99 IAP |

**Reading the pricing:**
- The market has converged on **~$8–13/month and ~$60–100/year**, i.e. audiobook-adjacent, not porn-adjacent.
- **Dipsea's SKU sprawl is diagnostic.** Nine-plus live price points including a 3-day pass, a lifetime tier, and multiple annual prices is a signature of aggressive paywall experimentation — consistent with RevenueCat using it as a testbed, and with an app fighting decline.
- **The permanent-discount trap:** Bloom's "evergreen" 66%-off annual code means its real annual price is ~$45, not $131.40. Anchoring high and discounting permanently is a category norm to avoid.
- **hearr.me's credit model is the only per-unit pricing in the category** and is the honest structure for generative content, where marginal cost is non-zero.
- **Tipping/gifting is proven revenue.** Quinn's Roses go up to $69.99 a pack, on top of subscription.
- **Femtasy's 30-day trial is a strategic outlier** and aligns with the strongest conversion evidence available (below). Everyone else runs 7 days.

### 7.2 Category-specific retention data: Dipsea's public dashboard

Because RevenueCat runs Dipsea as a public demo environment, we have real subscription metrics for a direct competitor. This is the single most valuable benchmark asset in the space. `[VERIFIED via RevenueCat-sourced dashboard, 10 Aug 2026]`

| Metric | Value |
|---|---|
| MRR | **$345.2K** |
| ARR | $4.143M |
| Revenue (28d) | $287.9K |
| Active subscriptions | **65,592** |
| Active trials | **2,607** |
| Active customers | 60,302 |
| New customers (28d) | 18,849 |
| **Paid subscriber share** | **96.2%** (→ effectively a hard paywall) |
| ARPU / ARPPU | $4.77 / $5.26 |
| ARPAS (avg revenue per active sub) | $4.22 |
| **LTV** | **$158** |
| MRR growth (28d) | **−1.3%** |
| Subscriber growth (28d) | **−0.9%** |
| Ratings | 9.6K App Store (US 4.7 / 7.5K) + 1.9K Play (**2.9**); Android downloads 500K+ |

**Trajectory:** Sept 2024 (at acquisition) → Aug 2026: **93,847 → 65,592 paying subscribers (−30%)**; **~$6M → $4.14M ARR (−31%)**; **$505,920 → $287,900 monthly revenue**. RevenueCat's VP of Marketing joked at acquisition: *"if you check a year from now and it's 50,000 subscribers, we f***** up, right? Something went horribly wrong."* Two years on they are two-thirds of the way to that number.

**Derived benchmarks worth internalising:**
- **ARPPU ~$5.26/mo** despite $12.99 monthly list — annual plans and heavy discounting dominate the mix. Model on ~$5/paying-sub/month, not list price.
- **LTV $158** at ARPPU $5.26 implies roughly **30 months** of expected paying life. That's a genuinely sticky product when it works — and it sets our CAC ceiling.
- **2,607 active trials against 65,592 subscribers** is a thin top of funnel. Combined with 28-day negative growth, the problem is **acquisition, not retention.** Note also 18,849 new customers in 28 days converting into a shrinking subscriber base — the funnel leaks badly at the paywall.
- **The 4.7-vs-2.9 iOS/Android rating split** is a caution about Android: RevenueCat's own data says **31% of Google Play cancellations are involuntary billing failures vs 14% on the App Store.**

### 7.3 Industry benchmarks (RevenueCat *State of Subscription Apps 2026*, 115,000+ apps, $16B+ revenue)

All `[VERIFIED]`. These are the numbers to plan against.

| Benchmark | Value |
|---|---|
| **Hard paywall D35 trial→paid** | **10.7% median** (down from 12.1% in 2025) |
| **Freemium D35 trial→paid** | **2.1%** (flat since 2025) |
| Revenue per install at D60 | **$3.09 hard paywall vs $0.38 freemium (8x)** |
| 12-month yearly-subscriber retention | 27% hard paywall vs 28% freemium — **negligible difference** |
| 3-day trial cancellations on **Day 0** | **55.4%** (84% by Day 1) |
| Trial→paid, **17–32 day** trials | **42.5%** |
| Trial→paid, **<4 day** trials | **25.5%** |
| Share of apps using <4-day trials | 46.5% (rising, *against* the data) |
| **Annual cancellations occurring in Month 1** | **35%** |
| **Annual subscribers cancelling within Year 1** | **~72% in 2026** (worsened from ~56% in 2025) |
| Google Play involuntary billing-failure churn | **31%** (App Store: 14%) |
| Recoverable revenue from good dunning/grace periods | **15–20%** |
| **AI apps: Year-1 realized LTV premium** | **+41%** ($30.16 vs $21.37 median) |
| **AI apps: 12-month retention** | **36% worse** than non-AI |
| Growth polarisation | Top quartile **+80% MRR YoY**; bottom quartile **−33%** |
| New apps entering stores | 14,000+/month |

**The three that should directly shape our plan:**
1. **Hard paywall + long trial.** The 5x conversion advantage of a hard paywall with no retention penalty, combined with 17–32-day trials converting 70% better than 3-day ones, points to: hard paywall, ~14–30 day trial, and an onboarding that must land in the **first session** (55% of short-trial cancels happen on Day 0). Femtasy's 30-day trial looks less like generosity and more like the correct read of the data.
2. **The annual-renewal cliff is brutal and getting worse.** 72% of annual subscribers cancel within Year 1 and 35% of those cancellations happen in Month 1. Dipsea's LTV of $158 is the *good* outcome. Win-back and value reinforcement must start in Week 1, not Month 11.
3. **We are, by RevenueCat's classification, an AI app.** That means we should expect the +41% LTV premium *and* the 36% retention penalty. Our product plan needs an explicit answer to "why won't this churn like every other AI app?" — and the honest answer has to be something other than "our AI is better."

---

## 8. Platform, policy, and legal constraints specific to an iOS build

These are not footnotes; they are design inputs.

- **Apple Guideline 1.1.4** bans "Overtly sexual or pornographic material, defined as 'explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings.'" `[VERIFIED]`
- **Apple's age-rating reference** is the operative ceiling: **18+** permits "Frequent sexual content or nudity"; the tier above — **"Graphic Sexual Content and Nudity"** ("explicit, detailed depictions of sexual activity... realistic, illustrative, or pornographic portrayals of sex") — describes content that **"can't be published on the App Store. It may be published on alternative app marketplaces or websites."** Quinn and Dipsea both ship at 18+ with "Frequent... Sexual Content or Nudity." `[VERIFIED]`
- **Guidelines 1.2.1(a) and 4.7.5** require creator/UGC apps to "provide a way for users to identify content that exceeds the app's age rating, and use an age restriction mechanism based on verified or declared age." If we ever accept user-submitted fantasies or prompts, we inherit full UGC moderation obligations under Guideline 1.2. **Note: our generative core makes every session functionally user-generated content.** This is a bigger review-risk surface than a fixed catalogue. `[VERIFIED]`
- **Quinn's App Store listing already shows the new machinery**: "In-App Controls," "Age Assurance," and developer-managed content restrictions. This is the pattern to copy. `[VERIFIED]`
- **Texas App Store Accountability Act (SB 2420)** took effect **4 June 2026** after the 5th Circuit lifted a December 2025 injunction; **the Supreme Court declined to block it**. App stores must verify age into four categories (child / younger teenager / older teenager / adult); minors need parent-linked accounts and per-download consent; parents can **revoke consent and remotely remove an app**. Developers must consume Apple's **Declared Age Range API** and **Significant Change API**. A full 5th Circuit hearing was expedited to August 2026, so the law may still change. Utah has similar rules and more states are advancing them. `[VERIFIED]`
- **ElevenLabs' policies** (the vendor Dipsea used) are more permissive on TTS than commonly assumed but contain traps. The Prohibited Use Policy targets **CSAM/minors, non-consensual intimate content, and unauthorised impersonation "including via unauthorized sexualization"** — not adult content per se. However: the **Music Terms explicitly bar customers who operate in "adult entertainment or pornographic content"** from using Music, and the **Image & Video Terms bar generating "sexually explicit... content."** So: TTS is arguably usable for consenting-adult fiction, generated *music and imagery* are not, and our sector classification could be used to cut us off. **Get this in writing under an enterprise agreement before building on it, and design for provider substitution.** `[VERIFIED]`
- **Payment architecture:** given Stripe's explicit prohibition (§6) and the July 2025 Steam/itch.io precedent, plan for Apple IAP as the primary rail for the in-app 18+ experience, plus a **redundant high-risk processor** (at up to 15% vs 2.9%) for any web tier, and never a single point of failure.

---

## 9. Unmet needs and whitespace, ranked by defensibility

Ranked by how hard each would be for Quinn, Dipsea, femtasy or a fast follower to copy. "Defensible" here means it requires either a structural asset, sustained operational commitment, or a capability the incumbents have publicly rejected.

### Tier A — genuinely defensible

**1. True per-listener personalisation as the product, not a feature.** Highest defensibility, because **the incumbents structurally cannot follow.** Quinn's asset is ~100 human creators and celebrity deals; Dipsea's is a 2-person creative team and a curated catalogue. Neither can generate a story with your names, your pacing, your specific limits, and your chosen voice, on demand — and Dipsea has now publicly committed to *not* doing so. This directly answers C1 (runs out of content) and C11 (kink drift: your catalogue never drifts if it's generated for you). Only hearr.me occupies this ground today, in German/English, web-only, sub-scale, priced in credits. **This is the thesis. Everything else should support it.**

**2. A pacing and arousal-arc engine that actually models female arousal.** The most specific, most repeated craft complaint in the category is that scripts get *timing* wrong — *"the guy didn't finish in 30 seconds"*, *"this is not nearly enough time for a woman"*, *"uncreative... with female pleasure"*, and from the AI-companion world, *"the AI gets spicy fast... I wanted more slow build."* Meanwhile the most-praised qualities are **slow burn** and **yearning** (Quinn's top 2025 category). A generative system with explicit, user-controllable arc parameters — build duration, plateau, denial/edging structure, aftercare length — is a real, testable engineering advantage, and it is the one place where "programmable" beats "performed." Defensible because it requires genuine domain research (sex therapists, responsive-desire literature) plus evaluation infrastructure, not a prompt.

**3. Discretion as an engineered subsystem.** No competitor has assembled this deliberately, and the complaints are explicit (C8). Concretely: suppress CarPlay/AirPlay auto-resume and Bluetooth auto-connect; no titles or artwork on lock screen or Now Playing; neutral billing descriptor; alternate app icon and name; Face ID lock; no push notifications by default; a documented Screen Time/usage footprint; instant panic-stop. Defensible because it is a long tail of unglamorous platform work that a content-first competitor will not prioritise — and it is a genuine, statable reason to switch.

**4. Aftercare, trauma-informed, and clinically-adjacent design — done as product, not as content.** The single most emotionally intense praise in the corpus is about panic-attack-free self-reconnection and being "guided home." Quinn's top emotional tags are *aftercare, apology, body worship, praise*. But every player that led with clinical positioning **died or stalled** (Rosy dead, Ferly dormant, Emjoy parked). The whitespace is therefore not "a clinical app" — it's an entertainment-first app with **trauma-informed mechanics** built in: pre-session content warnings with granular opt-outs, an always-available soft exit, guaranteed aftercare tails, no-degradation and no-"Daddy" hard filters (C11), and gradual-exposure pathways. Defensible because it requires expertise plus the discipline not to market it as healthcare.

### Tier B — strong, moderately defensible

**5. Voice-and-body diversity that is actually authentic, verified, and filterable.** The Dipsea "Black Voices" review (*"the cadence doesn't match, the culture doesn't match, the language isn't ours...it's just OFF"*), the Quinn "POC tag" complaint, the missing plus-size content, and the "trans and nonbinary section must be an actual joke" complaint are all the same failure: tags that promise representation the audio doesn't deliver. **Important caveat for us:** this is the sharpest possible risk area for synthetic voices — a generated "Black voice" that gets cadence wrong is a worse version of the exact thing users already reject, and would be indefensible. The opportunity is authentic sourcing (paid creators from the communities represented, verified, credited) with hard filters — which means it likely *cannot* be a TTS feature. Moderately defensible: copyable, but only by someone willing to do the casting work.

**6. Best-in-class audio player fundamentals.** Autoplay/continuous playback, sleep timer, queue management, offline downloads, search, favourites, playlists, cross-device continuity, CarPlay done right, no crashes. This is table stakes that nobody in the category has cleared (C9) — Dipsea broke its own autoplay and lost subscribers over it, Quinn has no sleep timer, Bloom crashes twice per launch, Emjoy has no search. Low defensibility in principle, high in practice, because two years of evidence says these teams don't fix it. Cheap to build, immediately reviewable, and it converts C9 complainers into switchers.

**7. The calm/focus surface as a genuine daily-habit product.** Erotic audio is episodic; sleep and focus are nightly. Users already arrive for sleep and stay for erotica (P7), and every competitor bundles this half-heartedly. Building focus/calm to a standard that competes with Calm/Headspace-tier expectations gives us daily active use, a Health-adjacent App Store position, an age-rating shield, and a discreet home-screen presence. Moderately defensible: obvious, but it doubles the content surface and competitors have shown no appetite.

**8. Honest, transparent AI positioning with creator consent and revenue share designed in from day one.** Since "100% human" is becoming a marketed claim against us (§5.1) and creators are appending anti-AI licences to their work (§5.2), the counter-position is radical transparency: per-item AI disclosure, named and paid voice talent who opt in with upfront fees plus ongoing retainers and per-generation royalties, an explicit no-cloning-without-consent policy, and no training on scraped community scripts. Note this is essentially Dipsea's *abandoned* model — which means we can point to the most ethical prior art in the category and say we went further. Moderately defensible because it is a costly commitment, not a claim.

### Tier C — real needs, weakly defensible

**9. Male-perspective and male-voice supply, with a working filter.** Complaints exist on both sides: a straight male listener finds "a dozen or so stories" from his perspective not worth the price, and women want a restored male-voice-only filter. Spotify's data supports the demand (male spicy-audiobook listenership at **15%** vs 9% for regular romance, "a breaking down of traditional genre barriers"). Weakly defensible — pure catalogue/tagging work — but cheap and it addresses a segment the female-gaze incumbents deliberately underserve. Handle carefully: it must not dilute the primary "made for me" promise (P5), which is the category's core praise.

**10. A cheaper, lower-commitment entry rung.** Repeated, specific asks: watch-an-ad-to-unlock, a free trial where there is none, and price relief for younger users. Dipsea already sells a **$6.99 three-day pass** and a **$399.99 lifetime** tier; hearr sells **single audios at €4.99**. A per-story or day-pass rung fits generative unit economics and captures the *"I don't have enough money to afford this"* cohort. Weakly defensible (anyone can add a SKU) and in direct tension with the hard-paywall evidence in §7.3 — but worth testing as a *post*-paywall downsell, not as the front door. **Note the counter-evidence: satisfied subscribers explicitly say ads "would take you out of the mood."** Ad-supported audio erotica may be structurally incoherent.

### Deliberately not recommended

- **Competing with Quinn on celebrity or creator marketplace.** Their supply moat took five years, ~100 creators, and a 50% celebrity rejection rate. We cannot buy it and AI cannot fake it.
- **Leading with clinical/therapeutic positioning.** Rosy, Ferly and Emjoy ran that play with real credentials and institutional money. All three are gone or dormant.
- **Marketing AI voice quality as the headline benefit.** The evidence in §5 says this is the one claim the market is primed to reject, and the one that invites a "100% human" counter-attack.

---

## 10. Open questions and what I could not verify

- **Did AI content contribute to Dipsea's subscriber decline?** The timelines overlap (AI introduced ~3 years ago, removed June 2026, decline throughout) but **no source establishes causation**, and Dipsea itself frames the removal as values-driven, not metrics-driven. Do not assert a causal link.
- **hearr.me's traction is unknown.** No download, revenue or retention data found. It is the single most important competitor to diligence further — it is running our exact thesis. Worth buying a subscription and testing the output quality directly.
- **r/GoneWildAudio's AI ban is only secondary-sourced.** I could not fetch Reddit's rules pages directly (403). Verify before citing publicly.
- **r/GoneWildAudio member count is genuinely unclear** — 1.9M and 4M both appear on the same low-quality source.
- **Femtasy's numbers conflict**: "2 million women" on its own site vs 1M registered users / €9M revenue / 170M plays in German trade press (OMR). Both are vendor-derived and from different dates.
- **Quinn's absolute subscriber count is undisclosed** — only "hundreds of thousands" and "$12M+ ARR."
- **Dipsea's "new customers 18,849 (28d)"** conflicts with an earlier search snapshot showing 849. I used the figure from the page I fetched directly, but this metric should be re-checked before being used in a model.
- **No trial-conversion, churn or ARPU data specific to audio erotica** exists publicly beyond what Dipsea's dashboard implies. The §7.3 benchmarks are cross-category.
- **Unverified/immaterial as competitors:** Coral, Blueheart, Juicy, Frolic, Lust Stories, Silk, Craving ASMR, ohcleo, yuu, eros, &jane.
- **Not investigated in depth (recommended next):** Literotica's audio section specifically; Storytel's and Audible's erotica catalogue economics and terms for creators; Pocket FM and Kuku FM (the latter raised $50M in Oct 2025 and is listed as a Dipsea competitor — the Indian audio-serial model with microtransactions may be more instructive for our unit economics than any Western sexual-wellness app); Chinese/Japanese ASMR audio apps; TTS vendors other than ElevenLabs and their adult-content stances.

---

## Sources

**Company primary sources**
- Dipsea, "We No Longer Use AI At Dipsea, Here's Why" (updated 29 June 2026) — https://www.dipseastories.com/blog/why-we-no-longer-use-ai/
- Dipsea Substack (Aftercare), "We Removed All AI From Our Tech Platform" (15 July 2026) — https://dipseastories.substack.com/p/we-removed-all-ai-from-our-tech-platform
- Dipsea subscription pricing (Help Center) — http://support.dipseastories.com/en/articles/5433822-how-much-does-a-subscription-to-dipsea-cost
- Dipsea subscribe page — https://www.dipseastories.com/subscribe/
- RevenueCat, "We bought a spicy audiobook app" — https://www.revenuecat.com/blog/company/dipsea-acquisition-announcement
- Bloom Stories — https://www.bloomstories.com/ ; support https://www.bloomstories.com/support ; promo code https://www.bloomstories.com/promo-code ; terms https://bloomstories.org/terms
- Audiodesires — https://audiodesires.com/
- femtasy pricing — https://www.femtasy.com/en-gb/pricing ; US site https://www.femtasy.com/en-us
- Emjoy — https://letsemjoy.com/
- Ferly — https://weareferly.com/
- Kama membership — https://kama.co/membership ; https://kama.co/
- hearr.me (AI-generated personalised audio erotica) — https://www.hearr.me/en/for-women
- Sssh.com Soiree launch — https://luma.com/sssh-soiree-exclusive
- Aurore (feminist erotica magazine, not an app) — https://readaurore.com/
- Aporia (ML observability, acquired by Coralogix — not audio erotica) — https://aporia.com/

**App store listings (fetched 14 Aug 2026)**
- Dipsea (iOS) — https://apps.apple.com/us/app/dipsea-audio-stories/id1434242889
- Dipsea (Play) — https://play.google.com/store/apps/details?id=com.dipsea&hl=en_US
- Quinn (iOS) — https://apps.apple.com/us/app/quinn-audio-stories/id1565600312
- Bloom Stories (iOS) — https://apps.apple.com/us/app/bloom-stories-spicy-audio/id6455040628 ; reviews https://apps.apple.com/us/app/bloom-stories-spicy-audio/id6455040628?platform=iphone&see-all=reviews
- Bloom Stories (Play) — https://play.google.com/store/apps/details?id=com.quickugmbh.bloom&hl=en_US
- Emjoy (iOS) — https://apps.apple.com/us/app/emjoy-female-wellcare/id1467274919 ; reviews `...?platform=iphone&see-all=reviews`
- Emjoy (Play) — https://play.google.com/store/apps/details?id=com.letsemjoy.app&hl=en_GB
- Emjoy developer page (CleverDeal ApS ownership) — https://play.google.com/store/apps/dev?hl=en_US&id=7590789349389346569
- Ferly (Play) — https://play.google.com/store/apps/details?hl=en&id=com.leikaltd.leika
- Kama (iOS) — https://apps.apple.com/us/app/kama-sex-wellness-education/id1498761714
- Whisper Stories (iOS) — https://apps.apple.com/us/app/whisper-stories/id6755977657
- Tingles ASMR (unrelated successor app) — https://apps.apple.com/us/app/tingles-asmr-relax-sleep/id6504929645
- Tingles AI ASMR Video Maker — https://apps.apple.com/us/app/tingles-ai-asmr-video-maker/id6760895188

**Financials, funding, benchmarks**
- TechCrunch, "Subscription management platform RevenueCat acquires a 'spicy' audiobooks app" (26 Sept 2024) — https://techcrunch.com/2024/09/26/subscription-management-platform-revenuecat-acquires-a-spicy-audiobooks-app/
- whatsthe.app Dipsea live metrics (RevenueCat-verified, 10 Aug 2026) — https://www.whatsthe.app/dipsea
- RevenueCat, *State of Subscription Apps 2026* summary — https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
- RevenueCat overview metrics definitions — https://www.revenuecat.com/docs/dashboard-and-metrics/overview
- Fast Company, "Quinn is carving out a growing niche for audio erotica" — https://www.fastcompany.com/91279497/quinn-audio-erotica-r
- CB Insights, Dipsea — https://www.cbinsights.com/company/dipsea
- Tracxn, Dipsea — https://tracxn.com/d/companies/dipsea/__FUFV4ZN_8i4E4KSo6PrkDXpaQjdC2PO3znGMU-hf5Qg
- Tracxn, Emjoy — https://tracxn.com/d/companies/emjoy/__TuSlqdZ1uk1mKz81us7sD8p0Vy7CnSzYGTF1zx8SzL4
- Caplight, Emjoy — https://www.caplight.com/company/letsemjoy
- Preqin, Pink Internet GmbH (femtasy) — https://www.preqin.com/data/profile/asset/pink-internet-gmbh/364102
- OMR (German), femtasy marketing/revenue — https://omr.com/de/daily/femtasy-nina-julie-lepique-marketing-hacks
- Google for Startups, femtasy — https://startup.google.com/alumni/stories/femtasy/

**Press and market context**
- NBC News, "Your internet boyfriends are voicing audio erotica now" — https://www.nbcnews.com/pop-culture/pop-culture-news/smut-audio-erotica-growing-trend-quinn-celebrities-collaborations-rcna263065
- Washington Post, "Audio erotica is booming alongside 'Heated Rivalry'" (archive) — https://archive.ph/kLEoE
- Variety, "How Quinn Lures Shawn Hatosy, Hudson Williams and More to Audio Erotica" — https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/
- Business Insider, "Gen Z Is Loving the Audio-Erotica App Quinn" (2024) — https://www.businessinsider.com/gen-z-is-loving-the-audio-erotica-app-quinn-2024-6
- AOL/reprint, "Sex has always sold in Hollywood. This popular app is changing how" — https://www.aol.com/entertainment/sex-always-sold-hollywood-popular-100000362.html
- Mashable, "Dipsea, Quinn, and others: Your guide to audio erotica" — https://mashable.com/article/best-audio-porn
- Mashable, "Audio erotica app Bloom debuts AI roleplay chatbots" — https://mashable.com/article/bloom-audio-erotica-ai-chatbots
- Spotify for Authors, "Unlocking global passion... spicy audiobooks" (first-party demographics) — https://authors.spotify.com/blog/spicy-audiobooks
- Sri Lanka Guardian (summarising Sydney Morning Herald; McAlister/Bellas academic study) — https://slguardian.org/from-podcasts-to-pleasure-how-audio-erotica-is-becoming-the-new-frontier-of-digital-intimacy/
- Her Campus, "I Tried The Quinn Erotic Audio App" — https://www.hercampus.com/wellness/erotic-audio-quinn-app/
- Nichole (Substack), "Audio For Women" — https://nichole.substack.com/p/audio-for-women-its-honestly-for
- Brianna Endrina (Substack), "Talking Her Through It" — https://matingandrelating.substack.com/p/talking-her-through-it
- SexTechGuide via TechnologyTangle, "Dipsea ditches AI narration..." (2 Aug 2026) — https://technologytangle.com/2026/08/02/dipsea-ditches-ai-narration-after-deciding-a-human-breath-cant-be-faked

**Market sizing (use with caution — see §4.1)**
- Research and Markets, Sexual Wellness Market Report 2026 — https://www.researchandmarkets.com/reports/5994879/sexual-wellness-market-report
- Business Research Insights, Sexual Wellness Market — https://www.businessresearchinsights.com/market-reports/sexual-wellness-market-117813
- Adultvisor, "How Fast Is Audio Erotica Growing?" (low quality; cites Words Rated, Kinsey Institute, Irish Examiner) — https://adultvisor.com/audio-erotica-market-growth/

**Shutdowns, deplatforming, creator sentiment**
- Rosy closure notice — https://meetrosy.com/
- LinkedIn, Dr Lyndsey Harper closure announcement (reproduced) — https://www.linkedin.com/posts/karla-loken_yesterday-an-amazing-team-anounced-they-activity-7387865891746717696-ttmm
- LinkedIn, Alison Greenberg on Rosy and the women's-health cohort — https://www.linkedin.com/posts/greenbergalison_this-one-hit-me-hard-lyndsey-and-i-came-activity-7397764875050971136-yOqF
- The Verge, "The chaos and confusion of itch.io and Steam's abrupt adult game ban" — https://www.theverge.com/games/715299/itchio-games-delisting-payment-processor-paypal
- Game Developer, "Itch.io deindexing adult content to appease payment providers" — https://www.gamedeveloper.com/business/itch-io-deindexing-adult-content-to-appease-payments-providers
- Mashable, "Adult creators are still getting debanked" (Stripe/Mastercard statements) — https://me.mashable.com/sex-dating-relationships/66486/adult-creators-are-still-getting-debanked-but-it-doesnt-just-impact-them
- The War on Porn, "Adult Creators Keep Getting Debanked" — https://thewaronporn.com/adult-creators-keep-getting-debanked-and-the-fallout-goes-far-beyond-them/
- TechCrunch, "Tingles is an app devoted to ASMR videos" (2018) — https://techcrunch.com/2018/03/16/tingles-is-an-app-devoted-to-asmr-videos/
- r/gonewildaiaudio (via redlib mirror) — https://redlib.vanillax.me/r/gonewildaiaudio/
- r/gonewildaudible (via redlib mirror; creator anti-AI-training clauses) — https://redlib.vanillax.me/r/gonewildaudible

**Platform, policy, legal**
- Apple App Review Guidelines (1.1.4, 1.2.1, 4.7.5) — https://developer.apple.com/app-store/review/guidelines/
- Apple App Store Connect, Age ratings values and definitions — https://developer.apple.com/help/app-store-connect/reference/age-ratings
- Texas SB 2420 enrolled bill text — https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02420F.HTM
- The Hill, "Supreme Court allows Texas app store age-verification law" — https://thehill.com/policy/technology/5956536-supreme-court-texas-app-store-law/
- iDropNews, "Texas App Store Age Verification Law Takes Effect" — https://www.idropnews.com/news/texas-app-store-age-verification-live/264489/
- Mobile ID World, "Apple Applies Texas Age-Assurance Rules to New Apple Accounts" — https://mobileidworld.com/apple-applies-texas-age-assurance-rules-to-new-apple-accounts/
- ElevenLabs Prohibited Use Policy — https://elevenlabs.io/use-policy
- ElevenLabs Music Terms (bars adult-entertainment sector) — https://elevenlabs.io/music-terms
- ElevenLabs Image & Video Terms — https://elevenlabs.io/image-and-video-terms

**Aggregators used with explicit skepticism (see §1)**
- justuseapp Dipsea reviews — https://justuseapp.com/en/app/1434242889/dipsea-audio-stories/reviews
- worldsapps Quinn reviews — https://worldsapps.com/reviews-quinn-audio-stories
- MyPresio, AI companion voice calls 2026 — https://mypresio.com/blog/ai-companion-voice-calls-2026
- Roborhythms (Replika/Character.AI voice reviews) — https://www.roborhythms.com/best-ai-companion-voice-calls/
- DatingDroid, AI voice technology in girlfriend apps — https://datingdroid.com/ai-voice-technology-girlfriend-apps/
- Diversinet, Gone Wild Audio overview (source for the GWA AI ban) — https://diversinet.com/gone-wild-audio/
