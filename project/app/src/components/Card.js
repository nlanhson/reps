import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, shadows, borderCurve } from '../theme';

// Base surface container, shadcn-flavoured: a hairline border + a soft
// shadow give every card a crisp, elevated edge on the dark theme.
//  - `gradient` (e.g. gradients.surfaceElevated) renders a vertical fill.
//  - `elevated` (flat) uses the raised gray; default uses the card gray.
//  - `bordered` / `shadow` default on; turn off for flush/inline surfaces.
// The visual surface clips to the radius (overflow hidden), which on iOS
// also clips shadows — so the shadow lives on an outer wrapper.
export default function Card({
  children,
  gradient,
  elevated = false,
  bordered = true,
  shadow = true,
  style,
  padded = true,
  cornerRadius, // defaults to the big-card radius (radius.lg); pass radius.md for button-sized
}) {
  // For a gradient card, the hidden shadow-backing should match the gradient
  // itself (its bottom colour) — not a stray flat neutral that could bleed at
  // the rounded edges. Flat cards use their semantic surface token.
  const base = gradient
    ? gradient[gradient.length - 1]
    : elevated
      ? colors.surfaceElevated
      : colors.surface;
  const r = cornerRadius ?? radius.lg;

  const fillStyle = [
    styles.fill,
    { borderRadius: r },
    !gradient && { backgroundColor: base },
    padded && styles.padded,
    bordered && styles.bordered,
    style,
  ];

  const surface = gradient ? (
    <LinearGradient colors={gradient} start={START} end={END} style={fillStyle}>
      {children}
    </LinearGradient>
  ) : (
    <View style={fillStyle}>{children}</View>
  );

  return (
    <View style={[styles.outer, { borderRadius: r, backgroundColor: base }, shadow && shadows.sm]}>
      {surface}
    </View>
  );
}

const START = { x: 0, y: 0 };
const END = { x: 0, y: 1 };

const styles = StyleSheet.create({
  outer: { borderRadius: radius.lg, borderCurve },
  fill: { borderRadius: radius.lg, borderCurve, overflow: 'hidden' },
  padded: { padding: spacing.lg },
  bordered: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
});
