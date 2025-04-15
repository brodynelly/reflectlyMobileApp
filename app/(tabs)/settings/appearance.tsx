import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

export default function AppearanceScreen() {
  const { theme, updateTheme, isDark, colors } = useTheme();
  const [error, setError] = useState<string | null>(null);
  
  const styles = themedStyles(isDark);

  const handleThemeChange = async (newTheme: Theme) => {
    try {
      await updateTheme(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
      setError('Failed to update theme');
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
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Appearance</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeOptions}>
          <Pressable
            style={[styles.themeOption, theme === 'light' && styles.themeOptionSelected]}
            onPress={() => handleThemeChange('light')}>
            <Sun size={24} color={theme === 'light' ? colors.primary : colors.subtext} />
            <Text style={[
              styles.themeOptionText,
              theme === 'light' && styles.themeOptionTextSelected
            ]}>Light</Text>
          </Pressable>

          <Pressable
            style={[styles.themeOption, theme === 'dark' && styles.themeOptionSelected]}
            onPress={() => handleThemeChange('dark')}>
            <Moon size={24} color={theme === 'dark' ? colors.primary : colors.subtext} />
            <Text style={[
              styles.themeOptionText,
              theme === 'dark' && styles.themeOptionTextSelected
            ]}>Dark</Text>
          </Pressable>

          <Pressable
            style={[styles.themeOption, theme === 'system' && styles.themeOptionSelected]}
            onPress={() => handleThemeChange('system')}>
            <Monitor size={24} color={theme === 'system' ? colors.primary : colors.subtext} />
            <Text style={[
              styles.themeOptionText,
              theme === 'system' && styles.themeOptionTextSelected
            ]}>System</Text>
          </Pressable>
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
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
  },
  themeOptionSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primaryBackground,
  },
  themeOptionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.subtext,
    marginTop: 8,
  },
  themeOptionTextSelected: {
    color: theme.primary,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.error,
    textAlign: 'center',
    marginTop: 16,
  }
}));