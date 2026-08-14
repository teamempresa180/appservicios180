import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * Intent to create a new Audit record. Plain data — no behavior.
 * There is no update/delete command: audit records are immutable by
 * design.
 *
 * `caller` is the authenticated user: `CreateAuditRecordUseCase`
 * rejects an `identityId` that is not the caller's own, because an
 * audit trail that can be written on another Identity's behalf is
 * worse than no audit trail at all.
 */
export class CreateAuditRecordCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly identityId: string,
    public readonly actionType: AuditActionType,
    public readonly description: string,
  ) {}
}
