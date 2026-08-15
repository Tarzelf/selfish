import React, { useRef } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

/** 11 — avatar group hover. Distance-falloff lift; bouncy return on leave. */
export function AvatarGroup({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const rootRef = useRef<View>(null);
  const items = React.Children.toArray(children).filter(Boolean);

  const setShifts = (activeIdx: number | null, phase: 'in' | 'out') => {
    if (Platform.OS !== 'web' || !rootRef.current) return;
    const root = rootRef.current as unknown as HTMLElement;
    const cs = getComputedStyle(document.documentElement);
    const num = (name: string, fb: number) => {
      const v = parseFloat(cs.getPropertyValue(name));
      return Number.isFinite(v) ? v : fb;
    };
    const ease = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb;
    const lift = num('--avatar-lift', -4);
    const falloff = num('--avatar-falloff', 0.45);
    const scale = num('--avatar-scale', 1.05);
    const tf =
      phase === 'out'
        ? ease('--avatar-ease-out', 'cubic-bezier(0.34, 3.85, 0.64, 1)')
        : ease('--avatar-ease-in', 'cubic-bezier(0.22, 1, 0.36, 1)');

    root.querySelectorAll('.t-avatar').forEach((el, i) => {
      const node = el as HTMLElement;
      node.style.transitionTimingFunction = tf;
      if (activeIdx == null) {
        node.style.setProperty('--shift', '0px');
        node.style.setProperty('--scale-active', '1');
        return;
      }
      const d = Math.abs(i - activeIdx);
      node.style.setProperty('--shift', `${(lift * Math.pow(falloff, d)).toFixed(3)}px`);
      node.style.setProperty('--scale-active', i === activeIdx ? String(scale) : '1');
    });
  };

  return (
    <View
      ref={rootRef}
      className="t-avatar-group"
      style={[{ flexDirection: 'row', justifyContent: 'center' }, style]}
      // @ts-expect-error web hover
      onMouseLeave={() => setShifts(null, 'out')}
    >
      {items.map((node, i) => (
        <View
          key={i}
          className="t-avatar"
          // @ts-expect-error web hover
          onMouseEnter={() => setShifts(i, 'in')}
        >
          {node}
        </View>
      ))}
    </View>
  );
}
