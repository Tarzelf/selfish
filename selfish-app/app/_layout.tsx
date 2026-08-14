import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="age-gate" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="focus/[id]"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="whisper/setup"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="whisper/session"
          options={{ presentation: 'fullScreenModal', animation: 'fade' }}
        />
      </Stack>
    </AppProvider>
  );
}
