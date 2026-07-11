import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { UpdateCredentialCommand } from '../commands/update-credential.command';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';
import { CredentialValidator } from '../validators/credential.validator';

/**
 * Updates a Credential's `status` — `type`/`identityId` are not
 * offered by `UpdateCredentialCommand` (nothing documents a
 * credential's type or owner as mutable after creation).
 */
export class UpdateCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(command: UpdateCredentialCommand): Promise<CredentialDto> {
    CredentialValidator.validateUpdate(command);

    const id = CredentialId.fromString(command.id);
    const existing = await this.credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Credential ${command.id} not found`);
    }

    const updated = new Credential(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.credentialRepository.save(updated);
    return CredentialMapper.toDto(updated);
  }
}
