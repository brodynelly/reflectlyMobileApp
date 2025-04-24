import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { ProgramTabs } from './components/ProgramTabs';
import { MyPlansTab } from './components/MyPlansTab';
import { FindPlansTab } from './components/FindPlansTab';
import { SavedPlansTab } from './components/SavedPlansTab';
import { CompletedPlansTab } from './components/CompletedPlansTab';

export default function ProgramsScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [activeTab, setActiveTab] = useState<'my-plans' | 'find' | 'saved' | 'completed'>('my-plans');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my-plans':
        return <MyPlansTab />;
      case 'find':
        return <FindPlansTab />;
      case 'saved':
        return <SavedPlansTab />;
      case 'completed':
        return <CompletedPlansTab />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 0, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Programs</Text>
          <Text style={styles.subtitle}>Guided journeys for growth</Text>
        </View>
        <ProgramTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 0, // Changed from flex: 1
    backgroundColor: theme.background,
    height: 'auto', // Auto height
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 0, // Removed bottom padding completely
    backgroundColor: theme.card,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 4, // Reduced margin
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    marginBottom: 8, // Added bottom margin
  },
  content: {
    flex: 0, // Changed from flex: 1 to prevent stretching
    paddingTop: 0, // Ensure no extra padding at the top
    paddingBottom: 0, // No bottom padding
    backgroundColor: theme.background,
    marginTop: 0, // No top margin
    marginBottom: 0, // No bottom margin
    height: 'auto', // Auto height instead of flex
  },
}));