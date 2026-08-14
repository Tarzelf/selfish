import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { RenderResult } from '../types.js';

export interface TtsProvider {
  readonly name: string;
  render(opts: { text: string; voiceId: string; outPath: string; variantLabel: string }): Promise<RenderResult>;
}

/** Rough finished-audio estimate: intimate pacing runs ~110 words/minute. */
function estimateDurationSec(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round((words / 110) * 60);
}

/**
 * Offline mock: writes a placeholder artifact so the pipeline (and its audit
 * manifest) can be exercised with zero secrets and no audio toolchain.
 */
export class MockTts implements TtsProvider {
  readonly name = 'mock-tts';

  async render({ text, voiceId, outPath, variantLabel }: { text: string; voiceId: string; outPath: string; variantLabel: string }): Promise<RenderResult> {
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, `MOCK AUDIO — voice=${voiceId} variant=${variantLabel} chars=${text.length}\n`);
    return {
      variantLabel,
      audioPath: outPath,
      durationSec: estimateDurationSec(text),
      provider: this.name,
      watermarked: true, // mock marks its placeholder as "watermarked" to exercise the audit path
    };
  }
}

/**
 * ElevenLabs v3 — soft pipeline only (romantic/sleep; their use policy
 * prohibits sexually explicit content — see docs/research/04). Supports
 * inline audio tags ([whispers], [breath]) which our scripts already carry.
 */
export class ElevenLabsTts implements TtsProvider {
  readonly name = 'elevenlabs';

  constructor(
    private readonly apiKey: string,
    private readonly modelId = 'eleven_v3',
  ) {}

  async render({ text, voiceId, outPath, variantLabel }: { text: string; voiceId: string; outPath: string; variantLabel: string }): Promise<RenderResult> {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'xi-api-key': this.apiKey },
      body: JSON.stringify({ text, model_id: this.modelId }),
    });
    if (!res.ok) throw new Error(`ElevenLabs render failed: ${res.status} ${await res.text()}`);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
    return {
      variantLabel,
      audioPath: outPath,
      durationSec: estimateDurationSec(text),
      provider: this.name,
      watermarked: false, // watermarking happens in the post stage (EU AI Act Art. 50(2))
    };
  }
}

/**
 * Self-hosted Orpheus/Chatterbox server — spicy pipeline. Fully separated
 * infrastructure from the soft pipeline (separate accounts/keys/hosts) per
 * docs/PLAN.md §5. Expects an OpenAI-compatible /v1/audio/speech endpoint.
 */
export class SelfHostedTts implements TtsProvider {
  readonly name = 'self-hosted-orpheus';

  constructor(private readonly baseUrl: string, private readonly apiKey?: string) {}

  async render({ text, voiceId, outPath, variantLabel }: { text: string; voiceId: string; outPath: string; variantLabel: string }): Promise<RenderResult> {
    const res = await fetch(`${this.baseUrl}/v1/audio/speech`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ input: text, voice: voiceId, response_format: 'wav' }),
    });
    if (!res.ok) throw new Error(`Self-hosted render failed: ${res.status} ${await res.text()}`);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
    return {
      variantLabel,
      audioPath: outPath,
      durationSec: estimateDurationSec(text),
      provider: this.name,
      watermarked: false,
    };
  }
}
