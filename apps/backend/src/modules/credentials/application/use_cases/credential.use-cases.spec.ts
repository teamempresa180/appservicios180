import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { DeleteCredentialCommand } from '../commands/delete-credential.command';
import { UpdateCredentialCommand } from '../commands/update-credential.command';
import { GetCredentialQuery } from '../queries/get-credential.query';
import { ListCredentialQuery } from '../queries/list-credential.query';
import { SearchCredentialQuery } from '../queries/search-credential.query';
import { InMemoryCredentialRepository } from './test-support/in-memory-credential.repository';
import { CreateCredentialUseCase } from './create-credential.use-case';
import { GetCredentialUseCase } from './get-credential.use-case';
import { UpdateCredentialUseCase } from './update-credential.use-case';
import { DeleteCredentialUseCase } from './delete-credential.use-case';
import { ListCredentialUseCase } from './list-credential.use-case';
import { SearchCredentialUseCase } from './search-credential.use-case';

describe('Credential use cases', () => {
  let repository: InMemoryCredentialRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryCredentialRepository();
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

  describe('CreateCredentialUseCase', () => {
    it('creates a Credential in Active status', async () => {
      const useCase = new CreateCredentialUseCase(
        repository,
        identityRepository,
      );
      const dto = await useCase.execute(
        new CreateCredentialCommand(identityId, CredentialType.Password),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.status).toBe(CredentialStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateCredentialUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateCredentialCommand(
            'unknown-identity',
            CredentialType.Password,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateCredentialUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateCredentialCommand(
            identityId,
            'NOT_A_TYPE' as CredentialType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetCredentialUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetCredentialUseCase(repository).execute(
          new GetCredentialQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateCredentialUseCase', () => {
    it('updates status', async () => {
      const created = await new CreateCredentialUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateCredentialCommand(identityId, CredentialType.Password),
      );

      const updated = await new UpdateCredentialUseCase(repository).execute(
        new UpdateCredentialCommand(created.id, CredentialStatus.Expired),
      );

      expect(updated.status).toBe(CredentialStatus.Expired);
    });
  });

  describe('DeleteCredentialUseCase', () => {
    it('deletes an existing Credential', async () => {
      const created = await new CreateCredentialUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateCredentialCommand(identityId, CredentialType.Password),
      );

      await new DeleteCredentialUseCase(repository).execute(
        new DeleteCredentialCommand(created.id),
      );

      await expect(
        new GetCredentialUseCase(repository).execute(
          new GetCredentialQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListCredentialUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateCredentialUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateCredentialCommand(identityId, CredentialType.Password),
      );
      await createUseCase.execute(
        new CreateCredentialCommand(identityId, CredentialType.RecoveryCode),
      );

      const page = await new ListCredentialUseCase(repository).execute(
        new ListCredentialQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchCredentialUseCase', () => {
    it('finds Credentials by type', async () => {
      await new CreateCredentialUseCase(repository, identityRepository).execute(
        new CreateCredentialCommand(identityId, CredentialType.SecurityKey),
      );

      const results = await new SearchCredentialUseCase(repository).execute(
        new SearchCredentialQuery('security_key'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
