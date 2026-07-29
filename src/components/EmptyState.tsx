import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors, spacing, typography } from '@/src/theme';

interface EmptyStateProps {
  readonly message: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly accessibilityLabel?: string;
  readonly muted?: boolean;
}

export function EmptyState({
  message,
  actionLabel,
  onAction,
  accessibilityLabel,
  muted = false,
}: EmptyStateProps) {
  if (muted) {
    return <Text style={styles.mutedMessage}>{message}</Text>;
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          compact
          accessibilityLabel={accessibilityLabel ?? actionLabel}
        />
      ) : null}
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
  mutedMessage: {
    fontSize: typography.sizes.md,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
