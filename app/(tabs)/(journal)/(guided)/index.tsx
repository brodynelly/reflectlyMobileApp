import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PenLine, ChevronRight, Clock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type GuidedEntry = {
  id: string;
  mood: string;
  prompt: string;
  response: string;
  created_at: string;
};

export default function GuidedEntriesScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [entries, setEntries] = useState<GuidedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('guided_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching guided entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    router.push('/(guided)/mood');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Pressable 
          style={styles.newEntryButton}
          onPress={handleNewEntry}>
          <PenLine size={20} color="#6366f1" />
          <Text style={styles.newEntryText}>Start Guided Entry</Text>
        </Pressable>

        {loading ? (
          <Text style={styles.loadingText}>Loading entries...</Text>
        ) : entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1527176930608-09cb256ab504' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>No Guided Entries Yet</Text>
            <Text style={styles.emptyStateText}>
              Start your journey of self-discovery with our guided prompts
            </Text>
          </View>
        ) : (
          <View style={styles.entriesList}>
            {entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.moodTag}>
                    <Text style={styles.moodText}>{entry.mood}</Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.dateText}>{formatDate(entry.created_at)}</Text>
                  </View>
                </View>

                <View style={styles.promptContainer}>
                  <Text style={styles.promptLabel}>Prompt</Text>
                  <Text style={styles.promptText}>{entry.prompt}</Text>
                </View>

                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Your Response</Text>
                  <Text style={styles.responseText}>{entry.response}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
    marginBottom: 24,
    gap: 8,
  },
  newEntryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.primary,
  },
  notesList: {
    gap: 16,
  },
  noteCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  noteContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  noteDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.subtext,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 16,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  editorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.text,
  },
  closeButton: {
    padding: 8,
  },
  noteInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
  },
  entriesList: {
    gap: 16,
  },
  entryCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTag: {
    backgroundColor: theme.primaryBackground,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: theme.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
  },
  promptContainer: {
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  promptLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 8,
  },
  promptText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  },
  responseContainer: {
    backgroundColor: theme.card,
  },
  responseLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 8,
  },
  responseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  },
}));