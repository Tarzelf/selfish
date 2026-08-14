import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

import { GrokTts } from './providers/tts.js';

/**
 * Grok TTS audition harness — the "can this voice carry the product?" test.
 *
 * Renders three probe scripts, each targeting one pillar of the craft bar
 * (docs/PLAN.md §4.3): whisper-distance closeness, warm expressiveness, and
 * slow sleep cadence. Scripts are deliberately tasteful: this audition tests
 * VOICE QUALITY (breath, whisper realism, smile, pacing), not content limits.
 *
 * Usage:
 *   XAI_API_KEY=... npm run tts:audition                 # audition every built-in voice on the whisper probe
 *   XAI_API_KEY=... npm run tts:audition -- --voice ara  # full 3-probe deep test of one voice
 *
 * Output: out/tts-audition/<voice>/<probe>.mp3 + report.json + console table.
 * Cost guard: each probe is ~500 chars ≈ $0.0075 at $15/M chars.
 */

interface Probe {
  id: string;
  goal: string;
  speed: number;
  text: string;
}

const PROBES: Probe[] = [
  {
    id: 'whisper-close',
    goal: 'ASMR closeness: whisper realism, audible breath, unhurried pauses',
    speed: 0.9,
    text: `Hey. [breath] It's late. You can put the phone down in a minute, I promise. [pause] Come here. <whisper>I've been thinking about you all day. That's the whole confession. That's it.</whisper> [pause] [breath] <whisper>Stay right there. You don't have to do anything at all.</whisper>`,
  },
  {
    id: 'warm-praise',
    goal: 'Warmth and audible smile: praise register without saccharine',
    speed: 1.0,
    text: `You did it. You actually did it — I knew you would, but watching it happen was something else entirely. [laugh] No, don't do the modest thing. Not tonight. [pause] Look at me. I'm so proud of you. And later, when everyone else has gone home, I'm going to tell you exactly how proud. Slowly. [pause] In detail.`,
  },
  {
    id: 'sleep-winddown',
    goal: 'Sleep cadence: slow pace, low intensity, no urgency',
    speed: 0.8,
    text: `The rain started an hour ago, and it has no plans of stopping. [pause] Neither do we. There's nowhere to be tomorrow. [breath] Let your shoulders drop. [pause] The kettle's ticking as it cools, the window's gone soft with fog, and I'm going to keep reading whether you stay awake or not. [pause] <whisper>You won't.</whisper>`,
  },
];

const PRICE_PER_CHAR = 15 / 1_000_000; // $15 per 1M characters

async function main() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.error('XAI_API_KEY is not set. Add it as a Cloud Agent secret or export it, then re-run.');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const voiceFlag = args.indexOf('--voice');
  const deepVoice = voiceFlag !== -1 ? args[voiceFlag + 1] : undefined;

  const outRoot = join('out', 'tts-audition');
  await mkdir(outRoot, { recursive: true });

  const client = new GrokTts(apiKey);
  console.log('Listing built-in voices…');
  let voices: { voice_id: string; name: string }[] = [];
  try {
    voices = await client.listVoices();
    console.log(voices.map((v) => `  ${v.voice_id.padEnd(12)} ${v.name}`).join('\n') || '  (none returned)');
  } catch (err) {
    console.warn(`Could not list voices (${(err as Error).message}); falling back to defaults.`);
    voices = [{ voice_id: 'eve', name: 'Eve (default)' }, { voice_id: 'ara', name: 'Ara' }];
  }

  const plan: { voiceId: string; probe: Probe }[] = deepVoice
    ? PROBES.map((probe) => ({ voiceId: deepVoice, probe }))
    : voices.map((v) => ({ voiceId: v.voice_id, probe: PROBES[0] }));

  console.log(`\nRendering ${plan.length} clips (${deepVoice ? `deep test of "${deepVoice}"` : 'whisper audition of all voices'})…\n`);

  const report: Record<string, unknown>[] = [];
  for (const { voiceId, probe } of plan) {
    const outPath = join(outRoot, voiceId, `${probe.id}.mp3`);
    const started = Date.now();
    try {
      const render = await new GrokTts(apiKey, { speed: probe.speed }).render({
        text: probe.text,
        voiceId,
        outPath,
        variantLabel: probe.id,
      });
      const ms = Date.now() - started;
      const bytes = (await stat(render.audioPath)).size;
      const row = {
        voice: voiceId,
        probe: probe.id,
        goal: probe.goal,
        chars: probe.text.length,
        latencyMs: ms,
        bytes,
        estCostUsd: Number((probe.text.length * PRICE_PER_CHAR).toFixed(5)),
        file: render.audioPath,
        ok: true,
      };
      report.push(row);
      console.log(`  ok   ${voiceId.padEnd(12)} ${probe.id.padEnd(16)} ${ms}ms  ${(bytes / 1024).toFixed(0)}KB  -> ${render.audioPath}`);
    } catch (err) {
      report.push({ voice: voiceId, probe: probe.id, ok: false, error: (err as Error).message });
      console.error(`  FAIL ${voiceId.padEnd(12)} ${probe.id.padEnd(16)} ${(err as Error).message}`);
    }
  }

  const reportPath = join(outRoot, 'report.json');
  await writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), voices, results: report }, null, 2));
  const okCount = report.filter((r) => r.ok).length;
  const totalCost = report.reduce((s, r) => s + ((r.estCostUsd as number) ?? 0), 0);
  console.log(`\n${okCount}/${report.length} clips rendered. Est. cost $${totalCost.toFixed(4)}. Report -> ${reportPath}`);
  console.log('Listen for: whisper realism, breath naturalness, smile audibility, pause weight, sleep-pace steadiness.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
