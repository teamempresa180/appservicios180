import { VerificationType } from '../../domain/value-objects/verification-type.value-object';

/**
 * Input shape for creating a Verification. No validation.
 */
export class CreateVerificationDto {
  identityId!: string;
  type!: VerificationType;
}
