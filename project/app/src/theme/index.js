// Reps theme — single import surface.
// import { colors, typography, spacing, radius } from '@/theme';
export { colors, typography, spacing, radius, borderCurve, gradients, shadows, theme, default } from './theme';
export * as primitives from './primitives';

// Dynamic Type: reactive, fontScale-corrected typography. Prefer this over the
// static `typography` export in any component that renders text.
export { useTypography } from './useTypography';

// Runtime UI tiering (liquid-glass | material-you | fallback).
export { useUITier } from './useUITier';
export { TierProvider, useTier } from './TierContext';
export { default as TierSurface } from './TierSurface';
export { default as GlassSurface } from './GlassSurface';
export { useSurfaceStyle, fallbackSurface, materialSurface } from './tiers';
export { useMaterialYou } from './materialYou';
