import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { SearchAuditQuery } from '../queries/search-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/** Free-text search over `description`/`actionType`. */
export class SearchAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(query: SearchAuditQuery): Promise<AuditRecordDto[]> {
    const results = await this.auditRepository.search(query.term);
    return results.map((audit) => AuditMapper.toDto(audit));
  }
}
