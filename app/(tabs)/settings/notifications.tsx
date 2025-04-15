import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Bell, Clock, Calendar } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function NotificationsScreen() {
  const { isDark, colors } = useTheme();
  const styles = themedStyles(isDark);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [programUpdates, setProgramUpdates] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('journal_reminder, weekly_insights, program_updates')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDailyReminder(data.journal_reminder);
        setWeeklyInsights(data.weekly_insights);
        setProgramUpdates(data.program_updates);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (
    setting: 'journal_reminder' | 'weekly_insights' | 'program_updates',
    value: boolean
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // First try to get existing settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Prepare settings object with all required fields
      const settingsData = {
        user_id: user.id,
        theme: 'system',
        notifications_enabled: true,
        journal_reminder: dailyReminder,
        weekly_insights: weeklyInsights,
        program_updates: programUpdates,
        app_lock_enabled: false,
        hide_content: true,
        data_collection: true,
        ...existingSettings, // Preserve existing settings
        [setting]: value // Override the specific setting being updated
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsData);

      if (error) throw error;

      // Update local state
      switch (setting) {
        case 'journal_reminder':
          setDailyReminder(value);
          break;
        case 'weekly_insights':
          setWeeklyInsights(value);
          break;
        case 'program_updates':
          setProgramUpdates(value);
          break;
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setError('Failed to update setting');
    }
  };

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reminders</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Journal Reminder</Text>
                <Text style={styles.settingDescription}>
                  Get reminded to write your daily entry
                </Text>
              </View>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={(value) => updateSetting('journal_reminder', value)}
              trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
              thumbColor={dailyReminder ? '#6366f1' : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights & Updates</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Calendar size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Weekly Insights</Text>
                <Text style={styles.settingDescription}>
                  Receive weekly progress and insights
                </Text>
              </View>
            </View>
            <Switch
              value={weeklyInsights}
              onValueChange={(value) => updateSetting('weekly_insights', value)}
              trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
              thumbColor={weeklyInsights ? '#6366f1' : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Clock size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Program Updates</Text>
                <Text style={styles.settingDescription}>
                  Get notified about your active programs
                </Text>
              </View>
            </View>
            <Switch
              value={programUpdates}
              onValueChange={(value) => updateSetting('program_updates', value)}
              trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
              thumbColor={programUpdates ? '#6366f1' : '#fff'}
            />
          </View>
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.error,
    textAlign: 'center',
    marginTop: 16,
  },
}
)
)