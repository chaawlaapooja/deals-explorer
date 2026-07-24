import { identities } from '@/src/features/investments/mocks/identities';
import type { Identity } from '@/src/features/investments/types/identity';
import type { Investment } from '@/src/features/investments/types/investment';

const [sarahChen, ashfordFamilyOffice, northbridgeCapital] = identities;

const pierpointHoldings: Identity = {
  legal_name: 'Pierpoint Holdings LLC',
  type: 'entity',
  country: 'United States',
};

const kensingtonFamilyOffice: Identity = {
  legal_name: 'Kensington Family Office',
  type: 'entity',
  country: 'Switzerland',
};

const jamesOkoro: Identity = {
  legal_name: 'James Okoro',
  type: 'individual',
  country: 'Nigeria',
};

const harborviewCapital: Identity = {
  legal_name: 'Harborview Capital LLC',
  type: 'entity',
  country: 'Canada',
};

export const investments: readonly Investment[] = [
  // deal-001 — Meridian Ventures Fund III (early fundraising)
  // subscribed: 8_500_000 | wired: 2_100_000 | investors: 4
  {
    id: 'inv-001',
    deal_id: 'deal-001',
    identity: ashfordFamilyOffice,
    subscription_amount: 2_100_000,
    net_investment: 2_100_000,
    status: 'wired',
  },
  {
    id: 'inv-002',
    deal_id: 'deal-001',
    identity: northbridgeCapital,
    subscription_amount: 3_000_000,
    net_investment: 3_000_000,
    status: 'signed',
  },
  {
    id: 'inv-003',
    deal_id: 'deal-001',
    identity: sarahChen,
    subscription_amount: 2_000_000,
    net_investment: 2_000_000,
    status: 'signed',
  },
  {
    id: 'inv-004',
    deal_id: 'deal-001',
    identity: pierpointHoldings,
    subscription_amount: 1_400_000,
    net_investment: 1_400_000,
    status: 'pending',
  },

  // deal-002 — Helix BioSciences (nearly full)
  // subscribed: 23_500_000 | wired: 18_000_000 | investors: 5
  {
    id: 'inv-005',
    deal_id: 'deal-002',
    identity: ashfordFamilyOffice,
    subscription_amount: 8_000_000,
    net_investment: 8_000_000,
    status: 'wired',
  },
  {
    id: 'inv-006',
    deal_id: 'deal-002',
    identity: northbridgeCapital,
    subscription_amount: 6_000_000,
    net_investment: 6_000_000,
    status: 'wired',
  },
  {
    id: 'inv-007',
    deal_id: 'deal-002',
    identity: kensingtonFamilyOffice,
    subscription_amount: 4_000_000,
    net_investment: 4_000_000,
    status: 'wired',
  },
  {
    id: 'inv-008',
    deal_id: 'deal-002',
    identity: sarahChen,
    subscription_amount: 3_500_000,
    net_investment: 3_500_000,
    status: 'signed',
  },
  {
    id: 'inv-009',
    deal_id: 'deal-002',
    identity: pierpointHoldings,
    subscription_amount: 2_000_000,
    net_investment: 2_000_000,
    status: 'signed',
  },

  // deal-003 — Atlas Industrial (oversubscribed)
  // subscribed: 48_000_000 | wired: 35_000_000 | investors: 5
  {
    id: 'inv-010',
    deal_id: 'deal-003',
    identity: ashfordFamilyOffice,
    subscription_amount: 15_000_000,
    net_investment: 15_000_000,
    status: 'wired',
  },
  {
    id: 'inv-011',
    deal_id: 'deal-003',
    identity: northbridgeCapital,
    subscription_amount: 12_000_000,
    net_investment: 12_000_000,
    status: 'wired',
  },
  {
    id: 'inv-012',
    deal_id: 'deal-003',
    identity: harborviewCapital,
    subscription_amount: 8_000_000,
    net_investment: 8_000_000,
    status: 'wired',
  },
  {
    id: 'inv-013',
    deal_id: 'deal-003',
    identity: kensingtonFamilyOffice,
    subscription_amount: 8_000_000,
    net_investment: 8_000_000,
    status: 'signed',
  },
  {
    id: 'inv-014',
    deal_id: 'deal-003',
    identity: pierpointHoldings,
    subscription_amount: 5_000_000,
    net_investment: 5_000_000,
    status: 'signed',
  },

  // deal-004 — Cascade PropTech
  // subscribed: 15_000_000 | wired: 9_000_000 | investors: 4
  {
    id: 'inv-015',
    deal_id: 'deal-004',
    identity: northbridgeCapital,
    subscription_amount: 5_000_000,
    net_investment: 5_000_000,
    status: 'wired',
  },
  {
    id: 'inv-016',
    deal_id: 'deal-004',
    identity: ashfordFamilyOffice,
    subscription_amount: 4_000_000,
    net_investment: 4_000_000,
    status: 'wired',
  },
  {
    id: 'inv-017',
    deal_id: 'deal-004',
    identity: sarahChen,
    subscription_amount: 3_500_000,
    net_investment: 3_500_000,
    status: 'signed',
  },
  {
    id: 'inv-018',
    deal_id: 'deal-004',
    identity: jamesOkoro,
    subscription_amount: 2_500_000,
    net_investment: 2_500_000,
    status: 'pending',
  },

  // deal-005 — Northstar Private Credit (closed)
  // subscribed: 75_000_000 | wired: 75_000_000 | investors: 5
  {
    id: 'inv-019',
    deal_id: 'deal-005',
    identity: ashfordFamilyOffice,
    subscription_amount: 25_000_000,
    net_investment: 25_000_000,
    status: 'wired',
  },
  {
    id: 'inv-020',
    deal_id: 'deal-005',
    identity: northbridgeCapital,
    subscription_amount: 20_000_000,
    net_investment: 20_000_000,
    status: 'wired',
  },
  {
    id: 'inv-021',
    deal_id: 'deal-005',
    identity: kensingtonFamilyOffice,
    subscription_amount: 15_000_000,
    net_investment: 15_000_000,
    status: 'wired',
  },
  {
    id: 'inv-022',
    deal_id: 'deal-005',
    identity: harborviewCapital,
    subscription_amount: 10_000_000,
    net_investment: 10_000_000,
    status: 'wired',
  },
  {
    id: 'inv-023',
    deal_id: 'deal-005',
    identity: pierpointHoldings,
    subscription_amount: 5_000_000,
    net_investment: 5_000_000,
    status: 'wired',
  },

  // deal-006 — Rivian Mobility Co-Invest (closed)
  // subscribed: 12_000_000 | wired: 12_000_000 | investors: 3
  {
    id: 'inv-024',
    deal_id: 'deal-006',
    identity: northbridgeCapital,
    subscription_amount: 6_000_000,
    net_investment: 6_000_000,
    status: 'wired',
  },
  {
    id: 'inv-025',
    deal_id: 'deal-006',
    identity: sarahChen,
    subscription_amount: 3_500_000,
    net_investment: 3_500_000,
    status: 'wired',
  },
  {
    id: 'inv-026',
    deal_id: 'deal-006',
    identity: jamesOkoro,
    subscription_amount: 2_500_000,
    net_investment: 2_500_000,
    status: 'wired',
  },

  // deal-007 — Apex Fintech Seed (draft)
  // subscribed: 1_200_000 | wired: 0 | investors: 3
  {
    id: 'inv-027',
    deal_id: 'deal-007',
    identity: sarahChen,
    subscription_amount: 500_000,
    net_investment: 500_000,
    status: 'pending',
  },
  {
    id: 'inv-028',
    deal_id: 'deal-007',
    identity: pierpointHoldings,
    subscription_amount: 400_000,
    net_investment: 400_000,
    status: 'pending',
  },
  {
    id: 'inv-029',
    deal_id: 'deal-007',
    identity: jamesOkoro,
    subscription_amount: 300_000,
    net_investment: 300_000,
    status: 'signed',
  },

  // deal-008 — Greenwood Climate Growth (draft)
  // subscribed: 2_500_000 | wired: 0 | investors: 3
  {
    id: 'inv-030',
    deal_id: 'deal-008',
    identity: ashfordFamilyOffice,
    subscription_amount: 1_000_000,
    net_investment: 1_000_000,
    status: 'pending',
  },
  {
    id: 'inv-031',
    deal_id: 'deal-008',
    identity: northbridgeCapital,
    subscription_amount: 1_000_000,
    net_investment: 1_000_000,
    status: 'pending',
  },
  {
    id: 'inv-032',
    deal_id: 'deal-008',
    identity: harborviewCapital,
    subscription_amount: 500_000,
    net_investment: 500_000,
    status: 'signed',
  },
] as const;
