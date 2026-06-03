// ============================================================
// GlassTabBar — floating "Liquid Glass" bottom tab bar (iOS 26 style).
//
// • The bar is Apple's real Liquid Glass (UIGlassEffect) via
//   expo-glass-effect when supported, falling back to an expo-blur
//   frosted BlurView (Expo Go / Android / older iOS).
// • The selected tab is indicated by accent COLOR only — no highlight
//   capsule. You can still tap a tab, or drag across the bar to switch;
//   the active color follows your finger and commits on release.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography, shadows } from '../theme';

const TAB_ICONS = {
  Home: 'home',
  History: 'list',
  Profile: 'person',
};

const LIQUID_GLASS = isLiquidGlassAvailable();

// Bar geometry.
const BAR_HEIGHT = 64;
const TAB_WIDTH = 72; // fixed per-tab width → compact, content-sized pill
const BAR_PAD_H = spacing.sm; // inner horizontal padding of the pill

// Space a scrollable screen should reserve at the bottom so its last item
// clears the floating bar (added on top of the safe-area inset).
export const TAB_BAR_CLEARANCE = BAR_HEIGHT + spacing.lg;

export default function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  // Which tab reads as "active" — follows the finger while dragging.
  const [displayIndex, setDisplayIndex] = useState(state.index);

  const count = state.routes.length;
  // Fixed cell width — the bar's size never depends on a layout measurement,
  // so it can't reflow or jump frame-to-frame.
  const cellWidth = TAB_WIDTH;

  const dragging = useRef(false);

  // Keep the indication in sync when selection changes elsewhere (deep link,
  // programmatic navigation), but never mid-drag.
  useEffect(() => {
    if (!dragging.current) setDisplayIndex(state.index);
  }, [state.index]);

  // Latest values for the gesture closures (PanResponder is created once).
  const live = useRef({});
  live.current = { stateIndex: state.index, cellWidth, count, navigation, routes: state.routes };

  const goTo = (index) => {
    const { routes, stateIndex, navigation: nav } = live.current;
    const route = routes[index];
    const event = nav.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (index !== stateIndex && !event.defaultPrevented) nav.navigate(route.name);
  };

  const panResponder = useRef(
    PanResponder.create({
      // Let taps fall through to the Pressables; only claim on a clear horizontal drag.
      onMoveShouldSetPanResponder: (_e, g) =>
        live.current.cellWidth > 0 && Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        dragging.current = true;
      },
      onPanResponderMove: (_e, g) => {
        const { cellWidth: cw, count: n, stateIndex } = live.current;
        if (cw <= 0) return;
        const hovered = Math.max(0, Math.min(n - 1, Math.round(stateIndex + g.dx / cw)));
        setDisplayIndex((prev) => (prev === hovered ? prev : hovered));
      },
      onPanResponderRelease: () => {
        dragging.current = false;
        setDisplayIndex((target) => {
          goTo(target);
          return target;
        });
      },
      onPanResponderTerminate: () => {
        dragging.current = false;
        setDisplayIndex(live.current.stateIndex);
      },
    })
  ).current;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}
    >
      <GlassSurface>
        <View style={[styles.track, { width: count * TAB_WIDTH }]} {...panResponder.panHandlers}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;
            const focused = displayIndex === index;
            const tint = focused ? colors.accent : colors.textSecondary;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={label}
                onPress={() => {
                  setDisplayIndex(index);
                  goTo(index);
                }}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                style={styles.tab}
                hitSlop={8}
              >
                <Icon name={TAB_ICONS[route.name]} size={22} color={tint} />
                <Text
                  numberOfLines={1}
                  allowFontScaling={false} // keep label size fixed regardless of Dynamic Type
                  style={[typography.label, styles.label, { color: tint }]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

// The translucent pill — real Liquid Glass when available, frosted blur otherwise.
function GlassSurface({ children }) {
  if (LIQUID_GLASS) {
    return (
      <GlassView
        glassEffectStyle="regular"
        glassColorScheme="dark"
        style={[styles.bar, styles.glass, shadows.md]}
      >
        {children}
      </GlassView>
    );
  }
  return (
    <BlurView
      intensity={40}
      tint="systemUltraThinMaterialDark"
      experimentalBlurMethod="dimezisBlurView"
      style={[styles.bar, styles.blur, shadows.md]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  // Full-width host pinned to the bottom; touches pass through except on the pill.
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Center the compact pill. Tabs have a fixed width (TAB_WIDTH), so the
    // track has an intrinsic width and the pill shrink-wraps to it cleanly.
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  bar: {
    height: BAR_HEIGHT,
    paddingHorizontal: BAR_PAD_H,
    borderRadius: radius.pill,
    overflow: 'hidden', // clip the blur/glass material to the pill shape
  },
  // BlurView fallback needs a faint fill + hairline so it reads as a surface on dark.
  blur: {
    backgroundColor: 'rgba(20,20,20,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  glass: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  // Holds the tab row; owns the pan gesture and measures cell width.
  track: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
  },
});
