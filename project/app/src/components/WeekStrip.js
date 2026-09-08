import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, useTypography, radius, spacing, borderCurve, gradients } from '../theme';

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
        const inner = (
          <>
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
          </>
        );
        return (
          <Cell
            key={d.key}
            style={styles.cellWrap}
            onPress={onSelect ? () => onSelect(d.key) : undefined}
          >
            {active ? (
              // Active day: solid brand accent fill.
              <View style={[styles.cell, styles.cellActive]}>{inner}</View>
            ) : (
              // Inactive days reuse the "Start Empty Workout" surface: the darker
              // vertical surface gradient + light hairline (fallback Card recipe).
              <LinearGradient
                colors={gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cell}
              >
                {inner}
              </LinearGradient>
            )}
          </Cell>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: spacing.xs },
  cellWrap: { flex: 1 }, // press target + equal-width flex; visual surface nests inside
  cell: {
    alignItems: 'center',
    gap: 2,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderRadius: radius.sm,
    borderCurve,
    overflow: 'hidden', // clip the gradient fill to the squircle
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
