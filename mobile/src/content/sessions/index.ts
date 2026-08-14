import type { Heat, Session } from '../../types';
import { closer } from './closer';
import { comeHome } from './comeHome';
import { putTheDayDown } from './putTheDayDown';
import { stay } from './stay';
import { theDoorAjar } from './theDoorAjar';
import { theHour } from './theHour';
import { youAreSeen } from './youAreSeen';

export const sessions: Session[] = [
  theHour,
  putTheDayDown,
  theDoorAjar,
  comeHome,
  youAreSeen,
  closer,
  stay,
];

export function sessionById(id: string): Session | undefined {
  return sessions.find((session) => session.id === id);
}

export function sessionsForHeat(maxHeat: Heat): Session[] {
  return sessions.filter((session) => session.heat <= maxHeat);
}

export function textsFromSession(session: Session): string[] {
  return [
    session.title,
    session.subtitle,
    session.synopsis,
    session.forMaya,
    ...session.chapters.flatMap((chapter) => [
      chapter.title,
      ...chapter.lines.map((entry) => entry.text),
    ]),
  ];
}

export function catalogTexts(): string[] {
  return sessions.flatMap(textsFromSession);
}
