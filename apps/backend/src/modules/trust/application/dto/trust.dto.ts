import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class TrustDto {
  id!: string;
  identityId!: string;
  score!: number;
  level!: TrustLevel;
  status!: TrustStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
