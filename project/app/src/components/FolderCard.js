import { Pressable, View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import Card from './Card';
import { colors, useTypography, gradients, spacing } from '../theme';

// Library folder card: a flat gradient surface — the same card style as the
// Home hero and "Start Empty Workout" cards (single gradient panel, no folder
// silhouette). Routine name + item count anchored bottom-left; options icon
// top-right.
export default function FolderCard({ name, items, onPress }) {
  const typography = useTypography();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]}
    >
      <Card gradient={gradients.surfaceElevated} style={styles.card}>
        <Icon name="options-outline" size={18} color={colors.textMuted} style={styles.options} />
        <View style={styles.label}>
          <Text style={[typography.h6, { color: colors.textPrimary }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{items} items</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: '48%', aspectRatio: 1.5 },
  card: { flex: 1 },
  options: { position: 'absolute', top: spacing.md, right: spacing.md },
  label: { flex: 1, justifyContent: 'flex-end' },
});
