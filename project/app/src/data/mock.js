// Temporary mock data so screens are visual before real persistence exists.
// Replace with a data store (Supabase) later — keep these shapes stable.

// All saved routines (training splits). Each routine is a folder of workouts.
export const routines = [
  {
    id: '4day',
    name: '4-Day Split',
    workouts: [
      { id: 'upper', name: 'Upper Body', exercises: 6 },
      { id: 'lower', name: 'Lower Body', exercises: 4 },
      { id: 'chest-arms', name: 'Chest & Arms', exercises: 5 },
      { id: 'back-arms', name: 'Back & Arms', exercises: 5 },
    ],
  },
  {
    id: 'ppl',
    name: 'PPL Routine',
    workouts: [
      { id: 'push-a', name: 'Push A', exercises: 6 },
      { id: 'pull-a', name: 'Pull A', exercises: 5 },
      { id: 'legs-a', name: 'Legs A', exercises: 6 },
      { id: 'push-b', name: 'Push B', exercises: 5 },
      { id: 'pull-b', name: 'Pull B', exercises: 5 },
    ],
  },
  {
    id: 'arnold',
    name: 'Arnold Routine',
    workouts: [
      { id: 'chest-back-1', name: 'Chest & Back', exercises: 6 },
      { id: 'shoulders-arms-1', name: 'Shoulders & Arms', exercises: 6 },
      { id: 'legs-1', name: 'Legs & Lower Back', exercises: 5 },
      { id: 'chest-back-2', name: 'Chest & Back II', exercises: 6 },
      { id: 'shoulders-arms-2', name: 'Shoulders & Arms II', exercises: 6 },
      { id: 'legs-2', name: 'Legs & Lower Back II', exercises: 5 },
    ],
  },
];

// Look up a routine by id (Plan Detail). Falls back to the main routine so a
// bad/missing id never renders an empty screen while data is still mock.
export const getRoutine = (id) => routines.find((r) => r.id === id) ?? routines[0];

// The user's main routine. The app recommends today's session from it and
// shows the routine's name as the first Home tab.
export const mainRoutine = routines[0];

// Recommended session for today, derived from the main routine.
export const todaysWorkout = {
  name: 'Upper Body',
  plan: mainRoutine.name,
  week: 2,
};

// The user's saved routines (the "Library" tab): folder-card summaries.
export const library = routines.map((r) => ({
  id: r.id,
  name: r.name,
  items: r.workouts.length,
}));

// ---------------------------------------------------------------------------
// Profile

// The signed-in user's profile screen data. `delta` badges carry a direction
// ('up' | 'down') so the view can colour + point them without parsing strings.
export const profile = {
  name: 'John Doe',
  since: 2021,
  // Rolling 7-day summary shown under the avatar.
  snapshot: {
    workouts: '4',
    duration: '4h 26min',
    durationDelta: { dir: 'up', value: '36 min' },
    volume: '9,225 kg',
    volumeDelta: { dir: 'down', value: '721 kg' },
  },
  // All-time headline stats (2×2 grid).
  stats: [
    { id: 'workouts', icon: 'barbell-outline', label: 'WORKOUTS', value: '142' },
    { id: 'streak', icon: 'flame', label: 'STREAK', value: '12', unit: 'weeks' },
    { id: 'pr', icon: 'trophy', label: 'PR COUNT', value: '8' },
    { id: 'hours', icon: 'time-outline', label: 'HOURS', value: '210', unit: 'hours' },
  ],
  // Active goals with progress notes.
  goals: [
    { id: 'weight', icon: 'target', title: 'Target Weight', current: 'Current: 84kg', target: '80 kg', note: '-4 kg to go' },
    { id: 'bench', icon: 'barbell-outline', title: 'Bench Press', current: 'Current: 90kg', target: '100 kg', note: '10 kg to go' },
  ],
  // Insight shortcuts (2×2 grid). `route` navigates when present.
  insights: [
    { id: 'calendar', icon: 'calendar', label: 'Calendar', route: 'Calendar' },
    { id: 'report', icon: 'report', label: 'Report' },
    { id: 'statistics', icon: 'stats', label: 'Statistics' },
    { id: 'measures', icon: 'measure', label: 'Measures' },
  ],
  // Data actions (row of two).
  data: [
    { id: 'export', icon: 'export', label: 'Export Data' },
    { id: 'sync', icon: 'cloud', label: 'Sync Cloud' },
  ],
};

// ---------------------------------------------------------------------------
// Workout Detail

// Progress series shown on the Workout Detail chart, per metric. Values are
// per-session totals over the selected range (labels = session dates).
const progressLabels = ['26 Sep', '23 Sep', '17 Oct', '10 Nov', '4 Dec', '30 Dec'];
const progress = {
  volume: { unit: 'kg', values: [3000, 3800, 5800, 3000, 4500, 8500] },
  duration: { unit: 'min', values: [48, 52, 61, 45, 55, 58] },
  reps: { unit: 'reps', values: [96, 104, 128, 92, 112, 140] },
};

// Full exercise lists for the main routine's workouts (the design's Upper Body
// list plus plausible companions). Meta = last working weight · sets × reps.
const exerciseDetails = {
  upper: [
    { id: 'bench', name: 'Bench Press', meta: '50 kg · 3 × 9-10' },
    { id: 'lat', name: 'Lat Pulldown', meta: '50 kg · 3 × 9-10' },
    { id: 'ohp', name: 'Overhead Press (Barbell)', meta: '50 kg · 3 × 9-10' },
    { id: 'row', name: 'Bent Over Row (Barbell)', meta: '50 kg · 3 × 9-10' },
    { id: 'incline-db', name: 'Incline Press (Dumbbell)', meta: '22 kg · 3 × 10-12' },
    { id: 'curl', name: 'Biceps Curl (Dumbbell)', meta: '14 kg · 3 × 10-12' },
  ],
  lower: [
    { id: 'squat', name: 'Back Squat (Barbell)', meta: '80 kg · 4 × 6-8' },
    { id: 'rdl', name: 'Romanian Deadlift', meta: '70 kg · 3 × 8-10' },
    { id: 'legpress', name: 'Leg Press', meta: '120 kg · 3 × 10-12' },
    { id: 'calf', name: 'Standing Calf Raise', meta: '60 kg · 4 × 12-15' },
  ],
};

// Generic pool for workouts without a hand-written list (PPL / Arnold …) so
// every routine row opens a fully rendered detail screen.
const exercisePool = [
  { id: 'bench', name: 'Bench Press', meta: '50 kg · 3 × 9-10' },
  { id: 'lat', name: 'Lat Pulldown', meta: '50 kg · 3 × 9-10' },
  { id: 'ohp', name: 'Overhead Press (Barbell)', meta: '30 kg · 3 × 9-10' },
  { id: 'row', name: 'Bent Over Row (Barbell)', meta: '50 kg · 3 × 9-10' },
  { id: 'squat', name: 'Back Squat (Barbell)', meta: '80 kg · 4 × 6-8' },
  { id: 'rdl', name: 'Romanian Deadlift', meta: '70 kg · 3 × 8-10' },
];

// Look up a workout by id across all routines and return the Workout Detail
// shape: name, exercise list, duration estimate, and per-metric progress.
export function getWorkout(id) {
  let workout = null;
  for (const r of routines) {
    workout = r.workouts.find((w) => w.id === id);
    if (workout) break;
  }
  if (!workout) workout = routines[0].workouts[0];
  const exercises =
    exerciseDetails[workout.id] ?? exercisePool.slice(0, workout.exercises);
  return {
    id: workout.id,
    name: workout.name,
    durationEstimate: '50-60 min',
    exercises,
    progressLabels,
    progress,
  };
}
