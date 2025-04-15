import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
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
  completed_at: string;
};

export function CompletedPlansTab() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [completedPrograms, setCompletedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedPrograms();
  }, []);

  const fetchCompletedPrograms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: progress, error: progressError } = await supabase
        .from('user_program_progress')
        .select('program_id, completed_at')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (progressError) throw progressError;

      if (progress && progress.length > 0) {
        const programIds = progress.map(p => p.program_id);
        const { data: programs, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .in('id', programIds);

        if (programsError) throw programsError;
        setCompletedPrograms(programs || []);
      }
    } catch (error) {
      console.error('Error fetching completed programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading completed programs...</Text>;
  }

  if (completedPrograms.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Completed Programs</Text>
        <Text style={styles.emptyText}>
          Your completed programs will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {completedPrograms.map(program => (
        <View key={program.id} style={styles.completedCard}>
          <View style={styles.completedHeader}>
            <Text style={styles.completedTitle}>{program.title}</Text>
            <View style={styles.completedBadge}>
              <Sparkles size={16} color={isDark ? '#34d399' : '#10b981'} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          </View>
          <Text style={styles.description}>{program.description}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{program.duration_days}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>
      ))}
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
  completedCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: theme.success,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: theme.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
  },
}));