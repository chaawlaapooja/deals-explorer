import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DealDocumentsTab } from '@/src/features/deals/components/DealDocumentsTab';
import { DealInvestorsTab } from '@/src/features/deals/components/DealInvestorsTab';
import { DealOverviewTab } from '@/src/features/deals/components/DealOverviewTab';
import {
  DealTabs,
  type DealDetailTab,
} from '@/src/features/deals/components/DealTabs';
import { StatusBadge } from '@/src/features/deals/components/StatusBadge';
import { useDealById } from '@/src/features/deals/hooks/useDealById';
import type { Deal } from '@/src/features/deals/types/deal';
import { formatDealType } from '@/src/features/deals/utils/formatDealType';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
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
      <CenteredState>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.message}>Loading deal...</Text>
      </CenteredState>
    );
  }

  if (isError) {
    return (
      <CenteredState>
        <Text style={styles.message}>Unable to load deal.</Text>

        <Pressable
          style={styles.actionButton}
          onPress={() => {
            void refetch();
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry">
          <Text style={styles.actionButtonText}>Retry</Text>
        </Pressable>
      </CenteredState>
    );
  }

  if (!deal) {
    return (
      <CenteredState>
        <Text style={styles.message}>Deal not found.</Text>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.replace('/deals')}
          accessibilityRole="button"
          accessibilityLabel="Back to Deals">
          <Text style={styles.actionButtonText}>Back to Deals</Text>
        </Pressable>
      </CenteredState>
    );
  }

  return <DealDetailContent deal={deal} />;
}

function DealDetailContent({ deal }: { readonly deal: Deal }) {
  const [selectedTab, setSelectedTab] =
    useState<DealDetailTab>('overview');

  const renderTab = () => {
    switch (selectedTab) {
      case 'overview':
        return <DealOverviewTab deal={deal} />;

      case 'investors':
        return <DealInvestorsTab dealId={deal.id} />;

      case 'documents':
        return <DealDocumentsTab />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{deal.name}</Text>

            <StatusBadge status={deal.status} />
          </View>

          <Text style={styles.entity}>{deal.entity_name}</Text>

          <Text style={styles.meta}>
            {formatDealType(deal.type)}
          </Text>

          <Text style={styles.meta}>
            Closes {formatDate(deal.closing_date)}
          </Text>
        </View>

        <DealTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

        {renderTab()}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.investButton}
          onPress={() => router.push(`/invest/${deal.id}`)}
          accessibilityRole="button"
          accessibilityLabel="Invest Now">
          <Text style={styles.investButtonText}>
            Invest Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function CenteredState({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.white,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
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

  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },

  investButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    minHeight: 52,
  },

  investButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },

  actionButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radius.md,
  },

  actionButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },

  message: {
    fontSize: typography.sizes.md,
    color: colors.black,
    textAlign: 'center',
  },
});