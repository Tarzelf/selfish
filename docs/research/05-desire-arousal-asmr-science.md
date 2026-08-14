# The Science of Desire, Arousal, Audio Erotica and ASMR

**Design research brief — evidence review**
**Prepared:** August 2026
**Scope:** Peer-reviewed sexual science, psychoacoustics, attention research and platform data, assessed for their implications for an iOS app delivering AI-scripted, synthetically voiced audio erotica and intimate audio, primarily to women, with a secondary focus/concentration use case.

---

## How to read this document

Claims are graded so the product team can tell load-bearing science from suggestive signal:

| Grade | Meaning |
| --- | --- |
| **[Well established]** | Replicated across multiple independent samples, usually with meta-analytic or large-sample support. Safe to build on. |
| **[Reasonably supported]** | Consistent direction of effect, but limited replication, modest samples, or unresolved methodological debate. Build on it, but instrument it. |
| **[Contested]** | Genuine disagreement in the literature, or effects that reverse across studies. Do not build a core mechanic on this. |
| **[Weak / non-peer-reviewed]** | Industry data, press reporting, single unpublished analyses, or claims that could not be traced to a primary source. Useful as market signal only. |

A recurring caveat applies to almost all of the sexual-science literature below: samples skew young, White, cisgender, heterosexual, North American and university-educated. A 2022 review of the field states this explicitly, noting that fantasy research has "focused on young, cisgender, heterosexual adults in North America" and that studies accounting for diversity find both similarities and notable differences ([Curr Opin Psychol, 2022](https://www.sciencedirect.com/science/article/abs/pii/S2352250X22002172)). Treat every prevalence number as an estimate from a convenience sample unless stated otherwise.

---

## 1. The science of female sexual response

### 1.1 Responsive desire and the circular model

Rosemary Basson's 2000 paper in *Journal of Sex & Marital Therapy* proposed that the traditional linear cycle (desire → arousal → orgasm), derived from Masters and Johnson and modified by Kaplan, misdescribes many women's experience. In Basson's account, women frequently begin a sexual encounter from a state of "sexual neutrality," motivated by non-sexual incentives such as intimacy, closeness or a partner's overture; desire then emerges *after* arousal has begun, as a responsive rather than spontaneous event ([Basson, 2000](https://www.imop.gr/sites/default/files/basson2000.pdf)).

Basson cites Cawood and Bancroft's community study of 50 premenopausal women, in which only 2 reported sexual thoughts more often than once a week and 23 reported them less than once a month or never — despite being sexually functional and satisfied. **[Well established]** that a substantial minority-to-majority of women do not experience frequent spontaneous sexual thoughts, and that this is not itself pathological.

**Important corrective.** The circular model is often presented in popular sexual-wellness writing as *the* model of female sexuality. The primary evidence does not support that framing. Sand and Fisher's Nurses' Sexuality Study (n = 133 of 580 mailed) found that **approximately equal proportions of women endorsed the Masters and Johnson, Kaplan, and Basson models** as describing their own experience. Critically, women who endorsed the Basson model had significantly *lower* Female Sexual Function Index scores than those endorsing linear models. The authors conclude that Basson's model "may best reflect women with sexual concerns (e.g., FSFI < 26.55), rather than a single normative sexual response pattern" ([Sand & Fisher, 2007, *J Sex Med* 4:709–720](https://pubmed.ncbi.nlm.nih.gov/17498106/)).

A later systematic review of linear versus circular modelling found only 13 original studies and one review meeting inclusion criteria, with "limited evidence that most women identify with linear sexual response pathways" alongside "increasing evidence that circular pathways may accurately reflect some aspects of the female sexual response" ([J Sex Res, 2011](https://doi.org/10.1080/00224499.2010.548611)). Giles and McCabe similarly found no single model consistently endorsed ([*J Sex Med*, 2009](https://www.sciencedirect.com/science/article/abs/pii/S1743609515322724)).

**Verdict: [Reasonably supported]** — responsive desire is real, common, and clinically important, but it is one pattern among several, and it is *over*-represented among women with sexual difficulties. The correct design stance is not "assume all women have responsive desire" but "never assume the user arrives already wanting sex, and never make her feel abnormal either way."

### 1.2 Dual control: excitation and inhibition ("accelerators and brakes")

The Dual Control Model, developed by John Bancroft and Erick Janssen at the Kinsey Institute, holds that sexual response is the product of two largely independent neurophysiological systems — sexual excitation (SE) and sexual inhibition (SI) — and that individuals vary stably in their propensity for each ([Kinsey Institute](https://kinseyinstitute.org/research/dual-control-model.html); [Bancroft et al., 2009, *J Sex Res* 46:121–142](https://doi.org/10.1080/00224490902747222)). Instruments exist for both sexes: SIS/SES for men ([Janssen et al., 2002](https://doi.org/10.1080/00224490209552130)) and the SESII-W for women, developed from qualitative data on 655 women and yielding eight factors under two higher-order excitation and inhibition dimensions.

Janssen and Bancroft's 2023 scoping review synthesised 152 papers published 2009–2022. Its conclusions: **sexual excitation is particularly relevant to sexual desire and responsivity**, and predicts both asexuality and hypersexuality; **sexual inhibition plays a role in sexual dysfunction, sexual risk-taking and sexual aggression**, often in interaction with excitation ([*J Sex Res*, 2023](https://doi.org/10.1080/00224499.2023.2219247)). Self-reported SE and SI propensities are typically uncorrelated or only weakly correlated, supporting their independence.

Emily Nagoski's *Come As You Are* popularised this as the "accelerator and brake" metaphor and is the reason most product teams have heard of it. Her contribution is translation and clinical application, not new primary data; the underlying science is Bancroft, Janssen, Graham and Carpenter's. **[Well established]** that inhibition and excitation are separable, that people vary normally on both, and that "normal" levels of inhibition proneness are adaptive rather than defective.

**Design meaning.** Arousal is not only a matter of adding stimulation. For a meaningful fraction of users, the binding constraint is inhibition — self-consciousness, fear of interruption, performance concern, "not-just-right" feelings, lack of trust. A product that only adds accelerator (more explicit, more intense, faster) will fail those users. Removing brakes (privacy, no judgement, no performance demand, control over pacing, no surprises) is a distinct and equally important lever.

### 1.3 Arousal non-concordance

Chivers, Seto, Lalumière, Laan and Grimbos conducted the definitive meta-analysis: 132 peer- or academically reviewed laboratory studies published 1969–2007, totalling 2,505 women and 1,918 men. The correlation between self-reported and genital measures of sexual arousal was **r = .66 for men and r = .26 for women** — a statistically significant gender difference. For the narrower question of whether people can perceive their own genital arousal, the gap was starker: r = .73 for men versus r = .23 for women ([Chivers et al., 2010, *Arch Sex Behav*](https://pmc.ncbi.nlm.nih.gov/articles/PMC2811244/)).

Two methodological moderators were identified: stimulus variability and the timing of subjective assessment. The authors themselves raise the possibility that "there is no real gender difference in concordance, but the current methods of assessing self-reported and genital sexual responses attenuate concordance estimates in women or increase concordance estimates in men." **[Well established]** that measured concordance is markedly lower in women; **[Contested]** whether this reflects a genuine psychophysiological difference or measurement artefact.

Related finding: women high in sex guilt reported *less* subjective arousal but showed *significantly greater* physiological arousal to erotic video than women low in sex guilt ([Morokoff, 1985, *JPSP* 49:177](https://doi.org/10.1037/0022-3514.49.1.177)). Negative affect suppresses reported arousal without suppressing genital response.

**Design meaning.** Genital response is not a valid proxy for wanting, liking, or consent — a point with direct copy implications. The product should never imply that a bodily signal is the authoritative measure of whether something worked. Self-report of *enjoyment* and *desire to return* is the right success metric; and content should explicitly normalise the mismatch, because women who don't know about non-concordance often interpret it as personal malfunction.

### 1.4 Narrative and relational context beat visual and gender cues

This is the single most product-relevant finding in the review.

Chivers and Timmers presented 43 heterosexual women and 9 heterosexual men with **audio narratives** describing sexual or neutral encounters with female and male strangers, friends, or long-term relationship partners, while measuring genital and subjective arousal. Results:

- Men showed category-specific genital *and* subjective arousal with respect to partner gender.
- Women showed **non-specific genital arousal** but **category-specific subjective arousal** — their bodies responded regardless of the gender depicted; their reported arousal tracked their stated preference.
- **Relationship context significantly affected women's genital arousal but not men's.** Arousal to both female and male *friends* was significantly lower than to *strangers* and to *long-term relationship partners*.

The authors conclude: "relationship context may be a more important factor in heterosexual women's physiological sexual response than gender cues" ([Chivers & Timmers, 2012, *Arch Sex Behav*](https://pubmed.ncbi.nlm.nih.gov/22406875/)). A companion study confirmed these patterns vary systematically with degree of androphilia/gynephilia ([*PLOS ONE*, 2015](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0142575)).

**[Reasonably supported]** (single well-designed study on narrative stimuli, consistent with a larger category-specificity literature — [Chivers et al., 2004, *Psych Sci* 15:736–744](https://europepmc.org/article/MED/15482445); [Chivers, 2010 review](https://doi.org/10.1080/14681994.2010.495979)).

**Design meaning.** The *relational frame* of a scene — who this person is to the listener — is a first-class content dimension, arguably more predictive of response than any physical detail. And the "friend" frame specifically underperformed both the stranger frame and the established-partner frame. That maps neatly onto the two poles that dominate commercial platform data (see §3.5): the established, loving "boyfriend" frame and the charged stranger/rival frame. It also suggests that vague, unplaced narrators ("someone you sort of know") are the weakest option.

### 1.5 Stress, distraction, and self-focus

- **Chronic stress.** Hamilton and Meston compared women high versus average in chronic stress (n = 15 each) watching an erotic film. The high-stress group showed **lower genital arousal, higher salivary cortisol, and more self-reported distraction**. Crucially, "the main predictor of decreased genital sexual arousal was participants' distraction scores" — distraction was the only significant predictor once other variables were controlled. Subjective arousal was *not* impaired ([Hamilton & Meston, 2013, *J Sex Med*](https://doi.org/10.1111/jsm.12249)).
- **Acute stress.** An RCT in which acute stress was induced by a frustrating computer task before erotic exposure found lower genital *and* subjective arousal in the stressed condition ([ter Kuile et al., 2007](https://pubmed.ncbi.nlm.nih.gov/17481578/)). Note that a separate line of work finds acute *sympathetic* activation can facilitate genital arousal — the relationship is plausibly non-monotonic ([Hamilton dissertation](https://repositories.lib.utexas.edu/items/ece52919-b0a9-4c79-b2bd-a4efec022f5f)).
- **Self-objectification and "spectatoring."** Masters and Johnson's original clinical observation — that dividing attention to watch oneself from outside impairs response — has substantial modern support. Appearance-based cognitive distraction predicts lower sexual esteem, satisfaction and orgasm consistency ([Dove & Wiederman, 2000, *J Sex Marital Ther* 26:67–78](https://www.tandfonline.com/doi/abs/10.1080/009262300278650)). In a sample of 493 women and 595 men, **appearance-based and performance-based cognitive distraction fully mediated** the effect of body dissatisfaction on distressing sexual difficulties in women, whereas in men only performance-based distraction partially mediated it ([Pascoal et al., 2017, *J Sex Res*](https://doi.org/10.1080/00224499.2016.1168771)).

**[Well established]** that cognitive distraction is a primary mechanism suppressing women's sexual arousal, and **[Well established]** that appearance self-consciousness is a major source of that distraction specifically in women.

**Design meaning.** This is the deepest scientific case for audio as a medium: it is the format that most directly removes the two largest documented distractors — external appearance comparison and performance evaluation. It also argues for an app that reduces cognitive load everywhere else: fast start, no decision paralysis, no interruptions, no notifications mid-scene.

### 1.6 Life-stage and hormonal modulation

**Relationship duration. [Well established].** Murray and Milhausen found women's sexual desire was significantly and negatively predicted by relationship duration after controlling for age, relationship satisfaction and sexual satisfaction, while men's desire was not affected by duration at all (n = 170; [*J Sex Marital Ther*, 2012, 38:28–40](https://doi.org/10.1080/0092623x.2011.569637)). Two multi-wave longitudinal newlywed studies (72 and 135 couples, seven waves) replicated this: women's desire declined more steeply than men's, which did not decline on average; childbirth accentuated the difference; and **declines in women's — but not men's — desire predicted declines in both partners' marital satisfaction**. Effects held controlling depressive symptoms and parenting stress ([McNulty et al., 2019, *Arch Sex Behav*](https://link.springer.com/article/10.1007/s10508-019-01471-6)).

**Postpartum and breastfeeding. [Well established].** Systematic reviews put postpartum sexual dysfunction at **41–83% in the first three months** and **around 60% at one year**; among breastfeeding women, **60–80%**. The dominant mechanisms are hyperprolactinaemia and hypo-oestrogenism causing reduced desire, reduced lubrication and dyspareunia, compounded by sleep deprivation, fatigue, postpartum depression and body-image change ([*BMC Women's Health*, 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12961805/); [*J Clin Med*, 2025 meta-analysis](https://doi.org/10.3390/jcm14030691)).

**Menopause and midlife. [Well established].** The PRESIDE study (>31,000 US women aged 18–102) found any sexual problem in 44.2% of women, with 12% having a *distressing* sexual problem. Sexual problems rose steeply with age — 27.2% (18–44), 44.6% (45–64), 80.1% (65+) — but **distress did not**: distressing low desire was 8.9%, 12.3% and 7.4% respectively ([International Menopause Society White Paper](https://www.imsociety.org/wp-content/uploads/2020/07/sexual-welbeing-after-menopause-english.pdf)). The Melbourne Women's Midlife Health Project tracked >400 women for eight years and saw low sexual function rise from 42% to 88% across the transition; SWAN located the sharpest decline in the ~20 months before the final menstrual period ([*Nature Medicine*, 2025](https://preview-www.nature.com/articles/s41591-025-03593-y)). Genitourinary syndrome of menopause affects roughly 50% of postmenopausal women. A 2025 clinic study of 4,900 women found midlife (50–64) and older (65+) women equally likely to meet FSD criteria, but **older women reported less distress** ([*Menopause*, 2025](https://menopause.org/wp-content/uploads/press-release/MENO-D-25-00126.pdf)).

**Menstrual cycle. [Contested] — and this matters, because it is a tempting product feature.**
- Supporting: a study of 97 women with 15 days of daily hormone sampling found significant peri-ovulatory versus luteal differences on all sexual function variables, with within-subject estradiol positively and progesterone negatively predicting desire — but **no support for hormonal influences on sexual arousal or on initiation** ([*J Sex Res*, 2022](https://doi.org/10.1080/00224499.2022.2110558)).
- Against: a two-cycle study (n = 88 and 68) plus a fertility-treatment quasi-experiment found sexual attraction to visual sexual stimuli did **not** vary consistently across two consecutive cycles, and found no consistent association with estradiol, progesterone or testosterone — even at supraphysiological estradiol levels of up to 11,746 pmol/L during ovarian stimulation ([*Psychoneuroendocrinology*, 2023](https://doi.org/10.1016/j.psyneuen.2023.106060)).
- Against: a double-blind, randomised, placebo-controlled trial (N = 126) administering estradiol valerate found **no effect on orgasm frequency and only minor effects on sexual desire**, concluding that short-term estradiol increases "are unlikely to explain the increase in sexual desire around ovulation" ([*Psychoneuroendocrinology*, 2023](https://doi.org/10.1016/j.psyneuen.2023.106682)).
- The broader ovulatory-shift literature has produced conflicting findings across a large body of work ([Oxford Handbook chapter](https://doi.org/10.1093/oxfordhb/9780197524718.013.24)).

**Verdict:** there is a small, real average uptick in desire around the fertile window, but the hormonal mechanism is unresolved and between-person variability swamps within-person cycle effects. **Do not build cycle-phase content targeting as a headline feature.** Individual variation, mood, sleep and stress are better predictors, and getting a cycle prediction visibly wrong is both embarrassing and (post-Dobbs) a privacy liability.

---

## 2. Why audio

### 2.1 Audio reliably produces genital and subjective arousal

Audio narrative is not a weaker stimulus class — it is a different one. Chivers and Timmers demonstrated significant genital and subjective sexual response to purely audio narratives in both sexes ([2012](https://pubmed.ncbi.nlm.nih.gov/22406875/)); a 2023 review notes that the one prior study presenting audio narrative erotica "demonstrated similar genital responses to those induced by visual or visual-audio stimuli" ([*Behavioral Sciences*, 2023](https://www.mdpi.com/2076-328X/13/3/273)). Heiman's classic study measured response to tape, film and self-generated fantasy in 55 women aged 21–58 ([*Arch Gen Psychiatry*, 1980](https://doi.org/10.1001/archpsyc.1980.01780240109013)).

**Honest caveat. [Reasonably supported]** that film produces *higher peak* genital arousal than fantasy (Laan et al., cited in [Both et al., 2005](https://doi.org/10.1038/sj.npp.1300580)). Audio's advantage is not raw intensity; it is everything around intensity — accessibility, context-fit, imaginative control and the absence of inhibitors.

A useful nuance from the Chivers meta-analysis: concordance was reported as *positive* with sexual fantasy, *negative* while listening to audiotaped stories, and not different from zero during film, in women with arousal disorder (Morokoff & Heiman, 1980). Audio is not automatically the highest-concordance medium. What audio does reliably is leave room for self-generated imagery, and self-generated stimuli are less likely to evoke the negative affect that suppresses subjective arousal.

A 40-participant study of emotional and cardiac responses to erotic audio found **comparable heart-rate deceleration in both sexes** (an index of attentional orienting), but a striking asymmetry in affect: **women reported higher shame than men and rated erotic audio as less pleasant than happy audio, while men rated erotic and happy audio as equally pleasant**. The authors attribute this to sociocultural modulation ([*Behav Sci*, 2023, 13(3):273](https://doi.org/10.3390/bs13030273)). **[Reasonably supported]** — small sample, but directionally consistent with the sex-guilt literature. Shame is not a fringe concern for this audience; it is a first-order design constraint.

### 2.2 Removing the visual removes the documented inhibitors

Section 1.5 established that appearance-based cognitive distraction is a primary suppressor of women's arousal. Audio removes the comparison target entirely. Practitioners describe this in the same terms the literature does: "You're not looking at the body of the actors and comparing yourself. You're not searching their expressions for sincerity, or bound by the environment, or wardrobe, or positions" ([Daily Beast](https://www.thedailybeast.com/audio-porn-once-an-r-rated-reddit-phenomenon-goes-mainstream-2/)).

Chadwick, Raisanen, Goldey and van Anders documented women's *agentic strategies* for making pornography worthwhile, among which was **listening only to the audio track of video pornography** in order to avoid negative visual content and to imagine alternative scenarios ([*Arch Sex Behav*, 2018, 47:1853–1868](https://doi.org/10.1007/s10508-018-1174-y)). Women were already extracting an audio-only product from a video-first medium before audio-first products existed. That is about as clean a demand signal as behavioural research provides.

Audio also has a genuine accessibility argument: it serves blind and low-vision listeners, and listeners for whom visual explicitness is overwhelming or re-traumatising ([*iJournal*, 2025, "Listening Instead of Looking"](https://doi.org/10.33137/ijournal.v11i2.47517); [*The Guardian*, 2023](https://www.theguardian.com/tv-and-radio/2023/nov/02/disabled-people-are-sexual-inside-the-audio-pornography-boom-that-is-revolutionising-desire)).

### 2.3 A widely repeated statistic that we should not repeat

Dipsea's founding narrative, and much of the press coverage of the category, rests on the claim that "90% of women use mental framing (or scenario conjuring) to get turned on," attributed to OMGYes in partnership with the Kinsey Institute ([Marie Claire](https://www.marieclaire.com/sex-love/a25449637/audio-porn-app-dipsea/); [Creative Review](https://www.creativereview.co.uk/how-dipsea-is-rethinking-erotica/)). **[Weak / non-peer-reviewed].** We could not trace this figure to any peer-reviewed publication or published methodology. It appears only in press and marketing material. The underlying idea — that imaginative/cognitive framing is central to women's arousal — is well supported by the literature reviewed above, but the specific number should not appear in our marketing, investor materials or in-app copy.

### 2.4 Listening context

Self-reported listening data from Dipsea's product analytics: **60% of listeners report listening out loud** (i.e., on speakers, not headphones); 58% report in-ear headphones; 13% noise-cancelling; 12% over-ear (multiple selection permitted) ([Dipsea blog](https://www.dipseastories.com/blog/audio-erotica/)). **[Weak / non-peer-reviewed]** — single-vendor, self-selected, self-reported — but it is the best available data and it is surprising enough to be worth designing for. Out-loud listening implies partnered and hands-free use, and it implies that a design assuming private headphone listening will mis-serve a majority.

The ASMR literature gives a cleaner picture of *when*: Barratt and Davis found **81% of participants engaged with ASMR media at night before sleep**, 4% on waking, 2% in the morning, and 30% during the afternoon; 52% required specific environmental conditions, near-universally quiet and relaxed, and many specified binaural headphones for depth of sound ([Barratt & Davis, 2015, *PeerJ* 3:e851](https://doi.org/10.7717/peerj.851)). Dipsea's own framing targets "in-between" moments — before a date, after work, before bed ([Marie Claire](https://www.marieclaire.com/sex-love/a25449637/audio-porn-app-dipsea/)).

**Design meaning.** Bed at night is the anchor context. Design for: dark rooms, one-handed or no-handed operation, low cognitive load, no bright screens, gentle endings that don't jolt someone out of a pre-sleep state, and a genuine speaker-mode mix (not just a headphone mix played loud).

---

## 3. What women actually want in erotic content

### 3.1 The two largest fantasy datasets

**Justin Lehmiller, *Tell Me What You Want* (2018), N = 4,175 US adults.** Sampling caveat stated by the author: recruited largely through social media, 79% White, 72% heterosexual, not representative of the US population. Seven core themes emerged: (1) multipartner sex; (2) power, control and rough sex/BDSM; (3) novelty, adventure and variety; (4) taboo and forbidden sex; (5) passion, romance and intimacy; (6) nonmonogamy and partner sharing; (7) erotic flexibility and gender-bending ([Sex and Psychology](https://www.sexandpsychology.com/blog/2019/3/13/the-7-most-common-sex-fantasies-and-how-many-people-have-ever-had-them/); [Lehmiller lecture deck](https://sexualhealthalliance.com/justin-lehmiller-science-of-fantasy)).

Key prevalence figures:

| Fantasy | Women | Men |
| --- | --- | --- |
| Ever had *any* BDSM fantasy | 96% (only 4% never) | 93% (only 7% never) |
| Ever had *any* multipartner fantasy | 87% (only 13% never) | 95% (only 5% never) |
| Being sexually dominated | 93% | 81% |
| Dominating a partner | 76% | 85% |
| Being tied up / tying up | 85% | 73% |
| Masochism (being spanked/whipped) | 79% | 49% |
| Sadism (spanking/whipping a partner) | 60% | 56% |
| Public sex / consensual exhibitionism | 84% | 81% |
| Voyeurism | 48% | 72% |
| Sex being forced *on you* | 61% ever; **24% often** | 54% ever; 11.5% often |
| Forcing sex *on someone* | 20% ever; 4% often | 38% ever; 7% often |
| Same-sex fantasy among exclusively straight respondents | 59% | 26% |

Non-binary participants reported the highest rates of forced-sex fantasy (68% ever, 31% often).

Two further Lehmiller findings are directly actionable:
- **70% said they rarely or never fantasise about completely emotionless sex**, and there is "often an emotional undertone to the fantasy themes previously discussed" — e.g. multipartner sex functioning as a route to feeling desired. Lehmiller links this to the need to belong (Baumeister & Leary, 1995).
- **90% have fantasised about a current romantic partner; 51% do so often.** Fewer than 7% often fantasise about the rich and famous. The most common figure in people's fantasies is someone they actually know.

Stated *motives* for fantasising, in order: sexual arousal 79.5%, curiosity about different experiences 69.8%, unmet sexual needs 59.7%, temporary escape from reality 59.4%, expressing a taboo desire 58.4%, planning a future encounter 55.7%, **relaxation/anxiety reduction 43.6%**, boredom 40.0%, sexual confidence 32.5%, unmet emotional needs 29.8%.

**Joyal, Cossette and Lapierre (2015), *J Sex Med*, N = 1,516 (799 women), general population, not students.** Participants rated 55 fantasies. Only 2 of 55 were statistically rare; 9 were unusual; 30 were common. Women's prevalence, ranked by the study's intensity-weighted score ([full table](https://oraprdnt.uqtr.uquebec.ca/portail/docs/FWG/GSC/Publication/3702/524/11026/1/341972/6/O0001238633_What_Exactly_Is_an_Unusual_Sexual_Fantasy.pdf)):

| Rank | Item | Women | Men |
| --- | --- | --- | --- |
| 1 | **"I like to feel romantic emotions during a sexual relationship"** | **92.2%** | 88.3% |
| 2 | Oral sex (giving/receiving) | 78.5% | 87.6% |
| 3 | Sex in an unusual place | 81.7% | 82.3% |
| 4 | **"Atmosphere and location are important in my sexual fantasies"** | **86.4%** | 81.2% |
| 5 | Sex in a romantic location | 84.9% | 78.4% |
| 6 | Sex with a known non-partner | 66.3% | 83.4% |
| — | Being masturbated by partner | 71.4% | 71.7% |
| — | Sex with an unknown person | 48.9% | 72.5% |
| — | Making love openly in public | 57.3% | 66.1% |
| — | **Being dominated sexually** | **64.6%** | 53.3% |
| — | Being tied up | 52.1% | 46.2% |
| — | Dominating someone | 46.7% | 59.6% |
| — | Sex with a celebrity | 51.7% | 61.9% |
| — | Voyeurism (watching someone undress unaware) | 31.8% | 63.4% |
| — | Being spanked or whipped | 36.3% | 28.5% |
| — | **Being forced to have sex** | **28.9%** | 30.7% |
| — | Forcing someone to have sex | 10.8% | 22.0% |
| — | Petting a stranger in public | 19.8% | 48.4% |

The top four items for women are all about **emotional register and setting**, not act. "Atmosphere and location are important" (86.4%) outranks every specific sex act except oral sex. Lehmiller's independent finding matches: "Women also place more emphasis on WHERE they're having sex, men on WHO they're having sex with."

The presence of a *single* submissive fantasy significantly predicted overall fantasy scores for both genders; being dominated correlated strongly with being tied up (r = 0.60) and with being forced.

### 3.2 Consensual non-consent and ravishment fantasy

This category requires the most careful handling and has the best data.

**Prevalence.** Bivona and Critelli's study of 355 female undergraduates, using a checklist reflecting the legal definition of rape plus a systematic fantasy log, found **62% of women have had a rape fantasy** — higher than earlier estimates. Median frequency was about four times per year; **14% reported them at least weekly** ([*J Sex Res*, 2009, 46(1):33–45](https://doi.org/10.1080/00224490802624406)). Across the wider literature the range is roughly 31–62%, with methodology explaining most of the variance.

**Valence — the crucial detail.** Contrary to earlier claims that such fantasies were either wholly aversive or wholly erotic, Bivona and Critelli found a continuum: **9% completely aversive, 45% completely erotic, 46% both erotic and aversive.** Nearly half are experienced as mixed. This should shape how we tag and how we set up scenes.

**Explanations, empirically tested.** A follow-up study evaluated the three leading theories using a checklist of eight rape-fantasy types, free descriptions, an audio scenario presentation and personality measures ([Bivona, Critelli & Clark, 2012, *J Sex Res*](https://pubmed.ncbi.nlm.nih.gov/22544306/)):
- **Openness to sexual experience — strongest support.** Women higher in erotophilia, openness to fantasy and self-esteem had more frequent and more erotic rape fantasies. These are *sexually confident* women, not damaged ones.
- **Sexual desirability — moderate support.** The fantasy dramatises being so desired that another loses control.
- **Sexual blame avoidance — not supported.** The old "she needs an excuse so she can't be called a slut" theory failed empirical test.
- Ovulation and sympathetic-activation theories received no or partial support.

**[Well established]** on prevalence and valence distribution; **[Reasonably supported]** on the explanatory ranking (single research group, undergraduate sample).

**The control point.** Lehmiller's qualitative data make the operative mechanism explicit: in the fantasy "the fantasizer is in complete control and sets the terms, so it bears no resemblance to real-life sexual assault." Even among the minority fantasising about *forcing* someone, most made clear they did not want to assault anyone (typically "they secretly want it").

**A safety caveat that must not be skipped.** In Lehmiller's sample, **37% of women and 45% of non-binary participants reported a history of sexual victimisation** (broadly defined). Victimisation history was associated with more BDSM fantasy (excepting dominance) and with more fantasies of *both* emotional and emotionless sex. Whatever the causal story, the practical implication is that a meaningful minority of our users will be trauma survivors for whom an unexpected non-consent scene is a genuine harm, not a mild displeasure.

**Design meaning.** This content is (a) very common, (b) commonly ambivalent, (c) driven by *control over the terms*, and (d) potentially harmful when encountered unexpectedly. The design answer is therefore: build it, but only ever behind explicit opt-in, with the fantasy's internal logic preserving the listener's authorship, and never in any default, autoplay, or algorithmically surfaced surface.

### 3.3 Nancy Friday and the historical record

Nancy Friday's *My Secret Garden* (1973) and successors were culturally decisive — they established that women had elaborate sexual fantasies at all, at a time when clinical opinion doubted it, and Bivona and Critelli cite Friday among the early sources on ravishment fantasy. **[Weak / non-peer-reviewed]** as evidence: the material is solicited, self-selected, unquantified correspondence, edited for publication. Cite Friday for cultural history and for qualitative texture; never for prevalence.

### 3.4 Romance publishing, fanfiction and the revealed-preference corpus

Survey data tells us what people report wanting. Market and corpus data tells us what they actually consume, at scale, with their own money and time.

**Romance publishing. [Reasonably supported]** (commercial point-of-sale data, methodologically sound but proprietary). Circana BookScan reported **51 million print romance units sold in the US in the 12 months to mid-2025, up 24% year to date**, with romance "the leading growth category for the total print book market." Fastest-growing subgenres: romantasy and sports romance (both triple-digit growth), then suspense and contemporary romance. Notably, the growth persists after excluding Rebecca Yarros ([Circana, June 2025](https://www.circana.com/post/another-year-of-romance-with-a-dark-twist-circana-bookscan-reports)). Full-year 2025 romance rose 3.9% to almost 44 million units ([*Publishers Weekly*](https://www.publishersweekly.com/pw/by-topic/industry-news/financial-reporting/article/99417-print-book-sales-rose-slightly-in-2025.html)). Bloomberg put romantasy alone at US$610M in 2024 ([*Globe and Mail*](https://www.theglobeandmail.com/culture/books/article-romantasy-booktok-publishing-trends-2026/)).

Circana's analyst frames the direction of travel as "another year of romance with a dark twist," with top growth authors (H.D. Carlton, Rina Kent, Elsie Silver) working in dark romance, paranormal and anti-hero territory — aligned with growth in psychological thrillers (+29%), dark fantasy (+23%) and horror (+13%). **The audience is moving toward higher-intensity, morally complicated material, not away from it.**

**AO3 tag frequencies. [Reasonably supported]** for relative ordering, **[Weak]** for absolute counts (different analyses use different denominators — all works versus canonical no-fandom freeform tags — and produce different numbers). Usage of canonical no-fandom freeform tags over 2024-06 to 2025-06: Hurt/Comfort 278,299; Slow Burn 110,596; Emotional Hurt/Comfort 73,519; Friends to Lovers 68,393; Enemies to Lovers 49,106 ([batcat229, AO3](https://archive.transformativeworks.org/works/20310382/chapters/173541049)). Cumulative all-time counts from a separate analysis put Fluff above 1.1M, Angst above 900k, and Hurt/Comfort at 414k+ ([Romance Nerds](https://www.romancenerds.com/p/what-17-million-fanfics-tell-us-about)).

The consistent signal across every version of the analysis: **the highest-frequency tags are emotional-state tags, not act tags.** Fluff, Angst, Hurt/Comfort, Slow Burn. As the Romance Nerds analysis puts it, "explicit content overwhelmingly co-occurs with emotional tropes … The physical content isn't the fantasy. The vulnerability that comes with it is." That is a secondary source and should be treated as such, but it is congruent with Joyal's #1 women's item (romantic emotions, 92.2%) and Lehmiller's finding that 70% rarely fantasise about emotionless sex.

### 3.5 Platform data: what actually gets played

**Quinn. [Reasonably supported]** (founder-reported to multiple independent outlets, mutually consistent). ~80% of listeners are women (83% by one 2025 figure); age distribution 20% aged 18–24, **41.6% aged 25–34**, 25.6% aged 35–44; revenue doubled February to October 2025 ([*Variety*, 2026](https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/); [Wikipedia](https://en.wikipedia.org/wiki/Quinn_(app))).

The content findings are the valuable part:

- **"The top category has consistently been 'Boyfriend,' which offers 'loving relationship vibes.' That will alternate with 'MDom' — Christian Grey-type vibes. There's this interesting dichotomy that emerges where people want both."** ([*Variety*](https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/))
- **"Yearning" was among the most popular categories of the year** ([*Washington Post*](https://archive.ph/kLEoE)).
- The most popular story categories "focus on emotional connection, sorted into categories like 'aftercare,' 'apology,' 'body worship' and 'praise'" ([NBC News](https://www.nbcnews.com/pop-culture/pop-culture-news/smut-audio-erotica-growing-trend-quinn-celebrities-collaborations-rcna263065)).
- The breakout original, *Ember & Ice*, is an **enemies-to-lovers** story: 1.5M plays in week one, 3.5M+ plays and 39 million minutes listened.
- Filterable categories run to dozens: age difference, banter, bisexual, car sex, hate sex, infidelity, threesome, "Hold the Moan," "Best Friend's Brother."

**Dipsea. [Weak / non-peer-reviewed].** Subscribers skew women aged 18–34; content is organised by "heat levels" and *moods* ranging from "find a flirty headspace" to "catch feelings for yourself," and includes both narrative stories and non-narrative guided pieces ([Creative Review](https://www.creativereview.co.uk/how-dipsea-is-rethinking-erotica/); [NYT](https://www.nytimes.com/interactive/2023/07/31/style/dipsea-audio-stories.html)).

**The convergent picture across all four data sources** (Lehmiller survey, Joyal survey, AO3 corpus, Quinn plays) is unusually consistent. Ranked by expected value for a launch catalogue:

1. **Established loving partner / "boyfriend" register** — devoted, attentive, unambiguously yours. Quinn's most-played category; Joyal's #1 women's item; Chivers & Timmers' long-term-partner condition outperformed the friend condition.
2. **Being desired and chosen; praise; body worship** — Lehmiller's passion/romance theme, Quinn's "praise" and "body worship" categories. Directly counteracts appearance self-consciousness (§1.5).
3. **Male dominance / power exchange, receptive pole** — being dominated: 93% (Lehmiller), 64.6% (Joyal). Quinn's "MDom" alternates with "Boyfriend" for the top slot. Note the polarity: women's *receptive* dominance fantasy far exceeds their active one (Joyal: 64.6% vs 46.7%; Lehmiller: 93% vs 76%).
4. **Slow burn, yearning, anticipation, tension** — AO3's Slow Burn (110k+/year), Quinn's "yearning."
5. **Enemies-to-lovers / rivalry** — Quinn's single biggest original; AO3 Enemies to Lovers ~49k/year and rising.
6. **Hurt/comfort, aftercare, being taken care of** — AO3's #1 emotional tag by a wide margin; Quinn's "aftercare" and "apology."
7. **Forbidden / taboo (situational, not paraphilic)** — best friend's brother, age gap, workplace, infidelity framings. Lehmiller finds taboo a *more common* theme than passion/romance, with voyeurism (48% of women), consensual exhibitionism and public sex (84% of women) leading.
8. **Setting and atmosphere as a first-class axis** — 86.4% of women say atmosphere and location are important; 84.9% fantasise about romantic locations; 81.7% about unusual places.
9. **Consensual non-consent / ravishment** — 61% ever / 24% often (Lehmiller); 62% lifetime (Bivona & Critelli). High demand, opt-in only. See §3.2 and §7.
10. **Multipartner** — 87% of women have had such a fantasy, but note the gender-ratio difference: women were more open to MMF and same-gender configurations, men to FFM. Lower priority for a female-primary launch than its raw prevalence implies, because it is more often an *occasional* than a *favourite* fantasy.

### 3.6 How explicit is optimal?

There is no experiment that directly answers this for audio. The available evidence triangulates as follows:

- **More explicit does produce more measured arousal, at least in text.** An early study found "hard-core" stories produced significantly greater vaginal pulse amplitude and subjective arousal than "erotically realistic" stories ([*J Sex Res*, 1977](https://doi.org/10.1080/00224497709550982)).
- **But decontextualised explicitness underperforms for women.** In Joyal's ranked table, the items women rated most intensely are relational and atmospheric; the items that drop most sharply from men to women are the anatomically specific and stranger-focused ones (petting a stranger in public: 19.8% women vs 48.4% men; voyeurism 31.8% vs 63.4%).
- **Explicit content co-occurs with emotional structure in the revealed-preference corpora** (§3.4).
- **Shame rises with explicitness for women** more than for men (§2.1), and shame suppresses reported arousal without suppressing physiological response (§1.3).

**Synthesis [Reasonably supported]:** explicitness is not the variable to optimise; the *ratio of anticipation to explicitness* is. A long, well-built approach with a shorter explicit payoff is likely to outperform an early, sustained explicit sequence — and is certainly safer against shame-driven abandonment. Make heat level an explicit, persistent, user-set control rather than an editorial default, as both Dipsea and Quinn do.

---

## 4. The craft of arousing narrative and voice

### 4.1 Second-person address and the "listener" format

The dominant format in the largest amateur audio-erotica community, r/GoneWildAudio (roughly 400,000 subscribers as of 2020), is second-person direct address: "performers read scripts in the second-person, inviting the listener to visualize they are on the receiving end" ([Daily Beast](https://www.thedailybeast.com/audio-porn-once-an-r-rated-reddit-phenomenon-goes-mainstream-2/)). A community member describes the mechanism precisely: "When you are watching visual porn you are an observer … Whereas with audio erotica, usually the performer is speaking directly to you. The whole audio is in second person … So you feel as though you are a participant" ([WBUR *Endless Thread*](https://www.wbur.org/endlessthread/2019/08/09/gone-wild-audio)).

**[Weak / non-peer-reviewed]** as formal evidence — there is no controlled comparison of second-person versus third-person audio erotica that we could find. But the convergence of a decade of unpaid community iteration, the commercial platforms' adoption of the same convention, and the theoretical fit with §1.5 (being addressed positions the listener as *subject*, being narrated at positions her as *observer* — the spectatoring posture that demonstrably impairs arousal) makes this a strong prior. **This is the highest-value untested hypothesis in the document and should be our first A/B test.**

Practical craft conventions the community has converged on, which we should adopt as defaults and then test:
- Direct address and terms of endearment; the speaker names what he sees, wants and feels about *her*.
- Audible breath as a carrier of arousal and proximity — "a genuine moan is a powerful thing."
- The listener's responses are implied, not voiced, leaving her free to supply them.
- Scenes typically 10–30 minutes.
- A significant non-explicit adjacent genre exists: "sleep with me" audio, an hour of a person breathing beside you, described as "white noise for lonely hearts."

### 4.2 Voice qualities

**[Well established]** that women prefer lower-pitched (lower fundamental frequency, F0) male voices. Experimental manipulation — not just correlation — confirms it: lowering F0 increases attractiveness ratings ([Feinberg et al., 2005, *Animal Behaviour*](https://www.sciencedirect.com/science/article/abs/pii/S0003347204003987)). Men's F0 is inversely related to reproductive success, mating success and perceived dominance.

Refinements that matter for voice selection:
- **Pitch and apparent vocal tract length interact.** Women preferred low pitch more when paired with a large apparent vocal tract, and vice versa. Low pitch achieved by a synthetic method that does *not* also lengthen the apparent vocal tract will sound wrong ([Feinberg et al., 2011, *Behavioral Ecology*](https://doi.org/10.1093/beheco/arr134)). For synthesis, this means F0 and formant structure must be manipulated coherently, not independently.
- **Lower formant dispersion** (correlated with longer vocal tract, larger apparent body) is also preferred ([Hodges-Simeon et al.; review in](https://pmc.ncbi.nlm.nih.gov/articles/PMC10367192/)).
- **The preference is not linear.** Extremely low-pitched voices are not maximally preferred and may read as pathological. There is an optimum, not a floor.
- **Context-dependence.** Puts found low voice pitch was preferred mainly in *short-term* mating contexts rather than long-term committed ones, with the effect strongest in the fertile phase ([Puts, 2005, *Evol Hum Behav*](https://www.sciencedirect.com/science/article/abs/pii/S1090513805000176)). This maps onto our content taxonomy: the "MDom"/stranger/rival register may want a lower voice than the "boyfriend" register. **[Reasonably supported]** — worth testing as a voice-to-genre matching rule.
- **Intonation.** One study found women were more attracted to lower pitch *and higher intonation variation* ([*Evol Psychol*, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10367192/)). Flat delivery — a characteristic TTS failure mode — is a specific risk.
- **Breathiness.** Evidence is **[Contested]** for male voices; the reliable breathiness finding is for *female* voices, which are rated more attractive when breathier. Do not assume breathy male delivery is a win; test it.
- **ASMR-specific:** "Low-pitched sounds with dark timbre are effective in inducing ASMR" ([*Phil Trans R Soc B*, 2024](https://royalsocietypublishing.org/doi/10.1098/rstb.2023.0252)). Conveniently, this converges with the vocal-attractiveness literature.

**Accent** is frequently cited by listeners and is a first-class filter on Quinn ("Australian accent" is a browsable category), but we found no controlled research on accent and erotic vocal attractiveness. **[Weak]** — treat as a personalisation axis to be learned from behaviour, not from theory.

### 4.3 Does AI-generation reduce arousal? The disclosure problem

This is the most commercially consequential question in the document, and the literature gives a sharp, uncomfortable answer.

**Finding 1: people cannot reliably detect AI-generated creative text.** In a reception experiment on Czech poetry, participants performed at chance when guessing authorship (45.8% correct), and AI poems were rated *equally or more favourably* than human ones on average. Literary background did not improve detection ([*Digital Scholarship in the Humanities*, 2025](https://doi.org/10.1093/llc/fqag067)).

**Finding 2: but disclosure imposes a penalty, and the penalty is concentrated exactly on our content type.** In a series of pre-registered experiments, AI disclosure had **no meaningful effect** on evaluations of creative or descriptive short stories, but had a **negative effect on emotionally evocative poems written in the first person**. The authors interpret this as a reaction against AI in domains viewed as "distinctly human" ([Zhang & Gosline, SSRN 4369818 / arXiv 2303.06217](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4369818)).

Audio erotica in second person is emotionally evocative first-person intimate speech. It is the *worst case* for the disclosure penalty, not the neutral case.

**Finding 3: anthropomorphism amplifies the collapse.** Across two experiments manipulating emotional context and attributed source, "anthropomorphic cues temporarily elevate AI evaluations but collapse upon disclosure, particularly in high-stakes contexts. Attribution to ChatGPT led to the steepest declines in authenticity and moral respect" ([*Frontiers in Psychology*, 2025](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1568911/full)). A separate mixed-methods study found a statistically significant 0.68-point "authenticity valley" after disclosure, with AI content described as "polished but engineered, lacking vulnerability" ([IJSREM, 2024](https://doi.org/10.55041/ijsrem60452)) — **[Weak]**, low-tier venue, but directionally consistent.

**[Reasonably supported]** overall: disclosure reduces perceived authenticity for intimate first-person content, even when the content is indistinguishable blind.

**The resolution is not concealment.** Concealment is unethical, breaches App Store and advertising norms, and is a catastrophic trust event when discovered. The resolution is to **relocate the authenticity claim**. The literature's mechanism is a violated expectation of a specific human's lived experience and intent behind a first-person utterance. So:

- Disclose AI involvement clearly and once, at the **brand and system level** (onboarding, About, store listing) rather than as a per-scene banner immediately before an intimate experience. The Bridgland trigger-warning finding (§7.3) is relevant by analogy: a warning immediately before a stimulus reliably raises anticipatory affect without changing the response.
- Frame voices as **characters and personas**, not as people. A listener who knows she is hearing a character is not having an expectation violated. This is the same contract as an audiobook narrator or a radio play, and it is honest.
- Where budget allows, **keep humans visibly in the loop** — human editorial oversight of scripts, human voice talent for flagship series, credited writers. Quinn's entire growth strategy is built on named human performers; that is a real competitive moat and an authenticity asset we should not casually cede.
- Never let an AI voice claim to be a real person, to remember the user in a way that implies personhood, or to reciprocate feeling as a person would.

---

## 5. ASMR science

### 5.1 What it is, and who has it

Autonomous Sensory Meridian Response is a tingling sensation typically originating at the crown or back of the head and travelling down the spine and across the shoulders, elicited by specific audio-visual triggers — most commonly whispering, personal attention, crisp sounds and slow deliberate movements ([Barratt & Davis, 2015, *PeerJ* 3:e851](https://doi.org/10.7717/peerj.851)).

**Prevalence [Reasonably supported]:** approximately **20%** in one survey of 648 working adults and students ([*Front Psychol*, 2022](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.990565/full)); **23.5–28%** per a 2024 review ([*Phil Trans R Soc B*](https://royalsocietypublishing.org/doi/10.1098/rstb.2023.0252)). Roughly a fifth to a quarter of any audience. Trigger specificity is high and idiosyncratic — what works for one responder frequently does nothing for another.

**Personality correlates [Reasonably supported].** Comparing 290 ASMR individuals with 290 matched controls, ASMR responders scored significantly higher on **Openness to Experience and Neuroticism** and lower on Conscientiousness, Extraversion and Agreeableness. Subjective ASMR intensity across 14 common triggers correlated positively with Openness and Neuroticism ([Fredborg, Clark & Smith, 2017, *Front Psychol*](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00247/full)).

**Adjacent phenomena.** Synesthesia is roughly four times more common among ASMR responders than non-responders (22% vs 5%), and over half of self-identified synesthetes experience ASMR ([*Front Psychol*, 2022](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.990565/full)). ASMR intensity is associated with the aesthetic-sensitivity subscale of the Highly Sensitive Person scale ([*Phil Trans R Soc B*, 2024](https://royalsocietypublishing.org/doi/10.1098/rstb.2023.0252)).

### 5.2 Physiology

The key study is Poerio, Blakey, Hostler and Veltri: one large-scale online experiment and one laboratory study ([*PLOS ONE*, 2018, 13(6):e0196645](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0196645)).

- ASMR videos increased pleasant affect (both calmness *and* excitement) **only in people who experience ASMR**, and only for ASMR videos.
- In the lab: ASMR participants showed **reduced heart rate (mean −3.41 bpm, d = 0.39)** and **increased skin conductance level (mean +0.30 μS, d = 0.46 for the group difference)** relative to non-ASMR controls.
- This profile — decelerated heart rate with elevated electrodermal arousal — **distinguishes ASMR from aesthetic chills, which are accompanied by *increased* heart rate.** ASMR is calming and activating at once.

Neuroimaging **[Reasonably supported, heterogeneous]:** fMRI work reports increased activation in reward and social-cognition regions including nucleus accumbens, medial prefrontal cortex and insula, plus altered connectivity between default mode and salience/attention networks. A recent activation-likelihood-estimation meta-analysis notes methodological diversity and heavy reliance on self-report as continuing limitations ([preprint, 2025](https://doi.org/10.21203/rs.3.rs-7834852/v1)).

### 5.3 ASMR is not a sexual response — and this is well tested

This is a point on which the evidence is clear and where the product must not blur.

- Barratt and Davis: **98% agreed they sought ASMR for relaxation, 82% to help them sleep, 70% to cope with stress. Only 5% reported using ASMR media for sexual stimulation; 84% explicitly disagreed** with that characterisation.
- Poerio et al. tested sexual arousal directly in both studies and concluded: "both studies demonstrated that ASMR is not associated with sexual arousal … our research indicates that sexual arousal is not a reliable outcome of watching ASMR videos." They note the misconception "may arise from the often interpersonal and intimate nature of some ASMR videos."

**[Well established].** ASMR and sexual arousal are distinct phenomena that share surface features (whispering, proximity, personal attention, intimacy) and are therefore easy to conflate. Roughly 20–25% of people get tingles; approximately 5% use ASMR sexually.

Documented benefits [Reasonably supported]: relaxation, sleep onset, stress and anxiety reduction, and momentary alleviation of low mood and chronic pain symptoms; 50% of Barratt and Davis's participants reported improved mood even *without* tingles, while 30% said tingles were essential.

**Design meaning.** ASMR should be a **separate, clearly labelled surface** — not a heat level on the erotic scale and not decorative texture inside erotic scenes. The audiences overlap but the intents do not, and mislabelling in either direction is a bad experience: a user seeking sleep who gets sexual content has been ambushed; a user seeking arousal who gets a 40-minute non-sexual trigger track has been wasted. The single most valuable overlap is the *technique* — binaural capture, proximity, whisper register, slow pacing — which serves both, and the *timing*: both categories peak at night, in bed, before sleep.

---

## 6. Focus and attention: what the evidence actually supports

The honest summary: **almost every popular "focus audio" mechanic is weakly supported, and the one thing our core competency produces — intimate human speech — is the single best-documented way to *impair* focused verbal work.**

### 6.1 Speech is the problem, not the solution

**[Well established].** The irrelevant sound effect is one of the more robust findings in applied cognitive psychology.

- A Bayesian meta-analysis of 65 studies of auditory distraction during reading found background noise, speech and music **all had small but reliably detrimental effects on reading performance**, with **intelligible speech and lyrical music producing the biggest distraction**. The effect did not differ between adults and children ([Vasilev, Kirkby & Angele, 2018, *Perspectives on Psychological Science*](https://www.psychologicalscience.org/journals/perspectives/1745691617747398/)).
- A systematic review of 14 laboratory studies modelling intelligibility against performance found **performance begins to decline above a Speech Transmission Index of ~0.21 and reaches maximum decrement at STI ≈ 0.44**. Verbal short-term memory tasks were most strongly and most consistently affected ([Haapakangas et al., 2020, *Indoor Air*](https://onlinelibrary.wiley.com/doi/10.1111/ina.12726)).
- In a controlled comparison, **speech impaired serial recall significantly more than environmental sounds, with no habituation across trials** in either children or adults ([*Scientific Reports*, 2025](https://www.nature.com/articles/s41598-025-85855-w)).
- Semantic short-term memory tasks are more sensitive to speech than mathematical tasks ([*Applied Acoustics*, 2013](https://www.sciencedirect.com/science/article/abs/pii/S0003682X12002629)).

**Product implication, stated plainly: whispered voice content does not belong in a focus mode intended for reading, writing, coding or any verbally mediated work.** Even quiet, even soothing, even affectionate — if it is intelligible speech, the evidence says it costs performance and there is no habituation. If we ship a voice-containing focus mode, we should be explicit that its value is motivational and ritual, not cognitive, and we should default it off during work intervals.

There is a legitimate exception: **speech at the boundaries.** A spoken intention-setting at the start of an interval and a spoken close at the end sit *outside* the work period and can carry the ritual benefit without the interference cost.

### 6.2 Background music

**[Well established]** that background music is, on average, mildly harmful rather than helpful for memory- and language-based work.

- Vasilev et al.'s meta-analysis estimated a small but credible impairment of background music on reading, **Hedges's g = −0.19**, with lyrics worse than instrumental.
- A systematic review of 95 articles / 154 experiments across six cognitive domains found "a general detrimental effect of background music on memory and language-related tasks, and a tendency for background music with lyrics to be more detrimental than instrumental." Only **one** positive effect was found in the entire corpus (instrumental music). Effects were worse for difficult tasks and for introverts ([Cheah et al., 2022, *Music & Science*](https://sage.cnpereading.com/doi/10.1177/20592043221134392)).
- Lyrics in the *same language* as the material are worse than lyrics in another language; habitual music-while-studying listeners are less affected than non-listeners ([*Front Psychol*, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11027201/)).

**Implication:** instrumental only, no lyrics, no vocal samples with intelligible words. Wordless vocal texture (hums, pads) is likely safe; anything parseable as language is not.

### 6.3 Binaural beats

**[Contested], trending negative.** The commercial category rests on claims that the meta-analytic record does not support.

- The most-cited positive result: 22 studies, 35 effect sizes, overall **g = 0.45** across cognition, anxiety and pain ([Garcia-Argibay et al., 2019, *Psychological Research*](https://pubmed.ncbi.nlm.nih.gov/30073406/)).
- A more recent meta-analysis focused on memory and attention: 15 studies, 31 effect sizes, **g = 0.40**, but the accompanying systematic review found "conflicting results, especially concerning theta and beta's efficacy" ([Basu & Banerjee, 2023, *Psychological Research*](https://pubmed.ncbi.nlm.nih.gov/35842538/)).
- The mechanism does not survive scrutiny. A systematic review of 14 studies testing whether binaural beats actually produce brainwave entrainment found **5 supporting, 8 contradicting, 1 mixed**, and declined to meta-analyse due to methodological heterogeneity ([Ingendoh et al., 2023, *PLOS ONE*](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0286023)).
- At least one large study (~1,000 participants) found binaural beats during cognitive tasks **decreased** performance ([review](https://openpublichealthjournal.com/VOLUME/17/ELOCATOR/e18749445332258/FULLTEXT/)).

**Implication:** we may ship binaural beats as an ambient texture because users expect and enjoy them. We must not make efficacy claims about focus, memory or "brainwave entrainment." That is both scientifically unsupportable and a regulatory-advertising risk.

### 6.4 Coloured noise

**[Well established] with an important asymmetry.** A meta-analysis of randomised trials found white and pink noise produced a **small but statistically significant benefit for people with ADHD or elevated ADHD symptoms (k = 13, N = 335, g = 0.249)** — and a **statistically significant *negative* effect in non-ADHD comparison groups (k = 11, N = 335, g = −0.212)**. Heterogeneity was minimal, moderators non-significant, no publication bias detected. **No studies of brown noise existed at all**, despite it being the most-hyped variant ([Nigg et al., 2024, *JAACAP*](https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987)). The proposed mechanism (stochastic resonance under the moderate brain arousal model) remains untested against alternatives.

**Implication:** noise is genuinely useful for a specific subgroup and mildly counterproductive for everyone else. That argues for offering it, labelling it accurately ("many people with ADHD find this helps; others find it distracting"), and letting the user decide — rather than defaulting it on. It also argues against marketing "brown noise" on evidence grounds, since none exists.

### 6.5 Ritual, time-boxing and breaks

**[Weak] for the Pomodoro protocol specifically.** We found no controlled evaluation of the 25/5 structure as such. What exists is evidence for its components, and it is more modest than the productivity literature implies.

A meta-analysis of micro-breaks (breaks of ≤10 minutes; 19 records, 22 samples, N = 2,335) found statistically significant but **small** effects: vigor **d = 0.36**, fatigue **d = 0.35**, and a **non-significant effect on overall performance (d = 0.16, p = .116)**. Sub-group analysis found performance benefits only for tasks with *lower* cognitive demand, and meta-regression showed longer breaks produced greater performance benefit — leading the authors to conclude that "recovering from highly depleting tasks may need more than 10-minute breaks" ([Albulescu et al., 2022, *PLOS ONE*](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0272460)).

**Implication:** time-boxing is defensible as a well-being and adherence feature, and dishonest as a performance feature. Frame a focus mode around *how the session feels and whether the user returns*, not around productivity gains. Offer interval lengths longer than 25 minutes and breaks longer than 5, since the evidence points that way for demanding work.

### 6.6 A note on ASMR and focus

ASMR is documented for relaxation, sleep and stress (§5.3). We found no credible evidence that it improves focused cognitive work, and its two most characteristic ingredients — intelligible whispered speech and a relaxation-directed state — are precisely what §6.1 identifies as harmful to verbal task performance. **ASMR belongs in the wind-down, sleep and anxiety surfaces, not the focus surface.**

---

## 7. Ethics, safety and emotional wellbeing

### 7.1 Compulsivity risk, honestly assessed

Compulsive Sexual Behaviour Disorder is recognised in ICD-11 as an impulse control disorder; problematic pornography use (PPU) is its most-studied manifestation ([*Curr Addict Rep*, 2021](https://link.springer.com/article/10.1007/s40429-021-00383-7)).

**Prevalence [Reasonably supported, wide range].** Meta-analytic estimates of PPU span **0.1% to 32.4%** depending on instrument and threshold ([*Sexual Health*, 2025](https://doi.org/10.1071/sh25054)). The best-powered cross-national data comes from the International Sex Survey (N = 82,243, 42 countries): **2.42% of women and 8.17% of men** exceeded the CSBD-19 high-risk cut-off. Among high-risk women, 13.74% had sought treatment, 31.74% had not because they did not perceive the behaviour as problematic, and **18.46% cited shame, discomfort or not knowing that help existed** as barriers ([*Addiction*, 2024](https://onlinelibrary.wiley.com/doi/10.1111/add.16431); [systematic review of women specifically, 2025](https://doi.org/10.1007/s40429-025-00674-3)).

**The moral incongruence caveat [Well established].** ICD-11 explicitly states that distress arising *entirely* from moral disapproval is insufficient for a CSBD diagnosis. Grubbs and colleagues have shown across multiple samples that religiosity predicts moral disapproval, which predicts self-labelled "addiction," and that the direct religiosity→PPU path disappears once moral disapproval is modelled — and that this operates similarly in women and men ([Borgogna et al., cited in the 2025 review](https://doi.org/10.1007/s40429-025-00674-3)).

**How audio erotica differs [Reasoned inference — not an established finding].** We could not find any study comparing compulsivity risk across erotic media formats. The following are plausible structural arguments, and should be presented internally as hypotheses rather than facts:
- Audio scenes are authored, finite units with endings, rather than an infinite scroll of interchangeable clips. Ending-less feeds are the mechanic most associated with escalation.
- The Coolidge effect (arousal habituation to a repeated stimulus, reawakened by novelty) is documented in humans and is one of Lehmiller's four proposed drivers of novelty-seeking. A catalogue optimised for *depth* (returning to a beloved series) rather than *breadth* (endless new stimuli) works against that dynamic; a recommendation engine tuned purely for novelty works with it.
- Escalation of explicitness is a documented concern in visual pornography; an app where heat level is a persistent user setting rather than an algorithmic variable removes the mechanism.

We should be careful not to market audio as "the healthy porn." That claim is not evidenced, and it implicitly shames users of other formats — which is the opposite of the shame-free stance §7.4 requires.

**Design against compulsion, concretely:** no infinite feed; no autoplay into a *new* scene by default; no streak mechanics on sexual content; no push notifications engineered to create urges; session and usage data visible to the user; and, if we surface any wellbeing prompt, it must be non-judgemental and never framed as "you have used this too much."

### 7.2 Parasocial attachment to AI voices

This is a real and rapidly firming risk literature, and it bears directly on our product architecture.

The best-designed study to date triangulated self-report, relationship descriptions and **4,664 real chat sessions (464,687 messages)** from Character.AI users (N = 1,131 US adults). Findings: smaller offline social networks were associated with reporting companionship as the primary chatbot use (β = −0.03), which was in turn associated with **lower well-being (β = −0.48; 95% CI −0.70, −0.25)**. The association was **stronger when interactions were intensive (β = −0.31) and highly disclosive (β = −0.38)** ([*Nature Human Behaviour*, 2026](https://www.nature.com/articles/s41562-026-02516-2)).

A quasi-experimental analysis of longitudinal Reddit data plus 15 interviews found mixed effects: greater affective expression and interpersonal focus alongside **increases in language about loneliness and suicidal ideation**, and trajectories of "initiation, escalation and bonding" carrying "risks of over-reliance and withdrawal" ([arXiv 2509.22505](https://arxiv.org/html/2509.22505)). Qualitative work documents genuine grief and withdrawal when access is removed ([Laestadius et al., 2024, *New Media & Society* 26:5923–5941](https://www.nature.com/articles/s41562-026-02516-2)).

Some studies find positive associations between AI-companion attachment and well-being ([*Front Psychol*, 2025](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1687686/full); [*Technology in Society*, 2026](https://www.sciencedirect.com/science/article/pii/S0160791X26000187)), particularly for socially isolated users. **[Contested]** in aggregate — but note that the harms cluster precisely on the variables an engagement-maximising product would push: intensity, disclosure, and reliance among the socially isolated.

**The architectural implication is the most important single conclusion in this section.** The harm signature attaches to *open-ended, responsive, memory-bearing companionship*, not to authored finite content. A 15-minute scene with a beginning and an end, performed by an explicitly fictional character, is a fundamentally different object from a chatbot that remembers you and responds to you indefinitely. Our male-audience anecdote — that free-form spicy AI chat performs well — points at exactly the product shape the literature flags as risky. **This is an additional, independent reason (beyond the content-preference evidence in §3) to build authored scenes for the female audience rather than porting the chat product.**

If we ever add responsive or personalised elements, the mitigations the literature suggests are: scaffold healthy boundaries, surface relationship stage explicitly, support disclosure without dependency, and avoid designs that reward intensive daily use.

### 7.3 Content warnings and tagging — the counterintuitive evidence

**[Well established] and it contradicts standard practice.** A meta-analysis of all empirical studies on trigger warnings, content warnings and content notes (12 studies) found:

- **No effect on affective response** to the material after viewing (9 studies).
- **No effect on avoidance** — people consumed the content at the same rate (5 studies).
- **No effect on comprehension/educational outcomes.**
- **A reliable increase in anticipatory affect — distress *before* viewing — d = 0.43, 95% CI [0.09, 0.77]** (5 studies).

([Bridgland, Jones & Bellet, 2023, *Clinical Psychological Science*](https://journals.sagepub.com/doi/full/10.1177/21677026231186625); [APS summary](https://www.psychologicalscience.org/news/2023-october-content-warnings-distress.html))

**What this does and does not mean.** It does *not* mean we should stop labelling content. The studies test warnings as an *emotional preparation* device delivered immediately before unavoidable exposure. That is not our use case. Our use case is **navigation and informed choice made in advance**, which the studies do not test and which is the model that the fanfiction community — the largest natural experiment in sexual-content labelling ever run — converged on independently.

The evidence-consistent design is therefore:

- **Persistent, structural, filterable tags** (as on AO3 and Quinn), set in preferences and applied to browse and recommendation surfaces, so that unwanted content is never surfaced in the first place.
- **Neutral, descriptive, specific language** — "consensual non-consent," "age gap," "infidelity," "degradation" — not alarming language and not a red warning triangle.
- **Placement in the metadata the user reads while choosing**, not as an interstitial immediately before playback. The immediate-interstitial pattern is exactly the one that raises anticipatory distress without benefit.
- **Opt-in, not opt-out, for the sensitive categories** (§3.2), so that the absence of a decision means absence of the content.

### 7.4 Designing against shame

Shame is not a soft concern here; it is measurable and it suppresses the outcome we are selling. Women report higher shame than men in response to erotic audio and rate it less pleasant, while showing equivalent physiological orienting (§2.1). Women high in sex guilt report *less* arousal while showing *more* genital response (§1.3). And 18.46% of high-risk women in the International Sex Survey cited shame as the barrier to seeking help (§7.1).

Concrete requirements: no language implying the user is deficient, deprived, or fixing a problem; no "how many times this week" counters; no leaderboards or social comparison of any kind; no before/after framing; normalise variation explicitly in onboarding (spontaneous and responsive desire are both normal; non-concordance is normal; not finishing is fine); and never imply that arousal or orgasm is the success condition of a session.

### 7.5 Privacy — a category-specific, elevated risk

Women using sexual and reproductive health apps face a documented and currently worsening threat model. The relevant facts:

- In a review of 25 popular period-tracking apps, **84% shared user data with third parties** beyond the developer, and **only one stored all data solely on the user's device** ([Fordham UG Law Review](https://undergradlawreview.blog.fordham.edu/digital-privacy/period-tracking-apps-and-reproductive-privacy-in-the-post-dobbs-era/)).
- Mozilla's *Privacy Not Included assessment flagged **18 of 25** reproductive health apps and devices, with most lacking clear policies on law-enforcement data sharing and **8 failing minimum security standards** — including accepting a single-digit password ([Mozilla Foundation](https://www.mozillafoundation.org/en/blog/in-post-roe-v-wade-era-mozilla-labels-18-of-25-popular-period-and-pregnancy-tracking-tech-with-privacy-not-included-warning/)).
- These apps are **not HIPAA-covered entities**, so the data is reachable by subpoena, sale to data brokers, or law-enforcement request without the protections users assume ([Northwestern University Law Review Online](https://scholarlycommons.law.northwestern.edu/cgi/viewcontent.cgi?article=1368&context=nulr_online)).
- The pattern continues: 2026 research found a period tracker sharing birthdate, birth control type, reproductive goals and symptoms with a third-party analytics firm under a persistent identifier ([TechCrunch, 2026](https://techcrunch.com/2026/07/16/period-tracker-stardust-shares-users-health-data-with-analytics-firm-says-mozilla-research/)).
- Mozilla's recommended app is the one whose health data **never leaves the device** ([BBC Future, 2026](https://www.bbc.com/future/article/20260715-how-period-trackers-share-womens-private-details)).

Beyond legal exposure there is the household threat model, which sexual-content apps face uniquely: partner or family discovery via the home screen, notification previews, shared Apple ID, family purchase-sharing, and App Store receipts.

The literature also notes a second-order harm worth internalising: privacy fear itself "causes fear and anxiety that prevent people from using tools that are meant to improve their health." Privacy is not only an ethical duty here; it is a conversion and retention variable.

### 7.6 Consent-forward framing

The convention emerging in this category — and visible in Quinn's taxonomy ("aftercare," "apology," "praise") and in the r/GoneWildAudio community's script norms — is that consent is depicted *inside* the fiction as erotic content, not appended as a disclaimer. Explicit negotiation, enthusiastic response, checking in, and aftercare are among the best-performing content categories, not compliance overhead. Research on young women's sexting similarly found participants "were careful to explicitly state what they were consenting to," and clearly demarcated coercive fantasy from what they wanted in real relationships ([*MedieKultur*](https://tidsskrift.dk/mediekultur/article/view/115099)). This is a case where the ethical and the commercial recommendation are identical.

---

## 8. Inclusion

### 8.1 Queer women

**[Well established]** that women's sexual response varies systematically with degree of androphilia and gynephilia rather than falling into two boxes. Exclusively androphilic women show non-specific genital response; predominantly gynephilic women show more category-specific patterns; women with bisexual attractions show intermediate profiles ([*PLOS ONE*, 2015](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0142575); [Chivers et al., 2004](https://europepmc.org/article/MED/15482445)).

**[Reasonably supported]** that **59% of exclusively heterosexual-identified women in Lehmiller's sample had had a same-sex fantasy**, versus 26% of exclusively heterosexual men. Lehmiller also found non-heterosexually identified participants had *more diverse* fantasy content overall — more BDSM, nonmonogamy, taboo acts and gender-bending.

**Implication:** F/F and multi-gender content is not a niche accommodation; it has an addressable audience considerably larger than the count of women who identify as queer. It should be catalogued alongside everything else rather than ghettoised in an "LGBTQ" shelf, and discoverable without requiring an identity declaration.

### 8.2 Disabled women

A PRISMA-ScR scoping review of disabled women's sexual practices found the field dominated by "harmful stereotypes that portray them as asexual or incompatible with cis-heteroreproductive sexual norms," and identified themes of reclaiming sexuality and navigating constraints ([*Societies*, 2025](https://doi.org/10.3390/soc15060154)). For non-heterosexual disabled women, minority sexual identities are frequently "invalidated, dismissed as symptoms of intellectual disability, [or] understood as coping mechanisms."

Audio has a structural advantage here that is rare and worth stating plainly: it is natively accessible to blind and low-vision users, and it does not require a particular body, position, or physical capacity of the listener to be usable ([*iJournal*, 2025](https://doi.org/10.33137/ijournal.v11i2.47517); [*The Guardian*, 2023](https://www.theguardian.com/tv-and-radio/2023/nov/02/disabled-people-are-sexual-inside-the-audio-pornography-boom-that-is-revolutionising-desire)). Realising it requires actually shipping full VoiceOver support, Dynamic Type, transcripts (Quinn shipped these in 2026), and captions — and writing scenes that do not assume the listener's body does any particular thing.

### 8.3 Older women

The data in §1.6 shows sexual problems rising steeply with age (80.1% of women 65+ report a sexual problem) while *distress* does not — distressing low desire actually peaks at midlife (12.3% at 45–64) and falls to 7.4% at 65+. Midlife women report more desire loss than older women (47.6% vs 33.4%) and more distress ([*Menopause*, 2025](https://menopause.org/wp-content/uploads/press-release/MENO-D-25-00126.pdf)).

Two implications. First, **perimenopause and midlife are the highest-distress window and therefore the segment with the clearest unmet need** — a segment almost wholly unserved by a category currently optimised for 25–34-year-olds. Second, there is direct market evidence: Quinn's first series led by an actor over 50 reached over 100,000 plays within twelve hours of release ([*Variety*, 2026](https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/)). Age-appropriate characters are demand, not charity.

### 8.4 Women of colour, trans and nonbinary listeners

**The evidence base here is genuinely thin, and that is itself the finding.** Lehmiller's sample was 79% White; the field review explicitly notes the concentration on "young, White, heterosexual adults derived from North American college student samples." We have no reliable data on how erotic content preferences vary by race or ethnicity, and the one race-related item in the standard instrument ("interracial sex," 27.5% of women in Joyal) is framed as a fetish category rather than as representation — which tells us something about the instrument, not the audience.

For nonbinary listeners there is a small but consistent signal in Lehmiller's data: non-binary participants reported the **highest** rates of forced-sex fantasy (68% ever, 31% often) and the highest rates of consensual nonmonogamy fantasy, and 45% reported a history of sexual victimisation. They are an intense-preference, high-vulnerability group — which argues for both serving them properly and applying the §3.2 safeguards especially carefully.

**Implication:** we cannot design for these audiences from the literature, because the literature does not exist. We should design *for the absence of assumptions* — avoid gendered anatomical presumption about the listener where the scene does not require it, offer listener-gender and listener-pronoun as content dimensions, and commission original qualitative research rather than extrapolating. Casting and writing should be led by people from these communities.

### 8.5 Asexual and demisexual listeners

**[Reasonably supported]** that asexuality does not preclude fantasy: **60% of self-identified asexual people report sexual fantasies** ([Yule, Brotto & Gorzalka, 2014](https://sexualhealthalliance.com/justin-lehmiller-science-of-fantasy)). The dual control literature finds sexual excitation propensity predicts asexuality ([Janssen & Bancroft, 2023](https://doi.org/10.1080/00224499.2023.2219247)), placing it on a continuum rather than in a separate category. Attitudes toward asexual people are more negative than toward other sexual minorities, with asexual people rated as "less human" in one study ([summary](https://www.artsparktx.org/2022/01/25/asexuality-and-disability/)).

**Implication:** the strongest product move for ace and demisexual users is also the strongest move for everyone in §5 — a genuinely good non-sexual intimacy tier (companionship, praise, being cared for, sleep, ASMR) that is a first-class destination rather than a warm-up to sex. Demisexual users in particular are well served by slow-burn structure and by series with recurring characters, because the emotional foundation accumulates across episodes.

### 8.6 Men and couples: how much should we serve them?

**The porn gap is large and [Well established].** Using a nationally representative sample of 21,555 individuals in committed heterosexual relationships plus 1,486 matched couples: women were about twice as likely as men to report never using pornography at every commitment level (**36% vs 19% among dating; 51% vs 25% among married**), and casually dating men were **42 times** more likely than casually dating women to report weekly-or-more use ([Willoughby et al., *Journal of Couple & Relationship Therapy*, 2016](https://doi.org/10.1080/15332691.2016.1238796); [IFS summary](https://ifstudies.org/blog/the-porn-gap-gender-differences-in-pornography-use-in-couple-relationships)). Women are, however, **more likely than men to use sexual media in a shared/couple context** rather than alone.

Existing audio platforms report **~80% female audiences** (Quinn), meaning roughly one in five listeners is not a woman.

**Recommendation.** Serve men and couples *passively* — do not exclude them, do not require a gender declaration to use the product, ensure billing and marketing are not gendered in a way that alienates them — but do not build for them. Three reasons:

1. **Discovery-surface dilution is the real cost.** Every additional audience whose preferences diverge degrades the quality of default recommendations for the primary audience. The porn gap data says male and female preferences here diverge substantially (voyeurism 72% vs 48%; group sex; taboo).
2. **The category's own operators identify audience focus as their advantage.** Quinn's lead writer: "In my work as a screenwriter, I often get notes to broaden what I'm writing to appeal to a wider audience. Something I really like about working with Quinn is they move so fast and so fearlessly, and I think that's because they're really only catering to their audience" ([*Washington Post*](https://archive.ph/kLEoE)).
3. **The men's product is a different product.** Our own anecdote is that free-form spicy chat works for men. That is a chat product with a chat architecture and a chat risk profile (§7.2). Trying to serve both from one catalogue means doing neither well.

**Couples are the exception worth investing in**, because they are a female-audience feature rather than a male-audience feature: women are more likely than men to use sexual media in a shared context, 60% of audio-erotica listeners already listen out loud (§2.4), and partnered listening is a differentiated use case that visual pornography serves poorly. A well-made speaker mix and a small "listen together" collection is a cheap, on-strategy investment. Note the countervailing evidence that discordant pornography use within couples is associated with poorer relationship outcomes ([Wheatley Institute, 2021](https://wheatley.byu.edu/national-couples-and-pornography-survey-2021)) — **[Contested]**, from an advocacy-affiliated source with a stated position, and the causal direction is unestablished — but it supports designing for *shared* rather than *secret* use.

---

# Design implications

Twenty-five concrete requirements derived from the evidence above. Each cites the section that justifies it and flags the strength of the underlying evidence.

**Framing and onboarding**

1. **Default to responsive-desire framing.** The app must offer "warm up" and low-commitment entry content that does not assume the user arrives already wanting sex. Entry points should include moods ("I want to feel something," "wind down," "reconnect") alongside explicit-arousal intents. *(§1.1, [Reasonably supported])*
2. **Never pathologise either desire pattern.** Onboarding copy must state that both spontaneous and responsive desire are normal, that neither is a deficiency, and must avoid implying the user has a problem to fix. Basson-style responsive desire is over-represented among women with sexual concerns, so a product that assumes it universally will insult one group and a product that assumes spontaneous desire will fail the other. *(§1.1, §7.4, [Reasonably supported])*
3. **Normalise arousal non-concordance explicitly.** Include a short, clinical, non-clickbait explainer that body and mind frequently disagree in women, and that a bodily response is not a verdict on wanting or liking. *(§1.3, [Well established])*
4. **Build brake-removal features, not just accelerator features.** Ship a discreet app icon and name, notification previews off by default, no lock-screen artwork, instant pause/blank, no scene titles in system media controls, and a hard rule that nothing interrupts a scene. Reducing inhibition is a mechanism co-equal with adding stimulation. *(§1.2, [Well established])*

**Content architecture**

5. **Make relational frame a first-class, filterable content dimension** — who this person is to the listener — and treat it as more predictive than any physical variable. Prioritise the *established partner* and *charged stranger/rival* frames over vague "someone you know" framings, which are the empirically weakest. *(§1.4, [Reasonably supported])*
6. **Make setting and atmosphere a browsable axis, not scene dressing.** 86.4% of women say atmosphere and location are important in their fantasies, out-ranking almost every specific act. Tag and merchandise by place and mood. *(§3.1, [Well established])*
7. **Build the launch catalogue in this order:** (i) devoted-partner/"boyfriend" register; (ii) being desired, chosen, praised, body-worshipped; (iii) receptive power exchange / male dominance; (iv) slow burn, yearning, anticipation; (v) enemies-to-lovers and rivalry; (vi) hurt/comfort, aftercare, being taken care of; (vii) situational forbidden (age gap, workplace, best friend's brother); (viii) consensual non-consent, opt-in only. *(§3.5, converging survey + corpus + platform data)*
8. **Weight the receptive pole of power exchange over the active pole.** Women's fantasy of being dominated exceeds dominating by a wide margin in both large datasets (93% vs 76% Lehmiller; 64.6% vs 46.7% Joyal). Build the reverse, but build it second. *(§3.1, [Well established])*
9. **Treat emotional register as the primary product and explicitness as a parameter of it.** The highest-frequency tags in the largest revealed-preference corpus are emotional states (Fluff, Angst, Hurt/Comfort, Slow Burn), and 70% of Lehmiller's respondents rarely or never fantasise about emotionless sex. Merchandise by feeling, not by act. *(§3.4, §3.1, [Reasonably supported])*
10. **Optimise the anticipation-to-explicitness ratio, not explicitness.** Default scene structure should spend the majority of its runtime on approach, tension and being wanted, with a shorter explicit resolution. *(§3.6, [Reasonably supported])*
11. **Make heat level a persistent user setting, never an algorithmic variable.** This is simultaneously a preference feature, an anti-shame feature and an anti-escalation feature. *(§3.6, §7.1)*
12. **Build depth, not breadth, into the recommender.** Favour returning users to series and characters they love over maximising novel-stimulus throughput. Novelty-maximising recommendation works directly with the habituation dynamic that drives escalation. *(§7.1, [Reasoned inference])*

**Craft and voice**

13. **Default to second-person direct address with a single speaker, and A/B test it against third-person narration in the first release.** This is the strongest untested hypothesis in the review; the community and commercial convergence is total but the controlled evidence is absent. *(§4.1, [Weak] — test it)*
14. **Match voice pitch to genre.** Lower fundamental frequency is preferred, but more strongly in short-term/charged mating contexts than in long-term ones — so bias the dominant/stranger/rival registers lower and allow the devoted-partner register warmer and higher. *(§4.2, [Reasonably supported])*
15. **Manipulate F0 and formant structure coherently in synthesis, and cap how low pitch goes.** Pitch and apparent vocal tract length interact; lowering one without the other is the classic synthetic-voice uncanny failure, and the pitch preference is non-linear with an optimum rather than a floor. Do not assume breathy male delivery helps — the breathiness evidence is for female voices. *(§4.2, [Well established] on interaction, [Contested] on breathiness)*
16. **Preserve breath, micro-timing and intonation variation in the voice pipeline.** Flat prosody is the characteristic TTS failure and one study associates *higher* intonation variation with attractiveness; breath is repeatedly cited by listeners as load-bearing. Treat prosodic variation as a quality gate, not a nice-to-have. *(§4.1, §4.2)*
17. **Disclose AI at the brand and system level, once, in onboarding and the store listing — never as an interstitial immediately before a scene.** Frame voices as *characters*, on the same contract as an audiobook narrator or radio play. The disclosure penalty in the literature attaches specifically to emotionally evocative first-person content, which is exactly what we make; the mitigation is relocating the authenticity claim, not hiding the fact. *(§4.3, [Reasonably supported])*
18. **Keep credited humans in the loop and say so** — human editorial oversight of scripts, human writers credited, human voice talent for flagship series. This is both an authenticity asset and the competitive moat the incumbents have built. *(§4.3)*

**ASMR and focus**

19. **Ship ASMR as a separate, clearly labelled, non-sexual surface.** Roughly 20–28% of people experience ASMR; only ~5% use it sexually and 84% explicitly reject that framing. Never blend ASMR triggers into erotic scenes as texture, and never surface erotic content to a user who entered through sleep or relaxation. Do allow the *technique* — binaural capture, proximity, whisper register, slow pacing — to serve both. *(§5.3, [Well established])*
20. **Keep intelligible speech out of focus-mode work intervals by default.** The irrelevant sound effect is robust, does not habituate, and is worst for exactly the verbal work our users will be doing. Permit spoken intention-setting and spoken close *at the interval boundaries*, where the ritual value is available without the interference cost. *(§6.1, [Well established])*
21. **Instrumental only in focus audio — no lyrics, no intelligible vocal samples.** Wordless vocal texture is acceptable; anything parseable as language is not. *(§6.2, [Well established])*
22. **Make no efficacy claims for binaural beats, and label coloured noise honestly.** Ship both if users want them, but market binaural beats as ambience rather than cognition, and label white/pink noise as "many people with ADHD find this helps; others find it distracting" — because the meta-analysis shows a benefit for ADHD (g = 0.249) and a *harm* for everyone else (g = −0.212). Do not market brown noise on evidence grounds; no studies exist. *(§6.3, §6.4, [Contested] and [Well established] respectively)*
23. **Frame focus mode around adherence and how the session feels, not productivity gains.** Micro-breaks show small well-being effects (vigor d = 0.36) and a non-significant performance effect. Offer intervals longer than 25 minutes and breaks longer than 5, since the evidence points that way for cognitively demanding work. *(§6.5, [Well established] that the performance claim is unsupported)*

**Safety, privacy and inclusion**

24. **Implement AO3-style structural tagging with opt-in gating for sensitive categories, and no pre-playback warning interstitials.** Tags must be neutral, specific, persistent, set in preferences, and applied to browse and recommendation surfaces so unwanted content is never surfaced. Consensual non-consent, degradation, infidelity and similar categories must be opt-in, never present in defaults, autoplay or algorithmic surfacing. The meta-analytic evidence is that immediately-pre-exposure warnings raise anticipatory distress (d = 0.43) without changing the response — the value of tagging is navigation and advance choice, not emotional preparation. *(§7.3, §3.2, [Well established])*
25. **Adopt a local-first, minimal-collection privacy architecture and make it legible.** No third-party analytics on content-level behaviour; no sale or brokerage of any usage data; on-device storage of listening history wherever technically possible; a plain-language law-enforcement policy; and a "hide from Home Screen"/alternate icon and discreet App Store receipt descriptor. The category baseline is 84% of comparable apps sharing data with third parties and 18 of 25 flagged by Mozilla — which makes genuine privacy both an ethical obligation and the most credible differentiator available. *(§7.5, [Well established])*
26. **Do not build cycle-phase targeting as a headline feature.** The hormonal evidence is contested — an RCT found short-term estradiol elevation had essentially no effect on desire, and a two-cycle study found no consistent association. A visibly wrong cycle prediction is both embarrassing and, post-Dobbs, a privacy liability. *(§1.6, [Contested])*
27. **Build for the life stages with the highest documented distress and the least coverage** — postpartum/breastfeeding (41–83% prevalence of sexual difficulty) and perimenopause/midlife (peak distress, 12.3% distressing low desire at 45–64). This is the clearest unmet need in a category currently built for 25–34-year-olds, and the one platform data point we have (a 50+ led series exceeding 100k plays in twelve hours) supports it. *(§1.6, §8.3, [Well established])*
28. **Serve men and couples passively; do not build for them.** Do not require gender declaration, do not exclude anyone, but keep the catalogue and the discovery surfaces tuned to the primary audience. Invest specifically in **couples** — a proper speaker mix and a "listen together" collection — because 60% of listeners already listen out loud and women are more likely than men to use sexual media in a shared context. *(§8.6, §2.4, [Well established] on the porn gap)*
29. **Ship real accessibility, and treat it as market expansion rather than compliance:** full VoiceOver, Dynamic Type, transcripts for every scene, and scenes written without assuming the listener's body does anything in particular. Audio is natively the most accessible erotic medium; realising that is a deliberate choice. *(§8.2)*
30. **Eliminate every engagement mechanic that measures the user against a target.** No streaks on sexual content, no usage counters, no infinite feed, no autoplay into new scenes, no urge-engineered notifications, no social comparison. Shame measurably suppresses reported arousal in women and is a documented barrier to help-seeking; and the AI-companion harm literature localises harm to intensive, highly disclosive, reliance-forming use. Our architecture — finite authored scenes with endings, performed by explicitly fictional characters — is our main structural protection against that risk, and we should not erode it by bolting on an open-ended companion. *(§7.1, §7.2, §7.4, [Well established] on shame, [Contested but directionally serious] on AI companionship)*

---

## Sources

### Female sexual response
- Basson, R. (2000). The Female Sexual Response: A Different Model. *J Sex & Marital Therapy* 26(1):51–65. https://www.imop.gr/sites/default/files/basson2000.pdf
- Sand, M., & Fisher, W. A. (2007). Women's Endorsement of Models of Female Sexual Response: The Nurses' Sexuality Study. *J Sex Med* 4:709–720. https://pubmed.ncbi.nlm.nih.gov/17498106/
- Giles, K. R., & McCabe, M. P. (2009). Conceptualizing Women's Sexual Function: Linear vs. Circular Models. *J Sex Med* 6(10):2761–2771. https://www.sciencedirect.com/science/article/abs/pii/S1743609515322724
- Circular and Linear Modeling of Female Sexual Desire and Arousal (systematic review). *J Sex Res*. https://doi.org/10.1080/00224499.2010.548611
- Bancroft, J., Graham, C. A., Janssen, E., & Sanders, S. A. (2009). The Dual Control Model: Current Status and Future Directions. *J Sex Res* 46(2–3):121–142. https://doi.org/10.1080/00224490902747222
- Janssen, E., & Bancroft, J. (2023). The Dual Control Model of Sexual Response: A Scoping Review, 2009–2022. *J Sex Res*. https://doi.org/10.1080/00224499.2023.2219247
- Kinsey Institute — Dual Control Model. https://kinseyinstitute.org/research/dual-control-model.html
- Chivers, M. L., Seto, M. C., Lalumière, M. L., Laan, E., & Grimbos, T. (2010). Agreement of Self-Reported and Genital Measures of Sexual Arousal in Men and Women: A Meta-Analysis. *Arch Sex Behav*. https://pmc.ncbi.nlm.nih.gov/articles/PMC2811244/
- Chivers, M. L., Rieger, G., Latty, E., & Bailey, J. M. (2004). A Sex Difference in the Specificity of Sexual Arousal. *Psychological Science* 15(11):736–744. https://europepmc.org/article/MED/15482445
- Chivers, M. L., & Timmers, A. D. (2012). Effects of gender and relationship context in audio narratives on genital and subjective sexual response in heterosexual women and men. *Arch Sex Behav*. https://pubmed.ncbi.nlm.nih.gov/22406875/
- Chivers, M. L. (2010). A brief update on the specificity of sexual arousal. *Sexual & Relationship Therapy*. https://doi.org/10.1080/14681994.2010.495979
- Straight but Not Narrow: Within-Gender Variation in the Gender-Specificity of Women's Sexual Response (2015). *PLOS ONE*. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0142575
- Morokoff, P. J. (1985). Effects of sex guilt, repression, sexual arousability, and sexual experience on female sexual arousal. *JPSP* 49(1):177. https://doi.org/10.1037/0022-3514.49.1.177
- Hamilton, L. D., & Meston, C. M. (2013). Chronic Stress and Sexual Function in Women. *J Sex Med*. https://doi.org/10.1111/jsm.12249
- ter Kuile, M. M., et al. (2007). Preliminary evidence that acute and chronic daily psychological stress affect sexual arousal in sexually functional women. https://pubmed.ncbi.nlm.nih.gov/17481578/
- Dove, N. L., & Wiederman, M. W. (2000). Cognitive Distraction and Women's Sexual Functioning. *J Sex & Marital Therapy* 26(1):67–78. https://www.tandfonline.com/doi/abs/10.1080/009262300278650
- Pascoal, P. M., et al. (2017). The Impact of Body Dissatisfaction on Distressing Sexual Difficulties: the Mediator Role of Cognitive Distraction. *J Sex Res*. https://doi.org/10.1080/00224499.2016.1168771
- Self-objectification and sexual dysfunction among women (2024). *Eur J Soc Psychol*. https://onlinelibrary.wiley.com/doi/10.1002/ejsp.3056
- Meston, C. M., et al. The effects of state and trait self-focused attention on sexual arousal. https://pmc.ncbi.nlm.nih.gov/articles/PMC2859206/

### Life stage and hormones
- Murray, S. H., & Milhausen, R. R. (2012). Sexual Desire and Relationship Duration in Young Men and Women. *J Sex & Marital Therapy* 38:28–40. https://doi.org/10.1080/0092623x.2011.569637
- McNulty, J. K., et al. (2019). Sex-Differentiated Changes in Sexual Desire Predict Marital Dissatisfaction. *Arch Sex Behav*. https://link.springer.com/article/10.1007/s10508-019-01471-6
- Sexual function in breastfeeding women: a systematic review (2026). *BMC Women's Health*. https://pmc.ncbi.nlm.nih.gov/articles/PMC12961805/
- Sexual Dysfunctions in Breastfeeding Females: Systematic Review and Meta-Analysis (2025). *J Clin Med*. https://doi.org/10.3390/jcm14030691
- Sexual well-being after menopause: An International Menopause Society White Paper (incl. PRESIDE data). https://www.imsociety.org/wp-content/uploads/2020/07/sexual-welbeing-after-menopause-english.pdf
- Understanding the sexual concerns of older women presenting for care (2025). *Menopause*. https://menopause.org/wp-content/uploads/press-release/MENO-D-25-00126.pdf
- The role of distress in female sexual dysfunction during menopause (2025). *Nature Medicine*. https://preview-www.nature.com/articles/s41591-025-03593-y
- Hormonal Underpinnings of the Variation in Sexual Desire, Arousal and Activity Throughout the Menstrual Cycle (2022). *J Sex Res*. https://doi.org/10.1080/00224499.2022.2110558
- Sexual attraction to visual sexual stimuli in association with steroid hormones across menstrual cycles and fertility treatment (2023). *Psychoneuroendocrinology*. https://doi.org/10.1016/j.psyneuen.2023.106060
- The effect of short-term increase of estradiol levels on sexual desire and orgasm frequency: a double-blind RCT (2023). *Psychoneuroendocrinology*. https://doi.org/10.1016/j.psyneuen.2023.106682
- Menstrual Cycle Variation in Women's Mating Psychology. *Oxford Handbook*. https://doi.org/10.1093/oxfordhb/9780197524718.013.24

### Audio erotica and media
- Distinct Emotional and Cardiac Responses to Audio Erotica between Genders (2023). *Behavioral Sciences* 13(3):273. https://doi.org/10.3390/bs13030273
- Chadwick, S. B., Raisanen, J. C., Goldey, K. L., & van Anders, S. M. (2018). Strategizing to make pornography worthwhile. *Arch Sex Behav* 47(6):1853–1868. https://doi.org/10.1007/s10508-018-1174-y
- Heiman, J. R. (1980). Female Sexual Response Patterns. *Arch Gen Psychiatry*. https://doi.org/10.1001/archpsyc.1980.01780240109013
- The effects of two types of erotic literature on physiological and verbal measures of female sexual arousal (1977). *J Sex Res*. https://doi.org/10.1080/00224497709550982
- Both, S., et al. (2005). Effect of a Single Dose of Levodopa on Sexual Response in Men and Women. *Neuropsychopharmacology*. https://doi.org/10.1038/sj.npp.1300580
- Listening Instead of Looking (2025). *iJournal*. https://doi.org/10.33137/ijournal.v11i2.47517
- Music to My Ears: Audio Content is Changing How We Think About Porn. Sexual Health Research Lab. https://www.sexlab.ca/blog/2022/5/13/music-to-my-ears-audio-content-is-changing-how-we-think-about-porn
- Hear-here: how we listen to audio erotica (Dipsea listening data). https://www.dipseastories.com/blog/audio-erotica/
- Gone Wild Audio. WBUR *Endless Thread*. https://www.wbur.org/endlessthread/2019/08/09/gone-wild-audio
- Audio Porn, Once an R-Rated Reddit Phenomenon, Goes Mainstream. *Daily Beast*. https://www.thedailybeast.com/audio-porn-once-an-r-rated-reddit-phenomenon-goes-mainstream-2/
- Apps Like Dipsea and Quinn Are Redefining Pleasure for Women. *NYT*. https://www.nytimes.com/interactive/2023/07/31/style/dipsea-audio-stories.html
- How audio app Dipsea is rethinking erotica. *Creative Review*. https://www.creativereview.co.uk/how-dipsea-is-rethinking-erotica/
- Audio Porn App — Women Friendly Erotica App Dipsea. *Marie Claire*. https://www.marieclaire.com/sex-love/a25449637/audio-porn-app-dipsea/

### Fantasy content and market data
- Lehmiller, J. J. (2018). *Tell Me What You Want* — survey summaries: https://www.sexandpsychology.com/blog/2019/3/13/the-7-most-common-sex-fantasies-and-how-many-people-have-ever-had-them/ ; https://www.sexandpsychology.com/blog/2019/2/1/three-sexual-fantasies-that-are-more-common-than-you-think-2/ ; lecture deck: https://sexualhealthalliance.com/justin-lehmiller-science-of-fantasy
- Joyal, C. C., Cossette, A., & Lapierre, V. (2015). What Exactly Is an Unusual Sexual Fantasy? *J Sex Med*. https://oraprdnt.uqtr.uquebec.ca/portail/docs/FWG/GSC/Publication/3702/524/11026/1/341972/6/O0001238633_What_Exactly_Is_an_Unusual_Sexual_Fantasy.pdf
- Bivona, J. M., & Critelli, J. W. (2009). The Nature of Women's Rape Fantasies: Prevalence, Frequency, and Contents. *J Sex Res* 46(1):33–45. https://doi.org/10.1080/00224490802624406
- Bivona, J. M., Critelli, J. W., & Clark, M. J. (2012). Women's rape fantasies: an empirical evaluation of the major explanations. *J Sex Res*. https://pubmed.ncbi.nlm.nih.gov/22544306/
- Critelli, J. W., & Bivona, J. M. (2008). Women's Erotic Rape Fantasies: An Evaluation of Theory and Research. *J Sex Res* 45(1):57–70.
- Sexual fantasy research: A contemporary review (2022). *Curr Opin Psychol*. https://www.sciencedirect.com/science/article/abs/pii/S2352250X22002172
- Circana BookScan — Another Year of Romance with a Dark Twist (June 2025). https://www.circana.com/post/another-year-of-romance-with-a-dark-twist-circana-bookscan-reports
- Print Book Sales Rose Slightly in 2025. *Publishers Weekly*. https://www.publishersweekly.com/pw/by-topic/industry-news/financial-reporting/article/99417-print-book-sales-rose-slightly-in-2025.html
- Romantasy is transforming the publishing industry. *Globe and Mail*. https://www.theglobeandmail.com/culture/books/article-romantasy-booktok-publishing-trends-2026/
- [Data] The 100 most popular tags on AO3 — yearly ranking 2025. https://archive.transformativeworks.org/works/20310382/chapters/173541049
- AO3 Selective data dump for fan statisticians. https://archiveofourown.org/admin_posts/18804
- What 17 Million Fanfics Tell Us About What Romance Readers Actually Want. *Romance Nerds*. https://www.romancenerds.com/p/what-17-million-fanfics-tell-us-about
- How Quinn Lures Shawn Hatosy, Hudson Williams and More to Audio Erotica. *Variety* (2026). https://variety.com/2026/tv/news/quinn-app-shawn-hatosy-hudson-williams-audio-erotica-1236727045/
- Audio erotica is booming alongside 'Heated Rivalry'. *Washington Post*. https://archive.ph/kLEoE
- Your internet boyfriends are voicing audio erotica now. *NBC News*. https://www.nbcnews.com/pop-culture/pop-culture-news/smut-audio-erotica-growing-trend-quinn-celebrities-collaborations-rcna263065
- Quinn (app). *Wikipedia*. https://en.wikipedia.org/wiki/Quinn_(app)

### Voice and AI disclosure
- Feinberg, D. R., et al. (2005). Manipulations of fundamental and formant frequencies influence the attractiveness of human male voices. *Animal Behaviour*. https://www.sciencedirect.com/science/article/abs/pii/S0003347204003987
- Feinberg, D. R., et al. (2011). Integrating fundamental and formant frequencies in women's preferences for men's voices. *Behavioral Ecology*. https://doi.org/10.1093/beheco/arr134
- Puts, D. A. (2005). Mating context and menstrual phase affect women's preferences for male voice pitch. *Evolution and Human Behavior*. https://www.sciencedirect.com/science/article/abs/pii/S1090513805000176
- Male Vocal Quality and Its Relation to Females' Preferences (2023). *Evolutionary Psychology*. https://pmc.ncbi.nlm.nih.gov/articles/PMC10367192/
- Zhang, M., & Gosline, R. Art-ificial Intelligence: The Effect of AI Disclosure on Evaluations of Creative Content. SSRN 4369818 / arXiv 2303.06217. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4369818
- The author is dead, but what if they never lived? A reception experiment on Czech AI- and human-authored poetry (2025). *DSH*. https://doi.org/10.1093/llc/fqag067
- The illusion of empathy: evaluating AI-generated outputs in moments that matter (2025). *Frontiers in Psychology*. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1568911/full
- Subjective Emotional Interpretation and Relatability of AI-Generated Versus Human-Created Content (2024). *IJSREM*. https://doi.org/10.55041/ijsrem60452

### ASMR
- Barratt, E. L., & Davis, N. J. (2015). Autonomous Sensory Meridian Response (ASMR): a flow-like mental state. *PeerJ* 3:e851. https://doi.org/10.7717/peerj.851
- Poerio, G. L., Blakey, E., Hostler, T. J., & Veltri, T. (2018). More than a feeling: ASMR is characterized by reliable changes in affect and physiology. *PLOS ONE* 13(6):e0196645. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0196645
- Fredborg, B., Clark, J., & Smith, S. D. (2017). An Examination of Personality Traits Associated with ASMR. *Frontiers in Psychology*. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00247/full
- Similar but different: High prevalence of synesthesia in ASMR (2022). *Frontiers in Psychology*. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.990565/full
- Untangling the tingle: ASMR, neuroticism, and trait & state anxiety (2022). *PLOS ONE*. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0262668
- Brain circuits in autonomous sensory meridian response and related phenomena (2024). *Phil Trans R Soc B*. https://royalsocietypublishing.org/doi/10.1098/rstb.2023.0252
- Mapping the Brain's Response to ASMR: Systematic Review and ALE Meta-Analysis (2025, preprint). https://doi.org/10.21203/rs.3.rs-7834852/v1

### Attention and focus
- Vasilev, M. R., Kirkby, J. A., & Angele, B. (2018). Auditory Distraction During Reading: A Bayesian Meta-Analysis of a Continuing Controversy. *Perspectives on Psychological Science*. https://www.psychologicalscience.org/journals/perspectives/1745691617747398/
- Haapakangas, A., et al. (2020). The relation between the intelligibility of irrelevant speech and cognitive performance. *Indoor Air*. https://onlinelibrary.wiley.com/doi/10.1111/ina.12726
- Impact of irrelevant speech and non-speech sounds on serial recall (2025). *Scientific Reports*. https://www.nature.com/articles/s41598-025-85855-w
- Cognitive performance during irrelevant speech: Effects of speech intelligibility and office-task characteristics (2013). *Applied Acoustics*. https://www.sciencedirect.com/science/article/abs/pii/S0003682X12002629
- Cheah, Y., et al. (2022). Background Music and Cognitive Task Performance: A Systematic Review. *Music & Science*. https://sage.cnpereading.com/doi/10.1177/20592043221134392
- Should We Turn off the Music? Music with Lyrics Interferes with Cognitive Tasks. *Journal of Cognition*. https://doi.org/10.5334/joc.273
- Impact of background music on reading comprehension (2024). *Frontiers in Psychology*. https://pmc.ncbi.nlm.nih.gov/articles/PMC11027201/
- Garcia-Argibay, M., et al. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. *Psychological Research*. https://pubmed.ncbi.nlm.nih.gov/30073406/
- Basu, S., & Banerjee, B. (2023). Potential of binaural beats intervention for improving memory and attention. *Psychological Research*. https://pubmed.ncbi.nlm.nih.gov/35842538/
- Ingendoh, R. M., Posny, E. S., & Heine, A. (2023). Binaural beats to entrain the brain? A systematic review. *PLOS ONE*. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0286023
- Nigg, J. T., et al. (2024). Systematic Review and Meta-Analysis: Do White Noise or Pink Noise Help With Task Performance in Youth With ADHD? *JAACAP*. https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987
- Albulescu, P., et al. (2022). "Give me a break!" A systematic review and meta-analysis on the efficacy of micro-breaks. *PLOS ONE*. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0272460

### Ethics, compulsivity, privacy, AI companionship
- Prevalence of problematic pornography use: a meta-analysis (2025). *Sexual Health*. https://doi.org/10.1071/sh25054
- Bőthe, B., et al. (2024). Problematic pornography use across countries, genders, and sexual orientations: Insights from the International Sex Survey. *Addiction*. https://onlinelibrary.wiley.com/doi/10.1111/add.16431
- Expanding the Lens: A Systematic Review of Compulsive Sexual Behavior and Problematic Pornography Use among Women (2025). *Curr Addict Rep*. https://doi.org/10.1007/s40429-025-00674-3
- Diagnostic and Classification Considerations Related to CSBD and PPU (2021). *Curr Addict Rep*. https://link.springer.com/article/10.1007/s40429-021-00383-7
- What should be included in the criteria for compulsive sexual behavior disorder? *J Behav Addict*. https://www.akjournals.com/view/journals/2006/11/2/article-p160.xml
- Bridgland, V. M. E., Jones, P. J., & Bellet, B. W. (2023). A Meta-Analysis of the Efficacy of Trigger Warnings, Content Warnings, and Content Notes. *Clinical Psychological Science*. https://journals.sagepub.com/doi/full/10.1177/21677026231186625
- APS summary: Caution: Content Warnings Do Not Reduce Distress. https://www.psychologicalscience.org/news/2023-october-content-warnings-distress.html
- Interaction with AI companions and psychological well-being (2026). *Nature Human Behaviour*. https://www.nature.com/articles/s41562-026-02516-2
- Mental Health Impacts of AI Companions (2025). arXiv:2509.22505. https://arxiv.org/html/2509.22505
- AI companions and subjective well-being (2026). *Technology in Society*. https://www.sciencedirect.com/science/article/pii/S0160791X26000187
- Pathways of long-term AI virtual companion app use on users' attachment emotions (2025). *Frontiers in Psychology*. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1687686/full
- Mozilla Foundation — *Privacy Not Included: reproductive health apps. https://www.mozillafoundation.org/en/blog/in-post-roe-v-wade-era-mozilla-labels-18-of-25-popular-period-and-pregnancy-tracking-tech-with-privacy-not-included-warning/
- Period Tracking Apps and Reproductive Privacy in the Post-Dobbs Era. *Fordham UG Law Review*. https://undergradlawreview.blog.fordham.edu/digital-privacy/period-tracking-apps-and-reproductive-privacy-in-the-post-dobbs-era/
- Plugging the Digital Reproductive Health Data Privacy Holes in the Post-Dobbs Era. *Northwestern University Law Review Online*. https://scholarlycommons.law.northwestern.edu/cgi/viewcontent.cgi?article=1368&context=nulr_online
- How period trackers share your private details (2026). *BBC Future*. https://www.bbc.com/future/article/20260715-how-period-trackers-share-womens-private-details
- Period tracker Stardust shares users' health data with analytics firm (2026). *TechCrunch*. https://techcrunch.com/2026/07/16/period-tracker-stardust-shares-users-health-data-with-analytics-firm-says-mozilla-research/

### Inclusion and audience
- Disabling Norms, Affirming Desires: A Scoping Review on Disabled Women's Sexual Practices (2025). *Societies*. https://doi.org/10.3390/soc15060154
- 'Disabled people are sexual': inside the audio pornography boom (2023). *The Guardian*. https://www.theguardian.com/tv-and-radio/2023/nov/02/disabled-people-are-sexual-inside-the-audio-pornography-boom-that-is-revolutionising-desire
- Asexuality and Disability. Art Spark Texas. https://www.artsparktx.org/2022/01/25/asexuality-and-disability/
- Willoughby, B. J., et al. (2016). The Porn Gap: Differences in Men's and Women's Pornography Patterns in Couple Relationships. *J Couple & Relationship Therapy*. https://doi.org/10.1080/15332691.2016.1238796
- The Porn Gap (summary). Institute for Family Studies. https://ifstudies.org/blog/the-porn-gap-gender-differences-in-pornography-use-in-couple-relationships
- National Couples and Pornography Survey 2021. Wheatley Institute. https://wheatley.byu.edu/national-couples-and-pornography-survey-2021
- Gender differences in pornography use and sexual health outcomes: a systematic review and meta-analysis (2025). *J Sex Med*. https://doi.org/10.1093/jsxmed/qdag021
- "Tailored pornography": Content, context and consent in young women's sexting. *MedieKultur*. https://tidsskrift.dk/mediekultur/article/view/115099
