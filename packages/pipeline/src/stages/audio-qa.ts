import { readFile } from 'node:fs/promises';

/**
 * Automated audio QA — listens to every rendered take BEFORE human review.
 *
 * Catches the failure modes observed in live testing:
 *  - truncated takes (render stops before the script ends)
 *  - tag leakage (TTS reads "[breath]" or "<whisper>" aloud — the Ani bug)
 *  - skipped / hallucinated words vs. the approved script
 *  - flat or rushed delivery (scored, for take ranking when regenerating)
 *
 * Implementation: one audio-input LLM call via OpenRouter (chat completions
 * with an input_audio content part). Default model is Gemini Flash-class;
 * override with OPENROUTER_QA_MODEL. Cost: fractions of a cent per take.
 */

export interface AudioQaVerdict {
  ok: boolean;
  issues: string[];
  /** 0–10 subjective delivery scores, for ranking takes. */
  scores: { intimacy: number; pacing: number; naturalness: number };
  transcriptExcerpt: string;
}

export interface AudioQa {
  readonly name: string;
  review(opts: { audioPath: string; script: string }): Promise<AudioQaVerdict>;
}

/** Offline mock: passes everything; keeps the pipeline runnable with no keys. */
export class MockAudioQa implements AudioQa {
  readonly name = 'mock-audio-qa';

  async review(): Promise<AudioQaVerdict> {
    return {
      ok: true,
      issues: [],
      scores: { intimacy: 0, pacing: 0, naturalness: 0 },
      transcriptExcerpt: '(mock)',
    };
  }
}

const QA_PROMPT = `You are the audio quality gate for a studio producing intimate, ASMR-style audio fiction.
You are given the approved SCRIPT and the rendered AUDIO of one take. Listen carefully and return STRICT JSON:

{
  "transcript": "<what is actually spoken, verbatim>",
  "truncated": <true if the audio ends before the script's final line>,
  "tag_leakage": <true if any performance tag like "[breath]", "[pause]", "whisper" markup is spoken aloud>,
  "wording_issues": ["<each skipped, repeated, or invented phrase vs the script>"],
  "artifacts": ["<clicks, glitches, robotic stretches, unnatural breaths>"],
  "scores": { "intimacy": 0-10, "pacing": 0-10, "naturalness": 0-10 }
}

Scoring guidance: intimacy = close-mic warmth and softness appropriate to the script; pacing = unhurried,
honors pauses; naturalness = indistinguishable from a human read. Be strict: 8+ means you would believe a human recorded it.`;

export class OpenRouterAudioQa implements AudioQa {
  readonly name = 'openrouter-audio-qa';

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.OPENROUTER_QA_MODEL ?? 'google/gemini-3.7-flash',
  ) {}

  async review({ audioPath, script }: { audioPath: string; script: string }): Promise<AudioQaVerdict> {
    const audio = await readFile(audioPath);
    const format = audioPath.endsWith('.wav') ? 'wav' : 'mp3';
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `${QA_PROMPT}\n\nSCRIPT:\n${script}` },
              { type: 'input_audio', input_audio: { data: audio.toString('base64'), format } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter QA failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = json.choices[0]?.message?.content ?? '{}';
    let parsed: {
      transcript?: string;
      truncated?: boolean;
      tag_leakage?: boolean;
      wording_issues?: string[];
      artifacts?: string[];
      scores?: { intimacy?: number; pacing?: number; naturalness?: number };
    };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, issues: [`QA model returned non-JSON: ${raw.slice(0, 200)}`], scores: { intimacy: 0, pacing: 0, naturalness: 0 }, transcriptExcerpt: '' };
    }

    const issues: string[] = [];
    if (parsed.truncated) issues.push('truncated take');
    if (parsed.tag_leakage) issues.push('performance tag spoken aloud');
    for (const w of parsed.wording_issues ?? []) issues.push(`wording: ${w}`);
    for (const a of parsed.artifacts ?? []) issues.push(`artifact: ${a}`);

    return {
      ok: issues.length === 0,
      issues,
      scores: {
        intimacy: parsed.scores?.intimacy ?? 0,
        pacing: parsed.scores?.pacing ?? 0,
        naturalness: parsed.scores?.naturalness ?? 0,
      },
      transcriptExcerpt: (parsed.transcript ?? '').slice(0, 300),
    };
  }
}
