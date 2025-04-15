import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { Platform } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Target, Sparkles, ArrowUp, ArrowDown, Activity, TrendingUp, Star, FileText } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryArea, VictoryLine } from 'victory';
import { supabase } from '@/lib/supabase';

const DEFAULT_CHART_WIDTH = 300;

type MoodData = {
  date: Date;
  value: number;
};

type InsightData = {
  totalEntries: number;
  weeklyEntries: number;
  weeklyEntriesData: { date: Date; count: number }[];
  lastWeekEntries: number;
  completionRate: number;
  gratitudeCount: number;
  moodData: MoodData[];
  moodScore: number;
  previousMoodScores: number[];
  improvements: string[];
  areas: string[];
};

const MOOD_VALUES: Record<string, number> = {
  'Joyful': 5,
  'Peaceful': 4,
  'Grateful': 5,
  'Calm': 3,
  'Neutral': 2,
  'Anxious': 1,
  'Sad': 1,
  'Frustrated': 1
};

export default function InsightsScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(DEFAULT_CHART_WIDTH, Math.min(width - 48, 800));

  const [insights, setInsights] = useState<InsightData>({
    totalEntries: 0,
    weeklyEntries: 0,
    weeklyEntriesData: [] as { date: Date; count: number }[],
    lastWeekEntries: 0,
    completionRate: 0,
    gratitudeCount: 0,
    moodData: [] as MoodData[],
    moodScore: 0,
    previousMoodScores: [],
    improvements: [],
    areas: [] as string[]
  });

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const today = new Date();
      const fourWeeksAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);

      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .gte('created_at', fourWeeksAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!entries) return;

      // Process entries for mood data
      const moodData: MoodData[] = entries.map(entry => ({
        date: new Date(entry.created_at),
        value: MOOD_VALUES[entry.mood] || 2
      }));

      // Calculate weekly stats
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyEntries = entries.filter(entry => 
        new Date(entry.created_at) >= oneWeekAgo
      ).length;
      
      // Calculate weekly entries data for the graph
      const weeklyEntriesData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const count = entries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate.toDateString() === date.toDateString();
        }).length;
        return { date, count };
      }).reverse();

      // Calculate mood scores for the last 4 weeks
      const calculateWeekMoodScore = (startDate: Date) => {
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const weekEntries = entries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate >= startDate && entryDate < endDate;
        });
        
        if (weekEntries.length === 0) return 0;
        
        const totalScore = weekEntries.reduce((sum, entry) => sum + (MOOD_VALUES[entry.mood] || 0), 0);
        return Math.round((totalScore / weekEntries.length) * 100) / 100;
      };

      const previousMoodScores = Array.from({ length: 4 }, (_, i) => {
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - ((i + 1) * 7));
        return calculateWeekMoodScore(startDate);
      }).reverse();

      const currentWeekMoodScore = calculateWeekMoodScore(oneWeekAgo);

      const twoWeeksAgoDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      const lastWeekEntries = entries.filter(entry => {
        const date = new Date(entry.created_at);
        return date >= twoWeeksAgoDate && date < oneWeekAgo;
      }).length;

      // Calculate improvements and areas needing attention
      const improvements = ['Morning routine consistency', 'Gratitude practice', 'Stress management'];
      const areas = ['Evening reflection', 'Goal setting', 'Sleep schedule'];
      let morningCount = 0;
      let eveningCount = 0;
      let gratitudeCount = 0;

      entries.forEach(entry => {
        // Count time of day
        const hour = new Date(entry.created_at).getHours();
        if (hour < 12) morningCount++;
        else eveningCount++;

        // Count gratitude entries
        if (entry.gratitude && entry.gratitude.length > 0) {
          gratitudeCount++;
        }
      });

      setInsights({
        totalEntries: entries.length,
        weeklyEntries,
        weeklyEntriesData,
        lastWeekEntries,
        completionRate: Math.round((entries.length / 30) * 100), // Last 30 days
        gratitudeCount,
        moodData,
        moodScore: currentWeekMoodScore,
        previousMoodScores,
        improvements,
        areas
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Understanding your journey</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.statsGrid}>
          <View style={styles.weeklyStats}>
            <View style={styles.totalEntriesHeader}>
              <FileText size={24} color="#6366f1" />
              <View style={styles.totalEntriesText}>
                <Text style={styles.totalEntriesTitle}>Total Entries</Text>
                <Text style={styles.totalEntriesCount}>{insights.totalEntries}</Text>
              </View>
              {insights.weeklyEntries > insights.lastWeekEntries ? (
                <View style={[styles.changeIndicator, styles.positiveChange]}>
                  <ArrowUp size={16} color="#10b981" />
                  <Text style={[styles.changeText, styles.positiveChangeText]}>
                    {Math.round(((insights.weeklyEntries - insights.lastWeekEntries) / insights.lastWeekEntries) * 100)}%
                  </Text>
                </View>
              ) : (
                <View style={[styles.changeIndicator, styles.negativeChange]}>
                  <ArrowDown size={16} color="#ef4444" />
                  <Text style={[styles.changeText, styles.negativeChangeText]}>
                    {Math.round(((insights.lastWeekEntries - insights.weeklyEntries) / insights.lastWeekEntries) * 100)}%
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text style={styles.weeklyTitle}>Weekly Entries</Text>
              <VictoryChart
                width={chartWidth}
                height={180}
                padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
                domainPadding={{ x: 20, y: [0, 20] }}>
                <VictoryAxis
                  tickFormat={(t) => ['Week 1', 'Week 2', 'Week 3', 'Week 4'][t]}
                  style={{
                    axis: { stroke: '#e2e8f0' },
                    tickLabels: { 
                      fill: '#64748b',
                      fontSize: 12,
                      fontFamily: 'Inter-Regular'
                    }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickValues={[0, 1, 2, 3, 4]}
                  style={{
                    axis: { stroke: '#e2e8f0' },
                    tickLabels: { 
                      fill: '#64748b',
                      fontSize: 12,
                      fontFamily: 'Inter-Regular'
                    }
                  }}
                />
                <VictoryBar
                  data={[0, 1, 2, 3].map(i => ({
                    x: i,
                    y: Math.max(0, insights.weeklyEntriesData[i]?.count || 0)
                  }))}
                  style={{
                    data: { 
                      fill: '#6366f1',
                      width: 30
                    }
                  }}
                  cornerRadius={{ top: 4 }}
                />
              </VictoryChart>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Mood Trends</Text>
          <View>
            <VictoryChart
              width={chartWidth}
              height={200}
              padding={{ top: 20, bottom: 20, left: 40, right: 20 }}
              domainPadding={{ y: [0, 20] }}>
              <VictoryAxis
                dependentAxis
                tickValues={[1, 2, 3, 4, 5]}
                tickFormat={(value) => {
                  const moodLabels = ['', 'Low', 'Neutral', 'Good', 'Great', 'Excellent'];
                  return moodLabels[value];
                }}
                style={{
                  axis: { stroke: '#e2e8f0' },
                  tickLabels: { 
                    fill: '#64748b',
                    fontSize: 12,
                    fontFamily: 'Inter-Regular',
                    strokeWidth: 0
                  },
                  data: {
                    stroke: '#6366f1',
                    strokeWidth: 2
                  }
                }}
              />
              <VictoryGroup>
                <VictoryArea
                  data={insights.moodData}
                  x="date"
                  y="value"
                  interpolation="monotoneX"
                  style={{
                    data: {
                      fill: '#818cf8',
                      fillOpacity: 0.1
                    }
                  }}
                />
                <VictoryLine
                  data={insights.moodData}
                  x="date"
                  y="value"
                  interpolation="monotoneX"
                  style={{ data: { stroke: '#6366f1', strokeWidth: 2 } }}
                />
              </VictoryGroup>
            </VictoryChart>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.moodScoreCard}>
          <View style={styles.moodScoreHeader}>
            <Star size={24} color="#fbbf24" />
            <Text style={styles.moodScoreTitle}>Weekly Mood Score</Text>
          </View>
          <Text style={styles.moodScoreValue}>{insights.moodScore.toFixed(1)}</Text>
          <View style={styles.moodScoreHistory}>
            {insights.previousMoodScores.map((score, index) => (
              <View key={index} style={styles.moodScoreHistoryItem}>
                <Text style={styles.moodScoreHistoryWeek}>Week {index + 1}</Text>
                <Text style={styles.moodScoreHistoryValue}>{score.toFixed(1)}</Text>
              </View>
            ))}
          </View>
          {insights.moodScore > insights.previousMoodScores[3] && (
            <View style={styles.moodScoreImprovement}>
              <TrendingUp size={20} color="#10b981" />
              <Text style={styles.moodScoreImprovementText}>
                {Math.round((insights.moodScore - insights.previousMoodScores[3]) * 100)}% improvement from last month
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.analysisTitle}>Detailed Analysis</Text>
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Activity size={24} color="#6366f1" />
            <Text style={styles.cardTitle}>Top Improvements</Text>
          </View>
          {insights.improvements.map((item, index) => (
            <View key={index} style={styles.analysisItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.analysisText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Target size={24} color="#6366f1" />
            <Text style={styles.cardTitle}>Areas for Focus</Text>
          </View>
          {insights.areas.map((item, index) => (
            <View key={index} style={styles.analysisItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.analysisText}>{item}</Text>
            </View>
          ))}
        </View>
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
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  totalEntriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 12
  },
  totalEntriesText: {
    flex: 1,
    marginLeft: 12
  },
  totalEntriesTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext
  },
  totalEntriesCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: theme.text
  },
  weeklyStats: {
    width: '100%',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border
  },
  weeklyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 12
  },
  weeklyComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  weeklyNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1e293b',
    marginRight: 12
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  positiveChange: {
    backgroundColor: '#ecfdf5'
  },
  negativeChange: {
    backgroundColor: '#fef2f2'
  },
  changeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 4
  },
  positiveChangeText: {
    color: '#10b981'
  },
  negativeChangeText: {
    color: '#ef4444'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b'
  },
  moodScoreCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border
  },
  moodScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  moodScoreTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginLeft: 12
  },
  moodScoreValue: {
    fontFamily: 'Playfair-Bold',
    fontSize: 48,
    color: theme.text,
    marginBottom: 24
  },
  moodScoreHistory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  moodScoreHistoryItem: {
    alignItems: 'center'
  },
  moodScoreHistoryWeek: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.subtext,
    marginBottom: 4
  },
  moodScoreHistoryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text
  },
  moodScoreImprovement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 12,
    gap: 8
  },
  moodScoreImprovementText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#10b981'
  },
  chartContainer: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border
  },
  analysisCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginLeft: 12
  },
  analysisTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: theme.text,
    marginBottom: 16
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
    marginRight: 12
  },
  analysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text
  }
}));