import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, spacing } from '../theme';
import Card from './Card';
import ExerciseRow from './ExerciseRow';
import Separator from './Separator';

function Meta({ icon, text }) {
  return (
    <View style={styles.meta}>
      <Icon name={icon} size={14} color={colors.textSecondary} />
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

// "Logged Session Card": title + date, a meta row (duration · set count),
// a list of exercises, and a "See N more exercises" expander.
// `session` = { name, date, duration, setCount, exercises: [{name, meta, countPrefix}] }
export default function SessionCard({ session, previewCount = 2, expanded = false, onToggle, onPress }) {
  const { name, date, duration, setCount, exercises = [] } = session;
  const shown = expanded ? exercises : exercises.slice(0, previewCount);
  const remaining = exercises.length - shown.length;

  return (
    <Card>
      <Pressable onPress={onPress}>
        <View style={styles.head}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h6, { color: colors.textPrimary }]}>{name}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{date}</Text>
          </View>
          <Icon name="ellipsis-horizontal" size={18} color={colors.textMuted} />
        </View>
        <View style={styles.metaRow}>
          {duration ? <Meta icon="time-outline" text={duration} /> : null}
          {setCount ? <Meta icon="layers-outline" text={setCount} /> : null}
        </View>
      </Pressable>

      <View style={styles.exercises}>
        {shown.map((ex, i) => (
          <View key={i}>
            {i > 0 ? <Separator inset={52} /> : null}
            <ExerciseRow name={ex.name} meta={ex.meta} countPrefix={ex.countPrefix} trailingIcon={null} />
          </View>
        ))}
      </View>

      {remaining > 0 || expanded ? (
        <Pressable onPress={onToggle} hitSlop={6}>
          <Text style={[typography.caption, styles.more]}>
            {expanded ? 'Show less' : `See ${remaining} more exercises`}
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  exercises: { marginTop: spacing.md, gap: spacing.xs },
  more: { color: colors.accent, marginTop: spacing.md },
});
