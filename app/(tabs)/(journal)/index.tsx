import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PenLine, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  interpolate
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type JournalEntry = {
  id: string;
  content: string;
  mood: string;
  created_at: string;
  gratitude?: string[];
};

export default function JournalScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showEntryDetails, setShowEntryDetails] = useState(false);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const calendarHeight = useSharedValue(300);

  useEffect(() => {
    setShowPrompts(!isCalendarExpanded);
  }, [isCalendarExpanded]);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startPadding = firstDay.getDay();
    const endPadding = 6 - lastDay.getDay();

    const days = [];

    // Add days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), -i);
      days.push(date);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      days.push(date);
    }

    // Add days from next month
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, i);
      days.push(date);
    }

    return days;
  }, [selectedDate]);

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (increment: number) => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries') 
        .select('id, content, mood, created_at, gratitude')
        .not('mood', 'is', null) // Only fetch daily entries (with mood)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
    calendarHeight.value = withTiming(isCalendarExpanded ? 0 : 300);
  };

  const calendarStyle = useAnimatedStyle(() => {
    return {
      height: calendarHeight.value,
      opacity: interpolate(calendarHeight.value, [0, 300], [0, 1]),
    };
  });

  const handleNewEntry = (type: 'guided' | 'free') => {
    setShowNewEntryModal(false);
    if (type === 'guided') {
      router.push('/(tabs)/(journal)/guided');
    } else {
      router.push('/(tabs)/(journal)/daily');
    }
  };
  
  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    
    const entry = getEntryForDate(date);
    if (entry) {
      setSelectedEntry(entry || null);
      setIsCalendarExpanded(false);
      calendarHeight.value = withTiming(0);
    }
  };

  const generateAiInsight = (entry: JournalEntry) => {
    // This would be replaced with actual AI processing
    return `Based on your entry, you seem ${entry.mood.toLowerCase()}. 
    Your gratitude practice shows a focus on personal relationships and growth.
    Consider exploring more outdoor activities to maintain this positive momentum.`;
  };

  if (!fontsLoaded) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.calendarToggle} onPress={toggleCalendar}>
        <Text style={styles.calendarToggleText}>
          {isCalendarExpanded ? 'Hide Calendar' : 'Show Calendar'}
        </Text>
        {isCalendarExpanded ? (
          <ChevronUp size={20} color="#64748b" />
        ) : (
          <ChevronDown size={20} color="#64748b" />
        )}
      </Pressable>

      <Animated.View style={[styles.calendarContainer, calendarStyle]}>
        <View style={styles.calendarHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <ChevronLeft size={24} color="#1e293b" />
          </Pressable>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <Pressable onPress={() => changeMonth(1)} style={styles.monthButton}>
            <ChevronRight size={24} color="#1e293b" />
          </Pressable>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekdayHeader}>
            {WEEKDAYS.map(day => (
              <Text key={day} style={styles.weekday}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((date, index) => (
              <Pressable
                key={index}
                style={[
                  styles.calendarDay,
                  !isCurrentMonth(date) && styles.calendarDayEmpty,
                  getEntryForDate(date) && styles.calendarDayWithEntry,
                  isToday(date) && { borderWidth: 2, borderColor: '#6366f1' }
                ]}
                onPress={() => handleDateSelect(date)}>
                <Text style={[
                  styles.calendarDayText,
                  isCurrentMonth(date) && { color: '#1e293b' },
                  getEntryForDate(date) && styles.calendarDayTextWithEntry,
                  isToday(date) && { color: '#6366f1' }
                ]}>
                  {date.getDate()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      {!isCalendarExpanded && selectedEntry && (
        <View style={styles.entriesContainer}>
          {entries
            .filter(entry => {
              const entryDate = new Date(entry.created_at);
              const selectedEntryDate = new Date(selectedEntry.created_at);
              return (
                entryDate.getDate() === selectedEntryDate.getDate() &&
                entryDate.getMonth() === selectedEntryDate.getMonth() &&
                entryDate.getFullYear() === selectedEntryDate.getFullYear()
              );
            })
            .map((entry) => (
              <View 
                key={entry.id}
                style={styles.selectedEntry}>
                <View style={styles.selectedEntryHeader}>
                  <Text style={styles.selectedEntryDate}>
                    {formatDate(entry.created_at)}
                  </Text>
                  <View style={styles.moodTag}>
                    <Text style={styles.moodText}>{entry.mood}</Text>
                  </View>
                </View>
                
                <View style={styles.entrySummary}>
                  <Text style={styles.summaryTitle}>Today's Reflection</Text>
                  <Text style={styles.summaryText}>{entry.content}</Text>
                  
                  {entry.gratitude && entry.gratitude.length > 0 && (
                    <View style={styles.gratitudeSection}>
                      <Text style={styles.sectionTitle}>Gratitude</Text>
                      {entry.gratitude.map((item, index) => (
                        <Text key={index} style={styles.gratitudeItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.aiInsightContainer}>
                  <Sparkles size={20} color="#6366f1" />
                  <Text style={styles.aiInsightText}>
                    {generateAiInsight(entry)}
                  </Text>
                  <ChevronRight size={20} color="#6366f1" />
                </View>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  calendarToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
    marginRight: 4,
  },
  calendarContainer: {
    overflow: 'hidden',
    backgroundColor: theme.card,
    borderBottomColor: theme.border,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  monthText: {
    fontFamily: 'Playfair-Bold',
    fontSize: 20,
    color: theme.text,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    width: '100%',
    padding: 12,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  weekday: {
    width: (SCREEN_WIDTH - 48) / 7,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
  },
  calendarDay: {
    width: (SCREEN_WIDTH - 48) / 7,
    aspectRatio: 1,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  calendarDayEmpty: {
    opacity: 0.3,
  },
  calendarDayWithEntry: {
    backgroundColor: theme.primaryBackground,
    borderRadius: 8,
  },
  calendarDayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.subtext,
    textAlign: 'center',
  },
  calendarDayTextWithEntry: {
    color: theme.primary,
  },
  entriesContainer: {
    padding: 16,
    gap: 12,
  },
  selectedEntry: {
    padding: 20,
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedEntryDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
  },
  moodTag: {
    backgroundColor: theme.primaryBackground,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: theme.primary,
  },
  entrySummary: {
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  gratitudeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 8,
  },
  gratitudeItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.text,
    marginBottom: 4,
    paddingLeft: 8,
  },
  aiInsightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.primaryBackground,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  aiInsightText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
}));