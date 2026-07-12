import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';
import { GetTrustQuery } from '../queries/get-trust.query';
import { ListTrustQuery } from '../queries/list-trust.query';
import { SearchTrustQuery } from '../queries/search-trust.query';
import { InMemoryTrustRepository } from './test-support/in-memory-trust.repository';
import { CreateTrustProfileUseCase } from './create-trust-profile.use-case';
import { GetTrustUseCase } from './get-trust.use-case';
import { UpdateTrustProfileUseCase } from './update-trust-profile.use-case';
import { ListTrustUseCase } from './list-trust.use-case';
import { SearchTrustUseCase } from './search-trust.use-case';

describe('Trust use cases', () => {
  let repository: InMemoryTrustRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryTrustRepository();
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

  describe('CreateTrustProfileUseCase', () => {
    it('creates a Trust record in Active status', async () => {
      const useCase = new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      );
      const dto = await useCase.execute(
        new CreateTrustProfileCommand(identityId, 75, TrustLevel.High),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.score).toBe(75);
      expect(dto.status).toBe(TrustStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateTrustProfileCommand(
            'unknown-identity',
            75,
            TrustLevel.High,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid score', async () => {
      const useCase = new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateTrustProfileCommand(
            identityId,
            Number.NaN,
            TrustLevel.High,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('throws BusinessRuleException when the Identity already has a Trust record', async () => {
      const useCase = new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      );
      await useCase.execute(
        new CreateTrustProfileCommand(identityId, 50, TrustLevel.Medium),
      );

      await expect(
        useCase.execute(
          new CreateTrustProfileCommand(identityId, 60, TrustLevel.High),
        ),
      ).rejects.toThrow(BusinessRuleException);
    });
  });

  describe('GetTrustUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetTrustUseCase(repository).execute(
          new GetTrustQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateTrustProfileUseCase', () => {
    it('updates score, level and status', async () => {
      const created = await new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateTrustProfileCommand(identityId, 50, TrustLevel.Medium),
      );

      const updated = await new UpdateTrustProfileUseCase(repository).execute(
        new UpdateTrustProfileCommand(
          created.id,
          90,
          TrustLevel.VeryHigh,
          TrustStatus.Suspended,
        ),
      );

      expect(updated.score).toBe(90);
      expect(updated.level).toBe(TrustLevel.VeryHigh);
      expect(updated.status).toBe(TrustStatus.Suspended);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateTrustProfileUseCase(repository).execute(
          new UpdateTrustProfileCommand('unknown-id', 90),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListTrustUseCase', () => {
    it('paginates results', async () => {
      const identity2 = new Identity(IdentityId.create(), {
        fullName: 'Second Owner',
        documentType: DocumentType.NationalId,
        documentNumber: '456',
        birthDate: new Date(),
        status: IdentityStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await identityRepository.save(identity2);

      const createUseCase = new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateTrustProfileCommand(identityId, 50, TrustLevel.Medium),
      );
      await createUseCase.execute(
        new CreateTrustProfileCommand(identity2.id.value, 60, TrustLevel.High),
      );

      const page = await new ListTrustUseCase(repository).execute(
        new ListTrustQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchTrustUseCase', () => {
    it('finds Trust records by level', async () => {
      await new CreateTrustProfileUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateTrustProfileCommand(identityId, 95, TrustLevel.VeryHigh),
      );

      const results = await new SearchTrustUseCase(repository).execute(
        new SearchTrustQuery('very_high'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
