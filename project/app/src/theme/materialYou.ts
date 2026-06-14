import { createContext, useContext } from 'react';
import type { Material3Scheme } from '@pchmn/expo-material3-theme';

// The active Material 3 scheme (light or dark) when on the material-you tier;
// null on every other tier. `import type` is erased at build time, so this file
// never triggers a runtime require of the native @pchmn module.
export type MaterialYouScheme = Material3Scheme | null;

export const MaterialYouContext = createContext<MaterialYouScheme>(null);

export const useMaterialYou = (): MaterialYouScheme => useContext(MaterialYouContext);
