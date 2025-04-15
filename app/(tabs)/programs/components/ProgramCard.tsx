import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Clock, BookOpen, Star, ChevronRight } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { router } from 'expo-router';

type ProgramCardProps = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_days: number;
  currentDay?: number;
  progress?: number;
  isActive?: boolean;
};

export function ProgramCard({
  id,
  title,
  description,
  difficulty,
  duration_days,
  currentDay,
  progress,
  isActive
}: ProgramCardProps) {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({
        pathname: '/programs/details',
        params: { id }
      })}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.difficultyBadge}>
          <Star size={16} color="#f59e0b" />
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.metaText}>
            {currentDay ? `Day ${currentDay} of ${duration_days}` : `${duration_days} days`}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <BookOpen size={16} color="#64748b" />
          <Text style={styles.metaText}>Daily exercises</Text>
        </View>
      </View>

      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}

      <ChevronRight size={20} color="#64748b" style={styles.arrow} />
    </Pressable>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#f59e0b',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  arrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
}));