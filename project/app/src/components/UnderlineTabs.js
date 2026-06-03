import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

// Underline tab switcher (e.g. Workouts | Library). Active tab is primary
// text with a 2px underline; inactive is secondary text.
export default function UnderlineTabs({ tabs, value, onChange }) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => {
        const active = t === value;
        return (
          <Pressable key={t} onPress={() => onChange(t)} style={styles.tab}>
            <Text
              style={[
                typography.bodyStrong,
                { color: active ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              {t}
            </Text>
            {active ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  tab: { paddingBottom: spacing.xs },
  underline: {
    height: 2,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
});
