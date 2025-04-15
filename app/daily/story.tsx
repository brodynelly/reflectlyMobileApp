import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const guidedPrompts: Record<string, string[]> = {
  'Peaceful': [
    "Describe a moment today when you felt most at peace",
    "What elements in your environment help you maintain calm?",
    "How can you create more peaceful moments in your daily routine?"
  ],
  'Joyful': [
    "What sparked joy in your life today?",
    "Describe a moment that made you laugh or smile",
    "How can you spread this joy to others?"
  ],
  'Grateful': [
    "What unexpected blessing did you encounter today?",
    "Who made a positive impact on your day and why?",
    "What simple pleasure are you most thankful for?"
  ],
  'Reflective': [
    "What life lesson did today teach you?",
    "How have your perspectives changed recently?",
    "What patterns do you notice in your thoughts or behaviors?"
  ],
  'Growing': [
    "What challenge helped you grow today?",
    "How are you different now compared to a month ago?",
    "What new understanding did you gain about yourself?"
  ]
};

const dailyPrompts = [
  "What made today unique?",
  "Share a moment that made you smile",
  "What challenged you today?",
  "What did you learn about yourself?",
];

export default function StoryScreen() {
  const [content, setContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const { mood, type } = useLocalSearchParams<{ mood: string; type?: string }>();
  
  const prompts = type === 'guided' ? guidedPrompts[mood]?.[0] : dailyPrompts[currentPrompt];

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleContinue = async () => {
    if (content.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (type === 'guided') {
          // Save as guided entry
          await supabase.from('journal_entries').insert({
            user_id: user.id,
            content,
            mood,
            entry_type: type || 'daily',
            prompt: prompts,
            response: content,
          });
          router.replace('/(tabs)/(journal)/guided');
        } else if (type === 'quick') {
          // Save as quick note
          await supabase.from('quick_notes').insert({
            user_id: user.id,
            content: `Feeling ${mood}: ${content}`,
          });
          router.replace('/(tabs)/(journal)/notes');
        } else {
          // Save as daily entry
          await supabase.from('journal_entries').insert({
            user_id: user.id,
            content,
            mood,
            entry_type: 'daily',
            response: content,
          });
          router.push('/(daily)/gratitude');
        }
      }
    }
  };

  const getNewPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % prompts.length);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1527176930608-09cb256ab504?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {type === 'guided' ? 'Guided Reflection' : 'Tell Your Story'}
        </Text>
        <Text style={styles.subtitle}>
          {type === 'guided' 
            ? 'Let\'s explore your feelings together'
            : 'Express yourself freely, one thought at a time'}
        </Text>

        <View style={styles.promptCard}>
          <Sparkles size={24} color="#6366f1" />
          <Text style={styles.promptText}>{prompts}</Text>
          {type !== 'guided' && (
          <Pressable onPress={getNewPrompt} style={styles.refreshPrompt}>
            <Text style={styles.refreshText}>Try another prompt</Text>
          </Pressable>
          )}
        </View>

        <TextInput
          style={styles.storyInput}
          multiline
          placeholder="Start writing here..."
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.continueButton, !content.trim() && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!content.trim()}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ChevronRight size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  promptCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  refreshPrompt: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  refreshText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6366f1',
  },
  storyInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});