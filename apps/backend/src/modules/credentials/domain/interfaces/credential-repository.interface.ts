import { Credential } from '../entities/credential.entity';
import { CredentialId } from '../value-objects/credential-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Credential persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface CredentialRepository {
  findById(id: CredentialId): Promise<Credential | null>;
  findByIdentityId(identityId: IdentityId): Promise<Credential[]>;
  save(credential: Credential): Promise<void>;
}
