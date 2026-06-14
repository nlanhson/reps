import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { borderCurve } from './theme';

type Props = {
  radius?: number;
  tintColor?: string;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

// Real iOS Liquid Glass via expo-glass-effect. Rendered only on the liquid-glass
// tier; the module is required lazily so the fallback path never loads it.
// RULE: never set opacity < 1 on a GlassView — tint/affect via tintColor instead.
export default function GlassSurface({ radius = 0, tintColor, interactive, style, children }: Props) {
  let GlassView: any = null;
  try {
    GlassView = require('expo-glass-effect').GlassView;
  } catch {
    GlassView = null;
  }
  const shape: ViewStyle = { borderRadius: radius, borderCurve };
  if (!GlassView) {
    // Defensive: should never be hit on the glass tier, but degrade gracefully.
    return <View style={[shape, style]}>{children}</View>;
  }
  return (
    <GlassView
      glassEffectStyle="regular"
      isInteractive={interactive ?? false}
      tintColor={tintColor}
      style={[shape, style]}
    >
      {children}
    </GlassView>
  );
}
