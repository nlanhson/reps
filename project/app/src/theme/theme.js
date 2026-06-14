// ============================================================
// Reps — Semantic Theme (dark)
// What screens import. Maps raw primitives → meaning.
// Change a value here once; it updates everywhere.
// ============================================================
import { neutral, brand, success, destructive, gradient, type, weight } from './primitives';

// --- Colors (semantic roles) ------------------------------------------
export const colors = {
  // Surfaces (dark theme — app is dark-only)
  bg: neutral[900],          // #050505 screen background
  surface: neutral[800],     // #101010 cards / list items
  surfaceElevated: neutral[700], // #2E2D32 raised elements, inputs

  // Text
  textPrimary: neutral[100], // #EBEBEB
  textSecondary: neutral[400], // #949494
  textMuted: neutral[300],   // #B1B1B1
  textOnAccent: '#FFFFFF',   // text on the orange brand button

  // Brand
  accent: brand[500],        // #F05305 primary actions (Start Workout, etc.)
  accentPressed: brand[600], // #CB3D08 pressed state
  accentSubtle: brand[700],  // #9E300E

  // Borders / dividers
  border: neutral[700],      // #2E2D32 — solid divider
  // shadcn-style edges: a faint light hairline that gives cards a crisp,
  // premium border on dark backgrounds; ring = focus / accent highlight.
  hairline: 'rgba(255,255,255,0.08)',
  ring: brand[500],          // #F05305 focus ring

  // Feedback
  success: success[500],     // #34C759
  successSubtle: success[100],
  danger: destructive[500],  // #FF383C
  dangerSubtle: destructive[100],
};

// --- Typography styles (ready to spread into <Text style>) ------------
// Usage: <Text style={[typography.h1, { color: colors.textPrimary }]}>
//
// Font strategy = platform-native:
//   iOS     → system font (which IS SF Pro). No fontFamily, so fontWeight
//             selects the right SF Pro cut natively.
//   Android → Inter (an SF-Pro-alike, bundled via @expo-google-fonts/inter).
//             Android can't synthesise weights from one family, so each
//             weight maps to its own static Inter family, and fontWeight is
//             set to 'normal' to avoid faux-bolding on top of it.
import { Platform } from 'react-native';

const ANDROID_INTER = {
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
};

const w = (style, fontWeight) =>
  Platform.OS === 'android'
    ? { ...style, fontFamily: ANDROID_INTER[fontWeight], fontWeight: 'normal' }
    : { ...style, fontWeight };
export const typography = {
  largeTitle: w(type.largeTitle, weight.bold),
  h1: w(type.h1, weight.bold),
  h2: w(type.h2, weight.semibold),
  h3: w(type.h3, weight.semibold),
  h4: w(type.h4, weight.semibold),
  h5: w(type.h5, weight.medium),
  h6: w(type.h6, weight.medium),
  body: w(type.body14, weight.regular),
  bodyStrong: w(type.body14, weight.semibold),
  caption: w(type.body14, weight.regular),
  label: w(type.label, weight.medium),
};

// --- Spacing (4-pt base) — INFERRED, confirm against screens ----------
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// --- Radius — matches the Figma system (Apple-like rounding) ----------
// Two primary values from Figma: 24 for big cards, 18 for buttons/small.
export const radius = {
  sm: 10,
  md: 18, // buttons & small controls (Figma "18")
  lg: 24, // big cards (Figma "24")
  pill: 999,
};

// Apple-style squircle (continuous curvature) corners. Spread alongside any
// `borderRadius`: `{ borderRadius: radius.lg, borderCurve }`. iOS renders the
// continuous curve; Android ignores it and falls back to a normal arc.
export const borderCurve = 'continuous';

// --- Surface gradients (vertical, top → bottom) -----------------------
// Pass to a gradient-capable surface (e.g. <Card gradient={gradients.surface}>).
export const gradients = {
  surface: gradient.surface,            // darker cards / list rows
  surfaceElevated: gradient.elevated,   // lighter hero / raised surfaces
};

// --- Elevation (shadcn-style soft shadows) ----------------------------
// Subtle on dark — reads as depth at the card edge, not a heavy drop.
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const theme = { colors, typography, spacing, radius, borderCurve, gradients, shadows };
export default theme;
