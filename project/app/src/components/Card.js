import { spacing, TierSurface } from '../theme';

// Base surface container. All tier-specific chrome is delegated to <TierSurface>:
//  - liquid-glass → real expo-glass-effect GlassView
//  - material-you → dynamic tonal surface (Android 12+)
//  - fallback     → the original shadcn-style fill + hairline + soft shadow
// The fallback output is unchanged from before tiering.
//  - `gradient` (e.g. gradients.surfaceElevated) renders a vertical fill (fallback only).
//  - `elevated` uses the raised gray; default uses the card gray.
//  - `bordered` / `shadow` default on; turn off for flush/inline surfaces.
export default function Card({
  children,
  gradient,
  elevated = false,
  bordered = true,
  shadow = true,
  style,
  padded = true,
  cornerRadius, // defaults to the big-card radius (radius.lg); pass radius.md for button-sized
}) {
  return (
    <TierSurface
      role="surface"
      cornerRadius={cornerRadius}
      gradient={gradient}
      elevated={elevated}
      bordered={bordered}
      shadow={shadow}
      style={[padded && { padding: spacing.lg }, style]}
    >
      {children}
    </TierSurface>
  );
}
