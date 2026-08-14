import * as Haptics from 'expo-haptics';
import { Intensity } from '../constants/personas';

const impactForIntensity: Record<Intensity, Haptics.ImpactFeedbackStyle> = {
  soft: Haptics.ImpactFeedbackStyle.Light,
  warm: Haptics.ImpactFeedbackStyle.Medium,
  bold: Haptics.ImpactFeedbackStyle.Heavy,
};

const intervalForIntensity: Record<Intensity, number> = {
  soft: 900,
  warm: 550,
  bold: 320,
};

export async function pulsePresence(intensity: Intensity = 'warm') {
  try {
    await Haptics.impactAsync(impactForIntensity[intensity]);
  } catch {
    // Web / simulator may not support haptics
  }
}

export function startBodyPattern(intensity: Intensity): () => void {
  const style = impactForIntensity[intensity];
  const intervalMs = intervalForIntensity[intensity];

  const tick = () => {
    Haptics.impactAsync(style).catch(() => undefined);
  };

  tick();
  const id = setInterval(tick, intervalMs);
  return () => clearInterval(id);
}
