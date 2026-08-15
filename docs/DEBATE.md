# Debate Log — PRD v1 → v2 decisions

Three persona reviews were run against PRD v1 (Aug 2026): **Maya** (target user: 29, Quinn subscriber, romance reader, privacy-absolutist), **Operator** (skeptical consumer-subscription investor), and **Red Team** (ex-App Review + trust & safety lead). Full reviews summarized below with the resulting decisions.

## Convergent critiques (all or 2/3 reviewers)

| # | Critique | Who | Decision |
|---|---|---|---|
| D1 | Focus shelf is camouflage; it dilutes the product and nobody wins focus with a side shelf (Endel tops out at $15.8M; Dipsea survives review with sleep alone) | Maya + Operator | **ACCEPT — cut Focus from v1.** Two shelves: **Sleep** and **Desire**. Adaptive soundscapes → backlog. |
| D2 | Half-stealth AI ("don't say AI" brand + transparency page) is incoherent; the exposé writes itself; Dipsea's reversal proves the market event is *disclosure*, not detectability | All three | **ACCEPT — full Bloom posture.** Licensed narrator likenesses with revenue share to named, paid humans; AI disclosed plainly and proudly in-app ("Performed by [Voice], a studio-crafted synthetic voice — never cloned without consent"); the blind-test bar stays as a *quality* gate, not a disguise. |
| D3 | Name-drop is uncanny for many listeners and a harassment/T&S surface if it ever renders arbitrary text | Maya + Red Team | **MODIFY — keep, but:** opt-in, off by default, hard-locked to a pre-rendered name whitelist (never free text, never runtime generation), marketed quietly as a delight, not the hero. |
| D4 | The variation engine ("more like this, but softer/slower") is the actual hero feature; catalog should be marketed as sessions × variants | Maya + Operator | **ACCEPT — variation engine is the hero.** Launch messaging: "hundreds of ways to hear it," catalog = 100 sessions × ~4 variants. |
| D5 | Composer (structured scenario builder) is the only feature Quinn can't fast-follow; don't strand it in v2 limbo | Maya (requests culture) + Operator | **ACCEPT — pull composer into the launch roadmap** as fast-follow v1.5, with its Guideline 1.2 moderation stack (report/block/filter + classifier) designed now, built before it ships. |

## Maya (target user) — specific demands

- **F4F/NB voices at launch, not roadmap** — "women-first with only male voices is for *some* women." → **ACCEPT:** launch roster includes at least one F and one NB voice with ≥15 sessions between them.
- **Price at or below Quinn ($47.99/yr) until voice loyalty exists.** → **ACCEPT: $49.99/yr, $6.99/mo.**
- **Keep Sleep** (same emotional continuum; the annual-justifying habit). → Accepted via D1.
- **Mood picker is too thin** — add *yearning / missed / wanted*; the category's top tags aren't in the picker. → **ACCEPT:** mood set now: comforted, adored, teased, wanted, missed, in charge.
- **Heat dial must remember context** (weeknight vs weekend heat differ). → **ACCEPT:** per-shelf, time-aware heat memory.
- **Series & characters need product surface** — "continue with him," recurring dynamics. → **ACCEPT:** series entities + Continue rail in v1 schema.
- **Anonymous social proof** — 150 unranked tracks is choosing blind. → **ACCEPT:** anonymous listener ratings + play-derived "loved for: buildup" chips. No comments, no profiles.
- **Lock screen / CarPlay / Control Center audit** — what shows while playing is a discretion surface Quinn once burned her on. → **ACCEPT:** neutral Now Playing metadata ("Selfish — Session") in discreet mode.
- **Name "Selfish":** defensible, has a point of view, but fails the coworker-glance test; "Hush" safer. → **KEEP "Selfish" as working title**; run the coworker-glance test with real users pre-launch; trademark scan in research loop 2.
- Free tier: keep — "cannibalization fears are Quinn-brain." (Conflicts with Operator; see D-econ below.)

## Operator (investor) — specific demands

- **Verdict: pass → small check, contingent on a web smoke test.** Core risk isn't "can AI pass a blind test" but "will women *knowingly* pay for AI-voiced intimacy."
- **Web-first falsifiable test before heavy iOS spend**: 25–40 BFE sessions, Stripe paywall, disclosed AI, romance-TikTok traffic; measure visitor→paid with disclosure. → **ACCEPT:** the Expo app ships web-first (Expo web) as the smoke test vehicle; iOS submission gated on smoke-test signal. Build cost is shared, so we build once.
- **Pick one giveaway** (permanent free tier vs 21-day trial is double-giving; hard paywalls convert 5× freemium). Maya: free tier is the trust wedge. → **COMPROMISE:** small permanent free tier stays (rotating 3 Desire + 3 Sleep sessions — it answers the category's loudest complaint and costs ~0), trial shortened **21 → 14 days**. Revisit with real conversion data.
- **Name the moat honestly**: (a) preference/skip/replay data at per-variant granularity, (b) exclusive licensed voice likenesses under contracts covering synthetic erotic performance. → **ACCEPT:** both added as explicit moat strategy; voice contracts are lockable early and become the defensibility story.
- **Cut web-explicit tier from v1** (distraction; Maya agrees: "porn-site UX I'm escaping"). → **ACCEPT: deferred post-launch.** v1 heat maxes at "Spicy" in-app. Web checkout link remains for payments only.
- **Model editorial cost per shipped minute** (the AI economics evaporate at the quality bar). → **ACCEPT:** added to pipeline metrics; target < $8/finished-minute all-in editorial+QA at launch cadence.

## Red Team (App Review + T&S) — mandatory changes

1. **Disguised app icon = your rejection (2.3.1 vault-app precedent; nudify terminations turned on concealment).** → **ACCEPT:** replaced with neutral *abstract branded* alternate icons only. Never ship a disguise, never post-approval.
2. **Scrub every in-app reference to an explicit web tier**; the 3.1.1(a) link is a payments allowance, not content marketing ("apps that *may include* pornography" = 1.1.4). → **ACCEPT** (moot for v1 via deferral, codified for later: checkout-only, neutral copy).
3. **Safety stack before scale generation**: independent output classifier (minors / non-consent / incest / real persons) on every script *before* the human pass; written editorial checklist requiring explicit in-text adult-age establishment for every character; full audit trail (prompt → script → approver); incident-response plan. "Human editorial pass" is a craft gate, not a safety gate. → **ACCEPT:** designed into the pipeline as blocking stages.
4. **Voice licensing paper must cover synthetic *erotic* performance explicitly** (a sleep-content license reused for erotic fine-tuning is the SAG-AFTRA-era headline; ELVIS Act liability). → **ACCEPT:** license template requirement documented; no fine-tune before paper.
5. **Document the "no runtime generation" invariant** in code and App Review notes; UI copy says "find your session," never "we'll create one for you." → **ACCEPT:** invariant added to PLAN and enforced in architecture (v1 API has no generation endpoints reachable from the client).
6. **Compliance research graded B+; gaps**: Feb 6, 2026 guideline update (interactive voice = chatbot under 4.7 *and* 1.2 — raises v3 cost), Epic rate-setting is live (don't plan on 0% link-out forever), and zero coverage of **EU AI Act Art. 50** (in force Aug 2, 2026: machine-readable marking of synthetic audio required; fictional-work carve-out means no audible stinger needed), **FTC Section 5** (may de-emphasize AI, may not imply humanity), **UK Online Safety Act age assurance** for web distribution. → **ACCEPT:** research loop 2 dispatched on exactly these gaps; findings to be folded into PLAN v2.
7. **Termination warning codified**: never show App Review a sanitized catalog and remotely enable spicier content/icons/tiers post-approval; never hide the Desire shelf from the demo account. → **ACCEPT:** added to compliance doc as a standing rule.

## Rejected / deliberately not adopted

- **Operator's "kill the permanent free tier entirely"** — rejected in favor of the small-free-tier + shorter-trial compromise; the free tier is the category's loudest unmet complaint and our marginal cost is near zero. Flagged for data-driven revisit at day 60.
- **Maya's "cut Focus" extended to cutting soundscapes from Sleep** — not adopted; ambient beds stay as Sleep-shelf content, they're production assets we need anyway.
- **Renaming now** — deferred; "Selfish" remains working title pending trademark scan + user test. The repo doesn't care what the brand is.
