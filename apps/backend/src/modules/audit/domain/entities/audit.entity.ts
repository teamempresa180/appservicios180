import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AuditId } from '../value-objects/audit-id.value-object';
import { AuditActionType } from '../value-objects/audit-action-type.value-object';

export interface AuditProps {
  identityId: IdentityId;
  actionType: AuditActionType;
  description: string;
  occurredAt: Date;
}

/**
 * Represents an immutable audit log entry describing an action performed by
 * an Identity. Pure data holder — no behavior, no persistence, no business rules.
 */
export class Audit extends Entity<AuditId> {
  public readonly identityId: IdentityId;
  public readonly actionType: AuditActionType;
  public readonly description: string;
  public readonly occurredAt: Date;

  constructor(id: AuditId, props: AuditProps) {
    super(id);
    this.identityId = props.identityId;
    this.actionType = props.actionType;
    this.description = props.description;
    this.occurredAt = props.occurredAt;
  }
}
