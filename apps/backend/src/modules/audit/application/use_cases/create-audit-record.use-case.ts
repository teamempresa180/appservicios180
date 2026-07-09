import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { CreateAuditRecordCommand } from '../commands/create-audit-record.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateAuditRecordUseCase {
  constructor(private readonly auditRepository: AuditRepository) {}

  execute(command: CreateAuditRecordCommand): Promise<AuditRecordDto> {
    void this.auditRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
