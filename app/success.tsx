import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

export default function SuccessScreen() {
  const { isAuthenticated } = useAuth();

  const { dealName, identityName, amount } =
    useLocalSearchParams<{
      dealName?: string;
      identityName?: string;
      amount?: string;
    }>();

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon} accessibilityLabel="Success">
            ✓
          </Text>
        </View>

        <Text style={styles.title}>Investment Submitted</Text>
        <Text style={styles.description}>
          Your investment request has been successfully submitted.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deal</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {dealName ?? '-'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Identity</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {identityName ?? '-'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Investment</Text>
            <Text style={styles.amountValue}>
              {amount ? formatCurrency(Number(amount)) : '-'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={styles.statusValue}>Submitted</Text>
          </View>
        </View>

        <Text style={styles.note}>
          Your investment request has been recorded successfully.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace('/deals')}
          accessibilityRole="button"
          accessibilityLabel="Back to Deals">
          <Text style={styles.buttonText}>Continue to Deals</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    color: colors.white,
    fontSize: typography.sizes.xl,
    fontWeight: '700',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  summaryCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },

  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    flexShrink: 0,
  },

  summaryValue: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'right',
  },

  amountValue: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  statusValue: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.brand,
  },

  note: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});
