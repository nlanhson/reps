import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';

import { colors, typography, spacing, radius, useSurfaceStyle, GlassSurface } from '../theme';
import { makeSession, UNIT } from '../data/session';

const fmtDuration = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
const fmtRest = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

export default function InSessionScreen({ navigation }) {
  const [session, setSession] = useState(makeSession);
  const [expandedId, setExpandedId] = useState('ohp');
  const [duration, setDuration] = useState(24 * 60 + 3); // seed to match the mock
  const [rest, setRest] = useState({ active: false, remaining: 120 });

  // Rest-bar chrome follows the active UI tier (glass / material / fallback).
  const restChrome = useSurfaceStyle('bar', radius.pill);
  const RestWrap = restChrome.glass ? GlassSurface : View;
  const restWrapProps = restChrome.glass
    ? { radius: radius.pill, style: styles.restBar }
    : { style: [styles.restBar, restChrome.style] };

  // Workout duration ticks up.
  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Rest countdown.
  useEffect(() => {
    if (!rest.active) return;
    const t = setInterval(() => {
      setRest((r) => {
        if (r.remaining <= 1) return { active: false, remaining: 0 };
        return { ...r, remaining: r.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rest.active]);

  const { volume, setsDone } = useMemo(() => {
    let v = 0;
    let n = 0;
    session.exercises.forEach((ex) =>
      ex.sets.forEach((s) => {
        if (s.done && s.kg && s.reps) {
          v += s.kg * s.reps;
          n += 1;
        }
      })
    );
    return { volume: v, setsDone: n };
  }, [session]);

  const updateSet = (exId, idx, patch) =>
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id !== exId
          ? ex
          : { ...ex, sets: ex.sets.map((s, i) => (i === idx ? { ...s, ...patch } : s)) }
      ),
    }));

  const toggleDone = (ex, idx) => {
    const willBeDone = !ex.sets[idx].done;
    updateSet(ex.id, idx, { done: willBeDone });
    if (willBeDone) setRest({ active: true, remaining: ex.restSeconds });
  };

  const addSet = (exId) =>
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id !== exId
          ? ex
          : { ...ex, sets: [...ex.sets, { prev: '—', kg: null, reps: null, done: false }] }
      ),
    }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.titleRow} hitSlop={8} onPress={() => navigation.goBack()}>
          <Icon name="chevron-down" size={22} color={colors.textPrimary} />
          <Text style={[typography.h4, { color: colors.textPrimary }]}>{session.name}</Text>
        </Pressable>
        <Pressable
          style={styles.finish}
          onPress={() => navigation.popToTop()}
        >
          <Text style={[typography.bodyStrong, { color: colors.textOnAccent }]}>Finish</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Stat label="Duration" value={fmtDuration(duration)} />
        <Stat label="Volume" value={`${volume.toLocaleString()} ${UNIT}`} />
        <Stat label="Set" value={String(setsDone)} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {session.exercises.map((ex) => {
          const doneCount = ex.sets.filter((s) => s.done).length;
          const expanded = expandedId === ex.id;
          return (
            <View key={ex.id} style={styles.card}>
              <Pressable
                style={styles.exHeader}
                onPress={() => setExpandedId(expanded ? null : ex.id)}
              >
                <View style={styles.avatar}>
                  <Icon name="barbell-outline" size={18} color={colors.textPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.bodyStrong, { color: colors.textPrimary }]}>
                    {ex.name}
                  </Text>
                  {expanded ? (
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                      Rest: {fmtRest(ex.restSeconds)}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        typography.caption,
                        { color: doneCount === ex.sets.length ? colors.success : colors.textSecondary },
                      ]}
                    >
                      {doneCount}/{ex.sets.length} Done
                    </Text>
                  )}
                </View>
                <Icon
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>

              {expanded && (
                <View style={styles.table}>
                  <View style={styles.row}>
                    <Text style={[styles.th, styles.colSet]}>SET</Text>
                    <Text style={[styles.th, styles.colPrev]}>PREVIOUS</Text>
                    <Text style={[styles.th, styles.colNum]}>{UNIT.toUpperCase()}</Text>
                    <Text style={[styles.th, styles.colNum]}>REPS</Text>
                    <Icon name="checkmark" size={14} color={colors.textSecondary} style={styles.colCheck} />
                  </View>

                  {ex.sets.map((s, i) => (
                    <View key={i} style={[styles.row, s.done && styles.rowDone]}>
                      <Text style={[styles.td, styles.colSet, { color: colors.textPrimary }]}>{i + 1}</Text>
                      <Text style={[styles.td, styles.colPrev, { color: colors.textSecondary }]}>
                        {s.prev}
                      </Text>
                      <Cell
                        value={s.kg}
                        onChange={(v) => updateSet(ex.id, i, { kg: v })}
                      />
                      <Cell
                        value={s.reps}
                        onChange={(v) => updateSet(ex.id, i, { reps: v })}
                      />
                      <Pressable
                        onPress={() => toggleDone(ex, i)}
                        style={[styles.check, s.done && styles.checkDone, styles.colCheck]}
                      >
                        {s.done ? <Icon name="checkmark" size={16} color={colors.textOnAccent} /> : null}
                      </Pressable>
                    </View>
                  ))}

                  <Pressable style={styles.addSet} onPress={() => addSet(ex.id)}>
                    <Icon name="add" size={16} color={colors.textSecondary} />
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>Add Set</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Rest timer bar */}
      <RestWrap {...restWrapProps}>
        <Pressable
          style={styles.restAdj}
          onPress={() => setRest((r) => ({ ...r, remaining: Math.max(0, r.remaining - 15) }))}
        >
          <Text style={[typography.caption, { color: colors.textSecondary }]}>−15s</Text>
        </Pressable>
        <View style={styles.restCenter}>
          <Icon name="timer-outline" size={16} color={colors.textPrimary} />
          <Text style={[typography.bodyStrong, { color: colors.textPrimary }]}>
            {fmtRest(rest.remaining)}
          </Text>
        </View>
        <Pressable
          style={styles.restAdj}
          onPress={() => setRest((r) => ({ ...r, remaining: r.remaining + 15 }))}
        >
          <Text style={[typography.caption, { color: colors.textSecondary }]}>+15s</Text>
        </Pressable>
        <Pressable
          style={styles.skip}
          onPress={() => setRest({ active: false, remaining: 0 })}
        >
          <Text style={[typography.bodyStrong, { color: colors.textOnAccent }]}>Skip</Text>
        </Pressable>
      </RestWrap>
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.h5, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function Cell({ value, onChange }) {
  return (
    <View style={styles.colNum}>
      <TextInput
        value={value == null ? '' : String(value)}
        onChangeText={(t) => {
          const n = t.replace(/[^0-9.]/g, '');
          onChange(n === '' ? null : Number(n));
        }}
        keyboardType="numeric"
        placeholder="—"
        placeholderTextColor={colors.textMuted}
        style={[typography.body, styles.input]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  finish: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stat: { gap: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  exHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  rowDone: { opacity: 0.85 },
  th: { ...typography.label, color: colors.textSecondary },
  td: { ...typography.body },
  colSet: { width: 28 },
  colPrev: { flex: 1 },
  colNum: { width: 52, alignItems: 'center' },
  colCheck: { width: 32, alignItems: 'center' },
  input: {
    color: colors.textPrimary,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    minWidth: 44,
    textAlign: 'center',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
  },
  // Surface props (bg / radius / border) come from the tier via useSurfaceStyle;
  // this keeps only positioning + layout.
  restBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xs,
  },
  restAdj: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  restCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  skip: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
});
