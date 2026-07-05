import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, useTypography, radius, spacing, borderCurve } from '../theme';

// Month heatmap grid (Calendar/Heatmap screen): a 7-column calendar where each
// logged day is tinted by workout intensity (0–1, e.g. volume relative to the
// month's max) — the same "accent = activity" language as WeekStrip's dot,
// scaled up to a fill so a full month reads at a glance.
// `data` = { [dayOfMonth]: intensity } — only days with a logged workout.
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const CELL_SIZE = 36;

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

// Blend intensity as alpha rather than View `opacity` — opacity would also
// fade the day-number text underneath, which we want to stay fully legible.
function accentTint(alpha) {
  const hex = colors.accent.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function CalendarMonth({
  year,
  month, // 0-11
  data = {},
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  const typography = useTypography();
  const monthLabel = useMemo(
    () => new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [year, month],
  );
  const total = daysInMonth(year, month);
  const lead = firstWeekday(year, month);
  const today = new Date();
  const isToday = (d) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const cells = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <View>
      <View style={styles.nav}>
        <Pressable hitSlop={8} onPress={onPrevMonth}>
          <Icon name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={[typography.h5, { color: colors.textPrimary }]}>{monthLabel}</Text>
        <Pressable hitSlop={8} onPress={onNextMonth}>
          <Icon name="chevron-forward" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((l, i) => (
          <Text key={i} style={[typography.caption2, styles.weekdayCell, { color: colors.textFaint }]}>
            {l}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d == null) return <View key={`b${i}`} style={styles.cell} />;
          const intensity = data[d];
          const active = d === selectedDay;
          const Cell = onSelectDay ? Pressable : View;
          return (
            <Cell key={d} style={styles.cell} onPress={onSelectDay ? () => onSelectDay(d) : undefined}>
              <View
                style={[
                  styles.day,
                  intensity != null && { backgroundColor: accentTint(Math.max(0.18, intensity)) },
                  active && styles.dayActive,
                ]}
              >
                <Text
                  style={[
                    typography.footnote,
                    { color: active || intensity != null ? colors.textPrimary : colors.textSecondary },
                    isToday(d) && !active ? { color: colors.accent } : null,
                  ]}
                >
                  {d}
                </Text>
              </View>
            </Cell>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  weekdayRow: { flexDirection: 'row', marginBottom: spacing.xs },
  weekdayCell: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: radius.sm,
    borderCurve,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.textOnAccent,
    backgroundColor: colors.accent,
  },
});
