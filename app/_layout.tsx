import { Stack } from 'expo-router';

import { AppProvider } from '@/src/providers/AppProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="deals/index" />
        <Stack.Screen
          name="deals/[id]"
          options={{ headerShown: true, title: 'Deal Detail', headerBackTitle: 'All Deals' }}
        />
        <Stack.Screen name="invest/[id]" options={{
          headerShown: true,
          title: 'Invest',
        }} />
        <Stack.Screen name="success" />
      </Stack>
    </AppProvider>
  );
}
