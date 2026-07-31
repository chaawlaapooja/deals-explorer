import { EmptyState } from '@/src/components/EmptyState';
import { ErrorState } from '@/src/components/ErrorState';
import { LoadingState } from '@/src/components/LoadingState';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { DealCard } from '@/src/features/deals/components/DealCard';
import { useDeals } from '@/src/features/deals/hooks/useDeals';
import {
  filterDeals,
  type StatusFilter,
} from '@/src/features/deals/utils/filterDeals';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const STATUS_CHIPS: readonly {
  readonly label: string;
  readonly value: StatusFilter;
}[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Active', value: 'active' },
    { label: 'Closed', value: 'closed' },
  ];

const DETAIL_EDGES = undefined;

export default function DealsScreen() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError, refetch, isRefetching } = useDeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredDeals = useMemo(
    () => filterDeals(data ?? [], searchQuery, statusFilter),
    [data, searchQuery, statusFilter],
  );

  const totalRaised = useMemo(
    () =>
      (data ?? []).reduce(
        (sum, deal) => sum + deal.stats.total_raised_subscribed,
        0,
      ),
    [data],
  );

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  if (isPending) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading deals..." />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState
          message="Unable to load deals."
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState message="No deals available." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={DETAIL_EDGES}>
      <ListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <FlashList
        data={filteredDeals}
        ListHeaderComponent={
          <SummaryHeader dealCount={data.length} totalRaised={totalRaised} />
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState message="No deals match your filters." muted />
        }
        renderItem={({ item }) => <DealCard deal={item} />}
      />
    </ScreenContainer>
  );
}

function ListHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
  readonly statusFilter: StatusFilter;
  readonly onStatusChange: (value: StatusFilter) => void;
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
        returnKeyType="search"
        submitBehavior="submit"
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
  listContent: {
    padding: spacing.lg,
  },
  header: {
    gap: spacing.md,
    marginHorizontal: spacing.xl,
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
    marginHorizontal: spacing.sm
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
