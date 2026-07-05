import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, useTypography, radius, spacing, borderCurve } from '../theme';

// Figma "Weekly Workout Log" day pills: each day is a rounded cell with the
// weekday, date, and a dot marking a logged workout. The selected day (today)
// fills with the brand accent; its dot inverts to white.
// `days` = [{ key, weekday: 'Mon', date: 10, logged: true }]
// Pass `onSelect` to make the cells pressable; omit it for a passive strip.
const DOT = 6; // logged-workout dot diameter (Figma spec)

export default function WeekStrip({ days, selectedKey, onSelect }) {
  const typography = useTypography();
  // Selected weekday bumps to medium weight (Figma), same 12px metrics.
  // h6 carries the platform-correct medium cut (Inter_500Medium on Android).
  const w12Medium = {
    ...typography.h6,
    fontSize: typography.captionSmall.fontSize,
    lineHeight: typography.captionSmall.lineHeight,
    letterSpacing: typography.captionSmall.letterSpacing,
  };
  return (
    <View style={styles.strip}>
      {days.map((d) => {
        const active = d.key === selectedKey;
        const Cell = onSelect ? Pressable : View;
        return (
          <Cell
            key={d.key}
            style={[styles.cell, active && styles.cellActive]}
            onPress={onSelect ? () => onSelect(d.key) : undefined}
          >
            <Text
              style={[
                active ? w12Medium : typography.captionSmall,
                { color: colors.textPrimary, textAlign: 'center' },
              ]}
            >
              {d.weekday}
            </Text>
            <Text style={[typography.h6, { color: colors.textPrimary, textAlign: 'center' }]}>
              {d.date}
            </Text>
            <View
              style={[
                styles.dot,
                d.logged && {
                  backgroundColor: active ? colors.textOnAccent : colors.accent,
                },
              ]}
            />
          </Cell>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: spacing.xs },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderRadius: radius.sm,
    borderCurve,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  cellActive: {
    backgroundColor: colors.accent,
    borderColor: colors.hairlineBright,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: 'transparent',
  },
});
