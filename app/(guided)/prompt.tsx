import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const moodPrompts: Record<string, { prompt: string; image: string }> = {
  'Peaceful': {
    prompt: "In this moment of peace, describe what brings you tranquility. What elements in your environment or daily routine help you maintain this sense of calm?",
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8'
  },
  'Joyful': {
    prompt: "Capture this moment of joy. What sparked this happiness, and how can you create more moments like this in your life?",
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
  },
  'Grateful': {
    prompt: "Reflect on what you're thankful for today. What unexpected blessings have you encountered, and how have they impacted you?",
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84'
  },
  'Reflective': {
    prompt: "Take a moment to look inward. What patterns or insights about yourself have you noticed recently, and what might they be teaching you?",
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88'
  },
  'Growing': {
    prompt: "Consider your journey of growth. What challenges have helped shape you, and what new understanding have you gained about yourself?",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  }
};

export default function GuidedPromptScreen() {
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded || !mood || !moodPrompts[mood]) return null;

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('guided_entries').insert({
        user_id: user.id,
        mood,
        prompt: moodPrompts[mood].prompt,
        response: response,
      });

      if (error) throw error;

      router.replace('/(tabs)/(journal)/(guided)');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: moodPrompts[mood].image }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Guided Reflection</Text>
        <Text style={styles.subtitle}>Let's explore your feelings together</Text>

        <View style={styles.promptCard}>
          <Sparkles size={24} color="#6366f1" />
          <Text style={styles.promptText}>{moodPrompts[mood].prompt}</Text>
        </View>

        <TextInput
          style={styles.responseInput}
          multiline
          placeholder="Write your thoughts here..."
          value={response}
          onChangeText={setResponse}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.submitButton, (!response.trim() || isSubmitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!response.trim() || isSubmitting}>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Complete Entry'}
          </Text>
          <ChevronRight size={20} color="#fff" />
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
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
    marginBottom: 32,
  },
  promptCard: {
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginTop: 12,
    lineHeight: 28,
  },
  responseInput: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    marginBottom: 24,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.border,
    placeholderTextColor: theme.subtext,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
}));