import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { colors, typography, radius, spacing, shadows, borderCurve } from '../theme';

// shadcn-style button. Variants:
//   primary  (alias: default)  — solid orange brand, soft shadow
//   secondary                  — muted raised surface
//   outline                    — transparent with hairline border
//   ghost                      — transparent, no border
//   destructive                — solid danger red
// Sizes: 'md' (default, 52pt pill CTA) | 'sm' (40pt) | 'full-rect' uses card radius.
export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
}) {
  const v = variant === 'default' ? 'primary' : variant;
  const solid = v === 'primary' || v === 'destructive';
  const fg =
    v === 'primary' || v === 'destructive'
      ? colors.textOnAccent
      : v === 'secondary'
        ? colors.textPrimary
        : colors.textSecondary;

  const bgFor = (pressed) => {
    switch (v) {
      case 'primary':
        return pressed ? colors.accentPressed : colors.accent;
      case 'destructive':
        return pressed ? colors.dangerSubtle : colors.danger;
      case 'secondary':
        return pressed ? colors.border : colors.surfaceElevated;
      default:
        return pressed ? colors.surfaceElevated : 'transparent';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        { backgroundColor: bgFor(pressed) },
        v === 'outline' && styles.outline,
        solid && !disabled && shadows.sm,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} color={fg} /> : null}
        <Text style={[size === 'sm' ? typography.body : typography.bodyStrong, { color: fg }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md, // Figma button radius (18)
    borderCurve,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sm: { height: 40 },
  outline: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  disabled: { opacity: 0.45 },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
