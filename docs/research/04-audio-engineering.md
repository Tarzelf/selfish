# Audio Engineering for High-Fidelity ASMR / Intimate Narration

Research for an automated, deterministic post-production pipeline that turns dry mono TTS
into audio that feels like someone is speaking inches from the listener's ear.

Status: research complete, August 2026. Nothing here is committed to the product yet.

**A note on provenance.** Claims in this document are either (a) cited to a source in the
[Sources](#sources) section, or (b) marked **[measured]**, meaning I verified them
empirically in this environment with ffmpeg 6.1.1 / NumPy / SciPy during the research pass.
Where practitioner consensus and the academic literature disagree, I say so rather than
picking the convenient answer.

---

## 0. Executive summary

Seven things matter more than everything else combined:

1. **The "ASMR = bright sibilant highs" assumption is wrong.** The acoustic literature
   points the other way: tingles correlate with *lower* spectral centroid (dark timbre,
   centroid < 1.5 kHz) and with *lower* amplitude around 5 kHz. Do not build a chain that
   hypes 4–16 kHz. See [§1](#1-the-science-and-craft-of-asmr-audio).
2. **The single most important spatial cue is large low-frequency ILD**, which only occurs
   when a source is within ~50 cm of the head. Standard far-field HRTFs cannot produce it.
   You must add it explicitly. This is the whole ballgame for "inches from your ear."
   See [§2](#2-binaural-and-spatial-audio).
3. **Binaural in post is realistic and cheap.** ffmpeg ships `sofalizer` (libmysofa-backed
   SOFA convolution). A full near-field binaural render is a single deterministic ffmpeg
   invocation. **[measured]**
4. **Loudness: target −22 to −24 LUFS integrated, not −16.** At −20 and below you are
   forced into limiting that measurably eats dynamic range. **[measured]**
5. **iOS does not normalize third-party app audio.** Sound Check is Apple Music only. What
   you ship is what plays. This is a responsibility, not a freedom.
6. **Encode AAC-LC 192 kbps in M4A.** Opus is technically better at half the bitrate
   **[measured]** but its iOS container story is a mess. HE-AAC is disqualified.
7. **The audio player needs native Swift.** Expo can do single-stream background playback
   fine, but the layered voice + ambience + fades architecture wants `AVAudioEngine`.

---

## 1. The science and craft of ASMR audio

### 1.1 What the research actually says

There are four studies worth designing against.

**Barratt & Davis (2015), PeerJ** — the foundational survey (N=475). Established the
trigger taxonomy. Whispering (75%), personal attention (69%), crisp sounds (64%), slow
movements (53%). Non-triggers scored under 3%. 81% of respondents engage with ASMR media
immediately before sleep. *Design implication: whispering and simulated personal attention
are the load-bearing triggers; sleep is the dominant use context.*

**Barratt, Spence & Davis (2017), PeerJ** — sensory determinants (N=130). Two findings
matter to us:

- **Lower-pitched triggers are strongly preferred.** 56% agreed lower pitch produced more
  intense tingles; only 12% said higher pitch did (56% actively disagreed).
- **Background music inhibits ASMR for many respondents.** This is a direct product
  constraint: do not put a musical bed under intimate narration by default.

**Poerio et al. (2018), PLOS ONE** — the physiology paper. ASMR is real and measurable:
reduced heart rate (−3.41 bpm, d=0.39) *and* increased skin conductance (+0.30 µS) in
experiencers only. That combination — calming and activating at once — distinguishes ASMR
from aesthetic chills (which raise heart rate). *Design implication: we are aiming for
"relaxed but engaged," not sedation.*

**Terashima, Tada & Kondo (2024), Phil. Trans. R. Soc. B** — the most directly actionable
paper. L1-regularized regression on sound-texture statistics predicted tingling at r=0.52.
The dominant predictor: **the envelope of frequencies near 5 kHz in the window 1500–750 ms
*before* the reported tingle, where *lower* amplitude around 5 kHz predicted *stronger*
tingling.** Pleasantness was much harder to predict (r=0.26) and used a time window ~3×
longer — pleasantness and tingling are driven by different acoustics.

**Honda / Kondo et al. (bioRxiv 2019, "Deep, soft, and dark sounds induce ASMR")** — the
paper that most changes our spatial design:

- ASMR ratings correlated *negatively* with average spectral centroid (r=−0.48) and
  bandwidth (r=−0.34). Centroid **below 1.5 kHz** characterized the effective stimuli.
- ASMR correlated *positively* with **interaural differences** in amplitude
  (r=0.28), centroid (r=0.25) and bandwidth (r=0.24).
- The authors' interpretation is the key sentence for this whole project: the
  Diff-amplitude term *is* interaural level difference, so "the ASMR is elicited when
  listeners perceive sound sources **near their ears**," citing Brungart & Rabinowitz
  (1999) — near-field sources produce large ILDs even at low frequencies.
- Peak response lagged acoustic change by ~1.8–2.2 s, and *changes* in features drove the
  response more than static values. Interaural (Diff) features acted faster (1.78 s) than
  average (Ave) features (2.22 s).
- Binaural listening produces longer ASMR than diotic (Liao et al. 2017); moving sources
  beat static ones (Honda et al. 2019).

### 1.2 The frequency-content question, answered directly

The brief asked: *"which bands matter — is it 4–16 kHz sibilance/high frequency detail?"*

**No, and the evidence is fairly consistent about it.** Three independent lines point away
from high-frequency hype:

| Evidence | Direction |
|---|---|
| Barratt 2017 survey: lower pitch preferred 56% vs 12% | away from HF |
| Kondo 2019: centroid < 1.5 kHz, negative correlation with centroid | away from HF |
| Terashima 2024: *lower* 5 kHz envelope amplitude predicts stronger tingling | away from HF |

What high frequencies *do* provide is **detail and proximity realism** — the perception
that you are hearing micro-texture only audible up close. That is a different job from
triggering, and it needs far less boost than intuition suggests. The practical resolution:

- Preserve HF **bandwidth** (don't band-limit; don't over-denoise; don't cheap out on the codec).
- Do **not** boost 4–8 kHz. If anything, keep it slightly restrained.
- A very gentle shelf at 9–12 kHz (+1 to +1.5 dB max) buys "air" without raising the 5 kHz
  region the Terashima model says to keep low.
- Get the *warmth* from low-mid energy and proximity effect, which is also what the
  low-centroid finding demands.

This is a genuinely counter-intuitive result and it is the main reason to read the papers
rather than the tutorials. Most ASMR mixing tutorials recommend a presence/air boost; the
academic acoustics point the opposite way.

### 1.3 Pacing, pauses and delivery

- The ~2 s lag between acoustic change and peak tingling means **triggers need ~2–4 s of
  space around them**. Rapid-fire trigger stacking prevents the response from developing.
- *Changes* drive response more than steady states — favour slow evolution and gentle
  movement over a static image.
- Slow speech rate and long pauses are near-universal practitioner consensus and are
  consistent with the "slow movements" trigger from Barratt & Davis.
- Breath is signal, not noise. Removing breaths removes the personal-attention cue.

### 1.4 Microphone technique (context for what we are synthesizing)

We are not recording, but understanding what real ASMR mics do tells us what to emulate.

| Mic | Why it is used | What it teaches us |
|---|---|---|
| **3Dio Free Space** (~$499) | Silicone pinnae on a bar, capsules in the ear canals; most popular ASMR binaural mic | Pinna filtering + ~17 cm spacing is what makes it work; notably its capsules *roll off above 10 kHz*, which is celebrated as avoiding harshness — consistent with §1.2 |
| **Neumann KU 100** (~$8k) | Full dummy head with torso-less anatomically accurate head | The professional HRTF benchmark; head shadowing is the point |
| **Rode NT1 / Blue Yeti** | Cheap large-diaphragm cardioids at 2–4 in | Deliver intimacy purely via **proximity effect** (bass lift from a directional mic close up), no spatial cue at all |

Two numbers to carry into the renderer:

- **Interaural spacing ≈ 17.2 cm (±1.1 cm)**; the workable range is 16–18 cm. Too narrow
  and the image collapses inward, too wide and separation is unnatural.
- Omnidirectional condenser capsules are used deliberately so that *the head and pinnae*
  do the spatial filtering, not the polar pattern. Our HRTF convolution is the digital
  equivalent of exactly this.

Critically: **a Yeti at 3 inches gives proximity but no localization; a 3Dio gives
localization but only the proximity the performer physically creates.** Our pipeline can
and should synthesize both independently. That is the advantage of doing it in post.

---

## 2. Binaural and spatial audio

### 2.1 The near-field problem (the most important section in this document)

Almost every public HRTF database is measured at **1.0–2.0 m**. ASMR needs **10–30 cm**.
These are not the same acoustics, and the difference is not a detail.

From Brungart & Rabinowitz (1999, JASA 106(3)) and Duda & Martens (1998, JASA 104(5)):

- **ILD increases substantially below 1 m, including at low frequencies where far-field
  ILD is essentially zero.**
- **ITD is roughly independent of distance** — it barely changes as a source approaches.
  (Duda & Martens: range changes ITD by at most ~26%, ≈146 µs, and humans are insensitive
  to delays above ~700 µs, so ITD carries little range information.)
- The HRTF only becomes range-sensitive when ρ = range/head-radius < 5, i.e. inside ~44 cm
  for an 8.75 cm head.
- Pinna contribution is distance-independent beyond a few centimetres from the ear.

So the near-field cue is, almost entirely, **a big low-frequency ILD**. That is a
remarkably tractable thing to synthesize.

**I measured the far-field baseline** to confirm the gap. Rendering pink noise through the
MIT KEMAR SOFA set with ffmpeg `sofalizer`: **[measured]**

| Azimuth | Broadband ILD | ITD | ILD 100–500 Hz | ILD 500–1.5k | ILD 1.5–4k | ILD 4–10k |
|---|---|---|---|---|---|---|
| 0° | 0.0 dB | 0 µs | 0.0 | 0.0 | 0.0 | 0.0 |
| 45° | 9.6 dB | 386 µs | 2.5 | 7.8 | 9.3 | 15.5 |
| 90° | 9.0 dB | 726 µs | 3.2 | 5.9 | 8.0 | 15.8 |

Note the low band: only **3.2 dB at 90°**. That is a source across the room. It is not
someone's mouth next to your ear, and no amount of EQ on the sum will fix it, because the
cue is a *difference between the ears*.

### 2.2 The Distance Variation Function — a concrete, implementable fix

The standard solution (Romblom & Cook 2008; Spagnol, Tavazzi & Avanzini 2017; implemented
in the Spatial Audio Framework as `saf_utility_dvf.c`) is the **Distance Variation
Function**: a per-ear filter derived from the rigid-sphere model that converts a far-field
HRTF into a near-field one. Psychophysically validated — Romblom & Cook found improved
distance perception out to 60 cm versus simple intensity scaling, with the largest gains
for lateral sources inside 40 cm.

**I implemented the Duda & Martens rigid-sphere model directly** (spherical Hankel
expansion, head radius 0.0875 m) and computed the DVF against a 1.5 m reference.
**[measured]**

Gain in dB to add to a 1.5 m far-field HRTF. θ is the angle from that ear's outward
normal, so θ=0° is the ipsilateral (near) ear and θ=180° the contralateral (shadowed) ear:

| Distance | Ear | 125 Hz | 250 Hz | 500 Hz | 1 kHz | 2 kHz | 4 kHz | 8 kHz |
|---|---|---|---|---|---|---|---|---|
| **10 cm** | ipsi (0°) | +21.7 | +21.4 | +19.9 | +18.6 | +17.6 | +17.4 | +17.4 |
| | contra (180°) | −8.8 | −8.6 | −8.2 | −9.1 | −9.6 | −11.0 | −13.6 |
| **15 cm** | ipsi | +9.6 | +9.4 | +8.2 | +7.5 | +7.0 | +6.9 | +7.0 |
| | contra | −5.7 | −5.7 | −5.8 | −6.0 | −6.4 | −7.2 | −8.5 |
| **20 cm** | ipsi | +6.2 | +6.1 | +5.2 | +4.7 | +4.4 | +4.4 | +4.4 |
| | contra | −4.3 | −4.3 | −4.3 | −4.4 | −4.7 | −5.2 | −6.1 |
| **30 cm** | ipsi | +3.5 | +3.4 | +2.8 | +2.6 | +2.4 | +2.4 | +2.4 |
| | contra | −2.7 | −2.7 | −2.7 | −2.8 | −2.9 | −3.3 | −3.8 |
| **50 cm** | ipsi | +1.7 | +1.6 | +1.3 | +1.2 | +1.1 | +1.1 | +1.1 |
| | contra | −1.4 | −1.4 | −1.4 | −1.4 | −1.5 | −1.7 | −1.9 |

Net **additional** ILD introduced (ipsi − contra):

| Distance | 125 Hz | 500 Hz | 2 kHz | 8 kHz |
|---|---|---|---|---|
| 10 cm | +30.5 | +28.0 | +27.1 | +31.0 |
| 15 cm | +15.3 | +14.0 | +13.4 | +15.5 |
| **20 cm** | **+10.5** | **+9.5** | **+9.0** | **+10.6** |
| 30 cm | +6.2 | +5.6 | +5.3 | +6.2 |
| 50 cm | +3.1 | +2.7 | +2.6 | +3.0 |

These match the published figures (Duda & Martens report low-frequency ILD exceeding
10 dB at ρ=2 and 20 dB at ρ=1.25), which is a good sanity check on the implementation.

Three practical readings of this table:

- **20 cm is the sweet spot.** ~+10 dB extra ILD is a dramatic proximity cue while the
  ipsilateral boost (+4.4 to +6.2 dB) stays gentle enough not to wreck the tonal balance.
- **At 10 cm the numbers get violent** (+21.7 dB on one ear). Technically correct,
  practically fatiguing and fragile to head-size mismatch. Treat 15 cm as the floor.
- **The curve is remarkably flat with frequency** — a fixed gain plus a very gentle shelf
  approximates it well. You do **not** need a high-order filter. A per-ear gain plus one
  shelf is within a dB of the exact model across the band.

**Verified end-to-end.** Applying HRTF (azimuth 40° right) plus 20 cm DVF shelves in
ffmpeg — ipsilateral +6.2 dB, contralateral −4.3 dB, each with a −1.8 dB shelf above
4 kHz so the high end lands at +4.4 / −6.1 dB, matching the model's slope: **[measured]**

| Band | Far-field HRTF alone | + near-field DVF | Delta | Model predicts |
|---|---|---|---|---|
| 150–800 Hz | +4.40 dB | **+14.88 dB** | **+10.48** | +10.5 |
| 800–3000 Hz | +8.40 dB | +18.88 dB | +10.48 | +9.5 |
| 3–10 kHz | +11.09 dB | +21.46 dB | +10.37 | +9.6 |

The low band goes from +4.4 dB (across the room) to +14.9 dB (at your ear), and the
measured low-band delta matches the analytic model to within 0.02 dB. That is the cue the
Kondo 2019 paper says drives the response, produced by two gain stages and two shelves.

### 2.3 HRTF databases and licensing

| Database | Distance(s) | Format | License | Commercial use |
|---|---|---|---|---|
| **SADIE II** (Univ. of York) | 1.2 m (HRIR), 1.5 m (BRIR) | SOFA, WAV 44.1/48/96k | **Apache 2.0** | **Yes, cleanly.** Best licensing of any set. Includes a KEMAR subject (D2) |
| **MIT KEMAR** (Gardner & Martin) | 1.4 m | SOFA (via sofacoustics.org) | Free for research + commercial with citation | Yes, with attribution |
| **CIPIC** (UC Davis) | 1 m | MATLAB / SOFA conversions | UC Regents grant for "any purpose — educational, research or commercial"; must retain copyright notice | Yes, with notice; written acknowledgment requested |
| **FHK / TH Köln KU100 near-field** | **0.25–1.5 m** | SOFA / miro | **CC BY-SA 4.0** | Attribution + **share-alike** — copyleft risk, see below |
| **Li KEMAR near-field** (Zenodo 7626148) | 0.20–1.10 m, **1 cm resolution** | SOFA | Check Zenodo record | Highest distance resolution available |
| **Marschall laser-spark NF** (Zenodo 7316545) | 0.2/0.3/0.4/0.5 m | SOFA | Check Zenodo record | Near-ideal monopole source |

**Recommendation: SADIE II as the primary set.** Apache 2.0 is unambiguous, it ships in
SOFA at 48 kHz, it is well-maintained, and the accompanying paper evaluates individual vs
non-individual HRTF performance. Use MIT KEMAR as a secondary/fallback.

**Caution on CC BY-SA near-field sets.** Share-alike on a *dataset* used as a filter is
legally murky — the question is whether rendered audio is a derivative work of the impulse
responses. Rather than take that risk, **synthesize the near field analytically with the
DVF** (§2.2) on top of an Apache-2.0 far-field set. The DVF is a published algorithm, not
a licensed dataset, and §2.2 shows it produces the right cue. This neatly sidesteps the
whole licensing question and it is also less data to ship.

### 2.4 Tooling for automated batch binaural

The headline finding: **ffmpeg already does this.**

```
ffmpeg -filters | grep sofalizer
  .S. sofalizer   A->A   SOFAlizer (Spatially Oriented Format for Acoustics)
```

Our ffmpeg 6.1.1 is built `--enable-libmysofa`, so SOFA HRTF convolution is a built-in
filter. **[measured, working]** There is also `headphone` (HRIR supplied as extra input
channels) and `afir` (general partitioned convolution) for custom IRs.

**Gotcha discovered during testing:** `sofalizer` outputs at the **SOFA file's** sample
rate, not the input's. MIT KEMAR is 44.1 kHz, so feeding it 48 kHz audio silently gives you
a 44.1 kHz result. This cost me a bad measurement run before I caught it — pin the rate
explicitly with `-ar` and assert on it in QC. SADIE II is available at 48 kHz, which is
another reason to prefer it.

| Tool | Language | License | Batch/offline? | Verdict for us |
|---|---|---|---|---|
| **ffmpeg `sofalizer`** | C (CLI) | LGPL/GPL (build-dependent) | Yes, native | **Primary.** Zero new dependencies, deterministic, trivially scriptable |
| **libmysofa** | C | BSD-3 | Yes | Already inside ffmpeg; direct use only if writing custom DSP |
| **Spatial Audio Framework (SAF)** | C/C++ | **ISC** core (GPLv2 only if optional modules enabled) | Yes | **Reference implementation of the DVF** (`saf_utility_dvf.c`, `calcDVFCoeffs`). Read it even if we reimplement |
| **sofar** | Python | MIT | Yes | Best for reading/inspecting/validating SOFA files in the pipeline |
| **spaudiopy** | Python | MIT | Yes | Ambisonics + binaural decoders; useful if we go Ambisonic |
| **slab** | Python | MIT | Yes (`Sound.apply_to_path`) | Convenient `HRTF.apply()`, built-in KEMAR. Note: its plain filter path does **not** preserve ITD — you must add it via `azimuth_to_itd()`. Easy footgun |
| **pysofaconventions** | Python | BSD-3 | Yes | Lower-level SOFA access |
| **SPARTA** | C++ plugins | **GPLv3** | Plugins, not batch | GPLv3 + GUI plugin format; wrong shape for a server pipeline |
| **IEM Plugin Suite** | C++ plugins | **GPLv3** | Plugins | Same objection |
| **Steam Audio** | C++ | Apache 2.0 | Real-time engine | Built for games; heavyweight for offline rendering |
| **Google Resonance Audio** | C++ | Apache 2.0 | Real-time engine | Archived upstream; same objection |
| **Anaglyph** | Plugin | Free, non-commercial-ish | No | Licensing unsuitable |

**Do not use the GPLv3 plugin suites (SPARTA, IEM) in the product.** They are excellent for
prototyping and for A/B reference, but GPLv3 in a shipped commercial pipeline is a
licensing decision nobody wants to make by accident. SAF's ISC-licensed core is the
permissive path to the same algorithms.

### 2.5 Distance cues beyond ILD

- **Air absorption is irrelevant at our distances.** ISO 9613-1 gives <0.2 dB/m at 8 kHz in
  normal conditions; the literature is explicit that spectral change from air absorption is
  undetectable below ~15 m. Do **not** model it for a 20 cm source. Any HF rolloff we apply
  is a taste decision, not physics.
- **Direct-to-reverberant ratio (DRR)** is the dominant distance cue in the 1–15 m range
  and is what makes a voice sound "in a room." For intimacy we want **very high DRR** —
  almost no reverb. See §3.8.
- **Level** is a real cue, but the Arend et al. (2016) listening tests found that with
  loudness-normalized stimuli, listeners could *not* estimate distance from binaural cues
  alone in anechoic conditions. Distance perception leaned on loudness. Practical reading:
  the ILD cue creates *lateral proximity* ("at my ear") strongly, but you still need level
  and reflection cues to fully sell absolute distance.
- **Ear-to-ear movement** is the effect ASMR listeners specifically love, and it has
  research support: moving sources beat static (Honda 2019), and interaural *changes* drive
  response with a ~1.8 s lag. Implement as a slow automated azimuth sweep. Keep it
  **slow and predictable** — practitioner consensus and vestibular-sensitivity concerns both
  warn against fast or erratic panning. A 15–30 s traverse is a sane default.

### 2.6 Mono compatibility

Large ILD is, by construction, mono-hostile: summing to mono halves the perceived level of a
hard-lateralized voice. Since our target is headphone listening this is acceptable, but the
QC pass ([§8](#8-automated-qc)) should measure the mono sum and flag if intelligibility
collapses. Do **not** use Haas-style delay widening on the voice — it is the classic trick
for width but it causes comb filtering on mono fold-down, and we already have a physically
correct spatial cue that does not need help.

---

## 3. Voice post-processing chain for intimacy

Order matters, and it is not the order most tutorials use. Rationale is given per stage.

### 3.1 Gain staging and input conditioning

TTS output is typically 24 kHz or 44.1 kHz, mono, dry, and already peak-normalized fairly
hot. First moves:

- **Resample to 48 kHz** with a high-quality resampler (`soxr`, precision 28) and work in
  32-bit float throughout. Only the final encode should quantize.
- If the TTS is 24 kHz, be honest that there is **nothing above 12 kHz**. No amount of
  exciter/"air" processing creates real detail — it synthesizes harmonics. If HF detail
  matters (and §1.2 says bandwidth does, even if boost does not), **use a 44.1/48 kHz TTS
  voice.** This is a sourcing decision, not a post decision.
- Normalize input to a consistent working level (−23 LUFS is a convenient internal anchor)
  so downstream threshold-based processors behave identically across episodes. This is what
  makes the pipeline deterministic.

### 3.2 High-pass filtering

`highpass=f=70:p=2` (2nd order, 70 Hz).

Rationale: 70–80 Hz is the standard rumble cut. Do **not** high-pass at 150–250 Hz as some
whisper tutorials suggest — that advice exists to make a voice *thin*, and thin is the
opposite of what we want. The low-centroid finding (§1.2) and the DVF's low-frequency
ipsilateral boost (§2.2) both need low-mid energy to survive. Cutting it here undoes work
we do later.

### 3.3 De-noising — and why to be conservative

**Use DeepFilterNet3.** MIT/Apache-2.0 dual-licensed, 48 kHz native, PESQ 3.5–4.0+, STOI
>0.95, real-time-capable, actively maintained through 2026. It has an `atten_lim_db`
attenuation-limit knob, which is the important feature here.

Alternatives considered: RNNoise (BSD, lighter, unmaintained since Mozilla dropped it,
weaker on non-stationary noise); Resemble Enhance (MIT); iZotope RX (excellent, commercial,
GUI-first — hard to automate deterministically); `noisereduce`/spectral gating (leaves
"musical noise" / watery artifacts — avoid).

**Why aggressive denoising kills ASMR.** Three mechanisms:

1. Denoisers are trained to maximize speech intelligibility. Breath, lip-parting, saliva
   and mouth sounds are *not* speech by that definition — they get suppressed. Those are
   precisely the personal-attention triggers.
2. Spectral-subtraction artifacts ("musical noise") sit right in the 2–8 kHz region and are
   maximally audible in quiet passages — which is most of an ASMR track.
3. A totally silent noise floor is an unnatural cue. Real intimate proximity has a floor.
   Absolute digital silence between phrases reads as "edited," not "present."

**Recommendation:** for synthetic TTS input, denoising is often *unnecessary* — TTS output
has no room tone. Run it only when the source demands it, and cap attenuation at
**≤12 dB** (`--atten-lim-db 12`) rather than letting it run open. Make this a per-asset
flag, defaulting to off.

If the TTS floor is *too* clean, consider adding a **−72 to −65 dBFS pink noise bed** to
give the ear something to sit on. Counter-intuitive but it reads as "real room, very quiet"
rather than "digital void."

### 3.4 EQ for proximity

Applied pre-spatialization, mono. Starting points:

| Move | Setting | Why |
|---|---|---|
| Low-mid warmth | `equalizer=f=180:t=q:w=1.0:g=+2.5` | Emulates proximity effect chest tone; supports the low-centroid target. Practitioner range is +2 to +4 dB at 150–200 Hz |
| **Presence cut** | `equalizer=f=3200:t=q:w=1.2:g=-2.0` | Counter-intuitive but correct. 2.5–4 kHz is "projection" — the voice reaching *out*. Intimacy is drawing *in*. Practitioner range −1 to −3 dB |
| Air (restrained) | `equalizer=f=9000:t=h:w=0.7:g=+1.5` | High shelf. Note this sits *above* the 5 kHz region Terashima 2024 says to keep low. Cap at +1.5 dB |
| Mud check | −1 to −2 dB near 350–450 Hz, only if needed | Per-voice; leave out of the default chain |

**Do not** apply the standard broadcast presence boost at 3–5 kHz. Both the academic
evidence (§1.2) and the intimacy craft literature point the same way here, which is
reassuring given how often they disagree.

### 3.5 De-essing

`deesser=i=0.35:m=0.5:f=0.25` — intensity 0.35, moderate.

- Target **5–9 kHz**; whispers can sibilate slightly lower than modal speech.
- Aim for **3–6 dB** of reduction on the worst sibilants, no more.
- Place **after** EQ and **before** compression in intent, though note the ordering debate:
  the mastering convention is EQ → compression → de-ess (because compression raises
  sibilance). With our very gentle 2:1 compression, sibilance lift is minimal, so
  de-essing before compression is fine and avoids the de-esser chasing a moving target.

**Why over-de-essing destroys tingles.** Sibilants are transient HF detail — the "crisp
sounds" category that 64% of Barratt & Davis respondents named as a trigger. A heavy-handed
de-esser turns every S into a lisp and removes exactly the micro-detail that signals
proximity. The failure mode is subtle: the track sounds "smooth" and simultaneously
completely fails to tingle. Note the tension with §1.2 — we want to *control* 5–9 kHz
peaks, not *suppress* the band.

If a specific voice sibilates badly, fix it at the TTS-voice-selection stage rather than
compensating hard in post.

### 3.6 Compression

`acompressor=threshold=-26dB:ratio=2:attack=25:release=250:makeup=1:knee=6`

| Parameter | Value | Why |
|---|---|---|
| Ratio | **2:1** | Gentle. This is a safety net, not a level-setter |
| Threshold | −26 dBFS | Catches peaks only; most of the signal passes untouched |
| Attack | **25 ms** | Slow. Lets word onsets and mouth-sound transients through intact |
| Release | 250 ms | Slow enough not to pump on the noise floor |
| Knee | 6 dB | Soft |
| Makeup | ≈+1 dB | Near-zero; final level is set in §4, not here |

**Why heavy compression is wrong here.** ASMR recordings typically run a **crest factor of
14–20 dB**, versus 8–14 dB for mastered music. That dynamic range is the *content*. Heavy
compression does three destructive things at once: flattens the micro-transients that carry
texture, raises the noise floor into audibility, and removes the loud/soft contrast that
makes a whisper read as a whisper. A compressed whisper sounds like quiet talking, which is
a different and much less effective thing.

**Prefer parallel compression if more control is needed.** Blend a heavily compressed copy
under the mostly-dry signal: the compressed layer provides consistency, the dry layer keeps
breath and transients on top. This is the standard intimate-vocal technique and it degrades
much more gracefully than a single hard compressor.

Explicitly **do not** use `speechnorm` or `dynaudnorm` on the voice. They are adaptive
level processors and will annihilate the dynamic range we are protecting.

### 3.7 Saturation and transient shaping

- **Saturation:** very light. `aexciter=amount=0.8:drive=4:blend=0:freq=7500:ceil=15000`
  adds harmonic content above 7.5 kHz. Use sparingly and audition against bypass — the
  exciter *generates* HF, which conflicts with §1.2 if overdone. Reasonable default is to
  leave it **off** and only enable for 24 kHz TTS sources that need synthetic air.
- **Transient shaping for mouth sounds:** the slow 25 ms compressor attack already preserves
  these. Explicit transient enhancement is a per-voice tweak, not a default. If used,
  enhance attack by no more than 2–3 dB.
- **Breath:** preserve. Do not gate. If breaths are too loud relative to speech, ride them
  down 2–4 dB with automation, never remove them. This is the difference between "a person"
  and "a TTS engine."

### 3.8 Reverb and space

The target is **very high direct-to-reverberant ratio** — a real room, but a tiny one, heard
from very close.

`aecho=0.9:0.85:11|17|23:0.055|0.04|0.03`

Three early reflections at **11, 17 and 23 ms**, at **5.5%, 4% and 3%** mix. Design notes:

- **Early reflections only, no tail.** A reverb tail signals distance; that is the one thing
  we must not do. Keep total reverberant energy roughly **−26 to −30 dB** relative to direct.
- Delay times of 10–25 ms correspond to reflective surfaces 1.7–4 m away — a small bedroom.
  Under ~10 ms you get comb filtering; over ~35 ms it starts to read as a discrete echo.
- Prime-ish, non-integer-related delays avoid resonant coloration.
- Apply **after** binaural rendering so the reflections inherit the spatial image, or use a
  proper stereo early-reflection pattern with slightly different L/R times.
- A convolution reverb with a genuinely small-room IR at 4–6% wet, via `afir`, is the
  higher-quality option if we can source a suitable IR with clean licensing.

### 3.9 Full chain summary

```
TTS mono
  → resample 48 kHz / f32
  → [optional] DeepFilterNet3, atten_lim_db ≤ 12
  → highpass 70 Hz (2nd order)
  → EQ: +2.5 dB @ 180 Hz Q1.0 | −2.0 dB @ 3.2 kHz Q1.2 | +1.5 dB shelf @ 9 kHz
  → de-ess, 5–9 kHz, 3–6 dB max reduction
  → compress 2:1, thr −26 dB, atk 25 ms, rel 250 ms, knee 6 dB
  → [optional] light exciter above 7.5 kHz
  ── mono ends here ──
  → sofalizer (SADIE II SOFA, azimuth per scene)
  → near-field DVF: per-ear gain + shelf from the 20 cm row of §2.2
  → early reflections: 11/17/23 ms @ 5.5/4/3 %
  → measure integrated loudness (ebur128)
  → static gain to −23 LUFS
  → 4× oversampled true-peak limiter, ceiling −2.0 dBTP
  → encode
```

**Verified: this entire chain executes in ffmpeg 6.1.1 with no external plugins.**
**[measured]**

---

## 4. Loudness and delivery

### 4.1 Why −16 LUFS is wrong for ASMR

−16 LUFS is the Apple Podcasts spoken-word target (±1 dB, −1 dBTP). It exists so that talk
content sits consistently against other talk content in a podcast queue. That goal is
actively hostile to ours:

1. **It requires ~13 dB of gain** on typical ASMR material, which forces heavy limiting.
2. **Loud whispering is a contradiction.** Boosting a whisper to conversational loudness
   turns it into quiet speech and destroys the proximity illusion — the intimacy comes
   partly from the listener having *turned the volume up* to hear it.
3. **It fights the crest factor.** ASMR runs 14–20 dB crest; hitting −16 LUFS while
   respecting −1 dBTP means squeezing that to ~15 dB or less.
4. **Sleep context.** 81% of ASMR listening happens at bedtime. Nobody wants −16 LUFS in
   their ears at 2 a.m.

### 4.2 What the measurements say

I generated a narration surrogate with realistic long-term dynamics (alternating −26 to
−46 dBFS passages with pauses; source −29.1 LUFS, LRA 18.9 LU) and compared normalization
strategies. **[measured]**

| Method | Result I | LRA | True peak | LRA lost |
|---|---|---|---|---|
| Source | −29.1 | 18.9 | −7.1 | — |
| ffmpeg `loudnorm` one-pass → −20 | −18.9 (**missed by 1.1 LU**) | 16.4 | −1.5 | **2.5 LU** |
| ffmpeg `loudnorm` two-pass `linear=true` → −20 | −18.9 | 16.4 | −1.5 | **2.5 LU** |
| Static gain → −20 | −20.0 | 18.9 | **+1.1 (clips)** | 0 |
| Static gain + 4× TP limiter → −24 | −24.0 | **18.9** | −2.0 | **0** |
| Static gain + 4× TP limiter → −22 | −22.1 | 18.8 | −1.4 | **0.1 LU** |
| Static gain + 4× TP limiter → −20 | −20.7 (missed) | 17.9 | −1.4 | 1.0 LU |

Three findings worth acting on:

1. **`loudnorm` is a dynamic normalizer and it cost 2.5 LU of range.** Worse, it *missed
   the target by 1.1 LU* while doing so.
2. **`linear=true` silently did not engage.** ffmpeg falls back to dynamic mode when the
   required linear gain would breach the true-peak ceiling — which is exactly the case here
   (+9.1 dB gain on a −7.1 dBTP source). It gave identical output to one-pass mode with no
   warning. **This is a real trap**: you can believe you are doing transparent linear
   normalization and be getting dynamic compression.
3. **Measure-then-static-gain plus an oversampled true-peak limiter beats `loudnorm`
   everywhere** — same target accuracy, a fraction of the dynamic-range cost.

There is also a useful derived quantity, the **peak-limited loudness**: for this source,
max gain before hitting −1.5 dBTP is 5.6 dB, giving −23.5 LUFS as the loudest achievable
level with *zero* limiting. Computing this per-episode tells you whether your target is
even achievable without dynamics processing.

### 4.3 Recommended targets

| Content type | Integrated | True peak | LRA target |
|---|---|---|---|
| **ASMR / intimate narration** | **−23 LUFS** (accept −22 to −24) | **−2.0 dBTP** | preserve; expect 12–20 LU |
| Sleep stories | **−24 LUFS** | −2.0 dBTP | preserve |
| Focus soundscapes (bed) | **−26 to −28 LUFS** | −3.0 dBTP | low by nature |
| Voice within a focus mix | −23 LUFS | −2.0 dBTP | — |

Supporting reference points: **Netflix delivers at −27 LKFS dialogue-gated, −2 dBTP**, with
recommended program LRA 4–18 LU — the closest thing to a mainstream standard that respects
dynamics. The Blankie open-source ambient app normalizes its sound library to **−27 LUFS**.
The ASMR production guidance I found suggests −20 to −22 LUFS. Our −23 to −24 sits sensibly
in that cluster.

**Never normalize per-file in isolation.** Normalize per *episode* and keep relative levels
consistent across a series, or listeners will ride the volume knob between episodes — which
is exactly the failure that loudness normalization was invented to prevent.

### 4.4 What iOS does (and does not) do

**iOS does not apply loudness normalization to third-party app audio.** Verified across
sources:

- **Sound Check** is a feature of the Music app / Apple Music. It reads `iTunNORM` metadata
  and adjusts playback gain. It does not touch `AVAudioPlayer` / `AVAudioEngine` output from
  a third-party app.
- There is no system API to opt into Sound Check-style normalization; implementing it means
  analyzing files yourself and applying gain.

Two consequences:

1. **What we ship is exactly what plays.** Our mastering decisions are final. This is why
   §4.3 must be got right — there is no safety net.
2. **`AVAudioPlayer.volume` is hard-capped at 1.0**, so you cannot apply positive gain
   through it. The Blankie project hit precisely this: LUFS normalization boosts were
   silently discarded, with some sounds playing up to 18 dB under target. Their fix is the
   right one — move to `AVAudioEngine` with an `AVAudioUnitEQ` whose `globalGain` is
   dB-native and spans −96 to +24 dB, keeping attenuation on node volume and boosts in the
   EQ. **This is a concrete argument for the native-Swift verdict in §6.**

One more subtlety: Spotify notes that inaudible high-frequency content can cause BS.1770 to
*overestimate* loudness, since the standard applies no low-pass filter. If we preserve
content above 16 kHz, verify the loudness reading is not being skewed by energy nobody can
hear.

---

## 5. Codecs and fidelity

### 5.1 Empirical codec test

I built a whisper-surrogate stimulus (HF-rich 1.2–13 kHz noise with a syllabic envelope),
rendered it through the KEMAR HRTF at 45° to get genuine ITD/ILD structure, then measured
round-trip damage to the binaural image and HF content. FLAC serves as the control and
reads exactly 0.00 across the board, which validates the measurement. **[measured]**

| Codec | ILD err (200–1k) | ILD err (1–4k) | ILD err (4–12k) | Side-signal err | HF 10–20k | Bandwidth | kB/min |
|---|---|---|---|---|---|---|---|
| AAC-LC 96k | **+1.14 dB** | −0.25 | −0.11 | **+0.57 dB** | +0.73 | **15.9 kHz** | 731 |
| AAC-LC 128k | +0.67 | −0.05 | −0.15 | +0.14 | +0.65 | **17.2 kHz** | 967 |
| AAC-LC 160k | −0.44 | −0.01 | +0.04 | −0.02 | +0.18 | 17.9 kHz | 1199 |
| **AAC-LC 192k** | −0.38 | +0.02 | +0.15 | −0.08 | −0.12 | **19.2 kHz** | 1439 |
| AAC-LC 256k | −0.08 | +0.03 | +0.05 | −0.11 | −0.24 | 19.3 kHz | 1922 |
| **Opus 96k** | **−0.05** | −0.06 | +0.20 | −0.04 | −0.04 | **20.0 kHz** | 791 |
| Opus 128k | −0.03 | −0.00 | +0.07 | −0.04 | −0.09 | 20.0 kHz | 1071 |
| Opus 160k | −0.04 | −0.01 | +0.04 | −0.03 | −0.06 | 19.2 kHz | 1345 |
| FLAC (control) | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 19.3 kHz | 4646 |

Readings:

- **AAC-LC below 128k measurably damages the binaural image** — over 1 dB of low-band ILD
  error at 96k, plus a 15.9 kHz brick wall. Given that our entire near-field cue *is* a
  low-band ILD (§2.2), that is the worst possible place to lose accuracy.
- **AAC-LC 192k is the threshold for whisper/sibilance transparency** on these metrics:
  ILD errors under 0.4 dB and bandwidth restored to 19.2 kHz.
- **Opus at 96k beats AAC-LC at 192k on both imaging and bandwidth, at 55% of the size.**
  Not close. Opus preserves full 20 kHz bandwidth even at 96k while AAC is still band-limited
  at 160k.
- `-apply_phase_inv 0` (which disables Opus phase inversion for mono-downmix safety) made
  **no measurable difference** to the binaural metrics, so it is safe to set if mono
  compatibility matters.

**Caveat, stated honestly:** these AAC numbers come from ffmpeg's *native* AAC encoder,
which is not state of the art. Apple's `afconvert`/AudioToolbox encoder and `libfdk_aac`
are both better and would narrow the gap. Before locking the bitrate, re-run this test with
`afconvert` on a Mac. The Opus result is solid regardless, since `libopus` is the reference
implementation.

### 5.2 HE-AAC and parametric stereo — claim verified

**The claim is correct, and it is architectural rather than incidental.** HE-AAC v2's
Parametric Stereo tool **collapses the stereo signal to a mono downmix** and transmits a few
kbit/s of spatial parameters (inter-channel level, phase/time and coherence differences per
ERB-scaled time/frequency tile) from which the decoder *re-synthesizes* a stereo image.

It is explicitly **not waveform-preserving**. The documented failure mode is "rapid shifts
(or jumps) of the spatial locations of instruments," and the AES coding literature notes
spatial artifacts are "best audible with headphone listening" — our exact use case.

For binaural content this is disqualifying by construction: we are encoding a signal whose
entire value is precise per-ear waveform differences, into a codec that discards those
differences and guesses them back. **Do not ship HE-AAC v1 or v2 for binaural content, at
any bitrate.** (SBR in v1 is also a problem independently — it fabricates the treble that
carries our spatial detail.)

Also relevant: above ~64 kbps, HE-AAC v2 stops helping and starts hurting relative to plain
AAC-LC, so there is no bitrate at which it is the right answer for us.

### 5.3 Opus on iOS — the practical blocker

Opus is the better codec but its iOS container support is genuinely awkward:

| Container | iOS support |
|---|---|
| **CAF** (`.caf`) | iOS 11+ — works, but technically undocumented by Apple and specified only for CBR Opus |
| **MP4** (`.mp4`/`.m4a`) | iOS 17+ per an Apple media engineer; **not listed** in Apple's supported-codec tech specs |
| **WebM / `.owa`** | iOS 17.5+, with state-confusion bugs still present as of 18.2.1 |
| **Ogg** (`.opus`) | iOS 18.4+ only |
| **HLS** | iOS 17+, MP4 segments only; Apple advises also supplying AAC |

There is no Opus container that is both officially documented and supported on iOS 16 and
earlier. Opus-in-CAF is the pragmatic choice and is widely used in production, but it is
undocumented, and CAF adds container overhead.

### 5.4 File sizes (10-minute stereo episode)

**[measured]**

| Format | Size / 10 min | Notes |
|---|---|---|
| AAC-LC 192k M4A | **14.8 MB** | Recommended default |
| AAC-LC 256k M4A | 19.2 MB | Marginal gain over 192k |
| Opus 96k VBR (CAF) | **7.4 MB** | Best quality-per-byte by a wide margin |
| Opus 128k VBR (CAF) | 10.0 MB | |
| FLAC 24-bit/48k | ~88 MB | Hi-fi tier |
| ALAC 24-bit/48k | ~97 MB | Hi-fi tier, native iOS |
| Uncompressed 24/48 | 172.8 MB | Reference |

Lossless figures use a noise-like test signal, which compresses poorly; real narration with
long pauses will compress considerably better (plausibly 50–65 MB). Treat these as an upper
bound.

### 5.5 Recommended encoding spec

| Tier | Codec | Container | Bitrate | Sample rate | Size/10 min | Rationale |
|---|---|---|---|---|---|---|
| **Standard (ship this)** | AAC-LC | `.m4a` | **192 kbps** VBR | 48 kHz | ~15 MB | Universal iOS support, measured-transparent for binaural, no container risk |
| **Data-saver** | AAC-LC | `.m4a` | 128 kbps | 48 kHz | ~10 MB | Acceptable; accept ~0.7 dB ILD error and 17 kHz ceiling |
| **Efficient (if native player)** | Opus | `.caf` | 96 kbps VBR | 48 kHz | ~7.4 MB | Best ratio; only with `AVAudioEngine` and iOS 11+ CAF, tested on device |
| **Hi-fi tier** | ALAC | `.m4a` | lossless | 48 kHz / 24-bit | ~97 MB | Native iOS lossless; use FLAC only if cross-platform |
| **Master / archive** | WAV or FLAC | — | lossless | **48 kHz / 24-bit** | — | Never re-encode lossy-to-lossy |

Additional rules:

- **48 kHz, not 44.1 kHz.** SADIE II ships at 48 kHz, iOS hardware is 48 kHz native, and it
  avoids a resampling stage. Only drop to 44.1 kHz if the HRTF set forces it.
- **24-bit masters.** With a −70 dBFS noise floor and 14–20 dB crest, 16-bit is tight.
- **Encode once, from the 24-bit master.** Every lossy generation compounds.
- Set `-movflags +faststart` on M4A so the moov atom precedes the audio and playback can
  begin before the full download.
- Consider gapless metadata (encoder delay/padding) for looping ambient beds — see §6.4.

### 5.6 What comparable apps use

Publicly documented specs for Dipsea, Calm and Headspace are not available; these are not
disclosed. What *is* documented: Spotify normalizes to −14 LUFS and delivers Ogg Vorbis /
AAC plus FLAC on Premium; Apple Music targets −16 LUFS with ALAC up to 24-bit/192 kHz.
Neither is a useful model for sleep content — both are music-loudness-driven. I would rather
flag this as unknown than infer it.

---

## 6. iOS playback stack

### 6.1 AVAudioSession configuration

For a sleep/intimacy app:

```swift
try AVAudioSession.sharedInstance().setCategory(
    .playback,          // ignores the Ring/Silent switch; required for background
    mode: .default,     // .spokenAudio is also reasonable for narration
    options: []         // deliberately NOT .mixWithOthers — see below
)
try AVAudioSession.sharedInstance().setActive(true)
```

Behaviors that matter:

- **`.playback` is not silenced by the Ring/Silent switch.** Essential — users will have
  their phone on silent at bedtime and still expect audio.
- **Background audio requires the `audio` value in `UIBackgroundModes`.** Without it,
  playback stops on lock. It is also required for AirPlay and PiP.
- **Defer `setActive(true)` until playback actually begins**, per Apple's guidance, so you
  don't prematurely interrupt other apps' background audio.
- **Option choice:** `.playback` without `.mixWithOthers` is non-mixable and will interrupt
  other audio. For an immersive intimacy app that is correct — you do not want a podcast
  underneath. Offer `.mixWithOthers` as a user setting for the focus/soundscape mode, where
  layering over the user's own music is a legitimate want.
- `.duckOthers` and `.interruptSpokenAudioAndMixWithOthers` both implicitly enable
  `.mixWithOthers`. `.interruptSpokenAudioAndMixWithOthers` is a nice touch: it pauses other
  *spoken* content (podcasts) while mixing with music.
- **Interruptions** (calls, alarms, Siri) arrive via `AVAudioSession.interruptionNotification`.
  Handle `.began` / `.ended` and check `shouldResume` in the options. For sleep content,
  resuming with a **short fade-in** rather than an abrupt restart is a meaningful UX detail.

### 6.2 Mixing multiple simultaneous tracks

`AVAudioEngine` handles this natively and comfortably: several `AVAudioPlayerNode`s into
`mainMixerNode`, each with its own gain, EQ and fade automation. A limiter Audio Unit on the
mix bus protects the sum. The Blankie architecture is a good template:

```
per sound:  AVAudioPlayerNode → AVAudioUnitEQ (dB gain) → mainMixer → PeakLimiter AU → output
```

Three simultaneous streams (voice + ambience + optional tone bed) is unremarkable for the
hardware. The real constraints are battery and the correctness of your fade scheduling, not
DSP throughput.

### 6.3 Spatial audio and head tracking

Available and genuinely straightforward:

| API | Head tracking opt-in |
|---|---|
| `AVAudioEnvironmentNode` | `isListenerHeadTrackingEnabled = true` |
| PHASE (`PHASEListener`) | `automaticHeadTrackingFlags = .orientation` |
| `AUSpatialMixer` | `kAudioUnitProperty_SpatialMixerEnableHeadTracking = true` |

All three require the **`com.apple.developer.coremotion.head-pose` entitlement** (enable the
Head Pose capability in Xcode) and compatible AirPods. `CMHeadphoneMotionManager` gives raw
attitude/acceleration if you want to drive something custom. The
`com.apple.developer.spatial-audio.profile-access` entitlement additionally lets the system
apply the user's Personalized Spatial Audio profile.

**Is head tracking worth it here? Probably not, and possibly actively harmful.**

- Head tracking exists to make sources feel *anchored in the room* while the head moves. Our
  entire design goal is a source anchored **to the ear** — a whisper that follows your head
  is more intimate than one that stays fixed in space while you roll over.
- The dominant use context is lying down, eyes closed, falling asleep. Head-tracked audio in
  that context ranges from pointless to disorienting.
- It requires AirPods, an entitlement, and real-time rendering — which forfeits the
  determinism and quality ceiling of offline rendering.

**Recommendation: ship pre-rendered binaural, skip head tracking.** Revisit only if user
research asks for it. Note that iOS 18 adds an *automatic* spatial audio effect for App
Store **game**-category apps on AirPods; we are not a game, but if that ever changes,
`AVGameBypassSystemSpatialAudio` in Info.plist opts out.

There is a more interesting use of `AVAudioEnvironmentNode`: rendering the *ambience bed*
spatially on-device while the voice stays pre-rendered. That gets variety without
compromising the voice.

### 6.4 Gapless looping and crossfades

- **Gapless looping** is best done with `AVAudioPlayerNode.scheduleBuffer(_:at:options:.loops)`
  on a pre-loaded `AVAudioPCMBuffer`. This loops in the audio render thread with genuinely
  zero gap. File-based looping via `scheduleFile` will not be reliably gapless because of
  encoder delay/padding.
- **Encoder delay is the usual culprit** for clicks at loop points in AAC. Two mitigations:
  loop from uncompressed/lossless buffers in memory (best for short beds), or author the
  loop with matched zero-crossings and equal-power crossfade baked in at render time
  (§7.4). Baking the crossfade into the asset is the deterministic option and I would
  default to it.
- **Crossfading between tracks** requires two player nodes with opposing volume ramps.
  `AVAudioPlayerNode` does not have a built-in fade, so ramp via the mixer input volume or
  an `AVAudioUnitEQ` gain on a timer, or schedule sample-accurate gain automation.
- **Sleep timer with fade-out** is trivially done with a scheduled volume ramp; use an
  **equal-power or exponential** curve over 30–60 s, not linear (linear fades sound like
  they stall at the end). Follow with `setActive(false)` to release the session.

### 6.5 Now Playing, lock screen, AirPlay, offline

- `MPNowPlayingInfoCenter` + `MPRemoteCommandCenter` give lock-screen and Control Center
  controls. Straightforward, and required for a credible media app.
- **AirPlay** comes free with the `audio` background mode. Note that AirPlay to a speaker
  destroys binaural rendering — consider detecting the route change via
  `AVAudioSession.routeChangeNotification` and either warning the user or switching to a
  speaker-safe (crossfeed-processed or mono-summed) asset.
- **Route change handling matters more than usual for us.** Binaural content on phone
  speakers sounds wrong. Detecting headphone disconnect and pausing is standard behavior and
  doubly justified here.
- **Offline download/caching** is app-level: fetch to the Caches or Documents directory and
  play from file URL. Mark files with `isExcludedFromBackupKey` where appropriate.

### 6.6 Expo / React Native vs native Swift

| Capability | expo-audio | react-native-track-player | Native Swift |
|---|---|---|---|
| Background playback | Yes (`shouldPlayInBackground`, `enableBackgroundPlayback` plugin) | Yes | Yes |
| Lock screen / Now Playing | Yes | Yes (its main strength) | Yes |
| Silent-switch override | Yes (`playsInSilentMode`) | Yes | Yes |
| Interruption modes | Yes (`doNotMix` / `duckOthers` / `mixWithOthers`) | Partial | Full |
| Gapless playlist | Yes (`useAudioPlaylist`) | Queue-based | Yes, sample-accurate |
| **Multiple simultaneous tracks** | Multiple player instances, **no sync guarantee** | **Explicitly unsupported** by design | **Yes, one engine graph** |
| **Sample-accurate crossfade** | No | No ("should be a native transition") | Yes |
| **Gain > 1.0 (LUFS boost)** | No — `volume` capped at 1.0 | No | Yes, via `AVAudioUnitEQ.globalGain` |
| Per-node EQ / limiter | No | No | Yes |
| Spatial / head tracking | No | No | Yes |
| Opus-in-CAF | Untested | Community reports it works | Yes |
| Fade in/out | Manual JS timers | Limited | Sample-accurate ramps |

Notes from the source:

- `expo-audio`'s iOS module maps `setAudioModeAsync` onto `AVAudioSession` categories
  directly: `playsInSilentMode: false` → `.ambient`/`.soloAmbient`, `true` → `.playback`
  (or `.playAndRecord`), with `interruptionMode` selecting `.duckOthers` / `.mixWithOthers`.
  The mapping is clean and sufficient for session configuration.
- react-native-track-player's maintainers state plainly that simultaneous tracks are out of
  scope because "media controls and status is directly linked to the playing track," and
  recommend server-side mixing or a custom player.
- Community consensus for layered audio in RN is to fall back to `expo-av`/`expo-audio` and
  hand-synchronize — which is JS-timer-driven and therefore not sample-accurate.

**Verdict.**

**Use native Swift for the audio player.** Not because Expo cannot play a file — it can, and
its session handling is fine — but because three of our requirements land squarely in the
"requires native" column:

1. **Layered playback with sample-accurate crossfades** (voice + ambience + bed). This is
   the focus-mode architecture and RN cannot do it correctly.
2. **Positive gain for loudness normalization.** The `volume ≤ 1.0` cap is a hard blocker
   for any per-asset LUFS alignment that needs a boost, and it fails *silently* — the
   Blankie project shipped sounds up to 18 dB under target before diagnosing it.
3. **Mix-bus limiter and per-node EQ**, which matter given §4.4 (nothing downstream protects
   us).

**Effort estimate, in technical terms rather than calendar time.** A custom Expo native
module wrapping `AVAudioEngine` is a well-trodden path and moderately sized. Scope:

- An `AudioEngineManager` owning one `AVAudioEngine`, the mixer and a mix-bus limiter.
- A `SoundPlayer` per layer: `AVAudioPlayerNode` + `AVAudioUnitEQ` + scheduling and
  position tracking.
- Engine-lifecycle robustness: configuration-change and engine-reset notifications, route
  changes, interruption begin/end. **This is where the real work is** — the happy path is
  quick, the lifecycle edge cases are what take the time.
- A JS bridge via Expo Modules API (Swift, well documented) exposing play/pause/seek,
  per-layer gain, crossfade and sleep-timer primitives.
- `MPNowPlayingInfoCenter` / `MPRemoteCommandCenter` wiring.

A pragmatic sequencing: **ship v1 on `expo-audio`** with single pre-rendered stereo files
(voice and ambience pre-mixed offline, one stream, no runtime layering) — everything in §1–5
still works because the intimacy is baked into the asset, and the entire spatial payload is
in the file. **Then** build the native module when independent per-layer control, runtime
mixing or a hi-fi tier justify it. This defers the native work without compromising audio
quality at all, because our quality comes from offline rendering.

---

## 7. Soundscapes and focus audio

### 7.1 Binaural beats — the evidence does not hold up

Be skeptical, and be honest with users.

- **Garcia-Argibay et al. (2019), Psychological Research** — meta-analysis, 22 studies, 35
  effect sizes: overall **g = 0.45**, medium and significant, across memory, attention,
  anxiety and analgesia. This is the strongest pro-binaural-beats evidence and it is
  regularly cited by apps.
- **Ingendoh et al. (2023), PLOS ONE** — systematic review of the *mechanism*. Of 14
  studies testing whether binaural beats actually entrain brain oscillations: **5 supported
  the entrainment hypothesis, 8 contradicted it, 1 mixed.** The authors describe the
  literature as inconsistent and methodologically heterogeneous to the point of limiting
  comparability.
- **López-Caballero & Escera** found binaural beats did not enhance EEG oscillatory activity
  or arousal.
- A study of ~1,000 participants found binaural beats during cognitive tasks *decreased*
  performance.
- A 2026 systematic review (Acta Neuropsychiatrica) rated certainty of evidence as **low to
  moderate**, and declined to run a meta-analysis at all due to heterogeneity.

**Reading:** the proposed *mechanism* (brainwave entrainment) is not well supported. There
may be a real effect via expectation, relaxation and attention-focusing — but that is a
placebo-adjacent pathway, not neural entrainment. Where the meta-analysis does find effects,
its own moderators are informative: masking with noise is unnecessary, exposure *before* the
task beats exposure during, and longer exposure works better.

**Product stance:** offering binaural beats is defensible as an *aesthetic* option. Making
neurological claims is not. Do not write "syncs your brainwaves to the alpha state" in the
App Store listing. Beyond honesty, health-claim marketing invites App Store review problems.

### 7.2 Isochronic tones and amplitude modulation

Isochronic tones (hard-gated pulses) share the entrainment rationale and the same evidential
weakness, but have one practical advantage: they do not require headphones, whereas binaural
beats do by definition.

Notably, **Brain.fm** deliberately avoids binaural beats in favour of **rapid amplitude
modulation embedded in each stereo channel** — typically 10–20 modulations/second for focus
— explicitly because it works without headphones and produces stronger modulation depth.
Whatever the neuroscience, this is a better *engineering* choice: it survives speaker
playback and mono fold-down.

### 7.3 Noise for attention — this one has real evidence

**Nigg et al. (2024), JAACAP** — systematic review and meta-analysis, the best evidence in
this whole section:

- Children and college-age adults **with ADHD or elevated ADHD symptoms** (k=13, N=335):
  white/pink noise gave a small but significant benefit, **g = 0.249** (95% CI 0.135–0.363,
  p<0.0001). Heterogeneity minimal, no publication bias, survived sensitivity analysis.
- **Non-ADHD comparison groups** (k=11, N=335): noise had a **negative** effect,
  **g = −0.212** (95% CI −0.355 to −0.069, p=0.0036).
- **No studies of brown noise were identified** — despite brown noise being the current
  social-media favourite. That popularity is not evidence-based.

Two design consequences:

1. **The effect is population-dependent and reverses sign.** Noise helps people with ADHD
   and mildly *hurts* everyone else. A focus feature that pushes noise on all users is, on
   this evidence, net-negative for the majority. Frame it as an option for users who find it
   helps, not as a universal productivity tool.
2. **Do not claim brown noise benefits.** There is no trial evidence.

The proposed mechanism (stochastic resonance / moderate brain arousal) is also now in doubt:
Rijmen & Wiersema (2024) found a **pure tone** — a non-random signal that cannot produce
stochastic resonance — improved performance in adults with elevated ADHD traits as much as
or more than pink noise. So the effect may be real while the mechanism is wrong.

### 7.4 40 Hz gamma entrainment

- Strong preclinical mouse work from Tsai's lab at MIT since 2016 (reduced amyloid/tau,
  preserved cognition), and a mechanistic story involving VIP release and microglial
  clearance.
- Human results are much weaker. A **2025 systematic review and meta-analysis (11 studies,
  341 participants)** found gamma stimulation safe overall and associated with structural
  brain changes (SMD 1.74, p=0.02) but **no significant improvement in cognition**
  (SMD 0.16, 95% CI −0.36 to 0.68, p=0.55) or activities of daily living. It also found a
  significantly increased risk of **tinnitus** (RD 0.16, p=0.01).
- Cognito Therapeutics' phase II reported 77% reduction in functional brain atrophy; a
  phase III has been running for over a year without a reported readout.

**Reading:** this is a serious clinical research program for Alzheimer's disease. It is
**not** a basis for a consumer focus feature, and the tinnitus signal is a real reason for
caution in a product people fall asleep wearing headphones with. There is *no* evidence
that 40 Hz stimulation improves focus in healthy adults. Do not ship it.

### 7.5 Music vs non-music

Barratt & Davis (2017) found **background music inhibits ASMR** for many respondents. For
the intimate/ASMR mode, no musical bed by default. For the focus mode, music is fine and
expected — these are different products with different acoustics, and they should not share
a bed architecture.

### 7.6 How Endel and Brain.fm actually work

Worth internalizing because it is less magic than the marketing suggests:

- **Endel** ("Endel Pacific", patented): the sound *elements and logic are pre-designed by a
  human sound team*. An "AI-powered node system" maps contextual inputs — circadian phase,
  time of day, natural light, weather, heart rate, motion, head position — onto that
  pre-authored soundscape logic, and the device generates and adapts the sound during
  playback. It is **procedural arrangement of authored material**, not generative
  composition. They have shipped Endel-generated fixed playlists to Amazon Music, which
  tells you the output is renderable offline.
- **Brain.fm**: human-composed music plus an amplitude-modulation processing layer.

**The lesson for us:** the credible, high-quality path to "infinite" ambient audio is
**procedural arrangement of well-crafted, human-authored stems** — not real-time neural
audio generation. This is also far cheaper, fully deterministic, offline-capable and
licensing-clean.

### 7.7 Generating long-form ambient audio

**Recommended approach — layered stochastic stem arrangement:**

1. Author 8–20 high-quality loopable stems per soundscape (drones, textures, events).
2. Loop the continuous beds at different, mutually non-commensurate lengths (e.g. 47 s,
   61 s, 73 s, 89 s — primes). The combined pattern only repeats after their LCM, which is
   hours. This is the single highest-leverage trick for defeating perceived repetition.
3. Sprinkle sparse one-shot events (a bird, a distant creak) at randomized intervals drawn
   from a Poisson process, with randomized gain (±3 dB), pan and slight pitch variation
   (±2%).
4. Apply slow LFO gain automation to beds at periods of 40–200 s so the balance drifts.
5. Either render N-minute variants offline (deterministic, cacheable, testable) or run the
   arrangement live on-device with `AVAudioEngine` (small download, infinite length).

**Seamless looping technique:** author each loop with an equal-power crossfade of 0.5–2 s
between the tail and head, baked into the rendered asset. Verify by concatenating the loop
to itself and checking for a discontinuity at the seam — this belongs in automated QC (§8).

**Generative models and licensing:**

| Model | License | Commercial use |
|---|---|---|
| **Stable Audio Open / Open Small / Stable Audio 3.0 (Small, Small SFX, Medium)** | Stability AI **Community License** | **Free for commercial use under $1M annual revenue**; you own outputs. Above $1M requires an Enterprise License. Trained on **fully licensed data**; Enterprise adds legal indemnification |
| Stable Audio 3.0 Large | API / Enterprise only | Not open weights |
| **Meta AudioCraft (MusicGen, AudioGen)** | Code MIT; **model weights CC-BY-NC 4.0** | **Non-commercial only.** Disqualifying |

**Stable Audio Open is the only credible generative option**, and the "trained on fully
licensed data" point matters a great deal given ongoing copyright litigation against other
music models. But note the **$1M revenue cliff** — if the app succeeds, the license
terminates and you must negotiate Enterprise terms. That is a business risk to plan for, not
discover.

**Recommendation:** use generative models for *asset creation during production* (generating
raw stems that a human then edits, loops and approves), **not** at runtime. That keeps
quality controlled, output deterministic, licensing exposure bounded, and avoids shipping a
model on-device.

---

## 8. Automated QC

Every rendered episode should pass an automated gate before publication. All of the
following is scriptable with ffmpeg plus a small amount of Python.

### 8.1 Checks and thresholds

| Check | Method | Fail condition |
|---|---|---|
| **Integrated loudness** | `ffmpeg -filter_complex ebur128=peak=true` or `loudnorm=print_format=json` | outside −23 ±1.0 LUFS |
| **True peak** | same (`peak=true`, oversampled per BS.1770) | > −2.0 dBTP |
| **Loudness range** | `ebur128` LRA | < 8 LU (over-compressed) or > 22 LU (uncomfortable) |
| **Clipping** | `astats` (`Peak count`, flat-region detection) | any sample at full scale, or consecutive identical peak samples |
| **Digital silence** | `silencedetect=n=-70dB:d=2.0` | any gap > 3 s not in the intended script |
| **Leading/trailing silence** | `silencedetect` on the head/tail | > 1.5 s at either end |
| **DC offset** | `astats` `DC offset` | \|offset\| > 0.001 |
| **Channel correlation** | `aphasemeter` / `astats` | correlation ≈ +1.0 (rendering collapsed to dual mono — the spatial stage failed) or < −0.3 (phase problem) |
| **Near-field ILD present** | custom: per-band L/R RMS ratio | low-band (150–800 Hz) \|ILD\| < 6 dB when a near-field render was requested |
| **Mono fold-down** | sum to mono, re-measure loudness | mono sum > 4 dB below stereo (excessive cancellation) |
| **Bandwidth** | FFT, highest bin above −60 dB rel. peak | < 16 kHz for a 48 kHz asset (codec or source band-limiting) |
| **Sample rate / bit depth** | `ffprobe` | not 48 kHz; not the expected codec/bitrate |
| **Loop seam** (ambience) | concatenate asset to itself, look for discontinuity at the seam | sample-level step > threshold at the join |
| **Duration** | `ffprobe` vs expected | deviation > 2% from script estimate |

The **channel-correlation** and **near-field ILD** checks are the ones specific to this
project and the most valuable — they catch a silently-failed spatial stage, which is
otherwise easy to ship without noticing because the audio still sounds fine, just flat.

### 8.2 ASR round-trip verification

To catch dropped words, mispronunciations and TTS glitches:

1. Transcribe the rendered episode with **Whisper large-v3** (or `faster-whisper` for
   throughput).
2. Canonicalize both the script and the transcript to spoken form — numbers, dates, clock
   times, acronyms, currency. **This step is essential**: without it, "3:30" vs "three
   thirty" registers as an error and the false-positive rate makes the check useless.
3. Compute **WER / CER** with `jiwer`. Gate at WER > 5% for review.
4. Use **WhisperX** forced alignment (wav2vec2 phoneme models) for word-level timestamps.
   This catches *timing* problems — an unnaturally long pause mid-phrase, a word rendered
   too fast — that plain WER misses entirely.
5. **Quarantine, don't fail, on short utterances.** The `ttsproof` authors found via blinded
   human review that on very short utterances the ASR-uncertain zone was a genuine ~45/55
   mix of real TTS failures and ASR false negatives. Route these to human review rather than
   auto-failing.

**Important caveat for our pipeline:** run ASR on the **pre-spatialization mono** signal, or
on a mono sum. Heavily lateralized binaural audio with 10+ dB ILD can degrade ASR accuracy,
producing false failures. Do the linguistic QC where the linguistics live.

### 8.3 Existing tooling

| Tool | License | Use |
|---|---|---|
| **ffmpeg** (`ebur128`, `astats`, `silencedetect`, `aphasemeter`, `volumedetect`) | LGPL/GPL | The workhorse; covers most of §8.1 |
| **pyloudnorm** | MIT | BS.1770-4 loudness in Python; good for custom gates |
| **ffmpeg-normalize** | MIT | EBU R128 normalization wrapper |
| `loudcheck` | see repo | Standards-aware pass/fail verdicts with remediation deltas; CLI + MCP |
| `LoudScan` | see repo | Batch LUFS/TP/LRA with HTML report; no pip deps |
| `rendiff-probe` | see repo | 121-parameter QC REST API over FFprobe; heavier than we need |
| `ttsproof` | see repo | TTS-specific: structural checks, equivalence-aware WER/CER, ASR-uncertainty quarantine |
| **WhisperX** | BSD-4 (check) | Forced alignment for word timing |
| **jiwer** | Apache 2.0 | WER/CER computation |

**Recommendation:** write a purpose-built ~300-line Python QC script rather than adopting a
framework. Our checks are specific (near-field ILD, loop seams, binaural collapse) and no
off-the-shelf tool covers them. Emit JSON, gate CI on it, and keep a rendered HTML report
for human spot-checks.

---

## 9. Recommended signal chain (consolidated)

Reference implementation, verified working end-to-end in ffmpeg 6.1.1. **[measured]**

```bash
# ---- Stage 0: conform -------------------------------------------------------
ffmpeg -i tts_raw.wav -af "aresample=48000:resampler=soxr:precision=28" \
       -c:a pcm_f32le -ac 1 s0.wav

# ---- Stage 1: optional denoise (only if the source needs it) ---------------
# deep-filter --atten-lim-db 12 -o . s0.wav

# ---- Stage 2: mono voice shaping -------------------------------------------
ffmpeg -i s0.wav -af "
  highpass=f=70:p=2,
  equalizer=f=180:t=q:w=1.0:g=2.5,
  equalizer=f=3200:t=q:w=1.2:g=-2.0,
  equalizer=f=9000:t=h:w=0.7:g=1.5,
  deesser=i=0.35:m=0.5:f=0.25,
  acompressor=threshold=-26dB:ratio=2:attack=25:release=250:makeup=1:knee=6
" -c:a pcm_f32le s2.wav

# ---- Stage 3: near-field binaural (20 cm, 40 deg right) --------------------
# DVF gains from the 20 cm row of section 2.2: ipsi +6.2 dB, contra -4.3 dB,
# each with a -1.8 dB shelf above 4 kHz so the HF ends at +4.4 / -6.1 dB, matching
# the model's frequency slope. Net added ILD ~= +10.5 dB.
ffmpeg -i s2.wav -af "
  sofalizer=sofa=SADIE_D2_48K.sofa:type=freq:speakers=0 -40 0,
  channelsplit=channel_layout=stereo[L][R];
  [L]volume=-4.3dB,highshelf=f=4000:g=-1.8[Lo];
  [R]volume=6.2dB,highshelf=f=4000:g=-1.8[Ro];
  [Lo][Ro]join=inputs=2:channel_layout=stereo
" -ar 48000 -c:a pcm_f32le s3.wav

# ---- Stage 4: intimate early reflections -----------------------------------
ffmpeg -i s3.wav -af "aecho=0.9:0.85:11|17|23:0.055|0.04|0.03" \
       -c:a pcm_f32le s4.wav

# ---- Stage 5: loudness (measure -> static gain -> oversampled TP limit) ----
# Do NOT use loudnorm here: it cost 2.5 LU of dynamic range in testing (section 4.2).
I=$(ffmpeg -nostats -i s4.wav -filter_complex ebur128 -f null - 2>&1 \
    | awk '/^ *I: /{print $2}' | tail -1)
G=$(python3 -c "print(f'{-23 - ($I):.2f}')")
ffmpeg -i s4.wav -af "
  volume=${G}dB,
  aresample=192000:resampler=soxr:precision=28,
  alimiter=limit=-2.0dB:attack=5:release=150:level=disabled,
  aresample=48000:resampler=soxr:precision=28
" -c:a pcm_s24le master.wav

# ---- Stage 6: encode --------------------------------------------------------
ffmpeg -i master.wav -c:a aac -b:a 192k -movflags +faststart episode.m4a
```

**Notes.**

- Azimuth sign: ffmpeg's `sofalizer` uses counter-clockwise azimuth, so `-40` places the
  source to the listener's **right**. Verify against your SOFA set — this is easy to get
  backwards, and I did initially.
- Assert the output sample rate after `sofalizer`; it follows the SOFA file (§2.4).
- For the ear-to-ear effect, render several fixed azimuths and crossfade between them, or
  drive `sofalizer` with a time-varying azimuth over 15–30 s.
- All stages are deterministic — same input, same output, byte-for-byte. Good for caching
  and for regression testing.

**Python alternative.** `pedalboard` is excellent and much nicer to script than shell
pipelines, **but it is GPLv3** (it statically links JUCE and the Steinberg VST3 SDK). For a
closed-source commercial product that is a serious constraint. Options: keep pedalboard use
confined to an internal build tool that is never distributed (the license only bites on
distribution, and Spotify's own reasoning for choosing GPLv3 was that users typically do not
distribute their scripts), or stay on ffmpeg + NumPy/SciPy, which have no such issue. Given
that ffmpeg already covers the whole chain, **I would stay on ffmpeg** and avoid the
question entirely.

---

## 10. Tools and libraries

| Tool | Purpose | License | Commercial | Verdict |
|---|---|---|---|---|
| **ffmpeg** | Whole DSP chain, encode, QC | LGPL 2.1+ / GPL 2+ (build-dependent) | Yes — use an LGPL build, avoid `--enable-gpl`/`--enable-nonfree` | **Core.** Ships `sofalizer`, `ebur128`, `loudnorm`, `alimiter`, `deesser`, `acompressor`, `aexciter`, `afir` |
| **libmysofa** | SOFA parsing (inside ffmpeg) | BSD-3 | Yes | Transitive |
| **SoX** | Alternative DSP | GPL | Restrictive | Not needed; ffmpeg covers it |
| **pedalboard** | Python audio effects, VST3 host | **GPLv3** | **Constrained** | Internal tooling only, or avoid |
| **pyloudnorm** | BS.1770 loudness | MIT | Yes | QC |
| **soundfile / libsndfile** | I/O | BSD-3 / LGPL 2.1 | Yes | Pipeline |
| **NumPy / SciPy** | DVF model, custom DSP | BSD-3 | Yes | DVF implementation |
| **sofar** | SOFA read/write/validate | MIT | Yes | Asset validation |
| **spaudiopy** | Ambisonics, binaural decoding | MIT | Yes | If we go Ambisonic |
| **slab** | HRTF convenience, psychoacoustics | MIT | Yes | Prototyping (watch the ITD footgun) |
| **Spatial Audio Framework** | DVF reference, HRIR utilities | **ISC** core / GPLv2 optional modules | Yes, core only | Reference for `calcDVFCoeffs` |
| **SPARTA / IEM Plugin Suite** | Spatial plugins | **GPLv3** | **No** | Prototyping / A-B only |
| **Steam Audio** | Real-time spatial engine | Apache 2.0 | Yes | Overkill for offline |
| **Resonance Audio** | Real-time spatial engine | Apache 2.0 | Yes | Archived upstream |
| **DeepFilterNet3** | Speech denoise | MIT / Apache 2.0 dual | Yes | Optional denoise stage |
| **RNNoise** | Lightweight denoise | BSD | Yes | Unmaintained; DFN3 is better |
| **Resemble Enhance** | Denoise + enhancement | MIT | Yes | Alternative |
| **Whisper large-v3 / faster-whisper** | ASR for QC | MIT | Yes | QC round-trip |
| **WhisperX** | Forced alignment | BSD (verify) | Likely | Word-level timing QC |
| **jiwer** | WER/CER | Apache 2.0 | Yes | QC |
| **SADIE II HRTF** | HRTF dataset | **Apache 2.0** | **Yes** | **Primary HRTF** |
| **MIT KEMAR HRTF** | HRTF dataset | Free w/ citation | Yes | Fallback |
| **CIPIC HRTF** | HRTF dataset | UC Regents, commercial permitted | Yes, w/ notice | Alternative |
| **FHK KU100 near-field** | Near-field HRTF | **CC BY-SA 4.0** | Share-alike risk | **Avoid**; synthesize with DVF instead |
| **Stable Audio Open** | Generative audio | Stability Community License | Yes, under $1M revenue | Production asset creation only |
| **Meta AudioCraft** | Generative audio | Weights **CC-BY-NC** | **No** | Disqualified |

---

## 11. Open questions and risks

1. **AAC encoder quality.** The §5.1 bitrate threshold used ffmpeg's native AAC encoder.
   Re-run with Apple `afconvert` or `libfdk_aac` before locking 192 kbps — the real
   threshold may be lower, which would save meaningful download size.
2. **HRTF individualization.** Non-individual HRTFs cause front-back confusion and
   in-head localization for some listeners. Our lateral near-field placement is the most
   robust case (ILD-dominant cues generalize better than spectral pinna cues), but a
   subset of users will still perceive it differently. Worth a small listening panel before
   committing to a single SOFA subject. SADIE II includes multiple subjects, so an A/B is
   cheap.
3. **How much near-field is too much?** The 10 cm DVF row is physically correct and
   probably unpleasant. 20 cm is my recommendation but it is a judgment call from the model,
   not from listening. This needs human ears.
4. **The §1.2 finding deserves a listening test.** Restraining HF is well-supported by three
   independent studies but contradicts most practitioner tutorials. Before standardizing the
   EQ curve, A/B the restrained curve against a conventional air-boosted one with real
   listeners. I am fairly confident in the evidence, but this is exactly the kind of claim
   that should be checked against ears before it becomes a house style.
5. **Opus-in-CAF on-device verification.** If the ~50% size saving matters, test CAF Opus
   across the actual iOS deployment range before betting on it. It is undocumented by Apple.
6. **Stable Audio's $1M revenue cliff** needs a plan before the app scales, not after.
7. **Sleep-context safety.** Content people fall asleep to should never contain sudden level
   jumps. Consider a QC check for short-term loudness deltas exceeding ~6 LU within 3 s.

---

## Sources

### ASMR science

- Barratt & Davis (2015), "ASMR: a flow-like mental state," *PeerJ* 3:e851 — https://peerj.com/articles/851/ ([PDF](https://mmu-eprints-repo-prod.mmu-eprints.cdl.cosector.com/617640/1/Autonomous%20Sensory%20Meridian%20Response%20%28ASMR%29%3A%20a%20flow-like%20mental%20state.pdf))
- Barratt, Spence & Davis (2017), "Sensory determinants of ASMR: understanding the triggers," *PeerJ* 5:e3846 — https://doi.org/10.7717/peerj.3846 · https://pmc.ncbi.nlm.nih.gov/articles/PMC5633022/
- Poerio, Blakey, Hostler & Veltri (2018), "More than a feeling: ASMR is characterized by reliable changes in affect and physiology," *PLOS ONE* — https://doi.org/10.1371/journal.pone.0196645
- Terashima, Tada & Kondo (2024), "Predicting tingling sensations induced by ASMR videos based on sound texture statistics," *Phil. Trans. R. Soc. B* 379(1908):20230254 — https://doi.org/10.1098/rstb.2023.0254
- Kondo et al. (2019/2020), "Deep, soft, and dark sounds induce ASMR," bioRxiv — https://doi.org/10.1101/2019.12.28.889907
- Barratt & Davis author interview, PeerJ blog — https://peerj.com/blog/post/111369042754/emma-barratt-nick-davis-asmr/

### Binaural, HRTF and near-field

- Brungart & Rabinowitz (1999), "Auditory localization of nearby sources: HRTFs," *JASA* 106(3):1465 — https://doi.org/10.1121/1.427180
- Duda & Martens (1998), "Range dependence of the response of a spherical head model," *JASA* 104(5):3048 — https://doi.org/10.1121/1.423886
- Romblom & Cook (2008), "A psychophysical evaluation of near-field HRTFs synthesized using a distance variation function," *JASA* — https://doi.org/10.1121/1.3081395
- Spagnol, Tavazzi & Avanzini (2017), "Distance rendering and perception of nearby virtual sound sources with a near-field filter model," *Applied Acoustics* 115:61–73 — https://doi.org/10.1016/j.apacoust.2016.08.015
- SAF DVF implementation (`saf_utility_dvf.c`) — https://leomccormack.github.io/Spatial_Audio_Framework/saf__utility__dvf_8c.html
- Arend et al. (2016), "Measurement and Perceptual Evaluation of a Spherical Near-Field HRTF Set," TH Köln — http://audiogroup.web.th-koeln.de/PUBLIKATIONEN/Arend_TMT2016.pdf
- FHK KU100 near-field HRIR compilation (Zenodo) — https://zenodo.org/records/4297951
- Li et al. (2023), near-field KEMAR HRTF, 1 cm resolution (Zenodo) — https://doi.org/10.5281/zenodo.7626148
- Marschall et al. (2023), laser-spark near-field HRTF database (Zenodo) — https://zenodo.org/records/7316545
- Salvador et al. (2018), BEM near-distance HRTF dataset — https://cesardsalvador.github.io/doc/Salvador2018NearDistanceHRTFDataset.pdf
- SADIE II Database — https://www.york.ac.uk/sadie-project/database.html · https://zenodo.org/records/10886409
- CIPIC HRTF database (license in `read_me.txt`) — https://github.com/amini-allight/cipic-hrtf-database
- Kolarik / Frontiers (2017), "Sound Spectrum Influences Auditory Distance Perception" — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00969/full
- ISO 9613-1 air absorption — https://sengpielaudio.com/calculator-air.htm · https://gorbatschow.github.io/SonarDocs/sound_absorption_air_iso.en/
- Spatial Audio Framework — https://github.com/leomccormack/Spatial_Audio_Framework
- SPARTA — https://github.com/leomccormack/SPARTA
- spaudiopy — https://github.com/chris-hld/spaudiopy · slab — https://slab.readthedocs.io/en/latest/hrtf.html

### Microphones and craft

- 3Dio Free Space — https://3diosound.com/products/free-space-binaural-microphone
- Binaural microphones for ASMR — https://asmr.education/faq/the-craft-of-asmr/binaural-microphones-asmr
- Binaural microphone practical comparison (spacing 16–18 cm) — https://electronics.alibaba.com/question/best-binaural-microphones-for-asmr-real-world-testing-guide
- HRTF and binaural explained — https://audiouniversityonline.com/binaural-audio/
- Panning and listener experience in ASMR — https://asmr.education/faq/the-craft-of-asmr/audio-paning-effect-listener-experience
- Haas effect and ASMR perception — https://asmr.education/faq/music-mixing/haas-effect-stereo-perception-asmr
- Mono/stereo compatibility for ASMR — https://asmr.education/faq/music-mixing/mono-stereo-compatibility-guide

### Voice processing

- "How to Mix Intimate Vocals (The Whisper Vocal Technique)" — https://adrianmilea.com/how-to-mix-intimate-vocals/
- ASMR Recording & Mastering Guide (DeckReady) — https://www.deckready.club/blog/asmr-recording-mastering-en
- EQ for proximity and psychoacoustics — https://asmr.education/faq/film-and-asmr/eq-intimate-voice-proximity-effect
- De-essing technique — https://mastering.com/de-essing-vocals/
- Crest factor in ASMR — https://asmr.education/faq/music-mastering/crest-factor-audio-peak-rms-explained
- DeepFilterNet — https://github.com/Rikorose/DeepFilterNet
- DeepFilterNet3 vs RNNoise comparison — https://noisereducerai.com/blogs/deepfilternet-vs-rnnoise/
- pedalboard license — https://spotify.github.io/pedalboard/license.html · https://github.com/spotify/pedalboard

### Loudness

- Spotify loudness normalization — https://support.spotify.com/us/artists/article/loudness-normalization/
- iZotope, mastering for streaming platforms — https://www.izotope.com/community/blog/mastering-for-streaming-platforms
- Streaming LUFS targets 2026 — https://matlefflerschulman.com/mastering-articles/loudness-targets-and-mastering-for-streaming-platforms
- Apple Podcasts / BBC LUFS standards — https://www.finchley.co.uk/finchley-learning/visual-podcast/understanding-lufs-broadcasting-standards-for-bbc-and-apple-podcasts
- Netflix Sound Mix Specifications v1.6 (−27 LKFS dialogue-gated, −2 dBTP) — https://partnerhelp.netflixstudios.com/hc/en-us/articles/360001794307-Netflix-Sound-Mix-Specifications-Best-Practices-v1-6
- Worldwide loudness delivery standards (RTW) — https://www.rtw.com/blog/rtw-knowledge-base-1/worldwide-loudness-delivery-standards-4
- Blankie PR #85 — AVAudioPlayer volume cap and AVAudioEngine migration for LUFS normalization — https://github.com/codybrom/Blankie/pull/85

### Codecs

- MPEG-4 Audio Amendments 1 & 2 overview (HE-AAC, Parametric Stereo) — https://link.springer.com/content/pdf/10.1155/2009/468971.pdf
- AES coding tutorial, stereo imaging and parametric coding artifacts — https://www.audiolabs-erlangen.de/content/resources/aesCodingTutorial/stereoimaging.html
- AAC family: AAC-LC, HE-AAC v1/v2, xHE-AAC — https://www.forasoft.com/learn/audio-for-video/articles-audio/aac-family-lc-he-v1-v2-xhe
- Perceived Audio Quality for Streaming Stereo Music (ACM) — https://doi.org/10.1145/2647868.2655025
- Opus recommended settings — https://wiki.xiph.org/Opus_Recommended_Settings
- Opus (Hydrogenaudio) — https://wiki.hydrogenaudio.org/index.php?title=Opus
- Opus on iOS/HLS (Apple Developer Forums) — https://developer.apple.com/forums/thread/759210
- Opus container support timeline — https://www.testmuai.com/learning-hub/opus-audio-codec-browser-support/

### iOS

- Configuring your app for media playback — https://developer.apple.com/documentation/AVFoundation/configuring-your-app-for-media-playback
- AVAudioSession `playback` category — https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback
- `mixWithOthers` and category options — https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/mixwithothers
- Head-pose entitlement — https://developer.apple.com/documentation/BundleResources/Entitlements/com.apple.developer.coremotion.head-pose
- Personalizing spatial audio in your app (PHASE, AVAudioEnvironmentNode, AUSpatialMixer) — https://developer.apple.com/documentation/phase/personalizing-spatial-audio-in-your-app
- What's new in Core Motion, WWDC23 (CMHeadphoneMotionManager) — https://developer.apple.com/videos/play/wwdc2023/10179/
- expo-audio SDK reference — https://docs.expo.dev/versions/latest/sdk/audio/
- expo-audio iOS `AudioModule.swift` (AVAudioSession mapping) — https://github.com/expo/expo/blob/5cbac55c/packages/expo-audio/ios/AudioModule.swift
- react-native-track-player, multitrack not supported — https://github.com/react-native-kit/react-native-track-player/issues/172

### Focus audio and soundscapes

- Nigg, Bruton, Kozlowski, Johnstone & Karalunas (2024), "Do White Noise and Pink Noise Help With Attention in ADHD?" *JAACAP* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987 · https://www.sciencedirect.com/science/article/abs/pii/S0890856724000741
- OHSU summary of the above — https://news.ohsu.edu/2024/08/09/white-pink-noise-improve-focus-for-children-with-adhd-ohsu-study-shows
- Rijmen & Wiersema (2024), "Stochastic resonance is not required for pink noise to have beneficial effects on ADHD-related performance," *Neuropsychologia* — https://doi.org/10.1016/j.neuropsychologia.2024.108961
- Ingendoh et al. (2023), "Binaural beats to entrain the brain? A systematic review," *PLOS ONE* — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0286023
- Garcia-Argibay et al. (2019), "Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis," *Psychological Research* — https://doi.org/10.1007/s00426-018-1066-8
- Binaural Beats' Effect on Brain Activity and Psychiatric Disorders: A Literature Review — https://openpublichealthjournal.com/VOLUME/17/ELOCATOR/e18749445332258/FULLTEXT/
- Music and binaural beat interventions for young adults: systematic review (2026), *Acta Neuropsychiatrica* — https://www.cambridge.org/core/journals/acta-neuropsychiatrica/article/4282E1152FD3EACA5DF8304935165202
- Gamma frequency auditory/visual stimulation in Alzheimer's: systematic review and meta-analysis (2025) — https://pubmed.ncbi.nlm.nih.gov/41381439/
- Gamma frequency sensory stimulation in mild probable Alzheimer's dementia (PLOS ONE) — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0278412
- MIT News, 40 Hz gamma stimulation evidence (2025) — https://news.mit.edu/2025/evidence-40hz-gamma-stimulation-promotes-brain-health-expanding-0314
- Endel technology — https://endel.io/technology · Personal inputs — https://endel.zendesk.com/hc/en-us/articles/360011955640-Personal-Inputs
- Endel / Vibes / Brain.fm technical comparison — https://www.klinke.studio/notes/audio/digital_musicianship/endel-vibes-brainfm
- Brain.fm vs Endel vs Noisli — https://www.brain.fm/blog/best-focus-music-app-brain-fm-vs-endel-vs-noisli
- Stability AI Community License — https://huggingface.co/stabilityai/stable-audio-open-small/blob/main/LICENSE
- Stable Audio 3.0 announcement — https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models

### QC

- `loudcheck` — https://github.com/chaoz23/loudcheck
- `LoudScan` — https://github.com/Blaztekk/LoudScan
- `loudness-check` — https://github.com/Clem-J/loudness-check
- `rendiff-probe` — https://github.com/rendiffdev/ffprobe-api/
- `ttsproof` — https://github.com/Mormolykos/ttsproof
- `voiceqa` — https://github.com/fwright21/voiceqa
- WhisperX — https://github.com/TryQuotable/WhisperX
