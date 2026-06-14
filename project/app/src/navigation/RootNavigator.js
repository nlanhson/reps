import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, useTier } from '../theme';
import Icon from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import InSessionScreen from '../screens/InSessionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StyleGalleryScreen from '../screens/StyleGalleryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dark navigation theme mapped onto our tokens.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

// The normal working navigation bar — JS `@react-navigation/bottom-tabs`. This is
// the universal FALLBACK: Expo Go, older iOS, Android, and reduced-transparency.
// Icons go through the shared <Icon> (SF Symbols on iOS, vector-icons elsewhere).
function JSTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Icon name="list" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Picks the tab bar by tier. On the modern tiers — `liquid-glass` (iOS 26 → the
// Liquid Glass floating bar, owned by UIKit) and `material-you` (Android 12+ →
// native BottomNavigationView) — render the native **system** tab bar. Everywhere
// else (Expo Go, older OS, reduced transparency) use the JS fallback bar above.
// `NativeTabs` is required lazily, so Expo Go / fallback never import the native
// `react-native-bottom-tabs` module.
function Tabs() {
  const tier = useTier();
  if (tier === 'liquid-glass' || tier === 'material-you') {
    try {
      const NativeTabs = require('./NativeTabs').default;
      return <NativeTabs />;
    } catch {
      // Native module unavailable → fall through to the JS bar.
    }
  }
  return <JSTabs />;
}

// Header style shared by pushed screens.
const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.textPrimary },
  contentStyle: { backgroundColor: colors.bg },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan' }} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'Workout' }} />
        <Stack.Screen
          name="InSession"
          component={InSessionScreen}
          options={{ title: 'Session', presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
        {/* Hidden dev route — kitchen-sink to verify the visual style. */}
        <Stack.Screen name="Gallery" component={StyleGalleryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
