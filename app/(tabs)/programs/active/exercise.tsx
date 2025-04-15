import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Clock, CircleCheck as CheckCircle2, ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type Exercise = {
  id: string;
  title: string;
  instructions: string;
  estimated_minutes: number;
  exercise_type: string;
  day_number: number;
  order_number: number;
};

export default function ExerciseScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    try {
      const { data, error } = await supabase
        .from('program_exercises')
        .select('*')
        .eq('id', exerciseId)
        .single();

      if (error) throw error;
      setExercise(data);

      // Get existing response if any
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progress } = await supabase
          .from('user_program_progress')
          .select('responses')
          .eq('user_id', user.id)
          .single();

        if (progress?.responses && progress.responses[exerciseId]) {
          setResponse(progress.responses[exerciseId]);
        }
      }
    } catch (error) {
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current progress
      const { data: progress } = await supabase
        .from('user_program_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .single();

      if (!progress) return;

      // Update responses
      const updatedResponses = {
        ...progress.responses,
        [exerciseId]: response
      };

      // Check if this was the last exercise of the day
      const { data: exercises } = await supabase
        .from('program_exercises')
        .select('id')
        .eq('program_id', progress.program_id)
        .eq('day_number', progress.current_day);

      const isLastExercise = exercises?.every(ex => 
        updatedResponses[ex.id] !== undefined
      );

      // Update progress
      await supabase
        .from('user_program_progress')
        .update({
          responses: updatedResponses,
          current_day: isLastExercise ? progress.current_day + 1 : progress.current_day,
          is_completed: isLastExercise && progress.current_day === progress.duration_days
        })
        .eq('id', progress.id);

      router.back();
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded || loading || !exercise) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.title}>{exercise.title}</Text>
        <View style={styles.timeTag}>
          <Clock size={16} color="#6366f1" />
          <Text style={styles.timeText}>{exercise.estimated_minutes} minutes</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{exercise.instructions}</Text>
        </View>

        <View style={styles.responseSection}>
          <Text style={styles.responseTitle}>Your Response</Text>
          <TextInput
            style={styles.responseInput}
            multiline
            placeholder="Write your thoughts and reflections here..."
            value={response}
            onChangeText={setResponse}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.completeButton, !response.trim() && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={!response.trim() || isSubmitting}>
          <CheckCircle2 size={20} color="#fff" />
          <Text style={styles.completeButtonText}>
            {isSubmitting ? 'Saving...' : 'Complete Exercise'}
          </Text>
          <ChevronRight size={20} color="#fff" />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: '#1e293b',
    marginBottom: 16,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  timeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6366f1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 12,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  responseSection: {
    marginBottom: 24,
  },
  responseTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 12,
  },
  responseInput: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});