import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/src/theme';

interface ScreenContainerProps {
  readonly children: ReactNode;
  readonly edges?: readonly Edge[];
}

export function ScreenContainer({ children, edges }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
