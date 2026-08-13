import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
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
 *
 * `documentNumber` must be unique across all Identities: it is the
 * login identifier (`LoginUseCase` resolves an account by
 * `findByDocumentNumber` alone), so a duplicate would make login
 * ambiguous — whichever row the database returned first would win,
 * letting a second registration with an existing document number
 * shadow the original account. Enforced here *and* by a unique index
 * in `prisma/schema.prisma`, so a concurrent race still fails at the
 * database rather than creating the duplicate.
 */
export class CreateIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(command: CreateIdentityCommand): Promise<IdentityDto> {
    IdentityValidator.validateCreate(command);

    const duplicate = await this.identityRepository.findByDocumentNumber(
      command.documentNumber,
    );
    if (duplicate) {
      throw new BusinessRuleException(
        'An Identity with this documentNumber already exists',
      );
    }

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
