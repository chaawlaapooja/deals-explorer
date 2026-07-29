import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors, spacing, typography } from '@/src/theme';

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        label="Retry"
        onPress={onRetry}
        compact
        accessibilityLabel="Retry"
      />
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
