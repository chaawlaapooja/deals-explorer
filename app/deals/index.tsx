import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DealCard } from '@/src/features/deals/components/DealCard';
import { useDeals } from '@/src/features/deals/hooks/useDeals';
import {
  filterDeals,
  type StatusFilter,
} from '@/src/features/deals/utils/filterDeals';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

const STATUS_CHIPS: readonly { readonly label: string; readonly value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
];

export default function DealsScreen() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError, refetch, isRefetching } = useDeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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

  const filteredDeals = filterDeals(data, searchQuery, statusFilter);

  const totalRaised = filteredDeals.reduce(
    (sum, deal) => sum + deal.stats.total_raised_subscribed,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlashList
        data={[...filteredDeals]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={() => {
          void refetch();
        }}
        ListHeaderComponent={
          <ListHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            dealCount={filteredDeals.length}
            totalRaised={totalRaised}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptySearch}>No deals match your filters.</Text>
        }
        renderItem={({ item }) => <DealCard deal={item} />}
      />
    </SafeAreaView>
  );
}

function ListHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dealCount,
  totalRaised,
}: {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
  readonly statusFilter: StatusFilter;
  readonly onStatusChange: (value: StatusFilter) => void;
  readonly dealCount: number;
  readonly totalRaised: number;
}) {
  return (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search deals"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search deals"
        accessibilityRole="search"
      />

      <View style={styles.chips}>
        {STATUS_CHIPS.map((chip) => {
          const isSelected = statusFilter === chip.value;

          return (
            <Pressable
              key={chip.value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onStatusChange(chip.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter ${chip.label}`}>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SummaryHeader dealCount={dealCount} totalRaised={totalRaised} />
    </View>
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
  emptySearch: {
    fontSize: typography.sizes.md,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
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
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontSize: typography.sizes.md,
    color: colors.black,
    backgroundColor: colors.white,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.muted,
  },
  chipTextSelected: {
    color: colors.white,
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
