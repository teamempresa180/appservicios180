import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { UpdateAuthenticationCommand } from '../commands/update-authentication.command';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';
import { AuthenticationValidator } from '../validators/authentication.validator';

/**
 * Updates an Authentication method's `status` — `methodType`/
 * `identityId` are not offered by `UpdateAuthenticationCommand`
 * (nothing documents a method's type or owner as mutable after
 * creation).
 */
export class UpdateAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(
    command: UpdateAuthenticationCommand,
  ): Promise<AuthenticationDto> {
    AuthenticationValidator.validateUpdate(command);

    const id = AuthenticationId.fromString(command.id);
    const existing = await this.authenticationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Authentication ${command.id} not found`);
    }

    const updated = new Authentication(existing.id, {
      identityId: existing.identityId,
      methodType: existing.methodType,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.authenticationRepository.save(updated);
    return AuthenticationMapper.toDto(updated);
  }
}
