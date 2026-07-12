import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { GetAuditQuery } from '../queries/get-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/**
 * Fetches a single Audit record by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
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
    return AuditMapper.toDto(audit);
  }
}
