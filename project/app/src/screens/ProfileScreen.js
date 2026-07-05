import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  colors,
  useTypography,
  spacing,
  radius,
  borderCurve,
  gradients,
  shadows,
} from '../theme';
import { Card, Icon, ScreenHeader } from '../components';
import { profile } from '../data/mock';

// A section title with a trailing chevron affordance (Weekly Snapshot / Goals).
function SectionHeader({ title, onPress }) {
  const typography = useTypography();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.sectionHeader, pressed && onPress ? { opacity: 0.6 } : null]}
    >
      <Text style={[typography.h5, { color: colors.textSecondary }]}>{title}</Text>
      {onPress ? (
        <Icon name="chevron-forward" size={22} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
}

// Small trend pill: coloured up-arrow (positive) or faint down-arrow (negative).
function Delta({ dir, value }) {
  const typography = useTypography();
  const up = dir === 'up';
  const tint = up ? colors.success : colors.textFaint;
  return (
    <View style={styles.delta}>
      <Icon name={up ? 'caret-up' : 'caret-down'} size={14} color={tint} />
      <Text style={[typography.label, { color: tint }]}>{value}</Text>
    </View>
  );
}

// One column of the weekly snapshot row (label over value, optional delta).
function SnapshotStat({ label, value, delta }) {
  const typography = useTypography();
  return (
    <View style={styles.snapCol}>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[typography.bodyStrong, { color: colors.textPrimary }]}>{value}</Text>
      {delta ? <Delta dir={delta.dir} value={delta.value} /> : null}
    </View>
  );
}

// All-time headline stat (gradient card, 2×2 grid).
function StatCard({ item }) {
  const typography = useTypography();
  return (
    <Card gradient={gradients.surface} style={styles.statCard}>
      <View style={styles.statTop}>
        <Icon name={item.icon} size={22} color={colors.textSecondary} />
        <Text style={[typography.label, styles.statLabel]}>{item.label}</Text>
      </View>
      <View style={styles.statValueRow}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{item.value}</Text>
        {item.unit ? (
          <Text style={[typography.captionSmall, { color: colors.textSecondary }]}>{item.unit}</Text>
        ) : null}
      </View>
    </Card>
  );
}

// A single active-goal row (elevated gradient card).
function GoalCard({ item }) {
  const typography = useTypography();
  return (
    <Card gradient={gradients.surfaceElevated} style={styles.goalCard}>
      <View style={styles.goalLeft}>
        <View style={styles.iconChip}>
          <Icon name={item.icon} size={22} color={colors.textPrimary} />
        </View>
        <View style={styles.goalText}>
          <Text style={[typography.h5, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{item.current}</Text>
        </View>
      </View>
      <View style={styles.goalRight}>
        <Text style={[typography.h2, { color: colors.textPrimary }]}>{item.target}</Text>
        <Text style={[typography.captionSmall, { color: colors.textSecondary }]}>{item.note}</Text>
      </View>
    </Card>
  );
}

// Flat icon+label tile used by the Insights grid and the Data action row.
function TileButton({ item, onPress, style }) {
  const typography = useTypography();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, style, pressed && onPress ? { opacity: 0.7 } : null]}
    >
      <Icon name={item.icon} size={22} color={colors.textMuted} />
      <Text style={[typography.callout, { color: colors.textMuted }]} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const typography = useTypography();
  const { name, since, snapshot, stats, goals, insights, data } = profile;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Profile"
          trailingIcon="settings"
          onTrailingPress={() => navigation.navigate('Settings')}
        />

        <View style={styles.sections}>
          {/* User identity */}
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Icon name="person" size={52} color={colors.textMuted} />
            </View>
            <View style={styles.nameBlock}>
              <Text style={[typography.h2, { color: colors.textPrimary }]}>{name}</Text>
              <View style={styles.tagline}>
                <Icon name="calendar" size={16} color={colors.textSecondary} />
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  Training since {since}
                </Text>
              </View>
            </View>
          </View>

          {/* Weekly snapshot */}
          <View style={styles.section}>
            <SectionHeader title="Your Weekly Snapshot" onPress={() => {}} />
            <View style={styles.snapshotRow}>
              <SnapshotStat label="Workouts" value={snapshot.workouts} />
              <SnapshotStat label="Duration" value={snapshot.duration} delta={snapshot.durationDelta} />
              <SnapshotStat label="Volume" value={snapshot.volume} delta={snapshot.volumeDelta} />
            </View>
          </View>

          {/* Headline stats */}
          <View style={styles.grid}>
            {stats.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </View>

          {/* Active goals */}
          <View style={styles.section}>
            <SectionHeader title="Active Goals" onPress={() => {}} />
            <View style={styles.goalList}>
              {goals.map((item) => (
                <GoalCard key={item.id} item={item} />
              ))}
            </View>
          </View>

          {/* Insights */}
          <View style={styles.section}>
            <Text style={[typography.h5, styles.plainHeader]}>Insights</Text>
            <View style={styles.grid}>
              {insights.map((item) => (
                <TileButton
                  key={item.id}
                  item={item}
                  style={styles.gridTile}
                  onPress={item.route ? () => navigation.navigate(item.route) : undefined}
                />
              ))}
            </View>
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text style={[typography.h5, styles.plainHeader]}>Data</Text>
            <View style={styles.dataRow}>
              {data.map((item) => (
                <TileButton key={item.id} item={item} style={styles.dataTile} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['4xl'] },
  sections: { gap: spacing['4xl'] },
  section: { gap: spacing.md },

  // Identity
  identity: { alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderCurve,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  nameBlock: { alignItems: 'center', gap: spacing.xs },
  tagline: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  plainHeader: { color: colors.textSecondary },

  // Weekly snapshot
  snapshotRow: { flexDirection: 'row', justifyContent: 'space-between' },
  snapCol: { gap: spacing.xs, alignItems: 'flex-start' },
  delta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceChip,
    borderRadius: radius.pill,
    borderCurve,
    paddingLeft: spacing.xs + 2,
    paddingRight: spacing.sm + 2,
    paddingVertical: 3,
    marginTop: spacing.xs,
  },

  // 2-column grid (stats + insights)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.lg,
  },
  statCard: { width: '48%', gap: spacing.sm },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statLabel: { color: colors.textSecondary },
  statValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },

  // Goals
  goalList: { gap: spacing.lg },
  goalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderCurve,
    backgroundColor: colors.iconChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: { gap: 2, flexShrink: 1 },
  goalRight: { alignItems: 'flex-end', gap: 2 },

  // Flat tiles (insights + data)
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    borderCurve,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
  },
  gridTile: { width: '48%' },
  dataRow: { flexDirection: 'row', gap: spacing.lg },
  dataTile: { flex: 1 },
});
