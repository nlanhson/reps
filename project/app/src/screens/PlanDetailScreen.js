import { useLayoutEffect } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, useTypography, spacing } from '../theme';
import { Icon, RoutineRow } from '../components';
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
    const onShare = () =>
      Share.share({ message: `Check out my "${routine.name}" routine on Reps` });
    // TODO: real deletion needs routine persistence (see STATE.md); for now the
    // confirm just backs out of the detail screen.
    const onDelete = () =>
      Alert.alert('Delete Routine', `Delete "${routine.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
      ]);

    // TODO: routine editing isn't built yet — placeholder option, no-op for now.
    const onEdit = () => {};

    // Kebab → native menu (Share now has its own button, so the menu holds the
    // rest). ActionSheetIOS is the real UIKit sheet; Android falls back to Alert.
    const openMenu = () => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: routine.name,
            options: ['Edit Routine', 'Delete Routine', 'Cancel'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2,
          },
          (i) => {
            if (i === 0) onEdit();
            else if (i === 1) onDelete();
          },
        );
      } else {
        Alert.alert(routine.name, undefined, [
          { text: 'Edit', onPress: onEdit },
          { text: 'Delete', style: 'destructive', onPress: onDelete },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    };

    // Share + kebab in one headerRight View → one glass capsule ("one OS
    // component"), both wired. `export` = the real iOS share glyph.
    navigation.setOptions({
      title: routine.name,
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable hitSlop={8} style={styles.headerBtn} onPress={onShare}>
            <Icon name="export" size={22} color={colors.textPrimary} />
          </Pressable>
          <Pressable hitSlop={8} style={styles.headerBtn} onPress={openMenu}>
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
        {/* Ghost action: icon + text only, no surface (matches Home's "Start Empty Workout"). */}
        <Pressable style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.6 }]}>
          <Icon name="add" size={20} color={colors.textSecondary} />
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            New Workout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'], paddingTop: spacing.md },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  // Fixed, symmetric box so each SF Symbol centers inside its native (glass)
  // header button — a bare wide glyph like `ellipsis` otherwise reads off-centre.
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  list: { gap: spacing.md, marginTop: spacing.sm },
  createBtn: {
    marginTop: spacing.xl,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
