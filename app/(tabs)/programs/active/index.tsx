import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Clock, Target, ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type ActiveProgram = {
  id: string;
  title: string;
  description: string;
  current_day: number;
  duration_days: number;
  exercises: Exercise[];
};

type Exercise = {
  id: string;
  title: string;
  instructions: string;
  estimated_minutes: number;
  exercise_type: string;
  day_number: number;
  order_number: number;
};

export default function ActiveProgramScreen() {
  const [program, setProgram] = useState<ActiveProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    fetchActiveProgram();
  }, []);

  const fetchActiveProgram = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the active program progress
      const { data: progressData } = await supabase
        .from('user_program_progress')
        .select('*, programs(*)')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .single();

      if (!progressData) {
        router.replace('/programs');
        return;
      }

      // Get exercises for the current day
      const { data: exercises } = await supabase
        .from('program_exercises')
        .select('*')
        .eq('program_id', progressData.program_id)
        .eq('day_number', selectedDay || progressData.current_day)
        .order('order_number');

      setProgram({
        id: progressData.program_id,
        title: progressData.programs.title,
        description: progressData.programs.description,
        current_day: progressData.current_day,
        duration_days: progressData.programs.duration_days,
        exercises: exercises || [],
      });
    } catch (error) {
      console.error('Error fetching active program:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (program) {
      fetchActiveProgram();
    }
  }, [selectedDay]);

  if (!fontsLoaded || loading || !program) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.title}>{program.title}</Text>
        <Text style={styles.subtitle}>Day {program.current_day} of {program.duration_days}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daysScroll}
        contentContainerStyle={styles.daysContent}>
        {Array.from({ length: program.duration_days }, (_, i) => i + 1).map((day) => (
          <Pressable
            key={day}
            style={[
              styles.dayButton,
              (selectedDay || program.current_day) === day && styles.dayButtonSelected,
              day < program.current_day && styles.dayButtonCompleted
            ]}
            onPress={() => setSelectedDay(day)}>
            <Text style={[
              styles.dayButtonText,
              (selectedDay || program.current_day) === day && styles.dayButtonTextSelected
            ]}>
              Day {day}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <View style={styles.progressCard}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(program.current_day / program.duration_days) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((program.current_day / program.duration_days) * 100)}% Complete
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Exercises</Text>
        {program.exercises.map((exercise, index) => (
          <Pressable
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => router.push({
              pathname: '/programs/active/exercise',
              params: { exerciseId: exercise.id }
            })}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Target size={20} color="#6366f1" />
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              </View>
              <View style={styles.exerciseTime}>
                <Clock size={16} color="#64748b" />
                <Text style={styles.exerciseTimeText}>
                  {exercise.estimated_minutes} min
                </Text>
              </View>
            </View>
            <Text style={styles.exerciseDescription}>
              {exercise.instructions}
            </Text>
            <ChevronRight size={20} color="#64748b" style={styles.exerciseArrow} />
          </Pressable>
        ))}
      </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  daysScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  daysContent: {
    padding: 16,
    gap: 8,
    flexDirection: 'row',
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  dayButtonCompleted: {
    backgroundColor: '#bbf7d0',
    borderColor: '#86efac',
  },
  dayButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6366f1',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exerciseTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  exerciseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  exerciseArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});