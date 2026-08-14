# Engineering review — architecture, Expo vs Swift, and the studio pipeline

> Reviewer's stance: pragmatic staff iOS engineer, solo/very-small-team context. Mandate is
> long-term maintainability. Date: 14 August 2026. Reviewing
> `docs/plan/00-product-thesis.md` (esp. §4.3, §6, §7) against
> `docs/research/02-compliance-and-legal.md` (C-4),
> `docs/research/07-audio-pipeline-validation.md`, and the actual code in `studio/`.
>
> All performance and correctness numbers below were **measured on this checkout**
> (4 vCPU, 15 GiB RAM, Python 3.12.3, numpy 2.5.2, scipy 1.18.0), not estimated. Where I
> guessed and the measurement disagreed, the measurement won and the guess is gone.

---

## 0. Recommendation

**Ship Expo. Do not go native Swift.** The plan's §4.3 conclusion is correct, but its reasoning
is incomplete in a way that matters: moving DSP offline removes the *hard* native module (a
real-time audio graph), not *all* native code. You still need one small, boring native module —
an audio-session policy shim — and you should plan for it from day one rather than discover it
after a user review says the app started talking in their car.

**Age assurance does not change the decision.** This is the biggest correction to the plan's
implicit assumptions. Expo shipped a first-party module, `expo-age-range`, which wraps Apple's
`DeclaredAgeRange` framework including `isEligibleForAgeFeaturesAsync`,
`getRequiredRegulatoryFeaturesAsync`, `showSignificantUpdateAcknowledgmentAsync`, and the
`ageRangeDeclaration: 'selfDeclared' | 'guardianDeclared' | 'confirmed'` assurance signal. Three
of C-4's four required surfaces are covered by an `npx expo install`, and the fourth
(`RESCIND_CONSENT`) is a server webhook with no native component at all.

**The five decisions I would make today:**

| # | Decision | Why |
| --- | --- | --- |
| 1 | Expo (SDK 57+) + `expo-audio` + one ~250-line native audio-session module | 9 of 11 audio requirements are already first-party; the gap is session/route policy, which is the cheapest kind of native code to own |
| 2 | Cut the web/explicit second catalogue from v1 | Removes the adult payment processor, card-network registration (~$1,450/yr + reporting), the third-party age-assurance vendor, a second billing system, and the guideline 2.3.1(a) disclosure risk — in one stroke. Biggest single maintainability win available |
| 3 | Replace lazy-render-on-first-request with eager batch rendering of a **much smaller grid** | Cold render is realistically 8–12 minutes and can fail QC, so no acceptable synchronous UX exists. Storage is $3–8/month; it was never the constraint. TTS is 99.9% of a variant's marginal cost, so shrink the grid instead of deferring the spend |
| 4 | Content-address every render; never invalidate | A 30-line change now versus a migration later. Kills the whole "app is playing the stale version" bug class |
| 5 | Fix `true_peak_dbtp` memory before writing any more DSP | A 20-minute episode currently peaks at **~12.5 GB RSS**, measured. This blocks laptop iteration and any parallelism, and it is a one-function fix |

**What I would cut from v1**, ranked by maintenance-burden-removed per unit of product value
lost: the web tier, the name-whisper feature, the POV and Length axes, live multi-stem gain
control, lazy rendering, the alternate app icon, and on-device recommendations. Details in §5.4.

**Honest overall read:** this is a two-system product (a thin iOS client and a batch content
factory) wearing the costume of a one-system product. The client is genuinely low-maintenance and
the plan is right about that. The factory is not low-maintenance, and the plan under-describes it:
there is no orchestration layer, no job model, no idempotency, no content addressing, no tests,
and no dependency pinning. That is where the next month of engineering should go — not into more
DSP, which is already the strongest part of the codebase.

---

## 1. The Expo vs native Swift decision

### 1.1 Requirement-by-requirement

| Requirement | Expo status (Aug 2026) | Verdict |
| --- | --- | --- |
| Background audio playback | `expo-audio`: `shouldPlayInBackground` + `enableBackgroundPlayback` config plugin (adds `UIBackgroundModes: audio`) | ✅ First-party |
| Lock screen / Now Playing card | `player.setActiveForLockScreen(true, metadata)`. Requires `interruptionMode: 'doNotMix'` — documented gotcha. iOS Now Playing card was broken until PR #40919 set the `.playback` category at activation time | ✅ Works, recently fixed |
| Remote control events | Play/pause/scrub/seek±. `showSeekForward` / `showSeekBackward`. Next/previous only via the new playlist API (PR #46020) | ⚠️ Adequate for our shape |
| Offline download of 25–38 MiB files | `expo-file-system` `createDownloadResumable` with `sessionType: 'background'` (the default) — native `URLSession` continues while suspended | ⚠️ See §1.3 |
| Sleep timer with fade-out | No primitive. Build from `player.volume` (0.0–1.0) on a JS timer | ⚠️ Build it; fine over 20–30 s |
| Gapless / looping ambient beds | `player.loop` boolean; playlists have `loop: 'none' \| 'one' \| 'all'` | ⚠️ See §1.3 |
| Crossfade between tracks | No primitive. Two players + opposing `volume` ramps in JS | ⚠️ Coarse; see §1.3 |
| 2–3 simultaneous streams, independent gain | Multiple `AudioPlayer` instances, each with its own `volume`. They share one `AVAudioSession` so they mix | ❌ **Do not build this** — see §1.4 |
| CarPlay / AirPlay behaviour control | **Nothing.** `AudioMode` exposes only `allowsRecording`, `allowsBackgroundRecording`, `interruptionMode`, `playsInSilentMode`, `shouldPlayInBackground`, `shouldRouteThroughEarpiece`. No `AVAudioSession.CategoryOptions`, no route-change events, no current-route inspection, no control over which `MPRemoteCommandCenter` commands are registered | ❌ **The real gap** — see §1.5 |
| Hide artwork/title from lock screen & Control Center | `AudioMetadata` is `{ title?, artist?, albumTitle?, artworkUrl? }` — supply neutral strings and omit `artworkUrl`. `clearLockScreenControls()` exists | ✅ Just don't populate it |
| Face ID / biometric lock | `expo-local-authentication` (first-party). Needs `NSFaceIDUsageDescription`, and a dev build — Face ID does not work in Expo Go | ✅ First-party |
| Alternate app icons | No first-party module. Three competing community packages: `expo-alternate-app-icons`, `expo-runtime-app-icon`, `expo-dynamic-app-icon` | ⚠️ See §1.6 |

Nine of thirteen rows are green or workable with ordinary app code. One is a genuine gap
requiring native work. One (multi-stem) should be solved in the pipeline instead of the app. One
(alternate icons) I would cut.

### 1.2 The audio dependency landscape is worse than the plan assumes

§4.3 says "Expo plus a mature track-player library is sufficient". That sentence was true when
written and is not true now, and it is worth being precise about why:

| Option | Status Aug 2026 | Cost |
| --- | --- | --- |
| `expo-av` | **Removed in SDK 55.** Repository archived, "not receiving patches" | — |
| `react-native-track-player` V4 | **Frozen and unmaintained.** Apache-2.0, on the `v4` branch. Maintainer on an iOS background-audio bug: "We're not actively maintaining V4" | Free |
| `@rntp/player` (RNTP V5) | Complete rewrite, New Architecture only (RN ≥ 0.74, Fabric + TurboModules), **commercially licensed** | **€99/mo or €999/yr** for one app (RNTP Pro). A "Launch Credit" gives invite-only indies 6 free months, then auto-renews |
| `expo-audio` | First-party, actively developed, shipping meaningful changes weekly (lock-screen playlists, MediaSession IDs, live-stream flags, audio-focus handling) | Free |

So the choice is: pay €999/yr for the mature option, adopt an abandoned one, or ride `expo-audio`
which is young but first-party and free. **Take `expo-audio`.** It is the only one whose
maintenance is funded by someone whose business depends on it, and its release velocity — which
reads as instability — is actually the signal you want: the gaps are being closed in front of you,
not behind you.

The important framing: **native Swift does not escape this problem, it inverts it.** In Swift you
own 100% of the player: `AVQueuePlayer`, `AVAudioSession`, `MPNowPlayingInfoCenter`,
`MPRemoteCommandCenter`, `AVPlayerLooper`, background `URLSession` download delegates, and the
state machine that keeps all of them consistent through interruptions and route changes. That is
maybe 2,000–3,000 lines of exactly the code that is hardest to get right and most punishing to
debug (it fails only on device, only in the background, only sometimes). Choosing Swift trades a
dependency-churn tax for an ownership tax. For a solo developer already fluent in Expo, the
dependency tax is much smaller.

### 1.3 The three workable-but-annoying items

**Offline downloads.** The native transfer survives suspension, but Expo's own docs are explicit
about the catch: "the JavaScript `DownloadTask` instance is not restored if the app is terminated
or relaunched, so its promise, progress callbacks, and cancellation state are only available while
the original JS runtime is still alive." Practical consequence: if iOS kills the app mid-download
of a 38 MiB episode, the bytes may land but your app has no idea. Design around it rather than
fighting it — treat the filesystem as the source of truth, not your JS state. On launch, reconcile
by listing the download directory, comparing file sizes against the catalogue's expected byte
count, and re-issuing anything incomplete. Store the expected size and a checksum in the catalogue
row. This is ~50 lines and it makes the whole class of bug disappear. Do not try to persist
`DownloadTask` handles.

**Gapless loops.** `player.loop = true` is not a gapless guarantee. AAC carries encoder delay and
end padding, so a naively encoded AAC file gains a small click or gap at every loop point unless
the priming/padding is described in an edit list and honoured by the player. Two robust fixes,
both cheap and both in the pipeline rather than the app: (a) render ambient beds long enough that
looping is rare — the studio already generates non-repeating soundscapes procedurally
(`beds.drifting_soundscape`), so render 30–60 minute beds and never loop at all; or (b) deliver
beds as CAF/ALAC where the loop is sample-exact. I would do (a). It costs disk (which costs
nothing, see §4.1) and removes a whole category of "why does it tick every four minutes" bugs.

**Fades and crossfades.** There is no fade primitive, so both are `player.volume` ramps driven
from JS. This is fine for a sleep-timer fade over 20–30 seconds: at 10 Hz you get 0.1 dB steps,
inaudible. It is not fine for a 1–2 second crossfade, where JS-thread jitter during a React
re-render will produce audible steppiness, and where you also need two players to stay
level-matched through the transition. Two options: accept longer, gentler crossfades (3–5 s, which
suits this product's aesthetic anyway), or pre-render the transitions in the pipeline as part of a
segment's head and tail. Prefer the latter — it is the §4.3 principle applied consistently.

### 1.4 Multi-stem independent gain: solve this in the pipeline, not the app

User research asking for separate control of mouth-sound / breath / ambience levels is a real
finding, and the naive implementation — three `AudioPlayer` instances, three `volume` values — is
a trap, for a reason that has nothing to do with Expo:

**Three independent players will drift out of sync.** Each is a separate `AVPlayer` with its own
clock; there is no sample-lock between them. Drift of even a few milliseconds between two streams
derived from the *same* performance produces comb filtering and phasing — and for this product the
three stems *are* the same performance, so they are highly correlated and drift is maximally
audible. It will start clean and degrade over twenty minutes. There is also a second, more mundane
bug waiting: only one player can own the lock screen (`setActiveForLockScreen`), so a remote pause
from the lock screen pauses one stem and leaves the other two running.

Native Swift *could* solve this with `AVAudioEngine` and a shared clock. But look at what that
costs: you are back to building and maintaining a real-time audio graph, which is precisely the
thing §4.3 correctly identified as a permanent maintenance burden and correctly decided to avoid.

**Do the mixing offline.** Ship the dial as 3–5 pre-rendered balance variants ("more breath",
"balanced", "less mouth"), rendered by the existing `master.mix_bed` with different gain
staging. The user gets a dial; the app plays one file; nothing can drift. This multiplies the
render grid, which is why §4.2's axis reduction matters — but DSP compute is ~$10 for the entire
catalogue (§4.1), so this is nearly free. If the dial must feel continuous, offer three positions
and let the copy do the work.

This is the single clearest case in the whole review where following the plan's own stated
architectural principle answers the plan's own hardest requirement.

### 1.5 CarPlay/AirPlay: the one real gap, and what is actually achievable

The Quinn review describing the app auto-connecting and starting playback in a car is the most
important product-risk signal in the brief, because for this catalogue it is not an annoyance —
it is a disclosure event. It deserves a precise answer about what an app can and cannot control.

**First, correct a likely wrong assumption.** The CarPlay entitlement
(`com.apple.developer.carplay-audio`) governs whether you may ship a CarPlay *template app* with
its own dashboard UI. Not requesting it does **not** prevent your audio from routing to a car over
Bluetooth or USB CarPlay audio, and does **not** prevent the head unit's remote `play` command from
reaching your app. "Don't request the entitlement" is not a mitigation.

**What actually happens.** The car connects (Bluetooth A2DP/AVRCP or CarPlay). The head unit sends
a `play` command. iOS routes it to whichever app most recently held an active audio session with
registered remote commands and populated Now Playing info. Your app wakes and plays. Apple exposes
no system toggle to disable this; the widely-recommended user-side fix is a Shortcuts automation
that pauses on connect, which is not a fix you can ship.

**What an app can do, in descending order of effectiveness:**

1. **Deactivate the audio session when not playing.** If you hold no active session, you are not
   the target of the head unit's `play`. Reachable from Expo today:
   `setIsAudioActiveAsync(false)` on pause/stop, and leave `keepAudioSessionActive` at its `false`
   default.
2. **Unregister remote commands and clear Now Playing info when idle.** Reachable from Expo:
   `player.clearLockScreenControls()`. An app with no Now Playing entry is a much less attractive
   target.
3. **Observe route changes and refuse to auto-resume.** Watch
   `AVAudioSession.routeChangeNotification`; when `reason == .newDeviceAvailable` and the new
   output's `portType` is `.carAudio` (or `.bluetoothA2DP`), suppress playback and require an
   explicit in-app tap. **Not reachable from Expo** — `expo-audio` surfaces no route-change events
   and no route inspection.
4. **Reject the remote `play` command itself when no user-initiated session exists.** Return
   `.commandFailed` from the `MPRemoteCommandCenter` play handler unless your own state machine
   says a human pressed play in the last N seconds. **Not reachable from Expo** — you cannot
   intercept or veto individual remote commands.
5. **Set category options deliberately** (e.g. omit `.allowAirPlay`). **Not reachable from
   Expo** — `AudioMode` exposes no `CategoryOptions`.

Items 1 and 2 get you most of the way and need no native code, which is genuinely good news.
Items 3–5 are the residual, and they are the reason I am recommending a native module rather than
pure Expo.

**Also note:** Face ID lock, which the plan already wants for privacy reasons, is an accidental
second line of defence here — an app that requires biometric auth before it will play cannot be
triggered into playing by a head unit. That is a nice alignment between two features and worth
designing deliberately: gate playback resumption, not just app entry, behind the lock.

### 1.6 What the native module actually costs

The module I would build has this entire surface:

```ts
// AudioSessionPolicy — the whole module
getCurrentOutputRoute(): { portType: string; portName: string }[]
addRouteChangeListener(cb: (e: { reason: string; portTypes: string[] }) => void): Subscription
setCategoryOptions(opts: { allowAirPlay?: boolean; allowBluetoothA2DP?: boolean }): void
setRemoteCommandsEnabled(enabled: boolean): void
setAcceptRemotePlayWhenIdle(accept: boolean): void   // the policy flag that fixes the car
```

Roughly 250 lines of Swift and 60 of TypeScript, packaged as a local Expo module (config plugin
plus native code, checked into the repo — no npm publishing, no external dependency).

Why this is the *cheapest possible* native module, and why that distinction matters:

- **The APIs are ancient and stable.** `AVAudioSession` dates to iOS 3, `routeChangeNotification`
  to iOS 6, `MPRemoteCommandCenter` to iOS 7.1. These have not had breaking changes in a decade
  and will not. Compare to `DeclaredAgeRange`, which changed across 26.0 → 26.2 → 26.4 in one year.
- **No real-time constraints.** Nothing runs on the audio render thread. No locks, no
  preallocation discipline, no priority inversion, no glitch class of bug.
- **No memory management surface.** No buffers, no `AVAudioPCMBuffer` lifetimes, no C interop.
- **It is testable by hand in minutes** — plug in a car or a Bluetooth speaker and observe.

That is a fundamentally different object from the live-DSP module §4.3 rejected. The plan was
right to avoid *that* module. It should not generalise "avoid native code" from it.

### 1.7 Verdict

**Expo, with one native session-policy module.** Reasoning, in order of weight:

1. **The maintainer's fluency is a first-class architectural input.** The developer is experienced
   with Expo/RN/Supabase/RevenueCat. "Easy to maintain" is partly a property of the maintainer, not
   only of the stack. A staff engineer who ignores this in favour of framework purity is optimising
   the wrong variable.
2. **The functional gap is small and precisely bounded.** One module, five methods, stable APIs.
3. **Native Swift does not remove the audio-maintenance problem, it relocates it** — from tracking
   `expo-audio` releases to owning an `AVQueuePlayer`/`AVAudioSession`/`MPRemoteCommandCenter`
   state machine and a background `URLSession` download manager.
4. **The pre-rendered-stereo bet genuinely does hold.** The pipeline exists, it measures correct
   (07's numbers reproduce), and the app's playback requirement really is "play one stereo file
   well". That is the load-bearing claim in §4.3 and it survives review.
5. **Age assurance, the strongest available argument for Swift, has been answered by Expo** (§2).

**What would change my mind:** if live multi-stem mixing with sample-accurate sync became a
non-negotiable v1 requirement, Swift + `AVAudioEngine` becomes the honest answer. My
recommendation is to not let that requirement exist (§1.4).

---

## 2. The age assurance problem

### 2.1 Expo support exists, and it is first-party

`expo-age-range` (current at 57.0.2, `platforms: ['android', 'ios', 'expo-go']`) wraps Apple's
`DeclaredAgeRange` on iOS and Google's Play Age Signals on Android. Setup is one entitlement in
app config:

```json
{ "expo": { "ios": { "entitlements": { "com.apple.developer.declared-age-range": true } } } }
```

Mapping it against C-4's four required surfaces:

| C-4 requirement | Covered? | How |
| --- | --- | --- |
| `AgeRangeService` / Declared Age Range — age band | ✅ | `requestAgeRangeAsync({ threshold1: 18 })` → `{ lowerBound, upperBound }` (iOS 26.0+) |
| Statutory-region detection | ✅ | `isEligibleForAgeFeaturesAsync()` (iOS 26.2+) — `true` / `false` / `null` for "unknown" |
| Assurance-method signals (`governmentIDChecked`, `paymentChecked`, guardian equivalents) | ⚠️ **Partial** | `ageRangeDeclaration: 'selfDeclared' \| 'guardianDeclared' \| 'confirmed'`. Apple's granular method flags are collapsed into `'confirmed'` (iOS 26.2+). Also exposes `activeParentalControls: string[]` |
| `PermissionKit` `SignificantAppUpdateTopic` — parental consent | ❌ Not wrapped | But see below: **largely irrelevant to an 18+ app** |
| Significant-update flow for adults | ✅ | `showSignificantUpdateAcknowledgmentAsync(description)` (iOS 26.4+), gated by `getRequiredRegulatoryFeaturesAsync()` returning `'significantAppChangeRequiresAdultNotification'` |
| New StoreKit age-rating property | ⚠️ Not wrapped | Arguably redundant client-side — `getRequiredRegulatoryFeaturesAsync()` already tells you when acknowledgment is required |
| App Store Server Notification `RESCIND_CONSENT` | ✅ n/a | Server-side. A Supabase edge function. Zero native code |

**The PermissionKit gap is smaller than it looks, and this is the crux.** PermissionKit's
`SignificantAppUpdateTopic` is the *parental consent* path — it asks a parent or guardian to
approve a child's continued use. Asking an adult through it reportedly throws
`AskError.notAvailable`. The *adult* path is Declared Age Range's
`showSignificantUpdateAcknowledgment`, which `expo-age-range` wraps. For an app that gates out
everyone under 18 by design, `getRequiredRegulatoryFeaturesAsync()` should never return
`'significantAppChangeRequiresParentalConsent'` for a user you are willing to admit — because you
admit no minors. **So the one uncovered surface is the one an 18+ app has the least need for.**

For the loss of granularity on assurance methods: gating logic needs to answer one question —
"was this age confirmed by a strong method, or merely asserted?" `'confirmed'` versus
`'selfDeclared'` answers exactly that. You lose the ability to *record which* strong method was
used, which matters for an audit trail but not for the gate. If counsel wants the granular flags
in the compliance record, that is a ~40-line addition to the same local Expo module from §1.6 —
and it belongs there anyway.

### 2.2 Does this tip the decision toward native Swift?

**No.** And it is worth being blunt about why the intuition that it should is wrong.

The instinct is: "these are brand-new native iOS 26.2+ APIs, therefore React Native will lag,
therefore go native." But the churn is in **Apple's** API, not in the bridge. `AgeRangeService`
changed materially across 26.0, 26.2 and 26.4 in a single year — `isEligibleForAgeFeatures` at
26.2, `requiredRegulatoryFeatures` and `showSignificantUpdateAcknowledgment` at 26.4. A Swift app
pays that churn tax in full. An Expo app pays the same tax plus a thin wrapper, and in exchange
someone else writes the wrapper, the availability checks, and the `null`-means-unknown semantics.
On the evidence, Expo tracked these additions within the same release cycle.

The real costs are honest but modest, and you pay most of them in Swift too:

- Expo's own docs warn: "The underlying native APIs provided by Google and Apple are under active
  development. While this library is stable, it may require increased number of breaking changes."
- There is a logged build failure when the Xcode SDK is older than 26.4 (expo/expo#46365:
  `'AgeRangeService' has no member 'showSignificantUpdateAcknowledgment'`). You are coupled to
  recent Xcode. You would be in Swift too, and Apple's April 2026 minimum-SDK requirement forces
  this regardless.
- Every call has three-valued logic (`true` / `false` / `null`) and `null` must be treated as
  "unknown", not "no". This is a real source of compliance bugs and needs a single well-tested
  gating function with unit tests for all nine combinations of `(eligible, declaration, bound)`.
  Write it once, test it properly, never touch it again.

**Verdict: age assurance is a maintenance *tax*, not a maintenance *blocker*, and it is
substantially framework-independent.** The one thing that *would* tip the balance — needing
PermissionKit's parental-consent flow — is a thing an adults-only app does not need.

### 2.3 Third-party age assurance vendors

**You probably do not need one in v1, and that is the finding that matters.** Per C-4, Declared
Age Range satisfies Texas/Utah/Louisiana-style app-store laws. Per §5.5 of the compliance
research, it does *not* satisfy UK OSA "highly effective" age assurance — but Part 5 duties only
bite on the web rail. **Cut the web catalogue from v1 and the entire vendor question disappears**,
along with the adult payment processor and card-network registration. See §5.4.

If and when you do need one, order-of-magnitude pricing (see the source-quality caveat below):

| Vendor | RN SDK | Reported pricing | Notes |
| --- | --- | --- | --- |
| **Yoti** | Reported yes | Quote only; third-party estimates $1.50–$3.00+/verification | Strongest UK regulatory recognition and accuracy record; opaque pricing, annual contracts |
| **Persona** | Mobile SDKs; RN wrapper | Quote only; ~$0.85/check reported by third parties | Developer-first, no-code workflow builder; good fit if you want to compose your own flow |
| **Incode** | Reported yes | Contact-sales at all tiers | Enterprise/bank positioning, likely minimums; overkill here |
| **VerifyMy / VerifyMyAge** | Not established | Low per-check, plugin-oriented | Built for e-commerce plugins (Shopify/WooCommerce), not mobile-first |
| **k-ID** | Platform integration | Platform pricing, annual | Oriented at games and child-safety compliance, not an adult gate |
| **Didit** | API-first | Publishes $0.10/estimate, $0.30/KYC | Cheapest published rate; a vendor's own comparison blog is one of the sources, so discount accordingly |

Market shape: **$0.10–$0.50 per facial age estimation; $0.85–$3.00+ per document check with
liveness and face match.** Most vendors are quote-only with annual minimums.

**Source-quality warning, stated plainly:** the pricing above comes from SEO comparison sites
(`teamdisquantified.org`, `beverified.org`, `primebiometry.com`) and one vendor's own blog
(`didit.me`). These are not authoritative. The *order of magnitude* is consistent across them and
matches the shape of this market, but do not put any of these numbers in a financial model. Get
three written quotes. Also ask every vendor two questions the marketing pages never answer: (a)
do you permit adult-content clients at all, and (b) what is your data-retention default — because
for this product, a vendor that retains selfies is a privacy liability that undoes §4.4.

**Cost sanity check if you do need it:** at 10,000 sign-ups and $0.30/check, that is $3,000
one-off — real but not decision-changing. The integration and its ongoing maintenance cost more
than the checks.

---

## 3. Review of the existing Python pipeline

### 3.1 Overall assessment

**This is good code, and better than most of what I see in this position.** Pure functions over
numpy arrays, frozen dataclass presets, no hidden state, no I/O in the DSP layer, deterministic
by construction, and — unusually — docstrings that explain *why* a choice was made against
convention rather than restating what the code does. The near-field ILD model in `hrtf.py` is
genuinely well-reasoned, and the decision to add only the incremental term above KEMAR's far-field
measurement (rather than double-applying) shows real understanding. The channel-order bug recorded
in `07-audio-pipeline-validation.md` was caught the right way, and the conclusion drawn from it —
"spatial defects are not reliably audible but are trivially measurable, so interaural measurement
belongs in permanent QC" — is the correct instinct for a studio operating faster than humans can
listen.

The architectural *shape* will hold up to hundreds of episodes. What will not hold up is the
layer above it, which does not exist yet, and three measured defects that make it impossible to
run the pipeline at real episode length on ordinary hardware.

### 3.2 Measured performance at real episode length

Measured end-to-end (mono → voice chain → moving binaural → bed → 48 kHz → master → QC), scaling
linearly and confirmed at two lengths:

| Stage | 5-min episode | 12-min episode | Share | Rate |
| --- | --- | --- | --- | --- |
| `render_binaural_path` | 13.68 s | 33.12 s | 44% | 0.046× realtime |
| `normalise` | 6.10 s | 14.30 s | 19% | 0.020× realtime |
| `process_voice` | 5.53 s | 13.72 s | 18% | 0.019× realtime |
| `check_render` | 4.29 s | 10.56 s | 14% | 0.015× realtime |
| `room_tone` | 0.98 s | 2.07 s | 3% | 0.003× realtime |
| `resample_to` 44.1→48k | 0.48 s | 1.21 s | 2% | 0.002× realtime |
| `mix_bed` | 0.06 s | 0.15 s | 0.2% | — |
| **Total** | **31.1 s** | **75.1 s** | | **0.104× realtime** |
| **Peak RSS** | **3.18 GB** | **7.49 GB** | | |

**Extrapolated to a 20-minute episode: ~125 s CPU and ~12.5 GB peak RSS.**

The runtime is fine. **The memory is not** — it will OOM or swap-thrash a 16 GB laptop, and it
makes parallelism impossible, which is the one thing you need when rendering thousands of variants.

### 3.3 The envelope follower, as asked

`voice_chain.py:134-147`, `_envelope_follower`, is a per-sample Python loop:

```python
for i, m in enumerate(mag):
    coeff = atk if m > prev else rel
    prev = coeff * prev + (1.0 - coeff) * m
    env[i] = prev
```

**Measured: 5.59 M samples/s**, stable across input sizes. A 20-minute episode at 44.1 kHz is
52.92 M samples → **9.5 s per call**. It is called twice per `process_voice` (once in `_deess`
at line 205, once in `_compress` at line 178) → **~19 s per episode**, about 15% of total
pipeline time. An equivalent single-coefficient one-pole via `scipy.signal.lfilter` on the same
data measures **174.8 M samples/s** — the loop is **~31× slower** than the vectorised equivalent.

Across a 7,200-variant catalogue that is 38 hours of pure interpreter overhead. Not fatal, but
free to remove.

**Why you cannot just use `lfilter`:** the coefficient switches on `m > prev`, so this is a
nonlinear recurrence, not an LTI filter. Three fixes, ranked:

1. **Control-rate envelope (my recommendation).** Compute a block-peak signal at ~2 kHz control
   rate, run the branching recurrence over ~40 k samples instead of 52.9 M, then `np.interp` back
   to sample rate. The fastest attack in use is the de-esser's 1.5 ms, so a 0.5 ms control period
   resolves it. ~1,300× fewer iterations, pure numpy, **no new dependency**, and the smoothing is
   arguably more musical than sample-accurate peak following.
2. **`numba.njit` on the existing loop.** A one-line decorator, bit-identical output, expect
   100–300×. Costs one dependency and JIT warm-up. Take this if you want zero behaviour change.
3. **Two-pass `lfilter` max approximation.** Fast but not equivalent. **Don't** — it silently
   changes every render and destroys golden-file reproducibility.

Whichever you pick, land it behind a golden-file test asserting the new implementation matches the
old within a stated tolerance. This is exactly the kind of change that is invisible until you
notice the whole back catalogue sounds slightly different.

### 3.4 The memory bug — highest-leverage fix in the codebase

`master.py:44-50`, `true_peak_dbtp`, calls `resample_poly(x, 4, 1)` on the **whole array**. For a
20-minute stereo float64 episode at 48 kHz the input is 1.15 GB and the 4× oversampled copy is
4.6 GB. Measured: a 2-minute stereo input (92 MB) causes **737 MB of Python allocation — 8× the
input.** Extrapolated to 20 minutes: **~7.4 GB in a single call.**

And it is called **three times per render**: twice inside `normalise` (once via
`_limit_true_peak` at line 59, once for the returned measurement at line 107) and once in
`check_render` at line 125.

**Fix:** chunk it. Process 10-second blocks with `oversample=4`, overlap by the resampling
filter length to avoid edge artefacts, and keep a running max. Ten lines. This takes peak RSS from
~12.5 GB to well under 1 GB, restores single-episode rendering on a laptop, and makes 4-way
parallelism possible on a modest box. Do this before anything else.

**Also:** switch the whole pipeline to `float32` except the loudness meter. That halves memory for
free. 24-bit delivery needs ~144 dB of dynamic range, which float32's 24-bit mantissa covers
comfortably.

### 3.5 Correctness findings

Ordered by how much they will hurt. Every ✅ was reproduced on this checkout.

| # | Location | Finding | Verified |
| --- | --- | --- | --- |
| **C1** | `master.py:53-62` + `qc.py:147` | **A single 2 ms transient can fail an entire render, with two misleading messages.** `_limit_true_peak` is a static whole-file gain trim, so one close-mic mouth click pulls the whole episode down. `normalise` does not re-normalise after trimming, so `output_lufs` drifts off target, and `check_render` then fails it. Reproduced: a 40 s whisper with one 2 ms click at 0.8 → peak-to-loudness ratio 26.3 dB → output lands at **−27.76 LUFS instead of −22.0** and QC reports *both* "integrated loudness off target" *and* "loudness range 0.2 LU — the chain over-compressed it", neither of which is what happened. The trigger is any peak-to-loudness ratio above ~21.5 dB (target −22 LUFS, ceiling −1.5 dBTP). **For an ASMR product built on close-mic mouth detail, that is a routine input, not a pathological one.** Fix: iterate normalise↔trim to convergence, or use a short look-ahead limiter on the few offending peaks, and report the trim separately from the loudness error | ✅ |
| **C2** | `qc.py:91-95, 171-174` | **A centred render always fails QC.** `_stereo_correlation` returns 1.0 for a genuinely centred source, and line 171 fails anything above 0.98 as "the binaural image has collapsed to mono". Reproduced: `Placement(azimuth_deg=0.0, distance_m=0.20)` → correlation **+1.0000**, binaural check **fails**. At just 5° off-centre it drops to −0.09, so the gate is fine for lateral placement — but `07-audio-pipeline-validation.md` itself records "Ahead, 60 cm → corr +1.000", i.e. the documented validation output contains the failing case. Fix: condition the gate on the render's declared placement, or measure only over spans where placement is lateral | ✅ |
| **C3** | `voice_chain.py:263` | **`np.repeat(gain, hop)` reintroduces the steps the previous line smoothed.** `_emphasise_breath` smooths gain across *frames* with a 3-tap kernel, then expands it per-sample with `np.repeat` — producing step discontinuities of up to 2.5 dB every 20 ms. The docstring at line 256 says "Smooth across frames so gain changes are inaudible"; a 2.5 dB step at 50 Hz is an audible zipper/AM artefact, and it lands squarely on the mouth detail the product sells. Fix: `np.interp` onto sample indices at frame centres | — |
| **C4** | `hrtf.py:276-286` | **Per-block IIR state reset.** `render_binaural_path` calls `render_binaural` once per block, and `render_binaural` runs `_split_low_high` and `_low_shelf` through `lfilter` with **zero initial state every time** — ~51,700 filter restarts per 20-minute episode, each with a settling transient in exactly the low-frequency band the near-field ILD cue lives in. The Hann overlap-add partly masks it. Fix: hoist the ILD and proximity stages out of the block loop entirely and apply them once with time-varying gains from `np.interp` over the waypoints. **Faster *and* more correct** | — |
| **C5** | `validate_chain.py:205-206` | **The check that would have caught C4 is near-vacuous.** `np.sum(np.abs(np.diff(moving, axis=0)) > 0.5)` on a signal peaking near 0.1 cannot fire — 0.5 is ~10,000× above audibility for a click. Fix: compare against a reference full-length static render, or threshold relative to local RMS | — |
| **C6** | `beds.py:108-113` | **Same reset bug in the focus soundscape.** `drifting_soundscape` designs a fresh `butter` SOS per 0.25 s block and `sosfilt`s with zero state, so the "slowly drifting" filter discontinues **4× per second**. For audio whose sole requirement is never to draw attention, that is precisely the wrong failure mode. Fix: carry `zi` between blocks, or interpolate between two fixed filters | — |
| **C7** | `voice_chain.py:201-203, 209` | **Subtractive de-esser split is not phase-complementary.** `rest = x - band` where `band` is a 2nd-order Butterworth *bandpass* (4th order overall). Recombining `rest + band*g` for `g < 1` produces magnitude ripple and cancellation outside the intended band. It is exactly unity at `g = 1`, so **the defect is invisible whenever the de-esser isn't working and appears only when it is.** Note the same pattern in `hrtf._split_low_high` is fine — a first-order lowpass and `x - low` are exactly complementary. Fix: Linkwitz-Riley complementary pair, or move to STFT-domain gain | — |
| **C8** | `qc.py:98-107` | **`_hf_energy_ratio` judges a 20-minute episode by its first 30 seconds.** `n = min(mono.size, rate * 30)`. The opening is typically the quietest, most whispered passage, so the ASMR-detail warning is measured on the least representative part of the file. Fix: Welch-average across the whole file | — |
| **C9** | `qc.py:56-71` | **LRA is ungated and therefore wrong in the permissive direction.** EBU R128 loudness range uses short-term loudness with a **−20 LU relative gate**; this implementation takes raw 95th−10th percentiles with no gating. This product is *full* of near-silence by design, so ungated quiet passages drag the 10th percentile down and inflate LRA. Since QC *fails* renders below 5 LU, an inflated metric means the over-compression gate under-detects. Also 3× redundant work (3 s window, 1 s hop, full re-filter each call, ~1,200 calls for 20 min). Fix: implement gated short-term loudness properly — and re-derive the 5 LU threshold afterwards, because its meaning changes | — |
| **C10** | `qc.py:184-228` | **Whole-episode WER averages away exactly the failures it exists to catch.** One catastrophically mangled sentence in a 2,600-word episode is ~0.4% WER and sails through the 5% gate while being immersion-breaking. Fix: sliding-window WER (say 50 words) and fail on the **worst** window, not the mean. **This is the single most valuable QC improvement available** — 07 correctly calls transcript verification the highest-leverage check, and this is what makes it actually work | — |
| **C11** | `qc.py:197-199` | **Transcript normalisation is too weak for its own threshold.** Lowercasing and stripping punctuation does not expand contractions or numbers, so "there is" vs "there's" scores as an error. `validate_chain.py:231-235` demonstrates this itself: a transcript with two trivial contraction differences scores **14.3%** and fails a 5% gate. As written, the gate will reject good renders. Fix: contraction and number normalisation, then re-tune the threshold | ✅ |
| **C12** | `hrtf.py:89-101` | **`@lru_cache` on an instance method.** The cache key includes `self`, so the module-level cache holds a permanent strong reference to every `KemarHrtf` ever constructed. In a long-running batch worker that is an unbounded leak. Fix: a module-level loader keyed on `(root, elevation, azimuth)`, or `functools.cached_property` over a prebuilt index | — |
| **C13** | `hrtf.py:106-112` | **Directory glob on every HRIR lookup.** `_available_azimuths` globs `elev{n}/*.dat` per call. Measured: `far_field_hrir` costs 88 µs, of which **81 µs is the glob** — 92% filesystem overhead. Called once per block in `render_binaural_path` → ~4.2 s of pure `glob()` per 20-minute episode. Fix: build the azimuth index once in `__init__` | ✅ |
| **C14** | `beds.py:47-64` | **`level_db` is a peak spec masquerading as a level.** `room_tone` normalises by **peak**, so `level_db=-48.0` delivers an RMS of about **−56 dBFS**, and the offset varies with the noise's crest factor: measured 7.68–8.52 dB across four seeds. So the operator's bed gain staging is ~8 dB from the naive reading and is not reproducible to better than ±0.4 dB across seeds. Fix: normalise by RMS, and rename or document the parameter | ✅ |
| **C15** | `master.py:90-108` | **`normalise` trusts `target.rate` and never checks the array.** Passing a 44.1 kHz array with `MasterTarget(rate=48000)` silently mis-measures loudness with no error. Given that `validate_chain` deliberately works at two rates, this is a live foot-gun. Fix: take `rate` as an explicit argument, or assert | — |
| **C16** | `voice_chain.py:101-116` | Minor: bilinear transform without frequency pre-warping. I expected this to matter and **measured that it does not** — worst-case deviation from the analogue prototype is **+0.42 dB** near Nyquist, +0.24 dB at the 9 kHz shelf corner. Worth a note only because the error differs between 44.1 and 48 kHz (+0.243 vs +0.203 dB at 9 kHz), so the same preset is not bit-identical across rates. Fine to leave; do not claim rate-independent reproducibility | ✅ |

Minor hygiene: unused `field` import (`voice_chain.py:26`); function-level `from scipy.signal import
lfilter` inside `_shelf` and `_peaking` (lines 114, 129) executed on every call; `validate_chain.py`
imports the private `_loudness_range` (line 158), which means it should be public.

### 3.6 Architecture and testability

**Three gaps, all of which get worse with scale:**

**1. Zero tests.** `validate_chain.py` is a good *document* — it explains the pipeline while
exercising it, and I would keep it for that. But it prints prose and returns non-zero based on one
QC report, so almost none of it is assertable in CI. What is needed:

- **Golden-file tests** for `process_voice` and `render_binaural` on a short fixed input, hashing
  the output array. This is the only thing that will catch an accidental re-voicing of the whole
  catalogue by a dependency bump.
- **Property tests** for `near_field_ild_db` — zero at 1.4 m, zero at azimuth 0 for any distance,
  antisymmetric in azimuth, monotonically increasing as distance decreases. These are exactly the
  invariants 07 asserts in prose; make them executable.
- **Unit tests per QC gate** with synthetic pass/fail signals, explicitly including the C1
  transient case and the C2 centred case. Both of those are currently latent because nothing tests
  them.
- **A round-trip test** that `resample_to` → `normalise` lands within tolerance.

**2. No dependency pinning, no package metadata.** There is no `pyproject.toml` and no
`requirements.txt`; `import studio` only works from the repo root (I had to set `PYTHONPATH` to
run anything). For a pipeline whose docstring promises "a render is reproducible from a
version-controlled preset", unpinned scipy is a live hazard: filter design and `resample_poly` are
implementation details that can change across minor versions and silently re-render your library
differently. Add `pyproject.toml`, pin with a lockfile, and record resolved versions in each
render's manifest.

**3. No layer above the DSP.** This is the real gap, and it is what will bite at a hundred
episodes. There is no job model, no manifest, no idempotency, no resumability, no content
addressing, and no way to answer "which pipeline version produced this file?" Nothing stamps a
version into the output — `VoicePreset` is correctly frozen, but no digest of it reaches the
rendered artefact.

**Concretely, build this next** (and *not* more DSP):

```python
PIPELINE_VERSION = 7

def render_key(script_sha, voice_id, preset, target, hrtf_set_id, encoder) -> str:
    """Stable content address. Any input change ⇒ new key ⇒ new immutable object."""
    return sha256_of(script_sha, voice_id, asdict(preset), asdict(target),
                     hrtf_set_id, encoder, PIPELINE_VERSION)[:16]
```

Write a JSON manifest next to every audio file containing that key, all inputs, the QC report, and
the resolved dependency versions. This is the same key the CDN cache uses (§4.3), so it does double
duty.

**What to keep, explicitly:** the pure-function style, the frozen dataclass presets, the absence of
I/O in the DSP layer, and the docstrings-explaining-why convention. Do not refactor these into
classes or a plugin framework. The current design is right and it will scale.

### 3.7 Is Python right, and where should it run?

**Python is right. Keep it.** numpy/scipy/pyloudnorm/soundfile are precisely the correct tools,
and the measured cost destroys any performance argument for a rewrite: **0.104× realtime**, which
is ~250 CPU-hours (≈$10–15 of spot compute) for a 7,200-variant catalogue of 20-minute episodes.
The bottleneck is TTS API latency and human editorial throughput. Rewriting in Rust would optimise
1% of the wall clock and cost you the ability to iterate on the sound, which is the *one thing*
this codebase exists to do.

**GPU: no, for the DSP.** FFT convolution with a 128-tap HRIR is trivially cheap and the pipeline
is not close to compute-bound. GPU only matters if you self-host TTS, or for the ASR round-trip in
QC: transcribing 2,400 hours through faster-whisper on one T4/L4 at ~15× realtime is ~160
GPU-hours, roughly $50–150 on spot — worth it against per-minute hosted ASR pricing at that volume.

**Where each thing runs:**

| Workload | Where | Why |
| --- | --- | --- |
| Single-episode iteration | **Laptop** | This is the creative loop and it is sacred. Today it does not work (12.5 GB peak, §3.4); after the chunking fix it is ~1 GB and ~2 min |
| Tests, golden files, lint, one smoke render per PR | **GitHub Actions** | Exactly the right tool. Fast, free at this scale, and it is what stops a scipy bump silently re-voicing the catalogue |
| Bulk renders | **One on-demand VM** (16 vCPU, ~$0.30–0.60/hr spot), pulling from `pgmq`, writing to R2, shutting itself down | Actions is wrong here: ~6 h job limit, 4 vCPU / 16 GB runners, and you would pay for idle minutes while a TTS API streams |
| ASR QC pass | **Same VM, or one GPU box for a batch sweep** | Bounded, parallel, and the only genuinely GPU-shaped work |

That is one worker script and one systemd unit. It satisfies the plan's own criterion — a batch
toolchain that cannot page anyone at 3am — which the current shape does not, because there is no
worker at all.

---

## 4. The lazy-render cache architecture

### 4.1 The economics, computed

The plan treats storage growth as the risk. **It is not, by two orders of magnitude.**

Grid as specified: 200 stories × 6 voices × 3 intensities × 2 POVs = **7,200 variants**, ~30 MiB
each = 216,000 MiB = **226.5 GB**.

| Cost line | Amount | Notes |
| --- | --- | --- |
| **Storage — Cloudflare R2** | **$3.40/mo** | $0.015/GB-mo, **zero egress fees** |
| Storage — Backblaze B2 | $1.36/mo | $0.006/GB-mo |
| Storage — Supabase Storage | $4.76/mo | $0.021/GB-mo |
| Storage — S3 Standard | $5.21/mo | $0.023/GB-mo, plus egress |
| With Length axis too (×2, using 07's 1.88 MiB/min → 37.6 + 11.3 MiB) | 369 GB → **$5.54/mo on R2** | Still a rounding error |
| **DSP compute, whole catalogue** | **~$10–15** | 144,000 min × 0.104× realtime (§3.2) = ~250 CPU-hours on spot |
| **TTS, whole catalogue** | **$7,200–$28,800** | 7,200 × 20 min = 2,400 audio-hours, at $0.05–0.20/min |
| CDN egress per subscriber | $0.067/mo on CloudFront ($0.085/GB); **$0 on R2** | 20 episodes/mo × 37.6 MiB = 0.79 GB. 1.15% of $70/yr revenue |
| Egress at 10,000 subscribers | $670/mo on CloudFront; **$0 on R2** | |

**Three conclusions, and they reframe the whole design:**

1. **Storage is free. Stop optimising it.** $3–6/month for the complete combinatorial library.
   Any design that trades storage for anything else is trading the wrong way.
2. **TTS is 99.9% of the marginal cost of a variant.** So the lazy-render cache's *only* real job
   is deferring TTS spend. Every other justification for it evaporates. Say that out loud and the
   design question becomes much simpler: *is deferring $7k–29k of TTS worth a cold-start
   pathology?*
3. **Use Cloudflare R2 (or Bunny), not S3+CloudFront.** Zero egress removes the one cost line that
   scales with success, and removes the tail risk of a viral moment producing a surprise bill on an
   adult-content product you cannot easily explain to a finance department.

### 4.2 Why lazy rendering fails, with a number

**Cold-start latency for the first listener, honestly estimated:**

| Step | Time |
| --- | --- |
| TTS synthesis of a ~18,000-character script | 4+ min even at 5× realtime |
| DSP pipeline (measured, §3.2) | ~2 min |
| ASR round-trip QC (Whisper over 20 min) | 1–3 min |
| Encode + upload + CDN propagation | ~30 s |
| **Total** | **~8–12 minutes** |

**There is no acceptable UX for that.** Not a spinner, not a push notification, not "we're
preparing your story" — because the request happens at the moment of highest intent and lowest
patience in the entire product, and this product's whole premise is dropping someone into a mood.
An 8-minute wait does not delay the experience; it destroys the thing being sold.

**And it can fail.** The pipeline has QC gates that reject renders, and two of them currently
produce false failures (C1, C2, C11). So the first listener to request a variant may wait ten
minutes for nothing, and there is no human in the loop to notice.

**Three further problems the plan does not address:**

1. **The audio ships to a user before any human has heard it.** §6 makes the human editorial gate
   "non-negotiable; also the compliance gate" — and it is, on the *script*. But TTS is where
   mispronunciation, dropped lines, and wrong emotional reads are *created*, and lazy rendering
   means the first listener of every variant is the QA. For a product whose entire differentiation
   is craft, and where a botched intimate line is not a bug but an embarrassment, that is the wrong
   trade. It also weakens the C-12 compliance story ("a documented human review step with a
   written standard and an audit trail") — reviewing scripts but never the delivered audio is a
   thinner record than it sounds.
2. **Supabase cannot run the render.** Edge Functions are **256 MB memory, 400 s wall clock,
   200 ms–2 s CPU**. They cannot hold a 1 GB array, cannot run ffmpeg, and cannot survive an
   8-minute job. The §6 diagram's "lazy-render job queue" on Supabase is fine as a *queue*
   (`pgmq` in Postgres is genuinely the right choice, and `pg_net` or a webhook can wake a worker)
   but misleading about the *work*. The worker must be an external VM.
3. **Thundering herd.** A newsletter or an App Store feature drives many first-requests at once,
   each triggering a distinct multi-minute TTS job. You need per-key locking and deduplication
   from day one, which is real distributed-systems work in a product that has no other need for it.

### 4.3 What I would build instead

**Eager batch rendering of a much smaller grid, plus content addressing.**

**Cut the grid by 83% for v1:**

| | Plan | v1 | Rationale |
| --- | --- | --- | --- |
| Stories | 200 | 200 | The catalogue-depth thesis needs this |
| Voices | 6 | **3** | Highest-value axis per the plan; three is enough to feel like a choice |
| Intensities | 3 | **2** | Genuinely re-authored text; two poles read as a dial |
| POV | 2 | **1** | Lowest value per unit of cost. Add later, measured |
| Length | 2 | **1** | Ship the 20-min cut; a 6-min cut is a separate authored script, not a trim |
| **Variants** | 7,200 | **1,200** | **47 GB, $0.71/mo, 400 TTS-hours** |

1,200 variants is 400 hours of unique produced audio. That is already a large catalogue by this
category's standards, and it costs $1,200–8,000 of TTS to build eagerly, up front, with a human
listening to a sample of every voice×intensity pair. Then *measure which combinations get
requested* and expand along the axis that people actually use, in nightly batches.

**Never show a variant that does not exist.** The UI promises only what it can deliver in 200 ms.
If you want to offer the long tail, offer it as "available tomorrow" and render it in a nightly
batch — no user ever waits, and a human can spot-check the batch before it unlocks. This converts
a latency problem into a scheduling problem, and scheduling problems do not embarrass you.

**Content-address everything, and never invalidate.** This is the cache-invalidation answer:

```
render_key = sha256(script_sha, voice_id, preset_digest, master_target_digest,
                    hrtf_set_id, pipeline_version, encoder_settings)[:16]
path        = /audio/{render_key}.m4a          # immutable, Cache-Control: immutable, max-age=1y
```

The catalogue row points at a key. Editing a script produces a new `script_sha` → a new key → a
new object; the old one is untouched and any listener mid-episode keeps a working URL. Nothing is
ever purged, so there is no invalidation logic, no CDN purge API, no stale-read window, and no
"why is the app playing the old version" bug — a class of bug that is genuinely painful to debug
because it reproduces only for users whose CDN edge is stale. Reclaim space with a lifecycle rule
on objects unreferenced by any catalogue row for N days. **This is a ~30-line change now and a
migration later.** Do it now. It also means bumping `pipeline_version` after fixing C1–C14 causes a
clean, auditable re-render rather than a mysterious mixed-vintage library.

**Is the combinatorial explosion manageable?** Yes — but only because you control the multiplier,
and only if you resist adding axes. Each new axis multiplies TTS cost, human review surface, and
catalogue-metadata complexity. The right discipline: **an axis must earn its multiplier with
measured retention data before it ships.** Voice earns it on the plan's own reasoning. POV, length,
and name do not have evidence yet.

### 4.4 The name-whisper feature

The plan calls this "trivially cheap, disproportionately intimate" and likely "the strongest
'how did it know' moment available to us". I think the *instinct* is right and the *implementation
described* — "a single-word render, spliced at marked points" — will sound broken. Four reasons,
of which only one is easy:

1. **Prosody, and this is the killer.** A name inside "Come here, Sarah" carries a pitch contour
   that continues the sentence's intonation and its stress pattern. An isolated render of "Sarah"
   has phrase-final falling intonation and full lexical stress. Spliced in, it sounds like a
   robocall inserting your name into a script — the *exact* uncanny register this product cannot
   afford, arriving at the moment of maximum intimacy. Uncanniness destroys arousal, as the plan
   itself argues in §2.
2. **Co-articulation.** The phoneme boundary between the preceding word and the name is not a cut
   point in natural speech. Splicing there produces a glottal discontinuity.
3. **Binaural placement continuity.** If the voice is on a moving path, the name must be rendered
   at the interpolated placement for its exact timestamp. The pipeline *can* do this
   (`render_binaural_path.placement_at`) but does not expose it.
4. **Room tone.** The genuinely easy one. The pipeline is deterministic and parameterised, so
   rendering the name through the identical `VoicePreset`, the same bed, and the same
   `MasterTarget` matches the noise floor exactly. Room tone is not the problem; everyone assumes
   it is.

**How I would actually implement it — and it is realistic in exactly one form:**

Do not splice a word. **Splice a file, at a designed silence.** Specifically: make the name-bearing
audio a **separate short "greeting" file** covering the first ~20–30 seconds of the episode, ending
on a deliberate breath and ≥400 ms of room tone. The player plays greeting → body as a two-item
gapless sequence, or the server concatenates them at delivery.

Why this works where splicing does not:

- The greeting is synthesised as **one whole utterance**, so prosody and co-articulation are
  correct by construction — the TTS engine produced the name in context.
- The join lands inside room tone at a breath, where a boundary is not only inaudible but *reads
  as intentional* — intimate audio is full of pauses.
- **It multiplies almost nothing.** 100 names × 3 voices × 30 s ≈ 1.1 GB total, and it is
  independent of story, intensity and POV, because the greeting is a shared frame. Compare with
  in-body name slots: 8 slots × 200 names × 7,200 variants is arithmetic you do not want to do.
- It is separately cacheable and separately reviewable — a human can listen to 300 greetings once
  and be done forever.

**My recommendation: cut it from v1 anyway**, and ship it as the greeting design in v1.1 once the
core is proven. It touches the newest, least-tested part of the pipeline (segment concatenation and
gapless playback, which is also the weakest part of `expo-audio`), and it is the feature most
likely to produce a "that was creepy" review rather than a "how did it know" one. Test the
hypothesis with 100 users and a hand-made greeting before building the machinery.

---

## 5. Overall

### 5.1 Recommended architecture

```
STUDIO (offline batch — a repo of scripts, plus the orchestration layer that is missing)
  story bible → LLM outline/draft/critique → HUMAN EDITORIAL GATE
    → script JSON (beats, breath, pause, intensity variants)
      → TTS per voice   [two vendors behind one interface; raw output archived forever]
        → voice chain → binaural → bed → master        [float32; chunked peak measurement]
          → QC: loudness (gated LRA) · true peak · windowed WER · interaural cues
            → manifest {render_key, all inputs, QC report, resolved dep versions}
              → R2 at /audio/{render_key}.m4a, immutable, cached forever

ORCHESTRATION (the piece that does not exist yet — build this next)
  pgmq queue in Supabase Postgres
    → one on-demand VM worker (16 vCPU spot): claim → render → QC → upload → update row → exit
      idempotent on render_key · resumable · no partial writes

APP (Expo SDK 57+)
  expo-audio (playback, lock screen, background)
  expo-file-system (background download; filesystem is the source of truth, not JS state)
  expo-age-range (Declared Age Range gate)
  expo-local-authentication (Face ID — gates playback resumption, not just app entry)
  local AudioSessionPolicy module (~250 lines Swift: route observation, category options,
    remote-command policy — the CarPlay fix)
  catalogue metadata cached locally · hand-curated ordering · RevenueCat entitlements

BACKEND (Supabase — genuinely thin, and now honestly scoped)
  catalogue tables · signed URLs · pgmq queue · RevenueCat webhooks
  App Store Server Notifications incl. RESCIND_CONSENT
  NOT the renderer — 256 MB / 400 s / 2 s CPU makes that impossible
```

Changes from the plan's §6 sketch: R2 instead of a generic CDN; content-addressed immutable
objects; an explicit orchestration layer; an explicit native module; eager rather than lazy
rendering; and Supabase's role narrowed to what it can actually do.

### 5.2 Honest assessment of the ongoing maintenance burden

**The app is genuinely low-burden. The product is not.** The plan's §4.3 reasoning is sound but it
proves a narrower claim than it appears to: *the client* is cheap to maintain. The product carries
five other maintenance streams that the architecture sketch does not show.

| Stream | Burden | Notes |
| --- | --- | --- |
| iOS client | **Low** | One Expo SDK upgrade per major release, plus one small native module touching decade-stable APIs |
| Age-assurance compliance | **Medium, and involuntary** | Apple's APIs changed three times in twelve months (26.0 → 26.2 → 26.4). New states keep arriving: Utah full compliance May 2027, Alabama Jan 2027, California Jan 2027, Illinois 2028, Colorado 2028. **You must ship app updates to remain legal, on someone else's schedule** |
| Studio pipeline | **Medium** | The DSP itself is stable once C1–C14 are fixed. The churn is in TTS vendor APIs, voice deprecations, and prompt/quality drift |
| TTS vendor risk | **High and discontinuous** | Per C-8, every viable vendor reserves discretion. A policy change does not degrade the product, it stops all new content overnight. Mitigation is architectural: two vendors behind one interface from day one, and archive every raw TTS output — the rendered back-catalogue is an asset you own, the ability to render more is rented |
| Editorial | **High, and it is a person, not code** | The human gate is the compliance control *and* the quality control. It does not automate, it does not scale with cleverness, and it is the actual bottleneck on catalogue growth. Budget it as a standing cost, not a launch task |
| App Store relationship | **Unbounded** | Per open question 6, you live on enforcement discretion rather than a rule. Not engineering-addressable; only reducible by editorial conservatism and honest review notes |

**The candid summary:** a solo developer can maintain the *client* indefinitely. The system's real
cost is that it demands six specialisms — iOS, DSP, LLM pipeline ops, TTS vendor management,
compliance, and editorial judgement — and the last two do not compress with engineering skill.
Every cut in §5.4 is chosen to reduce the *number of streams*, not the lines of code, because
stream count is what actually exhausts a small team.

### 5.3 Top 10 engineering risks, ranked

Ranked by expected damage × likelihood, with the honest note that #1 and #2 are not
engineering-solvable — which is itself the most important thing on the list.

| # | Risk | Why it ranks here | Mitigation |
| --- | --- | --- | --- |
| **1** | **TTS vendor terminates or reclassifies you** | Per C-8 every viable vendor reserves "sole discretion". Not a degradation — content production stops dead. Highest product-ending risk that engineering can actually blunt | Two vendors behind one interface from day one; archive every raw TTS output; keep the voice roster reproducible from archived audio |
| **2** | **App Store rejection or removal** | Existential, and per open question 6 you live on enforcement discretion, not a rule. Precedent from AI-companion removals is directly relevant | Wellness-first listing (C-6); editorial gate enforcing "erotic or sensual dialog" not explicit description; disclose the whole architecture in review notes; no UGC, no chatbot, no prompt box |
| **3** | **Age-assurance API churn as a forced-upgrade treadmill** | Three Apple API revisions in twelve months; Expo's own docs warn of elevated breaking changes; build failures already logged on SDK skew (#46365). Recurring, involuntary, and legally load-bearing | One well-tested gating function handling all `(eligible, declaration, bound)` combinations including every `null`; treat `null` as unknown; pin Xcode; budget one compliance release per iOS minor |
| **4** | **CarPlay/AirPlay auto-play discloses the app** | Documented competitor precedent (the Quinn review). For this product a playback bug is a privacy incident. Currently **unmitigable from Expo alone** | Deactivate session and clear lock-screen controls when idle (available today); native module for route-change refusal and remote-command veto; gate playback resumption behind Face ID |
| **5** | **Pipeline cannot run at real episode length** | Measured 12.5 GB peak RSS for 20 minutes. Blocks laptop iteration (the creative loop) and all parallelism (the scale path). Certain, not probabilistic | Chunk `true_peak_dbtp`; move to float32. One function, ten lines, ~12× memory reduction |
| **6** | **QC gates produce false failures and miss true ones** | C1 fails a whole render on one 2 ms mouth click *with a misleading message*; C2 fails every centred render; C11's threshold rejects good transcripts; C10's whole-episode WER passes the failures it exists to catch. A QC system that cries wolf gets disabled, and then nothing is checked | Fix C1, C2, C10, C11; add per-gate unit tests with synthetic pass/fail signals |
| **7** | **No tests and no dependency pinning under a reproducibility claim** | A scipy minor bump can silently change filter design or `resample_poly` and re-voice the entire library. You would not find out from a stack trace; you would find out from reviews | `pyproject.toml` + lockfile; golden-file tests; property tests for the ILD invariants; record resolved versions in every manifest |
| **8** | **Catalogue/artefact drift without content addressing** | 1,200–7,200 rows pointing at mutable paths. Silent mismatch between what the app thinks it is playing and what is on the CDN — reproducible only for users on a stale edge, i.e. the worst debugging experience available | Content-address now (§4.3). 30 lines today, a migration later |
| **9** | **Audio dependency instability** | `expo-av` removed, RNTP V4 abandoned, RNTP V5 at €999/yr, `expo-audio` young and moving weekly. Whichever you pick you are on a treadmill | Take first-party `expo-audio`; keep the player integration behind one thin internal interface (~200 lines) so a swap is bounded |
| **10** | **Offline download reliability at 25–38 MiB × 10** | Native transfers survive suspension but the JS `DownloadTask` does not survive termination. Silent partial state on the device that the app cannot see | Filesystem as source of truth; reconcile on launch against expected byte count and checksum; never persist task handles |

Just below the line, and worth naming: solo-dev bus factor across six specialisms; and payment-rail
risk (card-network adult registration, ~$1,450/yr plus reporting) — which drops off the list
entirely if you take the §5.4 recommendation to cut the web tier.

### 5.4 What I would cut from v1

Ordered by maintenance burden removed per unit of product value lost.

| Cut | Removes | Value lost |
| --- | --- | --- |
| **1. The web/explicit second catalogue** | An adult payment processor, card-network registration (MCC 5967, ~$1,450/yr + complaint SLAs + periodic acquirer reporting), a third-party age-assurance vendor, a second billing system, a second content rail, and the guideline 2.3.1(a) disclosure risk. **Four maintenance streams in one cut** | An explicitness tier you have no evidence anyone is asking for yet. Bloom ships it; that does not mean it drives their retention |
| **2. Lazy render on first request** | Job-queue latency engineering, thundering-herd deduplication, per-key locking, an 8–12 min cold path, and the possibility of shipping unheard audio | Nothing a user perceives, if you only show variants that exist |
| **3. POV and Length axes** | 4× the render grid, 4× the TTS bill, 4× the human review surface | Two personalisation knobs, re-addable later on measured demand |
| **4. Live multi-stem gain (3 simultaneous players)** | Player drift, phasing, lock-screen ownership bugs, and — if taken seriously — the entire argument for native Swift | Nothing: ship 3 pre-rendered balance variants instead (§1.4) |
| **5. Name-whisper splicing** | Segment concatenation, gapless playback (the weakest part of `expo-audio`), and a large name × variant matrix | The plan's hoped-for strongest moment. Validate it with 100 users and a hand-made greeting first, then ship it as the greeting-file design (§4.4) |
| **6. Alternate app icon** | A community native module (three competing packages, none first-party) on the exact feature the plan sells as privacy | Less than it seems — iOS shows an unsuppressable "change to this icon?" system dialog on first switch, which partly defeats the discretion purpose anyway. A neutral display name and Face ID deliver most of the benefit for none of the cost |
| **7. On-device recommendations** | A recommender, a metadata blob format, and its versioning | Nothing at 200 items. Hand-curated editorial ordering is *better* here — it is the "boutique studio" positioning made literal, and it is the founder's taste, which is the actual product |
| **8. Whispered focus bookends** | The one feature the plan itself flags as a probable anti-feature (§5, irrelevant-speech literature) | Per the plan's own reasoning, negative value |

**Explicitly keep**, because these are load-bearing and cheap:

- **The Focus room** — but as procedural soundscapes only, which `beds.py` already generates. Per
  C-6 the wellness half is the guideline 4.2 / 4.3(b) defence and gives App Review a frame other
  than "porn app". Cutting it would be a compliance error dressed as a scope cut.
- **Face ID lock** — first-party, cheap, a privacy purchase-driver, and an accidental second
  defence against the CarPlay problem.
- **Declared Age Range gating** — legally required, and one `npx expo install`.
- **The ASR round-trip QC check** — 07 is right that it is the highest-leverage automated gate. It
  just needs the windowed-WER fix (C10) to actually work.
- **The offline pre-rendered binaural bet** — it measures correct and it is what keeps the client
  simple. This is the plan's best idea and it survives review intact.

---

## Sources

**Expo / React Native audio**
- expo-audio API reference — https://docs.expo.dev/versions/latest/sdk/audio/
- expo-audio CHANGELOG — https://github.com/expo/expo/blob/main/packages/expo-audio/CHANGELOG.md
- expo-audio iOS lock-screen fix (`.playback` category at activation) — https://github.com/expo/expo/pull/40919
- expo-audio playlist lock-screen controls, next/previous — https://github.com/expo/expo/pull/46020
- Missing next/previous lock-screen commands — https://github.com/expo/expo/issues/43538
- expo-av deprecation ("not receiving patches and was removed in SDK 55") — https://github.com/expo/expo-av
- Upgrading to SDK 55 (expo-av removed) — https://expo.dev/blog/upgrading-to-sdk-55
- expo-av → expo-video/expo-audio migration (Software Mansion) — https://swmansion.com/blog/the-future-of-video-in-react-native-moving-from-expo-av-to-expo-video-6f4f78e51196/
- react-native-track-player repo (V5 commercial licensing notice, V4 frozen on `v4` branch) — https://github.com/doublesymmetry/react-native-track-player
- RNTP pricing (€99/mo, €999/yr Pro; €249/mo, €2,499/yr Studio; Launch Credit) — https://rntp.dev/pricing
- "Project dead?" — maintainer status and V5 announcement — https://github.com/doublesymmetry/react-native-track-player/issues/2582
- RNTP V4 iOS background-audio cutout with New Architecture; "We're not actively maintaining V4" — https://github.com/doublesymmetry/react-native-track-player/issues/2649
- RNTP V5 changelog / package rename to `@rntp/player` — https://npmx.dev/package-changelog/react-native-track-player-next/v/4.1.2

**Expo — downloads, biometrics, icons, plugins**
- expo-file-system (`createDownloadResumable`, `sessionType: 'background'`, JS task not restored after termination) — https://docs.expo.dev/versions/latest/sdk/filesystem/
- expo-local-authentication (Face ID; `NSFaceIDUsageDescription`; not supported in Expo Go) — https://docs.expo.dev/versions/latest/sdk/local-authentication/
- expo-alternate-app-icons — https://github.com/pchalupa/expo-alternate-app-icons
- expo-runtime-app-icon (wraps `UIApplication.setAlternateIconName`; unsuppressable system dialog) — https://www.npmjs.com/package/expo-runtime-app-icon
- Config plugins introduction — https://docs.expo.dev/config-plugins/introduction

**Age assurance**
- expo-age-range API reference (`requestAgeRangeAsync`, `isEligibleForAgeFeaturesAsync`, `getRequiredRegulatoryFeaturesAsync`, `showSignificantUpdateAcknowledgmentAsync`, `ageRangeDeclaration`) — https://docs.expo.dev/versions/latest/sdk/age-range/
- expo-age-range npm README — https://cdn.jsdelivr.net/npm/expo-age-range@57.0.2/README.md
- Initial iOS DeclaredAgeRange implementation — https://github.com/expo/expo/pull/40503
- Added `showSignificantUpdateAcknowledgment` / `getRequiredRegulatoryFeatures`; linked build failure on SDK < 26.4 (#46365) — https://github.com/expo/expo/pull/43519
- Apple DeclaredAgeRange framework — https://developer.apple.com/documentation/declaredagerange/
- Apple `AgeRangeService.RegulatoryFeature` — https://developer.apple.com/documentation/declaredagerange/agerangeservice/regulatoryfeature
- Apple developer news on age assurance (Texas) — https://developer.apple.com/news/?id=btkirlj8
- PermissionKit vs Declared Age Range: parental consent vs adult acknowledgment; `AskError.notAvailable` for adults — https://blakecrosley.com/blog/guardian-consent-permissionkit-age-rating-changes
- PermissionKit `SignificantAppUpdateTopic` usage — https://github.com/dpearson2699/swift-ios-skills/blob/main/skills/permissionkit/SKILL.md
- App Store privacy/age-verification overview 2026 (secondary; treat as orientation) — https://ravi6997.medium.com/app-store-privacy-in-2026-is-no-longer-optional-heres-what-every-ios-developer-must-know-a2fed302b684

**Age-assurance vendors** *(low source quality — SEO comparison sites and one vendor blog; order of magnitude only, get written quotes)*
- https://teamdisquantified.org/best-age-verification-software/
- https://teamdisquantified.org/yoti-age-verification/
- https://beverified.org/providers/persona/
- https://primebiometry.com/vendors/incode
- https://didit.me/blog/top-age-verification-software-alternatives-2026/

**CarPlay / AirPlay auto-play** *(no first-party API to disable it; user-side Shortcuts workaround is the documented remedy)*
- https://cartechstudio.com/blogs/apple-carplay/autoplay-carplay
- https://www.idownloadblog.com/2026/05/21/stop-auto-music-playback-in-car/
- https://www.digitaltrends.com/phones/how-to-choose-what-iphone-plays-in-the-car/
- https://discussions.apple.com/thread/254898946
- Face ID on a media app as an incidental autoplay mitigation — https://www.phonearena.com/news/stop-apple-music-from-playing-automatically-in-car_id182036

**Supabase**
- Edge Function limits (256 MB memory; 150 s free / 400 s paid wall clock; 2 s max CPU) — https://supabase.com/docs/guides/functions/limits
- Edge Function CPU limits (200 ms active compute; soft/hard limits; offload heavy work) — https://supabase.com/docs/guides/troubleshooting/edge-function-cpu-limits
- Worker timeouts; use `pgmq` / `pg_net` / webhooks for chunked processing — https://supabase.com/docs/guides/troubleshooting/edge-functions-worker-timeouts-and-websocket-drops
- Shutdown reasons — https://supabase.com/docs/guides/troubleshooting/edge-function-shutdown-reasons-explained

**Repository documents reviewed**
- `docs/plan/00-product-thesis.md` §4.2, §4.3, §6, §7
- `docs/research/02-compliance-and-legal.md` C-1, C-4, C-5, C-6, C-8, C-9, C-10, C-12, §5.5, open questions 1–8
- `docs/research/07-audio-pipeline-validation.md`
- `studio/audio/{hrtf,voice_chain,master,qc,beds}.py`, `studio/tools/validate_chain.py`

**Measurements in §3** were taken on this checkout (4 vCPU, 15 GiB RAM, Python 3.12.3,
numpy 2.5.2, scipy 1.18.0, pyloudnorm 0.2.0) against the real KEMAR compact set in
`studio/data/hrtf/kemar-compact`. Timings will vary by machine; the ratios and the memory scaling
will not.
