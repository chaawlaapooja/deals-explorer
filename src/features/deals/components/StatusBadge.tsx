import { StyleSheet, Text, View } from 'react-native';

import type { DealStatus } from '@/src/features/deals/types/deal';
import { colors, radius, spacing, typography } from '@/src/theme';
import { capitalize } from '@/src/utils/capitalize';

const STATUS_COLORS: Record<DealStatus, string> = {
  draft: colors.gray,
  active: colors.brand,
  closed: colors.darkGray,
};

interface StatusBadgeProps {
  readonly status: DealStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
      <Text style={styles.badgeText}>{capitalize(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
});
