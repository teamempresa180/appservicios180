import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { PasswordHasher } from '../ports/password-hasher.port';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { InMemoryCredentialRepository } from './test-support/in-memory-credential.repository';
import { ChangePasswordUseCase } from './change-password.use-case';

class FakePasswordHasher implements PasswordHasher {
  hash(plainPassword: string): Promise<string> {
    return Promise.resolve(`hashed:${plainPassword}`);
  }

  verify(plainPassword: string, passwordHash: string): Promise<boolean> {
    return Promise.resolve(passwordHash === `hashed:${plainPassword}`);
  }
}

describe('ChangePasswordUseCase', () => {
  let repository: InMemoryCredentialRepository;
  let hasher: PasswordHasher;
  let useCase: ChangePasswordUseCase;

  beforeEach(() => {
    repository = new InMemoryCredentialRepository();
    hasher = new FakePasswordHasher();
    useCase = new ChangePasswordUseCase(repository, hasher);
  });

  async function seedPasswordCredential(): Promise<string> {
    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId: IdentityId.create(),
      type: CredentialType.Password,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
      passwordHash: 'hashed:OldPassw0rd!',
    });
    await repository.save(credential);
    return credential.id.value;
  }

  it('changes the password when the current password matches', async () => {
    const credentialId = await seedPasswordCredential();

    const dto = await useCase.execute(
      new ChangePasswordCommand(credentialId, 'OldPassw0rd!', 'NewPassw0rd!'),
    );

    expect(dto.id).toBe(credentialId);
    const stored = await repository.findById(
      CredentialId.fromString(credentialId),
    );
    expect(stored?.passwordHash).toBe('hashed:NewPassw0rd!');
  });

  it('throws UnauthorizedException when the current password is wrong', async () => {
    const credentialId = await seedPasswordCredential();

    await expect(
      useCase.execute(
        new ChangePasswordCommand(
          credentialId,
          'WrongPassword!',
          'NewPassw0rd!',
        ),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws NotFoundException when the credential does not exist', async () => {
    await expect(
      useCase.execute(
        new ChangePasswordCommand('unknown-id', 'OldPassw0rd!', 'NewPassw0rd!'),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws UnauthorizedException when the credential is not a Password credential', async () => {
    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId: IdentityId.create(),
      type: CredentialType.RecoveryCode,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await repository.save(credential);

    await expect(
      useCase.execute(
        new ChangePasswordCommand(
          credential.id.value,
          'OldPassw0rd!',
          'NewPassw0rd!',
        ),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws ValidationException when newPassword is too short', async () => {
    const credentialId = await seedPasswordCredential();

    await expect(
      useCase.execute(
        new ChangePasswordCommand(credentialId, 'OldPassw0rd!', 'short'),
      ),
    ).rejects.toThrow(ValidationException);
  });
});
