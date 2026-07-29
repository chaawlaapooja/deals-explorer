import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme';

interface PrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly accessibilityLabel?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly compact?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  accessibilityLabel,
  disabled = false,
  loading = false,
  compact = false,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        compact ? styles.compact : styles.regular,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading }}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
  },
  compact: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
  },
  regular: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});
