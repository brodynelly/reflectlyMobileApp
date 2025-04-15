import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Clock, BookOpen, Star, PenLine } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type GuidedEntry = {
  id: string;
  mood: string;
  prompt: string;
  response: string;
  created_at: string;
};

export default function GuidedScreen() {
  const [entries, setEntries] = useState<GuidedEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { name: 'All', color: '#6366f1' },
    { name: 'Peaceful', color: '#818cf8' },
    { name: 'Joyful', color: '#fbbf24' },
    { name: 'Grateful', color: '#34d399' },
    { name: 'Reflective', color: '#60a5fa' },
  ];

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    fetchEntries();
  }, [selectedMood]);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('entry_type', 'guided')
        .order('created_at', { ascending: false });

      if (selectedMood && selectedMood !== 'All') {
        query = query.eq('mood', selectedMood);
      }

      const { data, error } = await query;
      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching guided entries:', error);
    }
  };

  const handleNewEntry = () => {
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() !== currentDate.getTime()) {
      // Don't allow entries for past or future dates
      return;
    }

    router.push({
      pathname: '/daily/mood',
      params: { type: 'guided' }
    });
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.moodFilter}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodList}>
          {moods.map((mood) => (
            <Pressable
              key={mood.name}
              style={[
                styles.moodChip,
                selectedMood === mood.name && { backgroundColor: mood.color }
              ]}
              onPress={() => setSelectedMood(mood.name === selectedMood ? null : mood.name)}>
              <Text style={[
                styles.moodChipText,
                selectedMood === mood.name && styles.moodChipTextSelected
              ]}>
                {mood.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.entriesContainer}>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.promptContainer}>
              <Text style={styles.promptLabel}>Prompt</Text>
              <Text style={styles.promptText}>{entry.prompt}</Text>
            </View>
            
            <View style={styles.entryHeader}>
              <View style={styles.moodTag}>
                <Text style={styles.moodText}>{entry.mood}</Text>
              </View>
              <Text style={styles.entryDate}>
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
            
            <Text style={styles.responseLabel}>Your Response</Text>
            <Text style={styles.responseText}>{entry.response}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.newEntryButton} onPress={handleNewEntry}>
        <Text style={styles.newEntryText}>Start New Guided Entry</Text>
        <ChevronRight size={20} color="#6366f1" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  moodFilter: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  moodList: {
    gap: 8,
    paddingHorizontal: 8,
  },
  moodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  moodChipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  moodChipTextSelected: {
    color: '#fff',
  },
  promptContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  promptLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  responseLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  entriesContainer: {
    padding: 16,
    gap: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTag: {
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6366f1',
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  responseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
    gap: 8,
  },
  newEntryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6366f1',
  },
});