import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Native system tab bar: real UITabBarController on iOS (→ Liquid Glass floating
// pill on iOS 26, automatic) and BottomNavigationView on Android. Loaded only via
// a lazy require in RootNavigator on the liquid-glass / material-you tiers, so
// Expo Go and the JS fallback never import the native `react-native-bottom-tabs`.
const Tab = createNativeBottomTabNavigator();

const isIOS = Platform.OS === 'ios';

// One spec per tab. iOS uses the SF Symbol directly; Android's native bar wants
// an ImageSource, so we use an Ionicons glyph (see async loading below).
const TABS = [
  { name: 'Home', component: HomeScreen, sfSymbol: 'house.fill', ionicon: 'home' },
  { name: 'History', component: HistoryScreen, sfSymbol: 'list.bullet', ionicon: 'list' },
  { name: 'Profile', component: ProfileScreen, sfSymbol: 'person.fill', ionicon: 'person' },
];

export default function NativeTabs() {
  // @expo/vector-icons only exposes an async getImageSource, so on Android we
  // resolve the icon ImageSources once on mount before rendering the bar. iOS
  // renders immediately with SF Symbols.
  const [androidIcons, setAndroidIcons] = useState(null);
  useEffect(() => {
    if (isIOS) return;
    let active = true;
    Promise.all(
      TABS.map((t) => Ionicons.getImageSource(t.ionicon, 24, colors.textPrimary))
    ).then((sources) => {
      if (active) setAndroidIcons(sources);
    });
    return () => {
      active = false;
    };
  }, []);

  // Brief on Android only: wait for the icon ImageSources before mounting the bar.
  if (!isIOS && !androidIcons) return null;

  return (
    <Tab.Navigator
      tabBarActiveTintColor={colors.accent}
      tabBarInactiveTintColor={colors.textSecondary}
    >
      {TABS.map((t, i) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={{
            title: t.name,
            tabBarIcon: () => (isIOS ? { sfSymbol: t.sfSymbol } : androidIcons[i]),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
