// Mock active workout session. Replace with Supabase-backed data later
// (the screen reads/writes this shape, so swapping the source is isolated).

export const UNIT = 'kg'; // default; becomes a Settings toggle (kg | lb)

export function makeSession() {
  return {
    name: 'Upper Body',
    exercises: [
      {
        id: 'bench',
        name: 'Bench Press',
        restSeconds: 120,
        sets: [
          { prev: '50 kg × 10', kg: 50, reps: 10, done: true },
          { prev: '50 kg × 10', kg: 50, reps: 10, done: true },
          { prev: '50 kg × 10', kg: 50, reps: 10, done: true },
        ],
      },
      {
        id: 'lat',
        name: 'Lat Pulldown',
        restSeconds: 90,
        sets: [
          { prev: '40 kg × 12', kg: 40, reps: 12, done: true },
          { prev: '40 kg × 12', kg: 40, reps: 12, done: true },
          { prev: '40 kg × 12', kg: 40, reps: 12, done: true },
        ],
      },
      {
        id: 'ohp',
        name: 'Overhead Press (Barbell)',
        restSeconds: 120,
        sets: [
          { prev: '50 kg × 10', kg: 50, reps: 12, done: true },
          { prev: '50 kg × 10', kg: 50, reps: null, done: false },
          { prev: '50 kg × 10', kg: null, reps: null, done: false },
        ],
      },
    ],
  };
}
