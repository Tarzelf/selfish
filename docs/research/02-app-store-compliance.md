# App Store Compliance: Shipping an AI Audio Erotica App on iOS

> Research pass 1 — produced by compliance-research agent, Aug 2026.

## 1. What Apple actually prohibits (and the loophole audio lives in)

**Guideline 1.1.4** prohibits "overtly sexual or pornographic material, defined as 'explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings,'" including apps that "may include pornography" ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)). Apple's public statements are harsher than its practice. Yet Quinn, Dipsea, Bloom, and Femtasy all live on the App Store. The de facto line Apple enforces:

- **Visual porn: never.** Audio and text erotica: tolerated when framed as *fiction/romance/wellness* with an 18+ rating and clean metadata.
- **Dipsea** (18+, "Dipsea: Spicy Romantic Fiction") describes itself as "spicy audiobooks," "romance," "by women, for women," "sleep and wellness sessions" — the word "erotic" doesn't appear in its iOS description, while its [Google Play listing](https://play.google.com/store/apps/details?id=com.dipsea) freely says "erotic audio stories, sexy literotica." Content descriptors: "Frequent Mature/Suggestive Themes, Sexual Content or Nudity" ([App Store listing](https://apps.apple.com/us/app/dipsea-spicy-romantic-fiction/id1434242889)).
- **Quinn** (18+) says only "Listen to immersive stories from your favorite voices… Created by women for the world," with press quotes doing the winking ("Spotify for erotica" — Vogue). Its listing shows "In-App Controls" and "Age Assurance" badges under the new rating system ([App Store listing](https://apps.apple.com/us/app/quinn-audio-stories/id1565600312)).
- The NYT documented this as deliberate: "Situating pleasure in a wellness wrapper has allowed them to exist on Apple's app store" ([NYT, 2023](https://www.nytimes.com/interactive/2023/07/31/style/dipsea-audio-stories.html)).
- Screenshots/metadata must be rated **4+ regardless of the app's rating** (Guideline 2.3.8) — all of these apps use abstract illustrations, tasteful photography, category grids; nothing explicit.

## 2. AI-specific rules and enforcement history

There is no standalone "generative AI guideline"; Apple applies existing rules plus these AI-relevant updates:

- **March 2024**: Apple updated 4.3(a)/(b) (spam); low-effort GPT wrappers and the flood of "AI girlfriend" apps get rejected under **4.3** — your app needs a "meaningfully different or improved experience."
- **April 2024**: Apple removed AI "undress"/nudify apps after 404 Media's investigation ([404 Media](https://www.404media.co/apple-removes-nonconsensual-ai-nude-apps-following-404-media-investigation/)); in 2026 it removed more and terminated developer accounts after the SF City Attorney's demand. Key lesson: apps were killed for *how they advertised* (off-platform ads promising porn), not just in-app content. Guideline **2.3.1** covers hidden/undocumented features; **5.6** (Developer Code of Conduct) lets Apple terminate accounts for dishonesty or "excessive customer reports."
- **AI companions**: Replika (17+, now 18+) survived by dialing back erotic roleplay after Italy's Garante ban in Feb 2023. Companion apps like EVA AI remain listed with sanitized descriptions. The pattern: flirty/suggestive AI is tolerated; explicit generation marketed as such is not.
- **November 13, 2025 guideline update** ([Apple news](https://developer.apple.com/news/?id=ey6d8onl)): **5.1.2(i)** now requires clear disclosure and *explicit user permission* before sharing personal data with **third-party AI** (relevant if prompts go to OpenAI/ElevenLabs); **1.2.1(a)** and **4.7.5** require creator content exceeding the app's rating to be gated by "an age restriction mechanism based on verified or declared age."

## 3. Age ratings and age-assurance laws

- **July 2025**: Apple replaced 12+/17+ with **13+/16+/18+** tiers; all apps re-rated; a new mandatory questionnaire (in-app controls, capabilities, wellness content) was due **January 31, 2026** ([Apple](https://developer.apple.com/news/?id=ks775ehf)). Answer "Sexual Content or Nudity: Frequent/Intense" → **18+** (like Quinn/Dipsea).
- **Texas SB 2420 (App Store Accountability Act)**: in effect since **June 4, 2026** after the Fifth Circuit stayed an injunction ([Apple](https://developer.apple.com/news/?id=sg176nne)). Apple performs age assurance on new Texas Apple Accounts; developers of 18+ apps should adopt the **Declared Age Range API** (under 13, 13–15, 16–17, 18+), the **Significant Change API** (PermissionKit), StoreKit's age-rating property, and App Store Server Notifications for consent revocation (iOS 26.2+; [Apple guidance](https://developer.apple.com/news/?id=2ezb6jhj)). Utah, Louisiana, and California laws follow in 2026–2027.
- Practically: an 18+ app should also do its own declared-age gate (birthdate at signup) plus 18+ terms of service, like Quinn.

## 4. Payments

Digital audio subscriptions **must offer Apple IAP** (Guideline 3.1.1). But after the **April 30, 2025** contempt ruling in *Epic v. Apple*, Apple updated 3.1.1/3.1.3 for the **US storefront**: apps may include buttons/links to web checkout with **no entitlement, no commission, no design restrictions** ([Apple](https://developer.apple.com/news/?id=9txfddzf)). Status as of mid-2026: the Ninth Circuit (Dec 2025) vacated the total commission ban and remanded; SCOTUS granted cert (June 2026); **link-outs remain allowed and commission-free for now**. Quinn and Dipsea both use standard IAP subscriptions *and* sell web subscriptions on their own sites. Recommended: IAP as default, plus a US web-checkout link at lower price.

## 5. UGC vs. first-party AI content

The biggest structural decision:

- **Curated catalog (developer-generated AI audio, fixed library)**: **first-party content**, not UGC. Guideline 1.2's moderation stack doesn't apply. You are simply the publisher — like Dipsea. **Strongly preferred for v1.**
- **User-typed prompts → generated audio**: Apple treats user-directed generative output like UGC/chatbot content. Then required (per 1.2 and 4.7.1): **filtering, a reporting mechanism with timely responses, blocking**, plus server-side prompt/output filtering (no minors, no non-consent, no real-person impersonation — the nudify precedent shows real-person content is the death sentence). Under 1.2.1(a)/4.7.5 also age-gating of content exceeding the rating. Under **5.1.2(i)**, disclose and get consent before sending prompts to third-party AI providers.

## 6. Google Play comparison

Play is **stricter**: it bans "content or services intended to be sexually gratifying" outright, with only a narrow **catalog-app carve-out**: book/audiobook catalog apps may include sexual titles if they're "a minor fraction of the overall catalog," not actively promoted, access-restricted from minors ([Play policy](https://support.google.com/googleplay/android-developer/answer/9878810)). Dipsea/Quinn ship on Play under this carve-out — but a *predominantly* erotic catalog technically exceeds it, so Android risk is higher. Many competitors keep the explicit tier web-only on Android.

---

## Compliance Playbook Checklist

**Positioning & metadata**
1. App name/subtitle: "audio stories," "romantic fiction," "sleep & relaxation" — never "erotica/porn/NSFW/sexy" in iOS metadata; "spicy," "romance," "for women" are proven safe (Dipsea/Quinn).
2. Icon and all screenshots must pass a **4+ bar** (2.3.8): abstract art, UI shots of category browsing, no suggestive imagery or explicit titles visible.
3. Never advertise explicit capability off-platform in ways that contradict the listing (2.3.1/5.6 — the nudify-app killer).

**Ratings & age**
4. Answer the new questionnaire honestly → **18+** ("Frequent Sexual Content or Nudity"; also declare wellness content) (2.3.6).
5. In-app: account required, declared birthdate gate (18+), spicy content hidden behind an explicit opt-in toggle defaulted off; complete the new "In-App Controls" and "Age Assurance" fields.
6. Implement **Declared Age Range API + Significant Change API + StoreKit age-rating property + server notifications** for Texas/Utah/Louisiana (iOS 26.2+).

**Content architecture**
7. Ship v1 as a **curated, developer-generated catalog** (no user prompts) → avoids Guideline 1.2 entirely. Lead the catalog with the focus/ASMR/sleep tier (genuine wellness value also defends against 4.3 spam).
8. Audio only, no explicit imagery; keep the most explicit tier web-only for maximum safety (Apple only reviews what's in the app).
9. If/when adding custom prompts: server-side prompt+output moderation (block minors, non-consent, real persons/impersonation), in-app **report/flag button, user blocking, filtering controls** (1.2/4.7.1), and treat generated content as exceeding-rating content behind the age gate (1.2.1(a)/4.7.5).
10. Disclose third-party AI processing and obtain explicit consent (5.1.2(i)); accurate App Privacy labels.

**Payments**
11. Offer IAP subscriptions (3.1.1/3.1.2) with clear pricing in the description; optionally add a **US-storefront web checkout link** (3.1.1(a), commission-free as of now) and sell freely on the website.

**Review & risk management**
12. In App Review Notes: describe the app honestly ("mature romantic audio fiction, 18+, comparable to Dipsea/Quinn"), provide a demo account with content visible — hiding content from reviewers is a terminable offense.
13. Differentiate meaningfully (personalization, voice quality, wellness features) to clear **4.3**; avoid "AI" being the entire pitch.
14. Android: keep the Play catalog majority non-sexual or route explicit content to web to fit Play's catalog carve-out.

**Bottom line**: an 18+ "spicy audio fiction + wellness" app with a curated AI-generated catalog, sanitized metadata, in-app age controls, and IAP is squarely within the proven Quinn/Dipsea envelope; user-prompted generation is possible but adds the full UGC moderation stack and most of the enforcement risk.
