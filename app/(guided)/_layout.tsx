import { Stack } from 'expo-router';

export default function GuidedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="mood" />
      <Stack.Screen name="prompt" />
    </Stack>
  );
}