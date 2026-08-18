import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: ONE_DAY_IN_MS,
            retry: 1,
        },
    },
});

export const queryPersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'DEALS_EXPLORER_QUERY_CACHE',
    throttleTime: 1000,
});

export const queryCacheMaxAge = ONE_DAY_IN_MS;