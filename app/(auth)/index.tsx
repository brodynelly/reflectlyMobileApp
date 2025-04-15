import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const slides = [
  {
    id: 1,
    title: 'Welcome to Reflectly',
    description: 'Your personal space for reflection and growth.',
  },
  {
    id: 2,
    title: "Let's get started!",
    description: "We've created a beautiful space for your daily reflections.",
  },
  {
    id: 3,
    title: 'Ready to begin?',
    description: 'Start your journey of self-discovery and mindfulness.',
  },
];

export default function OnboardingScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      router.push('sign-in');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(600)}
        style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Reflectly</Text>
        </View>
        
        <Animated.View 
          entering={SlideInRight.duration(400)}
          key={currentIndex}
          style={styles.slide}>
          <Text style={styles.title}>{slides[currentIndex].title}</Text>
          <Text style={styles.description}>{slides[currentIndex].description}</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <Pressable 
          style={styles.nextButton}
          onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logo: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: theme.primary,
  },
  content: {
    flex: 1,
  },
  slide: {
    padding: 24,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    lineHeight: 28,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: theme.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#6366f1',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card
  },
}));