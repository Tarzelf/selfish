import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';

const KEY = 'selfish.profile.v1';

export const defaultProfile: Profile = {
  birthYear: 0,
  gift: 'unsure',
  pace: 'unhurried',
  voiceId: 'ash',
  heat: 1,
  onboardingComplete: false,
};

export async function loadProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile;
    if (!parsed || typeof parsed.birthYear !== 'number') return null;
    return { ...defaultProfile, ...parsed };
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
}

export async function wipeProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
