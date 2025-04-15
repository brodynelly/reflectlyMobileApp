import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { Search } from 'lucide-react-native';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
        <Text style={styles.subtitle}>Guided journeys for growth</Text>
      </View>

      <ProgramTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: theme.card,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
  content: {
    flex: 1,
  },
}));