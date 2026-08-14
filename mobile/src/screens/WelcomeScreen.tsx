import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, Sanctuary } from '../components/ui';
import { space, type } from '../theme';

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <Text style={type.caption}>A private listening room</Text>
        <View style={styles.center}>
          <Text style={type.title}>Selfish</Text>
          <Text style={styles.line}>An hour that is only yours.</Text>
          <Text style={[type.body, styles.body]}>
            Still, when you need to come down. Want, when you want to be received.
            You will not be asked to perform. A voice will hold the pace. Aftercare
            is not optional.
          </Text>
        </View>
        <PrimaryButton label="I have an hour" onPress={onContinue} />
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.xxl,
    paddingBottom: space.xl,
  },
  center: { flex: 1, justifyContent: 'center' },
  line: {
    ...type.serif,
    marginTop: space.md,
    marginBottom: space.lg,
  },
  body: { maxWidth: 420 },
});
