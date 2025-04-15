import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function InsightsScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // In a real app, this would use AI to generate personalized insights
        // For now, we'll use placeholder insights
        setInsights([
          "You've shown great resilience in facing today's challenges",
          "Your gratitude practice is becoming more consistent",
          "You tend to be most reflective in the evenings",
        ]);

        // Store AI-generated insights
        await supabase.from('ai_recommendations').insert({
          user_id: user.id,
          type: 'daily_insight',
          recommendation: "Based on your journal entries, you're developing a positive mindset",
          priority: 1,
        });
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) return null;

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Your Insights</Text>
        <Text style={styles.subtitle}>Here's what we've learned from your reflection</Text>

        <View style={styles.insightsContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <Sparkles size={24} color="#6366f1" />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Great job completing your daily reflection! These insights will help guide your personal growth journey.
          </Text>
          
          <Pressable style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Complete Journal Entry</Text>
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
  insightsContainer: {
    gap: 16,
  },
  insightCard: {
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  insightText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
    marginTop: 12,
  },
  footer: {
    marginTop: 'auto',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  finishButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
}));