import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, useTypography, spacing, gradients, radius } from '../theme';
import {
  AppButton,
  Card,
  Icon,
  ScreenHeader,
  SectionLabel,
  UnderlineTabs,
  RoutineRow,
  FolderCard,
} from '../components';
import { todaysWorkout, mainRoutine, library } from '../data/mock';

const WORKOUTS_TAB = mainRoutine.name; // preferred routine's workouts
const LIBRARY_TAB = 'Library'; // all saved routines
const TABS = [LIBRARY_TAB, WORKOUTS_TAB]; // display order

export default function HomeScreen({ navigation }) {
  const typography = useTypography();
  const [tab, setTab] = useState(LIBRARY_TAB);
  const onLibrary = tab === LIBRARY_TAB;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Home" trailingIcon="notifications-outline" />

        {/* Today's recommended workout, derived from the preferred routine */}
        <SectionLabel>Today's Workout</SectionLabel>
        <Card gradient={gradients.surfaceElevated} style={styles.hero}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>{todaysWorkout.name}</Text>
          <Text style={[typography.caption, styles.heroMeta]}>
            {todaysWorkout.plan}  ·  Week {todaysWorkout.week}
          </Text>
          <View style={{ marginTop: spacing.lg }}>
            <AppButton
              label="Start Workout"
              icon="play"
              onPress={() => navigation.navigate('InSession')}
            />
          </View>
        </Card>

        {/* Start from scratch — ghost action: just icon + text, no surface.
            Accent-coloured so it still reads as tappable without a border. */}
        <Pressable
          onPress={() => navigation.navigate('InSession')}
          style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.6 }]}
        >
          <Icon name="add" size={20} color={colors.textSecondary} />
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Start Empty Workout
          </Text>
        </Pressable>

        {/* Carded version — preserved for reuse. Swap this back in (and drop the
            ghost block above) to restore the filled gradient surface.
        <Pressable
          onPress={() => navigation.navigate('InSession')}
          style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.85 }]}
        >
          <Card gradient={gradients.surface} padded={false} cornerRadius={radius.md} style={styles.emptyCard}>
            <Icon name="add" size={20} color={colors.textSecondary} />
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Start Empty Workout
            </Text>
          </Card>
        </Pressable>
        */}

        {/* Preferred routine  ⇄  Library, with per-tab actions */}
        <View style={styles.tabRow}>
          <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />
          <View style={styles.tabActions}>
            {onLibrary ? (
              <>
                <Pressable hitSlop={6}>
                  <Icon name="sort-variant" size={22} color={colors.textSecondary} />
                </Pressable>
                <Pressable hitSlop={6}>
                  <Icon name="plus-box-outline" size={22} color={colors.textSecondary} />
                </Pressable>
              </>
            ) : (
              <Pressable hitSlop={6}>
                <Icon name="pin-outline" size={22} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Both tabs stay mounted and are toggled by `display` — never
            re-mounted on switch. Re-mounting the cards (inside the old animated
            wrapper) was dropping their background views on iOS, leaving text and
            icons floating on black. Mounting once, painting once, keeps them
            rock-solid. */}
        <View style={onLibrary ? undefined : styles.hidden}>
          {/* Library: grid of folders, one per saved routine */}
          <View style={styles.grid}>
            {library.map((folder) => (
              <FolderCard
                key={folder.id}
                name={folder.name}
                items={folder.items}
                onPress={() => navigation.navigate('PlanDetail', { id: folder.id })}
              />
            ))}
          </View>
        </View>
        <View style={onLibrary ? styles.hidden : undefined}>
          {/* Workouts: the preferred routine's workout list */}
          <View style={styles.list}>
            {mainRoutine.workouts.map((w) => (
              <RoutineRow
                key={w.id}
                name={w.name}
                subtitle={`${w.exercises} exercises`}
                elevated
                onPress={() => navigation.navigate('WorkoutDetail', { id: w.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] },
  hero: { padding: spacing.xl },
  heroMeta: { color: colors.textSecondary, marginTop: spacing.xs },
  emptyBtn: {
    marginTop: spacing.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  // Preserved for the carded "Start Empty Workout" variant (see JSX above).
  emptyCard: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  tabActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  hidden: { display: 'none' },
  list: { gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
});
