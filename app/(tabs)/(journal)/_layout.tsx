import { Stack } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PenLine, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';

export default function JournalLayout() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [activeTab, setActiveTab] = useState<'daily' | 'notes' | 'guided'>('daily');
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleNewEntry = () => {
    router.push('/(tabs)/(journal)/(guided)/mood');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>Your personal space for reflection</Text>
          <Pressable
            style={styles.newEntryButton}
            onPress={handleNewEntry}>
            <PenLine size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => {
            setActiveTab('daily');
            router.push('/(tabs)/(journal)');
          }}>
          <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
            Daily Entries
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => {
            setActiveTab('notes');
            router.push('/(tabs)/(journal)/notes');
          }}>
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Quick Notes
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'guided' && styles.activeTab]}
          onPress={() => {
            setActiveTab('guided');
            router.push('/(tabs)/(journal)/(guided)');
          }}>
          <Text style={[styles.tabText, activeTab === 'guided' && styles.activeTabText]}>
            Guided
          </Text>
        </Pressable>
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}>
        <Stack.Screen 
          name="index" 
          options={{ title: 'Journal' }}
        />
        <Stack.Screen name="daily" />
        <Stack.Screen name="daily-content" />
        <Stack.Screen name="notes" />
      </Stack>
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
    paddingTop: 60,
    backgroundColor: theme.card,
  },
  headerContent: {
    position: 'relative',
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    marginTop: 4,
  },
  newEntryButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 8,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    gap: 12,
  },
  tab: {
    flex: 0.33,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.background,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.primary,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
  },
  activeTabText: {
    color: theme.card,
  },
}));