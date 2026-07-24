import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

export default function InvestScreen() {
  const { isAuthenticated } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invest</Text>
      <Text style={styles.description}>
        Placeholder invest screen for deal {id}. Submit to continue.
      </Text>
      <Button title="Submit Investment" onPress={() => router.push('/success')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
  },
});
