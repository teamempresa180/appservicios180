import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { TrustId } from '../value-objects/trust-id.value-object';
import { TrustScore } from '../value-objects/trust-score.value-object';
import { TrustLevel } from '../value-objects/trust-level.value-object';
import { TrustStatus } from '../value-objects/trust-status.value-object';

export interface TrustProps {
  identityId: IdentityId;
  score: TrustScore;
  level: TrustLevel;
  status: TrustStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the trust/reputation record of a person. Pure data holder —
 * no scoring logic, no persistence, no business rules.
 */
export class Trust extends Entity<TrustId> {
  public readonly identityId: IdentityId;
  public readonly score: TrustScore;
  public readonly level: TrustLevel;
  public readonly status: TrustStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: TrustId, props: TrustProps) {
    super(id);
    this.identityId = props.identityId;
    this.score = props.score;
    this.level = props.level;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
