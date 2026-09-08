import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTier } from './TierContext';
import { useMaterialYou } from './materialYou';
import GlassSurface from './GlassSurface';
import { fallbackSurface, materialSurface, GLASS_TINT } from './tiers';
import type { SurfaceRole } from './tiers';
import { radius as radii, borderCurve, shadows, colors } from './theme';

export type TierSurfaceProps = {
  role?: SurfaceRole;
  cornerRadius?: number;
  gradient?: readonly string[]; // fallback: the flat fill uses the lighter (top) stop; no gradient is drawn
  elevated?: boolean; // fallback: use the raised surface token
  bordered?: boolean;
  shadow?: boolean;
  glassInteractive?: boolean;
  style?: StyleProp<ViewStyle>; // layout + padding, applied to the content fill
  children?: ReactNode;
};

// Container chrome for non-interactive surfaces (cards, sheets, bars). Swaps the
// surface treatment by tier. The FALLBACK branch is a plain flat-colour View —
// no expo-linear-gradient — so nothing native can drop/glitch under an Animated
// transition; it just carries a hairline border plus a slightly brighter top
// edge for a subtle "light from above" highlight.
export default function TierSurface({
  role = 'surface',
  cornerRadius,
  gradient,
  elevated = false,
  bordered = true,
  shadow = true,
  glassInteractive,
  style,
  children,
}: TierSurfaceProps) {
  const tier = useTier();
  const scheme = useMaterialYou();
  const r = cornerRadius ?? radii.lg;
  const shape: ViewStyle = { borderRadius: r, borderCurve };

  // LIQUID GLASS — real glass; never opacity < 1.
  if (tier === 'liquid-glass') {
    return (
      <GlassSurface radius={r} tintColor={GLASS_TINT[role]} interactive={glassInteractive} style={style}>
        {children}
      </GlassSurface>
    );
  }

  // MATERIAL YOU — flat tonal fill (no gradient).
  if (tier === 'material-you' && scheme) {
    const m = materialSurface(role, scheme, r, bordered);
    return (
      <View style={[styles.outer, shape, { backgroundColor: m.backgroundColor }, shadow && shadows.sm]}>
        <View style={[styles.fill, shape, m, style]}>{children}</View>
      </View>
    );
  }

  // FALLBACK — a flat fill (no gradient). The shadow lives on the outer wrapper
  // because the fill clips to the radius (overflow hidden), which on iOS also
  // clips shadows. When a `gradient` is passed we flatten it to its lighter (top)
  // stop so raised surfaces still read lighter than base ones; the top-edge
  // highlight sells the elevation.
  const fb = fallbackSurface(elevated ? 'control-filled' : role, r, bordered);
  const base = gradient ? gradient[0] : (fb.backgroundColor as string);
  return (
    <View style={[styles.outer, shape, { backgroundColor: base }, shadow && shadows.sm]}>
      <View
        style={[styles.fill, shape, { backgroundColor: base }, bordered && styles.bordered, style]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { borderRadius: radii.lg, borderCurve },
  fill: { borderRadius: radii.lg, borderCurve, overflow: 'hidden' },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    borderTopColor: colors.highlight, // brighter top edge = subtle highlight
  },
});
