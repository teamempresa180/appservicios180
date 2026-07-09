import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * Input shape for updating an Identity. No validation.
 */
export class UpdateIdentityDto {
  fullName?: string;
  status?: IdentityStatus;
}
