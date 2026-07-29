import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme';

interface SectionProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly bordered?: boolean;
  readonly compact?: boolean;
}

export function Section({
  title,
  children,
  bordered = false,
  compact = false,
}: SectionProps) {
  return (
    <View style={[styles.section, compact ? styles.compact : styles.spacious]}>
      <Text style={styles.title}>{title}</Text>
      {bordered ? <View style={styles.body}>{children}</View> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {},
  spacious: {
    gap: spacing.md,
  },
  compact: {
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  body: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
