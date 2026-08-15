import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';

const STAR_SEEDS = [
  [8, 6], [22, 11], [37, 4], [51, 14], [64, 7], [78, 18], [91, 9],
  [14, 22], [29, 28], [43, 19], [58, 24], [72, 31], [86, 21], [96, 27],
  [11, 38], [33, 35], [47, 42], [61, 36], [75, 44], [89, 39],
  [18, 51], [41, 48], [55, 54], [69, 49], [83, 56],
  [6, 16], [26, 8], [48, 12], [67, 5], [81, 15], [93, 33],
  [3, 44], [35, 58], [52, 8], [77, 12], [98, 19],
  [19, 15], [44, 6], [62, 20], [84, 8], [7, 30],
];

const FIREFLIES = [
  [18, 62], [34, 71], [52, 66], [71, 74], [88, 63], [27, 80], [63, 82],
];

/** Full-bleed world. Evening: in bed, window open on a summer night. Morning: linen and window light. */
export function AtmosphereSky() {
  const { part } = useAtmosphere();
  const stars = useMemo(
    () =>
      STAR_SEEDS.map(([x, y], i) => ({
        key: i,
        left: `${x}%` as const,
        top: `${y}%` as const,
        size: i % 11 === 0 ? 2.4 : i % 4 === 0 ? 1.7 : 1.1,
        delay: `${(i * 0.17) % 3.6}s`,
        opacity: 0.3 + ((i * 17) % 40) / 100,
      })),
    [],
  );

  if (part === 'morning') {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFF7EC', '#F7D4B8', '#E8B089', '#D9A07A']}
          locations={[0, 0.36, 0.7, 1]}
          start={{ x: 0.55, y: 0 }}
          end={{ x: 0.35, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.morningSunHalo} />
        <View style={styles.morningSun} />
        <View style={styles.morningWash} />
        <LinearGradient
          colors={['rgba(247,236,222,0)', 'rgba(247,236,222,0.42)', 'rgba(243,226,208,0.7)']}
          locations={[0, 0.4, 1]}
          style={styles.sheets}
        />
        <View style={styles.curtainLeftMorning} />
        <View style={styles.curtainRightMorning} />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#050814', '#0C1228', '#1A1638', '#3D2434']}
        locations={[0, 0.28, 0.62, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.moonHalo} />
      <View style={styles.moon} />
      <View style={styles.moonCrescent} />
      {stars.map((s) => (
        <View
          key={s.key}
          className="t-star"
          style={[
            styles.star,
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: s.size,
              opacity: s.opacity,
              // @ts-expect-error web-only animation delay
              animationDelay: s.delay,
            },
          ]}
        />
      ))}
      {FIREFLIES.map(([x, y], i) => (
        <View
          key={`ff-${i}`}
          className="t-firefly"
          style={[
            styles.firefly,
            {
              left: `${x}%`,
              top: `${y}%`,
              // @ts-expect-error web-only animation delay
              animationDelay: `${i * 0.35}s`,
            },
          ]}
        />
      ))}
      <View style={styles.mullion1} />
      <View style={styles.mullion2} />
      <View style={styles.sill} />
      <View style={styles.curtainLeft} />
      <View style={styles.curtainRight} />
      <View style={styles.lamp} />
      <View style={styles.lampCore} />
      <View style={styles.haze} />
      <LinearGradient
        colors={['rgba(40,22,28,0)', 'rgba(62,32,28,0.28)', 'rgba(48,26,22,0.45)']}
        locations={[0, 0.45, 1]}
        style={styles.sheets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  morningSunHalo: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -140,
    right: -80,
    backgroundColor: 'rgba(255, 214, 150, 0.38)',
  },
  morningSun: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -20,
    right: 8,
    backgroundColor: 'rgba(255, 196, 120, 0.55)',
  },
  morningWash: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    top: 90,
    left: -140,
    backgroundColor: 'rgba(255, 236, 220, 0.5)',
  },
  curtainLeftMorning: {
    position: 'absolute',
    top: 0,
    bottom: '28%',
    left: 0,
    width: 36,
    backgroundColor: 'rgba(255, 244, 230, 0.28)',
  },
  curtainRightMorning: {
    position: 'absolute',
    top: 0,
    bottom: '28%',
    right: 0,
    width: 28,
    backgroundColor: 'rgba(255, 236, 214, 0.22)',
  },
  moonHalo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '6%',
    right: '6%',
    backgroundColor: 'rgba(210, 220, 255, 0.1)',
  },
  moon: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    top: '10%',
    right: '12%',
    backgroundColor: 'rgba(244, 232, 200, 0.28)',
  },
  moonCrescent: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    top: '10.6%',
    right: '10.4%',
    backgroundColor: 'rgba(12, 16, 36, 0.35)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#F7F1E8',
  },
  firefly: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 196, 90, 0.85)',
    shadowColor: '#FFC45A',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  mullion1: {
    position: 'absolute',
    top: '4%',
    bottom: '34%',
    left: '33%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(247, 241, 232, 0.08)',
  },
  mullion2: {
    position: 'absolute',
    top: '4%',
    bottom: '34%',
    left: '66%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(247, 241, 232, 0.07)',
  },
  sill: {
    position: 'absolute',
    left: '6%',
    right: '6%',
    top: '64%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(247, 241, 232, 0.1)',
  },
  curtainLeft: {
    position: 'absolute',
    top: 0,
    bottom: '30%',
    left: 0,
    width: 42,
    backgroundColor: 'rgba(90, 60, 90, 0.16)',
  },
  curtainRight: {
    position: 'absolute',
    top: 0,
    bottom: '30%',
    right: 0,
    width: 32,
    backgroundColor: 'rgba(70, 50, 90, 0.14)',
  },
  lamp: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    bottom: -180,
    left: -140,
    backgroundColor: 'rgba(232, 130, 55, 0.26)',
  },
  lampCore: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: -10,
    left: 18,
    backgroundColor: 'rgba(255, 176, 80, 0.2)',
  },
  haze: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    bottom: 90,
    right: -90,
    backgroundColor: 'rgba(80, 60, 140, 0.16)',
  },
  sheets: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '36%',
  },
});
