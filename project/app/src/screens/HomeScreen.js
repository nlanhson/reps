import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, gradients, radius } from '../theme';
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

const SLIDE = 24; // px the incoming content travels
const DURATION = 200; // ms — fast; tab switches happen often
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1); // strong ease-out (Emil)

export default function HomeScreen({ navigation }) {
  const [tab, setTab] = useState(LIBRARY_TAB);
  const onLibrary = tab === LIBRARY_TAB;

  // Respect the OS "reduce motion" setting — drop the positional slide and
  // keep only a quick fade (vestibular-safe).
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub?.remove?.();
  }, []);

  // Content transition: the new tab's content fades + slides in from the
  // side its tab sits on (spatial consistency). opacity + translateX only,
  // on the native driver.
  const anim = useRef(new Animated.Value(1)).current;
  const dir = useRef(1);

  const changeTab = (next) => {
    if (next === tab) return;
    dir.current = TABS.indexOf(next) > TABS.indexOf(tab) ? 1 : -1;
    setTab(next);
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: reduceMotion ? 120 : DURATION,
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start();
  };

  const contentStyle = {
    opacity: anim,
    transform: reduceMotion
      ? undefined
      : [
          {
            translateX: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [SLIDE * dir.current, 0],
            }),
          },
        ],
  };

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

        {/* Start from scratch */}
        <Pressable
          onPress={() => navigation.navigate('InSession')}
          style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.85 }]}
        >
          <Card gradient={gradients.surface} padded={false} cornerRadius={radius.md} style={styles.emptyCard}>
            <Icon name="add" size={20} color={colors.textSecondary} />
            <Text style={[typography.bodyStrong, { color: colors.textSecondary }]}>
              Start Empty Workout
            </Text>
          </Card>
        </Pressable>

        {/* Preferred routine  ⇄  Library, with per-tab actions */}
        <View style={styles.tabRow}>
          <UnderlineTabs tabs={TABS} value={tab} onChange={changeTab} />
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

        <Animated.View style={contentStyle}>
          {onLibrary ? (
            // Library: grid of folders, one per saved routine
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
          ) : (
            // Workouts: the preferred routine's workout list
            <View style={styles.list}>
              {mainRoutine.workouts.map((w) => (
                <RoutineRow
                  key={w.id}
                  name={w.name}
                  subtitle={`${w.exercises} exercises`}
                  onPress={() => navigation.navigate('WorkoutDetail', { id: w.id })}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] },
  hero: { padding: spacing.xl },
  heroMeta: { color: colors.textSecondary, marginTop: spacing.xs },
  emptyBtn: { marginTop: spacing.md },
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
  list: { gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
});
