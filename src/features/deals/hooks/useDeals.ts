import { useQuery } from '@tanstack/react-query';

import { deals } from '@/src/features/deals/mocks/deals';
import type { Deal } from '@/src/features/deals/types/deal';
import { delay } from '@/src/utils/delay';
import { shuffle } from '@/src/utils/shuffle';

export const dealKeys = {
  all: ['deals'] as const,
  detail: (id: string) => ['deals', id] as const,
};

async function fetchDeals(): Promise<readonly Deal[]> {
  await delay(400);
  return shuffle(deals);
}

export function useDeals() {
  return useQuery({
    queryKey: dealKeys.all,
    queryFn: fetchDeals,
  });
}
