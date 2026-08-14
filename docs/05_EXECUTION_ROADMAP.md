# Execution Roadmap

> Phased delivery plan for cloud-agent development  
> Each phase is independently shippable and testable

---

## Phase 0: Foundation (Current)

**Goal**: Research, plan, debate, persona review — DONE

**Deliverables**:
- [x] Market + psychology research
- [x] Product plan with debated decisions
- [x] Persona review (Maya)
- [x] Technical architecture
- [x] This roadmap

---

## Phase 1: Scaffold + Focus Mode (Week 1)

**Goal**: Runnable iOS app with Focus mode — proves audio pipeline works

| Task | Owner | Status |
|------|-------|--------|
| Initialize Expo project (`selfish-app/`) | Agent | Done |
| App shell: auth, tabs, navigation | Agent | Done |
| Age gate screen | Agent | Done |
| Focus mode: 3 bundled ambient audio sessions | Agent | Done (timer placeholder, audio assets TBD) |
| Audio player with background playback | Agent | Done (expo-av configured) |
| Basic dark/warm UI (wellness aesthetic) | Agent | Done |
| Supabase project setup + profiles table | Agent | Done (schema migration scaffolded) |

**Exit criteria**: App runs on iOS simulator, plays ambient audio, user can sign up.

---

## Phase 2: Whisper Backend (Week 2)

**Goal**: Edge functions that power a single conversation turn

| Task | Owner | Status |
|------|-------|--------|
| Supabase schema (personas, scenarios, sessions, messages) | Agent | Pending |
| Seed data: Elena persona + 3 scenarios | Agent | Pending |
| `whisper-chat` edge function (Grok + ElevenLabs) | Agent | Pending |
| Content guardrails in system prompt | Agent | Pending |
| API key management (Supabase secrets) | Agent | Pending |
| Unit test: single turn round-trip | Agent | Pending |

**Exit criteria**: `curl` to edge function returns text + audio URL for a test message.

---

## Phase 3: Whisper UI (Week 3)

**Goal**: Full conversation loop in the app

| Task | Owner | Status |
|------|-------|--------|
| Persona + scenario picker screen | Agent | Pending |
| Intensity dial (soft/warm/bold) | Agent | Pending |
| Active session screen (hold-to-talk) | Agent | Pending |
| Text input fallback | Agent | Pending |
| "Thinking" ambient audio during latency | Agent | Pending |
| Session history (last 5) | Agent | Pending |
| Continue session ("where you left off") | Agent | Pending |

**Exit criteria**: User can complete a full 10-turn Whisper session on device.

---

## Phase 4: Monetization + Polish (Week 4)

**Goal**: Revenue-ready app

| Task | Owner | Status |
|------|-------|--------|
| RevenueCat integration | Agent | Pending |
| Paywall: 3 free sessions/month | Agent | Pending |
| Subscription screen | Agent | Pending |
| Privacy controls (delete session, memory opt-in) | Agent | Pending |
| Onboarding flow (welcome → age gate → first Focus session) | Agent | Pending |
| App icon + splash screen (wellness aesthetic) | Agent | Pending |
| Error handling + offline states | Agent | Pending |

**Exit criteria**: TestFlight build with working subscription flow.

---

## Phase 5: TestFlight + Iterate (Week 5–6)

**Goal**: Real user feedback

| Task | Owner | Status |
|------|-------|--------|
| EAS build → TestFlight | Agent | Pending |
| Test with 5–10 real users (including "Maya" archetype) | Human | Pending |
| Latency optimization (<3s target) | Agent | Pending |
| Voice quality tuning (ElevenLabs settings) | Agent | Pending |
| Prompt engineering based on session logs | Agent | Pending |
| App Store metadata + screenshots | Agent | Pending |
| Privacy policy + terms of service | Agent | Pending |

**Exit criteria**: ≥4.0 rating from TestFlight testers, ready for App Store submission.

---

## Phase 6: Launch + Phase 2 Features (Post-launch)

| Feature | Priority |
|---------|----------|
| Grok Voice realtime (premium) | High |
| Second persona (James) | Medium |
| Sleep timer + wind-down | Medium |
| Android | Low |
| Creator marketplace | Not planned |

---

## Cloud Agent Workflow

Each phase follows the loop:

```
Research → Plan → Debate → Persona Review → Execute → Test → Commit → PR
```

Agents should:
1. Read docs/ before starting work
2. Work on feature branches (`cursor/<task>-199a`)
3. Commit after each meaningful milestone
4. Update this roadmap with status
5. Run persona review again after major feature additions

---

## Environment Variables Needed

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
XAI_API_KEY=              # Grok text + voice
ELEVENLABS_API_KEY=       # TTS
DEEPGRAM_API_KEY=         # STT (optional, can use Apple)

# RevenueCat
REVENUECAT_API_KEY=
REVENUECAT_WEBHOOK_SECRET=

# App
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| App Store rejection | Medium | High | Wellness positioning, content guardrails, 18+ gate |
| AI produces too-explicit content | Medium | High | Output filter + prompt constraints + human review |
| Latency too high | Medium | Medium | Turbo TTS model, edge function optimization |
| Voice sounds robotic | Low | High | ElevenLabs premium voices, prompt brevity |
| Cost per user too high | Low | Medium | Session limits on free tier, text-first pipeline |
| Grok API changes pricing | Low | Medium | Abstract LLM provider, can swap to Claude/GPT |
