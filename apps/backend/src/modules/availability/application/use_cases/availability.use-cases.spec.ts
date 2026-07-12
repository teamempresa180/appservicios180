import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityCommand } from '../commands/create-availability.command';
import { DeleteAvailabilityCommand } from '../commands/delete-availability.command';
import { UpdateAvailabilityCommand } from '../commands/update-availability.command';
import { GetAvailabilityQuery } from '../queries/get-availability.query';
import { ListAvailabilityQuery } from '../queries/list-availability.query';
import { SearchAvailabilityQuery } from '../queries/search-availability.query';
import { InMemoryAvailabilityRepository } from './test-support/in-memory-availability.repository';
import { CreateAvailabilityUseCase } from './create-availability.use-case';
import { GetAvailabilityUseCase } from './get-availability.use-case';
import { UpdateAvailabilityUseCase } from './update-availability.use-case';
import { DeleteAvailabilityUseCase } from './delete-availability.use-case';
import { ListAvailabilityUseCase } from './list-availability.use-case';
import { SearchAvailabilityUseCase } from './search-availability.use-case';

describe('Availability use cases', () => {
  let repository: InMemoryAvailabilityRepository;
  let providerRepository: InMemoryProviderRepository;
  let providerId: string;

  beforeEach(async () => {
    repository = new InMemoryAvailabilityRepository();
    providerRepository = new InMemoryProviderRepository();

    const now = new Date();
    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.create(),
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'bio',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    });
    await providerRepository.save(provider);
    providerId = provider.id.value;
  });

  function createCommand() {
    return new CreateAvailabilityCommand(
      providerId,
      AvailabilityType.FullTime,
      new Date('2026-01-01T08:00:00Z'),
      new Date('2026-01-01T17:00:00Z'),
    );
  }

  describe('CreateAvailabilityUseCase', () => {
    it('creates an Availability in Active status', async () => {
      const useCase = new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      );
      const dto = await useCase.execute(createCommand());

      expect(dto.providerId).toBe(providerId);
      expect(dto.status).toBe(AvailabilityStatus.Active);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      const useCase = new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      );
      await expect(
        useCase.execute(
          new CreateAvailabilityCommand(
            'unknown-provider',
            AvailabilityType.FullTime,
            new Date('2026-01-01T08:00:00Z'),
            new Date('2026-01-01T17:00:00Z'),
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects availableFrom after availableTo', async () => {
      const useCase = new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      );
      await expect(
        useCase.execute(
          new CreateAvailabilityCommand(
            providerId,
            AvailabilityType.FullTime,
            new Date('2026-01-01T17:00:00Z'),
            new Date('2026-01-01T08:00:00Z'),
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetAvailabilityUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetAvailabilityUseCase(repository).execute(
          new GetAvailabilityQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateAvailabilityUseCase', () => {
    it('updates availableFrom/availableTo/status', async () => {
      const created = await new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      ).execute(createCommand());

      const updated = await new UpdateAvailabilityUseCase(repository).execute(
        new UpdateAvailabilityCommand(
          created.id,
          new Date('2026-02-01T08:00:00Z'),
          new Date('2026-02-01T17:00:00Z'),
          AvailabilityStatus.Inactive,
        ),
      );

      expect(updated.status).toBe(AvailabilityStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateAvailabilityUseCase(repository).execute(
          new UpdateAvailabilityCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteAvailabilityUseCase', () => {
    it('deletes an existing Availability', async () => {
      const created = await new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      ).execute(createCommand());

      await new DeleteAvailabilityUseCase(repository).execute(
        new DeleteAvailabilityCommand(created.id),
      );

      await expect(
        new GetAvailabilityUseCase(repository).execute(
          new GetAvailabilityQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAvailabilityUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      );
      await createUseCase.execute(createCommand());
      await createUseCase.execute(createCommand());

      const page = await new ListAvailabilityUseCase(repository).execute(
        new ListAvailabilityQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchAvailabilityUseCase', () => {
    it('finds Availabilities by type', async () => {
      await new CreateAvailabilityUseCase(
        repository,
        providerRepository,
      ).execute(
        new CreateAvailabilityCommand(
          providerId,
          AvailabilityType.OnDemand,
          new Date('2026-01-01T08:00:00Z'),
          new Date('2026-01-01T17:00:00Z'),
        ),
      );

      const results = await new SearchAvailabilityUseCase(repository).execute(
        new SearchAvailabilityQuery('on_demand'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
