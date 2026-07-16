import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';
import { CredentialValidator } from '../validators/credential.validator';
import { PasswordHasher } from '../ports/password-hasher.port';

/**
 * Creates a new Credential record for an existing Identity, always in
 * `Active` status. Depends on `IdentityRepository` to verify the
 * referenced Identity exists first — same rule already applied in
 * `CreateAuthenticationUseCase`, for the same documented relationship
 * (`credentials/README.md`: "únicamente referencia IdentityId").
 *
 * When `type === CredentialType.Password`, `command.password` (the
 * plaintext password, already validated as present) is hashed via
 * `PasswordHasher` before being persisted as `passwordHash` — the
 * plaintext value itself is never stored.
 */
export class CreateCredentialUseCase {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: CreateCredentialCommand): Promise<CredentialDto> {
    CredentialValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const passwordHash =
      command.type === CredentialType.Password && command.password
        ? await this.passwordHasher.hash(command.password)
        : null;

    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId,
      type: command.type,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
      passwordHash,
    });

    await this.credentialRepository.save(credential);
    return CredentialMapper.toDto(credential);
  }
}
