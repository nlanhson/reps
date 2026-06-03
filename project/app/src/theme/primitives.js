// ============================================================
// Reps — Design Primitives
// 1:1 transcription of the design-system screenshot.
// These are the RAW values. Do not reference these directly in
// screens — use the semantic tokens in ./theme.js instead.
// ============================================================

// --- Color primitives -------------------------------------------------
// Neutral ramp ("Shark Gray")
export const neutral = {
  100: '#EBEBEB', // Primary Text
  300: '#B1B1B1',
  400: '#949494',
  700: '#2E2D32', // Element BG (elevated surface)
  800: '#101010', // Card / element background
  900: '#050505', // App background
};

// Brand ramp (screenshot labeled "Sparkling Yellow" — actually orange-red)
export const brand = {
  300: '#FF8F36',
  400: '#FF8F0F',
  500: '#F05305', // Base — the brand accent
  600: '#CB3D08',
  700: '#9E300E',
};

// System: Success
export const success = {
  100: '#DFF9E5',
  300: '#6FE6A4',
  500: '#34C759', // Base
  700: '#279944',
  900: '#24703A',
};

// System: Destructive / Error
export const destructive = {
  100: '#FFDFE0',
  300: '#FF9D8F',
  500: '#FF383C', // Base (Error)
  700: '#CC0D11',
  900: '#991719',
};

export const palette = { neutral, brand, success, destructive };

// --- Surface gradients ------------------------------------------------
// Measured from the Home screenshot: surfaces are vertical gradients
// (top → bottom), not flat fills. Two depths:
//   elevated = the lighter raised card (hero / "Today's Workout")
//   surface  = the darker card (routine list rows, empty-workout button)
export const gradient = {
  elevated: ['#252429', '#1D1C21'],
  surface: ['#18171B', '#121215'],
};

// --- Type scale primitives --------------------------------------------
// Family: SF Pro. On iOS this IS the system font, so fontFamily is left
// as the platform default ('System'). Letter spacing in the screenshot
// is "-2%" for everything below Large Title — converted to points
// (RN letterSpacing is absolute points = -0.02 * fontSize).
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, letterSpacing: 0.4 },
  h1:         { fontSize: 28, lineHeight: 42, letterSpacing: -0.56 },
  h2:         { fontSize: 24, lineHeight: 36, letterSpacing: -0.48 },
  h3:         { fontSize: 22, lineHeight: 32, letterSpacing: -0.44 },
  h4:         { fontSize: 20, lineHeight: 30, letterSpacing: -0.40 },
  h5:         { fontSize: 18, lineHeight: 28, letterSpacing: -0.36 },
  h6:         { fontSize: 16, lineHeight: 24, letterSpacing: -0.32 },
  body14:     { fontSize: 14, lineHeight: 16.8, letterSpacing: -0.28 },
  body12:     { fontSize: 12, lineHeight: 14.4, letterSpacing: -0.24 },
  label:      { fontSize: 11, lineHeight: 13.2, letterSpacing: -0.22 },
};

// Font weights as RN string values
export const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
