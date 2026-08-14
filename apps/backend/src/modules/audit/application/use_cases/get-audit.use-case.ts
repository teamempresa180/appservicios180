import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { GetAuditQuery } from '../queries/get-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/**
 * Fetches a single Audit record by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase` —
 * and `ForbiddenException` when the record belongs to another
 * Identity's trail, so a guessed id cannot be used to read someone
 * else's activity.
 */
export class GetAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(query: GetAuditQuery): Promise<AuditRecordDto> {
    const audit = await this.auditRepository.findById(
      AuditId.fromString(query.id),
    );
    if (!audit) {
      throw new NotFoundException(`Audit ${query.id} not found`);
    }
    assertOwnership(query.caller, audit.identityId.value, 'Audit record');
    return AuditMapper.toDto(audit);
  }
}
