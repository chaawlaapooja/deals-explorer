import { Redirect, router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBadge } from '@/src/features/deals/components/StatusBadge';
import { useDealById } from '@/src/features/deals/hooks/useDealById';
import type { Deal } from '@/src/features/deals/types/deal';
import { formatDealType } from '@/src/features/deals/utils/formatDealType';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatDate } from '@/src/utils/formatDate';

export default function DealDetailScreen() {
  const { isAuthenticated } = useAuth();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = typeof idParam === 'string' ? idParam : '';
  const { data: deal, isPending, isError, refetch } = useDealById(id);

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.message}>Loading deal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.message}>Unable to load deal.</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              void refetch();
            }}
            accessibilityRole="button"
            accessibilityLabel="Retry">
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!deal) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.message}>Deal not found.</Text>
          <Pressable
            style={styles.button}
            onPress={() => router.replace('/deals')}
            accessibilityRole="button"
            accessibilityLabel="Back to Deals">
            <Text style={styles.buttonText}>Back to Deals</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <DealDetailContent deal={deal} />
    </SafeAreaView>
  );
}

function DealDetailContent({ deal }: { readonly deal: Deal }) {
  const overviewRows = [
    {
      label: 'Minimum Investment',
      value: formatCurrency(deal.minimum_investment),
    },
    {
      label: 'Management Fee',
      value: `${deal.management_fee_percent}%`,
    },
    {
      label: 'Carry',
      value: `${deal.total_carry}%`,
    },
  ];

  const fundraisingRows = [
    {
      label: 'Total Raised (Subscribed)',
      value: formatCurrency(deal.stats.total_raised_subscribed),
    },
    {
      label: 'Total Raised (Wired)',
      value: formatCurrency(deal.stats.total_raised_wired),
    },
    {
      label: 'Investor Count',
      value: String(deal.stats.investor_count),
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{deal.name}</Text>
          <StatusBadge status={deal.status} />
        </View>
        <Text style={styles.entity}>{deal.entity_name}</Text>
        <Text style={styles.meta}>{formatDealType(deal.type)}</Text>
        <Text style={styles.meta}>{formatDate(deal.closing_date)}</Text>
      </View>

      <DetailSection title="Deal Overview" rows={overviewRows} />
      <DetailSection title="Fundraising" rows={fundraisingRows} />

      <Pressable
        style={styles.investButton}
        onPress={() => router.push(`/invest/${deal.id}`)}
        accessibilityRole="button"
        accessibilityLabel="Invest Now">
        <Text style={styles.buttonText}>Invest Now</Text>
      </Pressable>
    </ScrollView>
  );
}

function DetailSection({
  title,
  rows,
}: {
  readonly title: string;
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.row,
              index === rows.length - 1 && styles.rowLast,
            ]}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
  entity: {
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  meta: {
    fontSize: typography.sizes.md,
    color: colors.black,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  sectionBody: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
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
  rowLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  rowValue: {
    flexShrink: 0,
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'right',
  },
  message: {
    fontSize: typography.sizes.md,
    color: colors.black,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radius.md,
  },
  investButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});
