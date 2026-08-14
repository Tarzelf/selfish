import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  useFonts as useCormorant,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDmSans,
} from '@expo-google-fonts/dm-sans';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../src/theme';
import { SessionProvider } from '../src/session-context';

export default function RootLayout() {
  const [cormorantLoaded] = useCormorant({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
  });
  const [dmLoaded] = useDmSans({
    DMSans_400Regular,
    DMSans_500Medium,
  });

  if (!cormorantLoaded || !dmLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ink },
          animation: 'fade',
        }}
      />
    </SessionProvider>
  );
}
