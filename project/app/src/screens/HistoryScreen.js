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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, useTypography, spacing, useTier, GlassSurface } from '../theme';
import { Icon, ScreenHeader, SessionCard, WeekStrip } from '../components';
import { historyWeeks, todayKey } from '../data/history';

// Native blur is required lazily so a runtime that lacks it (e.g. a dev build
// compiled before expo-blur was added) degrades instead of red-boxing.
let BlurView = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

// The pinned bar's background material, chosen per UI tier (same rule as the
// rest of the app: native glass/blur only on the tier that guarantees it).
//  - liquid-glass → real iOS Liquid Glass (GlassSurface)
//  - fallback / material-you → expo-blur BlurView (bundled in Expo Go)
//  - neither available → a translucent solid bar so the screen still renders
function BarBackground({ tier }) {
  if (tier === 'liquid-glass') {
    return <GlassSurface style={StyleSheet.absoluteFill} />;
  }
  if (BlurView) {
    return <BlurView tint="dark" intensity={40} style={StyleSheet.absoluteFill} />;
  }
  return <View style={[StyleSheet.absoluteFill, styles.chromeSolid]} />;
}

// History tab — the "Weekly Workout Log" (Figma node 687:5226):
// month navigator + day-pill week strip on top, and below it the logged
// sessions for that week, paged horizontally one page per week. Chevrons
// and swipes both drive the same week index, so the strip stays in sync.
export default function HistoryScreen() {
  const typography = useTypography();
  const insets = useSafeAreaInsets();
  const tier = useTier();
  const { width } = useWindowDimensions();
  const pagerRef = useRef(null);
  const [weekIndex, setWeekIndex] = useState(historyWeeks.length - 1); // land on the current week
  const [expanded, setExpanded] = useState({}); // session id → expanded?
  // Height of the pinned week navigator. The pager underlaps it, so its content
  // is padded down by this so the first card sits just below the strip at rest.
  // Estimate first (avoids a first-frame jump), then correct via onLayout.
  const [chromeH, setChromeH] = useState(210);
  // Apple scroll-edge behavior: the strip's hairline separator only appears once
  // content has scrolled under it; at the very top the bar reads flush/open.
  const [scrolled, setScrolled] = useState(false);

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
    <View style={styles.safe}>
      {/* Pager underlaps the pinned strip; each page pads its content down by the
          measured strip height so the first card rests just below it. */}
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
            contentContainerStyle={[styles.page, { paddingTop: chromeH + spacing.lg }]}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 0)}
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

      {/* Pinned week navigator — Apple nav-bar material: a translucent blur that
          cards frost under (not a solid fade), plus a hairline that appears on
          scroll. Measured via onLayout for the pager's top padding. */}
      <View
        style={[styles.chrome, { paddingTop: insets.top }]}
        onLayout={(e) => setChromeH(e.nativeEvent.layout.height)}
      >
        <BarBackground tier={tier} />

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

        {/* Scroll-edge separator: only once content sits under the bar. */}
        {scrolled && <View style={styles.chromeHairline} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  chrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: 'hidden', // clip the blur/glass fill to the bar bounds
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  // Degrade when no native blur/glass view is available (keeps the bar opaque).
  chromeSolid: { backgroundColor: 'rgba(5,5,5,0.88)' },
  // Apple scroll-edge separator: a hairline pinned to the bar's bottom edge.
  chromeHairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.05)', // dimmed scroll-edge separator
  },
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
    paddingBottom: spacing['4xl'],
    gap: spacing['2xl'],
  },
  note: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
