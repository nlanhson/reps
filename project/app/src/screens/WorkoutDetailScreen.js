import { useLayoutEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, useTypography, spacing, gradients } from '../theme';
import { AppButton, Card, Chip, ExerciseRow, Icon, ProgressChart } from '../components';
import { getWorkout } from '../data/mock';

// Workout Detail — one workout of a routine, opened from Plan Detail or the
// Home Workouts tab: name + meta, metric chips over a progress chart, the
// exercise list (card per exercise, drag handle for future reorder), and a
// pinned Start Workout CTA.

const METRICS = [
  { key: 'volume', label: 'Volume' },
  { key: 'duration', label: 'Duration' },
  { key: 'reps', label: 'Reps' },
];

export default function WorkoutDetailScreen({ navigation, route }) {
  const typography = useTypography();
  const workout = getWorkout(route.params?.id);
  const [metric, setMetric] = useState('volume');
  const series = workout.progress[metric];

  // Native stack header (native iOS back button → Liquid Glass on iOS 26); the
  // kebab is a native header action. The big workout name stays in the body.
  useLayoutEffect(() => {
    const onShare = () =>
      Share.share({ message: `Check out the "${workout.name}" workout on Reps` });
    // TODO: real deletion needs persistence (see STATE.md); confirm backs out for now.
    const onDelete = () =>
      Alert.alert('Delete Workout', `Delete "${workout.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
      ]);

    // Single three-dots button → native menu. ActionSheetIOS is the real UIKit
    // action sheet; Android falls back to an Alert action list.
    const openMenu = () => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: workout.name,
            options: ['Share', 'Delete Workout', 'Cancel'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2,
          },
          (i) => {
            if (i === 0) onShare();
            else if (i === 1) onDelete();
          },
        );
      } else {
        Alert.alert(workout.name, undefined, [
          { text: 'Share', onPress: onShare },
          { text: 'Delete', style: 'destructive', onPress: onDelete },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    };

    navigation.setOptions({
      title: 'Workout Detail',
      headerRight: () => (
        <Pressable hitSlop={8} style={styles.headerBtn} onPress={openMenu}>
          <Icon name="ellipsis-vertical" size={22} color={colors.textPrimary} />
        </Pressable>
      ),
    });
  }, [navigation, workout.name]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: colors.textPrimary }]}>{workout.name}</Text>
        <Text style={[typography.caption, styles.meta]}>
          {workout.exercises.length} exercises  ·  {workout.durationEstimate}
        </Text>

        {/* Metric selector + range. Range is display-only until real history lands. */}
        <View style={styles.chipRow}>
          <View style={styles.chips}>
            {METRICS.map((m) => (
              <Chip
                key={m.key}
                label={m.label}
                selected={metric === m.key}
                onPress={() => setMetric(m.key)}
              />
            ))}
          </View>
          <Pressable hitSlop={6} style={styles.range}>
            <Text style={[typography.label, { color: colors.accent }]}>Last 3 months</Text>
            <Icon name="chevron-down" size={14} color={colors.accent} />
          </Pressable>
        </View>

        <ProgressChart
          labels={workout.progressLabels}
          values={series.values}
          unit={series.unit}
        />

        <View style={styles.list}>
          {workout.exercises.map((ex) => (
            <Card key={ex.id} gradient={gradients.surface} padded={false} style={styles.exerciseCard}>
              <Icon name="drag-vertical" size={20} color={colors.textMuted} />
              <View style={styles.exerciseRow}>
                <ExerciseRow name={ex.name} meta={ex.meta} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label="Start Workout"
          icon="play"
          onPress={() => navigation.navigate('InSession')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  // Wrap the glyph tightly (no fixed width) so the glass capsule hugs it and the
  // `ellipsis` sits centred — a wider box left slack that read as off-centre.
  // hitSlop keeps the touch target comfortable.
  headerBtn: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg },
  meta: { color: colors.textSecondary, marginTop: spacing.xs },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  chips: { flexDirection: 'row', gap: spacing.sm },
  range: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  list: { gap: spacing.md, marginTop: spacing.xl },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
  },
  exerciseRow: { flex: 1, marginLeft: spacing.xs },
  footer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
});
