import type { Identity } from '@/src/features/investments/types/identity';

export type InvestmentStatus = 'pending' | 'signed' | 'wired';

export interface Investment {
  readonly id: string;
  readonly deal_id: string;
  readonly identity: Identity;
  readonly subscription_amount: number;
  readonly net_investment: number;
  readonly status: InvestmentStatus;
}
