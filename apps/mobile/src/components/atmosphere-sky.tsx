import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';

const PHOTOS = {
  evening: require('../../assets/atmosphere/evening.jpg'),
  morning: require('../../assets/atmosphere/morning.jpg'),
};

/**
 * The world behind the glass — a photograph, the way Talkify sits on a sunset.
 * Chrome is a separate layer. This is only the place.
 */
export function AtmosphereSky() {
  const { part } = useAtmosphere();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.void} />
      <Image
        source={PHOTOS[part]}
        style={styles.photo}
        contentFit="cover"
        contentPosition={part === 'evening' ? { top: '28%', left: '50%' } : { top: '42%', left: '50%' }}
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={
          part === 'evening'
            ? ['rgba(4,4,10,0.55)', 'rgba(4,4,10,0)', 'rgba(6,6,8,0.55)', '#060608']
            : ['rgba(8,6,4,0.28)', 'rgba(8,6,4,0)', 'rgba(12,8,4,0.42)', '#060608']
        }
        locations={[0, 0.22, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View className="t-grain" style={styles.grain} />
    </View>
  );
}

const FILL = { position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0 };

const styles = StyleSheet.create({
  void: { ...FILL, backgroundColor: '#060608' },
  photo: FILL,
  grain: FILL,
});
