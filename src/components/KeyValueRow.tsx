import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/src/theme';

interface KeyValueRowProps {
  readonly label: string;
  readonly value: string;
  readonly isLast?: boolean;
}

export function KeyValueRow({
  label,
  value,
  isLast = false,
}: KeyValueRowProps) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  value: {
    flexShrink: 0,
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'right',
  },
});
