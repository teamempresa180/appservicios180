import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';
import { CredentialValidator } from '../validators/credential.validator';
import { PasswordHasher } from '../ports/password-hasher.port';

/**
 * Changes the password on an existing `Password`-type Credential.
 * Requires the current plaintext password to match the stored hash
 * before accepting the new one — this is a self-service change, not
 * an administrative reset, so proof of the current password is
 * mandatory. Throws `UnauthorizedException` (not `ValidationException`)
 * on a wrong current password — same reasoning as `LoginUseCase`:
 * this is an authentication failure, not malformed input.
 */
export class ChangePasswordUseCase {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<CredentialDto> {
    CredentialValidator.validateChangePassword(command);

    const id = CredentialId.fromString(command.credentialId);
    const existing = await this.credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Credential ${command.credentialId} not found`,
      );
    }
    if (existing.type !== CredentialType.Password || !existing.passwordHash) {
      throw new UnauthorizedException(
        'This credential does not support password changes',
      );
    }

    const currentMatches = await this.passwordHasher.verify(
      command.currentPassword,
      existing.passwordHash,
    );
    if (!currentMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordHasher.hash(command.newPassword);

    const updated = new Credential(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      passwordHash: newPasswordHash,
    });

    await this.credentialRepository.save(updated);
    return CredentialMapper.toDto(updated);
  }
}
