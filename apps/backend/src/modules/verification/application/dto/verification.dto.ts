import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class VerificationDto {
  id!: string;
  identityId!: string;
  type!: VerificationType;
  status!: VerificationStatus;
  verifiedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
