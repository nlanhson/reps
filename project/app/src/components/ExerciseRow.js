import { Pressable, View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, radius, spacing } from '../theme';

// Circular exercise thumbnail. We have no images yet, so render a tinted
// circle with a barbell glyph — swap for a real image when assets land.
function Avatar({ size = 40 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="barbell-outline" size={size * 0.5} color={colors.textMuted} />
    </View>
  );
}

// "Detailed Exercise Card" row: avatar + name + meta ("50 kg · 3 × 8–10"),
// optional leading set-count prefix ("2 ×"), trailing kebab or custom node.
export default function ExerciseRow({ name, meta, countPrefix, onPress, trailingIcon = 'ellipsis-vertical', onTrailingPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}
    >
      <Avatar />
      <View style={styles.text}>
        <Text style={[typography.bodyStrong, { color: colors.textPrimary }]} numberOfLines={1}>
          {countPrefix ? `${countPrefix} ` : ''}
          {name}
        </Text>
        {meta ? (
          <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      {trailingIcon ? (
        <Pressable hitSlop={8} onPress={onTrailingPress}>
          <Icon name={trailingIcon} size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  avatar: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  text: { flex: 1 },
});
