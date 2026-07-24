import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

const SAMPLE_DEAL_ID = 'deal-001';

export default function DealsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deals</Text>
      <Text style={styles.description}>
        Placeholder deals list. Open a sample deal to continue.
      </Text>
      <Button
        title="Open Sample Deal"
        onPress={() => router.push(`/deals/${SAMPLE_DEAL_ID}`)}
      />
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
