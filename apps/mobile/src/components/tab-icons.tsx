import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, View } from 'react-native';

import type { AtmospherePart } from '@/lib/types';

function Svg({ children, color }: { children: React.ReactNode; color: string }) {
  return React.createElement(
    'svg',
    { width: 22, height: 22, viewBox: '0 0 22 22', fill: 'none', 'aria-hidden': true, color },
    children,
  );
}

function Path({ d, fill = true }: { d: string; fill?: boolean }) {
  return React.createElement('path', {
    d,
    fill: fill ? 'currentColor' : 'none',
    stroke: fill ? 'none' : 'currentColor',
    strokeWidth: fill ? undefined : 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  });
}

function Sparkle({ color }: { color: string }) {
  return (
    <Svg color={color}>
      <Path d="M11 2.1l1.55 5.05 5.25.42-4.08 3.32 1.32 5.1L11 13.1 7 16 8.3 10.9 4.2 7.57l5.25-.42L11 2.1z" />
      <Path d="M17.2 3.2l.55 1.7 1.75.16-1.36 1.1.44 1.7-1.38-.92-1.38.92.44-1.7-1.36-1.1 1.75-.16.55-1.7z" />
    </Svg>
  );
}

function Sun({ color }: { color: string }) {
  return (
    <Svg color={color}>
      <Path d="M11 7.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6z" />
      <Path
        fill={false}
        d="M11 3.2v1.6M11 17.2v1.6M3.2 11h1.6M17.2 11h1.6M5.4 5.4l1.1 1.1M15.5 15.5l1.1 1.1M16.6 5.4l-1.1 1.1M6.5 15.5l-1.1 1.1"
      />
    </Svg>
  );
}

function Grid({ color }: { color: string }) {
  return (
    <Svg color={color}>
      {React.createElement('rect', { x: 3.5, y: 3.5, width: 6, height: 6, rx: 1.4, fill: 'currentColor' })}
      {React.createElement('rect', { x: 12.5, y: 3.5, width: 6, height: 6, rx: 1.4, fill: 'currentColor' })}
      {React.createElement('rect', { x: 3.5, y: 12.5, width: 6, height: 6, rx: 1.4, fill: 'currentColor' })}
      {React.createElement('rect', { x: 12.5, y: 12.5, width: 6, height: 6, rx: 1.4, fill: 'currentColor' })}
    </Svg>
  );
}

function Moon({ color }: { color: string }) {
  return (
    <Svg color={color}>
      <Path d="M13.6 4.15a7.15 7.15 0 1 0 4.25 12.85 8.05 8.05 0 1 1-4.25-12.85z" />
    </Svg>
  );
}

function Person({ color }: { color: string }) {
  return (
    <Svg color={color}>
      <Path d="M11 3.6a3.15 3.15 0 1 1 0 6.3 3.15 3.15 0 0 1 0-6.3z" />
      <Path d="M4.4 18.2c.35-3.2 2.85-5.15 6.6-5.15s6.25 1.95 6.6 5.15a.9.9 0 0 1-.9.95H5.3a.9.9 0 0 1-.9-.95z" />
    </Svg>
  );
}

type IconSpec = {
  ios: 'sparkles' | 'sun.max' | 'square.grid.2x2' | 'moon' | 'person';
  Web: (props: { color: string }) => React.ReactElement;
};

const ICONS: Record<string, IconSpec> = {
  index: { ios: 'sparkles', Web: Sparkle },
  browse: { ios: 'square.grid.2x2', Web: Grid },
  rest: { ios: 'moon', Web: Moon },
  you: { ios: 'person', Web: Person },
};

export function TabIcon({
  name,
  color,
  focused,
  part,
}: {
  name: string;
  color: string;
  focused: boolean;
  part: AtmospherePart;
}) {
  const spec: IconSpec =
    name === 'index'
      ? part === 'morning'
        ? { ios: 'sun.max', Web: Sun }
        : ICONS.index
      : (ICONS[name] ?? ICONS.browse);
  const Fallback = spec.Web;

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: 22, height: 22 }}>
        <Fallback color={color} />
      </View>
    );
  }

  return (
    <SymbolView
      name={spec.ios}
      tintColor={color}
      size={22}
      weight={focused ? 'semibold' : 'regular'}
      fallback={
        <View style={{ width: 22, height: 22 }}>
          <Fallback color={color} />
        </View>
      }
    />
  );
}
