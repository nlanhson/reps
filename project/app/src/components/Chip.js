import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, useTypography, radius, spacing, useTier, useMaterialYou, GlassSurface } from '../theme';

// Filter / tag pill (shadcn badge feel). Selected = solid orange + white
// text (stays solid on every tier); unselected = transparent with a hairline
// border + secondary text on fallback, dynamic palette on material-you, and
// real glass on liquid-glass.
export default function Chip({ label, selected = false, onPress }) {
  const typography = useTypography();
  const tier = useTier();
  const scheme = useMaterialYou();
  const tonal = tier === 'material-you' && scheme ? scheme : null;
  const glass = tier === 'liquid-glass' && !selected;

  const text = (
    <Text
      style={[
        typography.label,
        {
          color: selected
            ? colors.textOnAccent
            : tonal
              ? tonal.onSurfaceVariant
              : colors.textSecondary,
        },
      ]}
    >
      {label}
    </Text>
  );

  if (glass) {
    return (
      <Pressable onPress={onPress}>
        <GlassSurface radius={radius.pill} interactive style={styles.base}>
          {text}
        </GlassSurface>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected
          ? { backgroundColor: pressed ? colors.accentPressed : colors.accent }
          : {
              backgroundColor: tonal
                ? pressed
                  ? tonal.secondaryContainer
                  : 'transparent'
                : pressed
                  ? colors.surfaceElevated
                  : 'transparent',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: tonal ? tonal.outlineVariant : colors.hairline,
            },
      ]}
    >
      {text}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 30,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
