import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { VerificationId } from '../value-objects/verification-id.value-object';
import { VerificationType } from '../value-objects/verification-type.value-object';
import { VerificationStatus } from '../value-objects/verification-status.value-object';

export interface VerificationProps {
  identityId: IdentityId;
  type: VerificationType;
  status: VerificationStatus;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a verification record (e.g. document, facial, address) tied to
 * an Identity. Pure data holder — no behavior, no persistence, no business rules.
 */
export class Verification extends Entity<VerificationId> {
  public readonly identityId: IdentityId;
  public readonly type: VerificationType;
  public readonly status: VerificationStatus;
  public readonly verifiedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: VerificationId, props: VerificationProps) {
    super(id);
    this.identityId = props.identityId;
    this.type = props.type;
    this.status = props.status;
    this.verifiedAt = props.verifiedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
