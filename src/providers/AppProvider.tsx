import { type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  queryCacheMaxAge,
  queryClient,
  queryPersister,
} from '@/src/lib/queryClient';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { MyInvestmentsProvider } from '@/src/providers/MyInvestmentsProvider';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: queryCacheMaxAge,
          buster: 'deals-explorer-v1',
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              query.queryKey[0] === 'deals' &&
              query.state.status === 'success',
          },
        }}>
        <AuthProvider>
          <MyInvestmentsProvider>{children}</MyInvestmentsProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
