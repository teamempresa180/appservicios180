import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * Input shape for updating a Credential record. No validation.
 */
export class UpdateCredentialDto {
  status?: CredentialStatus;
}
