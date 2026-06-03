// Temporary mock data so screens are visual before real persistence exists.
// Replace with a data store (Supabase) later — keep these shapes stable.

// The user's main routine. The app recommends today's session from it and
// shows the routine's name as the first Home tab.
export const mainRoutine = {
  id: '4day',
  name: '4-Day Split',
  workouts: [
    { id: 'upper', name: 'Upper Body', exercises: 6 },
    { id: 'lower', name: 'Lower Body', exercises: 4 },
    { id: 'chest-arms', name: 'Chest & Arms', exercises: 5 },
    { id: 'back-arms', name: 'Back & Arms', exercises: 5 },
  ],
};

// Recommended session for today, derived from the main routine.
export const todaysWorkout = {
  name: 'Upper Body',
  plan: mainRoutine.name,
  week: 2,
};

// The user's saved routines (the "Library" tab).
export const library = [
  { id: '4day', name: '4-Day Split', items: 4 },
  { id: 'ppl', name: 'PPL Routine', items: 5 },
  { id: 'arnold', name: 'Arnold Routine', items: 6 },
];
