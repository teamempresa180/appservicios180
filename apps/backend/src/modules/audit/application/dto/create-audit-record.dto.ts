import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * Input shape for creating an Audit record. No validation.
 */
export class CreateAuditRecordDto {
  identityId!: string;
  actionType!: AuditActionType;
  description!: string;
}
