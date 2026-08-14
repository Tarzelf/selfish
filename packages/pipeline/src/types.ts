/** Pipeline domain types. Mirrors docs/PLAN.md §5 and the Supabase schema. */

export type HeatLevel = 'comfort' | 'slow-burn' | 'spicy';
export type Shelf = 'desire' | 'rest';
export type Pace = 'slow' | 'measured';

/** An editorial brief: the human-authored starting point for every session. */
export interface Brief {
  familyId: string;
  shelf: Shelf;
  title: string;
  dynamic: string;
  voiceId: string;
  seriesId?: string;
  episode?: number;
  moods: string[];
  tags: string[];
  /** Premise, beats, and tone notes written by the editorial team. */
  premise: string;
  beats: string[];
  /** Variants to produce for this family. */
  variants: {
    label: string;
    heat: HeatLevel;
    pace: Pace;
    extendedBuildup: boolean;
    targetMinutes: number;
  }[];
}

export interface DraftScript {
  variantLabel: string;
  heat: HeatLevel;
  /** Markdown script with inline performance tags, e.g. [whispers], [soft laugh]. */
  text: string;
  /** Model + prompt provenance for the audit trail. */
  provenance: { provider: string; model: string; promptHash: string };
}

export type SafetyVerdict =
  | { ok: true; checks: string[] }
  | { ok: false; violations: string[]; checks: string[] };

export interface RenderResult {
  variantLabel: string;
  /** Path of the rendered master (mock providers write a placeholder). */
  audioPath: string;
  durationSec: number;
  provider: string;
  /** Synthetic-audio marking applied (EU AI Act Art. 50(2)); mock in preview. */
  watermarked: boolean;
}

/** Full provenance chain for one session family — stored in Supabase with the row. */
export interface AuditManifest {
  familyId: string;
  briefHash: string;
  stages: {
    stage: 'draft' | 'safety' | 'editorial' | 'render' | 'audio-qa' | 'post' | 'publish';
    at: string;
    detail: Record<string, unknown>;
  }[];
  approvedBy?: string;
}
