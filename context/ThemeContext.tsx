import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';

type Theme = 'light' | 'dark' | 'system';

export const colors = {
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    subtext: '#64748b',
    border: '#e2e8f0',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryBackground: '#f5f3ff',
    error: '#ef4444',
    success: '#10b981',
  },
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    subtext: '#94a3b8',
    border: '#334155',
    primary: '#818cf8',
    primaryLight: '#a5b4fc',
    primaryBackground: '#1e1b4b',
    error: '#f87171',
    success: '#34d399',
  },
};

export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesCallback: (theme: typeof colors.light | typeof colors.dark) => T
) {
  return (isDark: boolean) => {
    const theme = isDark ? colors.dark : colors.light;
    return StyleSheet.create(stylesCallback(theme));
  };
}

type ThemeContextType = {
  theme: Theme;
  currentTheme: 'light' | 'dark';
  isDark: boolean;
  updateTheme: (newTheme: Theme) => Promise<void>;
  colors: typeof colors.light | typeof colors.dark;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const systemColorScheme = useColorScheme();
  
  const currentTheme = theme === 'system' 
    ? (systemColorScheme || 'light')
    : theme;
    
  const isDark = currentTheme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_settings')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.theme) {
        setTheme(data.theme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateTheme = async (newTheme: Theme) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const settingsData = {
        user_id: user.id,
        theme: newTheme,
        notifications_enabled: true,
        journal_reminder: true,
        weekly_insights: true,
        program_updates: true,
        app_lock_enabled: false,
        hide_content: true,
        data_collection: true,
        ...existingSettings
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsData);

      if (error) throw error;
      setTheme(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      isDark,
      updateTheme,
      colors: themeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}