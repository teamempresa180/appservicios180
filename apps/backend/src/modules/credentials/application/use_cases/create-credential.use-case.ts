import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';
import { CredentialValidator } from '../validators/credential.validator';

/**
 * Creates a new Credential record for an existing Identity, always in
 * `Active` status. Depends on `IdentityRepository` to verify the
 * referenced Identity exists first — same rule already applied in
 * `CreateAuthenticationUseCase`, for the same documented relationship
 * (`credentials/README.md`: "únicamente referencia IdentityId").
 */
export class CreateCredentialUseCase {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateCredentialCommand): Promise<CredentialDto> {
    CredentialValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId,
      type: command.type,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.credentialRepository.save(credential);
    return CredentialMapper.toDto(credential);
  }
}
