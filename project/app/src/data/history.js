// Mock workout history for the History tab. Replace with the data store
// (Supabase) later — keep these shapes stable:
//   week    = { key, monthLabel, days, sessions, note }
//   day     = { key: 'YYYY-MM-DD', weekday, date, logged }
//   session = SessionCard shape (name, date, duration, volume, setCount, exercises)
import { getWorkout } from './mock';

// History exercise lines reuse the workout-detail lists, with the logged
// set count as an inline prefix ("3 × Bench Press").
const logged = (workoutId, prefix = '3 ×') =>
  getWorkout(workoutId).exercises.map((e) => ({
    name: e.name,
    meta: e.meta,
    countPrefix: prefix,
  }));

// "Today" for the mock dataset — the selected pill in the week strip.
export const todayKey = '2026-07-04';

// The two most recent weeks are hand-written for realistic copy; everything
// older is generated (see below). Keep these two the newest in the array.
const curatedWeeks = [
  {
    key: 'w-2026-06-22',
    monthLabel: 'Jun, 2026',
    days: [
      { key: '2026-06-22', weekday: 'Mon', date: 22, logged: true },
      { key: '2026-06-23', weekday: 'Tue', date: 23, logged: true },
      { key: '2026-06-24', weekday: 'Wed', date: 24 },
      { key: '2026-06-25', weekday: 'Thu', date: 25, logged: true },
      { key: '2026-06-26', weekday: 'Fri', date: 26, logged: true },
      { key: '2026-06-27', weekday: 'Sat', date: 27 },
      { key: '2026-06-28', weekday: 'Sun', date: 28 },
    ],
    sessions: [
      {
        id: 's-2026-06-26',
        name: 'Back & Arms',
        date: 'Friday, Jun 26, 2026 · 5:41pm',
        duration: '49 min',
        volume: '3,240 kg',
        setCount: '15 Set',
        exercises: logged('back-arms'),
      },
      {
        id: 's-2026-06-25',
        name: 'Chest & Arms',
        date: 'Thursday, Jun 25, 2026 · 4:55pm',
        duration: '44 min',
        volume: '2,980 kg',
        setCount: '15 Set',
        exercises: logged('chest-arms'),
      },
      {
        id: 's-2026-06-23',
        name: 'Lower Body',
        date: 'Tuesday, Jun 23, 2026 · 5:03pm',
        duration: '52 min',
        volume: '5,120 kg',
        setCount: '12 Set',
        exercises: logged('lower'),
      },
      {
        id: 's-2026-06-22',
        name: 'Upper Body',
        date: 'Monday, Jun 22, 2026 · 4:12pm',
        duration: '46 min',
        volume: '3,438 kg',
        setCount: '15 Set',
        exercises: logged('upper'),
      },
    ],
    note: 'You’ve hit your goal this week.\nKeep up the good work.',
  },
  {
    key: 'w-2026-06-29',
    monthLabel: 'Jul, 2026',
    days: [
      { key: '2026-06-29', weekday: 'Mon', date: 29, logged: true },
      { key: '2026-06-30', weekday: 'Tue', date: 30 },
      { key: '2026-07-01', weekday: 'Wed', date: 1, logged: true },
      { key: '2026-07-02', weekday: 'Thu', date: 2 },
      { key: '2026-07-03', weekday: 'Fri', date: 3 },
      { key: '2026-07-04', weekday: 'Sat', date: 4, logged: true },
      { key: '2026-07-05', weekday: 'Sun', date: 5 },
    ],
    sessions: [
      {
        id: 's-2026-07-04',
        name: 'Chest & Arms',
        date: 'Saturday, Jul 4, 2026 · 5:12pm',
        duration: '47 min',
        volume: '3,105 kg',
        setCount: '15 Set',
        exercises: logged('chest-arms'),
      },
      {
        id: 's-2026-07-01',
        name: 'Lower Body',
        date: 'Wednesday, Jul 1, 2026 · 4:48pm',
        duration: '55 min',
        volume: '5,340 kg',
        setCount: '12 Set',
        exercises: logged('lower'),
      },
      {
        id: 's-2026-06-29',
        name: 'Upper Body',
        date: 'Monday, Jun 29, 2026 · 4:20pm',
        duration: '48 min',
        volume: '3,512 kg',
        setCount: '15 Set',
        exercises: logged('upper'),
      },
    ],
    note: 'Workout completed today.\nReturn tomorrow to stay consistent.',
  },
];

// --- Procedural back-history ------------------------------------------------
// Weightlifters review progress over months, not just this week, so history is
// NOT capped to a couple of weeks — we page back a full year. Production will
// lazy-load weeks from Supabase back to the user's first logged workout; this
// mock generates them deterministically (seeded, computed once) so paging feels
// deep without hand-writing every week. Bump WEEKS_OF_HISTORY freely — the
// History screen pager + chevrons already honor whatever length this array is.
const WEEKS_OF_HISTORY = 52; // one year (2 curated + 50 generated)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULLDAY = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
const TEMPLATES = [
  { id: 'upper', name: 'Upper Body' },
  { id: 'lower', name: 'Lower Body' },
  { id: 'chest-arms', name: 'Chest & Arms' },
  { id: 'back-arms', name: 'Back & Arms' },
];

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const commas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Hermes lacks Intl grouping
// Deterministic pseudo-random in [0,1) from an integer seed (stable per launch).
const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Build one Mon–Sun week from its Monday (UTC), seeded by its global index `i`.
function buildWeek(monday, i) {
  const days = [];
  for (let k = 0; k < 7; k++) {
    const d = new Date(monday);
    d.setUTCDate(d.getUTCDate() + k);
    const trained = rand(i * 7 + k) > 0.45; // ~55% of days logged
    days.push({
      key: iso(d),
      weekday: WEEKDAYS[k],
      date: d.getUTCDate(),
      ...(trained ? { logged: true } : {}),
    });
  }
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);
  const monthLabel = `${MONTHS[sunday.getUTCMonth()]}, ${sunday.getUTCFullYear()}`;

  const sessions = days
    .filter((d) => d.logged)
    .map((d, j) => {
      const t = TEMPLATES[(i + j) % TEMPLATES.length];
      const dObj = new Date(`${d.key}T00:00:00Z`);
      const vol = 2800 + Math.round(rand(i * 31 + j) * 2600); // 2,800–5,400 kg
      const dur = 42 + Math.round(rand(i * 17 + j) * 16); // 42–58 min
      return {
        id: `s-${d.key}`,
        name: t.name,
        date: `${FULLDAY[d.weekday]}, ${MONTHS[dObj.getUTCMonth()]} ${dObj.getUTCDate()}, ${dObj.getUTCFullYear()} · ${4 + (j % 3)}:${pad(10 + j * 7)}pm`,
        duration: `${dur} min`,
        volume: `${commas(vol)} kg`,
        setCount: `${12 + (j % 4)} Set`,
        exercises: logged(t.id),
      };
    })
    .reverse(); // newest day first, matching the curated weeks
  return { key: `w-${iso(monday)}`, monthLabel, days, sessions, note: 'Solid week of training.\nProgress adds up.' };
}

// Generate the older weeks that sit BEFORE the two curated ones, oldest first.
const FIRST_CURATED_MONDAY = new Date('2026-06-22T00:00:00Z');
const generatedWeeks = [];
for (let n = WEEKS_OF_HISTORY - curatedWeeks.length; n >= 1; n--) {
  const monday = new Date(FIRST_CURATED_MONDAY);
  monday.setUTCDate(monday.getUTCDate() - n * 7);
  generatedWeeks.push(buildWeek(monday, n));
}

export const historyWeeks = [...generatedWeeks, ...curatedWeeks];
