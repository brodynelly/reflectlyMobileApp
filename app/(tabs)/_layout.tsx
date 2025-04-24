import { Tabs } from 'expo-router';
import { Book, Chrome as Home, ChartLine as LineChart, Cog, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding based on platform and safe area
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 8;
  // Calculate tab bar height based on platform
  const tabBarHeight = Platform.OS === 'ios' ? 50 + bottomPadding : 60;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          marginBottom: Platform.OS === 'ios' ? 2 : 0,
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(journal)"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: 'Programs',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <Cog size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}