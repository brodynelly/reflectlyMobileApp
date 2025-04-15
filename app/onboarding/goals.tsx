import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { supabase } from '@/lib/supabase';

const goals = [
  { id: 1, title: 'Self-Discovery', description: 'Understand myself better through reflection' },
  { id: 2, title: 'Personal Growth', description: 'Work on becoming the best version of myself' },
  { id: 3, title: 'Emotional Balance', description: 'Better manage and understand my emotions' },
  { id: 4, title: 'Stress Management', description: 'Develop better ways to handle stress' },
  { id: 5, title: 'Gratitude', description: "Focus on appreciating life's moments" },
  { id: 6, title: 'Goal Setting', description: 'Track and achieve personal goals' },
];

export default function GoalsScreen() {
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const toggleGoal = (id: number) => {
    setSelectedGoals(prev =>
      prev.includes(id)
        ? prev.filter(goalId => goalId !== id)
        : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedGoals.length > 0) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('No authenticated user');
        }

        const selectedGoalTitles = goals
          .filter(goal => selectedGoals.includes(goal.id))
          .map(goal => goal.title);

        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            wellness_goals: selectedGoalTitles,
            preferred_journaling_time: '09:00:00',
          });

        if (error) throw error;

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error saving goals:', error);
        // In a production app, show an error message to the user
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>
            Select the areas you'd like to focus on in your journaling journey
          </Text>
        </View>

        <View style={styles.goalsContainer}>
          {goals.map(goal => (
            <Pressable
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoals.includes(goal.id) && styles.goalCardSelected,
              ]}
              onPress={() => toggleGoal(goal.id)}>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
              {selectedGoals.includes(goal.id) && (
                <View style={styles.checkmark}>
                  <Check size={20} color="#fff" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            selectedGoals.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
    lineHeight: 24,
  },
  goalsContainer: {
    padding: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  goalCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f5f3ff',
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 4,
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});