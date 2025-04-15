import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useFrameworkReady();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          presentation: 'card'
        }}>
        <Stack.Screen
          name="(guided)"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="(daily)"
          options={{
            presentation: 'modal',
            animation: 'none',
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen 
          name="(auth)" 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ animation: 'none' }}
        />
      </Stack>
      <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}