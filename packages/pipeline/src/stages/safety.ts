import type { DraftScript, SafetyVerdict } from '../types.js';

/**
 * Independent safety classifier — runs on EVERY script BEFORE the human
 * editorial pass (docs/PLAN.md §5, stage 2). This is a safety gate, not a
 * craft gate: failures quarantine the script and stop the pipeline.
 *
 * The rule-based baseline below is intentionally conservative and is designed
 * to be composed with an LLM-based screen (SafetyScreen interface) in
 * production. Rules err toward false positives; a human can clear a
 * quarantined script only by editing it, never by overriding the classifier.
 */

export interface SafetyScreen {
  readonly name: string;
  screen(script: DraftScript): Promise<SafetyVerdict>;
}

/** Terms that quarantine a script outright (minors / school settings / family / non-consent / real-person). */
const HARD_BLOCK_PATTERNS: { label: string; re: RegExp }[] = [
  { label: 'possible minor reference', re: /\b(teen(age(r|d)?)?|minor|under[-\s]?age|school\s?girl|school\s?boy|high\s?school|barely\s+legal|jail\s?bait)\b/i },
  { label: 'age ambiguity cue', re: /\b(so young|little girl|little boy|childlike)\b/i },
  { label: 'non-consent depiction', re: /\b(against (her|his|their) will|doesn'?t|didn'?t consent|forces? (her|him|them)|while (she|he|they) (sleeps?|is unconscious)|too drunk to)\b/i },
  { label: 'incest trope', re: /\b(step\s?(sister|brother|mom|mother|dad|father)|my (sister|brother|mother|father|daughter|son))\b/i },
  { label: 'real-person reference', re: /\b(celebrity|famous (actor|actress|singer)|based on a real)\b/i },
];

/** Requirements every script must affirmatively satisfy. */
const REQUIRED_PATTERNS: { label: string; re: RegExp }[] = [
  { label: 'adult age establishment marker', re: /(all characters are (established )?adults|adults?[,;]? (both|all) (of them|over (18|twenty)))/i },
];

export class RuleBasedSafetyScreen implements SafetyScreen {
  readonly name = 'rules-v1';

  async screen(script: DraftScript): Promise<SafetyVerdict> {
    const checks: string[] = [];
    const violations: string[] = [];

    for (const { label, re } of HARD_BLOCK_PATTERNS) {
      checks.push(`block:${label}`);
      if (re.test(script.text)) violations.push(`blocked: ${label}`);
    }
    for (const { label, re } of REQUIRED_PATTERNS) {
      checks.push(`require:${label}`);
      if (!re.test(script.text)) violations.push(`missing: ${label}`);
    }

    return violations.length === 0 ? { ok: true, checks } : { ok: false, violations, checks };
  }
}

/** Compose multiple screens; every screen must pass. */
export async function runSafety(script: DraftScript, screens: SafetyScreen[]): Promise<SafetyVerdict> {
  const allChecks: string[] = [];
  const allViolations: string[] = [];
  for (const s of screens) {
    const verdict = await s.screen(script);
    allChecks.push(...verdict.checks.map((c) => `${s.name}/${c}`));
    if (!verdict.ok) allViolations.push(...verdict.violations.map((v) => `${s.name}: ${v}`));
  }
  return allViolations.length === 0 ? { ok: true, checks: allChecks } : { ok: false, violations: allViolations, checks: allChecks };
}
