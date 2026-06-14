import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { colors, borderCurve } from './theme';
import { useTier } from './TierContext';
import { useMaterialYou } from './materialYou';
import type { MaterialYouScheme } from './materialYou';

// The single place tier-specific surface treatment lives. Components never
// hardcode per-tier colours — they read from here.
export type SurfaceRole = 'surface' | 'control-filled' | 'control-outline' | 'bar' | 'sheet';

// ---------- FALLBACK: existing design tokens only (no hardcoded hex) ----------
export function fallbackSurface(role: SurfaceRole, radius: number, bordered: boolean): ViewStyle {
  const shape: ViewStyle = { borderRadius: radius, borderCurve };
  const hairline = { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline };
  switch (role) {
    case 'control-outline': // e.g. unselected Chip: transparent + hairline
      return { ...shape, backgroundColor: 'transparent', ...hairline };
    case 'control-filled': // e.g. secondary AppButton: raised surface
      return { ...shape, backgroundColor: colors.surfaceElevated, ...(bordered ? hairline : null) };
    case 'sheet': // dialogs: raised surface, no border by default
      return { ...shape, backgroundColor: colors.surfaceElevated };
    case 'bar': // tab bar / header / rest bar — bars use the solid divider, not the card hairline
      return {
        ...shape,
        backgroundColor: colors.surface,
        ...(bordered ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border } : null),
      };
    case 'surface':
    default: // cards
      return { ...shape, backgroundColor: colors.surface, ...(bordered ? hairline : null) };
  }
}

// ---------- MATERIAL YOU: dynamic tonal palette (Android 12+) ----------
const M3_ROLE: Record<SurfaceRole, keyof NonNullable<MaterialYouScheme>> = {
  surface: 'surfaceContainer',
  'control-filled': 'secondaryContainer',
  'control-outline': 'surface', // unused — outline keeps a transparent fill below
  bar: 'surfaceContainerLow',
  sheet: 'surfaceContainerHigh',
};

export function materialSurface(
  role: SurfaceRole,
  scheme: MaterialYouScheme,
  radius: number,
  bordered: boolean,
): ViewStyle {
  if (!scheme) return fallbackSurface(role, radius, bordered); // degrade if lib absent
  const shape: ViewStyle = { borderRadius: radius, borderCurve };
  if (role === 'control-outline') {
    return {
      ...shape,
      backgroundColor: 'transparent',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: scheme.outlineVariant,
    };
  }
  return {
    ...shape,
    backgroundColor: scheme[M3_ROLE[role]] as string,
    ...(bordered
      ? { borderWidth: StyleSheet.hairlineWidth, borderColor: scheme.outlineVariant }
      : null),
  };
}

// ---------- GLASS: per-role tint (the glass render itself is in GlassSurface) ----------
export const GLASS_TINT: Partial<Record<SurfaceRole, string>> = {};

// ---------- Unified per-tier chrome resolver (for controls/bars w/o gradient) ----------
export type SurfaceChrome =
  | { glass: true; radius: number; tint?: string }
  | { glass: false; style: ViewStyle };

export function useSurfaceStyle(role: SurfaceRole, radius: number, bordered = true): SurfaceChrome {
  const tier = useTier();
  const scheme = useMaterialYou();
  if (tier === 'liquid-glass') return { glass: true, radius, tint: GLASS_TINT[role] };
  if (tier === 'material-you') return { glass: false, style: materialSurface(role, scheme, radius, bordered) };
  return { glass: false, style: fallbackSurface(role, radius, bordered) };
}
