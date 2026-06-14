import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export type UITier = 'liquid-glass' | 'material-you' | 'fallback';

// Expo Go can't guarantee custom native modules, so we always fall back there.
const isExpoGo = () => Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Platform.Version is a string ("26.0") on iOS, a number (API level) on Android.
const versionNumber = (): number =>
  typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;

// Guarded + lazy require: only reached on iOS >= 26, AFTER the Expo Go
// short-circuit, so expo-glass-effect is never loaded on the fallback path.
function liquidGlassAvailable(): boolean {
  try {
    const { isLiquidGlassAvailable } = require('expo-glass-effect');
    return typeof isLiquidGlassAvailable === 'function' && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

// Pure decision table — exported so it can be unit-reasoned/tested in isolation.
export function resolveTier(reduceTransparency: boolean): UITier {
  if (isExpoGo()) return 'fallback'; // 1
  if (reduceTransparency) return 'fallback'; // 2
  if (Platform.OS === 'ios' && versionNumber() >= 26 && liquidGlassAvailable()) return 'liquid-glass'; // 3
  if (Platform.OS === 'android' && versionNumber() >= 31) return 'material-you'; // 4
  return 'fallback'; // 5
}

export function useUITier(): UITier {
  // Default to fallback so we never flash glass before the async signal resolves
  // (better to upgrade INTO glass than to show glass and yank it away).
  const [reduceTransparency, setReduceTransparency] = useState(false);
  const [tier, setTier] = useState<UITier>('fallback');

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then((v) => {
      if (active) setReduceTransparency(v);
    });
    // Reactive: re-evaluate if the user toggles Reduce Transparency while open.
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => {
      active = false;
      sub?.remove?.();
    };
  }, []);

  useEffect(() => {
    setTier(resolveTier(reduceTransparency));
  }, [reduceTransparency]);

  return tier;
}
