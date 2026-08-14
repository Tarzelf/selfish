import { createHash } from 'node:crypto';

import type { Brief, DraftScript } from '../types.js';

export interface LlmProvider {
  readonly name: string;
  draft(brief: Brief, variantLabel: string): Promise<DraftScript>;
}

function hash(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

/**
 * Offline mock: deterministic scripts so the pipeline runs end-to-end in CI
 * and local dev with zero secrets. Output shape matches real providers.
 */
export class MockLlm implements LlmProvider {
  readonly name = 'mock-llm';

  async draft(brief: Brief, variantLabel: string): Promise<DraftScript> {
    const variant = brief.variants.find((v) => v.label === variantLabel);
    if (!variant) throw new Error(`Unknown variant: ${variantLabel}`);
    const text = [
      `# ${brief.title} — ${variant.label}`,
      ``,
      `[setting: ${brief.premise}]`,
      `[all characters are established adults; ages stated in scene one]`,
      ``,
      ...brief.beats.map(
        (beat, i) =>
          `## Beat ${i + 1}\n[${variant.pace === 'slow' ? 'unhurried' : 'measured'}, close to mic]\n${beat}\n[breath] [soft smile]`,
      ),
      ``,
      `## Wind-down`,
      `[whispers] Aftercare beat: reassurance, warmth, slow fade.`,
    ].join('\n');
    return {
      variantLabel,
      heat: variant.heat,
      text,
      provenance: { provider: this.name, model: 'mock-1', promptHash: hash(JSON.stringify({ brief: brief.familyId, variantLabel })) },
    };
  }
}

/**
 * xAI Grok — primary drafting provider for the spicy pipeline (the only
 * frontier API whose AUP permits fictional adult text; see docs/research/04).
 * OpenAI-compatible chat completions endpoint.
 */
export class GrokLlm implements LlmProvider {
  readonly name = 'grok';

  constructor(
    private readonly apiKey: string,
    private readonly model = 'grok-4',
    private readonly baseUrl = 'https://api.x.ai/v1',
  ) {}

  async draft(brief: Brief, variantLabel: string): Promise<DraftScript> {
    const variant = brief.variants.find((v) => v.label === variantLabel);
    if (!variant) throw new Error(`Unknown variant: ${variantLabel}`);
    const system = [
      'You draft second-person POV audio-fiction scripts for an adults-only app.',
      'MANDATORY: the first line of every script must be exactly this stage direction: "[all characters are established adults; ages stated in scene one]" — and the script must honor it.',
      'Hard requirements: all intimacy is enthusiastically consensual with verbal check-ins; no real people; no impersonation.',
      'Write with restraint: buildup and emotional context over explicitness.',
      'Output plain spoken text only (it goes directly to TTS): no scene headers, no markdown, no camera directions.',
      'Use only these performance tags, sparingly: [pause], [breath], [laugh], and <whisper>...</whisper> around whispered phrases.',
    ].join(' ');
    const user = JSON.stringify({
      title: brief.title,
      dynamic: brief.dynamic,
      premise: brief.premise,
      beats: brief.beats,
      heat: variant.heat,
      pace: variant.pace,
      extendedBuildup: variant.extendedBuildup,
      targetMinutes: variant.targetMinutes,
    });
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Grok draft failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return {
      variantLabel,
      heat: variant.heat,
      text: json.choices[0]?.message?.content ?? '',
      provenance: { provider: this.name, model: this.model, promptHash: hash(system + user) },
    };
  }
}
