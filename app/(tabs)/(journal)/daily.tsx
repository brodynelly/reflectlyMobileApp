import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const moods = [
  'Joyful',
  'Grateful', 
  'Calm',
  'Neutral',
  'Anxious',
  'Sad',
  'Frustrated',
  'Peaceful'
];

export default function DailyJournalScreen() {
  const [mood, setMood] = useState('');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const handleContinue = () => {
    if (mood) {
      router.push({
        pathname: '/(tabs)/(journal)/daily-content',
        params: { mood }
      });
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Take a moment to check in with yourself</Text>
        
        <View style={styles.moodContainer}>
          {moods.map((m) => (
            <Pressable
              key={m}
              style={[styles.moodButton, mood === m && styles.moodButtonSelected]}
              onPress={() => setMood(m)}>
              <Text style={[styles.moodText, mood === m && styles.moodTextSelected]}>
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <Pressable 
          style={[styles.continueButton, !mood && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!mood}>
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
    paddingTop: 60,
  },
  content: {
    padding: 24,
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
  moodContainer: {
    marginBottom: 24,
    gap: 12,
  },
  moodButton: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  moodButtonSelected: {
    backgroundColor: '#818cf8',
    borderColor: '#6366f1',
  },
  moodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  moodTextSelected: {
    color: '#fff',
  },
  continueButton: {
    marginTop: 'auto',
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});