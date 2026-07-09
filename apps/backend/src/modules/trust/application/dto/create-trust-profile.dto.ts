import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';

/**
 * Input shape for creating a Trust profile. No validation.
 */
export class CreateTrustProfileDto {
  identityId!: string;
  score!: number;
  level!: TrustLevel;
}
