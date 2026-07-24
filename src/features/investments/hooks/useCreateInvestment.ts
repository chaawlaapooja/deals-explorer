import { useMutation } from '@tanstack/react-query';

import type { Identity } from '@/src/features/investments/types/identity';
import type { Investment } from '@/src/features/investments/types/investment';
import { delay } from '@/src/utils/delay';

interface CreateInvestmentInput {
  readonly dealId: string;
  readonly identity: Identity;
  readonly amount: number;
}

async function createInvestment(
  input: CreateInvestmentInput,
): Promise<Investment> {
  await delay(400);

  return {
    id: `inv-${Date.now()}`,
    deal_id: input.dealId,
    identity: input.identity,
    subscription_amount: input.amount,
    net_investment: input.amount,
    status: 'pending',
  };
}

export function useCreateInvestment() {
  return useMutation({
    mutationFn: createInvestment,
  });
}
