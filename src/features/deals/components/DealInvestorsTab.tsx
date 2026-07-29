import { StyleSheet, Text, View } from 'react-native';

import { investments } from '@/src/features/investments/mocks/investments';
import type { Investment } from '@/src/features/investments/types/investment';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

interface DealInvestorsTabProps {
    readonly dealId: string;
}

export function DealInvestorsTab({
    dealId,
}: DealInvestorsTabProps) {
    const dealInvestments = investments.filter(
        (investment) => investment.deal_id === dealId,
    );

    if (dealInvestments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No investors yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {dealInvestments.map((investment) => (
                <InvestorCard
                    key={investment.id}
                    investment={investment}
                />
            ))}
        </View>
    );
}

interface InvestorCardProps {
    readonly investment: Investment;
}

function InvestorCard({
    investment,
}: InvestorCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {investment.identity.legal_name}
                    </Text>

                    <Text style={styles.meta}>
                        {capitalize(investment.identity.type)} •{' '}
                        {investment.identity.country}
                    </Text>
                </View>

                <StatusBadge status={investment.status} />
            </View>

            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>
                    Subscription Amount
                </Text>

                <Text style={styles.amount}>
                    {formatCurrency(investment.subscription_amount)}
                </Text>
            </View>
        </View>
    );
}

function StatusBadge({
    status,
}: {
    readonly status: Investment['status'];
}) {
    return (
        <View
            style={[
                styles.badge,
                status === 'wired' && styles.badgeSuccess,
                status === 'signed' && styles.badgeWarning,
                status === 'pending' && styles.badgePending,
            ]}>
            <Text style={styles.badgeText}>
                {capitalize(status)}
            </Text>
        </View>
    );
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },

    emptyContainer: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },

    emptyText: {
        color: colors.muted,
        fontSize: typography.sizes.md,
    },

    card: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.white,
        padding: spacing.md,
        gap: spacing.md,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing.md,
    },

    info: {
        flex: 1,
        gap: spacing.xs,
    },

    name: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.black,
    },

    meta: {
        fontSize: typography.sizes.sm,
        color: colors.muted,
    },

    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    amountLabel: {
        fontSize: typography.sizes.sm,
        color: colors.muted,
    },

    amount: {
        fontSize: typography.sizes.md,
        fontWeight: '700',
        color: colors.black,
    },

    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.md,
    },

    badgePending: {
        backgroundColor: '#E5E7EB',
    },

    badgeWarning: {
        backgroundColor: '#FEF3C7',
    },

    badgeSuccess: {
        backgroundColor: '#DCFCE7',
    },

    badgeText: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        color: colors.black,
    },
});