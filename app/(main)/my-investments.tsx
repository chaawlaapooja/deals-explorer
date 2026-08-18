import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/src/components/EmptyState';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { deals } from '@/src/features/deals/mocks/deals';
import type { Investment } from '@/src/features/investments/types/investment';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMyInvestments } from '@/src/providers/MyInvestmentsProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { capitalize } from '@/src/utils/capitalize';
import { formatCurrency } from '@/src/utils/formatCurrency';

function getDealName(dealId: string): string {
  return deals.find((deal) => deal.id === dealId)?.name ?? 'Unknown deal';
}

export default function MyInvestmentsScreen() {
  const { isAuthenticated } = useAuth();
  const { myInvestments } = useMyInvestments();

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ScreenContainer>
      {myInvestments.length === 0 ? (
        <EmptyState
          message="You haven't made any investments yet."
          actionLabel="Explore available deals"
          onAction={() => router.replace('/deals')}
          accessibilityLabel="Explore available deals"
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>My Investments</Text>
          <Text style={styles.subtitle}>
            {myInvestments.length}{' '}
            {myInvestments.length === 1 ? 'investment' : 'investments'} this
            session
          </Text>

          <View style={styles.list}>
            {myInvestments.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

function InvestmentCard({
  investment,
}: {
  readonly investment: Investment;
}) {
  const dealName = getDealName(investment.deal_id);

  return (
    <View
      style={styles.card}
      accessibilityLabel={`${dealName}, ${formatCurrency(investment.subscription_amount)}`}>
      <Text style={styles.dealName}>{dealName}</Text>
      <Text style={styles.identity}>{investment.identity.legal_name}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>
          {formatCurrency(investment.subscription_amount)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{capitalize(investment.status)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dealName: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  identity: {
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  amount: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.black,
  },
  status: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.brand,
  },
});
