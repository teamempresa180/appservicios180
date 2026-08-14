import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { SearchAuditQuery } from '../queries/search-audit.query';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';

/**
 * Free-text search over `description`/`actionType`, restricted to the
 * caller's own Audit records — same ownership rule as
 * `ListAuditUseCase`, so search can't be used to walk around the
 * listing's scope.
 */
export class SearchAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(query: SearchAuditQuery): Promise<AuditRecordDto[]> {
    const scope = ownershipScope(query.caller);
    const results = await this.auditRepository.search(
      query.term,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return results.map((audit) => AuditMapper.toDto(audit));
  }
}
