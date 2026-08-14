import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface LifestyleCardProps {
  image: ImageSourcePropType;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  onPress: () => void;
  height?: number;
}

export function LifestyleCard({
  image,
  eyebrow,
  title,
  description,
  action,
  onPress,
  height = 240,
}: LifestyleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { height }, pressed && styles.pressed]}
    >
      <Image source={image} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(13,11,14,0.35)', 'rgba(13,11,14,0.88)']}
        style={styles.overlay}
      >
        <View>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.action}>{action}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.92,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
  },
  eyebrow: {
    ...typography.label,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 6,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.86,
    marginBottom: 14,
  },
  action: {
    ...typography.link,
    color: colors.text,
  },
});
