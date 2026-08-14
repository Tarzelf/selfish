import type { Chapter, Heat, Line, Profile, Session } from '../types';
import { openingFor } from './openings';
import { sessionById, sessionsForHeat } from './sessions';

export interface AssembledSession {
  session: Session;
  chapters: Chapter[];
  lines: Line[];
}

export function visibleSessions(profile: Pick<Profile, 'heat'>): Session[] {
  return sessionsForHeat(profile.heat);
}

export function assembleSession(
  sessionId: string,
  profile: Pick<Profile, 'gift' | 'heat'>,
): AssembledSession | undefined {
  const session = sessionById(sessionId);
  if (!session || session.heat > profile.heat) {
    return undefined;
  }

  const opening: Line = openingFor(session.room, profile.gift);
  const chapters = session.chapters.map((chapter, index) => {
    if (index !== 0 || chapter.kind !== 'arrival') {
      return chapter;
    }
    return {
      ...chapter,
      lines: [opening, ...chapter.lines],
    };
  });

  return {
    session,
    chapters,
    lines: chapters.flatMap((chapter) => chapter.lines),
  };
}

export function aftercareChapter(assembled: AssembledSession): Chapter | undefined {
  return assembled.chapters.find((chapter) => chapter.kind === 'aftercare');
}

export function heatLabel(heat: Heat): string {
  switch (heat) {
    case 1:
      return 'Door ajar';
    case 2:
      return 'Open';
    case 3:
      return 'Wide';
    default:
      return 'Door ajar';
  }
}

export function tonightSessionId(profile: Pick<Profile, 'gift' | 'heat'>): string {
  if (profile.gift === 'quiet') {
    return 'the-hour';
  }
  if (profile.gift === 'cared' && profile.heat >= 2) {
    return 'come-home';
  }
  if (profile.gift === 'praised' && profile.heat >= 2) {
    return 'you-are-seen';
  }
  if (profile.gift === 'wanted' && profile.heat >= 2) {
    return profile.heat >= 3 ? 'closer' : 'come-home';
  }
  if (profile.heat >= 2) {
    return 'the-door-ajar';
  }
  return profile.gift === 'unsure' ? 'put-the-day-down' : 'the-door-ajar';
}
