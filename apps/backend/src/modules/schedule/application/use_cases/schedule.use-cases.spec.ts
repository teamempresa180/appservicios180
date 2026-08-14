import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
  /** The Identity owning the seeded Provider — the legitimate caller. */
  let ownerIdentityId: string;

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
    ownerIdentityId = provider.identityId.value;
  });

  /**
   * Cases unrelated to the Etapa 18 authorization rules run as the
   * Provider's owner; the rules themselves get dedicated cases below.
   */
  const owner = (): AuthenticatedUser => ({
    id: ownerIdentityId,
    role: Role.Provider,
  });
  const admin: AuthenticatedUser = { id: 'admin-identity', role: Role.Admin };
  const stranger: AuthenticatedUser = {
    id: 'someone-else',
    role: Role.Provider,
  };

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
      const dto = await useCase.execute(createCommand(), owner());

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
          owner(),
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
          owner(),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it("refuses to create a block in another Provider's calendar", async () => {
      const useCase = new CreateScheduleUseCase(repository, providerRepository);

      await expect(
        useCase.execute(createCommand(), stranger),
      ).rejects.toThrow(ForbiddenException);
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
      ).execute(createCommand(), owner());

      const updated = await new UpdateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(
        new UpdateScheduleCommand(
          created.id,
          undefined,
          undefined,
          ScheduleStatus.Blocked,
        ),
        owner(),
      );

      expect(updated.status).toBe(ScheduleStatus.Blocked);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateScheduleUseCase(repository, providerRepository).execute(
          new UpdateScheduleCommand('unknown-id'),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("refuses to update another Provider's Schedule block", async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand(), owner());

      await expect(
        new UpdateScheduleUseCase(repository, providerRepository).execute(
          new UpdateScheduleCommand(
            created.id,
            undefined,
            undefined,
            ScheduleStatus.Blocked,
          ),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an Admin update any Schedule block', async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand(), owner());

      const updated = await new UpdateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(
        new UpdateScheduleCommand(
          created.id,
          undefined,
          undefined,
          ScheduleStatus.Blocked,
        ),
        admin,
      );

      expect(updated.status).toBe(ScheduleStatus.Blocked);
    });
  });

  describe('DeleteScheduleUseCase', () => {
    it('deletes an existing Schedule block', async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand(), owner());

      await new DeleteScheduleUseCase(repository, providerRepository).execute(
        new DeleteScheduleCommand(created.id),
        owner(),
      );

      await expect(
        new GetScheduleUseCase(repository).execute(
          new GetScheduleQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("refuses to delete another Provider's Schedule block", async () => {
      const created = await new CreateScheduleUseCase(
        repository,
        providerRepository,
      ).execute(createCommand(), owner());

      await expect(
        new DeleteScheduleUseCase(repository, providerRepository).execute(
          new DeleteScheduleCommand(created.id),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListScheduleUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateScheduleUseCase(
        repository,
        providerRepository,
      );
      await createUseCase.execute(createCommand(), owner());
      await createUseCase.execute(createCommand(), owner());

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
        owner(),
      );

      const results = await new SearchScheduleUseCase(repository).execute(
        new SearchScheduleQuery('special'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
