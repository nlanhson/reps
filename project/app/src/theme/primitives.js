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
  500: '#727272', // Faint text (neutral deltas)
  600: '#505050', // Icon chip fill
  700: '#2E2D32', // Element BG (elevated surface)
  750: '#1F1F21', // Small pill / badge background
  800: '#101010', // Card / element background
  850: '#0B0B0B', // Sunken tile (flat, darker than cards)
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
// as the platform default ('System') and the weight selects the SF Pro cut.
//
// These are Apple's Human Interface Guidelines text styles at the default
// ("Large") Dynamic Type content size: fontSize (pt) / lineHeight (pt) /
// tracking (pt). Values transcribed from the HIG "Typography → Specifications"
// table. Note the two optical sizes: SF Pro *Display* (>=20pt) uses near-zero
// or slightly positive tracking; SF Pro *Text* (<20pt) uses negative tracking
// to tighten. lineHeight here is the base leading — it is scaled at runtime by
// the OS fontScale in useTypography() so it grows with Dynamic Type.
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, letterSpacing: 0.37 },
  title1:     { fontSize: 28, lineHeight: 34, letterSpacing: 0.36 },
  title2:     { fontSize: 22, lineHeight: 28, letterSpacing: 0.35 },
  title3:     { fontSize: 20, lineHeight: 25, letterSpacing: 0.38 },
  headline:   { fontSize: 17, lineHeight: 22, letterSpacing: -0.43 },
  body:       { fontSize: 17, lineHeight: 22, letterSpacing: -0.43 },
  callout:    { fontSize: 16, lineHeight: 21, letterSpacing: -0.31 },
  subhead:    { fontSize: 15, lineHeight: 20, letterSpacing: -0.23 },
  footnote:   { fontSize: 13, lineHeight: 18, letterSpacing: -0.08 },
  caption1:   { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  caption2:   { fontSize: 11, lineHeight: 13, letterSpacing: 0.06 },
};

// Font weights as RN string values
export const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
