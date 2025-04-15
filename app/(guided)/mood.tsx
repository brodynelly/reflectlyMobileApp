import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';

const moods = [
  { 
    name: 'Peaceful',
    color: '#818cf8',
    description: 'Feeling calm and centered',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8'
  },
  { 
    name: 'Joyful',
    color: '#fbbf24',
    description: 'Experiencing happiness and delight',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
  },
  { 
    name: 'Grateful',
    color: '#34d399',
    description: "Appreciating life's moments",
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84'
  },
  { 
    name: 'Reflective',
    color: '#60a5fa',
    description: 'Deep in thought and contemplation',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88'
  },
  { 
    name: 'Growing',
    color: '#a78bfa',
    description: 'Learning and evolving',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  },
];

export default function GuidedMoodScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [selectedMood, setSelectedMood] = useState('');
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleContinue = () => {
    if (selectedMood) {
      router.push({
        pathname: '/(guided)/prompt',
        params: { mood: selectedMood }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84' }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Let's explore your emotions together</Text>

        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <Pressable
              key={mood.name}
              style={[
                styles.moodCard,
                selectedMood === mood.name && styles.moodCardSelected
              ]}
              onPress={() => setSelectedMood(mood.name)}>
              <Image
                source={{ uri: mood.image }}
                style={styles.moodImage}
              />
              <View style={styles.moodContent}>
                <Text style={[
                  styles.moodName,
                  { color: mood.color },
                  selectedMood === mood.name && styles.moodNameSelected
                ]}>
                  {mood.name}
                </Text>
                <Text style={styles.moodDescription}>{mood.description}</Text>
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 16,
  },
  moodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  moodCardSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.background,
  },
  moodContent: {
    flex: 1,
  },
  moodName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  moodNameSelected: {
    color: '#1e293b',
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
    color: theme.card,
  },
}));