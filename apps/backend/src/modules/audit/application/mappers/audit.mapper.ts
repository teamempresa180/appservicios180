import { Audit } from '../../domain/entities/audit.entity';
import { AuditRecordDto } from '../dto/audit-record.dto';

/**
 * Translates between the Audit domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class AuditMapper {
  static toDto(audit: Audit): AuditRecordDto {
    const dto = new AuditRecordDto();
    dto.id = audit.id.value;
    dto.identityId = audit.identityId.value;
    dto.actionType = audit.actionType;
    dto.description = audit.description;
    dto.occurredAt = audit.occurredAt;
    return dto;
  }
}
