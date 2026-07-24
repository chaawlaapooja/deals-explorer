import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DealCard } from '@/src/features/deals/components/DealCard';
import { useDeals } from '@/src/features/deals/hooks/useDeals';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

export default function DealsScreen() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError, refetch } = useDeals();

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.message}>Loading deals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.message}>Unable to load deals.</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              void refetch();
            }}
            accessibilityRole="button"
            accessibilityLabel="Retry">
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.message}>No deals available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalRaised = data.reduce(
    (sum, deal) => sum + deal.stats.total_raised_subscribed,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <SummaryHeader dealCount={data.length} totalRaised={totalRaised} />
        }
        renderItem={({ item }) => <DealCard deal={item} />}
      />
    </SafeAreaView>
  );
}

function SummaryHeader({
  dealCount,
  totalRaised,
}: {
  readonly dealCount: number;
  readonly totalRaised: number;
}) {
  return (
    <View style={styles.summary}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Deals</Text>
        <Text style={styles.summaryValue}>{dealCount}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Raised</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalRaised)}</Text>
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
  message: {
    fontSize: typography.sizes.md,
    color: colors.black,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
  },
  summary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryItem: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
});
