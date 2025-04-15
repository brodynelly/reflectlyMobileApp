import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const prompts = [
  "What made today unique?",
  "Share a moment that made you smile",
  "What challenged you today?",
  "What did you learn about yourself?",
];

export default function StoryScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [content, setContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  
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
        await supabase.from('journal_entries')
          .update({ content })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }
      router.push('/(daily)/gratitude');
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
        <Text style={styles.title}>Tell Your Story</Text>
        <Text style={styles.subtitle}>Express yourself freely, one thought at a time</Text>

        <View style={styles.promptCard}>
          <Sparkles size={24} color="#6366f1" />
          <Text style={styles.promptText}>{prompts[currentPrompt]}</Text>
          <Pressable onPress={getNewPrompt} style={styles.refreshPrompt}>
            <Text style={styles.refreshText}>Try another prompt</Text>
          </Pressable>
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
    marginBottom: 8,
  },
  refreshPrompt: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: theme.primaryBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.primary,
  },
  storyInput: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
    placeholderTextColor: theme.subtext,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
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
    color: theme.card
  },
}));