import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
 *
 * Only the Identity the Credential belongs to (or an `Admin`) may
 * update it. Unlike Identity — where the resource id *is* the owner —
 * the record has to be loaded first to learn its `identityId`, so a
 * caller aiming at someone else's Credential gets a 403 and a caller
 * aiming at a non-existent one gets a 404.
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
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only update your own Credential records',
      );
    }

    const updated = new Credential(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      passwordHash: existing.passwordHash,
    });

    await this.credentialRepository.save(updated);
    return CredentialMapper.toDto(updated);
  }
}
