import { Stack } from 'expo-router';

export default function DailyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        presentation: 'modal',
      }}>
      <Stack.Screen name="mood" />
      <Stack.Screen name="story" />
      <Stack.Screen name="gratitude" />
      <Stack.Screen name="challenges" />
      <Stack.Screen name="insights" />
    </Stack>
  );
}