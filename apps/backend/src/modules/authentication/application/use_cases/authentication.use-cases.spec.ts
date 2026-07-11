import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationCommand } from '../commands/create-authentication.command';
import { DeleteAuthenticationCommand } from '../commands/delete-authentication.command';
import { UpdateAuthenticationCommand } from '../commands/update-authentication.command';
import { GetAuthenticationQuery } from '../queries/get-authentication.query';
import { ListAuthenticationQuery } from '../queries/list-authentication.query';
import { SearchAuthenticationQuery } from '../queries/search-authentication.query';
import { InMemoryAuthenticationRepository } from './test-support/in-memory-authentication.repository';
import { CreateAuthenticationUseCase } from './create-authentication.use-case';
import { GetAuthenticationUseCase } from './get-authentication.use-case';
import { UpdateAuthenticationUseCase } from './update-authentication.use-case';
import { DeleteAuthenticationUseCase } from './delete-authentication.use-case';
import { ListAuthenticationUseCase } from './list-authentication.use-case';
import { SearchAuthenticationUseCase } from './search-authentication.use-case';

describe('Authentication use cases', () => {
  let repository: InMemoryAuthenticationRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryAuthenticationRepository();
    identityRepository = new InMemoryIdentityRepository();

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber: '123',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;
  });

  describe('CreateAuthenticationUseCase', () => {
    it('creates an Authentication method in Active status', async () => {
      const useCase = new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      );
      const dto = await useCase.execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.Password),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.status).toBe(AuthenticationStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateAuthenticationCommand(
            'unknown-identity',
            AuthMethodType.Password,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid methodType', async () => {
      const useCase = new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateAuthenticationCommand(
            identityId,
            'NOT_A_METHOD' as AuthMethodType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetAuthenticationUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetAuthenticationUseCase(repository).execute(
          new GetAuthenticationQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateAuthenticationUseCase', () => {
    it('updates status', async () => {
      const created = await new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.Password),
      );

      const updated = await new UpdateAuthenticationUseCase(repository).execute(
        new UpdateAuthenticationCommand(
          created.id,
          AuthenticationStatus.Revoked,
        ),
      );

      expect(updated.status).toBe(AuthenticationStatus.Revoked);
    });
  });

  describe('DeleteAuthenticationUseCase', () => {
    it('deletes an existing Authentication', async () => {
      const created = await new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.Password),
      );

      await new DeleteAuthenticationUseCase(repository).execute(
        new DeleteAuthenticationCommand(created.id),
      );

      await expect(
        new GetAuthenticationUseCase(repository).execute(
          new GetAuthenticationQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAuthenticationUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.Password),
      );
      await createUseCase.execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.Biometric),
      );

      const page = await new ListAuthenticationUseCase(repository).execute(
        new ListAuthenticationQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchAuthenticationUseCase', () => {
    it('finds Authentications by methodType', async () => {
      await new CreateAuthenticationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateAuthenticationCommand(identityId, AuthMethodType.ThirdParty),
      );

      const results = await new SearchAuthenticationUseCase(repository).execute(
        new SearchAuthenticationQuery('third_party'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
