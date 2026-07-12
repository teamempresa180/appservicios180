import { PaginatedResult } from '../../../core/application/paginated-result';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { ListAuditQuery } from '../queries/list-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/** Lists Audit records page by page. */
export class ListAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(
    query: ListAuditQuery,
  ): Promise<PaginatedResult<AuditRecordDto>> {
    const result = await this.auditRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((audit) => AuditMapper.toDto(audit)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
