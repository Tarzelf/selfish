import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlass } from '@/components/liquid-glass';
import { TabIcon } from '@/components/tab-icons';
import { fonts } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';
import { TAB_ITEMS, type TabName, tabFocused } from '@/lib/tab-routes';

function Dock({
  items,
}: {
  items: { name: TabName; label: string; focused: boolean; onPress: () => void }[];
}) {
  const insets = useSafeAreaInsets();
  const { part, palette } = useAtmosphere();

  return (
    <View pointerEvents="box-none" style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <LiquidGlass island style={styles.island}>
        <View style={styles.row}>
          {items.map((item) => {
            const color = item.focused ? palette.text : palette.textFaint;
            return (
              <Pressable
                key={item.name}
                accessibilityRole="button"
                accessibilityState={{ selected: item.focused }}
                accessibilityLabel={item.label}
                onPress={item.onPress}
                style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              >
                {item.focused ? <View className="t-tab-pill" style={styles.pill} /> : null}
                <TabIcon name={item.name} color={item.focused ? palette.gold : color} focused={item.focused} part={part} />
                <Text style={[styles.label, { color: item.focused ? palette.text : palette.textFaint }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </LiquidGlass>
    </View>
  );
}

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <Dock
      items={state.routes.map((route, index) => ({
        name: route.name as TabName,
        label: TAB_ITEMS.find((t) => t.name === route.name)?.label ?? route.name,
        focused: state.index === index,
        onPress: () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (state.index !== index && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        },
      }))}
    />
  );
}

/** Web dock for the Slot layout — only one room is mounted, so this cannot stack scenes. */
export function WebGlassTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Dock
      items={TAB_ITEMS.map((tab) => ({
        name: tab.name,
        label: tab.label,
        focused: tabFocused(pathname, tab.name),
        onPress: () => {
          if (!tabFocused(pathname, tab.name)) router.replace(tab.href);
        },
      }))}
    />
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  island: {
    width: '100%',
    maxWidth: 360,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    minHeight: 48,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 3,
    right: 4,
    bottom: 3,
    left: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 150, 80, 0.14)',
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginTop: 3,
  },
});
