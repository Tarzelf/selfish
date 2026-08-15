import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';
import { skyWash } from '@/lib/sky-wash';

const PHOTOS = {
  evening: require('../../assets/atmosphere/evening.jpg'),
  morning: require('../../assets/atmosphere/morning.jpg'),
};

/**
 * Photograph as the world — but the page is always near-black first.
 * Morning is a bright sunrise; without a floor wash, white ink vanishes.
 */
export function AtmosphereSky() {
  const { part } = useAtmosphere();
  const wash = skyWash(part);

  return (
    <View pointerEvents="none" style={styles.root}>
      <Image
        source={PHOTOS[part]}
        style={[styles.photo, { opacity: wash.photoOpacity }]}
        contentFit="cover"
        contentPosition={part === 'evening' ? { top: '28%', left: '50%' } : { top: '55%', left: '50%' }}
        cachePolicy="memory-disk"
        transition={0}
      />
      <LinearGradient colors={[...wash.colors]} locations={[...wash.locations]} style={StyleSheet.absoluteFill} />
      <View className="t-grain" style={styles.grain} />
    </View>
  );
}

const FILL = { position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0 };

const styles = StyleSheet.create({
  root: { ...FILL, backgroundColor: '#060608' },
  photo: FILL,
  grain: FILL,
});
