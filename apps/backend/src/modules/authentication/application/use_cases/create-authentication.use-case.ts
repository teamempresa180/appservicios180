import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationCommand } from '../commands/create-authentication.command';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';
import { AuthenticationValidator } from '../validators/authentication.validator';

/**
 * Creates a new Authentication method for an existing Identity, always
 * in `Active` status. Depends on `IdentityRepository` (not just its
 * own) to verify the referenced Identity actually exists before
 * creating a method for it — `authentication/README.md` documents
 * `Authentication` as referencing `IdentityId`, so a dangling
 * reference would violate that relationship.
 */
export class CreateAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(
    command: CreateAuthenticationCommand,
  ): Promise<AuthenticationDto> {
    AuthenticationValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const authentication = new Authentication(AuthenticationId.create(), {
      identityId,
      methodType: command.methodType,
      status: AuthenticationStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.authenticationRepository.save(authentication);
    return AuthenticationMapper.toDto(authentication);
  }
}
