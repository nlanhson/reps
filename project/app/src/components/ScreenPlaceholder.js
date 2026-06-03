import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

// Temporary placeholder used while screens are stubbed.
// Replace each screen's body with the real UI as we build it.
export default function ScreenPlaceholder({ title, subtitle, actions = [] }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.body}>
        <Text style={[typography.label, styles.eyebrow]}>REPS</Text>
        <Text style={[typography.h1, styles.title]}>{title}</Text>
        {subtitle ? (
          <Text style={[typography.body, styles.subtitle]}>{subtitle}</Text>
        ) : null}

        {actions.map((a) => (
          <Pressable
            key={a.label}
            onPress={a.onPress}
            style={({ pressed }) => [
              styles.action,
              { backgroundColor: pressed ? colors.accentPressed : colors.surface },
            ]}
          >
            <Text style={[typography.bodyStrong, { color: colors.accent }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing['2xl'] },
  eyebrow: { color: colors.accent, marginBottom: spacing.xs },
  title: { color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.xl },
  action: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
  },
});
