import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/src/lib/queryClient';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { MyInvestmentsProvider } from '@/src/providers/MyInvestmentsProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MyInvestmentsProvider>{children}</MyInvestmentsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
