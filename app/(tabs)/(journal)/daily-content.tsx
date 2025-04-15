import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Send, Plus, Minus, ArrowLeft } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function DailyContentScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const [content, setContent] = useState('');
  const [gratitudeList, setGratitudeList] = useState(['']);
  const [goalsList, setGoalsList] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const addGratitudeItem = () => {
    setGratitudeList([...gratitudeList, '']);
  };

  const removeGratitudeItem = (index: number) => {
    setGratitudeList(gratitudeList.filter((_, i) => i !== index));
  };

  const updateGratitudeItem = (index: number, value: string) => {
    const newList = [...gratitudeList];
    newList[index] = value;
    setGratitudeList(newList);
  };

  const addGoalItem = () => {
    setGoalsList([...goalsList, '']);
  };

  const removeGoalItem = (index: number) => {
    setGoalsList(goalsList.filter((_, i) => i !== index));
  };

  const updateGoalItem = (index: number, value: string) => {
    const newList = [...goalsList];
    newList[index] = value;
    setGoalsList(newList);
  };

  const handleSubmit = async () => {
    if (!content) {
      setError('Please write your journal entry');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user');

      const filteredGratitude = gratitudeList.filter(item => item.trim() !== '');
      const filteredGoals = goalsList.filter(item => item.trim() !== '');

      const { data, error: submitError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          mood,
          gratitude: filteredGratitude,
          goals: filteredGoals,
        })
        .select()
        .single();

      if (submitError) throw submitError;

      if (data) {
        router.replace('/(tabs)/(journal)');
      } else {
        throw new Error('Failed to create journal entry');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <View>
          <Text style={styles.title}>Write Your Story</Text>
          <Text style={styles.subtitle}>Express yourself freely</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.moodTag}>
          <Text style={styles.moodText}>Feeling {mood}</Text>
        </View>

        <Text style={styles.sectionTitle}>Write your thoughts</Text>
        <TextInput
          style={styles.journalInput}
          multiline
          placeholder="What's on your mind today?"
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Gratitude</Text>
        {gratitudeList.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <TextInput
              style={styles.listItemInput}
              placeholder="I'm grateful for..."
              value={item}
              onChangeText={(value) => updateGratitudeItem(index, value)}
            />
            {index === gratitudeList.length - 1 ? (
              <Pressable onPress={addGratitudeItem} style={styles.listItemButton}>
                <Plus size={20} color="#6366f1" />
              </Pressable>
            ) : (
              <Pressable onPress={() => removeGratitudeItem(index)} style={styles.listItemButton}>
                <Minus size={20} color="#ef4444" />
              </Pressable>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Today's Goals</Text>
        {goalsList.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <TextInput
              style={styles.listItemInput}
              placeholder="I want to..."
              value={item}
              onChangeText={(value) => updateGoalItem(index, value)}
            />
            {index === goalsList.length - 1 ? (
              <Pressable onPress={addGoalItem} style={styles.listItemButton}>
                <Plus size={20} color="#6366f1" />
              </Pressable>
            ) : (
              <Pressable onPress={() => removeGoalItem(index)} style={styles.listItemButton}>
                <Minus size={20} color="#ef4444" />
              </Pressable>
            )}
          </View>
        ))}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <Send size={20} color="#fff" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.card,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  moodTag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primaryBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  moodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.primary,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  journalInput: {
    height: 200,
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    marginBottom: 24,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItemInput: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    marginRight: 12,
  },
  listItemButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.background,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.error,
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  submitButton: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
}));