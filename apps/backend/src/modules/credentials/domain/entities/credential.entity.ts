import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { CredentialId } from '../value-objects/credential-id.value-object';
import { CredentialType } from '../value-objects/credential-type.value-object';
import { CredentialStatus } from '../value-objects/credential-status.value-object';

export interface CredentialProps {
  identityId: IdentityId;
  type: CredentialType;
  status: CredentialStatus;
  createdAt: Date;
  updatedAt: Date;
  /**
   * Hashed password material — only ever set (and only ever
   * meaningful) when `type === CredentialType.Password`. Never the
   * plaintext password. Optional so every existing call site that
   * predates password support keeps working unchanged; defaults to
   * `null`.
   */
  passwordHash?: string | null;
}

/**
 * Represents that a credential record of a given type exists for an Identity.
 * Pure data holder — never stores the actual secret, hash, or key material
 * in plaintext; no persistence, no business rules (hashing/verification
 * lives in the Application/Infrastructure layers, see `PasswordHasher`).
 */
export class Credential extends Entity<CredentialId> {
  public readonly identityId: IdentityId;
  public readonly type: CredentialType;
  public readonly status: CredentialStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly passwordHash: string | null;

  constructor(id: CredentialId, props: CredentialProps) {
    super(id);
    this.identityId = props.identityId;
    this.type = props.type;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.passwordHash = props.passwordHash ?? null;
  }
}
