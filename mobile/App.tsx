import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AgeGateScreen } from './src/screens/AgeGateScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { defaultProfile, loadProfile, saveProfile, wipeProfile } from './src/state/profile';
import { colors } from './src/theme';
import type { Profile, Screen } from './src/types';

export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [screen, setScreen] = useState<Screen>({ name: 'gate' });

  useEffect(() => {
    loadProfile()
      .then((stored) => {
        if (stored?.birthYear && stored.onboardingComplete) {
          setProfile(stored);
          setScreen({ name: 'home' });
        } else if (stored?.birthYear) {
          setProfile(stored);
          setScreen({ name: 'welcome' });
        }
      })
      .finally(() => setReady(true));
  }, []);

  const persist = (next: Profile) => {
    setProfile(next);
    saveProfile(next).catch(() => undefined);
  };

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen.name === 'gate' && (
        <AgeGateScreen
          onAdult={(birthYear) => {
            persist({ ...profile, birthYear });
            setScreen({ name: 'welcome' });
          }}
        />
      )}
      {screen.name === 'welcome' && (
        <WelcomeScreen onContinue={() => setScreen({ name: 'onboarding' })} />
      )}
      {screen.name === 'onboarding' && (
        <OnboardingScreen
          onDone={(value) => {
            persist({ ...profile, ...value, onboardingComplete: true });
            setScreen({ name: 'home' });
          }}
        />
      )}
      {screen.name === 'home' && (
        <HomeScreen
          profile={profile}
          onOpen={(id) => setScreen({ name: 'session', id })}
          onSettings={() => setScreen({ name: 'settings' })}
        />
      )}
      {screen.name === 'session' && (
        <SessionScreen
          id={screen.id}
          profile={profile}
          onBack={() => setScreen({ name: 'home' })}
          onBegin={() => setScreen({ name: 'player', id: screen.id })}
        />
      )}
      {screen.name === 'player' && (
        <PlayerScreen
          id={screen.id}
          profile={profile}
          onExit={() => setScreen({ name: 'home' })}
        />
      )}
      {screen.name === 'settings' && (
        <SettingsScreen
          profile={profile}
          onChange={persist}
          onBack={() => setScreen({ name: 'home' })}
          onWipe={() => {
            wipeProfile().catch(() => undefined);
            setProfile(defaultProfile);
            setScreen({ name: 'gate' });
          }}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
