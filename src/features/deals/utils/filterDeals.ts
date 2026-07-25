import type { Deal, DealStatus } from '@/src/features/deals/types/deal';

export type StatusFilter = 'all' | DealStatus;

export function filterDeals(
  deals: readonly Deal[],
  searchQuery: string,
  statusFilter: StatusFilter,
): readonly Deal[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return deals.filter((deal) => {
    const matchesStatus =
      statusFilter === 'all' || deal.status === statusFilter;

    const matchesSearch =
      normalizedQuery.length === 0 ||
      deal.name.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });
}
