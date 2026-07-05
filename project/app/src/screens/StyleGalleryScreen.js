import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';
import {
  AppButton,
  Avatar,
  CalendarMonth,
  Card,
  Chip,
  ConfirmDialog,
  ExerciseRow,
  ListRow,
  ScreenHeader,
  SectionLabel,
  Separator,
  SessionCard,
  StatTile,
  Toggle,
  UnderlineTabs,
  WeekStrip,
} from '../components';

// Kitchen-sink screen that renders every shared component once, so the
// visual style can be verified against the design-system / component sheet
// before assembling real screens. Reached via the hidden "Gallery" route.

const WEEK = [
  { key: 'm', weekday: 'Mon', date: 10, logged: true },
  { key: 't', weekday: 'Tue', date: 11, logged: true },
  { key: 'w', weekday: 'Wed', date: 12 },
  { key: 'th', weekday: 'Thu', date: 13, logged: true },
  { key: 'f', weekday: 'Fri', date: 14 },
  { key: 's', weekday: 'Sat', date: 15 },
  { key: 'su', weekday: 'Sun', date: 16 },
];

const SESSION = {
  name: 'Upper Body',
  date: 'Monday, May 5 · 2026',
  duration: '46 min',
  volume: '3,438 kg',
  setCount: '15 Set',
  exercises: [
    { name: 'Bench Press', countPrefix: '3 ×', meta: '50 kg · 3 × 8–10' },
    { name: 'Lat Pulldown', countPrefix: '3 ×', meta: '50 kg · 3 × 8–10' },
    { name: 'Overhead Press (Barbell)', countPrefix: '2 ×', meta: '50 kg · 3 × 8–10' },
    { name: 'Bent Over Row (Barbell)', countPrefix: '3 ×', meta: '50 kg · 3 × 8–10' },
  ],
};

function Group({ title, children }) {
  return (
    <View style={styles.group}>
      <SectionLabel>{title}</SectionLabel>
      {children}
    </View>
  );
}

const now = new Date();
const CALENDAR_DATA = { 2: 0.3, 5: 0.6, 9: 1, 10: 0.4, 16: 0.8, 22: 0.5 };

export default function StyleGalleryScreen({ navigation }) {
  const [tab, setTab] = useState('Workouts');
  const [chip, setChip] = useState('Volume');
  const [day, setDay] = useState('w');
  const [expanded, setExpanded] = useState(false);
  const [sw, setSw] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [calMonth, setCalMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [calDay, setCalDay] = useState(now.getDate());

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Style Gallery"
          variant="back"
          onBack={() => navigation?.goBack?.()}
        />

        <Group title="Buttons">
          <View style={{ gap: spacing.sm }}>
            <AppButton label="Start Workout" icon="play" onPress={() => {}} />
            <AppButton label="Start Empty Workout" icon="add" variant="secondary" onPress={() => {}} />
            <AppButton label="Outline" variant="outline" onPress={() => {}} />
            <AppButton label="Ghost" variant="ghost" onPress={() => {}} />
            <AppButton label="Destructive" variant="destructive" onPress={() => {}} />
          </View>
        </Group>

        <Group title="Avatar">
          <View style={styles.rowWrap}>
            <Avatar name="Son Nguyen" size="sm" />
            <Avatar name="Son Nguyen" size="md" />
            <Avatar name="Son Nguyen" size="lg" />
          </View>
        </Group>

        <Group title="Tags / Chips">
          <View style={styles.rowWrap}>
            {['Volume', 'Duration', 'Reps'].map((c) => (
              <Chip key={c} label={c} selected={chip === c} onPress={() => setChip(c)} />
            ))}
          </View>
        </Group>

        <Group title="Underline Tabs">
          <UnderlineTabs tabs={['Workouts', 'Library']} value={tab} onChange={setTab} />
        </Group>

        <Group title="Week Strip">
          <Card>
            <WeekStrip days={WEEK} selectedKey={day} onSelect={setDay} />
          </Card>
        </Group>

        <Group title="Stat Tiles">
          <View style={styles.rowWrap}>
            <StatTile value="142" label="Workouts" />
            <StatTile value="12" label="This week" />
            <StatTile value="8" label="Streak" />
          </View>
        </Group>

        <Group title="Exercise Rows (in a Card)">
          <Card>
            <ExerciseRow name="Bench Press" meta="50 kg · 3 × 8–10" />
            <Separator inset={52} />
            <ExerciseRow name="Lat Pulldown" meta="50 kg · 3 × 8–10" />
          </Card>
        </Group>

        <Group title="List Rows (Settings)">
          <Card>
            <ListRow label="Profile" icon="person-outline" />
            <Separator inset={36} />
            <ListRow label="Weight Unit" icon="barbell-outline" value="kg" />
            <Separator inset={36} />
            <ListRow
              label="Sound & vibration"
              icon="volume-high-outline"
              showChevron={false}
              trailing={<Toggle value={sw} onValueChange={setSw} />}
            />
          </Card>
        </Group>

        <Group title="Calendar / Heatmap">
          <Card>
            <CalendarMonth
              year={calMonth.year}
              month={calMonth.month}
              data={CALENDAR_DATA}
              selectedDay={calDay}
              onSelectDay={setCalDay}
              onPrevMonth={() =>
                setCalMonth(({ year, month }) =>
                  month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
                )
              }
              onNextMonth={() =>
                setCalMonth(({ year, month }) =>
                  month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
                )
              }
            />
          </Card>
        </Group>

        <Group title="Logged Session Card">
          <SessionCard
            session={SESSION}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        </Group>

        <Group title="Confirmation Dialog">
          <AppButton label="Open discard dialog" variant="secondary" onPress={() => setDialog(true)} />
        </Group>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      <ConfirmDialog
        visible={dialog}
        title="Confirmation"
        message="Are you sure you want to discard the workout in progress?"
        confirmLabel="Discard Workout"
        cancelLabel="Cancel"
        onConfirm={() => setDialog(false)}
        onCancel={() => setDialog(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] },
  group: { marginBottom: spacing['2xl'] },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
