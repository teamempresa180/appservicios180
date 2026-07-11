import { Identity } from '../../domain/entities/identity.entity';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { UpdateIdentityCommand } from '../commands/update-identity.command';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityMapper } from '../mappers/identity.mapper';
import { IdentityValidator } from '../validators/identity.validator';

/**
 * Updates the mutable fields of an existing Identity (`fullName`,
 * `status`) — `documentType`/`documentNumber`/`birthDate` are not
 * offered by `UpdateIdentityCommand`/`UpdateIdentityDto`, so they stay
 * untouched (nothing in the domain documents identity documents as
 * mutable after creation).
 */
export class UpdateIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(command: UpdateIdentityCommand): Promise<IdentityDto> {
    IdentityValidator.validateUpdate(command);

    const id = IdentityId.fromString(command.id);
    const existing = await this.identityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Identity ${command.id} not found`);
    }

    const updated = new Identity(existing.id, {
      fullName: command.fullName ?? existing.fullName,
      documentType: existing.documentType,
      documentNumber: existing.documentNumber,
      birthDate: existing.birthDate,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.identityRepository.save(updated);
    return IdentityMapper.toDto(updated);
  }
}
