import { Pressable, View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, spacing } from '../theme';

// Generic settings / list row: optional leading icon, label, optional
// trailing value text, and a trailing accessory (chevron by default, or a
// custom node such as a Switch). Matches the "Setting Selection" sheet item.
export default function ListRow({
  label,
  icon,
  value,
  onPress,
  trailing,
  showChevron = true,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}
    >
      {icon ? (
        <Icon name={icon} size={20} color={colors.textSecondary} style={styles.icon} />
      ) : null}
      <Text style={[typography.body, styles.label]} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text style={[typography.body, { color: colors.textSecondary }]}>{value}</Text>
      ) : null}
      {trailing}
      {showChevron && !trailing ? (
        <Icon name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: spacing.sm,
  },
  icon: { marginRight: spacing.md },
  label: { flex: 1, color: colors.textPrimary },
  chevron: { marginLeft: spacing.sm },
});
