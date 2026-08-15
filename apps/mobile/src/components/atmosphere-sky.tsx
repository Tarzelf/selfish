import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';
import { skyWash } from '@/lib/sky-wash';

const PHOTOS = {
  evening: require('../../assets/atmosphere/evening.jpg'),
  morning: require('../../assets/atmosphere/morning.jpg'),
};

/**
 * Photograph as the world — but the page is always near-black first.
 * Web paints the sky in CSS so expo-image / LinearGradient cannot bleach the type.
 */
export function AtmosphereSky() {
  const { part } = useAtmosphere();

  if (Platform.OS === 'web') {
    return <View pointerEvents="none" className="t-sky" style={styles.root} {...{ 'data-part': part }} />;
  }

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
  root: { ...FILL, backgroundColor: '#060608', zIndex: 0 },
  photo: FILL,
  grain: FILL,
});
