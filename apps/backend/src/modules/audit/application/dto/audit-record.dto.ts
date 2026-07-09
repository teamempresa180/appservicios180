import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class AuditRecordDto {
  id!: string;
  identityId!: string;
  actionType!: AuditActionType;
  description!: string;
  occurredAt!: Date;
}
