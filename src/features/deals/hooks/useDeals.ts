import { useQuery } from '@tanstack/react-query';

import { deals } from '@/src/features/deals/mocks/deals';
import type { Deal } from '@/src/features/deals/types/deal';
import { delay } from '@/src/utils/delay';

async function fetchDeals(): Promise<readonly Deal[]> {
  await delay(400);
  return deals;
}

export function useDeals() {
  return useQuery({
    queryKey: dealKeys.all,
    queryFn: fetchDeals,
  });
}

export const dealKeys = {
  all: ['deals'] as const,
  detail: (id: string) => ['deals', id] as const,
};