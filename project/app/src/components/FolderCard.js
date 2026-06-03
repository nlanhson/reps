import { Pressable, View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, gradients, radius, spacing, shadows, borderCurve } from '../theme';

// Library folder card: a square gradient card holding a saved routine.
// Shows an options icon top-right and the routine name + item count at the
// bottom.
export default function FolderCard({ name, items, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]}>
      <View style={[styles.bodyWrap, shadows.sm]}>
        <LinearGradient
          colors={gradients.surfaceElevated}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.body}
        >
          <Icon name="options-outline" size={18} color={colors.textMuted} style={styles.options} />
          <View style={styles.label}>
            <Text style={[typography.h6, { color: colors.textPrimary }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{items} items</Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: '48%' },
  bodyWrap: { borderRadius: radius.lg, borderCurve, backgroundColor: gradients.surfaceElevated[0] },
  body: {
    aspectRatio: 1.5, // wider than tall — reduced height
    borderRadius: radius.lg,
    borderCurve,
    overflow: 'hidden',
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  options: { position: 'absolute', top: spacing.md, right: spacing.md },
  label: { flex: 1, justifyContent: 'flex-end' },
});
