import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';

export default function SuccessScreen() {
  const { isAuthenticated } = useAuth();

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
          Your investment request has been successfully submitted. You can
          continue browsing available deals.
        </Text>

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
