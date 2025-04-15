import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PenLine, Sparkles, ChevronRight, Flame, ArrowRight, Target, BookOpen } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

type Program = {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  difficulty: string;
  progress?: number;
};

export default function TodayScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [greeting, setGreeting] = useState('');
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.name}>Alexandra</Text>
        {!loading && streak > 0 && (
          <View style={styles.streakBadge}>
            <Flame size={20} color="#f59e0b" />
            <Text style={styles.streakText}>{streak} Day Streak!</Text>
          </View>
        )}
      </View>

      {!hasEntryToday ? (
        <View style={styles.todayCard}>
          <View style={styles.cardHeader}>
            <Sparkles size={24} color="#6366f1" />
            <Text style={styles.cardTitle}>Today's Journey</Text>
          </View>
          <Text style={styles.cardDescription}>
            Take a moment to reflect on your day and continue your journey of self-discovery.
          </Text>
          <Pressable
            style={styles.startButton}
            onPress={() => router.push('/(daily)/mood')}>
            <PenLine size={20} color="#fff" />
            <Text style={styles.buttonText}>Start Today's Entry</Text>
            <ChevronRight size={20} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <Pressable 
          style={styles.completionCard}
          onPress={() => router.push('/(tabs)/insights')}>
          <View style={styles.cardHeader}>
            <Sparkles size={24} color="#6366f1" />
            <Text style={styles.cardTitle}>Congratulations!</Text>
          </View>
          <Text style={styles.completionText}>
            You've completed your daily reflection. Keep up the great work!
          </Text>
          <View style={styles.insightsLink}>
            <Text style={styles.insightsLinkText}>View Your Insights</Text>
            <ArrowRight size={20} color="#6366f1" />
          </View>
        </Pressable>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Target size={20} color="#f59e0b" />
            <Text style={styles.insightTitle}>Goal Progress</Text>
          </View>
          <Text style={styles.insightText}>
            "Your journaling shows increased positivity when you maintain your morning routine."
          </Text>
        </View>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Sparkles size={20} color="#10b981" />
            <Text style={styles.insightTitle}>Pattern Recognition</Text>
          </View>
          <Text style={styles.insightText}>
            "You tend to feel more energized and productive on days when you practice gratitude."
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Focus</Text>
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>Personal Growth</Text>
          <Text style={styles.focusDescription}>
            This week, we'll explore how your daily habits align with your long-term goals.
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Programs</Text>
        <ScrollView 
          horizontal
          style={styles.programsScrollView}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.programsScroll}>
          {programs.length > 0 ? programs.map((program) => {
            const colors = getCardColors(programs.indexOf(program), program.progress);
            return (
              <Pressable
                key={program.id}
                style={[
                  styles.programCard,
                  { 
                    backgroundColor: colors.bg,
                    borderColor: colors.border 
                  }
                ]}
                onPress={() => router.push({
                  pathname: '/programs/details',
                  params: { id: program.id }
                })}>
                <View style={styles.programHeader}>
                  <BookOpen size={20} color={colors.text} />
                  <View style={[styles.programBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.programBadgeText, { color: colors.text }]}>
                      {program.progress ? `${Math.round(program.progress)}% Complete` : program.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programDescription} numberOfLines={2}>
                  {program.description}
                </Text>
                <View style={styles.programMeta}>
                  <Text style={styles.programDuration}>{program.duration_days} days</Text>
                  <ChevronRight size={16} color="#64748b" />
                </View>
              </Pressable>
            );
          }) : (
            <Pressable
              style={styles.getStartedCard}
              onPress={() => router.push('/programs')}>
              <View style={styles.getStartedHeader}>
                <Sparkles size={24} color="#6366f1" />
                <Text style={styles.getStartedTitle}>Begin Your Journey</Text>
              </View>
              <Text style={styles.getStartedDescription}>
                Start your wellness journey by exploring our curated programs designed for personal growth.
              </Text>
              <View style={styles.getStartedButton}>
                <Text style={styles.getStartedButtonText}>Explore Programs</Text>
                <ChevronRight size={20} color="#6366f1" />
              </View>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: theme.card,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext
  },
  name: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginTop: 4
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.success
  },
  streakText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.success
  },
  todayCard: {
    margin: 16,
    padding: 24,
    backgroundColor: theme.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border
  },
  completionCard: {
    margin: 16,
    padding: 24,
    backgroundColor: theme.success + '20',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.success
  },
  insightsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8
  },
  insightsLinkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.success
  },
  completionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.success,
    lineHeight: 24
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.text,
    marginLeft: 12,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    lineHeight: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.text,
    lineHeight: 24,
  },
  programsScrollView: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  programsScroll: {
    paddingRight: 16,
    gap: 16,
  },
  getStartedCard: {
    width: 280,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
  },
  getStartedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  getStartedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.primary,
  },
  getStartedDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    lineHeight: 20,
    marginBottom: 16,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  getStartedButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.primary,
  },
  programCard: {
    width: 280,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  programBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  programBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12
  },
  programTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  programDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    lineHeight: 20,
    marginBottom: 16,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programDuration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
  },
  focusCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border
  },
  focusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
  },
  focusDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: theme.subtext,
    lineHeight: 22,
  },
}));