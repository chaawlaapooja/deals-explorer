import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme';

export type DealDetailTab =
    | 'overview'
    | 'investors'
    | 'documents';

const TABS: readonly {
    readonly key: DealDetailTab;
    readonly label: string;
}[] = [
    {
        key: 'overview',
        label: 'Overview',
    },
    {
        key: 'investors',
        label: 'Investors',
    },
    {
        key: 'documents',
        label: 'Documents',
    },
] as const;

interface DealTabsProps {
    readonly selectedTab: DealDetailTab;
    readonly onTabChange: (tab: DealDetailTab) => void;
}

export function DealTabs({
    selectedTab,
    onTabChange,
}: DealTabsProps) {
    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isSelected = selectedTab === tab.key;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        style={[
                            styles.tab,
                            isSelected && styles.selectedTab,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={tab.label}
                        accessibilityState={{
                            selected: isSelected,
                        }}>
                        <Text
                            style={[
                                styles.tabText,
                                isSelected && styles.selectedTabText,
                            ]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginVertical: spacing.lg,
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
    },

    selectedTab: {
        backgroundColor: colors.brand,
        borderColor: colors.brand,
    },

    tabText: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        color: colors.muted,
    },

    selectedTabText: {
        color: colors.white,
    },
});