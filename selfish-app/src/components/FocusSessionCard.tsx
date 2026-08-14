import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FocusSession } from '../constants/focusSessions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface FocusSessionCardProps {
  session: FocusSession;
  onPress: () => void;
}

const categoryIcons: Record<FocusSession['category'], string> = {
  rain: '◌',
  whisper: '◎',
  breath: '○',
};

export function FocusSessionCard({ session, onPress }: FocusSessionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconCircle, { backgroundColor: session.ambientColor }]}>
        <Text style={styles.icon}>{categoryIcons[session.category]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {session.description}
        </Text>
        <Text style={styles.duration}>{session.durationMinutes} min</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
    color: colors.text,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
    marginBottom: 6,
  },
  duration: {
    ...typography.label,
    color: colors.focus,
    fontSize: 11,
  },
});
