import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deal, DealStatus } from '@/src/features/deals/types/deal';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatDate } from '@/src/utils/formatDate';

interface DealCardProps {
  readonly deal: Deal;
}

const STATUS_COLORS: Record<DealStatus, string> = {
  draft: colors.gray,
  active: colors.brand,
  closed: colors.darkGray,
};

function formatDealType(type: Deal['type']): string {
  return type === 'spv' ? 'SPV' : 'Fund';
}

function formatStatusLabel(status: DealStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/deals/${deal.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${deal.name}`}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={2}>
          {deal.name}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: STATUS_COLORS[deal.status] },
          ]}>
          <Text style={styles.badgeText}>{formatStatusLabel(deal.status)}</Text>
        </View>
      </View>

      <Text style={styles.entity}>{deal.entity_name}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{formatDealType(deal.type)}</Text>
        <Text style={styles.metaText}>{formatDate(deal.closing_date)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          Raised {formatCurrency(deal.stats.total_raised_subscribed)}
        </Text>
        <Text style={styles.metaText}>
          {deal.stats.investor_count} Investors
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.minimumLabel}>Minimum</Text>
        <Text style={styles.minimumValue}>
          {formatCurrency(deal.minimum_investment)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
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
  entity: {
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.black,
  },
  bottomRow: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  minimumLabel: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  minimumValue: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.black,
  },
});
