import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * Intent to create a new Audit record. Plain data — no behavior.
 * There is no update/delete command: audit records are immutable by design.
 */
export class CreateAuditRecordCommand {
  constructor(
    public readonly identityId: string,
    public readonly actionType: AuditActionType,
    public readonly description: string,
  ) {}
}
