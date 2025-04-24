import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Create styles with dynamic insets for iOS
  const styles = themedStyles(isDark, insets);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (mode === 'signup') {
        router.push('/onboarding/goals');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1e293b" />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'signin'
                ? 'Sign in to continue your journey'
                : 'Start your wellness journey today'}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </Pressable>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            style={styles.switchMode}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.switchModeText}>
              {mode === 'signin'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const themedStyles = createThemedStyles((theme, insets = { top: 0, bottom: 0 }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.card,
  },
  content: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? insets.top + 12 : 24,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.background,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 16,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 16 : 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    paddingVertical: Platform.OS === 'ios' ? 2 : 0,
  },
  eyeIcon: {
    padding: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    minWidth: 200,
    maxWidth: '90%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
  switchMode: {
    alignItems: 'center',
    padding: 16,
  },
  switchModeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.primary,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.error,
    textAlign: 'center',
    marginTop: 8,
  },
}));