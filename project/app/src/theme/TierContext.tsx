import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUITier } from './useUITier';
import type { UITier } from './useUITier';
import MaterialYouProvider from './MaterialYouProvider';

// Evaluated ONCE at the app root; every surface reads the tier from context so
// there is a single source of truth (not N independent subscriptions).
const TierContext = createContext<UITier>('fallback');

export function TierProvider({ children }: { children: ReactNode }) {
  const tier = useUITier();
  // Only mount the (lazy-native) Material You provider on its tier — never in
  // Expo Go / fallback, so the native module is never required there.
  const content =
    tier === 'material-you' ? <MaterialYouProvider>{children}</MaterialYouProvider> : children;
  return <TierContext.Provider value={tier}>{content}</TierContext.Provider>;
}

export function useTier(): UITier {
  return useContext(TierContext);
}
