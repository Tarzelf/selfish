import type { Gift, Line, Room } from '../types';

const still: Record<Gift, Line> = {
  quiet: {
    text: 'You asked for quiet. I can do that.',
    pauseAfterMs: 1400,
    rate: 0.84,
  },
  wanted: {
    text: 'Wanting can wait. First, we make a little room inside the day.',
    pauseAfterMs: 1400,
    rate: 0.86,
  },
  praised: {
    text: 'You do not have to earn this hour. Showing up is enough.',
    pauseAfterMs: 1400,
    rate: 0.86,
  },
  cared: {
    text: 'Put it down. I will hold the edges of the room.',
    pauseAfterMs: 1400,
    rate: 0.84,
  },
  unsure: {
    text: 'You do not have to know what you need yet. Stay.',
    pauseAfterMs: 1500,
    rate: 0.84,
  },
};

const want: Record<Gift, Line> = {
  quiet: {
    text: 'You asked for quiet. I will not fill it with noise. Only with attention.',
    pauseAfterMs: 1600,
    rate: 0.82,
  },
  wanted: {
    text: 'You do not have to earn being wanted. I already do.',
    pauseAfterMs: 1600,
    rate: 0.82,
  },
  praised: {
    text: 'I noticed you the moment you sat down. That is where we begin.',
    pauseAfterMs: 1600,
    rate: 0.82,
  },
  cared: {
    text: 'You can stop taking care of the room. I have it.',
    pauseAfterMs: 1600,
    rate: 0.82,
  },
  unsure: {
    text: 'You do not have to know what you want yet. I can want you without a map.',
    pauseAfterMs: 1700,
    rate: 0.8,
  },
};

export function openingFor(room: Room, gift: Gift): Line {
  return room === 'still' ? still[gift] : want[gift];
}
