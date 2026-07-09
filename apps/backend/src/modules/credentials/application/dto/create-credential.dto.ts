import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * Input shape for creating a Credential record. No validation.
 */
export class CreateCredentialDto {
  identityId!: string;
  type!: CredentialType;
}
