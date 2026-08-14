import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../domain/entities/audit.entity';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { CreateAuditRecordCommand } from '../commands/create-audit-record.command';
import { AuditRecordDto } from '../dto/audit-record.dto';
import { AuditMapper } from '../mappers/audit.mapper';
import { AuditValidator } from '../validators/audit.validator';

/**
 * Creates a new immutable Audit record for an existing Identity, with
 * `occurredAt` set to now. Depends on `IdentityRepository` (not just
 * its own) to verify the referenced Identity actually exists before
 * creating a record for it — same rule already applied to every other
 * module referencing `IdentityId`. There is no Update/Delete use case:
 * audit records are immutable by design (see
 * `CreateAuditRecordCommand`).
 *
 * The `identityId` in the command is caller-supplied, so it is checked
 * against the authenticated caller: a record cannot be written into
 * another Identity's trail, which would let one user forge another's
 * activity history. An `Admin` may still record on anyone's behalf.
 */
export class CreateAuditRecordUseCase {
  constructor(
    private readonly auditRepository: AuditRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateAuditRecordCommand): Promise<AuditRecordDto> {
    AuditValidator.validateCreate(command);
    assertOwnership(command.caller, command.identityId, 'Audit record');

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const audit = new Audit(AuditId.create(), {
      identityId,
      actionType: command.actionType,
      description: command.description,
      occurredAt: new Date(),
    });

    await this.auditRepository.save(audit);
    return AuditMapper.toDto(audit);
  }
}
