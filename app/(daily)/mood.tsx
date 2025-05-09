import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const moods = [
  { name: 'Peaceful', color: '#818cf8', description: 'Feeling calm and centered' },
  { name: 'Joyful', color: '#fbbf24', description: 'Experiencing happiness and delight' },
  { name: 'Grateful', color: '#34d399', description: "Appreciating life's moments" },
  { name: 'Reflective', color: '#60a5fa', description: 'Deep in thought' },
  { name: 'Growing', color: '#a78bfa', description: 'Learning and evolving' },
];

export default function MoodScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [selectedMood, setSelectedMood] = useState('');
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleContinue = async () => {
    if (selectedMood) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('journal_entries').insert({
          user_id: user.id,
          mood: selectedMood,
          content: '',
        });
      }
      router.push('/(daily)/story');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Take a moment to check in with yourself</Text>

        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <Pressable
              key={mood.name}
              style={[
                styles.moodCard,
                selectedMood === mood.name && styles.moodCardSelected,
                { backgroundColor: mood.color + '20' }, // 20 is hex for 12% opacity
              ]}
              onPress={() => setSelectedMood(mood.name)}>
              <Text style={[
                styles.moodName,
                { color: mood.color },
                selectedMood === mood.name && styles.moodNameSelected
              ]}>
                {mood.name}
              </Text>
              <Text style={styles.moodDescription}>{mood.description}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.continueButton, !selectedMood && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedMood}>
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
  moodGrid: {
    gap: 16,
  },
  moodCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodCardSelected: {
    borderColor: theme.primary,
  },
  moodName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  moodNameSelected: {
    color: theme.text,
  },
  moodDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
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