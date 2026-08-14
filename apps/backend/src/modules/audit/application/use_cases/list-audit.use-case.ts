import { PaginatedResult } from '../../../core/application/paginated-result';
import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { ListAuditQuery } from '../queries/list-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/**
 * Lists the caller's own Audit records page by page. The scope is
 * applied in the repository query (not filtered after the fact) so
 * `total` and the page window both describe the caller's own trail —
 * the unscoped listing exposed every user's activity history to any
 * authenticated caller. Only an `Admin` reads the whole system's
 * trail, which is the one role for which a global audit view is the
 * point.
 */
export class ListAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(
    query: ListAuditQuery,
  ): Promise<PaginatedResult<AuditRecordDto>> {
    const scope = ownershipScope(query.caller);
    const result = await this.auditRepository.list(
      query.page,
      query.pageSize,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return {
      items: result.items.map((audit) => AuditMapper.toDto(audit)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
