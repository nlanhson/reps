import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, spacing } from '../theme';

// Two variants seen in the screens:
//  - default: large left-aligned title with an optional trailing icon
//    (Home / History / Profile tabs).
//  - back: centered title with a leading back chevron + optional trailing
//    icon (Plan Detail / Workout Detail / Settings / Calendar).
export default function ScreenHeader({
  title,
  variant = 'large',
  onBack,
  trailingIcon,
  onTrailingPress,
}) {
  if (variant === 'back') {
    return (
      <View style={styles.backRow}>
        <Pressable hitSlop={8} onPress={onBack} style={styles.side}>
          <Icon name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={[typography.h5, styles.centerTitle]} numberOfLines={1}>
          {title}
        </Text>
        <Pressable hitSlop={8} onPress={onTrailingPress} style={[styles.side, styles.sideEnd]}>
          {trailingIcon ? (
            <Icon name={trailingIcon} size={22} color={colors.textPrimary} />
          ) : null}
        </Pressable>
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
  side: { width: 40, justifyContent: 'center' },
  sideEnd: { alignItems: 'flex-end' },
  centerTitle: { flex: 1, textAlign: 'center', color: colors.textPrimary },
});
