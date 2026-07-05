import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, useTypography, spacing } from '../theme';
import { Icon, ScreenHeader, SessionCard, WeekStrip } from '../components';
import { historyWeeks, todayKey } from '../data/history';

// History tab — the "Weekly Workout Log" (Figma node 687:5226):
// month navigator + day-pill week strip on top, and below it the logged
// sessions for that week, paged horizontally one page per week. Chevrons
// and swipes both drive the same week index, so the strip stays in sync.
export default function HistoryScreen() {
  const typography = useTypography();
  const { width } = useWindowDimensions();
  const pagerRef = useRef(null);
  const [weekIndex, setWeekIndex] = useState(historyWeeks.length - 1); // land on the current week
  const [expanded, setExpanded] = useState({}); // session id → expanded?

  const week = historyWeeks[weekIndex];
  const canBack = weekIndex > 0;
  const canForward = weekIndex < historyWeeks.length - 1;

  const goToWeek = (index) => {
    if (index < 0 || index >= historyWeeks.length) return;
    pagerRef.current?.scrollToIndex({ index, animated: true });
    setWeekIndex(index);
  };

  const toggleSession = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.chrome}>
        {/* TODO: "+" = log a past workout manually — flow not designed yet. */}
        <ScreenHeader title="History" trailingIcon="add" />

        <View style={styles.monthRow}>
          <Pressable
            hitSlop={8}
            onPress={() => goToWeek(weekIndex - 1)}
            disabled={!canBack}
            style={[styles.monthBtn, !canBack && styles.monthBtnDisabled]}
          >
            <Icon name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={[typography.h5, { color: colors.textPrimary }]}>{week.monthLabel}</Text>
          <Pressable
            hitSlop={8}
            onPress={() => goToWeek(weekIndex + 1)}
            disabled={!canForward}
            style={[styles.monthBtn, !canForward && styles.monthBtnDisabled]}
          >
            <Icon name="chevron-forward" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        <WeekStrip days={week.days} selectedKey={todayKey} />
      </View>

      <FlatList
        ref={pagerRef}
        data={historyWeeks}
        keyExtractor={(w) => w.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={weekIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={(e) =>
          setWeekIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <ScrollView
            style={{ width }}
            contentContainerStyle={styles.page}
            showsVerticalScrollIndicator={false}
          >
            {item.sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                expanded={!!expanded[s.id]}
                onToggle={() => toggleSession(s.id)}
              />
            ))}
            <Text style={[typography.body, styles.note]}>{item.note}</Text>
          </ScrollView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  chrome: { paddingHorizontal: spacing.xl },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBtnDisabled: { opacity: 0.35 },
  page: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing['2xl'],
  },
  note: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
