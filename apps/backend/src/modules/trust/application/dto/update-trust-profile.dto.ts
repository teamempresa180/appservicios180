import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * Input shape for updating a Trust profile. No validation.
 */
export class UpdateTrustProfileDto {
  score?: number;
  level?: TrustLevel;
  status?: TrustStatus;
}
