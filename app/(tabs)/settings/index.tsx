import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { User, Bell, Moon, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const { isDark, colors } = useTheme();
  const styles = themedStyles(isDark);
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/profile')}>
          <View style={styles.settingContent}>
            <User size={24} color="#6366f1" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingDescription}>
                Manage your personal information
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>

        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/notifications')}>
          <View style={styles.settingContent}>
            <Bell size={24} color="#6366f1" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Configure your notification preferences
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>

        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/appearance')}>
          <View style={styles.settingContent}>
            <Moon size={24} color="#6366f1" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Appearance</Text>
              <Text style={styles.settingDescription}>
                Customize your app theme
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>

        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/privacy')}>
          <View style={styles.settingContent}>
            <Shield size={24} color="#6366f1" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>
                Manage your privacy settings
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={24} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2025 Reflectly. All rights reserved.</Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 12,
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
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.text,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.error,
  },
footer: {
    gap: '20', 
    padding: 24,
    alignItems: 'center',
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    bottom: 0, // Anchors it to the bottom
    left: 0,
    right: 0,
    width: '100%', // Ensures full width
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 4,
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.subtext,
  },
}));