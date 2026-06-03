import { Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

// Small caption header that sits above a section (e.g. "Today's Workout").
export default function SectionLabel({ children, style }) {
  return <Text style={[typography.caption, styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, marginBottom: spacing.sm },
});
