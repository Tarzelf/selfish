# Compliance and Legal Risk — AI-Assisted Audio App (Focus/Sleep + Erotic Audio Fiction)

**Research date:** 14 August 2026
**Product assumption under analysis:** iOS app (Expo/React Native or native Swift), subscription monetised, offering (a) focus/sleep/calm audio and (b) erotic audio fiction aimed primarily at women. Scripts LLM-written, voices synthetic TTS. No visual explicit content, no real people, no user-to-user interaction, all characters adult. Some degree of personalisation under consideration, up to and including free-text custom fantasy prompts.

**Method:** Primary sources fetched live where possible (Apple developer site, legislation.gov.uk, Ofcom statutory guidance, vendor legal pages, SCOTUS opinion text, statutory text). Secondary sources are labelled as such. Where a source could not be retrieved (bot protection, 404), that is stated explicitly rather than filled in from memory.

**Confidence scale used throughout:**

| Rating | Meaning |
| --- | --- |
| **High** | Verified against the primary source, quoted, retrieved on the research date. |
| **Medium** | Verified against a good secondary source, or a primary source whose scope/applicability to us requires an inference. |
| **Low** | Reported by aggregators or trade press only; treat as a lead to verify, not a finding. |

> **This is not legal advice.** Several conclusions below turn on interpretive questions (does audio fiction count as "sexual material harmful to minors"? is our app an "internet service" with UK links?) that a regulated-content lawyer needs to answer before launch.

---

## 1. Hard blockers

These are things that, as currently written, stop a plan dead. Each is quoted from the source in the detail sections.

### HB-1 — Stripe cannot process payments for this product. Neither can PayPal or Paddle.

Stripe's Prohibited Businesses list (fetched 14 Aug 2026) names, under **Prohibited** (not "restricted", not "requires approval"):

> Pornography and other mature audience content (including literature, imagery, and other media) designed for the purpose of sexual gratification
>
> Any artificial-intelligence generated content that meets the above criteria

The words "literature" and "other media" foreclose the argument that audio-only, no-visuals content sits outside the category. The AI clause forecloses the argument that synthetic content sits outside it. **Confidence: High.**

This propagates: **RevenueCat Billing uses Stripe as its payment gateway**, and RevenueCat Web also offers Stripe Billing and Paddle Billing as engines — all three inherit the prohibition. RevenueCat's *mobile* SDK over Apple IAP is unaffected, because RevenueCat never touches the money there.

PayPal prohibits "Sexually oriented digital goods or content delivered through a digital medium… Examples of digital goods include downloadable pictures or videos and website subscriptions." Paddle's AUP forbids "Adult and other age-restricted content and services, including sexually-oriented or pornographic products or services, any material of a lewd and lascivious nature" — and separately forbids AI voice cloning products.

**Consequence:** the web/off-app payment rail must be a high-risk adult processor (CCBill, Segpay, Epoch, Verotel, RocketGate) at roughly 10–15% plus card-network high-risk registration fees, or there is no web rail at all and everything runs through Apple IAP.

### HB-2 — Several TTS/LLM vendors flatly prohibit this use case. Choosing wrong kills the stack.

| Vendor | Verdict | Confidence |
| --- | --- | --- |
| **Anthropic** | **Prohibited.** "Do Not Generate Sexually Explicit Content… Depict or request sexual intercourse or sex acts; Generate content related to sexual fetishes or fantasies… Engage in erotic chats." | High |
| **Microsoft / Azure AI Speech** | **Prohibited.** "Microsoft prohibits content that is erotic, pornographic, or otherwise sexually explicit, **as well as the use of Microsoft AI Services in applications that are sexually explicit**." The second clause bans us even if the TTS input were clean. | High |
| **Google (generative models)** | **Prohibited.** Generative AI Prohibited Use Policy §5: "Sexually explicit content -- for example, content created for the purpose of pornography or sexual gratification." | High |
| **Play.ht / PlayAI** | **Prohibited.** "Topics such as sexual content, hate speech… are explicitly prohibited." | Medium |
| **Resemble AI** | **Prohibited.** ToS acceptable-use: you will not make available content that "is obscene or pornographic". | High |
| **Stability AI** (not on your list, relevant if considered) | **Prohibited.** "We Prohibit Sexually Explicit Content… content relating to sexual intercourse, sexual acts, or sexual violence." | High |

That is six of the eleven vendors you asked about, including two of the three hyperscalers and the two most obvious "safe corporate choice" LLMs.

### HB-3 — UK Online Safety Act Part 5 catches audio erotica specifically, and requires *highly effective* age assurance. Self-declaration is statutorily excluded.

OSA 2023 s.79(4) exempts content that "consists only of text". **Audio is not text.** Ofcom's statutory guidance is explicit:

> The definition of regulated provider pornographic content encompasses content in a range of forms, including still and moving images, **audio** and audio-visual content.

And s.79(6)(a)(iii) reaches AI generation on demand:

> references to pornographic content that is generated on the service by means of an automated tool or algorithm in response to a prompt by a user and is only visible **or audible** to that user (no matter for how short a time)

The duty (s.81(2)–(3)) is to ensure "by the use of age verification or age estimation (or both), that children are not normally able to encounter" the content, and it "must be of such a kind, and used in such a way, that it is **highly effective** at correctly determining whether or not a particular user is a child." Ofcom: "The Act states that measures which require users to self-declare their age (without other methods) are not to be regarded as age assurance." Penalties: up to £18m or 10% of qualifying worldwide revenue.

**Confidence: High** on the law and Ofcom's reading. **Medium** on whether *your specific catalogue* meets the definition of "pornographic content" (s.236(1): "produced solely or principally for the purpose of sexual arousal") — a soft-romance library plausibly does not; an explicit library plausibly does. This is a per-item, not per-app, question and it is one of the open questions for counsel.

This is a hard blocker only in the sense that "ship in the UK without highly effective age assurance" is not an available option. It is solvable with money (Yoti / Persona / VerifyMy / k-ID facial age estimation or ID check), not with UX cleverness.

### HB-4 — Real-time AI generation from free-text user prompts is a materially different, much worse risk product than a pre-generated library.

Three independent reasons, each sourced:

1. **Apple.** Guideline 1.2 says apps "used primarily for pornographic content… do not belong on the App Store and may be removed without notice." App Review treats model output as user-generated content and expects the full 1.2 safeguards. Apple's own age-rating news post: "you must consider how all app features, **including AI assistants and chatbot functionality**, impact the frequency of sensitive content appearing within your app." Apple's public statement on nudify apps (July 2026): "we have always strictly prohibited apps designed to generate, distribute, or consume pornography."
2. **Ofcom.** Terms-of-service prohibitions alone are explicitly rejected as a safeguard: "solely including a provision in the terms of service for a GenAI tool that prohibits the tool being used to create pornographic content would not secure the outcome… and would therefore not be deemed a sufficient safeguard." You would need keyword blockers, classifiers, dataset curation and red-teaming — or accept Part 5 scope.
3. **Section 230 does not help you.** See §8 below. Output you generate is first-party content.

A fixed, human-reviewed library is a *content* risk you can bound by reviewing every item. A prompt box is an *unbounded* risk: the failure mode is a user typing a scenario involving a minor and your app producing audio of it. That is a criminal-exposure question, not a policy question.

### HB-5 — "Graphic sexual content and nudity" at any frequency makes the app Unrated, i.e. unshippable.

Apple's age-ratings reference (fetched 14 Aug 2026) defines three tiers within Sexuality or Nudity. The top one:

> **Graphic Sexual Content and Nudity:** Explicit, detailed depictions of sexual activity or nudity. May include: uncensored or full-frontal nudity; realistic, illustrative, or pornographic portrayals of sex.

And the rating table:

> **Unrated** — Apps with this rating may contain instances of the following content **that can't be published on the App Store**… Sexuality or Nudity: **Infrequent or Frequent** graphic sexual content and nudity

There is no "infrequent" safe harbour here. Answering anything other than *None* to the graphic-sexual-content question is fatal to App Store distribution. The tier you must sit in is the one below:

> **Sexual Content or Nudity:** Non-explicit depictions of sexual behavior, including brief or partial nudity. May include: mild romantic intimacy, implied sexual activity, or **erotic or sensual dialog**.

"Erotic or sensual dialog" is the exact hook for audio erotica, and *Frequent* on that descriptor lands you at **18+**, which is shippable. **Confidence: High.** This is the single most important line in the whole research: the product must be designed to sit on the "erotic or sensual dialog" side of an editorially enforced line, not the "explicit, detailed depictions" side.

---

## 2. Constraints that shape the design

Not blockers, but each one forces a specific engineering or editorial decision.

**C-1 — Two rails, two catalogues.** The App Store binary carries the 18+-rateable catalogue and monetises through Apple IAP. Anything more explicit, if you want it at all, lives on the web behind an adult processor and highly effective age assurance. This is precisely what Bloom Stories does today: their own FAQ says "certain content is restricted due to platform policies. For unrestricted access to all Bloom Stories content, simply visit our browser version." Note the tension with Apple guideline 2.3.1(a) on hidden features — see C-9.

**C-2 — Apple IAP is your primary rail and Apple does not object to adult content per se.** Nothing in guideline 3.1 restricts adult content, and Dipsea (18+, ~$69.99/yr) and Quinn (18+, $59.99/yr) both run auto-renewable IAP subscriptions today. Apple's 15–30% is the cost of being the *only* mainstream processor that will take this business.

**C-3 — US external-link payments are currently commission-free but that is unstable.** Since the 30 April 2025 contempt ruling, Apple has charged **0%** on US-storefront external-link purchases, and guideline 3.1.1(a) confirms the entitlement "is not required for developers to include buttons, external links, or other calls to action in their United States storefront apps." But: the Ninth Circuit (Dec 2025) vacated the outright commission ban; the Supreme Court granted cert on 30 June 2026; on 13 Aug 2026 Apple proposed 15% (standard) / 10% (partner programs) / 5% (Small Business Program), and Judge Gonzalez Rogers is running a 60-day evidentiary process on whether those rates meet the "genuinely and reasonably necessary" standard. **Do not build a business model that depends on 0% persisting.** Confidence: High on facts, and the whole point is that the outcome is unknown.

**C-4 — Age assurance is now a build item, not a checkbox, and Apple has shipped the API.** Texas SB 2420 became enforceable **4 June 2026** after the Fifth Circuit stayed the injunctions and SCOTUS denied emergency applications. Apple's developer bulletin: "Developers can request age category data for these Apple Accounts through the Declared Age Range API." Apple's own Q&A answers the question you would otherwise ask:

> **If my app is rated 18+, do I still need to implement the Declared Age Range API?** Yes. In regions where legally required, you need to check the age of the people using your app with the Declared Age Range API.

Required surface area (iOS 26.2+ SDK, Xcode 26.2+):
- `AgeRangeService` / Declared Age Range API — age band or statutory age category, plus assurance-method signals (`governmentIDChecked`, `paymentChecked`, `checkedByOtherMethod`, and guardian equivalents)
- `PermissionKit` `SignificantAppUpdateTopic` — parental consent on significant app changes (Texas treats an age-rating change as significant)
- New StoreKit age-rating property type — to detect rating changes on device
- App Store Server Notification `RESCIND_CONSENT` — handle consent revocation

Other app-store-level laws on the same clock: Utah App Store Accountability Act (provider duties 6 May 2026, full compliance 6 May 2027), Louisiana (1 Jul 2026), Alabama HB 161 (1 Jan 2027). Device/OS-level: California AB 1043 (1 Jan 2027), Illinois P.A. 104-0664 (1 Jan 2028), Colorado SB26-051 (1 Jul 2028). *(Dates from a secondary tracker cross-checked against Apple's own bulletins where they overlap; Confidence: Medium on the non-Texas dates.)*

**C-5 — Your age-rating questionnaire answers are the product spec.** To land at 18+ and stay shippable you will answer, at minimum: Sexual Content or Nudity = *Frequent*; Mature or Suggestive Themes = *Frequent*; Graphic Sexual Content and Nudity = **None**. That third answer is an editorial commitment enforced by review process, not a toggle. Guideline 2.3.6: "Answer the age rating questions in App Store Connect honestly… If your app is mis-rated, customers might be surprised by what they get, or it could trigger an inquiry from government regulators."

Competitor descriptors, live on their App Store pages (14 Aug 2026):

| App | Rating | Declared descriptors |
| --- | --- | --- |
| **Dipsea** | 18+ | *Frequent*: Mature or Suggestive Themes, Sexual Content or Nudity. *Contains*: Health or Wellness Topics |
| **Quinn** | 18+ | *In-App Controls*: **Age Assurance**. *Frequent*: Mature or Suggestive Themes, Sexual Content or Nudity. *Infrequent*: Profanity or Crude Humor; Alcohol, Tobacco, Drug Use or References |
| **Bloom Stories** | 18+ | 18+ with AI roleplay chatbots shipping *inside* the app |

Quinn declaring **Age Assurance** as an in-app control is a direct signal that the compliant pattern is: 18+ rating **plus** an in-app age gate, not one or the other.

**C-6 — The wellness half of the app is an asset, and Apple's descriptor set has a slot for it.** Dipsea declares "Health or Wellness Topics". Sleep/focus content is not decorative: it is the thing that makes the app defensible under guideline 4.2 (minimum functionality) and 4.3(b) (spam / "indistinguishable from what's already widely available"), and it gives App Review a frame other than "porn app".

**C-7 — Any prompt-driven or personalised feature drags guideline 1.2 obligations onto you.** Apple requires, for UGC: a filtering method for objectionable material, a report mechanism with timely response, the ability to block abusive users, and published contact information. Review applies these to model output. Additionally, if any content sits outside the app's own rating, guideline 1.2.1(a) and 4.7.5 both require "an age restriction mechanism based on verified or declared age to limit access by underage users."

**C-8 — Vendor selection is now down to a short list.** After HB-2 removes six vendors, what remains:

| Vendor | Position on adult sexual content | Confidence |
| --- | --- | --- |
| **ElevenLabs** (TTS core) | **No blanket ban found.** The Prohibited Use Policy (3 Sep 2025) prohibits minors-related sexual material, "age-inappropriate material… that targets minors", and unauthorised sexualisation of a real person's voice. §8 (violent/hateful/harassing) expressly "does not apply to activity in purely fictional contexts". I fetched and read the full ToS and PUP — neither contains an adult-content prohibition. **But** ElevenLabs *Music* Terms prohibit customers operating in "adult entertainment or pornographic content" outright, and ElevenAgents BYO-LLM terms say "Customer shall not use the Customer-Provided LLM to create, generate or distribute any sexual content." So the boundary is product-by-product and the enforcement clause is "at ElevenLabs' sole discretion." | High on the text; **Low** on whether they will tolerate it at scale |
| **AWS Polly** | **Not prohibited.** AWS AUP (1 Jul 2021) has no adult-content clause. AWS Responsible AI Policy prohibits non-consensual likeness/voice and minor harm, not lawful adult content. The "Transmit material that is sexually explicit, relates to 'adult services'" clause in AWS Service Terms is scoped to **§11.6 (Amazon SNS)** and **§29.5 (AWS End User Messaging)** — messaging products, not Polly. | High |
| **Cartesia** | **Ambiguous, leaning prohibited.** ToS bars making available content that is "obscene… or otherwise use the Services in a manner that is obscene". No express adult-content clause, but "obscene" is a discretionary hook. Also imposes a hard AI-disclosure requirement (see C-11). | Medium |
| **Hume AI** | **Ambiguous.** AUP prohibits minor sexualisation, impersonation, harmful content — no adult-content clause found. | Medium |
| **xAI / Grok** | **Most permissive of the LLMs.** AUP prohibits sexualising real persons and children; consumer ToS explicitly contemplates 18+ adult content behind age assurance ("Until we are able to determine if a user is 18 or over, they may not be able to access 18+ adult content"). Enterprise ToS incorporates the same AUP. | Medium (the 18+ language is in the consumer ToS; API applicability inferred) |
| **OpenAI** | **Unresolved.** Historic policy prohibited "Adult content… Erotic chat… Pornography". The 29 Oct 2025 rewrite to universal policies dropped that flat prohibition; adult content became a default-off, operator-unlockable capability with undisclosed eligibility criteria. **However**, "adult mode" was delayed from Dec 2025 → Q1 2026 → paused indefinitely on 26 Mar 2026, reportedly over a ~12% teen-misclassification rate in age prediction. I could not fetch the live page (bot protection); the quotes above come from search-surfaced page content and trade press. | **Low — verify directly with OpenAI before relying on it** |

**Practical read:** the only combination I would build on today is **ElevenLabs or AWS Polly for voice + a self-hosted or xAI model for scripts + human editorial review of every script before it becomes audio**. Human review moves the sexual-content generation out of the vendor's pipeline entirely for the fixed-library product, which is the cleanest way to sidestep the whole vendor-AUP problem: *an LLM that writes a romance scene reviewed by a human is a different compliance object from an LLM wired directly to a user's fantasy prompt.*

**C-9 — Do not hide the web catalogue from App Review.** Guideline 2.3.1(a): "Don't include any hidden, dormant, or undocumented features in your app… All new features, functionality, and product changes must be described with specificity in the Notes for Review section." Guideline 1.2 permits the two-catalogue pattern in a narrow form — "If your app includes user-generated content from a web-based service, it may display incidental mature 'NSFW' content, provided that the content is hidden by default and only displayed when the user turns it on via your website" — but that clause is about *UGC* and *incidental* content, which is not our shape. Disclose the web tier in review notes; do not build a geo- or flag-gated surprise.

**C-10 — Card-network compliance follows you to the web rail.** Visa's integrity risk program and Mastercard's specialty-merchant registration for adult content impose MCC coding (5967), named third-party age verification, documented consent for every depicted person, complaint resolution SLAs, and periodic reporting to your acquirer, with annual high-risk registration fees on the order of $950 (Visa) + $500 (Mastercard). The "documented consent for every depicted person" requirement maps onto **voice actor consent** for us (§7), not performer 2257 records. *Confidence: Medium — these figures come from trade sources, not from the card networks' own rulebooks, which are not public.*

Worth internalising: in 2025 acquirer/network pressure caused itch.io to deindex adult content wholesale. Payment-rail risk for adult content is not just contractual, it is political.

**C-11 — You will have to disclose that voices are AI, in at least two jurisdictions and by at least one vendor contract.** EU AI Act Article 50 applies from **2 August 2026** (twelve days ago). Cartesia contractually requires an interstitial disclosure before any interaction with its products. See §7.

**C-12 — Content-editorial rules that fall out of all of the above.** Every character stated and voiced as an adult, with age markers in the script; no real-person voices, names, or identifiable likenesses; no non-consent themes presented approvingly (Anthropic, Microsoft, xAI and Ofcom all treat sexual violence separately and more harshly than consensual adult content); "erotic or sensual dialog" register rather than clinical/explicit anatomical narration; a documented human review step with a written standard and an audit trail.

---

## 3. Open questions needing a real lawyer

1. **Does our catalogue meet OSA s.236(1) "produced solely or principally for the purpose of sexual arousal"?** A calm/sleep app with a romance tier is a different animal from an erotica app with a sleep tier. The answer determines whether UK Part 5 duties bite at all, and the marketing copy you write will be evidence on this question. *This is the highest-leverage legal question in the whole document.*
2. **Does audio fiction count as "sexual material harmful to minors" under the US state statutes?** Texas §129B.001(6) — as quoted by the Supreme Court in *FSC v. Paxton* — defines it as material that "**describes**, displays, or depicts… in a manner patently offensive with respect to minors" various sex acts. **"Describes" is not "depicts."** Verbal description is textually within scope. Against that: §129B.002(a) reaches a "commercial entity that knowingly and intentionally publishes or distributes material on an **Internet website**", which on its face is a website provision, not an app provision. So: (a) does our *website* cross the one-third threshold, and (b) do the ~27 state statutes vary on "describes" vs "depicts" and on "website" vs "online service"? Needs a fifty-state survey. *My read is that the risk is real and under-appreciated, but I am not confident enough to call it a blocker.*
3. **Is the one-third threshold computed over the whole catalogue?** If sleep/focus content is genuinely more than two-thirds of the library by count/duration, most state statutes' thresholds are not met. Is that a defensible position, and how is the fraction measured (items? minutes? traffic?)?
4. **What is our EU AI Act role — provider, deployer, or both?** We deploy someone else's TTS but we place a generative feature on the market if we ship prompt-driven generation. Article 50(2) marking duties sit with the *provider*; 50(4) deepfake disclosure sits with the *deployer*. Contractually allocate this with the TTS vendor.
5. **Obscenity exposure under 18 U.S.C. §§ 1462/1465/1466.** §1462 reaches any "filthy phonograph recording, electrical transcription, or other article or thing capable of producing sound" transported in interstate commerce — audio is *expressly named in the statute*. Prosecutions of purely fictional adult audio are, so far as I found, essentially nonexistent in the modern era, and Miller's third prong (serious literary/artistic value) is a real defence for narrative fiction. But the Thomas prosecution (6th Cir., §1465, members-only BBS) establishes that the *most restrictive community* where content is received can supply the standard. Counsel should assess whether to geofence.
6. **Does Apple's guideline 1.1.4 definition catch us?** "Overtly sexual or pornographic material, defined as 'explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings.'" Note **"explicit descriptions"** — again, verbal description is inside the definition. Dipsea, Quinn and Bloom demonstrate that Apple in practice tolerates audio erotica at 18+, but the guideline text does not obviously permit it, which means we live on enforcement discretion rather than on a rule. Ask counsel how much weight to put on three-competitor precedent.
7. **Voice actor contracts.** If we license or clone any human voice: scope, term, territory, genre restrictions (explicitly including adult content), revocation, and the interaction with the ELVIS Act, California AB 2602's unenforceability rule, and any union agreements.
8. **Product-liability framing.** *Garcia v. Character Technologies* held that a chatbot can be a *product* with a defective design, not merely speech. If we ship interactive/personalised generation, we may be building a product, not publishing a work. That changes the insurance conversation.

---

# Detailed findings

## 4. Apple App Review Guidelines — current text

**Source fetched:** `https://developer.apple.com/app-store/review/guidelines/` on 14 Aug 2026. Page footer: **"Last Updated: June 8, 2026."**

### 4.1 Guideline 1.1.4 — the operative prohibition

> **1.1.4** Overtly sexual or pornographic material, defined as "explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings." This includes "hookup" apps and other apps that may include pornography or be used to facilitate prostitution, or human trafficking and exploitation.

Two observations. First, the definition covers **descriptions**, not only displays — so "we have no visuals" is not by itself an answer. Second, the qualifier "intended to stimulate erotic rather than **aesthetic or emotional** feelings" is the gap that narrative, character-driven, emotionally-framed audio fiction lives in, and it is exactly the gap Dipsea's App Store copy targets ("character-driven stories designed from the female gaze", "emotional storytelling", "foster emotional intimacy"). That framing is not marketing fluff; it is guideline-shaped positioning.

### 4.2 Guideline 1.2 — user-generated content (applied to AI output)

> Apps with user-generated content present particular challenges… To prevent abuse, apps with user-generated content or social networking services must include:
> - A method for filtering objectionable material from being posted to the app
> - A mechanism to report offensive content and timely responses to concerns
> - The ability to block abusive users from the service
> - Published contact information so users can easily reach you
>
> Apps with user-generated content or services that **end up being used primarily for pornographic content**, Chatroulette-style experiences, random or anonymous chat, objectification of real people… do not belong on the App Store and **may be removed without notice**. If your app includes user-generated content from a web-based service, it may display incidental mature "NSFW" content, **provided that the content is hidden by default and only displayed when the user turns it on via your website**.

And 1.2.1(a) on creator content:

> Creator apps must provide a way for users to identify content that exceeds the app's age rating, and use an **age restriction mechanism based on verified or declared age** to limit access by underage users.

We have no UGC and no social features, so 1.2 does not apply on its face. It applies in practice the moment we generate content on demand — App Review's consistent treatment is that model output is reviewed as if it were user-generated. *Confidence: Medium (this is practitioner consensus and follows from 4.7's responsibility rule, not from an Apple statement I could quote).*

### 4.3 Guideline 1.4.x — physical harm

1.4.1–1.4.5 cover medical apps, drug dosage, substances, DUI checkpoints, and risky activities. **None apply to us**, with one caveat: if the calm/sleep side makes therapeutic claims, 1.4.1's "Apps must clearly disclose data and methodology to support accuracy claims relating to health measurements" comes into play. Keep wellness copy aspirational, not clinical.

### 4.4 Guideline 4.7 — the closest thing Apple has to an AI rule

4.7 governs "Mini apps, mini games, streaming games, **chatbots**, plug-ins, and game emulators":

> You are **responsible for all such software offered in your app**, including ensuring that such software complies with these Guidelines and all applicable laws.

- **4.7.1** — such software must "include a method for filtering objectionable material, a mechanism to report content and timely responses to concerns, and the ability to block abusive users"
- **4.7.5** — "Your app must provide a way for users to identify software that exceeds the app's age rating, and use an age restriction mechanism based on verified or declared age to limit access by underage users."

If your app embeds a conversational or character-chat feature, 4.7 is the hook Apple will use. A pure playback app with a filtered scenario picker is not obviously "software offered in your app" under 4.7.

### 4.5 New generative-AI language

**I searched the full guidelines text and found no dedicated generative-AI section.** The word "chatbot" appears only in 4.7; the only AI reference elsewhere is in 5.1.2(i): "You must clearly disclose where personal data will be shared with third parties, **including with third-party AI**, and obtain explicit permission before doing so." That clause bites if user prompts are sent to an external LLM/TTS API — you need an explicit consent flow and privacy-policy disclosure for it.

Apple's substantive AI-content requirement lives outside the guidelines, in the age-ratings bulletin:

> As a reminder, you must consider how all app features, **including AI assistants and chatbot functionality**, impact the frequency of sensitive content appearing within your app to make sure it receives the appropriate rating.

### 4.6 How Dipsea, Quinn and Bloom stay on the store

All three are **18+**. The pattern, from their live product pages:

- **Wellness co-positioning.** Dipsea declares "Health or Wellness Topics" and leads with "soothing soundscapes", "sleep sounds, and guided wellness sessions". Bloom sells "Sleep & Calm Aids" alongside spicy audio.
- **Emotional/artistic framing over arousal framing.** "Character-driven", "immersive", "from the female gaze", "emotional intimacy", "self-discovery". Compare guideline 1.1.4's "erotic rather than aesthetic or emotional feelings."
- **Descriptor honesty.** Frequent on *Sexual Content or Nudity* and *Mature or Suggestive Themes*; None on *Graphic Sexual Content and Nudity*.
- **Declared in-app age assurance** (Quinn).
- **A more explicit web tier.** Bloom: "certain content is restricted due to platform policies. For unrestricted access to all Bloom Stories content, simply visit our browser version at bloomstories.com."
- **Bloom ships AI roleplay chatbots inside an 18+ App Store app** — "Engage in flirty and explicit exchanges with your favorite Bloom characters through AI-powered role-playing chatbots." This is the closest live precedent for interactive AI erotic content surviving App Review, and it is worth studying in detail before assuming prompt-driven features are impossible.

*Confidence: High on the descriptors and copy (read from live App Store pages); Medium on the causal claim that this framing is why they survive review.*

---

## 5. Apple age ratings and age assurance

**Source:** `https://developer.apple.com/help/app-store-connect/reference/age-ratings/` and `https://developer.apple.com/support/age-assurance/`, both fetched 14 Aug 2026.

### 5.1 Current tiers — confirmed

**4+, 9+, 13+, 16+, 18+, Unrated.** The 2025 overhaul added 13+/16+/18+ to the existing 4+/9+, replacing 12+/17+. Ratings for all existing apps were migrated automatically; developers had to answer the new questionnaire by **31 January 2026** to avoid submission interruptions. Reflected on devices running iOS 26 / iPadOS 26 / macOS Tahoe 26 and later; older OS versions still show the legacy 12+/17+ scale.

### 5.2 The three sexual-content descriptors — verbatim

> **Mature or Suggestive Themes:** Content that implies or indirectly references sexual or mature topics without being explicit… May include: sexual innuendo, sensual or suggestive imagery, censored or implied nudity, real-world crimes, psychological trauma or abuse, moral or ethical dilemmas, or war or political strife.
>
> **Sexual Content or Nudity:** Non-explicit depictions of sexual behavior, including brief or partial nudity. May include: mild romantic intimacy, implied sexual activity, or **erotic or sensual dialog**.
>
> **Graphic Sexual Content and Nudity:** Explicit, detailed depictions of sexual activity or nudity. May include: uncensored or full-frontal nudity; realistic, illustrative, or pornographic portrayals of sex.

Each is answered *None* / *Infrequent or Mild* / *Frequent or Intense*.

### 5.3 Where the answers land you

> **16+** … Sexuality or Nudity: Frequent mature or suggestive themes
>
> **18+** … Sexuality or Nudity: **Frequent sexual content or nudity**
>
> **Unrated** — Apps with this rating may contain instances of the following content **that can't be published on the App Store**. It may be published on alternative app marketplaces or websites: Sexuality or Nudity: Infrequent or Frequent **graphic sexual content and nudity**

**Our rating: 18+.** Apple also lets you set a *higher* rating than calculated if your own policy requires a higher minimum age — but 18+ is already the ceiling.

Regional notes from the same page: Australia maps to R 18+; Brazil to A18; Korea to 19+; France displays 18+ for 17+-rated apps on older OS versions per ANFR.

### 5.4 "Age Assurance" is itself a declarable in-app control

Apple's In-App Controls category:

> **Age Assurance:** Mechanism to confirm an individual's age meets the age requirement for accessing specific content or services. May include: declared age range API; age estimation capabilities; age verification via government-issued passport, drivers license, national ID, or other means of age assurance.

Quinn declares this. It is a positive signal to review and to regulators, and it costs nothing to declare once built.

### 5.5 Declared Age Range API — can we use it for age gating?

Yes, and in some regions we must. From Apple's Age assurance Q&A (fetched 14 Aug 2026):

> **Am I responsible for age restrictions or is Apple?** Yes, developers are responsible for their own age restrictions. In certain regions, where legally required, Apple uses age assurance methods to confirm an Apple Account holder's age and shares age categories with you through the Declared Age Range API. In those regions, you must check the age of the people using your app.

> **If my app is rated 18+, do I still need to implement the Declared Age Range API?** Yes.

> **Is the Declared Age Range API available in all regions?** Yes, the Declared Age Range API is available worldwide, and people using your app can decide whether their age information is shared… In certain regions, where legally required, Apple will share age categories as defined by law.

> **Are there any changes to the App Review process related to my app's age assurance obligations?** No, there are no changes to the App Review process.

**Critical limitation for UK compliance:** outside legally-mandated regions the API returns a **self-declared or guardian-declared** age range (`AgeRangeDeclaration.selfDeclared`, `.guardianDeclared`). Ofcom has told us self-declaration is not age assurance. In Texas-style regions the API also returns assurance-method signals (`governmentIDChecked`, `paymentChecked`, `guardianGovernmentIDChecked`), which are a much stronger basis. **So: Declared Age Range satisfies Texas/Utah-style app-store laws and is good defence-in-depth everywhere, but it does not by itself satisfy UK OSA "highly effective" age assurance.** You will need a separate third-party age-assurance vendor for the UK. *Confidence: High.*

Version requirements: build against iOS/iPadOS **26.2 SDK or later** with Xcode 26.2+ for the full framework set; 26.4 adds `requiredRegulatoryFeatures` and significant-update acknowledgement sheets. Sandbox testing for age ranges, location restrictions, approval state changes and consent revocation is available from 26.2.

---

## 6. AI-generated sexual content — Apple's actual enforcement posture

### 6.1 What Apple has said and done

The strongest evidence is Apple's own statement to *The Verge* and *Ars Technica* (July 2026), after San Francisco City Attorney David Chiu sent cease-and-desist letters demanding removal of 13 "nudification" apps (8 from Apple, 5 from Google):

> "We have always strictly prohibited apps designed to generate, distribute, or consume pornography. 'Nudification' apps are against our App Review Guidelines and we have **proactively rejected many of these apps and removed many others**, including when users have flagged them via our reporting tools. We have removed three of the apps in question and are **in the process of terminating their developer accounts** from our program. We are in contact with four others that need to address policy violations or risk being removed as well."

Note the phrase "generate, distribute, **or consume**". Read literally that is broader than the guidelines text and would sweep in Dipsea. Read in context — it is a statement about nudify apps — it is about non-consensual imagery of real people. The gap between Apple's rhetoric and Apple's practice is the space this product occupies, and that is an uncomfortable place to build a company. *Confidence: High on the quote; the interpretation is mine.*

### 6.2 Fixed library vs. real-time generation — the concrete difference

| | Pre-generated, human-reviewed library | Real-time generation from user prompts |
| --- | --- | --- |
| **Apple guideline surface** | 1.1.4, 2.3.6 | 1.1.4, **1.2** (filter/report/block/contact), **4.7** ("responsible for all such software"), 4.7.5 (age restriction), 2.3.1(a) disclosure |
| **Age rating input** | Fixed, auditable, provable to review | Apple: must account for "how all app features, including AI assistants and chatbot functionality, impact the **frequency** of sensitive content" — unbounded by construction |
| **Reviewability** | Reviewer can sample the catalogue and see exactly what ships | Reviewer will try to jailbreak it. Assume they will succeed unless you have real classifiers. |
| **UK OSA** | Part 5 if pornographic; scope is knowable | s.79(6)(a)(iii) explicitly reaches prompt-generated audible content; Ofcom says ToS prohibitions are *not* a sufficient safeguard |
| **Worst-case failure** | A bad story ships; you pull it | A user elicits audio sexualising a minor; you have a criminal-referral event and an account termination |
| **Vendor AUP exposure** | Human review sits between the model and the sexual content | The vendor's model is directly generating the prohibited category |
| **Section 230** | Doesn't apply either way — first-party content | Doesn't apply, and *Garcia* suggests product-liability framing |

**Concrete precedent that interactive AI erotic content can ship:** Bloom Stories, 18+, US App Store, advertising "AI ROLEPLAY CHATBOTS… Engage in flirty and explicit exchanges with your favorite Bloom characters." So it is not categorically impossible. What Bloom appears to do — and what I'd recommend copying — is constrain the interaction to **pre-defined characters** with authored personas rather than an open prompt box, keep the most explicit material on the web, and declare 18+ with honest descriptors.

**Recommended middle path:** ship v1 as a fixed, human-reviewed library. Offer "personalisation" as *combinatorial selection* over pre-generated, pre-reviewed assets — scenario × voice × intensity × POV, assembled client-side — which is personalisation from the user's perspective and a fixed catalogue from the reviewer's, Ofcom's and the vendor's. Defer free-text prompts until you have a moderation stack you would defend in a deposition.

### 6.3 Has Apple published generative-AI moderation requirements?

**No standalone document found.** The requirements are distributed across guideline 4.7 (responsibility for offered software), guideline 1.2 (the moderation feature set), guideline 5.1.2(i) (disclose third-party AI data sharing), and the age-ratings bulletin (AI features count toward sensitive-content frequency). *Confidence: High that no dedicated document exists as of 14 Aug 2026, based on a full-text search of the guidelines and a targeted search of Apple developer news.*

---

## 7. Age verification law

### 7.1 UK — Online Safety Act 2023, Part 5

**Sources:** `legislation.gov.uk/ukpga/2023/50/part/5` (page states "up to date with all changes known to be in force on or before 14 August 2026") and Ofcom's s.82 statutory guidance PDF.

**Definition (s.236(1), quoted by Ofcom):** pornographic content is "content of such a nature that it is reasonable to assume that it was produced **solely or principally for the purpose of sexual arousal**."

**Scope (s.79):**
- s.79(2) — "provider pornographic content" means content published or displayed by the provider, **including** by means of "(a) software or an automated tool or algorithm applied by the provider… or (b) an automated tool or algorithm made available on the service by the provider"
- s.79(4) — excluded: content that "consists only of text" (or text plus a non-pornographic GIF/emoji)
- s.79(6)(a)(iii) — included: "pornographic content that is generated on the service by means of an automated tool or algorithm in response to a prompt by a user and is only visible **or audible** to that user (no matter for how short a time)"
- s.79(7) — UGC is excluded from Part 5 (it falls under Part 3 instead). We have no UGC, so **we are squarely a Part 5 service, not Part 3.**

**Ofcom on form:** "The definition of regulated provider pornographic content encompasses content in a range of forms, including still and moving images, **audio** and audio-visual content." Ofcom also confirms "Pornographic content may include artificial images, such as AI generated or animated images."

**Duties (s.81), in force since 17 January 2025:**
- s.81(2) — ensure by age verification or age estimation that children are not normally able to encounter the content
- s.81(3) — the method must be "**highly effective** at correctly determining whether or not a particular user is a child"
- s.81(4) — make and keep a written record of the methods used and how privacy was considered
- s.81(5) — publish a summary of that record in a publicly available statement

**Applies to apps:** s.228 defines "internet service" as "a service that is made available by means of the internet". A native app backed by a server is an internet service. "Links with the United Kingdom" (s.80(4)) is met if there is "a significant number of United Kingdom users" **or** UK users "form one of the target markets".

**What counts as highly effective (Ofcom's non-exhaustive list):** open banking, photo-ID matching, facial age estimation, mobile-network operator age checks, credit card checks (Ofcom notes: credit cards specifically, *not* debit cards), and certified digital identity services.

**What does not:** "The Act states that measures which require users to self-declare their age (without other methods) are not to be regarded as age assurance." Ofcom's example of non-compliance: "The service provider relies solely on self-declaration, general contractual restrictions or payment methods which do not require a user to be over 18, or a combination of these."

**Enforcement is live.** Ofcom opened an age-assurance enforcement programme prioritising Part 5 services, and has issued penalties — e.g. £1,350,000 against 8579 LLC for a s.12 contravention plus a daily-rate penalty, and a further £50,000 for failing to respond to a statutory information request. Maximum: £18m or 10% of qualifying worldwide revenue.

**Ofcom's GenAI position (paras 3.19–3.24)** is the part to read twice if you are considering prompt-driven generation:

> if an online service provider makes available a GenAI tool that is designed to be used for the purpose of generating pornography, this aspect of the service would fall in scope of Part 5
>
> …in order to ensure that the tool would not fall within scope of Part 5, the applicable safeguards would need to secure the outcome of preventing the creation of pornographic content. In that regard, we consider that **solely including a provision in the terms of service for a GenAI tool that prohibits the tool being used to create pornographic content would not secure the outcome** of preventing the type of content being produced, and would therefore not be deemed a sufficient safeguard.

Suggested safeguards if you want to stay *out* of Part 5: prompt keyword blockers, output classifiers, removing pornographic content from training data, and red-teaming.

### 7.2 US — *FSC v. Paxton* and the state patchwork

**The decision.** *Free Speech Coalition, Inc. v. Paxton*, No. 23-1122 (decided June 2025), 6–3, Thomas J. writing, Kagan J. dissenting joined by Sotomayor and Jackson JJ. Held: Texas HB 1181 triggers **intermediate**, not strict, scrutiny, because it "is an exercise of the state's traditional power to prevent minors from accessing speech that is obscene from their perspective" and only incidentally burdens adults. It survives.

**The statutory definition — the part that matters to us.** Tex. Civ. Prac. & Rem. Code §129B.001(6), as set out in the Court's opinion, defines "sexual material harmful to minors" as material that:

> (1) "is designed to appeal to or pander to the prurient interest" when taken "as a whole and with respect to minors"; (2) **describes**, displays, or depicts "in a manner patently offensive with respect to minors" various sex acts and portions of the human anatomy, including depictions of "sexual intercourse, masturbation, sodomy, bestiality, oral copulation, flagellation, [and] excretory functions"; and (3) "lacks serious literary, artistic, political, or scientific value for minors."

**"Describes" is the first word of prong two.** This is a Miller-derived formulation and Miller has always covered descriptions as well as depictions. **The common assumption that these statutes target visual material only is wrong on the text.** *Confidence: High on the text; Medium on how courts would apply it to narrative audio fiction, where prong three (serious literary/artistic value for minors) does real work.*

**Coverage trigger:** §129B.002(a) applies to a "commercial entity that knowingly and intentionally publishes or distributes material on an **Internet website**… more than one-third of which is sexual material harmful to minors." Two escape routes worth pricing: (i) an app may not be a "website"; (ii) the one-third threshold may not be met if sleep/focus content dominates the catalogue.

**Permitted verification methods:** "government-issued identification" or "a commercially reasonable method that relies on public or private transactional data" (§129B.003(b)(2)), performed in-house or via a third party.

**Penalties:** up to $10,000/day of non-compliance, plus up to $250,000 "if any minors access covered sexual material as a result of the violation" (§129B.006(b)).

**How many states.** The Free Speech Coalition's own tracker says twenty-five states require age verification for sites with "material harmful to minors"; a detailed independent tracker counts **27 enacted** as of Aug 2026, the discrepancy being whether 2026 additions (West Virginia HB 4412, eff. 12 Jun 2026; Iowa HF 864, eff. 1 Jul 2026) and the expanded Missouri statute (eff. 28 Aug 2026) are included. Enacted by year: **2023** — Arkansas, Louisiana, Mississippi, Montana, North Carolina, Texas, Utah, Virginia. **2024** — Alabama, Idaho, Indiana, Kansas, Kentucky, Nebraska, Oklahoma. **2025** — Arizona, Florida, Georgia, Missouri, North Dakota, Ohio, South Carolina, South Dakota, Tennessee, Wyoming. **2026** — West Virginia, Iowa, Missouri (expanded).

Most use a ≥33% content threshold. **Wyoming HB 43 has no content threshold at all** — that is the one to watch, because a single explicit item could pull the whole service in. Arizona requires gov ID plus selfie match; Florida requires a Florida-issued ID via a third party. *Confidence: Medium — this list is from a secondary tracker that is transparent about its methodology and cross-references bill pages, but I did not verify all 27 statutes individually.*

**Enforcement is getting creative.** In *State of Texas v. Kick Online Entertainment* (Travis County, writ of attachment signed 4 June 2026), a Texas court directed **Verisign** to place `motherless.com` on registry lock over an unpaid HB 1181 judgment; the domain dropped out of the `.com` zone file globally fourteen days later. It is a trial-court order in an uncontested default and binds nobody else — but it establishes that a state AG can reach a foreign operator through the registry. *Confidence: Medium — the order is a scanned PDF without a text layer and the quotes circulating are second-hand.*

### 7.3 US — app-store-level and device-level laws

**Texas SB 2420 (App Store Accountability Act)** — effective 1 Jan 2026, enforceable since **4 June 2026** after the Fifth Circuit stayed two preliminary injunctions and SCOTUS denied emergency applications to vacate that stay. Apple's own bulletin (3 June 2026) describes the developer-side duties and the four APIs listed at C-4. Statutory age categories: **under 13, 13–15, 16–17, over 18**. Texas treats **a change in an app's age rating as a "significant change"** requiring fresh parental consent — so bumping your rating is a compliance event, not just a metadata edit.

**Utah** — App Store Accountability Act, provider duties from 6 May 2026, full compliance 6 May 2027. **Louisiana** — 1 Jul 2026. **Alabama HB 161** — 1 Jan 2027. These apply to *all* apps available to state residents, not just apps aimed at children.

**Device/OS-level (future):** California AB 1043 Digital Age Assurance Act (1 Jan 2027), Illinois P.A. 104-0664 (1 Jan 2028), Colorado SB26-051 (1 Jul 2028). These push an age signal into the OS, queryable by any app. For us this is mostly good news: it makes compliant age gating cheaper.

**Federal:** nothing enacted. KOSA cleared Senate Commerce by voice vote 5 Aug 2026; the KIDS Act (H.R. 7757) passed the House 267–117 on 29 Jun 2026 and awaits the Senate; the SCREEN Act (S. 737) voted 15–13 to advance on 5 Aug 2026 but failed for lack of quorum; the GUARD Act (S. 3062) would impose AV for "AI companions". *Confidence: Medium — secondary tracker.*

### 7.4 EU — DSA Article 28 and the age-verification blueprint

DSA Art. 28(1) requires providers of online platforms accessible to minors to "put in place appropriate and proportionate measures to ensure a high level of privacy, safety and security of minors on their service." The Commission's **Guidelines on the protection of minors** (14 July 2025, all 24 languages) interpret it:

- self-declared age is **not sufficient**
- **age verification** (not merely estimation) is recommended "to restrict access to adult content such as pornography and gambling"
- methods must be "accurate, reliable, robust, non-intrusive and non-discriminatory"
- the EU age-verification blueprint / EU Digital Identity Wallets are the reference standard for a device-based method
- following the guidelines is voluntary and does not automatically guarantee compliance, but the Commission "will use these guidelines to assess compliance with Article 28(1)"

**Commission Recommendation (EU) 2026/1035** of 29 April 2026 establishes a common framework for EU-wide age verification technologies and asks Member States to ensure all EU citizens have access to robust, privacy-preserving age verification **by 31 December 2026**. A second, enhanced version of the blueprint has shipped; first customised national apps were expected early 2026; EUDI Wallets by late 2026.

**Caveat on scope:** DSA Art. 28 applies to "online platforms", which under the DSA means a hosting service that stores and disseminates information *at the request of a recipient* — i.e. it is aimed at UGC platforms. A pure first-party publisher may not be an "online platform" at all. **This is a live question for counsel** and it matters, because if we are not an online platform, Art. 28 does not bite and EU exposure drops considerably. *Confidence: Medium.*

### 7.5 Does audio fiction count? — consolidated answer

| Regime | Audio in scope? | Text-only carve-out? | Basis |
| --- | --- | --- | --- |
| **UK OSA Part 5** | **Yes, expressly** | Yes — s.79(4) exempts text-only, so a written-erotica app would escape but audio does not | s.79(4); Ofcom guidance ¶3.10 |
| **Texas HB 1181 & Miller-derived state statutes** | **Yes on the text** — prong two covers material that "**describes**" sex acts | No text carve-out | §129B.001(6) as quoted in *FSC v. Paxton* |
| **US federal obscenity §1462/1465/1466** | **Yes, expressly** — sound recordings named in the statute | No | 18 U.S.C. §1462 ("filthy phonograph recording… or other article or thing capable of producing sound") |
| **Apple 1.1.4** | **Yes on the text** — "explicit **descriptions** or displays" | No | Guideline 1.1.4 |
| **Apple age ratings** | **Yes** — "erotic or sensual dialog" is named in the Sexual Content or Nudity descriptor | No | Age ratings reference |
| **EU DSA Art. 28** | Yes if we are an "online platform" — status unclear | n/a | DSA + 2025 guidelines |
| **18 U.S.C. §2257 record-keeping** | **No** — applies only to "visual depictions" of "actual sexually explicit conduct" by real performers | n/a | §2257(a)(1) |

**The bottom line: audio is treated as pornographic media, not as text.** The intuition that "it's just audio, so it's basically a book" is wrong under every regime examined except §2257. Design accordingly.

### 7.6 What compliance actually looks like

1. **App Store binary:** 18+ rating with honest descriptors; Declared Age Range API integrated (`isEligibleForAgeFeatures`, assurance-method signals) with hard gating in Texas/Utah/Louisiana/Alabama; PermissionKit significant-update flow; `RESCIND_CONSENT` server notification handling; StoreKit age-rating change detection.
2. **UK:** a third-party highly-effective age assurance vendor (facial age estimation with ID fallback), applied before any pornographic content is audible; the s.81(4) written record; the s.81(5) public statement. **Or** geo-block the UK for the explicit tier and ship only sleep/romance there.
3. **US states:** either keep the explicit tier off the web entirely (app-only, relying on app-store age assurance), or run commercial age verification on the web tier in every state with an AV statute. Track the one-third threshold across the catalogue and document how you measure it.
4. **EU:** determine "online platform" status; if in scope, adopt the EU blueprint / EUDI Wallet path rather than ID upload.
5. **Everywhere:** written moderation standard, audit trail of human review, published contact info, report mechanism, and a documented age-assurance decision record.

---

## 8. Payments

### 8.1 Processor-by-processor

| Processor | Adult / sexual content | Source | Confidence |
| --- | --- | --- | --- |
| **Stripe** | **Prohibited** (Prohibited, not Restricted). "Pornography and other mature audience content (including literature, imagery, and other media) designed for the purpose of sexual gratification"; "Any artificial-intelligence generated content that meets the above criteria" | stripe.com/legal/restricted-businesses | High |
| **Apple IAP** | **No adult-content restriction in guideline 3.1.** Guideline 3.1.2: "Apps may offer auto-renewable in-app purchase subscriptions, **regardless of category** on the App Store." Dipsea and Quinn both run IAP subs today. The gate is App Review (1.1.4 + age rating), not the payment policy. | App Review Guidelines 3.1; live App Store listings | High |
| **RevenueCat** | **Mobile SDK: fine** (it validates receipts, never touches money). **Web Billing: not viable** — "RevenueCat Billing uses Stripe as a payment gateway"; the other two engines are Stripe Billing and Paddle Billing, both prohibited. RevenueCat's own ToS §3.1(viii) also bars using the Services to "post or send… obscene… or otherwise unlawful material". | revenuecat.com/terms; RevenueCat Web docs | High |
| **Paddle** | **Prohibited**, twice over. "Adult and other age-restricted content and services, including sexually-oriented or pornographic products or services, any material of a lewd and lascivious nature". Paddle's AUP separately prohibits AI voice cloning and AI content-generation categories. AUP last updated 13 April 2026. | paddle.com help centre AUP | High |
| **PayPal** | **Prohibited for digital.** "We don't permit PayPal account holders to buy or sell: Sexually oriented **digital goods or content delivered through a digital medium**. Examples of digital goods include downloadable pictures or videos and **website subscriptions**." (Certain *physical* sexually-oriented goods are permitted US-only.) | paypal.com/us/cshelp article help384 | High |
| **CCBill** | Permitted (core adult processor). ~10.8–14.5% + card-brand high-risk registration fees (~$950/yr Visa + ~$500/yr Mastercard). Requires legal entity (no sole individuals), business bank account, live site, ToS/privacy/refund pages, age gate. 3–10 business day approval. | Trade sources | Medium |
| **Segpay** | Permitted; subscription/recurring specialism, strong chargeback tooling. ~4–15% custom-quoted. 5–10 business day approval. | Trade sources | Medium |
| **Epoch** | Permitted; simpler approval, European strength. ~10–15% tiered. | Trade sources | Medium |
| **Verotel** | Permitted; basic account ~€500/yr registration, ~15.5% fixed, 10% rolling reserve held six months. | Trade sources | Low |
| **RocketGate, NETbilling, Vendo, MobiusPay** | Also adult-friendly; worth quoting as backups. | Trade sources | Low |

I was unable to verify CCBill/Segpay/Epoch/Verotel pricing against the processors' own published rate cards (they quote privately). Treat the numbers as order-of-magnitude.

### 8.2 Post-*Epic* external purchase links, as of 14 August 2026

Guideline 3.1.1(a), current text:

> Developers may apply for entitlements to provide a link in their app to a website the developer owns or maintains responsibility for in order to purchase digital content or services. **These entitlements are not required for developers to include buttons, external links, or other calls to action in their United States storefront apps.**

And 3.1.3: apps "cannot, within the app, encourage users to use a purchasing method other than in-app purchase, **except for apps on the United States storefront** and as set forth in 3.1.1(a) and 3.1.3(a)."

**Commission timeline:**
- **30 Apr 2025** — Judge Gonzalez Rogers finds Apple in civil contempt of the 2021 injunction; bars any commission on linked-out purchases; refers Apple and VP of Finance Alex Roman to the US Attorney for potential criminal contempt over false testimony. Apple's commission on US external purchases goes to **0%**.
- **Dec 2025** — Ninth Circuit **upholds** the contempt finding but **vacates** the flat commission ban, holding Apple may charge "the costs that are genuinely and reasonably necessary for its coordination of external links for linked-out purchases, but no more." Security and privacy features are expressly *not* recoverable costs. Remanded for rate-setting.
- **May 2026** — Apple petitions for certiorari. **30 Jun 2026** — SCOTUS grants.
- **11 Aug 2026** — district court denies Apple's stay pending SCOTUS review.
- **13 Aug 2026** — Apple files proposed rates: **15%** standard, **10%** partner programmes and subscription renewals, **5%** Small Business Program. Apple concedes in the same filing that under the Ninth Circuit's definition of "necessary costs" the figure "would be essentially zero." Epic gets ~60 days to oppose with expert witnesses; Epic is pushing for 0%.

**Current state: 0% commission on US external-link purchases. Unstable.** *Confidence: High.*

### 8.3 Recommended payment architecture

**Rail A — Apple IAP (primary, all storefronts).** Everything the 18+ app offers is sold through IAP, managed via RevenueCat's mobile SDK for entitlements and cross-platform state. Costs 15–30%. This is the only mainstream-processor path that exists for this business, and it is genuinely the *simplest* path: Apple handles tax, refunds, subscription lifecycle, and — under the app-store accountability laws — a chunk of the age-assurance obligation.

**Rail B — US-storefront external link (optional, opportunistic).** While the commission is 0%, a link to a web checkout is pure margin. But it must terminate at an **adult-capable processor**, because Stripe/Paddle/PayPal are all closed to us. Build it so it can be switched off without a release if the rate moves. Do not make unit economics depend on it.

**Rail C — Web-direct with adult processor (required only if you ship an explicit tier off-app).** CCBill or Segpay as primary with Epoch or Verotel warm as backup — every trade source says the same thing, which is that a single processor is a single point of failure for an adult merchant. Requires: incorporated entity, MCC 5967, ≤22-character billing descriptor matching the DBA, unchecked-by-default subscription consent, named third-party age verification, complaint resolution SLA, and periodic reports to the acquirer.

**Do not build:** a Stripe integration "for the wellness content only" with the erotica content on the same legal entity. Stripe monitors, and their note on content creators is explicit that individual creators on approved platforms are still "subject to monitoring by Stripe to ensure compliance."

---

## 9. TTS / LLM vendor terms — clause by clause

Each row below is the operative clause and where I found it. **This determines the stack.**

### Prohibited — do not build on these

**Anthropic** — `https://www.anthropic.com/legal/aup`
> **Do Not Generate Sexually Explicit Content**
> This includes using our products or services to:
> - Depict or request sexual intercourse or sex acts
> - Generate content related to sexual fetishes or fantasies
> - Facilitate, promote, or depict incest or bestiality
> - Engage in erotic chats

No fiction exemption. Note also the Additional Use Case Guidelines: "All consumer-facing chatbots… must disclose to users that they are interacting with AI rather than a human." **Confidence: High.**

**Microsoft / Azure AI Speech** — `https://learn.microsoft.com/en-us/legal/ai-code-of-conduct` (Microsoft Enterprise AI Services Code of Conduct, which "unifies and replaces the previous codes for Microsoft Generative AI Services, Azure Face in Foundry Tools, and **Azure Speech in Foundry Tools text to speech**")
> **Sexually explicit content**
> Microsoft prohibits content that is erotic, pornographic, or otherwise sexually explicit, **as well as the use of Microsoft AI Services in applications that are sexually explicit**. This includes sexually suggestive content, depictions of sexual activity, and fetish content.

The application-level clause is the killer: even clean input text into Azure TTS is a violation if the app itself is sexually explicit. **Confidence: High.**

**Google (Gemini, Vertex generative models)** — `https://policies.google.com/terms/generative-ai/use-policy`
> 5. Do not engage in sexually explicit, violent, hateful, or harmful activities. This includes generating or distributing content that facilitates:
> …
> 4. **Sexually explicit content** -- for example, content created for the purpose of pornography or sexual gratification.

With: "We may make exceptions to these policies based on educational, documentary, scientific, or artistic considerations, or where harms are outweighed by substantial benefits to the public." Do not plan around that exception.

**Google Cloud Text-to-Speech specifically is more ambiguous.** The general Google Cloud AUP (`cloud.google.com/terms/aup`) has **no adult-content clause** — it bars illegal activity, CSAM, NCEI, defamation, spam, and security abuse. The Generative AI Prohibited Use Policy applies to services designated as Generative AI Services in Google Cloud's Service Specific Terms. Classic Cloud TTS voices probably sit under the plain AUP; Gemini-TTS and Chirp-family generative voices probably sit under the GenAI policy. **I did not verify the Service Specific Terms designation. Confidence: Medium — verify before relying on Cloud TTS.**

**Play.ht / PlayAI** — `https://play.ht/ethical-ai/`
> We enforce a stringent content moderation policy… Topics such as **sexual content**, hate speech, advocacy of self-harm, fraudulent activities, scams, and manipulative political content are explicitly prohibited.

This is on an "Ethical AI" page rather than in the ToS; I did not locate a separate AUP with more precise language. **Confidence: Medium.**

**Resemble AI** — `https://www.resemble.ai/terms-of-service`
> You agree that you will not publish or make available any Content that, or use the Services or any AI Model in a manner that: … **is obscene or pornographic**

Also: "Resemble may require consent from the individual or third party whose voice is being cloned. Consent needs to be verbal, unless otherwise stated by Resemble." **Confidence: High.**

### Permissive or silent — the viable shortlist

**ElevenLabs** — `https://elevenlabs.io/use-policy` (Prohibited Use Policy, last updated 3 September 2025) and `https://elevenlabs.io/terms-of-use`

I read both in full. **Neither contains a general prohibition on adult sexual content.** What they do contain:
> 1(a) Create, distribute or promote sexually explicit material **involving minors**…
> 1(b) Create, distribute, or share age-inappropriate material, including material **that targets minors** and promotes sexual material, graphic violence, obscenity, or other mature themes.
> 5. Do not engage in unauthorized, deceptive or harmful impersonation… creating or using ElevenLabs audio output to intentionally replicate the voice of another person: (a) without consent or legal right… (b) in a way that harasses or causes harm to that person, including via **unauthorized sexualization**; (c) in a manner intended to deceive others about whether the voice was generated by artificial intelligence.
> 8. …This section does not apply to activity in **purely fictional contexts** (e.g. violent speech by a character in a book, video game or movie)…
> 9(r) Making our Services available to anyone under the age of 13, or anyone between the ages of 13-18 without first obtaining parental or guardian consent…

**But the product-specific terms are narrower than the general policy:**
- *Music Terms*: "Customer is expressly prohibited from accessing and using Music if it operates in any of the following sectors: … iv. **adult entertainment or pornographic content**"
- *ElevenAgents Terms* (29 Apr 2026): "Customer shall not use the Customer-Provided LLM to create, generate or distribute **any sexual content**."

So: core TTS appears permitted, Music is expressly closed, Agents/BYO-LLM is expressly closed. Enforcement is "at ElevenLabs' sole discretion" and the policy explicitly disclaims creating any "reasonable expectation" of consistency. **Confidence: High on the text, Low on operational tolerance. Get written confirmation from ElevenLabs sales before committing the stack.**

**AWS Polly** — `https://aws.amazon.com/aup/` (last updated 1 July 2021), `https://aws.amazon.com/ai/responsible-ai/policy/`, `https://aws.amazon.com/service-terms/`

The AUP prohibits illegal/fraudulent activity, violating others' rights, violence/terrorism, "any content or activity that promotes child sexual exploitation or abuse", security abuse, and spam. **No adult-content clause.**

The Responsible AI Policy (which applies to AI/ML Services, and §50.1 of the Service Terms lists **Amazon Polly** as an AI Service) prohibits disinformation, privacy violation, "to depict a person's voice or likeness without their consent… including unauthorized impersonation and non-consensual sexual imagery", minor harm, harassment, safety-filter circumvention, and autonomous weapons. **No adult-content clause.**

The Service Terms clause "Transmit material that is sexually explicit, relates to 'adult services'…" that surfaces in searches appears **only** at §11.6 (Amazon SNS) and §29.5 (AWS End User Messaging) — both messaging products. It does not attach to Polly.

Caveat: §50.3 permits AWS to "use and store AI Content that is processed by… **Amazon Polly**… to develop and improve the applicable AI Service". Your erotic scripts would be training data unless you opt out via an AI services opt-out policy in Organizations. **Do that on day one.** **Confidence: High.**

**Cartesia** — `https://www.cartesia.ai/legal/terms`, `/legal/acceptable-use`, `/legal/disclosure-requirements`

No express adult-content prohibition. The relevant hooks:
> …Make Available… any content that is unlawful, threatening, defamatory, **obscene**, excessively violent, deceptive, fraudulent, libelous, unethical, invasive of privacy or publicity rights, harassing, abusive, hateful, discriminatory, or cruel, **or otherwise use the Services in a manner that is obscene**…
> [prohibited:] Targets minors and promotes sexual content, graphic violence, obscenity, or other mature themes…
> You may only submit your own voice and audio recordings or those of others with explicit consent…
> You may also not use the Services to create Output that relates to, or appears in our sole discretion to relate to or represent, **individuals under the age of 18**.

Plus a hard contractual disclosure requirement:
> You are responsible for providing clear notice to your end users that: They are interacting with AI rather than a human… **You must provide this disclosure immediately prior to any interaction with Cartesia products** — including Sonic, Ink, Line, and Voice Cloning. Users must not be able to access or use the feature without first being presented with this notice.

**Confidence: Medium.** "Obscene" plus sole discretion is a real risk; the "under 18" output clause is broad enough to catch, e.g., a college-freshman character.

**Hume AI** — `https://www.hume.ai/acceptable-use-policy`

Prohibits minor exploitation/sexualisation, deceptive activity, unconsented voice replication, and harmful content (violence, hate, self-harm, harassment, "undermining human dignity"). **No adult-content clause found.** The AUP is short and general, which cuts both ways: nothing bans us, and "undermining human dignity" is elastic. **Confidence: Medium.**

**xAI / Grok** — `https://x.ai/legal/acceptable-use-policy`, `/legal/terms-of-service`, `/legal/terms-of-service-enterprise`

The AUP's sexual-content prohibitions are all about *real people and children*: "Undressing or nudifying real persons, or otherwise altering a real person's image or likeness to depict them in an intimate or sexual context"; "Depicting likenesses of persons in a pornographic manner"; "Sexualizing or exploiting children". No prohibition on adult fiction.

The consumer ToS goes further and affirmatively contemplates adult content:
> …if users choose certain features or input suggestive or coarse language, the Service may respond with some dialogue that may involve coarse language, crude humor, **sexual situations**, or violence.
> [Australia terms] We use age assurance measures to determine whether users in Australia are under 18. Until we are able to determine if a user is 18 or over, they may not be able to access **18+ adult content**.

Enterprise ToS incorporates the same AUP by reference. **This is the most permissive major LLM for our use case.** Counterweight: xAI is under active regulatory pressure (California AG statement, global backlash over Grok image generation in Jan 2026), so its posture may not be stable. **Confidence: Medium.**

**OpenAI** — `https://openai.com/policies/usage-policies/`

**I could not retrieve the live page** (bot protection blocked three fetch attempts). What I can establish:
- The **historic** policy (archived) prohibited "Adult content, adult industries, and dating apps, including: Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness); Erotic chat; Pornography."
- The policy was rewritten on **2025-10-29** "to reflect a universal set of policies across OpenAI products and services." The current universal list surfaced in search covers protecting people, keeping minors safe, and empowering people — with sexual prohibitions scoped to "sexual violence or non-consensual intimate content" and minors. **The flat adult-content prohibition does not appear in the universal list.**
- A secondary policy-analysis source reports a clause that "Some capabilities are off by default but can be enabled by operators who meet eligibility requirements, including explicit adult content."
- OpenAI's **Commerce policies** separately prohibit "Pornography or explicit sexual content, including paid adult subscriptions" — but that governs OpenAI's commerce surfaces, not API usage.
- **"Adult mode" is not live.** Announced Oct 2025 for December; delayed to Q1 2026; delayed again 7 Mar 2026; **paused indefinitely 26 Mar 2026**, reportedly because the age-prediction system misclassified teenagers as adults ~12% of the time.

**Confidence: Low. Do not select OpenAI on the strength of this analysis — read the live "Building with the API" section and get written confirmation.**

### Cross-vendor obligations that apply regardless of which you pick

- **Voice consent.** Every single vendor examined requires that cloned voices be your own or consented. ElevenLabs, Cartesia, Resemble, PlayHT, Hume, xAI and AWS all say some version of this.
- **AI disclosure.** Anthropic and ElevenLabs require consumer-facing chatbots to disclose AI; Cartesia requires a pre-interaction interstitial for *all* its products including plain TTS.
- **Training on your content.** AWS §50.3 opts Polly in by default. Check the equivalent for whichever vendor you choose.

---

## 10. Voice actor and likeness law

### 10.1 Tennessee ELVIS Act (Public Chapter 588, HB 2091 / SB 2096) — in effect since 1 July 2024

Adds an individual's **voice** to Tennessee's personal-rights property interest. Two things make it unusually sharp:
1. Unauthorised AI-generated voice or likeness replicas are directly actionable.
2. **Distributing a tool whose primary purpose is producing an identifiable person's voice or likeness without authorisation is itself actionable.** That reaches toolmakers, not only content publishers.

Labelling content as AI-generated does not substitute for consent. Private right of action with statutory damages and injunctive relief. **Confidence: Medium — secondary tracker anchored to the enacted public chapter; I did not read the statutory text directly.**

### 10.2 California AB 1836 and AB 2602 — both effective 1 January 2025

**AB 2602** (contracts) makes a personal/professional services contract provision **unenforceable** as to a new digital-replica performance if:
> (1) The provision allows for the creation and use of a digital replica of the individual's voice or likeness **in place of work the individual would otherwise have performed in person**

…and the further statutory conditions are met (broadly: the contract does not include a reasonably specific description of the intended uses, *and* the individual was not represented by counsel or a union-negotiated agreement).

"Digital replica" is defined as "a computer-generated, highly realistic electronic representation that is readily identifiable as the voice or visual likeness of an individual that is embodied in a sound recording, image, audiovisual work, or transmission in which the actual individual either did not actually perform or appear, or the actual individual did perform or appear, but the fundamental character of the performance or appearance has been materially altered."

**Practical consequence for us:** a blanket "we may clone your voice for any purpose forever" clause in a voice-actor agreement is **void** in California. You need a **reasonably specific description of the intended uses** — and for an erotic-audio product that means naming adult content explicitly, in the contract, before the session.

**AB 1836** covers deceased personalities' digital replicas — relevant only if you license an estate's voice. Don't.

**Confidence: High on AB 2602's core mechanism (read from the bill text on leginfo.legislature.ca.gov); Medium on the full condition list.**

### 10.3 NO FAKES Act (S.4591) — **not law**

Ordered reported out of the Senate Judiciary Committee by voice vote on **18 June 2026**. Has **not** passed either chamber and has not been signed. If enacted it would create a federal digital-replica right with platform exposure reported at up to $750,000 per work, a DMCA-style notice-and-takedown safe harbour with a stay-down obligation, and carve-outs added to address First Amendment criticism. **Treat as a planning signal, not a current obligation.** Current liability comes from state statutes. **Confidence: High on status.**

### 10.4 EU AI Act Article 50 — **applicable since 2 August 2026**

Twelve days old as of this research. Two distinct duties that are commonly conflated:

**Art. 50(2) — provider duty, machine-readable marking.** Providers of AI systems generating synthetic audio, image, video or text must ensure output is "marked in a machine-readable format and detectable as artificially generated or manipulated", using solutions that are "effective, interoperable, robust and reliable as far as technically feasible". Systems placed on the EEA market **before** 2 Aug 2026 have until **2 December 2026** for this duty only.

**Art. 50(4) — deployer duty, deepfake disclosure.** Deployers of AI systems producing deepfake content must clearly label it as AI-generated or manipulated. Per the regulation's framing, the label must be perceivable by the audience — **audible in the case of audio content** — and "placed in a way that is apparent to the audience, not only embedded in metadata."

**Art. 50(1)** — users must be informed when they are interacting directly with an AI system, unless obvious from context.

Penalties: up to €15,000,000 or 3% of worldwide turnover.

**Confidence: High on dates and structure (Morgan Lewis, EU regulatory trackers, aligned across four independent sources). Medium on whether *our* content is a "deepfake" under Art. 50(4).** The AI Act's deepfake definition (Art. 3(60)) turns on content resembling **existing persons** — a wholly synthetic voice that resembles nobody arguably is not a deepfake, in which case 50(4) does not bite. But if we clone a real voice actor's voice, it plainly does.

### 10.5 Do we have to disclose AI-generated voices?

**Yes, on at least four independent grounds, and you should just do it prominently:**

1. **EU AI Act Art. 50(1)/(4)** — as above, from 2 Aug 2026.
2. **Cartesia's contract**, if you use Cartesia — a mandatory pre-interaction interstitial, no exceptions.
3. **ElevenLabs PUP §5(c)** — do not use their output "in a manner intended to deceive others about whether the voice was generated by artificial intelligence."
4. **Apple guideline 2.3** — metadata must "accurately reflect the app's core experience", and 5.6 forbids "manipulative practices". Marketing synthetic voices as "real voice actors" would be a Developer Code of Conduct problem, and note that Dipsea and Bloom both explicitly advertise *human* voice actors ("voiced by real people", "professional writers and voice actors") — competitors are differentiating on exactly this, so any ambiguity in your copy will be read against you.

**Recommendation:** disclose AI voices in the App Store description, in onboarding, and in a persistent per-story credit. Treat it as a product feature ("infinitely consistent narrators, always available") rather than a disclaimer.

### 10.6 If you clone or license a real voice — contract checklist

- Written consent **specific to AI voice model training**, naming adult/erotic content as an intended use (AB 2602's specificity requirement)
- Scope: territory, term, media, genre, and an explicit list of prohibited contexts
- Revocation mechanics and what happens to already-published audio on revocation
- Confirmation the actor was represented by counsel or a union agreement (this is one of AB 2602's conditions)
- Compensation model for synthetic performances, separate from session fees
- Tennessee ELVIS Act compliance if any Tennessee nexus
- The vendor's own consent-verification step (Resemble may require verbal consent on record; ElevenLabs Professional Voice Cloning has a verification captcha)
- Card-network requirement (§C-10) of "written consent on file for every depicted person, producible within 48 hours"

---

## 11. Other exposure

### 11.1 CSAM

**18 U.S.C. §1466A** ("Obscene visual representations of the sexual abuse of children") is limited by its own title and text to **visual** depictions. Audio and text are outside it. **But** federal obscenity statutes (§§1462, 1465, 1466) are media-agnostic and expressly name sound recordings, so obscene audio sexualising minors is prosecutable through that route, and every vendor AUP examined treats it as a zero-tolerance, report-to-NCMEC category.

**Operationally this is the single highest-severity risk in the product**, and it is almost entirely a function of whether you accept free-text user prompts. A fixed library with human review cannot produce this failure. A prompt box can, on day one, by accident or by a determined user. If you ship prompts: age-related keyword and semantic blocking on input, output classification, human review of flagged items, a preservation-and-report process, and NCMEC reporting capability. Cartesia's clause is instructive — they prohibit output that "appears in our sole discretion to relate to or represent, individuals under the age of 18", which is broader than you might design for and includes ambiguous youthfulness cues.

### 11.2 Obscenity — US federal

- **§1462** — importation/transportation via common carrier or **interactive computer service** of "any obscene, lewd, lascivious, or filthy book, pamphlet, picture, motion-picture film, paper, letter, writing, print, … or **filthy phonograph recording, electrical transcription, or other article or thing capable of producing sound**". Amended in 1996 to reach interactive computer services.
- **§1465** — transportation/use of a facility of interstate commerce or an interactive computer service for the purpose of sale or distribution of obscene matter, "**phonograph recording, electrical transcription or other article capable of producing sound**". Up to 5 years.
- **§1466** — engaging in the business of selling/transferring obscene matter, expressly including "**phonograph or other audio recording**". Up to 5 years.

All are limited by *Miller v. California*, 413 U.S. 15 (1973): (1) prurient interest by contemporary community standards, taken as a whole; (2) patently offensive depiction **or description** of specified sexual conduct; (3) lacks serious literary, artistic, political or scientific value (assessed by a *reasonable person*, per *Pope v. Illinois*, not community standards).

**Risk assessment:** low but non-zero. Narrative fiction with characters, plot and production values has a strong prong-three defence. The community-standards prong is the exposure — *United States v. Thomas* (6th Cir. 1996) upheld §1465 convictions where content uploaded in California was downloaded in Memphis, applying Memphis community standards. Ask counsel whether to geofence the most explicit tier away from the most conservative jurisdictions. *Confidence: Medium — the statutes are quoted from a DOJ OIG appendix and CRS report, both reliable, but I did not check for post-2009 amendments.*

### 11.3 18 U.S.C. §2257 record-keeping — does not apply

§2257(a) attaches to producers of matter that "contains one or more **visual depictions**… of actual sexually explicit conduct" and requires records "pertaining to every performer portrayed in **such a visual depiction**." Audio-only content with no visual depictions and no actual sexual conduct by real performers is outside the statute. **Confidence: High.**

Note the mismatch with §C-10: card networks may still demand consent documentation for "every depicted person" as a *contractual* condition even where §2257 does not apply. Keep voice-actor consent files anyway.

### 11.4 Section 230 — almost certainly does not protect our content

47 U.S.C. §230(c)(1) protects a provider from being treated as the publisher of information "provided by **another** information content provider." Our audio is written (or generated) and published by us. There is no other information content provider. **§230 is not in the picture for first-party content — this is the least controversial proposition in this document.**

For generated content the analysis is newer but points the same way. In *Garcia v. Character Technologies, Inc.*, No. 6:24-cv-01903 (M.D. Fla., order of 21 May 2025), Judge Anne Conway denied most of a motion to dismiss in a wrongful-death case, treating Character.AI as a **product** subject to product-liability doctrine rather than a publisher of third-party speech, declining at the pleadings stage to hold "that [large language model] output is speech", and allowing component-part-manufacturer claims against Google to proceed. Section 230 was not a controlling defence. Character.AI and Google settled in January 2026.

Separately, on 10 August 2026 a Ninth Circuit panel (Nguyen J.) held in the consolidated social-media addiction MDL appeals that **Section 230 provides a defence against liability, not immunity from suit** — which matters for litigation cost even where the defence ultimately wins. *Confidence: High on Garcia; Medium on the Ninth Circuit holding, which comes from a secondary tracker four days after the fact.*

**Implication:** we are the publisher of everything in the app. Our defences are the First Amendment, Miller's third prong, and good editorial practice — not a statutory shield. That argues for editorial control being a *feature* of the architecture, not a cost centre.

### 11.5 DMCA and content liability

- **Our own content:** DMCA §512 safe harbours are for hosting third-party material. They don't apply to first-party audio. If an LLM-written script reproduces protected expression (a scene from a published romance novel, song lyrics in a script), we are directly liable. **Mitigation:** originality checks on generated scripts; never prompt with copyrighted source text; keep provenance records.
- **Apple guideline 5.2.1:** "Apps should be submitted by the person or legal entity that owns or has licensed the intellectual property and other relevant rights."
- **Apple guideline 5.2.2:** "If your app uses, accesses, monetizes access to, or displays content from a third-party service, ensure that you are specifically permitted to do so under the service's terms of use. **Authorization must be provided upon request.**" If challenged, we must show our TTS vendor's terms permit our use — which loops straight back to §9. If we build on a vendor whose AUP arguably prohibits us, this guideline is the mechanism by which that becomes an App Store problem.
- **Voice model IP:** confirm the vendor grants commercial rights to output. ElevenLabs Studio, for instance, is "made available solely for your personal, non-commercial use" unless on an Enterprise plan.

### 11.6 Hidden features and out-of-app content

**Guideline 2.3.1(a):**
> Don't include any hidden, dormant, or undocumented features in your app; your app's functionality should be clear to end users and App Review. All new features, functionality, and product changes must be described with specificity in the Notes for Review section of App Store Connect (**generic descriptions will be rejected**) and accessible for review. Similarly, marketing your app in a misleading way, such as by promoting content or services that it does not actually offer… is grounds for removal of your app from the App Store or a block from installing via alternative distribution **and termination of your developer account**.

**Guideline 2.3.1(b):** "Egregious or repeated behavior is grounds for removal from the Apple Developer Program."

**Guideline 2.5.2:** apps "may not download, install, or execute code which introduces or changes features or functionality of the app". Downloading *audio assets* is content, not code, and is fine — but a remote config flag that switches the app into a materially different (more explicit) mode after review is exactly the pattern this guideline exists to catch.

**The rule to operate by:** the web tier can exist, and Bloom demonstrates it survives. But describe it in review notes, give App Review a working demo account that sees everything the app can show, and never let the shipped binary do something the reviewer could not have seen.

---

## 12. Sources

### Apple
- App Review Guidelines (Last Updated: June 8, 2026) — https://developer.apple.com/app-store/review/guidelines/
- Age ratings values and definitions — https://developer.apple.com/help/app-store-connect/reference/age-ratings/
- Age assurance frameworks Q&A — https://developer.apple.com/support/age-assurance/
- Updated age ratings in App Store Connect — https://developer.apple.com/news/?id=ks775ehf
- Age Rating Updates (upcoming requirements) — https://developer.apple.com/news/upcoming-requirements/?id=07242025a
- Update for Apps Distributed in Texas (3 Jun 2026) — https://developer.apple.com/news/?id=sg176nne
- Next steps for apps distributed in Texas — https://developer.apple.com/news/?id=2ezb6jhj
- Design safe and age-appropriate experiences — https://developer.apple.com/kids/
- Deliver age-appropriate experiences in your app (WWDC25 session 299) — https://developer.apple.com/videos/play/wwdc2025/299/

### Competitor App Store listings
- Dipsea: Audio Stories — https://apps.apple.com/us/app/dipsea-audio-stories/id1434242889
- Quinn — Audio Stories — https://apps.apple.com/us/app/quinn-audio-stories/id1565600312
- Bloom Stories: Spicy Audio — https://apps.apple.com/us/app/bloom-stories-spicy-audio/id6455040628
- Bloom Stories web FAQ (platform-restricted content) — https://bloomstories.com/

### Apple enforcement on AI sexual content
- The Verge, "Apple confirms it took down AI 'nudify' apps" — https://www.theverge.com/tech/967623/apple-confirms-it-took-down-ai-nudify-apps
- Ars Technica, "San Francisco orders Apple, Google to remove nudify apps" (Jul 2026) — https://arstechnica.com/tech-policy/2026/07/apple-google-must-stop-profiting-off-ai-nudify-apps-san-francisco-ag-says/

### UK
- Online Safety Act 2023, Part 5 (ss.79–82) — https://www.legislation.gov.uk/ukpga/2023/50/part/5
- Online Safety Act 2023, Part 3 Ch.7 (s.61 text-only carve-out) — https://www.legislation.gov.uk/ukpga/2023/50/part/3/chapter/7
- Ofcom, Guidance on highly effective age assurance and other Part 5 duties (s.82 statutory guidance) — https://www.ofcom.org.uk/siteassets/resources/documents/consultations/category-1-10-weeks/statement-age-assurance-and-childrens-access/guidance-on-highly-effective-age-assurance-and-other-part-5-duties.pdf
- Ofcom, Age checks to protect children online — https://www.ofcom.org.uk/online-safety/protecting-children/age-checks-to-protect-children-online
- Reed Smith, UK Online Safety Act enforcement tracker — https://www.reedsmith.com/topics/uk-online-safety-act-2023/

### US age verification
- *Free Speech Coalition, Inc. v. Paxton*, No. 23-1122 (2025) — https://www.law.cornell.edu/supremecourt/text/23-1122
- SCOTUSblog case coverage — https://www.scotusblog.com/2025/06/court-allows-texas-law-on-age-verification-for-pornography-sites/
- ACLU case page — https://www.aclu.org/cases/free-speech-coalition-inc-v-paxton
- Free Speech Coalition, Age Verification Bill Tracker — https://action.freespeechcoalition.com/age-verification-bills/
- EFF, Age Verification Resource Guide (Apr 2026) — https://www.eff.org/files/2026/04/09/condensed-age_verification_resource_guide.pdf
- US Age Verification Laws live tracker (secondary, methodologically transparent) — https://closednetwork.io/us-age-verification-laws-live-tracker/
- Barclay Damon on Texas SB 2420 scope — https://www.barclaydamon.com/alerts/could-your-website-be-an-app-store-under-texass-app-store-accountability-act

### EU
- Commission Recommendation (EU) 2026/1035 on EU-wide Age Verification technologies (29 Apr 2026) — https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202601035
- Commission guidelines on the protection of minors under the DSA (14 Jul 2025) — https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors
- Commission age-verification blueprint, second version — https://digital-strategy.ec.europa.eu/en/news/commission-releases-enhanced-second-version-age-verification-blueprint
- Freshfields, DSA decoded #6 — https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/dsa-decoded-6-the-european-commission-finalises-guidelines-on-the-protection-of-102kv4s
- Morgan Lewis, EU AI Act's Transparency Rules: What Went Into Effect on 2 August (Aug 2026) — https://www.morganlewis.com/blogs/sourcingatmorganlewis/2026/08/eu-ai-acts-transparency-rules-what-went-into-effect-on-2-august
- Regulation-AI, Article 50 transparency obligations — https://www.regulation-ai.eu/en/transparency-obligations/

### Payments
- Stripe, Prohibited and Restricted Businesses — https://stripe.com/legal/restricted-businesses
- Paddle AUP, "What Am I Not Allowed To Sell?" (updated 13 Apr 2026) — https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
- PayPal, policy on sexually oriented goods and services — https://www.paypal.com/us/cshelp/article/what-is-paypal%E2%80%99s-policy-on-transactions-that-involve-sexually-oriented-goods-and-services-help384
- RevenueCat Terms and Conditions — https://www.revenuecat.com/terms
- RevenueCat Web overview (billing engines) — https://www.revenuecat.com/docs/web/overview
- RevenueCat Billing configuring overview (Stripe as gateway) — https://www.revenuecat.com/docs/web/web-billing/configuring-overview
- Shinder Cantor Lerner, Ninth Circuit upholds Apple contempt finding, narrows remedy — https://scl-llp.com/ninth-circuit-upholds-apple-contempt-finding-but-narrows-scope-of-remedial-relief/
- The Verge, Apple and Epic argue over external purchase fees (Aug 2026) — https://www.theverge.com/tech/979967/apple-epic-games-external-links-fees-filing
- AppleInsider, Apple's proposed external purchase commissions (13 Aug 2026) — https://appleinsider.com/articles/26/08/13/apples-latest-commission-rates-for-external-app-store-purchases-havent-satisfied-epic
- The Verge, Stripe apologises over LGBTQ content statements (itch.io context) — https://www.theverge.com/report/758927/stripe-lgbt-content-statement-itchio-adult-content
- Adult processor comparisons (secondary, pricing unverified) — https://www.adults.dev/Article/adult-payment-processing-ccbill-vs-verotel-vs-epoch-vs-stripe-full-comparison ; https://2much.net/payment-processors/comparison.php
- Card network compliance overview (secondary) — https://makeapornsite.com/card_network_compliance

### AI / TTS vendor policies
- Anthropic Usage Policy — https://www.anthropic.com/legal/aup
- Microsoft Enterprise AI Services Code of Conduct — https://learn.microsoft.com/en-us/legal/ai-code-of-conduct
- Google Generative AI Prohibited Use Policy — https://policies.google.com/terms/generative-ai/use-policy
- Google Cloud Acceptable Use Policy — https://cloud.google.com/terms/aup
- Google Cloud Text-to-Speech quotas & terms pointer — https://docs.cloud.google.com/text-to-speech/quotas
- AWS Acceptable Use Policy — https://aws.amazon.com/aup/
- AWS Responsible AI Policy — https://aws.amazon.com/ai/responsible-ai/policy/
- AWS Service Terms (§11.6 SNS, §29.5 End User Messaging, §50 AI Services) — https://aws.amazon.com/service-terms/
- Amazon Polly AI Service Card — https://docs.aws.amazon.com/ai/responsible-ai/amazon-polly/overview.html
- ElevenLabs Prohibited Use Policy (3 Sep 2025) — https://elevenlabs.io/use-policy
- ElevenLabs Terms of Service — https://elevenlabs.io/terms-of-use
- ElevenLabs Music Terms — https://elevenlabs.io/music-terms
- ElevenLabs Agents Terms (29 Apr 2026) — https://elevenlabs.io/agents-terms
- ElevenLabs Studio Terms — https://elevenlabs.io/studio-terms
- Cartesia Terms of Service — https://www.cartesia.ai/legal/terms
- Cartesia Acceptable Use Policy — https://www.cartesia.ai/legal/acceptable-use
- Cartesia Disclosure Requirements — https://www.cartesia.ai/legal/disclosure-requirements
- Hume AI Acceptable Use Policy — https://www.hume.ai/acceptable-use-policy
- Play.ht, Our Commitment to Ethical AI — https://play.ht/ethical-ai/
- Resemble AI Terms of Service — https://www.resemble.ai/terms-of-service
- xAI Acceptable Use Policy — https://x.ai/legal/acceptable-use-policy
- xAI Terms of Service (Consumer) — https://x.ai/legal/terms-of-service
- xAI Terms of Service (Enterprise) — https://x.ai/legal/terms-of-service-enterprise
- OpenAI Usage Policies (could not fetch live; see §9) — https://openai.com/policies/usage-policies/
- OpenAI Commerce Policies — https://openai.com/policies/commerce-policies/
- Stability AI Acceptable Use Policy — https://stability.ai/use-policy
- AssemblyAI Acceptable Use Policy — https://www.assemblyai.com/legal/acceptable-use-policy
- TechCrunch, OpenAI delays ChatGPT's 'adult mode' again (7 Mar 2026) — https://techcrunch.com/2026/03/07/openai-delays-chatgpts-adult-mode-again/
- Futurism, OpenAI pauses adult mode indefinitely — https://futurism.com/artificial-intelligence/openai-cancels-spicy-chatbot
- Decrypt / WSJ reporting on age-prediction error rate — https://decrypt.co/361279/openai-chatgpt-erotica-mode-sexy-suicide-coach-warning-wsj

### Voice, likeness, and AI transparency
- California AB 2602 bill text — https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB2602
- Tennessee ELVIS Act (HB 2091 / SB 2096, Public Chapter 588) — https://ai-law-tracker.com/laws/bill/tennessee-elvis-act
- Recording Law, NO FAKES Act advances out of Senate Judiciary (18 Jun 2026) — https://www.recordinglaw.com/news/no-fakes-act-senate-judiciary-committee/
- Billboard, NO FAKES Act committee vote — https://www.billboard.com/pro/ai-no-fakes-act-advances-in-congress/

### Obscenity, CSAM, Section 230
- DOJ, Citizen's Guide to U.S. Federal Law on Obscenity — https://www.justice.gov/criminal-ceos/citizens-guide-us-federal-law-obscenity
- DOJ OIG, statutory text of §§1460–1466 — https://oig.justice.gov/reports/plus/e0107/app2.htm
- CRS, Obscenity and Indecency: Constitutional Principles and Federal Statutes — https://www.everycrsreport.com/files/20090428_95-804_13409b7ce179c1bd4b7d21de0e1307fc2ba08ad9.pdf
- 18 U.S.C. §2257 — https://uscode.house.gov/view.xhtml?edition=prelim&req=granuleid%3AUSC-prelim-title18-section2257
- *Garcia v. Character Technologies, Inc.*, No. 6:24-cv-01903 (M.D. Fla.) — court filings — https://storage.courtlistener.com/recap/gov.uscourts.flmd.433581/gov.uscourts.flmd.433581.85.0.pdf
- LexSummary analysis of the 21 May 2025 order — https://lexsummary.com/garcia-v-character-technologies-ai-chatbot-wrongful-death/
- Quartz, Why Section 230 doesn't protect AI chatbots — https://qz.com/section-230-ai-chatbots-legal-immunity-generative-content-072826

### Sources I could not retrieve
- `https://openai.com/policies/usage-policies/` — blocked by bot protection on three attempts (direct, en-GB locale, proxy). Findings in §9 rest on search-surfaced page content plus the Internet Archive's copy of the superseded policy.
- `https://statutes.capitol.texas.gov/Docs/CP/htm/CP.129B.htm` — timed out. Texas statutory language in §7.2 is quoted from the Supreme Court's opinion in *FSC v. Paxton*, which is an authoritative rendering.
- Google Cloud Service Specific Terms designation for Cloud Text-to-Speech — not checked; §9 flags this as an open item.
