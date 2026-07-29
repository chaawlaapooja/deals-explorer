import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme';

const DOCUMENTS = [
    'Subscription Agreement.pdf',
    'Private Placement Memorandum.pdf',
    'Investor Presentation.pdf',
] as const;

export function DealDocumentsTab() {
    return (
        <View style={styles.container}>
            {DOCUMENTS.map((document) => (
                <View key={document} style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color={colors.brand}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.fileName}>{document}</Text>
                        <Text style={styles.fileType}>PDF Document</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.white,
    },

    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.brand + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        flex: 1,
        gap: spacing.xs,
    },

    fileName: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.black,
    },

    fileType: {
        fontSize: typography.sizes.sm,
        color: colors.muted,
    },
});