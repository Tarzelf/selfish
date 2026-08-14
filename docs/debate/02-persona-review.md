# Persona Review Panel — "Selfish"

**Review date:** 14 August 2026
**Under review:** `docs/plan/00-product-thesis.md` (v0 concept)
**Inputs:** the thesis; `docs/research/01-market-landscape.md` (voice-of-customer sections); `docs/research/02-compliance-and-legal.md` §§1–2; plus fresh primary evidence gathered for this review (App Store review pages fetched live 14 Aug 2026, peer-reviewed and industry studies, trademark records — see Sources).

**Convention used throughout:**
`[EVIDENCE]` = something a real user, study, or company actually said, with a source.
`[INFERENCE]` = my reasoning from that evidence. The personas are `[INFERENCE]` by construction — they are composites built on quoted user language, not real people, and nothing they "say" should be quoted as user research.

---

## Executive summary

**The panel's verdict: the product is directionally right and the packaging is wrong.** Six of seven personas would install it. Three would pay after a trial. Two would cancel inside week one. The strategy — a very good private audio player, a warm-up-first entry, a genuinely good Focus room as cover — survives contact with the evidence better than the thesis deserves. Four specific decisions do not.

**What tested badly, in order of severity:**

1. **"The voices are AI-generated" is the single worst-testing element in the concept.** It is not close. Five of seven personas downgrade the product on disclosure, one of them to zero. The counter-evidence is real and important — in blind tests listeners cannot tell, and actually prefer AI multi-cast for character-driven fiction (Edison/SSRS, May 2026) — but it cuts precisely the wrong way for us: the problem is not the audio, it is *the label*, and the label is legally mandatory in the EU from 2 August 2026. Meanwhile "100% human" has become an actively marketed competitive claim since Dipsea's June 2026 reversal, and App Store reviewers already use "this felt like AI" as a synonym for "bad."
2. **The name.** Split 3–4 against, and the four against include the three personas who most need the product. "Selfish" is not a neutral word being reclaimed; it is *the specific accusation* the target demographic spends emotional energy rebutting — "self-care is not selfish" is a stock phrase in exactly this audience's media. It also fails the discretion test the rest of the app is built around, and there is a live USPTO application for `SELF!SH` in the wellness-app class plus two existing App Store apps named "Selfish."
3. **Your name, whispered.** The most polarising single feature tested. Two personas called it the best idea in the deck; three called it creepy, invasive, or a dealbreaker; one flagged it as a security problem. Critically, it is the *one* feature that contradicts the privacy architecture: a name-spliced render is a user-specific audio file, so it cannot share the CDN cache, and it means the app must store your first name and put it inside an erotic audio artefact.
4. **ASMR as a core aesthetic, unlabelled.** Misophonia is estimated at ~20% of the population, and the loudest ASMR complaint in the existing corpus is not "I dislike it," it is *"it's a sensory nightmare... they need a trigger warning... Tag it."* Building the house style on wet mouth sounds means building a product that a fifth of the addressable market experiences as an assault.

**What tested well:** the warm-up default (5/7 positive, and the one strong objection is fixable); Focus + Desire bundled (6/7 positive, mostly as cover); on-device history and no analytics SDKs (7/7, and it is the only element with unanimous support); the intensity dial as a user-held control; alternate app icon and Face ID.

**The single feature most likely to drive word-of-mouth is not any of the AI features.** It is **discretion engineering** — specifically, never auto-resuming over CarPlay/Bluetooth. Three independent users of two different competitors have publicly threatened or executed cancellation over exactly this, including one whose app started playing erotica on CarPlay as her 12-year-old was about to get in the car. This is a shareable, sayable, one-sentence reason to switch that no competitor has claimed.

**Name verdict: change it.** Keep "Be selfish with your attention" as campaign copy, retire it as the product name. Specific alternatives to test in §9.3.

**Name-whispering verdict: do not ship it in v1 as designed.** Ship it, if at all, as an off-by-default toggle gated behind a pronunciation preview, never in Focus, never in a notification, never in a filename, and never synced off-device. As a default-on "how did it know" moment it is more likely to produce a one-star review than a screenshot.

---

# Part 1 — The evidence base

This is what real users of this category actually say. Everything in this section is `[EVIDENCE]` with a source in §11. Quotes preserve original typos.

## 1.1 What I could and could not reach

**Reached and verified:** live App Store review pages for Quinn, Dipsea, Emjoy, Bloom Stories, Kama and Whisper Stories (fetched 14 Aug 2026); peer-reviewed misophonia and AI-bias literature; the Edison Research/SSRS AI-audiobook study; USPTO trademark records; Dipsea's own AI reversal coverage.

**Could not reach:** Reddit. Every route was blocked — `reddit.com` and its JSON API return 403, and the redlib/libreddit/safereddit mirrors are behind Cloudflare or Anubis proof-of-work challenges. This is the same limitation the market-landscape research hit. **Consequence: r/AudioErotica, r/gonewildaudio, r/sexover30, r/TwoXChromosomes, r/ADHDwomen and r/asmr evidence in this document is second-hand** — from journalism about those communities, from the prior research doc, or from forum communities elsewhere. I have marked those places. Do not treat the Reddit-derived claims here as verified to the same standard as the App Store quotes.

## 1.2 AI voices: the corpus is hostile, and the lab data disagrees

This is the most important and most genuinely contested finding in the review, so both sides get stated properly.

**The hostile evidence:**

- Dipsea removed all AI from a 1,200-story library by June 2026 and published why. Editorial lead Olivia Taylor: *"In many ways, AI art and voices are the opposite of personal."* The company line: *"it's the extra turn of phrase a writer adds in at the last minute, or the hitch in a voice actor's breath midway through a recording, that always seems to elevate a story from hot into something truly erotic."* Their AI programme was consent-based, paid with retainers, and labelled "Virtual Voice" in-app. They killed it anyway. `[EVIDENCE]`
- A satisfied Dipsea user, unprompted, on the App Store today: *"I love this app! And today I learned that they are taking a stand against AI! Which makes me feel so positive for them!"* Anti-AI positioning is now something customers *review you for*. `[EVIDENCE]`
- Users treat "AI" as a quality slur, not a technology description. A negative Whisper Stories review: *"these felt like AI wrote them and one guy read them all in different accents. Yuck."* A positive Whisper Stories review does the mirror-image move — it argues the voice cannot possibly be AI, as praise: *"There no way that is an AI generated voice - you can hear his every breath and swallow and groan. I'm hooked."* Listeners are actively adjudicating authenticity while they listen. `[EVIDENCE]`
- The creator supply base is organising. r/GoneWildAudio bans AI voice posts; creators append anti-AI-training licences to uploads; the AI-friendly splinter sub is inert. A working NSFW voice actress, on a public forum: *"I do not like the idea of AI voices in kink audio for many reasons, the biggest being lack of consent from the original voice actor... I can't name a single NSFW voice actor who has consented to this."* `[EVIDENCE, forum + secondary for the GWA ban]`

**The counter-evidence, which is strong and should not be waved away:**

- **Edison Research at SSRS, May 2026, n=1,005 fiction audiobook listeners.** Blind exposure to AI multi-cast vs human single narration. AI rated *higher* on favourability (61% vs 53%), perceived narration quality (66% vs 60%) and engagement (58% vs 49%) for character-driven fiction. Human won for non-character exposition. Most important number in the study: **willingness to listen to an AI-narrated audiobook went from 31% before hearing a sample to 70% after.** `[EVIDENCE]`
- A 2026 peer-reviewed experiment on human vs AI voices in literary audiobooks found *"differences in listener evaluations between AI-generated and human voices were minute"* and that expectations about narrator origin did not moderate the evaluation. `[EVIDENCE]`
- But the direction of the disclosure effect is documented elsewhere: in a cross-over music study, listeners rated identical audio as less likeable, less engaging and lower quality when told an AI produced it, an effect *moderated by their general attitude toward AI*. `[EVIDENCE]`

**Synthesis `[INFERENCE]`:** the concept's stated fear — "can TTS whisper convincingly enough" — is probably the *wrong* fear. The blind-test evidence suggests the audio can clear the bar. The real risk is that you are legally required to tell people (EU AI Act Art. 50 applies from 2 Aug 2026; Cartesia requires an interstitial contractually), and the disclosure penalty lands hardest on exactly the users with negative priors — who, in this category, are the loyal, high-LTV, craft-citing cohort. **You are not in a technology race. You are in a labelling problem.**

## 1.3 The embarrassment surface is the best-evidenced unmet need in the category

Three independent complaints, two apps, all public, all recent:

> *"I tried this app, and paused it when interrupted and forgot about it. My 12 year old daughter was going to come to the grocery store but could not at the last minute. I got in the car and it resumed playing on CarPlay. It took several seconds for me to get it stopped. Has my daughter been in the car, it would have been very awkward. They should change the app so that it does not auto play on CarPlay."* — Quinn, App Store `[EVIDENCE]`

> *"Great app, but a very strong suggestion - please add settings with an option for a passcode and other security measures. For some reason, even if I pause the audio, it will start auto playing when I plug into my car if I haven't closed out of the app... I discovered this in a very embarrassing way lol."* — Quinn, App Store `[EVIDENCE]`

> *"even when the app is fully closed on my phone, it will still auto connect and start playing in my car and with my AirPods... if I can't find a way to prevent that from occurring, I'll have to cancel my subscription :("* — Quinn, App Store, via prior research `[EVIDENCE]`

And the billing-descriptor variant:

> *"I discovered a recurring subscription renewal from Bloom Stories that I did not recognize. I was unable to identify the charge as Bloom in time to cancel before the renewal because their name didn't come up as 'Bloom'... They blamed me for their lack of transparency."* — Bloom Stories, App Store `[EVIDENCE]`

Plus the family-Apple-ID problem, from a Her Campus writer: *"if you're anything like me and still living on your parents' AppleID, those purchases can easily show up on your parents' subscription records (talk about awkward). So, I finally girlbossed and grew up: I created my very own AppleID."* `[EVIDENCE]`

**This is the strongest signal in the entire corpus** because it is the only complaint category where users state the consequence in the same breath as the complaint: *"I'll have to cancel."* `[INFERENCE]`

## 1.4 ASMR is a hazard, not a house style

- Misophonia is estimated to affect **~20% of the population**, per PopSci summarising the research literature; ASMR University's summary of the field notes misophonia symptoms are **higher in women and younger people**, with mouth and eating sounds the most common triggers. Trigger sounds provoke a genuine autonomic response — the clinical literature records *"intense anxiety, panic, anger, extreme irritation, and even rage,"* and physical symptoms including chest pressure and difficulty breathing. `[EVIDENCE]`
- The category's own users have already filed the complaint, precisely: *"The more recent stories seem to be increasing in ASMR content. The kissing sounds are getting louder and wetter and it's a sensory nightmare. I'm not joking - they need a trigger warning. The world is pretty split on ASMR, some love it and some hate it. Tag it."* and, from the same reviewer, *"The slurping is too much."* — Emjoy, App Store `[EVIDENCE]`
- The opposite failure is also on record: *"It always sounds like the actors are in big, empty, white rooms. Very uncomfortable, awkward, and not stimulating in the least for me."* — Dipsea `[EVIDENCE]`
- Even inside the ASMR-positive audience, mouth-sound tolerance is a hard axis: *"she's wayyyyy too heavy on mouth sounds for me, i really don't like those."* — Bluesky, ASMR listener `[EVIDENCE]`

**`[INFERENCE]`** A product whose "physical signature" is a mouth ten centimetres from your ear is building its differentiation on the exact stimulus that ~1 in 5 people experience as aversive, in a demographic where the rate skews *higher*. Wet-mouth intensity must be a first-class user control with a conservative default, not a brand attribute.

## 1.5 What actually earns money and love

- **Safety and self-reconnection is the highest-intensity praise in the corpus.** From a blind Dipsea user: *"The him + you / her + you offerings have helped me get out of my head, something that I find challenging. I am learning about myself, my desires, and also learning to feel less shame around them. This app offers a feeling of safety."* `[EVIDENCE]`
- **Craft is the stated justification for the price.** *"I'm actually glad they have a subscription fee; it means there's a budget for good quality writers and actors."* — Dipsea `[EVIDENCE]` This is the exact reasoning AI narration attacks.
- **Second-person POV and "made for me"** recur constantly. Also revealing: *"Sometimes I like to listen to the man-only POV audios and use my imagination to center myself as the woman in the scenario, but other times I want to hear the woman, as it helps stimulate my responses."* — Dipsea `[EVIDENCE]` Personalisation demand is real; it is expressed as *POV and voice*, not as *my name*.
- **Responsive-desire / priming behaviour is real and clinically described.** A sexologist on a 2026 podcast relays a client's habit verbatim: *"I listened to audio erotica on my way home, on my drive home, so it kind of primes your mind before you get there... a little fun tip to preheat the oven."* Note the context — **in the car**, which is exactly where the CarPlay failure mode lives. `[EVIDENCE]`
- **Postpartum and medication-driven low desire are well-described entry points.** "Touched out" is the community's own term; clinical writing describes the shift from "woman/partner" to "caregiver" and the resulting disconnection from sexual identity. On SSRIs, the mechanism is documented: desire *"is most often responsive rather than absent, meaning the desire can still be coaxed back to life with the right context."* `[EVIDENCE]`

## 1.6 Authenticity of voice casting is a live landmine, and synthetic voice makes it worse

> *"as a Black person, I'm doubtful the narrators of most of the stories tagged as 'Black Voices' are actually black voices. The cadence doesn't match, the culture doesn't match, the language isn't ours...it's just OFF."* — Dipsea, App Store, via prior research `[EVIDENCE]`

> *"there aren't enough of them, especially for queer people. The trans and nonbinary section must be an actual joke."* — Emjoy, App Store `[EVIDENCE]`

**`[INFERENCE]`** A TTS voice tagged as a Black voice, or a queer voice, that gets cadence wrong is a strictly worse version of a complaint users are already making about *human* casting — and it is indefensible in a way the human version is not, because there is no person behind it whose real identity answers the objection.

## 1.7 The word "selfish"

This deserves its own section because the thesis rests real weight on it ("It is permission").

- **The reclaiming reading is real.** Audre Lorde's *"Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare"* is load-bearing in feminist self-care writing, and there is a live strand of women deliberately using "selfish" for boundary-setting. `[EVIDENCE]`
- **But the dominant usage in this exact demographic's media is defensive, not proud.** "Self-care is not selfish" is a stock phrase — it is the *title* of wellness articles, the reframe therapists teach, and the sentence sexologists open with when talking to mothers. One 2026 sexology podcast episode about postpartum desire is literally framed as *"Pleasure is Self-Care"* with the body copy arguing it *isn't selfish*. Therapy writing on "good girl syndrome" puts it sharply: *"Systems that benefit from your compliance will always call your boundaries 'selfish.'"* `[EVIDENCE]`
- **And the word is currently being used as a weapon in mainstream coverage of women's choices.** When Emma Grede described herself as a "three-hour weekend mum" in 2026, the coverage split on exactly this axis — supporters applauded, *"detractors slamm[ed] her as selfish."* `[EVIDENCE]`

**`[INFERENCE]`** "Selfish" is not a neutral container that the brand can fill with permission. It arrives pre-loaded as an accusation, and the reclamation move requires the reader to already be on your side. That is fine for a tagline you deliver *after* someone has chosen to listen. It is bad for a word you must put on a home screen, in a receipt, and in an App Store search result.

**Name-collision facts `[EVIDENCE]`:** `SELF!SH` is a live pending USPTO application by Selfish Brands Inc. (Westport, CT) covering *downloadable mobile applications... related to mental health and wellness in the fields of self-improvement, personal development, personal growth* — a class that overlaps our Focus positioning almost exactly. Their plain `SELFISH` application in the same classes is dead. Two apps named "Selfish" already exist on the App Store (a Chilean food app; a defunct-looking selfie-filter app). None of this is fatal, but "name is free and clear" is not true.

## 1.8 Table stakes we would be graded against

Every one of these is a live, current complaint about a shipping competitor, and every one is cheap for us to get right `[EVIDENCE]`:

| Failure | Quote |
|---|---|
| No autoplay to next chapter | *"I don't like that it won't automatically play the next chapter. After every one you have to go to the app and tell it what you think of the chapter or decline..."* (Bloom) |
| Broken queue | *"the queue function did not work at all... I was left disappointed that it would just end while I was in the moment."* (Dipsea) |
| No sleep timer | *"Having a sleep timer would be really helpful!"* (Quinn) |
| Buffering | *"The audio plays for 5-10 seconds then pauses as if it's running off dial-up internet."* (Bloom) |
| Cancellation dead-ends | *"There is NO WAY to cancel if you decide you don't like it anymore."* (Bloom) |
| Trial→charge shock | *"DO NOT USE. They said free trial. I got it listened to a few, wasn't for me so I cancelled and unsubscribed within 15 minutes. They still changed $60."* (Quinn) |
| No passcode | *"I wonder if there is a way to make the app more private. Such as a passcode?"* (Quinn) |
| Sample-before-you-pay | *"There isn't enough 'snippets' or samples to be able to accurately judge this service."* (Quinn) |

---

# Part 2 — The panel

Seven personas, each built from the evidence above. **They are composites, not people.** Where a persona's reaction is grounded in a specific quote or study I have said so; where it is my extrapolation, it is `[INFERENCE]`.

## 2.1 The panel at a glance

| # | Name | Age | Status | Orientation | Route in | Tech | AI stance | ASMR |
|---|---|---|---|---|---|---|---|---|
| 1 | Marisol Vega | 26 | Single, dating | Bisexual | Single & exploring | High | Curious, unbothered | Loves it |
| 2 | Kirsten Bell-Doyle | 39 | Married 11 yrs, 2 kids | Straight | Low desire, SSRI, touched-out | Low | Indifferent until told | Neutral |
| 3 | Jo Amadi | 35 | Partnered | Lesbian | Craft, representation | High | **Actively hostile** | Positive |
| 4 | Hannah Ostrowski | 52 | Divorced, dating | Straight | Perimenopause | High | Pragmatic, pro-disclosure | Mild |
| 5 | Ruby Tan | 31 | Single, cohabiting | Straight | ADHD / Focus | Medium-high | Sceptical | **Misophonic** |
| 6 | Aisha Mehmood | 29 | Single, lives with family | Straight | Trauma-informed, cautious | Medium | Wary | Avoids |
| 7 | Grace Whitmore | 46 | Married 20 yrs | Straight | Curiosity / entertainment | Low-medium | Dislikes, negotiable | Positive |

---

## 2.2 Persona 1 — Marisol Vega, 26

**Portrait.** Marisol is a bilingual account coordinator in Phoenix, single and dating, out as bi to her friends and not to her mother. She found Quinn through TikTok two years ago, pays $59.99/yr and considers it the best money she spends. She also listens to free r/gonewildaudio creators and follows two of them on Discord, which means she has absorbed the community's politics without ever having read a policy page. She listens on AirPods most nights and in her car on the way home from a date. She reads all the comments on Quinn audios before picking one — she has said the comment section is half the product. What she wants: variety that doesn't run out, a voice she can get attached to, and the feeling that a specific person is choosing *her*, not that content is being served to her. She is the persona most likely to become the product's evangelist and the most likely to publicly torch it if she decides it is exploitative. `[INFERENCE, grounded in the Quinn comment-culture and TikTok-discovery evidence]`

**First reaction.** "Okay, the private stuff is genuinely nice, nobody does that. But where are the creators? Who am I listening to? On Quinn I know whose voice this is, I can see their other stuff, I can leave a comment and they might answer. This is just... a jukebox."

- **The name:** likes it. *"'Be selfish' is a whole TikTok genre, that's fine."* But she immediately clocks the home-screen problem: *"I'd rename it in my phone anyway. I rename everything."*
- **AI voices:** her most complicated answer. She personally does not care about the audio, but she is loyal to creators. *"You're not competing with Dipsea, you're competing with my favourite VA who has 4,000 followers and posts a licence saying don't train on me. If I find out you scraped GWA scripts I will post about it."* Disclosure doesn't change her ethics, it just tells her earlier. **The only thing that changes it is named, paid, consenting voice talent.**
- **Warm-up default:** hates it after week one. *"I know what I want. I've been doing this for four years. Don't make me do a mood quiz at 11pm."* Fine the first time; infuriating the fifth.
- **Name whispered:** loves it. *"That's the whole point of \[Speaker4Listener\] audio. Yes. Say it."* Her one condition: it has to be right. *"My name isn't 'Mary-sol.' If a robot says it wrong once I'm out and I'm never turning it back on."*
- **Focus + Desire:** indifferent to the cover story, mildly annoyed by the clutter. *"I have Spotify for that."*
- **Subscribes if:** the catalogue is genuinely deeper than Quinn's and there's a way to follow a voice like a person. **Cancels if:** she can't tell who's speaking, or the AI story breaks badly. **Recommends if:** there's a specific voice she can name to a friend.
- **Privacy red lines:** no linking to her phone contacts, ever; nothing that could appear on a shared family payment; no notifications that name content.

---

## 2.3 Persona 2 — Kirsten Bell-Doyle, 39

**Portrait.** Kirsten is a primary-school administrator outside Leeds, married eleven years, two children aged six and three. She's been on sertraline for two years and describes her libido as *"just gone"* — which the literature would call responsive rather than absent, but nobody has told her that. She feels touched out most evenings. She has never used a porn site and would be mortified to be seen doing so; she found this category through a podcast ad. She uses her phone for WhatsApp, the school app, and Facebook, and she has never changed a setting she didn't have to. What she wants, in her words, is *"to feel like a person again for twenty minutes."* She is the highest-value user in the category — the "guided home" cohort whose praise is the most emotionally intense in the corpus — and she is also the most easily lost, because a single embarrassing moment ends the relationship permanently. `[INFERENCE, grounded on the SSRI/responsive-desire evidence and the "touched out" clinical literature]`

**First reaction.** "I'd be too embarrassed to have this on my phone where my husband can see it. That's the first thing I thought. Not 'is it good.'"

- **The name:** **strongly negative, and this is the panel's most important single data point.** *"Selfish is the exact word in my head at 9pm when I close the door. It's not a joke word to me. If my phone says 'Selfish' on it and my six-year-old asks what that is, what do I say?"* She has heard "self-care isn't selfish" a hundred times; hearing an app just say "Selfish" reads as agreeing with her guilt, not dispelling it.
- **AI voices:** doesn't know what TTS is and doesn't care — until told. Then: *"Oh. So there's nobody there."* This is the most damaging reaction on the panel because it is not ideological, it's deflationary. The product's promise to her is *someone is paying attention to me*; "it's synthetic" removes the someone. `[INFERENCE — but it maps directly onto Dipsea's own stated reason: "AI art and voices are the opposite of personal."]`
- **Warm-up default:** **the single best-received element for her.** *"Yes. Because if you ask me what I want I'll say I don't know and close it."* She would not have got past a grid of thumbnails.
- **Name whispered:** *"No. No. That's — no."* She is unable to articulate why beyond *"it feels like it's watching me."* Pressed, she says she'd worry about where the name is stored. She would not turn it on, and she would think slightly less of the app for offering it.
- **Focus + Desire:** **loves the bundle, entirely for cover.** *"If someone sees it I'm using the sleep sounds. That's worth the subscription on its own."*
- **Subscribes if:** the first session works — one 12-minute thing that makes her feel something, without a set-up wizard. **Cancels if:** anything plays out loud unexpectedly, or she can't work out how to cancel (she will not fight; she will charge back and leave a one-star). **Recommends if:** never publicly. She might tell one friend, in person, once.
- **Privacy red lines:** the charge on the joint account. This is non-negotiable and she will check before subscribing. If the descriptor says anything suggestive, she does not subscribe at all.

---

## 2.4 Persona 3 — Jo Amadi, 35

**Portrait.** Jo is a Black British lesbian who works in audio post-production in Manchester, partnered five years. She listens to audio erotica critically — she can hear a de-esser working — and she is the panel's expert ear. She is also **actively, publicly hostile to generative AI**: two of her freelance colleagues lost narration work in 2025, she has signed open letters, and she has an "❌ GenAI" line in her social bios, which is now a recognised convention in the erotica-writing community. She is exactly the person the Dipsea review meant when she wrote about "Black Voices" tags where *"the cadence doesn't match, the culture doesn't match, the language isn't ours."* What she wants is craft, and casting that is real. `[INFERENCE, grounded on the anti-AI creator evidence, the Dipsea Black Voices review, and the Emjoy queer-content review]`

**First reaction.** "So it's slop with good reverb. I'm sorry, but that's what it is. You've written 'human editorial gate' in a box on a diagram and you think that's the same as a person in a booth."

- **The name:** dislikes it, but for a craft reason, not a moral one. *"It's a Canva-poster word. It tells me you brainstormed for an hour."*
- **AI voices:** **zero. Not a downgrade — a refusal.** *"Dipsea did it more ethically than you will and still pulled it. If you ship this I'll tell people not to use it, and so will everyone I know."* Disclosure makes it worse, not better: *"Disclosure just means you told me before I found out."* The only thing that moves her is the hybrid — real, paid, credited performers whose banked performances are assembled generatively, with per-generation royalties. She'd consider that. She would still want the label.
- **Warm-up default:** approves. *"That's directing. That's the only thing in here that sounds like someone thought about the listener."*
- **Name whispered:** *"On a TTS voice? Absolutely not."* Her objection is technical and it is the sharpest one on the panel: **a spliced single-word render will not match the prosody of the surrounding line.** *"You're going to splice a flat token into a breathy phrase. I will hear the join. Everyone will hear the join, they just won't know what they heard — they'll only know it stopped working."* `[INFERENCE, but consistent with the documented TTS failure taxonomy: unnatural breath, mismatched emotion timing, over-smooth delivery]`
- **Focus + Desire:** fine with it, sees straight through it. *"That's your App Store shield. Just make sure the shield is actually good or it's dishonest twice."*
- **Subscribes if:** you go human-voiced. Otherwise never. **Cancels if:** n/a. **Recommends if:** you name and pay your voices — then she becomes the most credible advocate available, because her scepticism is known.
- **Privacy red lines:** she cares more about *creators'* privacy than her own. No training on scraped GWA scripts; no voice cloned without a signed, revocable, genre-scoped licence; no "inspired by" of a real performer.

---

## 2.5 Persona 4 — Hannah Ostrowski, 52

**Portrait.** Hannah is a data analyst in Chicago, divorced three years, dating occasionally, perimenopausal with the sleep disruption and the desire changes that came with it. She is the most technically literate person on the panel: she reads App Privacy labels, she has a password manager, she knows what an SDK is. She is also the one who most resents being condescended to — the category's wellness-lite tone irritates her, and she has read enough to know that "clinical" positioning is usually marketing. She's the Spotify-spicy-audiobook demographic (43% of that audience is 35–44) rather than the TikTok one, and she has the highest willingness to pay on the panel. `[INFERENCE, grounded on the Spotify demographic data and the perimenopause/responsive-desire evidence]`

**First reaction.** "The privacy section is the only part of this document that sounds like it was written by adults. Everything else sounds like a pitch."

- **The name:** neutral-to-positive, with a caveat. *"I get it. I'd probably say it ironically. But it's a word that invites a conversation and this is a product whose entire premise is not having the conversation."*
- **AI voices:** the panel's most pragmatic response. *"Tell me up front, in the paywall, not in a settings page. If it's good, it's good."* She notes she'd want to A/B it herself: *"Give me the same story in two voices and let me pick. If I can't tell, you've won and I'll say so."* This is the one persona for whom the Edison finding — 31% willing before hearing, 70% after — plausibly holds. `[INFERENCE grounded on that study]`
- **Warm-up default:** likes it, with a hard requirement: **it must be skippable and it must remember.** *"Don't make it a personality test. If I did the quiz in January don't ask me again in March."*
- **Name whispered:** **her objection is a security objection and it is the most consequential one raised.** *"You're telling me you'll splice my first name into an audio file and put it on a CDN. So there's now a file, somewhere, that is my name plus erotica. Who holds the key? What's the filename? What's in the URL? Does it survive account deletion?"* She would not enable it, and she'd want to know it's off by default. `[INFERENCE — but architecturally correct: a name-spliced render is by construction a per-user artefact and cannot use the shared cache the thesis relies on]`
- **Focus + Desire:** approves, and identifies the real risk: *"If Focus is bad, the whole thing reads as a fig leaf. Make it genuinely good or don't ship it."*
- **Subscribes if:** the privacy claims are verifiable — no analytics SDKs shown in the App Privacy label, ideally a third-party audit. **Cancels if:** she finds an SDK in the binary, or the privacy label says "Data Linked to You." That would be a betrayal, not a disappointment.
- **Privacy red lines:** no account required to listen (she will test this); on-device history that she can inspect and wipe; no email required; and she wants to know what happens to her data if the company is acquired — the Emjoy story (VC-backed wellness app now owned by an affiliate SEO operator) is exactly her fear.

---

## 2.6 Persona 5 — Ruby Tan, 31

**Portrait.** Ruby is a freelance product designer in Melbourne with diagnosed ADHD, cohabiting with a partner in a one-bedroom flat. She lives on brown noise and Brain.fm; she has tried nine focus apps. Crucially, **she is misophonic**: chewing, lip smacking and wet mouth sounds produce a genuine fight-or-flight response, and she has had to leave rooms over it. She is the panel's Focus-first user — she would download this for work, not for sex — and she is the person the ASMR aesthetic actively injures. She would be an excellent acquisition channel (Focus earns the download, per the thesis) and she is the likeliest to leave a detailed, damaging one-star review. `[INFERENCE, grounded on the misophonia literature and the "sensory nightmare / Tag it" Emjoy review]`

**First reaction.** "'Short whispered ritual bookends.' You've put the one sound I cannot tolerate at the start and end of the thing I'd use eight hours a day."

- **The name:** actively dislikes it in the work context. *"I share my screen four times a day. 'Selfish' in my dock is a question I have to answer."*
- **AI voices:** doesn't care much, but notices a knock-on: *"Synthetic voices are usually wetter, actually. All that mouth noise in the model. If your pipeline has a de-esser it needs a de-mouth too."* Her real complaint is that AI is being sold as the reason to care: *"Nobody chooses a focus app because of how it was made."*
- **Warm-up default:** approves in principle for Desire, irrelevant to her.
- **Name whispered:** *"Absolutely not, and especially not in Focus. If a voice says my name while I'm concentrating you've destroyed the session."* Also flags the obvious: whispered name = the thing most likely to be audible to her partner in the next room.
- **Focus + Desire:** **the panel's one genuinely negative verdict on the bundle, and it's a good one.** *"I'd use this at a co-working space. If there is any chance — any — that a notification, a Now Playing card, a Siri suggestion, a Shortcuts action, or a Spotlight result surfaces the erotic half while my laptop is mirrored, I can't install it. It's not that I'm embarrassed. It's that it's a professional risk."* The bundle is only reassuring if the two halves are *provably* isolated.
- **Subscribes if:** Focus is competitive with Brain.fm on its own merits and the whispered bookends are optional. **Cancels if:** she hears a mouth sound she didn't consent to — instantly, that day, with a review. **Recommends if:** it's the first focus app that lets her filter by sound texture.
- **Privacy red lines:** no microphone permission ever; nothing in Spotlight; nothing in the Shortcuts/Siri surface; and Screen Time should show a neutral category.

---

## 2.7 Persona 6 — Aisha Mehmood, 29

**Portrait.** Aisha is a pharmacist in Birmingham who lives with her parents and two siblings, from a conservative Muslim family. She is a survivor of a coercive relationship and has been in therapy for two years; her therapist has suggested she rebuild a relationship with her own body at her own pace. She is the closest analogue to the corpus's most intense piece of praise — the reviewer who wrote about never being able to touch herself without a panic attack, and being *"guided home."* For Aisha, discretion is not a preference, it is a safety requirement: her phone is sometimes handed round. She needs to know exactly what is coming before it comes. `[INFERENCE, grounded on the trauma-informed praise in the corpus and on standard trauma-informed content-warning practice]`

**First reaction.** "Face ID lock and an alternate icon are the two things I'd check before anything else. If those work I'll look at the rest. If they don't I'll delete it in the shop."

- **The name:** **the panel's most negative reaction, and for a reason nobody else raised.** *"In my family, 'selfish' is the word used about a woman who does something for herself. It's not a joke. Naming it that is naming the thing I'm afraid of."* She would not download an app called Selfish. She would download the same app called almost anything else.
- **AI voices:** ambivalent, and identifies an unexpected *upside*: *"There's no real person. Nobody was hurt making it, nobody knows I listened, nobody I could ever meet. That's actually easier."* This is the one genuinely pro-AI argument on the panel and it is worth taking seriously. `[INFERENCE — plausible and internally consistent, but I found no direct user evidence for it; flag as a hypothesis to test]`
- **Warm-up default:** **the strongest positive reaction of any persona to any feature.** *"A grid of explicit thumbnails would make me close the app and not open it again. Starting with 'how do you want to feel' is the difference between me using this and not."*
- **Name whispered:** *"No, and I would want to know it was off. Someone saying my name is what I'm working on being okay with. That's not a feature, that's an ambush."* Note the shape of the objection: not squeamishness, but **consent and pacing** — the same axis the product claims to be built on.
- **Focus + Desire:** **the bundle is the reason she can have it at all.** *"If my sister picks up my phone, it's a sleep app. That's not a nice-to-have."*
- **Subscribes if:** every item has granular pre-session content labels she can set as permanent filters — no degradation, no "Daddy," no non-consent framing, no surprise escalation — plus a guaranteed soft exit and an aftercare tail. **Cancels if:** a story escalates past where she consented, once. **Recommends if:** privately, to one person, and only if the content controls held.
- **Privacy red lines:** works with no account and no email; Face ID lock that engages on *every* foreground, not just cold launch; no history in the App Store "purchased" list she can't hide; a genuine panic-stop; and nothing that survives on a shared iCloud backup.

---

## 2.8 Persona 7 — Grace Whitmore, 46

**Portrait.** Grace is a school-governor-and-book-club sort in Bristol, married twenty years, three teenagers. She arrived via romantasy — she's read all of Rebecca Yarros and half of BookTok — and she thinks of this as "the audio version of my books," not as porn. That framing matters: it means she judges it on *writing*. She is the cohort that reasons explicitly about craft when justifying subscription price. She is not technical, has never turned on Face ID, and thinks of AI mainly through the lens of *"the thing that's ruining book covers."* `[INFERENCE, grounded on the "glad they have a subscription fee... budget for good quality writers" review and the romantasy/BookTok market evidence]`

**First reaction.** "Is the writing any good? That's my only question. Everything else here is about how it's made and I don't care how it's made."

- **The name:** *"It's a bit… try-hard? It sounds like a wine bar."* Not offended, not sold. Would not stop her downloading, would stop her mentioning it at book club — which is the whole distribution channel for someone like her.
- **AI voices:** dislikes it on instinct, but her objection is negotiable and specific: **"AI-written" bothers her more than "AI-voiced."** *"A machine reading a good book is fine. A machine writing it is the problem."* Note this is the exact inverse of Dipsea's line — Dipsea never used AI for scripts and did use it for voices. The concept does both. `[EVIDENCE for Dipsea's line; INFERENCE for her preference ordering — worth testing, because if it holds it means the *script* disclosure is the more dangerous one]`
- **Warm-up default:** likes it. *"That's how a book works. You don't start at chapter nine."*
- **Name whispered:** **the panel's other enthusiastic yes, and she is more articulate about it than Marisol.** *"In a book you're always 'she.' Being 'Grace' would be — yes. That's the thing you can't get from a novel."* Her caveat is sharp: *"Once. At the right moment. Not every thirty seconds like a call-centre script."*
- **Focus + Desire:** *"Sensible. Nobody has to know which bit I opened."*
- **Subscribes if:** she listens to one story and thinks *a person wrote that*. She would pay £70/yr without blinking if so. **Cancels if:** she hears a cliché stack — *"if someone's breath 'hitches' twice in one story I'm done."* **Recommends if:** she can name a story, not a feature. This is important: her word-of-mouth is title-shaped, and a personalised, generated, per-user catalogue **has no shareable titles.**
- **Privacy red lines:** the household bill, and nothing on the family iPad. She is otherwise relaxed.

---

## 2.9 Panel scorecard

Reactions scored −2 (dealbreaker) to +2 (would pay for this alone).

| | Marisol | Kirsten | Jo | Hannah | Ruby | Aisha | Grace | Net |
|---|---|---|---|---|---|---|---|---|
| Name "Selfish" | +1 | −2 | −1 | +1 | −1 | −2 | 0 | **−4** |
| AI-generated voices (disclosed) | −1 | −2 | −2 | +1 | 0 | +1 | −1 | **−4** |
| AI-written scripts (disclosed) | 0 | −1 | −2 | 0 | 0 | 0 | −2 | **−5** |
| Warm-up default | −1 | +2 | +1 | +1 | 0 | +2 | +1 | **+6** |
| Your name whispered | +2 | −2 | −2 | −1 | −2 | −2 | +2 | **−5** |
| Focus + Desire bundle | 0 | +2 | 0 | +1 | −1 | +2 | +1 | **+5** |
| On-device history, no SDKs | +1 | +1 | +1 | +2 | +1 | +2 | +1 | **+9** |
| Discretion (CarPlay, icon, Face ID) | +1 | +2 | 0 | +2 | +2 | +2 | +1 | **+10** |
| Intensity dial | +1 | +1 | +1 | +1 | 0 | +2 | +1 | **+7** |
| Apple IAP only / no web tier | 0 | +1 | 0 | 0 | 0 | +1 | +1 | **+3** |

---

# Part 3 — Findings

## 3. (a) Top 10 concerns, ranked by breadth × severity

**1. Disclosed AI provenance destroys the product's core promise for the highest-value users. (7/7 raised it; severity: existential)**
The promise is *someone is paying attention to you*. "It's synthetic" deletes the someone. Kirsten's flat *"Oh. So there's nobody there"* is the most damaging line in the review, precisely because it isn't ideological. And it converges with Dipsea's own published reason for reversing. Counter-evidence exists and is strong (Edison: blind listeners prefer AI multi-cast; 31%→70% after exposure) but it measures *audiobooks*, not intimacy, and it measures blind exposure, which is the one condition the EU AI Act denies you.

**2. The name. (6/7 reacted; 4 negative; severity: high, and it is nearly free to fix)**
Two personas would not download it. Both are in the core segment. See §9.3.

**3. Name-whispering is high-variance and architecturally expensive. (7/7 reacted; 4 negative, 2 strongly positive; severity: high)**
It is simultaneously the biggest potential "how did it know" moment and the biggest potential ick. It also breaks the shared-cache economics, requires storing a first name, and creates a per-user erotic audio artefact. Ship it wrong and it is a privacy story, not a feature.

**4. ASMR/wet-mouth as an unlabelled house style. (5/7 raised; severity: high for ~20% of market)**
The category's users have already written the spec for you: *"Tag it."* Ruby is a total loss if you don't.

**5. The embarrassment surface — CarPlay, Bluetooth, Now Playing, Spotlight, Siri, Screen Time. (6/7 raised; severity: high, but this is also the biggest opportunity)**
Three separate public cancellation threats over CarPlay alone. Note the cruel overlap: the car is *also* the documented priming context ("I listened to audio erotica on my drive home").

**6. Billing descriptor and family-account exposure. (5/7 raised; severity: high; it is a purchase blocker, not a churn cause)**
Kirsten will not subscribe at all if the descriptor is legible. Apple IAP helps (everything shows as apple.com/bill) but the *subscription name in Settings* and the *family purchase history* both remain exposed. This needs an explicit answer, not a hand-wave.

**7. No creators, no names, no titles — nothing to recommend. (4/7 raised; severity: high for growth)**
Marisol follows voices. Grace recommends *stories*. A per-user generated catalogue has neither. **The personalisation thesis and the word-of-mouth engine are in direct tension** and the thesis does not acknowledge it.

**8. Script quality and cliché. (4/7 raised; severity: high)**
Grace's *"if someone's breath 'hitches' twice in one story I'm done"* is the operational version of the known LLM failure mode, and the thesis already names it as risk #5. The corpus's most specific craft complaint is *pacing* — *"the guy didn't finish in 30 seconds... this is not nearly enough time for a woman"* — which is a solvable, testable, engineering-shaped problem and should be a headline feature, not a footnote.

**9. Warm-up-as-permanent-gate. (3/7 raised; severity: medium; trivially fixable)**
Right for session one, wrong for session twelve. Marisol's *"don't make me do a mood quiz at 11pm"* is a real churn cause and it costs nothing to fix.

**10. Company mortality and data afterlife. (2/7 raised; severity: medium, rising)**
Hannah explicitly fears the Emjoy outcome — an institutionally-funded women's wellness app whose library is now owned by an affiliate/SEO operator. In a category with a visible graveyard, "what happens to my data when you're acquired" is a fair question and nobody in the category answers it. There is an unusual opportunity to answer it in writing.

## 4. (b) Concept elements a majority reacted badly to

Three, cleanly:

1. **Disclosed AI provenance** — net −4 on voices, **net −5 on scripts**. Note the ordering: the panel dislikes *AI-written* more than *AI-voiced*, which is the opposite of the industry's assumption and the opposite of where Dipsea drew its line. If that ordering is real, the thesis has picked the *more* damaging half of the AI story to build on, since scripts are the part it cannot remove.
2. **Your name, whispered** — net −5, 4 of 7 negative. This is not a marginal call. It is one of only two features with a *dealbreaker*-grade (−2) response from a majority of the personas who gave it one.
3. **The name "Selfish"** — net −4, and the two −2s come from the two personas who need the product most and are the least likely to complain about anything else.

Nothing else on the scorecard is net-negative. Everything else the concept proposes tested neutral-to-strongly-positive.

## 5. (c) The single feature most likely to drive word-of-mouth

**Never auto-resuming. More broadly: discretion engineering, stated as a promise, not a settings page.**

It scores +10 on the panel — the highest of anything tested — and it is the only element with a documented, verbatim, cancellation-grade complaint against *two* live competitors. It is sayable in one sentence, and the sentence is a story: *"It won't start playing in your car."* The 12-year-old-daughter review is the marketing brief.

Word-of-mouth in this category is constrained by embarrassment: people recommend privately, once, to one friend, in person (Kirsten, Aisha, Grace all said versions of this). A recommendation therefore has to survive being said out loud in a normal voice. *"It's the one that can't embarrass you"* survives that. *"It says your name"* does not. Nor does *"the AI is really good."*

Runner-up: **the intensity dial as a genuinely re-authored variant** (+7), because "you choose how far it goes and it never goes further" is the other sentence you can say to a friend without lowering your voice.

## 6. (d) Concrete copy and UX recommendations

### 6.1 The name — verdict and alternatives

**Verdict: change it.** Not because it's offensive, but because it does three jobs badly:

1. **It fails the discretion test the entire product is built on.** Every other feature is designed so nobody has to ask a question; the name *provokes* the question. A word on a home screen, in Settings > Subscriptions, in Screen Time, and in the family purchase list should be inert. "Selfish" is the opposite of inert.
2. **It sides with the guilt.** For the target user, "selfish" is not a neutral word awaiting reclamation — it is the accusation, so ubiquitous that "self-care is not selfish" is a stock rebuttal phrase in her media. The reclamation reading requires the reader to already be converted. Aisha and Kirsten are not converted; they are the market.
3. **It is not clear.** There is a live USPTO application for `SELF!SH` covering wellness/self-improvement apps, two existing App Store apps named "Selfish," and zero search intent — nobody types "selfish" looking for audio.

**Keep the idea.** *"Be selfish with your attention. Be selfish with your pleasure."* is good copy and should survive as the paywall headline, the launch campaign, and possibly the annual plan's name. Deliver it *after* someone has chosen to listen, when it reads as permission. On a home screen, it reads as a verdict.

**What to test instead.** Criteria: neutral when glimpsed; plausible as a sleep/focus app; carries both rooms; not a sexual pun; App-Store-searchable. Three families, test 3 per family in a 5-second-glance test plus a "would you have this on your home screen" question:

| Family | Candidates | Why |
|---|---|---|
| **Proximity / closeness** (leans into the binaural signature) | **Nearer**, **Close Quarters**, **Ten Centimetres** | Describes the product's actual physical signature. "Nearer" is inert on a home screen and true to both rooms. |
| **Time / permission-by-scheduling** (permission without the accusation) | **The Hour**, **Quiet Hours**, **Slow Hours** | "Quiet Hours" is a phrase iOS itself uses — maximally inert, maximally deniable, and it genuinely describes Focus. |
| **Attention as the shared idea** (the honest thesis, minus the sting) | **Attend**, **Held**, **Undivided** | "Undivided" carries "undivided attention" — permission *and* focus *and* intimacy, without ever pointing at the self. |

My recommendation to test first: **Quiet Hours** (strongest on discretion, weakest on distinctiveness) against **Undivided** (strongest on meaning, riskier to spell) against holding **Selfish**. Test with Kirsten- and Aisha-shaped users, not Marisol-shaped ones — the reclaimers will like anything.

### 6.2 AI disclosure — copy that has a chance

You cannot hide it (EU AI Act Art. 50 since 2 Aug 2026; possibly a vendor contract requirement) and hiding it is the failure mode that ends companies. So the question is what to say. The panel's own words point to three rules:

- **Lead with what AI buys the listener, never with the AI.** Not "AI-narrated." The claim is *"a story rendered for you: your voice, your pacing, your limits, your length."* hearr.me already positions this way and it is the only honest version.
- **Put the disclosure at the paywall, in plain language, above the fold.** Hannah: *"Tell me up front, in the paywall, not in a settings page."* A disclosure discovered later is a betrayal; a disclosure offered early is a term of the deal.
- **Never claim it's as good as a person.** Every competitor claim of that shape invites the "100% human" counter-punch, which Dipsea has already loaded. Claim the thing humans can't do.

**And seriously reconsider full-synthetic.** The panel's evidence points at the hybrid the market research already flagged as unexplored: **human/licensed performers, generatively assembled and personalised, credited and paid per generation.** It is the only configuration that gets a "yes" from Jo (who is otherwise a permanent, vocal enemy), keeps Marisol's community politics onside, gives Grace a person to believe in, and preserves the "hitch in the breath" the paying cohort explicitly cites when justifying price. If the answer is "too expensive," that is a real answer — but it should be stated as a deliberate trade, not assumed away.

### 6.3 Name-whispering — how to ship it if you ship it

Do not make it a default. Do not make it a headline. Specifically:

- **Off by default.** Opt-in, in a settings screen, with the copy stating plainly that this stores your name.
- **Pronunciation gate before first use.** Play the name alone, in the chosen voice, and ask *"Did we say that right?"* with a phonetic re-spell field. If it's wrong you have burned the feature permanently (Marisol: *"if a robot says it wrong once I'm out"*), and non-Anglo names will be wrong most often — which makes a mispronunciation bug into an exclusion bug.
- **Once per story, at a marked emotional beat.** Not sprinkled. Grace: *"not every thirty seconds like a call-centre script."*
- **Never in Focus. Never in a notification. Never in a filename, a CDN path, a URL, or an analytics event.**
- **Rendered on-device if at all possible.** If the name splice can happen client-side over a shared, cacheable base render, you keep the cache economics *and* you never put a user's name in your infrastructure. If it must be server-side, the artefact must be ephemeral and destroyed on session end. Hannah's question — *"who holds the key, what's the filename, does it survive account deletion?"* — must have a written answer before this ships.
- **Consider shipping a pet-name/POV option instead.** "What should they call you?" with options (your name / "baby" / nothing) converts a creepy surveillance-feeling feature into a fantasy-authoring one, which is the register the product is otherwise in.

### 6.4 The warm-up path

Keep it. Two changes: a permanently visible **"take me to the library"** escape on the first screen, and **remember the last state** — if she skipped the warm-up last time, don't ask again, offer "resume where you were." The warm-up is a first-session design and a lapsed-user design, not a nightly toll booth.

### 6.5 Focus + Desire isolation

The bundle earns its keep (+5) but only if the isolation is real and demonstrable. Concretely, from Ruby's objection: Desire content must never appear in Spotlight, Siri suggestions, Shortcuts, Handoff, Now Playing metadata, Control Center, the Home Screen widget, or Screen Time category detail. **Ship a "Work Mode" that hard-disables the Desire room until Face ID reauthenticates** — and say so on the App Store page, because it is a reason to download.

Also: the thesis already concedes that whispered voice under focused work is likely an anti-feature per the irrelevant-speech literature. The panel agrees more strongly than the thesis does — make the whispered bookends **opt-in**, not opt-out. Ruby is lost on default-on.

### 6.6 ASMR controls

Ship three sliders and one tag from day one: **mouth-sound intensity** (off / light / full), **breath level**, **room ambience** (the anti-"empty white room" control). Every item carries a texture tag. Default all three to conservative. Put "no mouth sounds" in the App Store screenshots — Emjoy's reviewer wrote your marketing copy for you.

### 6.7 Table stakes, non-negotiable at launch

Autoplay and queue that work; sleep timer with fade; offline downloads; search, favourites and playlists; no buffering; a cancel button that cancels; a neutral subscription display name in Settings; and free samples before the paywall (*"There isn't enough 'snippets' or samples to accurately judge this service"*). Every one of these is a live competitor complaint. Clearing them costs weeks and buys the entire "I switched from X" narrative.

### 6.8 Trauma-informed mechanics as product

From Aisha, and from the corpus's most intense praise: pre-session content labels that become **permanent filters** (hard-exclude degradation, "Daddy," non-consent framing, specific acts); an always-available soft exit that fades rather than cuts; a guaranteed aftercare tail on every escalating item; and no surprise escalation past the set intensity, ever. Do this as mechanics. Do not market it as therapy — Rosy, Ferly and Emjoy all ran clinical positioning with real credentials and all three are dead or dormant.

## 7. (e) The five riskiest assumptions, and the cheapest way to test each

### Risk 1 — "Disclosure won't kill it." *(Thesis §8, item 6)*
The concept's viability rests on a disclosed AI product retaining users in an intimacy category where the incumbent just publicly reversed and is being praised for it.

**Cheapest test — one week, no build.** Run the Edison design against *our* content type. Produce three 6-minute stories in three versions: full human, full TTS, hybrid (human performance bank + TTS name/connective material). Recruit ~300 women from the category (audio-erotica newsletter or Instagram audiences; do not use Reddit, whose politics will skew the result). **Blind first, then reveal.** Measure liking, arousal self-report, and — the real metric — *"would you pay $70/yr for a library of this?"* before and after the reveal. The Edison delta (31% → 70%) is your benchmark; if your post-reveal willingness *drops* rather than rises, the thesis is dead in its current form and the hybrid is the product.

### Risk 2 — "Name-whispering is the strongest 'how did it know' moment available." *(Thesis §4.2)*
The panel says it's the strongest *variance* available. It could be the screenshot everyone shares or the reason for a one-star review.

**Cheapest test — two days, no infrastructure.** Take one story and render four versions by hand: no name; name once at the emotional peak; name three times; and "baby"/pet-name instead. Include two deliberately mispronounced renders and at least eight non-Anglo names in the recruit. Ask one question after each: *"Would you turn this on?"* If it does not beat "no name" decisively among the Kirsten/Aisha-shaped segment, it is a niche toggle, not a pillar — and you have saved yourself the entire per-user-render architecture, which is the most expensive thing in the plan.

### Risk 3 — "The name reads as permission." *(Thesis §1)*
The evidence says it reads as permission to the already-converted and as the accusation to everyone else.

**Cheapest test — one afternoon, ~$300.** A 5-second glance test: show a home-screen mock with each candidate name and ask (a) "what does this app do?", (b) "would you be comfortable with this on your phone if someone else might see it?", (c) "would you say this app's name out loud to a friend?" Recruit specifically for the low-desire / partnered / lives-with-family segments — testing this on enthusiastic early adopters will produce a false pass.

### Risk 4 — "Combinatorial personalisation substitutes for a catalogue people can talk about." *(Thesis §3, §4.2)*
Word-of-mouth in this category runs on named voices (Quinn) and named stories (Dipsea). A per-user generated library has neither, and the panel's two most likely recommenders both recommend by *name*.

**Cheapest test — free, one week, no product needed.** Ask 20 current Quinn/Dipsea subscribers to recount the last time they recommended the app: reconstruct the exact sentence they used. Count how many recommendations are anchored to a proper noun (a voice, a story, a series, a celebrity) versus a feature. If proper nouns dominate — which is my prediction — you need a layer of *shared, nameable* hero content on top of the personalised catalogue, and that changes the production plan.

### Risk 5 — "Focus earns the download and the daily habit." *(Thesis §5)*
The whole acquisition and discretion strategy rests on it, and the thesis simultaneously concedes that the one thing making Focus distinctive (whispered ritual) is probably an anti-feature. If Focus is merely adequate, it is a fig leaf that fools nobody and earns no habit.

**Cheapest test — two weeks, ~$0 in build.** Ship *only* the Focus room as a standalone TestFlight/soft-launch to 200 people recruited from ADHD and productivity communities. Do not mention Desire. Measure D7 and D14 retention against Brain.fm's published benchmarks and against your own honest bar. If it does not hold a daily habit on its own merits, the "two rooms" architecture is a cover story rather than a strategy, and you should either invest properly in Focus or drop it and accept the App Store positioning problem directly.

---

## 8. Evidence versus inference — an honest ledger

**Well-evidenced (multiple independent sources, quoted, verified):** the embarrassment/CarPlay problem; the ASMR "tag it" complaint and the misophonia prevalence; the catalogue-runs-dry complaint; cancellation dark patterns; the anti-AI turn among creators and its adoption by a segment of listeners; Dipsea's reversal and its favourable reception; the blind-test counter-evidence on AI narration; the responsive-desire/priming behaviour; the trauma-informed use case; the "self-care is not selfish" framing and the trademark position.

**Single-source or thin, treat with care:** Aisha's pro-AI argument (that a synthetic voice is *safer* because no real person is implicated) — internally coherent, plausibly a real segment, but I found **no direct user evidence** for it and it should be tested rather than assumed. Grace's preference ordering (AI-written worse than AI-voiced) is likewise my inference, and it matters enough to be worth a specific question in Risk-1 testing. The claim that a spliced name will be audibly wrong is a technical inference consistent with the documented TTS failure taxonomy, not a measured result.

**Not evidenced at all — my reasoning only:** every persona, all seven, and every sentence attributed to them. The scorecard numbers are my judgements, not survey data. The word-of-mouth conclusion in §5 is an inference from *how* users describe recommending, not from measured referral data.

**Known gap:** no Reddit. r/AudioErotica, r/gonewildaudio, r/ADHDwomen, r/sexover30, r/TwoXChromosomes and r/asmr were all unreachable (403 / Cloudflare / Anubis). Reddit is the category's largest free substitute good and its most hostile constituency on AI. **Anyone acting on this document should get a human to read those subreddits directly**; if the panel is wrong anywhere, my bet is that it is *understating* the AI hostility, because the Reddit corpus is the most hostile part of the market and it is the part I could not read.

---

## 9. Sources

**App Store review pages (fetched live, 14 August 2026)**
- Quinn — Audio Stories, reviews — https://apps.apple.com/us/app/quinn-audio-stories/id1565600312?platform=iphone&see-all=reviews
- Dipsea: Audio Stories, reviews — https://apps.apple.com/us/app/dipsea-audio-stories/id1434242889?platform=iphone&see-all=reviews
- Dipsea (AU storefront), reviews — https://apps.apple.com/au/app/dipsea-audio-stories/id1434242889?platform=iphone&see-all=reviews
- Emjoy — Female wellcare, reviews — https://apps.apple.com/us/app/emjoy-female-wellcare/id1467274919?platform=iphone&see-all=reviews
- Bloom Stories: Spicy Audio, reviews — https://apps.apple.com/us/app/bloom-stories-spicy-audio/id6455040628?platform=iphone&see-all=reviews
- Kama: Intimacy & Connection, reviews — https://apps.apple.com/us/app/kama-sex-wellness-education/id1498761714?platform=iphone&see-all=reviews
- Whisper Stories, reviews — https://apps.apple.com/us/app/whisper-stories/id6755977657?platform=iphone&see-all=reviews
- Dipsea (Google Play) — https://play.google.com/store/apps/details?hl=en_US&id=com.dipsea
- Quinn review aggregation (used with caution; cross-checked against Apple) — https://appsrankings.com/app/1565600312/quinn-audio-stories

**AI voice: reception, reversal, and counter-evidence**
- "Dipsea ditches AI narration after deciding a human breath can't be faked" (2 Aug 2026) — https://technologytangle.com/2026/08/02/dipsea-ditches-ai-narration-after-deciding-a-human-breath-cant-be-faked
- Dipsea, "We No Longer Use AI At Dipsea, Here's Why" — https://www.dipseastories.com/blog/why-we-no-longer-use-ai/
- Edison Research at SSRS / Spoken, AI multi-cast vs human narration study (May 2026) — https://ssrs.com/news/in-largest-study-of-its-kind-u-s-fiction-audiobook-consumers-rate-spoken-multi-cast-higher-than-human-narration/
- Variety on the same study — https://variety.com/2026/digital/news/spoken-ai-audiobooks-preferencenew-edison-research-study-1236810295/
- Podcast News Daily on the same study (31% → 70% willingness shift) — https://www.podcastnewsdaily.com/news/edison-study-ai-audiobook-narration-clears-consumer-hurdle/article_dd35c305-ff0c-4337-ab80-c314daac3a17.html
- "Who cares about artificial intelligence? Human and artificial voices in audiobooks", *Computers in Human Behavior Reports* (2026) — https://doi.org/10.1016/j.chbr.2026.101068
- Ansani et al., "AI Performer Bias: Listeners Like Music Less When They Think it was Performed by an AI" — https://doi.org/10.1177/02762374241308807
- NSFW voice actor testimony on AI voices and consent (Eka's Portal forum thread) — https://www.aryion.com/forum/viewtopic.php?f=18&start=20&t=68082
- "Gone Wild Audio: An Exploration of an Intimate Reddit Community" (secondary source for the GWA AI-voice ban) — https://diversinet.com/gone-wild-audio/
- "Voice donors of synthetic voices are facing moral harm..." (consent framework) — http://conferences.leeds.ac.uk/the-future-of-practical-ethics-2025/wp-content/uploads/sites/113/2025/07/Voice-Donors-of-synthetic-harm.pdf

**ASMR, misophonia, and mouth sounds**
- PopSci, "Why ASMR calms some people down and sends others into a rage" (~20% prevalence estimate) — https://www.popsci.com/story/science/asmr-misophonia-videos/
- ASMR University, "ASMR vs Misophonia" (prevalence, demographics, trigger taxonomy) — https://asmruniversity.com/asmr-vs-misophonia/
- Edelstein et al., "Misophonia: physiological investigations and case descriptions", *Front. Hum. Neurosci.* — https://doi.org/10.3389/fnhum.2013.00296
- "The Kind of Music That Makes My Skin Crawl" (aversive vocal qualities: breathy, whispering, lisping) — https://doi.org/10.4324/9781003205364-16
- "I Asked Scientists Why I Can't Stand ASMR Videos" — https://www.pulse.ng/story/i-asked-scientists-why-i-cant-stand-asmr-videos-2024081116333624258
- Listener comment on mouth-sound intolerance within the ASMR audience — https://app.staging.bsky.dev/profile/gnocchidokey.bsky.social

**Desire, postpartum, perimenopause, SSRIs**
- "Sexologist Dr. Holly Wood: Pleasure is Self-Care | Motherhood, Desire & Reclaiming You" (the "audio erotica on my drive home... preheat the oven" account) — https://www.buzzsprout.com/2464997/episodes/18310052-sexologist-dr-holly-wood-pleasure-is-self-care-motherhood-desire-reclaiming-you-ep-39
- "Sexuality and Motherhood: Normalizing the 'Touched Out' Phase" — https://thebetteryouinstitute.com/sexuality-and-motherhood-normalizing-the-touched-out-phase/
- "Postpartum Intimacy and Low Libido After Baby" — https://northstarpsychdc.com/blog/postpartum-intimacy-low-libido-new-moms
- Psychology Today, "Why You Feel 'Touched Out'" (Feb 2026) — https://www.psychologytoday.com/sg/blog/the-long-game-of-love/202602/why-you-feel-touched-out-and-5-ways-to-get-your-spark-back
- "Antidepressants and Your Sex Life" (responsive vs absent desire on SSRIs) — https://cohesa.io/blog/antidepressants-and-your-sex-life
- Elektra Health, "Are SSRIs Lowering My Libido?" — https://elektrahealth.com/blog/are-ssris-lowering-my-libido/
- Eros Coaching on Basson's responsive-desire model — https://www.eroscoaching.com/2025/12/the-pink-pill-problem-a-clinical-sexologists-take-on-why-addyi-isnt-the-answer-we-need/
- "Perimenopause, GLP-1s, and What's Actually Affecting Your Sex Drive" — https://www.buzzsprout.com/2131523/episodes/18581147-perimenopause-glp-1s-and-what-s-actually-affecting-your-sex-drive-with-dr-kristen-wolfe

**Queer audience and category context**
- The Cut, "The Sapphic Audio-Erotica Boom" (Dipsea: ~40% of new releases queer) — https://www.thecut.com/article/sapphic-audio-erotica-boom-nsfw-voiceover-smut.html
- WBUR *Endless Thread*, "Gone Wild Audio" (listener-as-subject format; community norms) — https://www.wbur.org/endlessthread/2019/08/09/gone-wild-audio
- Nichole (Substack), "Audio For Women" (comparative user account of GWA, Quinn, Dipsea) — https://nichole.substack.com/p/audio-for-women-its-honestly-for
- Her Campus, "I Tried The Quinn Erotic Audio App" (family Apple ID) — https://www.hercampus.com/wellness/erotic-audio-quinn-app/

**The word "selfish", and name clearance**
- "Why Self-Care Is Not Selfish (It's the Most Generous Thing You Do)" — https://rubierubie.com/why-self-care-is-not-selfish/
- Dr Julie Hannan, "Why Women Struggle" ("self-care is not selfish", midlife framing) — https://www.drjuliehannan.com/insights/mind-emotions-liminality/why-women-struggle/
- Annie Wright, "The Good Girl Syndrome" ("systems that benefit from your compliance will always call your boundaries 'selfish'") — https://anniewright.com/good-girl-syndrome-high-achieving-women/
- The Rebel Rousers, "The Problem With Self-Care" (Lorde quote; critique of co-opted self-care) — https://therebelrousers.com/blog/the-problem-with-self-care
- Beauty Independent, Emma Grede "three-hour mom" reaction ("detractors slamming her as selfish") — https://www.beautyindependent.com/brand-founders-emma-grede-three-hour-mom-approach/
- USPTO via Markinton — `SELF!SH`, live pending, Selfish Brands Inc., wellness/self-improvement apps — https://markinton.com/trademark/self-sh-97897127
- USPTO via Markinton — `SELFISH`, dead, same applicant — https://markinton.com/trademark/selfish-97897105
- Existing App Store app "Selfish" (Food & Drink) — https://apps.apple.com/cl/app/selfish/id6473749251?l=en-GB
- Existing App Store app "Selfish – Funny Face Masks" — https://apps.apple.com/us/app/selfish-funny-face-masks/id1475767346

**Privacy expectations in sexual/reproductive health apps**
- Mozilla Foundation, *Privacy Not Included*: 18 of 25 reproductive health apps flagged — https://www.mozillafoundation.org/en/blog/in-post-roe-v-wade-era-mozilla-labels-18-of-25-popular-period-and-pregnancy-tracking-tech-with-privacy-not-included-warning/
- Mozilla, "What Does Giving Your 'Consent' Really Mean?" — https://www.mozillafoundation.org/en/privacynotincluded/articles/what-does-giving-your-consent-really-mean/
- Mozilla, Flo privacy review (FTC action over data sharing) — https://www.mozillafoundation.org/en/privacynotincluded/flo-ovulation-period-tracker/
- Popular Science on the Mozilla report — https://www.popsci.com/technology/mozilla-period-app-privacy-report/

**Trauma-informed content practice**
- "Content Warnings Will Help Your Podcast: Here's Why and How to Do Them" — https://writingalchemy.net/2018/12/11/content-warnings/
- ReFrame Resource, "Supporting Survivors in the Post-Production Phase" — https://reframeresource.com/resources/supporting-survivors-in-the-post-production-phase/

**Focus / ADHD audio context**
- ADDA, "What Is Brown Noise and Can It Help People With ADHD?" — https://add.org/brown-noise-adhd/
- Brain.fm review (ADHD-mode positioning and user testimony) — https://buttondown.com/theapptoolkit/archive/brainfm-review-the-focus-music-app-that-finally/

**Internal**
- `docs/plan/00-product-thesis.md`
- `docs/research/01-market-landscape.md` (§3 voice of the customer; §5 AI reception; §7 pricing/retention)
- `docs/research/02-compliance-and-legal.md` (§1 hard blockers; §2 design constraints — in particular C-11, EU AI Act Art. 50 disclosure from 2 Aug 2026)
