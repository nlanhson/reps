import { useColorScheme } from 'react-native';
import type { ReactNode } from 'react';
import { MaterialYouContext } from './materialYou';

// Mounted ONLY when useUITier() === 'material-you' (Android 12+, dev/EAS build).
// The native @pchmn module is required inside the render path — never at module
// top level — so importing this file is safe in Expo Go and on the fallback path
// (where this component is never mounted, so the require never runs).
export default function MaterialYouProvider({ children }: { children: ReactNode }) {
  let mod: any = null;
  try {
    mod = require('@pchmn/expo-material3-theme');
  } catch {
    mod = null;
  }
  if (!mod || typeof mod.useMaterial3Theme !== 'function') {
    // Native module unavailable → degrade to fallback (null scheme).
    return <MaterialYouContext.Provider value={null}>{children}</MaterialYouContext.Provider>;
  }
  return <MaterialYouInner mod={mod}>{children}</MaterialYouInner>;
}

// Split out so the library hook is called unconditionally (rules of hooks) and
// only in the branch where the module is known to exist.
function MaterialYouInner({ mod, children }: { mod: any; children: ReactNode }) {
  const scheme = useColorScheme();
  const { theme } = mod.useMaterial3Theme();
  const active = scheme === 'light' ? theme.light : theme.dark;
  return <MaterialYouContext.Provider value={active}>{children}</MaterialYouContext.Provider>;
}
