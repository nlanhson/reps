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

export const historyWeeks = [
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
