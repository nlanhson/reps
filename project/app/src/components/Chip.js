import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

// Filter / tag pill (shadcn badge feel). Selected = solid orange + white
// text; unselected = transparent with a hairline border + secondary text.
export default function Chip({ label, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected
          ? { backgroundColor: pressed ? colors.accentPressed : colors.accent }
          : {
              backgroundColor: pressed ? colors.surfaceElevated : 'transparent',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.hairline,
            },
      ]}
    >
      <Text
        style={[
          typography.label,
          { color: selected ? colors.textOnAccent : colors.textSecondary },
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
