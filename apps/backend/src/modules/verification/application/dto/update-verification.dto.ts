import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * Input shape for updating a Verification. No validation.
 */
export class UpdateVerificationDto {
  status?: VerificationStatus;
  verifiedAt?: Date;
}
