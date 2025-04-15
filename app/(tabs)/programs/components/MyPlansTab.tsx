import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { ProgramCard } from './ProgramCard';

type Program = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_days: number;
};

type UserProgress = {
  program_id: string;
  current_day: number;
  is_completed: boolean;
};

export function MyPlansTab() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
    fetchUserProgress();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_program_progress')
        .select('program_id, current_day, is_completed')
        .eq('user_id', user.id)
        .eq('is_completed', false);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading your programs...</Text>;
  }

  if (userProgress.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Active Programs</Text>
        <Text style={styles.emptyText}>
          Start a new program to begin your wellness journey
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userProgress.map(progress => {
        const program = programs.find(p => p.id === progress.program_id);
        if (!program) return null;

        const progressPercentage = (progress.current_day / program.duration_days) * 100;

        return (
          <ProgramCard
            key={program.id}
            {...program}
            currentDay={progress.current_day}
            progress={progressPercentage}
            isActive
          />
        );
      })}
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
  },
}));