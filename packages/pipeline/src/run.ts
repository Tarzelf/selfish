import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

import { GrokLlm, type LlmProvider, MockLlm } from './providers/llm.js';
import { ElevenLabsTts, GrokTts, MockTts, SelfHostedTts, type TtsProvider } from './providers/tts.js';
import { RuleBasedSafetyScreen, runSafety } from './stages/safety.js';
import type { AuditManifest, Brief } from './types.js';

/**
 * Pipeline runner: brief -> draft -> safety -> editorial gate -> render ->
 * post -> manifest. Mock providers by default; real providers via env:
 *
 *   PIPELINE_LLM=grok            + XAI_API_KEY   (optional GROK_MODEL)
 *   PIPELINE_TTS=grok            + XAI_API_KEY   (optional GROK_TTS_VOICE — overrides the brief's voiceId)
 *   PIPELINE_TTS=elevenlabs      + ELEVENLABS_API_KEY   (soft pipeline only — no explicit content)
 *   PIPELINE_TTS=self-hosted     + SELF_HOSTED_TTS_URL [SELF_HOSTED_TTS_KEY]
 *
 * Usage: tsx src/run.ts briefs/<brief>.json [--approve]
 *   --approve  Editorial auto-approval for local demo runs only. In production
 *              the editorial gate is a human review workflow; unapproved
 *              scripts never reach the render stage.
 */

function makeLlm(): LlmProvider {
  if (process.env.PIPELINE_LLM === 'grok') {
    const key = process.env.XAI_API_KEY;
    if (!key) throw new Error('PIPELINE_LLM=grok requires XAI_API_KEY');
    return new GrokLlm(key, process.env.GROK_MODEL ?? 'grok-4');
  }
  return new MockLlm();
}

function makeTts(): TtsProvider {
  switch (process.env.PIPELINE_TTS) {
    case 'grok': {
      const key = process.env.XAI_API_KEY;
      if (!key) throw new Error('PIPELINE_TTS=grok requires XAI_API_KEY');
      return new GrokTts(key);
    }
    case 'elevenlabs': {
      const key = process.env.ELEVENLABS_API_KEY;
      if (!key) throw new Error('PIPELINE_TTS=elevenlabs requires ELEVENLABS_API_KEY');
      return new ElevenLabsTts(key);
    }
    case 'self-hosted': {
      const url = process.env.SELF_HOSTED_TTS_URL;
      if (!url) throw new Error('PIPELINE_TTS=self-hosted requires SELF_HOSTED_TTS_URL');
      return new SelfHostedTts(url, process.env.SELF_HOSTED_TTS_KEY);
    }
    default:
      return new MockTts();
  }
}

async function main() {
  const [briefPath, ...flags] = process.argv.slice(2);
  if (!briefPath) {
    console.error('Usage: tsx src/run.ts <brief.json> [--approve]');
    process.exit(1);
  }
  const approve = flags.includes('--approve');

  const rawBrief = await readFile(briefPath, 'utf8');
  const brief = JSON.parse(rawBrief) as Brief;
  const outDir = join('out', brief.familyId);
  await mkdir(outDir, { recursive: true });

  const manifest: AuditManifest = {
    familyId: brief.familyId,
    briefHash: createHash('sha256').update(rawBrief).digest('hex').slice(0, 16),
    stages: [],
  };
  const record = (stage: AuditManifest['stages'][number]['stage'], detail: Record<string, unknown>) =>
    manifest.stages.push({ stage, at: new Date().toISOString(), detail });

  const llm = makeLlm();
  const tts = makeTts();
  const screens = [new RuleBasedSafetyScreen()];
  console.log(`Providers: llm=${llm.name} tts=${tts.name}`);

  for (const variant of brief.variants) {
    console.log(`\n— ${brief.familyId} / ${variant.label} (${variant.heat})`);

    // 1. Draft
    const script = await llm.draft(brief, variant.label);
    const scriptPath = join(outDir, `${variant.label.toLowerCase().replace(/\s+/g, '-')}.md`);
    await writeFile(scriptPath, script.text);
    record('draft', { variant: variant.label, provider: script.provenance });
    console.log(`  draft     ok (${script.text.length} chars) -> ${scriptPath}`);

    // 2. Safety classifier — blocking; quarantines on failure.
    const verdict = await runSafety(script, screens);
    record('safety', { variant: variant.label, verdict });
    if (!verdict.ok) {
      console.error(`  safety    QUARANTINED:\n    ${verdict.violations.join('\n    ')}`);
      console.error('  Pipeline stopped for this variant. Edit the script; the classifier cannot be overridden.');
      continue;
    }
    console.log(`  safety    ok (${verdict.checks.length} checks)`);

    // 3. Editorial gate — human approval required outside demo runs.
    if (!approve) {
      record('editorial', { variant: variant.label, status: 'pending-human-review' });
      console.log('  editorial pending human review (re-run with --approve for local demo)');
      continue;
    }
    record('editorial', { variant: variant.label, status: 'approved', approvedBy: 'demo --approve flag' });
    manifest.approvedBy = 'demo --approve flag';
    console.log('  editorial approved (demo)');

    // 4. Render. GROK_TTS_VOICE maps the brief's persona voice (e.g. v-jasper)
    // to a concrete provider voice id for real runs.
    const ext = tts.name === 'mock-tts' ? 'audio' : 'mp3';
    const audioPath = join(outDir, `${variant.label.toLowerCase().replace(/\s+/g, '-')}.${ext}`);
    const providerVoice = process.env.GROK_TTS_VOICE ?? brief.voiceId;
    const render = await tts.render({ text: script.text, voiceId: providerVoice, outPath: audioPath, variantLabel: variant.label });
    record('render', { variant: variant.label, provider: render.provider, durationSec: render.durationSec });
    console.log(`  render    ok (~${Math.round(render.durationSec / 60)} min) -> ${render.audioPath}`);

    // 5. Post: binaural placement, breath layering, mastering, and
    // machine-readable synthetic-audio marking (EU AI Act Art. 50(2)).
    // Preview: recorded as a manifest stage; production hooks TBD (AudioSeal-class).
    record('post', { variant: variant.label, binaural: 'pending-production-toolchain', watermark: render.watermarked ? 'mock' : 'pending' });
    console.log('  post      recorded (production toolchain pending)');
  }

  // 6. Publish: manifest is what the Supabase publisher consumes.
  const manifestPath = join(outDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  record('publish', { manifestPath });
  console.log(`\nAudit manifest -> ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
