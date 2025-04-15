import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="sign-in" 
        options={{
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
}