import { useWindowDimensions } from 'react-native';
import { typography as staticTypography } from './theme';

// ============================================================
// Dynamic Type support (Apple HIG).
//
// React Native already scales a Text's fontSize by the OS Dynamic Type /
// "Larger Text" setting (allowFontScaling defaults to true). The one thing it
// does NOT scale is an explicit `lineHeight` set in points — so at large
// accessibility sizes the glyphs grow past a fixed line box and clip/overlap.
//
// This hook returns the semantic `typography` tokens with each token's baked-in
// lineHeight multiplied by the current OS `fontScale`, so the line box grows in
// lockstep with the text and the HIG leading ratio is preserved at every size.
// fontScale comes from useWindowDimensions(), so the result is reactive: when
// the user changes their text size the component re-renders with new leading.
//
// Usage — swap the static import for the hook, keep the same variable name:
//   const typography = useTypography();
//   <Text style={[typography.body, { color: colors.textPrimary }]}>…</Text>
// ============================================================

export type Typography = typeof staticTypography;

// Guard against pathological leading at the largest AX sizes (fontScale can
// reach ~3.1). Text still scales; only the extra leading growth is bounded.
const MAX_LINEHEIGHT_SCALE = 2.2;

export function useTypography(): Typography {
  const { fontScale } = useWindowDimensions();
  if (fontScale <= 1) return staticTypography; // default size — no work

  const s = Math.min(fontScale, MAX_LINEHEIGHT_SCALE);
  const scaled = {} as Record<string, unknown>;
  for (const key of Object.keys(staticTypography) as (keyof Typography)[]) {
    const style = staticTypography[key] as { lineHeight?: number };
    scaled[key] =
      typeof style.lineHeight === 'number'
        ? { ...style, lineHeight: Math.round(style.lineHeight * s) }
        : style;
  }
  return scaled as Typography;
}
