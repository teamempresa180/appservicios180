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
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleCommand } from '../commands/create-schedule.command';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';
import { UpdateScheduleCommand } from '../commands/update-schedule.command';
import { GetScheduleQuery } from '../queries/get-schedule.query';
import { ListScheduleQuery } from '../queries/list-schedule.query';
import { SearchScheduleQuery } from '../queries/search-schedule.query';
import { InMemoryScheduleRepository } from './test-support/in-memory-schedule.repository';
import { CreateScheduleUseCase } from './create-schedule.use-case';
import { GetScheduleUseCase } from './get-schedule.use-case';
import { UpdateScheduleUseCase } from './update-schedule.use-case';
import { DeleteScheduleUseCase } from './delete-schedule.use-case';
import { ListScheduleUseCase } from './list-schedule.use-case';
import { SearchScheduleUseCase } from './search-schedule.use-case';

describe('Schedule use cases', () => {
  let repository: InMemoryScheduleRepository;
  let providerRepository: InMemoryProviderRepository;
  let providerId: string;

  beforeEach(async () => {
    repository = new InMemoryScheduleRepository();
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
    return new CreateScheduleCommand(
      providerId,
      new Date('2026-01-01T08:00:00Z'),
      new Date('2026-01-01T09:00:00Z'),
      ScheduleType.Regular,
    );
  }

  describe('CreateScheduleUseCase', () => {
    it('creates a Schedule block in Open status', async () => {
      const useCase = new CreateScheduleUseCase(repository, providerRepository);
      const dto = await useCase.execute(createCommand());

      expect(dto.providerId).toBe(providerId);
      expect(dto.status).toBe(ScheduleStatus.Open);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      const useCase = new CreateScheduleUseCase(repository, providerRepository);
      await expect(
        useCase.execute(
          new CreateScheduleCommand(
            'unknown-provider',
            new Date('2026-01-01T08:00:00Z'),
            new Date('2026-01-01T09:00:00Z'),
            ScheduleType.Regular,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects startDateTime after endDateTime', async () => {
      const useCase = new CreateScheduleUseCase(repository, providerRepository);
      await expect(
        useCase.execute(
          new CreateScheduleCommand(
            providerId,
            new Date('2026-01-01T09:00:00Z'),
            new Date('2026-01-01T08:00:00Z'),
            ScheduleType.Regular,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetScheduleUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetScheduleUseCase(repository).execute(
          new GetScheduleQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateScheduleUseCase', () => {
    it('updates status', async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand());

      const updated = await new UpdateScheduleUseCase(repository).execute(
        new UpdateScheduleCommand(
          created.id,
          undefined,
          undefined,
          ScheduleStatus.Blocked,
        ),
      );

      expect(updated.status).toBe(ScheduleStatus.Blocked);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateScheduleUseCase(repository).execute(
          new UpdateScheduleCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteScheduleUseCase', () => {
    it('deletes an existing Schedule block', async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand());

      await new DeleteScheduleUseCase(repository).execute(
        new DeleteScheduleCommand(created.id),
      );

      await expect(
        new GetScheduleUseCase(repository).execute(
          new GetScheduleQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListScheduleUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateScheduleUseCase(
        repository,
        providerRepository,
      );
      await createUseCase.execute(createCommand());
      await createUseCase.execute(createCommand());

      const page = await new ListScheduleUseCase(repository).execute(
        new ListScheduleQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchScheduleUseCase', () => {
    it('finds Schedule blocks by type', async () => {
      await new CreateScheduleUseCase(repository, providerRepository).execute(
        new CreateScheduleCommand(
          providerId,
          new Date('2026-01-01T08:00:00Z'),
          new Date('2026-01-01T09:00:00Z'),
          ScheduleType.Special,
        ),
      );

      const results = await new SearchScheduleUseCase(repository).execute(
        new SearchScheduleQuery('special'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
