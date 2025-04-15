import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type Program = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_days: number;
  theme: string;
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

export default function ProgramDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (id) {
      fetchProgramDetails();
      checkProgramStatus();
    }
  }, [id]);

  const checkProgramStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: progress, error } = await supabase
        .from('user_program_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('program_id', id);

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking program status:', error);
      }

      setHasStarted(progress && progress.length > 0);
    } catch (error) {
      console.error('Error checking program status:', error);
    }
  };

  const fetchProgramDetails = async () => {
    try {
      // Fetch program details
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (programError) throw programError;
      setProgram(programData);

      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('program_exercises')
        .select('*')
        .eq('program_id', id)
        .order('day_number', { ascending: true })
        .order('order_number', { ascending: true });

      if (exercisesError) throw exercisesError;
      setExercises(exercisesData || []);
    } catch (error) {
      console.error('Error fetching program details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProgram = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser ();
      if (!user) return;

      // Check if user already has this program in progress
      const { data: existingProgress, error: checkError } = await supabase
        .from('user_program_progress')
        .select('id, is_completed')
        .eq('user_id', user.id)
        .eq('program_id', id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingProgress) {
        if (!existingProgress.is_completed) {
          // Program is already in progress
          router.push('/programs/active');
          return;
        } else {
          // Program was completed before, start a new instance
          const { error: updateError } = await supabase
            .from('user_program_progress')
            .update({
              current_day: 1,
              responses: {},
              is_completed: false,
              started_at: new Date().toISOString()
            })
            .eq('id', existingProgress.id);

          if (updateError) throw updateError;
          router.push('/programs/active');
          return;
        }
      }

      // Start the new program
      const { error } = await supabase
        .from('user_program_progress')
        .insert({
          user_id: user.id,
          program_id: id,
          current_day: 1,
          responses: {},
          is_completed: false,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      router.push('/programs/active');
    } catch (error) {
      console.error('Error starting program:', error);
      // Handle specific error cases
      if (error instanceof Error) {
        // Add error handling UI here if needed
      }
    }
  };

  if (!fontsLoaded || loading || !program) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.title}>{program.title}</Text>
        <Text style={styles.subtitle}>{program.description}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#6366f1" />
            <View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{program.duration_days} days</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <BookOpen size={20} color="#6366f1" />
            <View>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>{program.difficulty}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Program Overview</Text>
        {Object.entries(exercises.reduce((days, exercise) => {
          if (!days[exercise.day_number]) {
            days[exercise.day_number] = [];
          }
          days[exercise.day_number].push(exercise);
          return days;
        }, {} as Record<number, Exercise[]>)).map(([dayNumber, dayExercises]) => (
          <View key={dayNumber} style={styles.dayCard}>
            <Text style={styles.dayTitle}>Day {dayNumber}</Text>
            {dayExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseTime}>
                    {exercise.estimated_minutes} min
                  </Text>
                </View>
                <Text style={styles.exerciseInstructions}>
                  {exercise.instructions}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.startButton} onPress={handleStartProgram}>
          <Text style={styles.startButtonText}>
            {hasStarted ? 'Continue Program' : 'Start Program'}
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  exerciseItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  exerciseTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  exerciseInstructions: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});