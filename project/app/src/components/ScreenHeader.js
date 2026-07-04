import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, spacing } from '../theme';

// Two variants seen in the screens:
//  - default: large left-aligned title with an optional trailing icon
//    (Home / History / Profile tabs).
//  - back: centered title with a leading back chevron + optional trailing
//    icon(s) (Plan Detail / Workout Detail / Settings / Calendar).
//
// Trailing actions: pass `trailingIcon` (+ `onTrailingPress`) for one, or
// `trailingIcons` = [{ icon, onPress }] for several (e.g. share + kebab).
export default function ScreenHeader({
  title,
  variant = 'large',
  onBack,
  trailingIcon,
  onTrailingPress,
  trailingIcons,
}) {
  const trailing = trailingIcons ?? (trailingIcon ? [{ icon: trailingIcon, onPress: onTrailingPress }] : []);

  if (variant === 'back') {
    return (
      <View style={styles.backRow}>
        <Pressable hitSlop={8} onPress={onBack} style={styles.side}>
          <Icon name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={[typography.h5, styles.centerTitle]} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.side, styles.sideEnd]}>
          {trailing.map(({ icon, onPress }) => (
            <Pressable key={icon} hitSlop={8} onPress={onPress}>
              <Icon name={icon} size={22} color={colors.textPrimary} />
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.largeRow}>
      <Text style={[typography.largeTitle, { color: colors.textPrimary }]}>{title}</Text>
      {trailingIcon ? (
        <Pressable hitSlop={8} onPress={onTrailingPress}>
          <Icon name={trailingIcon} size={24} color={colors.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  largeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  side: { minWidth: 40, justifyContent: 'center' },
  sideEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.lg,
  },
  centerTitle: { flex: 1, textAlign: 'center', color: colors.textPrimary },
});
