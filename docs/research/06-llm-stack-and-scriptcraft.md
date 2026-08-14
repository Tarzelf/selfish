# 06 — LLM Stack & Scriptcraft for Adult Narrative Audio

**Research date:** 14 August 2026
**Scope:** Which models/providers may legally be used to generate erotic audio scripts; which write well enough; how to force literary quality; how to emit TTS-ready structured output; personalization architecture; moderation architecture; cost model.
**Out of scope:** TTS/voice synthesis costs and vendor selection (separate research track). ElevenLabs appears here only as the *consumer* of our markup.

> **Verification note.** Every policy claim below is quoted from the primary policy document where I could reach it, with the URL. Where I could only reach secondary sources, the claim is tagged **[UNVERIFIED]** with an explanation. Benchmark leaderboard tables on `eqbench.com` and `console.chaiverse.com` are client-side rendered, so numeric rankings come from secondary aggregators and are tagged accordingly. OpenRouter pricing and capability data is **primary** — pulled live from `https://openrouter.ai/api/v1/models` on 14 Aug 2026 (411 models).

---

## 0. Recommendation (read this first)

### 0.1 The single most important finding is not about models

Apple's age-rating taxonomy draws the line in a place that determines our entire content specification:

| Apple content descriptor | Definition | Rating outcome |
|---|---|---|
| *Sexual Content or Nudity* | "**Non-explicit** depictions of sexual behavior… mild romantic intimacy, **implied sexual activity, or erotic or sensual dialog**" | 18+ — **publishable on the App Store** |
| *Graphic Sexual Content and Nudity* | "**Explicit, detailed depictions of sexual activity**… realistic, illustrative, or pornographic portrayals of sex" | **Unrated — "can't be published on the App Store"** |

Source: [App Store Connect — Age ratings values and definitions](https://developer.apple.com/help/app-store-connect/reference/age-ratings). Reinforced by [Guideline 1.1.4](https://developer.apple.com/app-store/review/guidelines/), which rejects "explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings."

**Therefore the product's editorial ceiling is "erotic and sensual dialog + implied sexual activity," not anatomical explicitness.** This is genuinely good news on three fronts:

1. It is *also* the higher-quality literary target. The market complaint we are attacking — hollow, repetitive AI erotica — is mostly a complaint about mechanical anatomical description. Tension, anticipation, voice and subtext are what the audience (primarily women, per the brief) actually reports wanting, and they are what LLMs can be pushed to do well.
2. It widens the provider field enormously. A "sensual, non-graphic" target sits inside far more usage policies than hardcore explicitness does.
3. It makes the moderation problem tractable: we can enforce an *upper* explicitness bound as a quality gate, not just a lower safety bound.

Everything below assumes this ceiling. I recommend treating it as a hard product constraint and encoding it as `intensity` tier 1–3 in the script schema (§4), with tier 3 capped at "implied/sensual," never "graphic."

### 0.2 Recommended stack

| Role | Choice | Why |
|---|---|---|
| **Primary generation** | **Mistral Large 3 (`mistral-large-2512`)**, self-hosted or via a permissive host | Apache 2.0 weights; Mistral's Usage Policy has **no general sexual-content clause** and **explicitly does not apply to open-weight models**; $0.50/$1.50 per M via OpenRouter; 262k context; structured outputs supported |
| **Fallback / second opinion** | **xAI Grok 4.3** (`x-ai/grok-4.3`, $1.25/$2.50) | Most permissive *frontier* AUP: prohibits real-person pornographic likenesses and sexualizing minors, but has **no clause against fictional adult sexual content**. Strong writer. |
| **Critique / judge model** | **Grok 4.3 or GLM 5.2** — must be a *different family* than the drafter | Practitioner consensus is unanimous: never let a model grade its own homework (§3.4) |
| **Safety classifier** | **Llama Guard 4 12B with S12 excluded**, + OpenAI `omni-moderation-latest` read for `sexual/minors` score only | Both give per-category signal, so we can gate on child-safety while permitting adult content (§6) |
| **Never use for generation** | Anthropic, Google (Gemini/Vertex), OpenAI, DeepSeek first-party API, Together AI, Novita, Stability | Each has an explicit prohibition that covers this use case (§1) |

**Pipeline shape:** a staged, state-carrying pipeline with generation and verification split across model families —
`brief → outline/beat-sheet → beat-by-beat draft (rolling context) → cross-family critique → targeted revision → deterministic slop lint → TTS markup + JSON emit → safety + explicitness-ceiling gate → human editor`.

**Cost:** **~$0.12 of LLM spend per finished 15-minute episode** (~$25 for a 200-episode library), which is a rounding error. The real cost is human editorial time at **$34–$83/episode**, plus a one-time **$7k–$25k** to commission licensed human style exemplars. Full model in §7.

---

## 1. Which providers actually permit this use?

### 1.1 The three-way distinction that matters

Most "can I do NSFW on X" discussion conflates three separate questions. Keep them apart:

1. **Does the usage policy permit it?** (contractual/ban risk)
2. **Will the model comply?** (refusal/quality risk)
3. **Does an intermediary filter it?** (technical risk)

Google is the clearest example of why this matters: Vertex AI lets you set `HARM_CATEGORY_SEXUALLY_EXPLICIT` to `BLOCK_NONE`/`OFF`, so question 3 is solvable — but the Generative AI Prohibited Use Policy still forbids the use case, so question 1 is a hard no. *Technically unblockable ≠ contractually permitted.*

### 1.2 First-party model providers

| Provider | Adult fiction permitted? | Governing clause (quoted) | Source |
|---|---|---|---|
| **Anthropic** | **No — explicit ban** | "**Do Not Generate Sexually Explicit Content** … Depict or request sexual intercourse or sex acts; Generate content related to sexual fetishes or fantasies; … Engage in erotic chats" | [anthropic.com/legal/aup](https://www.anthropic.com/legal/aup) (verified full text) |
| **OpenAI** | **No** (for our purposes) | Universal policies prohibit sexual content; the announced verified-adult "adult mode" was **never extended to the API** and is reported paused indefinitely as of 26 Mar 2026 | [openai.com/policies/usage-policies](https://openai.com/policies/usage-policies/) — **[UNVERIFIED: the live page returned a JS/anti-bot challenge to my fetches; the pause and API-exclusion detail come from secondary reporting]** |
| **Google (Gemini/Vertex)** | **No — explicit ban** | "Do not engage in sexually explicit… activities. This includes generating or distributing content that facilitates: … **Sexually explicit content — for example, content created for the purpose of pornography or sexual gratification**" | [policies.google.com/terms/generative-ai/use-policy](https://policies.google.com/terms/generative-ai/use-policy) (verified, last modified 17 Dec 2024) |
| **xAI (Grok)** | **Yes, by omission — most permissive frontier AUP** | Full AUP prohibits: "Undressing or nudifying **real persons**"; "**Depicting likenesses of persons** in a pornographic manner"; "**Sexualizing or exploiting children**". **There is no clause prohibiting sexual content involving fictional adults.** | [x.ai/legal/acceptable-use-policy](https://x.ai/legal/acceptable-use-policy), eff. 26 Jun 2026 (verified full text) |
| **Mistral** | **Yes, by omission — and open weights are carved out entirely** | Prohibited list covers CSAM, NCII, "sexual services"/trafficking, hate, violence, self-harm, fraud — **no general sexual-content clause**. Critically: "This Usage Policy **does not apply to** Mistral AI Products deployed on a customer's infrastructure… **or to our open-source AI models and products**." | [legal.mistral.ai/terms/usage-policy](https://legal.mistral.ai/terms/usage-policy) (verified full text) |
| **Meta (Llama)** | **Weights: yes, with care.** AUP bans sex crimes, CSAM, "sexual solicitation," and "**illegal distribution of… obscene materials to minors, or failure to employ legally required age-gating**" — i.e. it *presumes* adult content is possible and requires age-gating. License: commercial use OK below 700M MAU. | [Llama 4 AUP](https://developer.meta.com/ai/llama4/use-policy/), [Llama 4 license](https://www.llama.com/llama4/license/) |
| **DeepSeek (first-party API)** | **No — explicit ban** | ToS §3.4(5): you will not generate content that "**is pornographic, obscene, or sexually explicit (e.g., sexual chatbots)**" | [DeepSeek ToU](https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html) |
| **Qwen / Alibaba** | **Assume no** | Alibaba Model Studio international terms track the same PRC-derived content restrictions. **[UNVERIFIED — I could not retrieve a clean quotable clause for the international Model Studio AUP. Treat first-party Qwen API as prohibited until verified; Apache-2.0 Qwen weights self-hosted are a separate matter.]** |
| **Cohere** | **Narrower than expected** | Prohibits "sexually explicit content **involving minors**" — the clause is minor-specific, not a general adult ban. But Cohere models show `is_moderated: true` on OpenRouter, so expect technical filtering. | [docs.cohere.com/docs/usage-policy](https://docs.cohere.com/docs/usage-policy) |
| **AI21** | **Effectively no, for a different reason** | AUP has no general sexual clause, but: "**No content generated by AI Services will be posted automatically (without human intervention) to any public website or platform**" (docs elaborate: audience >100 people requires human review). A published library is exactly that. | [ai21.com/terms-policies/acceptable-use](https://www.ai21.com/terms-policies/acceptable-use/), [docs.ai21.com](https://docs.ai21.com/docs/responsible-use-1) |

**Note on Vertex safety filters** (useful even though Google is out): `BLOCK_NONE` "removes automated response blocking… you can configure your own content guidelines with the returned scores," but it "is a restricted field that isn't available to all users," requiring allowlisting via account team or invoiced billing. CSAM and PII filters are **non-configurable** and cannot be disabled. ([Vertex safety filters docs](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-filters))

### 1.3 Aggregators and inference hosts

| Host | Adult content stance | Evidence | Verdict |
|---|---|---|---|
| **OpenRouter** | Does not filter itself; routes to providers with their own policies. Exposes `top_provider.is_moderated` per model and supports `only`/`ignore` provider routing, ZDR routing, and model-level fallback that triggers on "moderation flags." | [Models API](https://openrouter.ai/docs/api/api-reference/models/get-models.mdx), [routing blog](https://openrouter.ai/blog/insights/model-routing/), [SillyTavern guide](https://openrouter.ai/blog/tutorials/sillytavern-openrouter/): "OpenRouter doesn't filter content itself, but it routes to providers that enforce their own policies, so calling the setup 'uncensored' overstates it." | **Usable, with provider pinning mandatory** |
| **DeepInfra** | ToS says "You may use the Services for **any legal commercial purposes unless specifically prohibited below**" — and the prohibited-conduct list contains **no sexual-content clause at all** (I grepped the full text). | [deepinfra.com/terms](https://deepinfra.com/terms) (verified) | **Permissive — strong candidate** |
| **Together AI** | **Prohibited.** "You are strictly prohibited from using the Services to communicate any message or material that (i) is libelous, harmful to minors, **obscene, or constitutes pornography**" | [together.ai/terms-of-service](https://www.together.ai/terms-of-service) (verified) | **Do not use** |
| **Novita** | **Prohibited.** Unauthorized offerings include "**pornography or graphic adult content**… may result in immediate termination and a **lifetime ban**" (clause is framed around marketplace offerings, but the risk is unacceptable) | [novita.ai legal](https://novita.ai/de/legal/terms-of-service) (verified) | **Do not use** |
| **Groq** | Ambiguous, arguably permissive. Prohibits "…non-consensual intimate imagery or **sexually explicit content that is illegal**." The qualifier *that is illegal* implies lawful adult content is out of scope. | [Groq AUP](https://console.groq.com/docs/legal/ai-policy) | **Amber — get written confirmation** |
| **Featherless.ai** | Markets "RP & Creative Writing," flat-rate $10–$75/mo unlimited tokens, "no logs," catalogue of 32,000+ HF models. ToS is infrastructure-framed (you warrant your rights to the models you run) with no sexual-content clause found. **Individual plans are explicitly interactive-only** — "Not for reselling, app/API traffic, background automation, or benchmarking." Batch generation needs a Scale/Business plan. | [featherless.ai/terms](https://featherless.ai/terms), [plans](https://featherless.ai/docs/plans) | **Amber — Business tier only; ToS silence is not permission [UNVERIFIED as affirmative permission]** |
| **Arli AI / Infermatic** | Market explicitly to the uncensored-RP segment; ArliAI publishes "Derestricted" model variants that top the OpenUGI willingness rankings. | Inferred from product positioning + OpenUGI entries | **[UNVERIFIED — no quotable content policy retrieved. Treat as consumer-RP vendors, not production suppliers.]** |
| **RunPod / Modal / Baseten** | Raw compute / serverless infra. RunPod's public terms don't address consensual adult generation either way and place full liability on the user. | [Analysis](https://cling-ai.com/blog/runpod-nsfw-policy-adult-content-allowed-2026) | **Usable as GPU substrate; you own moderation** |
| **Stability AI** | **Prohibited.** "We Prohibit Sexually Explicit Content… content relating to sexual intercourse, sexual acts, or sexual violence." | [stability.ai/use-policy](https://stability.ai/use-policy) | **Do not use** (not relevant for text anyway) |
| **Nebius / Hyperbolic** | **[UNVERIFIED — not retrieved this pass. Both are general-purpose open-weight hosts; assume standard illegal-content prohibitions and verify before committing.]** | — | Unknown |

**Operational warning from the community:** provider-level bans are a real, observed failure mode on aggregators. A r/SillyTavernAI thread snapshot (24 Jul 2026) reports users "banned by xiaomi for using it for NSFW" when routing Mimo through OpenRouter without pinning providers. If we use OpenRouter, we must set explicit `only: [...]` provider allow-lists per model and monitor `finish_reason` for moderation truncation — not rely on defaults.

### 1.4 Consolidated provider table (policy × quality × price)

Prices are **live OpenRouter list prices, USD per million tokens, 14 Aug 2026**. `Mod` = `top_provider.is_moderated`. Writing quality is a synthesis of EQ-Bench Creative Writing v3 standing, OpenUGI *Writing* score, and community reports — it is **directional, not measured by me**.

| Model | Policy for our use | Mod | In $/M | Out $/M | Ctx | Writing quality | Verdict |
|---|---|---|---|---|---|---|---|
| `mistralai/mistral-large-2512` (Large 3) | **Permitted** (Apache 2.0; AUP excludes open weights) | No | 0.50 | 1.50 | 262k | High | ✅ **Primary** |
| `x-ai/grok-4.3` | **Permitted** (no fictional-adult clause) | No | 1.25 | 2.50 | 1M | High | ✅ **Fallback / critic** |
| `x-ai/grok-4.6` | Permitted | No | 2.00 | 6.00 | 500k | Very high | ✅ Premium tier |
| `z-ai/glm-5.2` | Weights MIT-family; host-dependent | No | 0.63 | 1.98 | 1M | High (community favourite) | ✅ Critic / alt primary |
| `moonshotai/kimi-k2.6` | Weights modified-MIT; host-dependent | No | 0.95 | 4.00 | 262k | Very high | ✅ Premium prose |
| `moonshotai/kimi-k3` | as above | No | 3.00 | 15.00 | 1M | **Top-2 on EQ-Bench CW** | ⚠️ Best prose, 6× cost |
| `deepseek/deepseek-v4-pro-0813` | Weights MIT; **first-party API prohibited** | No | 0.435 | 0.87 | 1M | High | ✅ Only via 3rd-party host |
| `minimax/minimax-m3` | Host-dependent | No | 0.30 | 1.20 | 1M | Good | ✅ Cheap bulk |
| `qwen/qwen3.7-max` | First-party assume prohibited | No | 1.475 | 4.425 | 1M | Good | ⚠️ |
| `google/gemini-3.1-pro-preview` | **Prohibited by Google policy** | No | 2.00 | 12.00 | 1M | Very high | ❌ |
| `anthropic/claude-opus-5` | **Prohibited by AUP** | Yes | 5.00 | 25.00 | 1M | **#1 on EQ-Bench CW** | ❌ |
| `openai/gpt-5.6-sol` | **Prohibited** | Yes | 5.00 | 30.00 | 1.05M | Very high | ❌ |
| `cohere/command-a` | Minor-specific ban only | **Yes** | 2.50 | 10.00 | 256k | Mid | ❌ (filtered) |
| `ai21/jamba-large-1.7` | Human-review requirement | No | 2.00 | 8.00 | 256k | Mid | ❌ |

**The headline:** the two models we are *allowed* to use most freely (Mistral Large 3, Grok 4.3) are also **4–40× cheaper** than the models we are forbidden from using. Policy compliance costs us some prose ceiling but saves money.

---

## 2. Open-weight models for creative / erotic writing

### 2.1 Leaderboards — what they measure and how much to trust them

| Leaderboard | Measures | Trust for our purpose |
|---|---|---|
| **[EQ-Bench Creative Writing v3](https://eqbench.com/creative_writing.html)** | Rubric + Elo, judged by Claude Sonnet 4.6. Columns: Abilities, Style, **Slop**, **Repetition**, Length, Rubric, Elo | **Highest.** Explicitly tracks slop and repetition. But note the maintainers' own caveat that **"NSFW content aversion (smut bias)"** is a bias they do *not* control for — so it under-rates models that write our genre well. |
| **[EQ-Bench Longform Writing](https://eqbench.com/creative_writing_longform.html)** | 8×1000-word turns from a minimal prompt; includes plan→reflect→revise; adds a **Degradation** sparkline for quality drop-off across chapters | **Highest for us** — long-output degradation is precisely our 15–25 min risk |
| **[EQ-Bench Slop Score](https://eqbench.com/slop-score.html)** | 60% slop words + 25% "not-x-but-y" + 15% slop trigrams; plus MATTR-500, Flesch-Kincaid, sentence/para length, dialogue frequency | **Adopt directly as a CI metric** |
| **[UGI / OpenUGI](https://openugi.com/)** | `UGI` (knowledge breadth on sensitive topics), `W/10` (willingness, 0–10), `Writing`, `NatInt`. 1,202 models, last updated 3 May 2026 | Good for *willingness*, weak for prose. **W/10 ≠ quality.** |
| **[Chaiverse](https://console.chaiverse.com/)** | Elo from **blind A/B human feedback in the live Chai app**, ~1M samples/day, 1.4M DAU | **Most ecologically valid signal for RP prose** — real users, real preference. Skewed to short-turn chat, not long narration. |
| r/SillyTavernAI monthly megathreads | Practitioner consensus | Useful directionally; **heavily polluted by SEO spam** — see §2.4 |

### 2.2 Willingness rankings (OpenUGI, 3 May 2026)

| Model | UGI | W/10 | Note |
|---|---|---|---|
| `xai/grok-4.20-multi-agent-beta` (4 agents) | 70.00 | 6.5 | Top UGI overall |
| `ArliAI/GLM-4.6-Derestricted-v3` (prefill) | 69.82 | **8.8** | Community de-restrict of GLM |
| `ArliAI/GLM-4.6-Derestricted-v3` (no-think) | 65.91 | **9.8** | |
| `coder3101/gemma-4-31B-it-heretic` | 65.69 | **10.0** | "Heretic" = automated abliteration |
| `deepseek-ai/DeepSeek-V3.2-Speciale` | 65.37 | 4.8 | High knowledge, **low willingness** |
| `SicariusSicariiStuff/Assistant_Pepe_70B` | 59.52 | 9.5 | |
| `mistralai/Mistral-Large-Instruct-2411` | 59.23 | 7.5 | Highest willingness among *base* frontier weights |
| `anthropic/claude-opus-4-6` | 60.41 | 3.2 | Confirms the AUP is enforced in-weights |

**Read this carefully:** high `W/10` fine-tunes are willing but not necessarily good writers, and several carry license problems (§2.5). `Mistral-Large-Instruct` scoring 7.5 on willingness *as a base instruct model* is the important row — it means we may not need a de-censored fine-tune at all, which avoids the entire licensing and quality-degradation minefield.

### 2.3 Notable fine-tune families

| Family / model | What it's for | Prose quality | Commercial license | Verdict |
|---|---|---|---|---|
| **TheDrummer** — Cydonia 24B v4.1, Skyfall 36B v2, UnslopNemo 12B, Rocinante 12B | Purpose-built RP/creative de-slopped tunes. `UnslopNemo` is explicitly an anti-slop tune. Available on OpenRouter at $0.25–$0.80/M | Good-to-very-good *for the size*; well below frontier on coherence over 15+ min | Inherits base (Mistral Nemo / Mistral Small = Apache 2.0 ✅; Gemma-based ones ❌) | ✅ Worth A/B testing as a **cheap variant generator**, not the primary |
| **Magnum** (`anthracite-org/magnum-v4-72b`) | Claude-prose-imitation tunes | Distinctive, praised prose; dated (Qwen2.5-era) | Base-dependent | ⚠️ Aging |
| **Euryale / Sao10K** (`l3.3-euryale-70b`) | Long-standing RP favourite | Good; Llama-3.3 base is now behind | Llama 3.3 Community License | ⚠️ Aging |
| **EVA, Midnight Miqu, Behemoth** | Community merges/tunes | Midnight Miqu descends from the **leaked Miqu weights** → **legally unusable commercially** | ❌ for Miqu lineage | ❌ |
| **Hermes 4** (`nousresearch/hermes-4-405b`) | Neutrally-aligned general | Good; **no structured-output support** on OpenRouter | Llama-based | ⚠️ |
| **Dolphin / Venice, XORTRON, "heretic"/abliterated tunes** | Maximum compliance | Abliteration commonly **degrades** coherence and instruction-following | Base-dependent; **Gemma 1–3 base = prohibited** | ❌ for production |
| **Aion-Labs** (`aion-3.0`, `aion-rp-llama-3.1-8b`) | Commercial RP models on OpenRouter | Community: Aion-3 is "really good, really clean prose… but it'll cost you an arm and a leg" ($3/$6) | Proprietary API | ⚠️ Benchmark it; **no structured outputs** |

### 2.4 A caution about "community consensus" sources

While researching r/SillyTavernAI consensus I hit a wall of low-quality SEO content — including an article dated "early 2026" presenting **Claude 3.5 Sonnet vs GPT-4o** as the live community debate and citing 2024-era prices. That is stale content refreshed with a new date. I have excluded it. The signals I did retain are: a dated Reddit sentiment snapshot (24 Jul 2026) naming **GLM-5.1/5.2, Kimi K2.5, DeepSeek V3.2/V4, Gemma 4 31B, Aion-3, Mimo v2.5**, and the OpenUGI/Chaiverse tables. Treat any 2026 "best RP model" listicle as spam until it names specific current model versions and prices.

Also from that snapshot, a practical sampling note: *"Most people don't use samplers (DRY, XTC) nowadays since providers don't support them and they don't have as much of an effect with modern models — just set temp to 1.0 and top-p/top-k to the model's documented recommendation."* This matters for §3: **exotic sampler-based anti-slop is not available through most hosted APIs.** Our anti-slop must be prompt-, pipeline-, and lint-based. (Confirmed by the live API data: of the frontier candidates, only DeepSeek, GLM, Kimi, MiniMax and Nemotron expose `logit_bias` and `min_p`; Grok, Mistral, Qwen and Gemini expose neither.)

### 2.5 Licenses for commercial use — the trap table

| Weights | License | Sexual content restriction on weights? | Commercial? |
|---|---|---|---|
| **Mistral Large 3 / Ministral 3** | **Apache 2.0** | **None** — and Mistral's AUP self-excludes open models | ✅ Cleanest option available |
| Mistral Large 2 (2407) | **Mistral Research License** | Non-commercial | ❌ Requires bespoke commercial licence |
| Some newer Mistral models | Modified MIT | Commercial licence required above **$20M monthly revenue** | ✅ (at our scale) |
| Qwen 3.x | Apache 2.0 (most) | None | ✅ |
| DeepSeek V3/V4 | MIT | None on weights (**first-party API ToS is separate**) | ✅ self-hosted |
| GLM 4.x/5.x | MIT-family | None | ✅ |
| Kimi K2 | Modified MIT | Attribution above thresholds | ✅ |
| **Gemma 1 → 3n** | **Custom Gemma Terms** | **"Generate sexually explicit content, including content created for the purposes of pornography or sexual gratification (e.g. sexual chatbots)"** is prohibited, **incorporated by reference, with a flow-down obligation to downstream users** | ❌ **Prohibited for us** |
| **Gemma 4** (Apr 2026) | **Apache 2.0** | Prohibited Use Policy is **not attached** to Gemma 4 weights | ✅ **but verify independently — this is the single highest-value licence question to run past counsel** |
| Llama 3.x / 4 | Llama Community License | AUP requires age-gating for adult material; <700M MAU | ✅ with conditions |

Sources: [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy), [Gemma Terms](https://ai.google.dev/gemma/terms), [Mistral licence FAQ](https://help.mistral.ai/en/articles/347393-under-which-license-are-mistral-s-open-models-available), [Mistral 3 announcement](https://mistral.ai/news/mistral-3/), [Mistral Large 2 announcement](https://mistral.ai/news/mistral-large-2407/).

⚠️ **The Gemma trap is worth restating.** Gemma-based "heretic"/"uncensored" tunes dominate the top of the willingness leaderboard. Every one built on Gemma 1–3n is, on my reading, contractually barred from this exact use case *and* obliges us to pass that bar to our users. Do not let a benchmark score pull us into that. Gemma 4's Apache 2.0 relicensing appears to remove the restriction, but that reading comes from a secondary analysis and needs legal sign-off.

### 2.6 Self-hosted batch economics

Batch script generation is the ideal self-hosting workload: no latency SLA, so we can saturate the GPU.

| Config | Batch / concurrency | Throughput | $/M output tokens |
|---|---|---|---|
| H200, `llama3.3-70b` FP8, vLLM, $3.44/hr | 1 | 47 tok/s | **$20.32** |
| same | 8 | 351 tok/s | $2.73 |
| same | 64 | 1,656 tok/s | $0.58 |
| same | **256 (offline batch)** | 2,089 tok/s | **$0.46** |
| H100 SXM, Llama 4 70B, $2.50/hr | 8 | 380 tok/s | $0.18 |
| B200 SXM, 70B+, $3.75/hr | high | ~3× H200 | **<$0.05** |

Sources: [DigitalOcean batch sweep](https://www.digitalocean.com/community/tutorials/llm-inference-cost), [packet.ai](https://packet.ai/blog/llm-inference-cost), [concurrency-aware cost paper (arXiv 2606.11690)](https://arxiv.org/html/2606.11690v1).

The academic measurement is the one to internalise: **on identical H100 hardware, effective cost spans $0.21 to $15.25 per million output tokens** purely as a function of offered load — a 36× underutilisation penalty near idle. Self-hosting only beats serverless above roughly **72% sustained utilisation**.

**Conclusion: do not self-host initially.** Our entire 200-episode library needs ~27M tokens (§7). At Mistral Large 3's hosted price that is **~$25 total**. A single H100 for one day costs more than the whole library. Self-hosting becomes interesting only if (a) per-user on-demand generation reaches sustained volume, or (b) we need weights-level anti-slop training (FTPO, §3.3) or provider-independence for policy reasons. Both are phase-2 concerns.

---

## 3. Prose quality: why LLM creative writing is bad, and what actually fixes it

### 3.1 The failure modes, named

The EQ-Bench Longform rubric is the best-articulated taxonomy available, and I recommend adopting its 14 dimensions verbatim as our critique rubric:

**Positive (maximise):** Nuanced Characters · Emotionally Engaging · Compelling Plot · Coherent · Well-earned Lightness or Darkness · Characters Consistent with Profile · Followed Chapter Plan · Faithful to Writing Prompt

**Flaws (minimise):** Weak Dialogue · Tell-Don't-Show · Unsurprising or Uncreative · Amateurish · **Purple Prose** · **Forced Poetry or Metaphor**

Two mechanical details worth copying:
- EQ-Bench weights forced/incoherent metaphor **super-linearly**: `Final Score = (Σ other criteria) + (5 × ForcedPoetry^1.7)`. They did this because LLM judges systematically fail to catch it. Our judge will fail the same way; weight accordingly.
- They apply an automatic **degradation penalty** when output devolves into "excessive use of very short single-sentence paragraphs (≤5 words)" — a specific, detectable structural collapse mode in long generation. This is a cheap deterministic lint we should implement on day one.

### 3.2 Slop is measurable, and the numbers are extreme

From [*Antislop: A Comprehensive Framework…* (arXiv 2510.15061)](https://arxiv.org/pdf/2510.15061), which profiled 2,000 creative-writing generations per model against human baselines (wordfreq + Reddit + Gutenberg):

| Pattern | Over-representation vs human text |
|---|---|
| `elara` (as a character name) | **85,513×** |
| `unsettlingly` | 3,833× |
| `shimmered` | 2,882× |
| `stammered` | 2,043× |
| `heart hammered ribs` (trigram) | 1,192× |
| `voice trembling slightly` | 731× |
| `said voice devoid` | 693× |
| `felt profound sense` | 550× |

And on cross-model universality: **`flickered` appears on 98.5%** of models' top-overused lists; the trigram **`voice barely whisper` on 68.7%**. One concrete horror story: `mistral-small-3.1-24b-instruct-2503` produced **102 instances of "eyes never leaving" and 62 of "voice barely whisper" across just 96 prompts.**

This matters doubly for us because that specific cluster — whispers, trembling voices, shivers, hammering hearts — *is* the vocabulary of intimate audio. The slop overlap with our genre is nearly total. **Anti-slop is not a polish step for this product; it is the core quality problem.**

### 3.3 What actually works (ranked by evidence strength)

| Technique | Evidence | Effectiveness | Available to us? |
|---|---|---|---|
| **Antislop Sampler** (backtrack on banned n-gram, downweight the *first* token of the phrase, resample) | Suppresses **8,000+ patterns at 100%** while *improving* judged writing quality above baseline | **Best-in-class** | ❌ **Only if self-hosting.** Costs 69–96% throughput. Not exposed by any hosted API. |
| **FTPO fine-tune** (Final Token Preference Optimization) | **90% slop suppression at <1% quality loss**; lexical diversity 95–102% of baseline; MMLU/GSM8K within 1–3% | Excellent, permanent, no inference cost | ❌ Phase 2 (requires training on own weights) |
| **DPO on the same pairs** | 80–82% suppression but **6–15 point writing-quality drop** and diversity collapse to 74–92% | **Actively harmful** | ❌ Avoid |
| **Naive token banning / logit_bias** | "Catastrophic quality collapse" — quality fell to **28/100** at 8k patterns; banning `catatonic` tokenised as `cat`+`atonic` bans every `cat*` word | **Do not do this** | Available but harmful |
| **Post-hoc deterministic lint + targeted LLM rewrite** | Not benchmarked in the paper, but it is the only high-precision method that survives a hosted-API constraint | Good | ✅ **Our primary mechanism** |
| **Instructing the model to avoid a banlist in the prompt** | "Limited efficacy and may induce a **backfire effect** due to the 'Pink elephant problem'" | Weak; can worsen | ⚠️ Use sparingly, as *style guidance* not enumerated bans |
| **Outline→draft→critique→revise, with a different model family critiquing** | Converged practice across every serious pipeline I found | Strong | ✅ **Core architecture** |
| **Few-shot with excellent human exemplars** | Universal practitioner practice | Strong | ✅ — but see §3.5 on copyright |

**The key strategic insight:** the two most effective anti-slop techniques (Antislop Sampler, FTPO) both require controlling the weights, which we are deliberately *not* doing in phase 1. So phase 1 must lean on **deterministic post-generation linting with targeted rewrite**, which is high-precision and cheap. Phase 2's strongest single quality upgrade is bringing Mistral Large 3 in-house and running FTPO against a slop profile built from our own outputs.

Note also the "pink elephant" finding, which is counter-intuitive and important: **dumping a 200-phrase banlist into the system prompt can make slop worse.** The banlist belongs in the *linter*, not the *prompt*. The prompt should carry positive style direction.

### 3.4 The architecture practitioners converge on

Four independent long-form pipelines I examined ([Pratilipi engineering](https://medium.com/team-pratilipi/beyond-the-context-window-architecting-long-form-story-generation-8f3a3350255f), [ludLLM](https://github.com/devsandip/ludLLM), [Novel-OS](https://github.com/mrigankad/Novel-OS), [The Unseen Alliance](https://daveisbest.org/writing/unseen-alliance)) independently arrived at the same five principles:

1. **Generation and verification must be separate agents, ideally different model families.** *"The prose model is incentivised toward fluency; it will paper over small contradictions to keep the sentence moving."* ludLLM states the rule flatly: *"A different model family must critique than drafts, so no model grades its own homework."*
2. **State lives outside the context window**, in a validated JSON object / markdown "artifacts as source of truth." You work one unit at a time against a rolling summary, never the whole work.
3. **Two-agent iteration everywhere**: Generator produces → Critic critiques against explicit constraints → regenerate → repeat to approval or max depth.
4. **Deterministic checks run *before* LLM checks.** Novel-OS runs "a free local continuity engine" that catches drift before the LLM Guardian; the sag detector is "entirely deterministic — no model is asked whether your book drags."
5. **Plan to a target, don't write forward and hope.** Pratilipi's "Checkpoints" define a target end-state and ask the model to generate a path that lands on it.

For a 15-minute episode we don't need a 5-agent novel framework, but principles 1, 3, 4 and 5 map directly onto our stage list.

### 3.5 Legal status of using published erotica as exemplars or training data

The law moved decisively in 2026 and the answer is now reasonably clear.

**Bartz v. Anthropic** — final settlement approval **20 July 2026**, N.D. Cal. (Judge Martínez-Olguín): **$1.5 billion** for ~500,000 authors, ~**$3,000 per work** ("four times the statutory minimum for ordinary infringement"). Judge Alsup's underlying 2025 fair-use order held that training on **lawfully acquired** books is "exceedingly transformative" fair use, but that **"pirating copies to build a research library… was its own use — and not a fair one."**

Two features of the settlement bear directly on us:

- **The release is inputs-only and past-only.** Per the Authors Guild: class members release only claims about *acquisition and copying* through 25 Aug 2025. **"Claims based on AI outputs are not released,"** and neither are claims about future conduct. Works not on the Works List are "preserved and unaffected."
- Therefore **output-side infringement remains fully live litigation risk**, and it is the *output* side we would be exposed on if we few-shot a model with a named author's prose and it produces recognisably derivative text.

**Practical guidance:**

| Approach | Risk | Recommendation |
|---|---|---|
| Few-shot with excerpts from published erotica (pirated or purchased) | Reproduction + derivative-work exposure on outputs; the transformative argument is weakest at few-shot scale since you're using the expression *as* expression | ❌ **Do not** |
| Fine-tune on scraped erotica corpora | Bartz protects *lawfully acquired* training data — but "fine-tuning with unlicensed data… may carry infringement exposure that the foundation model fair use ruling does not cover" | ❌ **Do not** |
| **Commission original style exemplars from human writers, work-for-hire, all rights assigned** | Near-zero | ✅ **Recommended** |
| License a back catalogue from an erotica publisher/audio studio with explicit AI-training rights | Low, contractually bounded | ✅ Viable at scale |
| Public-domain sensual literature as *rhythm/structure* exemplars (not voice) | Low | ✅ Useful supplement |

The commissioned-exemplar route is the one I'd fund. It costs $7k–$25k one-time (§7), it is the highest-leverage quality investment available (it's what makes the prose *not* sound like an LLM), and it converts an unbounded legal risk into a fixed, known cost. It also gives us something no competitor scraping the web has: a proprietary, defensible house voice.

---

## 4. Structured, TTS-ready script generation

### 4.1 What the TTS layer can actually consume

ElevenLabs v3 is the assumed target. The critical constraint:

> **"Eleven v3 doesn't support SSML break tags or the rest of the SSML tag set."** Instead it uses **audio tags** — bracketed natural-language cues — plus punctuation and text structure. ([v3 audio tags](https://elevenlabs.io/blog/v3-audiotags), [best practices](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices))

This is a real architectural fork. Audio tags are **natural language, not an enum**: *"Audio tags are natural-language instructions, not an enum parameter."* That means the tag vocabulary is open-ended and model-interpreted — flexible but unvalidatable.

| Cue type | v3 audio tags (documented examples) |
|---|---|
| Emotion | `[curious]` `[excited]` `[sad]` `[worried]` `[mischievously]` `[elated]` `[hesitant]` `[nervous]` |
| Delivery | `[whispers]` `[shouts]` `[sarcastic]` `[timidly]` `[understated]` |
| **Pacing / pauses** | `[pause]` `[short pause]` `[long pause]` `[rushed]` `[slows down]` `[deliberate]` `[drawn out]` `[continues after a beat]` |
| **Breath (core for our genre)** | `[sighs]` `[exhales]` `[exhales sharply]` `[inhales deeply]` `[breathes]` `[gulps]` |
| Non-verbal | `[laughs]` `[chuckles]` `[giggling]` `[clears throat]` `[stammers]` `[snorts]` |
| Ambience | `[leaves rustling]` `[gentle footsteps]` |
| Punctuation | Ellipsis `…` = trailing pause/weight · line break = longer beat · **ALL CAPS = emphasis** · commas = breathing rhythm |

Tags stack: `[hesitant][nervous] I... I'm not sure this is going to work. [gulps] But let's try anyway.`

**Three practical limits to design around:**
1. **5,000 characters per request** → a 15-minute script (~1,800 spoken words ≈ 10,000 chars) **must** be chunked. Our schema must be natively segmented, not one prose blob. This is a strong argument for a beat/line array.
2. **Tag–voice coherence**: *"if the voice is shouting and you use `[whispering]`, it likely won't work well."* Tags must be validated against the cast voice's baseline register, which means the schema needs a per-voice `baseline_register` field.
3. **Professional Voice Clones are not fully optimised for v3**; Instant Voice Clones or designed voices are recommended. A voice-track concern, but it constrains casting.

**Portability decision:** ElevenLabs tags and SSML are mutually exclusive dialects, and we may later use engines that *do* take SSML. So store **abstract performance directions** in the schema (`{kind: "breath", subtype: "inhale", intensity: 2}`) and render to `[inhales deeply]` *or* `<break time="400ms"/>` at emit time. Never persist vendor syntax as the source of truth.

### 4.2 Structured-output support is not universal

From the live OpenRouter data, `structured_outputs` support among our candidates:

| Supports `structured_outputs` | Does **not** |
|---|---|
| Mistral Large 3 ✅ · Grok 4.3/4.5/4.6 ✅ · GLM 4.7/5.1/5.2 ✅ · Kimi K2.5/K2.6/K3 ✅ · DeepSeek V3.2/V4 ✅ · MiniMax M3 ✅ · Qwen3.7/3.8-Max ✅ · Nemotron 3 Ultra ✅ · Cydonia 24B ✅ · UnslopNemo ✅ · Skyfall 36B ✅ · Magnum v4 72B ✅ | **Aion-3.0 ❌** · **Hermes-4-405B ❌** · **Jamba Large 1.7 ❌** · **Dolphin-Mistral-Venice ❌** |

Both recommended models support it. But long, creative, schema-constrained generation is where JSON mode most often degrades prose — the model spends capacity on syntax. **Recommended split: never generate prose and structure in the same call.**

- Stages 2–6 emit **plain prose or lightweight Markdown** with delimiters. Prose quality is protected.
- Stage 7 is a **cheap structuring pass** that converts approved prose into schema-valid JSON with `response_format: json_schema`, plus deterministic repair. Use a small model here.

### 4.3 Proposed script schema

Designed so one authored story can be re-rendered across voices, POVs and intensities without regeneration.

```jsonc
{
  "schema_version": "1.1",
  "story_id": "sto_7Kq2",
  "spine_id": "spn_7Kq2",          // invariant narrative identity across all variants
  "title": "The Long Way Home",
  "logline": "A rain-delayed train, a stranger's coat, and the slow permission to be wanted.",

  "taxonomy": {
    "genre": ["contemporary_romance"],
    "tropes": ["slow_burn", "stranger_intimacy", "hurt_comfort"],
    "heat_ceiling": 3,             // 1 sensual … 3 explicit-implied. NEVER >3 (App Store, §0.1)
    "target_runtime_sec": 900,
    "content_flags": [],           // populated by safety pass; must be empty to publish
    "audience_note": "female-primary"
  },

  // ---- Rendering axes: what can vary without touching the spine ----
  "variant": {
    "pov": "second_person_listener",   // second_person_listener | first_person_narrator | third_limited
    "listener_role": "desired",
    "intensity": 2,                    // must be <= taxonomy.heat_ceiling
    "locale": "en-GB"
  },

  "slots": {                          // safe personalization surface (allow-list ONLY, §5/§6)
    "listener_name":  { "type": "given_name", "default": null, "max_len": 24,
                        "validator": "unicode_letters_spaces_hyphen", "fallback": "omit_gracefully" },
    "term_of_address":{ "type": "enum", "values": ["darling","sweetheart","love","hey you"],
                        "default": "hey you" }
  },

  "cast": [
    { "id": "spk_main", "label": "Ilan", "gender_presentation": "masc",
      "voice_slot": "warm_low_masc",
      "baseline_register": "low_calm",   // guards tag/voice coherence (§4.1 limit 2)
      "accent": "en-GB-rp" },
    { "id": "spk_narr", "label": "Narrator", "voice_slot": "same_as:spk_main",
      "baseline_register": "low_calm" }
  ],

  "beats": [
    {
      "beat_id": "b01",
      "function": "arrival",           // arrival|invitation|escalation|apex|afterglow|release
      "target_sec": 95,
      "emotional_target": { "valence": 0.2, "arousal": 0.25, "tension": 0.5 },
      "intent": "Establish the platform, the rain, and that she is noticed without being pressured.",
      "lines": [
        {
          "line_id": "b01_l01",
          "speaker": "spk_narr",
          "text": "The announcement board blinks and gives up. Another twenty minutes.",
          "directions": [
            { "kind": "pace", "value": "unhurried" },
            { "kind": "breath", "subtype": "exhale", "intensity": 1, "position": "end" }
          ],
          "emphasis": [{ "span": [30, 36], "level": 1 }],   // char offsets, not markup
          "ambience": ["rain_on_glass_soft"]
        },
        {
          "line_id": "b01_l02",
          "speaker": "spk_main",
          "text": "You're soaked. {{term_of_address}}, take the coat — I'm not using it.",
          "directions": [
            { "kind": "emotion", "value": "warm_amused", "intensity": 1 },
            { "kind": "pause", "ms": 350, "position": "before_offset:12" }
          ]
        }
      ]
    }
  ],

  "provenance": {
    "spine_model": "mistralai/mistral-large-2512",
    "critic_model": "x-ai/grok-4.3",
    "exemplar_pack": "house_voice_v2",       // commissioned, licensed (§3.5)
    "slop_score": 0.041,
    "rubric_scores": { "weak_dialogue": 1, "purple_prose": 1, "forced_metaphor": 0,
                       "emotionally_engaging": 4, "nuanced_characters": 4 },
    "safety": { "llama_guard_4": "safe", "sexual_minors_score": 0.0000004,
                "explicitness_ceiling_check": "pass" },
    "human_editor": "ed_014",
    "approved_at": "2026-08-14T11:02:00Z"
  }
}
```

**Design notes.**
- `directions[]` are **abstract**, so the same script renders to ElevenLabs v3 audio tags or SSML (§4.1).
- `emphasis` uses **character offsets** rather than inline markup, so text stays clean for linting, diffing and slop scoring — you can run the slop scorer directly on `text` fields without stripping tags.
- `{{slot}}` tokens are the **only** injection point for user data, and every slot is typed, length-bounded and validated. No free text ever reaches a prompt template unspotlit (§6).
- `spine_id` is what makes combinatorial rendering cheap: variants share a spine and differ only in `variant`/`cast`/`slots`.

### 4.4 Combinatorial variants without cost explosion

The naive approach — regenerate per combination — multiplies out fast. POV (3) × intensity (3) × voice (4) × term-of-address (4) = **144 renders per story**. At $0.12/episode that's still only $17, but the *quality* cost is worse than the money: 144 independently generated variants means 144 chances to produce a bad one, and no consistency.

Instead, classify each axis by whether it actually requires new *language*:

| Axis | Requires new prose? | Mechanism | Marginal LLM cost |
|---|---|---|---|
| **Listener name / term of address** | No | Template slot substitution at playtime | **$0** |
| **Voice casting** | No | `voice_slot` remap; re-render audio only | **$0** (TTS cost only) |
| **Locale spelling/idiom** | Barely | Deterministic lexicon map + tiny LLM pass on flagged lines only | ~$0.005 |
| **POV** (2nd→1st person) | Partially — pronouns are mechanical, but *intimacy distance* changes | Deterministic pronoun transform, then LLM revision **only on lines the transform flags** | ~$0.02 |
| **Intensity tier** | **Yes — genuinely different prose** | Generate tiers 1–3 **at authoring time** from the same approved spine | ~$0.04 per extra tier |

So: **generate the spine once, generate 2–3 intensity tiers at authoring time, and treat everything else as deterministic render-time transformation.** Effective cost per story for a full variant matrix lands around **$0.20–0.25**, versus ~$17 for naive regeneration, with far better consistency because every variant traces to one human-approved spine.

Cache key: `hash(spine_id, variant{pov,intensity,locale}, cast_voice_slots, schema_version)`. Slot values are excluded from the key — they're substituted after cache retrieval, so one cached render serves every user name.

---

## 5. Personalization architecture

| # | Architecture | Cost | Latency | Quality | Moderation risk | App Store risk | Caching |
|---|---|---|---|---|---|---|---|
| **a** | **Fully pre-generated library** | Lowest; fixed one-time | Zero (CDN) | **Highest** — every episode human-approved | **Lowest** — nothing user-driven reaches a model | **Lowest** — reviewable fixed catalogue | Trivial; static assets |
| **b** | **Pre-generated combinatorial variants, assembled at playtime** | Low (§4.4) | Near-zero; slot substitution is local | **High** — variants derive from approved spines | **Low** — allow-list slots only | **Low** | Excellent; spine+variant keys |
| **c** | **Server-side on-demand generation, no human in loop** | Moderate; $0.12–0.40/script + TTS | **Minutes** (script + audio synthesis) | Variable — no human gate | **High** — free text into a generative pipeline | **High** — unreviewable UGC-like surface | Poor unless requests collapse to templates |
| **d** | **Real-time streaming conversational audio** | **Highest** — $2.58–$18.24 per DAU/month | Sub-second required | Shallow (short-turn), no narrative arc | **Highest** — live, unbounded | **Highest** | None |

Cost anchors for (c)/(d) from [Inworld's unit-economics analysis](https://inworld.ai/resources/unit-economics-of-consumer-ai-apps) (dated 7 Jul 2026 list prices, 20 active days/mo): text chat **$0.09/DAU/mo** on Gemma 4 26B vs **$7.50** on gpt-5.5 — an 81× spread from model choice alone. Voice: **$2.58/DAU/mo** cascaded vs **$18.24** on `gpt-realtime-2.1`.

### 5.1 What the companion-app market teaches

The economics are brutal and well documented. Premium companion pricing has converged into a narrow band **below a ~$20/month psychological ceiling** (Replika $19.99, Nomi $12.99–15.99, Character.AI+ $9.99, SpicyChat $9.99, Kindroid $9.99–14.99; average ~$12–13). Meanwhile compute scales with engagement:

- *"A user retained for 6 months can cost 10–50× more per message than a new user — while paying the same monthly fee."*
- One operator's published teardown: v1 at 30 msgs/day left **~11% gross margin** — "barely viable at average usage, unprofitable for power users." Fixes that took it above 50%: kill image generation, move memory tasks from a Pro to a Flash model, add context caching.
- On voice specifically: *"At Hume's current per-minute pricing, even modest daily voice usage (10 minutes/day) costs more per month than the entire subscription price. **Voice cannot be bundled into Pro.**"*
- A Character.AI analysis estimates platform token cost ≈ subscription revenue at ~1% pay rate — gross margin near zero.

**This is the strongest argument for our architecture.** A pre-generated audio library has the inverse cost structure to a companion app: cost is **fixed per title**, revenue **scales with subscribers**, and marginal cost per additional listen is CDN bandwidth. Retention *improves* margin instead of destroying it. We should be deliberate about not accidentally rebuilding a companion app's cost curve.

### 5.2 Recommended path

**Phase 1 — (a) then (b).** Launch a fully pre-generated, human-approved library. Add combinatorial variants (name, term of address, POV, intensity, voice) once the schema is stable. This delivers most of the *felt* personalization — hearing your own name, choosing your POV and heat level — at near-zero marginal cost and near-zero moderation risk.

**Phase 2 — (c), tightly bounded.** If free-text fantasy input is validated as a real driver, implement it as **"request a story," not "generate a story":**
1. User's free text is **classified and mapped onto the existing allow-listed taxonomy** (tropes, roles, settings) — the free text itself **never** enters a generation prompt.
2. If the mapped request matches an existing spine + variant, serve from cache instantly. This will hit often; fantasy requests cluster hard.
3. If not, it enters an **asynchronous** queue ("your story will be ready shortly") with the full safety gate and, initially, human review before first play. Async is what makes moderation affordable and turns a latency problem into a delight mechanic.

**Never (d).** Real-time conversational audio inverts every advantage: highest cost, highest moderation exposure, highest App Store risk, and the shallowest writing. It is a different product.

---

## 6. Moderation and safety in generation

### 6.1 The problem with off-the-shelf moderation, and the solution

The premise in the brief is right — but the situation is better than feared, because the major moderation APIs **all expose per-category signal**. We must never call the binary `flagged` field.

| Service | Granularity | Can we separate adult-consensual from child-safety? |
|---|---|---|
| **OpenAI `omni-moderation-latest`** | 13 categories with `category_scores` floats 0–1, including **`sexual` and `sexual/minors` as separate categories** | ✅ **Yes.** Read `sexual/minors`, ignore `sexual`. Note `sexual/minors` is **text-only** (no image support). **Free.** |
| **Azure AI Content Safety** | 4 categories × **0–7 severity scale** (text supports full 0–7); "annotate only" mode returns scores without blocking | ✅ Yes — use as a graded signal. **But** disabling filters or annotate-only on Azure OpenAI requires the *Limited Access Review: Modified Content Filters* approval. Standalone Content Safety is the cleaner integration. |
| **Llama Guard 4 12B** | 14 MLCommons hazard categories; **categories are excludable at inference** via `excluded_category_keys` | ✅ **Yes — and this is the cleanest fit.** `S12: Sexual Content` ("responses that contain erotica") is a *separate category* from `S3: Sex-Related Crimes` and `S4: Child Sexual Exploitation`. **Exclude S12, keep S3 + S4.** |
| **ShieldGemma** | Per-policy classification | ⚠️ Gemma-licensed. The Gemma PUP's CSAM prohibition is described as absolute "with **no** research, content-moderation, or technical-architecture exception… even for detection or filtering purposes." **Do not use ShieldGemma anywhere in this product.** |
| **Mistral Moderation API** | 9 categories including `sexual`; custom guardrails available (input only, returns 403) | ✅ Category scores usable |
| **Google Perspective** | Toxicity-oriented, weak sexual nuance | ❌ Not fit for purpose |

**The Llama Guard 4 category-exclusion mechanism is the single most useful finding in this section.** It gives us exactly the semantics we need — "erotica is fine, sex crimes and minors are never fine" — as a first-class, documented API feature rather than a threshold hack.

Sources: [OpenAI moderation reference](https://developers.openai.com/api/reference/resources/moderations/), [omni-moderation announcement](https://openai.com/index/upgrading-the-moderation-api-with-our-new-multimodal-moderation-model/), [Azure harm categories](https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/ai-services/content-safety/concepts/harm-categories.md), [Llama Guard 4 model card](https://huggingface.co/meta-llama/Llama-Guard-4-12B), [HF Llama Guard 4 guide](https://huggingface.co/blog/llama-guard-4), [Mistral moderation docs](https://docs.mistral.ai/studio-api/safety-moderation).

### 6.2 Non-negotiable prohibitions

Absolute, no exceptions, enforced at multiple layers: **no minors or minor-coded characters** · **no bestiality** · **no real, identifiable people** · **no incest framing** · **no non-consent presented approvingly** · **nothing illegal in any distribution market**.

Note these are also the union of what *every* provider we might use prohibits, so compliance here is simultaneously a legal, ethical and contractual requirement.

### 6.3 Recommended multi-layer defence

Architecture principle: **allow-list at the input, block-list at the output.** Input control is where you get guarantees; output classification is where you catch what you missed.

```
┌─ LAYER 0 · TAXONOMY (design-time, allow-list) ────────────────────────────┐
│ Closed vocabularies for trope, role, setting, intensity. Every character   │
│ carries an explicit adult age (>=25) and an occupation implying adulthood. │
│ No generation request can be constructed outside the taxonomy.            │
├─ LAYER 1 · INPUT (allow-list + spotlighting) ─────────────────────────────┤
│ Free text NEVER enters a generation prompt. It is classified into Layer-0  │
│ taxonomy by a constrained classifier. Slot values are typed, length-capped │
│ and charset-validated. Any text that must be shown to a model is           │
│ spotlit via DATAMARKING with a PER-REQUEST RANDOM token (§6.4).            │
├─ LAYER 2 · GENERATION-TIME CONSTRAINTS ──────────────────────────────────┤
│ System prompt asserts adult-only cast and the explicitness ceiling.        │
│ Cast ages injected structurally, not as prose the model may reinterpret.   │
├─ LAYER 3 · DETERMINISTIC LINT (cheap, runs first) ───────────────────────┤
│ Regex/lexicon scan: minor-coded lexicon (schoolgirl, teen, barely legal,   │
│ daddy's little, etc. — with an allow-list for false friends), kinship      │
│ terms in sexual proximity, animal terms in sexual proximity, real-person   │
│ name gazetteer (celebrities/politicians), illegal-act lexicon.             │
│ Also: slop lint, EQ-Bench degradation check, explicitness-ceiling check.   │
├─ LAYER 4 · CLASSIFIER ENSEMBLE (nuanced, category-level) ────────────────┤
│ Llama Guard 4 with excluded_category_keys=["S12"]  → any hit = REJECT      │
│ OpenAI omni-moderation: read sexual/minors ONLY    → >1e-3 = REJECT        │
│ Azure Content Safety annotate-only: Sexual severity → >=6 = REJECT         │
│   (upper ceiling for App Store, NOT a general sexual-content block)        │
│ Purpose-built age-of-character LLM judge on the cast block                 │
├─ LAYER 5 · HUMAN REVIEW ─────────────────────────────────────────────────┤
│ 100% of pre-generated library. Sampled + all-flagged for on-demand.        │
├─ LAYER 6 · RUNTIME & AUDIT ──────────────────────────────────────────────┤
│ Age gate at app level. Immutable audit log of prompt/model/scores/         │
│ approver per published asset. Kill-switch by story_id, spine_id, tag.      │
│ Re-run gates on classifier upgrade (retro-scan the catalogue).             │
└───────────────────────────────────────────────────────────────────────────┘
```

**On age-of-character detection**, which is the hardest sub-problem: there is no reliable classifier for "is this character a minor," because the signal is often stylistic (diction, described body, power dynamic, school setting) rather than lexical. The mitigation is architectural rather than detective: **make it structurally impossible to request.** Ages are set in Layer 0, injected structurally in Layer 2, and any minor-coded lexicon in Layer 3 rejects the whole draft rather than editing it. Detection is the backstop, not the control.

### 6.4 Prompt-injection defence

Even with allow-listed inputs, any free-text surface is an injection surface. The 2026 evidence is sobering:

> *"Every model-reliant defence (security directives, delimiters, instruction hierarchy, and sandwich patterns) failed when subjected to an adaptive attacker that learns from each round… All reached near-complete or complete secret disclosure. Input sanitization, despite being model-independent, also failed because the space of possible malicious inputs is too large to cover with pattern matching alone."* — [arXiv 2604.23887](https://arxiv.org/html/2604.23887v1)

In that study, **output filtering was the only defence that stopped all leakage** under sustained adaptive attack. Microsoft's **spotlighting** cut indirect-injection success from **>50% to <2%**, with the recommendation to use at least **datamarking** (interleave a marker such as **U+E000** through the untrusted text) over mere delimiting, because *"delimiter-based boundaries can be trivially subverted by an adversary who knows the system prompt,"* and the paper *"explicitly assumes the system prompt will leak"* — hence **randomise the marking token per invocation**.

Our posture, in priority order:
1. **Don't accept the input at all** — allow-list mapping means the attack surface is a *classification* target, not a generation prompt. This is the real defence.
2. **Datamark with a per-request random token** wherever untrusted text must be seen by a model.
3. **Output-side gating is the guarantee** (Layers 3–4). It is deterministic-first and does not care how the bad content got there.
4. Least privilege: the generation pipeline has no tools, no retrieval, no network, no user PII beyond a validated first name.
5. Note xAI's AUP separately prohibits "Jailbreaking, adversarial prompting, or prompt injection" — so our own red-teaming must run against self-hosted weights, not a vendor API.

---

## 7. Cost model: 200 finished 15-minute episodes

### 7.1 Assumptions

| Parameter | Value | Basis |
|---|---|---|
| Spoken words per episode | **1,800** | 15 min at ~120 wpm — slow, breathy intimate delivery with pauses |
| Final script tokens | ~2,430 | 1.35 tokens/word incl. markup and JSON overhead |
| Retry / rejection multiplier | **1.4×** | Failed safety gates, slop-lint rejections, judge rejections |
| Human editing | 0.75–1.5 h/episode @ $45–55/h | Skilled genre editor doing line edit + performance-cue pass + final read |
| TTS / audio | **excluded** | Separate research track |

### 7.2 Per-episode token budget

| Stage | Input tok | Output tok |
|---|---|---|
| 1 Brief / premise expansion | 3,000 | 600 |
| 2 Outline + beat sheet | 4,000 | 1,800 |
| 3 Beat-by-beat draft (6 calls, rolling context) | 24,000 | 4,200 |
| 4 Critique (separate model family) | 9,000 | 1,600 |
| 5 Targeted revision | 11,000 | 4,200 |
| 6 Slop lint + line fixes | 9,000 | 1,600 |
| 7 TTS markup + JSON structuring | 9,000 | 4,200 |
| 8 Safety / QC classification | 9,000 | 300 |
| **Subtotal** | **78,000** | **18,500** |
| **× 1.4 retries** | **109,200** | **25,900** |

### 7.3 LLM cost by model

| Model | $/episode | × 200 |
|---|---|---|
| MiniMax M3 | $0.064 | $12.77 |
| DeepSeek V4 Pro (3rd-party host) | $0.070 | $14.01 |
| **Mistral Large 3 — recommended primary** | **$0.093** | **$18.69** |
| GLM 5.2 | $0.120 | $24.02 |
| **Recommended mixed stack** (72% draft on Mistral Large 3 / 28% critique+QC on Grok 4.3) | **$0.124** | **$24.73** |
| Grok 4.3 (all stages) | $0.201 | $40.25 |
| Kimi K2.6 | $0.207 | $41.47 |
| Grok 4.6 | $0.374 | $74.76 |
| Kimi K3 | $0.716 | $143.22 |
| *[ref, prohibited] Claude Opus 5* | *$1.194* | *$238.70* |
| *[ref, prohibited] GPT-5.6 Sol* | *$1.323* | *$264.60* |

### 7.4 Fully loaded cost

| Line item | Per episode | 200 episodes |
|---|---|---|
| LLM generation (recommended mixed stack) | **$0.12** | **$25** |
| Human editing @ 1.0 h × $50 | **$50.00** | **$10,000** |
| — low case (0.75 h × $45) | $33.75 | $6,750 |
| — high case (1.5 h × $55) | $82.50 | $16,500 |
| QC / safety review (~10 min) | ~$8 | ~$1,600 |
| **Recurring subtotal** | **~$58** | **~$11,600** |
| One-time: commissioned style exemplars (16 × 2,000 w @ $0.40/w) | — | **$12,800** |
| — low case (12 × 2,000 w @ $0.30) | — | $7,200 |
| — high case (20 × 2,500 w @ $0.50) | — | $25,000 |
| Pipeline engineering + eval harness (one-time) | — | $15,000–40,000 |
| **All-in for a 200-episode v1 library** | **~$122–190/episode** | **~$24,000–38,000** (excl. TTS/audio) |

### 7.5 The one number to remember

**LLM inference is ~0.2% of the cost of a finished episode.** $0.12 of tokens versus ~$58 of human time.

Every optimisation instinct should follow from that. Do not choose a cheaper model to save money — choose the model that **minimises human editing time**, because a model that cuts editing from 1.5 h to 0.75 h saves **$49/episode**, which is *400× the entire LLM bill*. On that arithmetic, spending 6× more on Kimi K3 ($0.72 vs $0.12) is trivially worth it if it removes even 45 seconds of editorial work per episode.

This also means the highest-ROI engineering investment is not the generator — it's **the eval harness and the linter**, because those are what reduce human review time. Build the slop scorer, the EQ-Bench rubric judge, and the deterministic lint suite before optimising prompts.

---

## Appendix A — Banned slop phrases: starter list

Two-tier design, per §3.3: this list lives in the **linter**, not the prompt (prompt-level banlists trigger the "pink elephant" backfire effect).

### A.1 Tier 1 — auto-reject the draft (genre-fatal)

These are the specific clichés that define bad AI erotica. Any occurrence fails the draft.

```
shivers down her spine · shiver down his spine · shivers up · sent a shiver
barely above a whisper · barely a whisper · voice barely above
her breath hitched · his breath hitched · breath caught in her throat
heart hammered · heart hammered against her ribs · heart pounded in her chest
eyes never leaving · eyes locked onto · eyes darkened with desire
little did she know · little did he know
core · her core · aching core · heat pooling · heat pooled in her belly
molten · liquid heat · liquid fire · trails of fire
ministrations · his ministrations
bucking · writhing beneath · arched into his touch
sinful · deliciously · exquisite torture · sweet agony
throbbing member · velvet heat · impossibly hard
electric · like an electric shock · jolt of electricity
world narrowed to · world fell away · nothing else existed
claimed her mouth · devoured her mouth · crashed his lips
tapestry · a tapestry of · symphony · a symphony of · orchestra of
testament to · a testament to · dance of · kaleidoscope
```

### A.2 Tier 2 — cluster-reject (≥3 in one beat, or ≥2 in one line)

```
flickered · thrummed · rasped · glinted · twinkled · shimmered · gleaming
palpable · husky · sultry · smoldering · velvety · silken
whimpered · moaned softly · gasped softly · panted
delve · myriad · plethora · realm · landscape (metaphorical) · labyrinthine
ethereal · gossamer · enigma · enigmatic · intoxicating
stammered · murmured · breathed (as dialogue tag) · purred
unspoken · charged silence · pregnant pause
newfound · unwavering · undeniable · unmistakable
practiced ease · reckless abandon · despite herself · torn between
```

### A.3 Tier 3 — structural patterns (regex)

```
"not just X, but Y"      → /\bnot (just|only|merely)\b[^.]{2,60}\bbut\b/i   (the #1 LLM tell)
"It wasn't X. It was Y." → /\bIt wasn'?t [^.]{2,40}\. It was\b/i
em-dash density         → >2 per 200 words
sentence-length CV      → coefficient of variation <0.35 = too uniform (low burstiness)
single-sentence-para    → >25% of paragraphs ≤5 words (EQ-Bench degradation signal)
tricolon addiction      → 3+ consecutive parallel clauses, or list-of-exactly-three
dialogue-tag adverbs    → /\b(said|whispered|murmured) \w+ly\b/  >1 per beat
trailing reassurance    → /(for now|and) that was enough\b/i
```

### A.4 Banned character names (LLM default-name attractors)

`Elara` (85,513× over-represented), `Elias`, `Elianore`, `Aria`, `Lyra`, `Kael`, `Eira`, `Seraphina`, `Isolde`, `Anya`, `Jaxon`, `Amara`, `Amira`, `Aisha`, `Lila`, `Maya`, `Sarah`, `Marianne`. Also banned place-names: `Eldoria`, `Ravenswood`, `Oakhaven`, `Whisperwood`, `Moonwhisper`, `Zephyria`, `Greenhaven`, `Maplewood`.

### A.5 Sourcing and maintenance

Seed from [`antislop-sampler/slop_phrase_prob_adjustments.json`](https://github.com/sam-paech/antislop-sampler) (~450 entries with weights — retrieved and reviewed for this document), the [NousResearch autonovel ANTI-SLOP.md](https://github.com/NousResearch/autonovel/blob/master/ANTI-SLOP.md) tiered tables, and [slop-forensics](https://github.com/sam-paech/slop-forensics).

**Critically: general-purpose lists are only a starting point.** The antislop authors say so themselves: *"It's recommended that you roll your own slop list! The `slop_phrase_prob_adjustments.json` file is mostly auto-generated… not well optimised or curated."* And most public lists target essay/assistant slop (`furthermore`, `in conclusion`, `it's worth noting`) rather than *erotic-narrative* slop.

So: run `slop-forensics` on **our own** model's output against a human baseline built from our **commissioned exemplars**, quarterly. Our house slop profile is model-specific and genre-specific, and it will drift every time we change models. Automate it and track `slop_score` per episode in `provenance` (§4.3) so regressions are visible in CI.

---

## Appendix B — Open questions for legal / next steps

1. **Gemma 4's Apache 2.0 relicensing** — does it truly detach the Prohibited Use Policy from the weights? Highest-value licence question; unlocks the strongest willingness-tuned models.
2. **Apple's explicitness line in practice.** Our reading (§0.1) is that "erotic or sensual dialog / implied sexual activity" is 18+-publishable and "explicit, detailed depictions" is not. Worth validating with a small test submission before producing 200 episodes to a spec that gets rejected.
3. **Written confirmation from DeepInfra and Groq** that lawful adult narrative content is permitted, given both policies are silent/qualified rather than affirmatively permissive.
4. **Qwen/Alibaba, Nebius, Hyperbolic, Arli, Infermatic policies** — unretrieved this pass; verify before any dependency.
5. **OpenAI's current API reality** — my primary-source fetch was blocked; confirm before assuming the door stays closed (an OpenAI adult-content API would change the quality ceiling).
6. **Exemplar commissioning contract** — work-for-hire with full assignment *including* AI-training and derivative rights, given Bartz left output-side claims live.

---

## Sources

**Provider policies**
- Anthropic Usage Policy — https://www.anthropic.com/legal/aup
- OpenAI Usage Policies — https://openai.com/policies/usage-policies/ *(fetch blocked; secondary reporting used)*
- Google Generative AI Prohibited Use Policy — https://policies.google.com/terms/generative-ai/use-policy
- Vertex AI safety filters — https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-filters
- xAI Acceptable Use Policy — https://x.ai/legal/acceptable-use-policy
- Mistral Usage Policy — https://legal.mistral.ai/terms/usage-policy
- Mistral open-model licences — https://help.mistral.ai/en/articles/347393-under-which-license-are-mistral-s-open-models-available
- Mistral 3 launch — https://mistral.ai/news/mistral-3/ · Mistral Large 2 — https://mistral.ai/news/mistral-large-2407/
- Llama 4 AUP — https://developer.meta.com/ai/llama4/use-policy/ · Licence — https://www.llama.com/llama4/license/
- DeepSeek Terms of Use — https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html
- Cohere Usage Policy — https://docs.cohere.com/docs/usage-policy · Cohere Labs AUP — https://docs.cohere.com/docs/cohere-labs-acceptable-use-policy
- AI21 Acceptable Use — https://www.ai21.com/terms-policies/acceptable-use/ · https://docs.ai21.com/docs/responsible-use-1
- Gemma Prohibited Use Policy — https://ai.google.dev/gemma/prohibited_use_policy · Gemma Terms — https://ai.google.dev/gemma/terms
- Gemma licence analysis — https://vorplabs.com/models/gemma-license · https://wcr.legal/google-gemma-license-risks/

**Hosts / aggregators**
- OpenRouter models API (live pricing source) — https://openrouter.ai/api/v1/models · docs https://openrouter.ai/docs/api/api-reference/models/get-models.mdx
- OpenRouter routing — https://openrouter.ai/blog/insights/model-routing/ · SillyTavern guide — https://openrouter.ai/blog/tutorials/sillytavern-openrouter/
- Together AI ToS — https://www.together.ai/terms-of-service
- DeepInfra ToS — https://deepinfra.com/terms
- Novita ToS — https://novita.ai/de/legal/terms-of-service
- Groq AUP — https://console.groq.com/docs/legal/ai-policy
- Featherless ToS — https://featherless.ai/terms · Plans — https://featherless.ai/docs/plans
- Stability AI AUP — https://stability.ai/use-policy
- RunPod NSFW analysis — https://cling-ai.com/blog/runpod-nsfw-policy-adult-content-allowed-2026

**Benchmarks / model quality**
- EQ-Bench about — https://eqbench.com/about.html · Creative Writing v3 — https://eqbench.com/creative_writing.html
- EQ-Bench Longform — https://eqbench.com/creative_writing_longform.html · repo https://github.com/EQ-bench/longform-writing-bench
- EQ-Bench Slop Score — https://eqbench.com/slop-score.html · Creative-writing bench repo — https://github.com/EQ-bench/creative-writing-bench
- OpenUGI — https://openugi.com/ · UGI Leaderboard — https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard · https://llmindex.net/ugi-leaderboard
- Chaiverse — https://console.chaiverse.com/ · https://github.com/chai-research/chaiverse

**Prose quality / anti-slop**
- *Antislop* (arXiv 2510.15061) — https://arxiv.org/pdf/2510.15061 · code https://github.com/sam-paech/auto-antislop
- antislop-sampler + phrase list — https://github.com/sam-paech/antislop-sampler
- slop-forensics — https://github.com/sam-paech/slop-forensics
- NousResearch ANTI-SLOP.md — https://github.com/NousResearch/autonovel/blob/master/ANTI-SLOP.md
- *Measuring AI "Slop" in Text* — https://arxiv.org/html/2509.19163v1

**Long-form pipeline practice**
- Pratilipi, *Beyond the Context Window* — https://medium.com/team-pratilipi/beyond-the-context-window-architecting-long-form-story-generation-8f3a3350255f
- ludLLM — https://github.com/devsandip/ludLLM
- Novel-OS — https://github.com/mrigankad/Novel-OS
- *How I wrote The Unseen Alliance with Claude* — https://daveisbest.org/writing/unseen-alliance

**TTS markup**
- ElevenLabs v3 audio tags — https://elevenlabs.io/blog/v3-audiotags · delivery control https://elevenlabs.io/blog/eleven-v3-audio-tags-precision-delivery-control-for-ai-speech
- TTS best practices / prompting v3 — https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices
- Text to Dialogue — https://elevenlabs.io/docs/overview/capabilities/text-to-dialogue
- Audio tags FAQ — https://help.elevenlabs.io/hc/en-us/articles/35869142561297-How-do-audio-tags-work-with-Eleven-v3

**Moderation**
- OpenAI Moderations reference — https://developers.openai.com/api/reference/resources/moderations/ · omni-moderation — https://openai.com/index/upgrading-the-moderation-api-with-our-new-multimodal-moderation-model/
- Azure harm categories — https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/ai-services/content-safety/concepts/harm-categories.md · severity levels — https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-severity-levels
- Llama Guard 4 — https://huggingface.co/meta-llama/Llama-Guard-4-12B · https://huggingface.co/blog/llama-guard-4 · https://developer.meta.com/ai/docs/model-cards-and-prompt-formats/llama-guard-4/
- Mistral moderation — https://docs.mistral.ai/studio-api/safety-moderation

**Prompt injection**
- *Evaluation of Prompt Injection Defenses* — https://arxiv.org/html/2604.23887v1
- Spotlighting (arXiv 2403.14720) — https://doi.org/10.48550/arxiv.2403.14720
- Microsoft MSRC on indirect injection — https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks
- Spotlighting implementation notes — https://docs.llmtrace.io/research/spotlighting-indirect-injection-defence/

**Copyright**
- Authors Guild, final approval of Anthropic settlement (20 Jul 2026) — https://authorsguild.org/news/court-grants-final-approval-anthropic-copyright-settlement/
- Final approval order — https://www.courthousenews.com/wp-content/uploads/2026/07/order-anthropic-authors.pdf
- Alsup fair-use order (23 Jun 2025) — https://cases.justia.com/federal/district-courts/california/candce/3:2024cv05417/434709/231/0.pdf
- Jackson Walker analysis of Bartz & Kadrey — https://www.jw.com/news/insights-kadrey-meta-bartz-anthropic-ai-copyright/
- AI Policy Desk summary — https://www.aipolicydesk.com/blog/ai-training-data-copyright-fair-use-ruling-2026

**App Store**
- App Review Guidelines — https://developer.apple.com/app-store/review/guidelines/
- Age ratings values and definitions — https://developer.apple.com/help/app-store-connect/reference/age-ratings

**Economics**
- Inworld, *Unit Economics of Consumer AI Apps 2026* — https://inworld.ai/resources/unit-economics-of-consumer-ai-apps
- *Why AI Companion App ARPU Hits a Wall* — https://lizlis.ai/blog/why-ai-companion-app-arpu-hits-a-wall-while-costs-keep-rising-2026/
- *The Economics of Emotional AI* — https://blog.ax0x.ai/mio-v2-economics
- AI companion pricing guide 2026 — https://aicompanionguides.com/blog/ai-companion-pricing-guide-2026/
- Concurrency-aware inference cost (arXiv 2606.11690) — https://arxiv.org/html/2606.11690v1
- DigitalOcean batch-size sweep — https://www.digitalocean.com/community/tutorials/llm-inference-cost
- packet.ai inference cost — https://packet.ai/blog/llm-inference-cost
