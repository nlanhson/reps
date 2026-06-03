import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing, borderCurve } from '../theme';

// Horizontal week strip: weekday label over a date cell. The selected day
// gets an orange filled cell. Matches the "Weekly Workout Log" header.
// `days` = [{ key, weekday: 'Mon', date: 10 }], `selectedKey` selects one.
export default function WeekStrip({ days, selectedKey, onSelect }) {
  return (
    <View style={styles.strip}>
      {days.map((d) => {
        const active = d.key === selectedKey;
        return (
          <Pressable key={d.key} style={styles.col} onPress={() => onSelect?.(d.key)}>
            <Text style={[typography.label, { color: colors.textSecondary }]}>{d.weekday}</Text>
            <View style={[styles.cell, active && { backgroundColor: colors.accent }]}>
              <Text
                style={[
                  typography.bodyStrong,
                  { color: active ? colors.textOnAccent : colors.textPrimary },
                ]}
              >
                {d.date}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  cell: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderCurve,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
