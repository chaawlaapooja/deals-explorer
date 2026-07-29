import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDealById } from '@/src/features/deals/hooks/useDealById';
import type { Deal } from '@/src/features/deals/types/deal';
import { formatDealType } from '@/src/features/deals/utils/formatDealType';
import { useCreateInvestment } from '@/src/features/investments/hooks/useCreateInvestment';
import { identities } from '@/src/features/investments/mocks/identities';
import type { Identity } from '@/src/features/investments/types/identity';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatDate } from '@/src/utils/formatDate';

function SummaryRow({
  label,
  value,
  error = false,
}: {
  label: string;
  value: string;
  error?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>

      <Text
        style={[
          styles.summaryValue,
          error && styles.summaryError,
        ]}>
        {value}
      </Text>
    </View>
  );
}

export default function InvestScreen() {
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
      <InvestForm deal={deal} />
    </SafeAreaView>
  );
}

function getAmountValidationMessage(
  amountText: string,
  minimumInvestment: number,
): string | null {
  const trimmed = amountText.trim();

  if (trimmed.length === 0) {
    return 'Amount is required.';
  }

  const amount = Number(trimmed);

  if (Number.isNaN(amount)) {
    return 'Enter a valid amount.';
  }

  if (amount < minimumInvestment) {
    return `Minimum investment is ${formatCurrency(minimumInvestment)}.`;
  }

  return null;
}

function InvestForm({ deal }: { readonly deal: Deal }) {
  const createInvestment = useCreateInvestment();
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(
    null,
  );
  const [amountText, setAmountText] = useState('');

  const isSubmitting = createInvestment.isPending;
  const validationMessage = getAmountValidationMessage(
    amountText,
    deal.minimum_investment,
  );
  const isAmountValid = validationMessage === null;
  const canContinue =
    selectedIdentity !== null && isAmountValid && !isSubmitting;

  const handleContinue = () => {
    if (!selectedIdentity || !isAmountValid) {
      return;
    }

    createInvestment.mutate(
      {
        dealId: deal.id,
        identity: selectedIdentity,
        amount: Number(amountText.trim()),
      },
      {
        onSuccess: () => {
          router.replace('/success');
        },
      },
    );
  };


  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dealName}>{deal.name}</Text>
          <Text style={styles.entity}>{deal.entity_name}</Text>
          <Text style={styles.meta}>{formatDealType(deal.type)}</Text>
          <Text style={styles.meta}>{formatDate(deal.closing_date)}</Text>
          <Text style={styles.minimumLabel}>Minimum investment</Text>
          <Text style={styles.minimumValue}>
            {formatCurrency(deal.minimum_investment)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Identity</Text>
          <View style={styles.identityList}>
            {identities.map((identity) => {
              const isSelected =
                selectedIdentity?.legal_name === identity.legal_name;

              return (
                <Pressable
                  key={identity.legal_name}
                  style={[
                    styles.identityItem,
                    isSelected && styles.identityItemSelected,
                  ]}
                  onPress={() => setSelectedIdentity(identity)}
                  disabled={isSubmitting}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={identity.legal_name}>
                  <View style={styles.identityHeader}>
                    <Text
                      style={[
                        styles.identityCheck,
                        isSelected && styles.identityCheckSelected,
                      ]}>
                      {isSelected ? '✓' : '○'}
                    </Text>

                    <Text
                      style={[
                        styles.identityName,
                        isSelected && styles.identityNameSelected,
                      ]}>
                      {identity.legal_name}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.identityMeta,
                      isSelected && styles.identityMetaSelected,
                    ]}>
                    {identity.type} • {identity.country}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment amount</Text>
          <TextInput
            style={[styles.input, isSubmitting && styles.inputDisabled]}
            value={amountText}
            onChangeText={setAmountText}
            placeholder="Enter amount"
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            editable={!isSubmitting}
            accessibilityLabel="Investment amount"
          />
          {amountText.trim().length > 0 && validationMessage ? (
            <Text style={styles.validation}>{validationMessage}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Summary</Text>

          <View style={styles.summaryCard}>
            <SummaryRow
              label="Identity"
              value={selectedIdentity?.legal_name ?? '-'}
            />

            <SummaryRow
              label="Amount"
              value={
                amountText
                  ? formatCurrency(Number(amountText))
                  : '-'
              }
            />

            <SummaryRow
              label="Minimum"
              value={formatCurrency(deal.minimum_investment)}
            />

            <SummaryRow
              label="Status"
              value={
                validationMessage
                  ? validationMessage
                  : '✓ Ready to invest'
              }
              error={!!validationMessage}
            />
          </View>
        </View>

        <Pressable
          style={[styles.continueButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !canContinue }}>
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {amountText.trim()
                ? `Invest ${formatCurrency(Number(amountText))}`
                : 'Continue'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
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
  dealName: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  entity: {
    fontSize: typography.sizes.md,
    color: colors.muted,
  },
  meta: {
    fontSize: typography.sizes.md,
    color: colors.black,
  },
  minimumLabel: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  minimumValue: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  identityList: {
    gap: spacing.sm,
  },
  identityItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.white,
  },
  identityItemSelected: {
    borderWidth: 2,
    borderColor: colors.brand,
    backgroundColor: '#F5F9FF',
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  identityCheck: {
    marginRight: spacing.sm,
    color: colors.muted,
    fontSize: typography.sizes.md,
  },

  identityCheckSelected: {
    color: colors.brand,
  },
  identityName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.black,
  },
  identityNameSelected: {
    color: colors.brand,
  },
  identityMeta: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    textTransform: 'capitalize',
  },
  identityMetaSelected: {
    color: colors.brand,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    color: colors.muted,
    fontSize: typography.sizes.sm,
  },

  summaryValue: {
    fontWeight: '600',
    color: colors.black,
  },

  summaryError: {
    color: colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontSize: typography.sizes.md,
    color: colors.black,
    backgroundColor: colors.white,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  validation: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    fontWeight: '500',
    marginTop: spacing.xs,
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
  continueButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});
