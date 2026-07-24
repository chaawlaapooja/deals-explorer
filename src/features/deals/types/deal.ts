export type DealType = 'spv' | 'fund'

export type DealStatus = 'draft' | 'active' | 'closed';

export interface DealStats {
  readonly total_raised_subscribed: number;
  readonly total_raised_wired: number;
  readonly investor_count: number;
}

export interface Deal {
  readonly id: string;
  readonly name: string;
  readonly entity_name: string;
  readonly logo_url?: string;
  readonly type: DealType;
  readonly status: DealStatus;
  readonly management_fee_percent: number;
  readonly total_carry: number;
  readonly minimum_investment: number;
  readonly closing_date: string;
  readonly created_at: string;
  readonly stats: DealStats;
}
