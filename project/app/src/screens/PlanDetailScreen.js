import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, gradients, radius } from '../theme';
import { Card, Icon, RoutineRow, ScreenHeader } from '../components';
import { getRoutine } from '../data/mock';

// Plan Detail — a routine (training split) opened from a Library folder:
// centered routine name in the header (share + options actions), the
// routine's workouts as RoutineRows, and a ghost "Create New Workout" button.
export default function PlanDetailScreen({ navigation, route }) {
  const routine = getRoutine(route.params?.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          variant="back"
          title={routine.name}
          onBack={() => navigation.goBack()}
          trailingIcons={[
            { icon: 'arrow-redo-outline' }, // share — TODO: export/share the routine
            { icon: 'ellipsis-vertical' }, // options — TODO: rename/delete menu
          ]}
        />

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
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] },
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
