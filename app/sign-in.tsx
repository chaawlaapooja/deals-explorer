import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AuthUser } from '@/src/features/auth/types';
import { useAuth } from '@/src/providers/AuthProvider';
import { colors, radius, spacing, typography } from '@/src/theme';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createUserId(): string {
  // if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
  //   return crypto.randomUUID();
  // }

  return `user-${Date.now()}`;
}

function deriveFirstName(email: string): string {
  const prefix = email.split('@')[0] ?? '';
  const firstPart = prefix.split('.')[0] ?? '';

  if (!firstPart) {
    return '';
  }

  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
}

export default function SignInScreen() {
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/deals" />;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const canContinue =
    normalizedEmail.length > 0 && isValidEmail(normalizedEmail);

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    const user: AuthUser = {
      id: createUserId(),
      email: normalizedEmail,
      first_name: deriveFirstName(normalizedEmail),
      last_name: '',
    };

    signIn(user);
    router.replace('/deals');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.description}>
              Enter your email to continue to Mini Deals Explorer.
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />

            <Pressable
              style={[styles.button, !canContinue && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!canContinue}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              accessibilityState={{ disabled: !canContinue }}>
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.black,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontSize: typography.sizes.md,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
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
