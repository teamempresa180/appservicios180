import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { GetAuditQuery } from '../queries/get-audit.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetAuditUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  execute(query: GetAuditQuery): Promise<AuditRecordDto | null> {
    void this.auditRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
