import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { palette } from '@/constants/theme';
import { useAppState } from '@/lib/store';

export default function Entry() {
  const { ready, prefs } = useAppState();
  if (!ready) return <View style={{ flex: 1, backgroundColor: palette.ink }} />;
  return prefs.onboarded ? <Redirect href="/(tabs)" /> : <Redirect href="/onboarding" />;
}
