import type { DealType } from '@/src/features/deals/types/deal';

export function formatDealType(type: DealType): string {
  return type === 'spv' ? 'SPV' : 'Fund';
}
