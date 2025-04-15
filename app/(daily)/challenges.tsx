import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Target } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function ChallengesScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleContinue = async () => {
    if (challenge.trim() || solution.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Store challenges in the metrics field
        await supabase.from('workout_metrics').insert({
          user_id: user.id,
          metrics: {
            challenge,
            solution,
          },
        });
      }
      router.push('/(daily)/insights');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Challenges & Growth</Text>
        <Text style={styles.subtitle}>Reflect on your obstacles and solutions</Text>

        <View style={styles.card}>
          <Target size={24} color="#6366f1" />
          <Text style={styles.cardTitle}>What challenged you today?</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Describe a challenge you faced..."
            value={challenge}
            onChangeText={setChallenge}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How did you handle it?</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Share your approach or solution..."
            value={solution}
            onChangeText={setSolution}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueButton,
              !(challenge.trim() || solution.trim()) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!(challenge.trim() || solution.trim())}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <ChevronRight size={20} color="#fff" />
          </Pressable>
        </View>
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
  card: {
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginTop: 12,
    marginBottom: 16,
  },
  input: {
    height: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
  },
  footer: {
    marginTop: 'auto',
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
    color: theme.card,
  },
}));