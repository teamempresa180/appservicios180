import { Identity } from '../../domain/entities/identity.entity';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityCommand } from '../commands/create-identity.command';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityMapper } from '../mappers/identity.mapper';
import { IdentityValidator } from '../validators/identity.validator';

/**
 * Creates a new Identity, always in `Active` status — nothing in
 * `identity/README.md` documents an approval/pending step, so there
 * is no other status a newly created Identity could start in.
 */
export class CreateIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(command: CreateIdentityCommand): Promise<IdentityDto> {
    IdentityValidator.validateCreate(command);

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: command.fullName,
      documentType: command.documentType,
      documentNumber: command.documentNumber,
      birthDate: command.birthDate,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.identityRepository.save(identity);
    return IdentityMapper.toDto(identity);
  }
}
