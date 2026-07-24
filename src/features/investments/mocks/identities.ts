import type { Identity } from '@/src/features/investments/types/identity';

export const identities: readonly Identity[] = [
  {
    legal_name: 'Sarah Chen',
    type: 'individual',
    country: 'United States',
  },
  {
    legal_name: 'Ashford Family Office',
    type: 'entity',
    country: 'United Kingdom',
  },
  {
    legal_name: 'Northbridge Capital LLC',
    type: 'entity',
    country: 'Singapore',
  },
] as const;
