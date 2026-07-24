import { useQuery } from '@tanstack/react-query';

import { deals } from '@/src/features/deals/mocks/deals';
import type { Deal } from '@/src/features/deals/types/deal';
import { delay } from '@/src/utils/delay';
import { dealKeys } from './useDeals';

async function fetchDealById(id: string): Promise<Deal | undefined> {
  await delay(400);
  return deals.find((deal) => deal.id === id);
}

export function useDealById(id: string) {
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: () => fetchDealById(id),
    enabled: Boolean(id),
  });
}
