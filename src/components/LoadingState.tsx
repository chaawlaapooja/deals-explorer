import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/src/theme';

interface LoadingStateProps {
  readonly message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.brand} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  message: {
    fontSize: typography.sizes.md,
    color: colors.black,
    textAlign: 'center',
  },
});
