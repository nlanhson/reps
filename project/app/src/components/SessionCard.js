import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, spacing } from '../theme';
import Card from './Card';
import Separator from './Separator';

// One stat in the micro-info row (clock + "46 min", dumbbell + "3,438 kg").
// The set count renders without an icon, per the design.
function Meta({ icon, text }) {
  return (
    <View style={styles.meta}>
      {icon ? <Icon name={icon} size={18} color={colors.textPrimary} /> : null}
      <Text style={[typography.body, { color: colors.textPrimary }]}>{text}</Text>
    </View>
  );
}

// Compact exercise line inside the card: 32px thumbnail, "3 × Bench Press",
// then the working weight/reps inline in gray. (WorkoutDetail keeps the
// larger stacked ExerciseRow; this inline variant is the History design.)
const AVATAR = 32;

function SessionExercise({ name, meta, countPrefix }) {
  return (
    <View style={styles.exRow}>
      <View style={styles.exAvatar}>
        <Icon name="barbell-outline" size={AVATAR / 2} color={colors.textMuted} />
      </View>
      <Text
        style={[typography.body, { color: colors.textPrimary, flexShrink: 1 }]}
        numberOfLines={2}
      >
        {countPrefix ? `${countPrefix} ` : ''}
        {name}
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary }]} numberOfLines={1}>
        {meta}
      </Text>
    </View>
  );
}

// "Logged Session Card": title + date + kebab, a micro-info row
// (duration · volume · set count), a divider, the exercise list, and a
// centered "See N more exercises" expander.
// `session` = { name, date, duration, volume, setCount,
//               exercises: [{ name, meta, countPrefix }] }
export default function SessionCard({ session, previewCount = 3, expanded = false, onToggle, onPress }) {
  const { name, date, duration, volume, setCount, exercises = [] } = session;
  const shown = expanded ? exercises : exercises.slice(0, previewCount);
  const remaining = exercises.length - shown.length;

  return (
    <Card>
      <Pressable onPress={onPress}>
        <View style={styles.head}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h6, { color: colors.textPrimary }]}>{name}</Text>
            <Text style={[typography.captionSmall, styles.date]}>{date}</Text>
          </View>
          <Pressable hitSlop={8}>
            <Icon name="ellipsis-horizontal" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.metaRow}>
          {duration ? <Meta icon="time-outline" text={duration} /> : null}
          {volume ? <Meta icon="barbell-outline" text={volume} /> : null}
          {setCount ? <Meta text={setCount} /> : null}
        </View>
      </Pressable>

      <Separator style={styles.divider} />

      <View style={styles.exercises}>
        {shown.map((ex, i) => (
          <SessionExercise key={i} name={ex.name} meta={ex.meta} countPrefix={ex.countPrefix} />
        ))}
      </View>

      {remaining > 0 || expanded ? (
        <Pressable onPress={onToggle} hitSlop={6} style={styles.moreBtn}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {expanded
              ? 'Show less'
              : `See ${remaining} more exercise${remaining === 1 ? '' : 's'}`}
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start' },
  date: { color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['4xl'], marginTop: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  divider: { marginVertical: spacing.md },
  exercises: { gap: spacing.sm },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  exAvatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: { alignItems: 'center', paddingVertical: spacing.sm, marginTop: spacing.xs },
});
