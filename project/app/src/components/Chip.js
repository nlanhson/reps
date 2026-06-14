import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing, useTier, useMaterialYou } from '../theme';

// Filter / tag pill (shadcn badge feel). Selected = solid orange + white
// text; unselected = transparent with a hairline border + secondary text.
// On the material-you tier the unselected outline/text use the dynamic palette;
// fallback (and Expo Go) are unchanged.
export default function Chip({ label, selected = false, onPress }) {
  const tier = useTier();
  const scheme = useMaterialYou();
  const tonal = tier === 'material-you' && scheme ? scheme : null;
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
