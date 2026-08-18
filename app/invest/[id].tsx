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

import { EmptyState } from '@/src/components/EmptyState';
import { ErrorState } from '@/src/components/ErrorState';
import { LoadingState } from '@/src/components/LoadingState';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { useDealById } from '@/src/features/deals/hooks/useDealById';
import type { Deal } from '@/src/features/deals/types/deal';
import { formatDealType } from '@/src/features/deals/utils/formatDealType';
import { useCreateInvestment } from '@/src/features/investments/hooks/useCreateInvestment';
import { identities } from '@/src/features/investments/mocks/identities';
import type { Identity } from '@/src/features/investments/types/identity';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMyInvestments } from '@/src/providers/MyInvestmentsProvider';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatDate } from '@/src/utils/formatDate';

const DETAIL_EDGES = ['bottom', 'left', 'right'] as const;

function parseAmount(value: string): number {
  return Number(value.replace(/,/g, ''));
}

function formatAmountInput(value: string): string {
  const digits = value.replace(/[^\d]/g, '');

  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString('en-US');
}

function SummaryRow({
  label,
  value,
  error = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly error?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, error && styles.summaryError]}>
        {value}
      </Text>
    </View>
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

  const amount = parseAmount(trimmed);

  if (Number.isNaN(amount)) {
    return 'Enter a valid amount.';
  }

  if (amount <= 0) {
    return 'Amount must be greater than zero.';
  }

  if (amount < minimumInvestment) {
    return `Minimum investment is ${formatCurrency(minimumInvestment)}.`;
  }

  return null;
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
      <ScreenContainer edges={DETAIL_EDGES}>
        <LoadingState message="Loading deal..." />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer edges={DETAIL_EDGES}>
        <ErrorState
          message="Unable to load deal."
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenContainer>
    );
  }

  if (!deal) {
    return (
      <ScreenContainer edges={DETAIL_EDGES}>
        <EmptyState
          message="Deal not found."
          actionLabel="Back to Deals"
          onAction={() => router.replace('/deals')}
          accessibilityLabel="Back to Deals"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={DETAIL_EDGES}>
      <InvestForm deal={deal} />
    </ScreenContainer>
  );
}

function InvestForm({ deal }: { readonly deal: Deal }) {
  const createInvestment = useCreateInvestment();
  const { addMyInvestment } = useMyInvestments();
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(
    null,
  );
  const [amountText, setAmountText] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isSubmitting = createInvestment.isPending;
  const validationMessage = getAmountValidationMessage(
    amountText,
    deal.minimum_investment,
  );
  const isAmountValid = validationMessage === null;
  const canContinue =
    selectedIdentity !== null && isAmountValid && acceptedTerms && !isSubmitting;

  const handleContinue = () => {
    if (isSubmitting || !selectedIdentity || !acceptedTerms || !isAmountValid) {
      return;
    }

    createInvestment.mutate(
      {
        dealId: deal.id,
        identity: selectedIdentity,
        amount: parseAmount(amountText),
      },
      {
        onSuccess: (investment) => {
          addMyInvestment(investment);
          router.replace({
            pathname: '/success',
            params: {
              dealName: deal.name,
              identityName: selectedIdentity.legal_name,
              amount: amountText.replace(/,/g, ''),
            },
          });
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
            onChangeText={(value) => {
              setAmountText(formatAmountInput(value));
            }}
            placeholder={`Minimum ${formatCurrency(deal.minimum_investment)}`}
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
              label="Investment"
              value={
                amountText
                  ? formatCurrency(parseAmount(amountText))
                  : '-'
              }
            />

            <SummaryRow
              label="Minimum"
              value={formatCurrency(deal.minimum_investment)}
            />

            <SummaryRow
              label="Status"
              value={validationMessage ?? '✓ Ready to invest'}
              error={!!validationMessage}
            />
          </View>
        </View>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms((previous) => !previous)}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: acceptedTerms,
          }}>
          <View
            style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Text style={styles.checkboxTick}>✓</Text>}
          </View>

          <Text style={styles.checkboxLabel}>
            I agree to the investment terms and subscription documents.
          </Text>
        </Pressable>

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
                ? `Invest ${formatCurrency(parseAmount(amountText))}`
                : 'Continue'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
    backgroundColor: colors.brandSoft,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  checkboxTick: {
    color: colors.white,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    color: colors.black,
    fontSize: typography.sizes.sm,
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
