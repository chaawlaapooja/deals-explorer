export type IdentityType = 'individual' | 'entity';

export interface Identity {
  readonly legal_name: string;
  readonly type: IdentityType;
  readonly country: string;
}
