import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, useTypography, spacing, gradients, radius } from '../theme';
import { Card, Icon, RoutineRow } from '../components';
import { getRoutine } from '../data/mock';

// Plan Detail — a routine (training split) opened from a Library folder. Uses
// the NATIVE stack header (native iOS back button → Liquid Glass on iOS 26);
// the routine name is the header title and share/options are native header
// actions. Body = the routine's workouts as RoutineRows + a ghost
// "Create New Workout" button.
export default function PlanDetailScreen({ navigation, route }) {
  const typography = useTypography();
  const routine = getRoutine(route.params?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: routine.name,
      headerRight: () => (
        <View style={styles.headerActions}>
          {/* TODO: export/share the routine */}
          <Pressable hitSlop={8}>
            <Icon name="arrow-redo-outline" size={22} color={colors.textPrimary} />
          </Pressable>
          {/* TODO: rename/delete menu */}
          <Pressable hitSlop={8}>
            <Icon name="ellipsis-vertical" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, routine.name]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {routine.workouts.map((w) => (
            <RoutineRow
              key={w.id}
              name={w.name}
              subtitle={`${w.exercises} exercises`}
              onPress={() => navigation.navigate('WorkoutDetail', { id: w.id })}
            />
          ))}
        </View>

        {/* TODO: workout builder flow (routine editing isn't built yet) */}
        <Pressable style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.85 }]}>
          <Card gradient={gradients.surface} padded={false} cornerRadius={radius.md} style={styles.createCard}>
            <Icon name="add" size={20} color={colors.textSecondary} />
            <Text style={[typography.bodyStrong, { color: colors.textSecondary }]}>
              Create New Workout
            </Text>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'], paddingTop: spacing.md },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  list: { gap: spacing.md, marginTop: spacing.sm },
  createBtn: { marginTop: spacing.xl },
  createCard: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
