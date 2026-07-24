import { FlashList } from '@shopify/flash-list';
import { Redirect, router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeals } from '@/src/features/deals/hooks/useDeals';
import type { Deal } from '@/src/features/deals/types/deal';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';

const ESTIMATED_ITEM_SIZE = 96;

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
              refetch();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <DealRow item={item} />}
      />
    </SafeAreaView>
  );
}

function DealRow({ item }: { readonly item: Deal }) {
  return (
    <Pressable
      style={styles.row}
      onPress={() => router.push(`/deals/${item.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.name}`}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.entity}>{item.entity_name}</Text>
      <Text style={styles.status}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
    </Pressable>
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
  row: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  entity: {
    fontSize: typography.sizes.md,
    color: colors.black,
  },
  status: {
    fontSize: typography.sizes.sm,
    color: colors.black,
    textTransform: 'capitalize',
  },
});
