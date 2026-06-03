import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import InSessionScreen from '../screens/InSessionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StyleGalleryScreen from '../screens/StyleGalleryScreen';

const Tab = createNativeBottomTabNavigator();
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

function Tabs() {
  // Native system tab bar (UITabBarController on iOS → Liquid Glass on iOS 26;
  // BottomNavigationView on Android). Icons are SF Symbols on iOS.
  return (
    <Tab.Navigator
      tabBarActiveTintColor={colors.accent}
      tabBarInactiveTintColor={colors.textSecondary}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', tabBarIcon: () => ({ sfSymbol: 'house.fill' }) }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'History', tabBarIcon: () => ({ sfSymbol: 'list.bullet' }) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', tabBarIcon: () => ({ sfSymbol: 'person.fill' }) }}
      />
    </Tab.Navigator>
  );
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
