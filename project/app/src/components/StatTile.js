import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing, borderCurve } from '../theme';

// Profile stat tile: big number with a small caption label beneath, on a
// card surface. Optional leading icon shown above the number.
export default function StatTile({ value, label, icon }) {
  return (
    <View style={styles.tile}>
      {icon}
      <Text style={[typography.h2, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
