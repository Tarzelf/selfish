import { readFile } from 'node:fs/promises';
import process from 'node:process';

import { GrokTts } from './providers/tts.js';
import { prepareForTts } from './stages/prepare.js';

/**
 * Render a hand-authored script through Grok TTS.
 * Usage: XAI_API_KEY=… tsx src/render-script.ts <script.txt> <voice> <out.mp3> [speed]
 */
async function main() {
  const [scriptPath, voice, outPath, speedArg] = process.argv.slice(2);
  const key = process.env.XAI_API_KEY;
  if (!scriptPath || !voice || !outPath || !key) {
    console.error('Usage: XAI_API_KEY=… tsx src/render-script.ts <script.txt> <voice> <out.mp3> [speed]');
    process.exit(1);
  }
  const raw = await readFile(scriptPath, 'utf8');
  const text = prepareForTts(raw);
  const speed = speedArg ? Number(speedArg) : 0.92;
  const tts = new GrokTts(key, { speed });
  console.log(`rendering ${scriptPath} → ${outPath} voice=${voice} speed=${speed} chars=${text.length}`);
  const result = await tts.render({ text, voiceId: voice, outPath, variantLabel: 'hand' });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
