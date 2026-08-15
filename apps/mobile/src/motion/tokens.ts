/** transitions.dev motion tokens — JS mirror of transitions-root.css for native Reanimated. */
export const duration = {
  stagger: 40,
  micro: 80,
  quick: 150,
  fast: 250,
  medium: 350,
  slow: 400,
  verySlow: 500,
} as const;

export const ease = {
  smoothOut: [0.22, 1, 0.36, 1] as const,
  inOut: 'ease-in-out' as const,
  out: 'ease-out' as const,
  linear: 'linear' as const,
  bounce: [0.34, 1.36, 0.64, 1] as const,
  bounceStrong: [0.34, 3.85, 0.64, 1] as const,
};

export const distance = {
  micro: 4,
  small: 6,
  base: 8,
  medium: 12,
  large: 30,
} as const;

export const scale = {
  large: 0.96,
  medium: 0.97,
  small: 0.98,
  tiny: 0.99,
} as const;

export const blur = {
  small: 2,
  medium: 3,
  large: 8,
} as const;
