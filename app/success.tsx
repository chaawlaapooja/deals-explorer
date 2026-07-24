import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Success</Text>
      <Text style={styles.description}>
        Placeholder success screen. Your investment flow is complete.
      </Text>
      <Button title="Back to Deals" onPress={() => router.replace('/deals')} />
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
