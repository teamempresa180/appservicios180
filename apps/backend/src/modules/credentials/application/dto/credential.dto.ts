import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class CredentialDto {
  id!: string;
  identityId!: string;
  type!: CredentialType;
  status!: CredentialStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
