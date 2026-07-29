import { StyleSheet, Text, View } from 'react-native';

import type { Deal } from '@/src/features/deals/types/deal';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

interface DealOverviewTabProps {
    readonly deal: Deal;
}

export function DealOverviewTab({
    deal,
}: DealOverviewTabProps) {
    const overviewRows = [
        {
            label: 'Minimum Investment',
            value: formatCurrency(deal.minimum_investment),
        },
        {
            label: 'Management Fee',
            value: `${deal.management_fee_percent}%`,
        },
        {
            label: 'Carry',
            value: `${deal.total_carry}%`,
        },
    ];

    const fundraisingRows = [
        {
            label: 'Total Raised (Subscribed)',
            value: formatCurrency(deal.stats.total_raised_subscribed),
        },
        {
            label: 'Total Raised (Wired)',
            value: formatCurrency(deal.stats.total_raised_wired),
        },
        {
            label: 'Investor Count',
            value: String(deal.stats.investor_count),
        },
    ];

    return (
        <View style={styles.container}>
            <DetailSection
                title="Deal Overview"
                rows={overviewRows}
            />

            <DetailSection
                title="Fundraising"
                rows={fundraisingRows}
            />
        </View>
    );
}

interface DetailSectionProps {
    readonly title: string;
    readonly rows: readonly {
        readonly label: string;
        readonly value: string;
    }[];
}

function DetailSection({
    title,
    rows,
}: DetailSectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <View style={styles.sectionBody}>
                {rows.map((row, index) => (
                    <View
                        key={row.label}
                        style={[
                            styles.row,
                            index === rows.length - 1 && styles.lastRow,
                        ]}>
                        <Text style={styles.label}>
                            {row.label}
                        </Text>

                        <Text style={styles.value}>
                            {row.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,
    },

    section: {
        gap: spacing.md,
    },

    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
        color: colors.black,
    },

    sectionBody: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    lastRow: {
        borderBottomWidth: 0,
    },

    label: {
        flex: 1,
        fontSize: typography.sizes.md,
        color: colors.muted,
    },

    value: {
        flexShrink: 0,
        textAlign: 'right',
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.black,
    },
});