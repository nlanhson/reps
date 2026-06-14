import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import RootNavigator from './src/navigation/RootNavigator';
import { colors, TierProvider } from './src/theme';

// Import the 4 Inter weights by subpath (NOT the package barrel, which would
// pull in all ~24 variants / ~8 MB). Family names here must match the
// `fontFamily` values in src/theme/theme.js (ANDROID_INTER).
export default function App() {
  // iOS uses the system font (SF Pro) — empty map resolves immediately.
  // Android loads Inter.
  const [fontsLoaded] = useFonts(
    Platform.OS === 'android'
      ? {
          Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
          Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
          Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
          Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
        }
      : {}
  );

  if (!fontsLoaded) {
    // Brief on Android only; matches the app background to avoid a flash.
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <TierProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </TierProvider>
    </SafeAreaProvider>
  );
}
