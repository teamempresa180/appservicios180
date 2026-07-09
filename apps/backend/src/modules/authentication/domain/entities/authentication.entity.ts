import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AuthenticationId } from '../value-objects/authentication-id.value-object';
import { AuthMethodType } from '../value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../value-objects/authentication-status.value-object';

export interface AuthenticationProps {
  identityId: IdentityId;
  methodType: AuthMethodType;
  status: AuthenticationStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the association between an Identity and a method it can use to
 * authenticate. Pure data holder — no login flow, no token issuance, no
 * password/secret storage, no persistence.
 */
export class Authentication extends Entity<AuthenticationId> {
  public readonly identityId: IdentityId;
  public readonly methodType: AuthMethodType;
  public readonly status: AuthenticationStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: AuthenticationId, props: AuthenticationProps) {
    super(id);
    this.identityId = props.identityId;
    this.methodType = props.methodType;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
