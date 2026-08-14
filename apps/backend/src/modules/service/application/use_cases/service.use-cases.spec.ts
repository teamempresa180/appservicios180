import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Category } from '../../../category/domain/entities/category.entity';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategoryType } from '../../../category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../../category/domain/value-objects/category-status.value-object';
import { InMemoryCategoryRepository } from '../../../category/application/use_cases/test-support/in-memory-category.repository';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceCommand } from '../commands/create-service.command';
import { DeleteServiceCommand } from '../commands/delete-service.command';
import { UpdateServiceCommand } from '../commands/update-service.command';
import { GetServiceQuery } from '../queries/get-service.query';
import { ListServiceQuery } from '../queries/list-service.query';
import { SearchServiceQuery } from '../queries/search-service.query';
import { InMemoryServiceRepository } from './test-support/in-memory-service.repository';
import { CreateServiceUseCase } from './create-service.use-case';
import { GetServiceUseCase } from './get-service.use-case';
import { UpdateServiceUseCase } from './update-service.use-case';
import { DeleteServiceUseCase } from './delete-service.use-case';
import { ListServiceUseCase } from './list-service.use-case';
import { SearchServiceUseCase } from './search-service.use-case';

describe('Service use cases', () => {
  let repository: InMemoryServiceRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let providerRepository: InMemoryProviderRepository;
  let categoryId: string;
  let providerId: string;
  /** The Identity owning the seeded Provider — the legitimate caller. */
  let ownerIdentityId: string;

  beforeEach(async () => {
    repository = new InMemoryServiceRepository();
    categoryRepository = new InMemoryCategoryRepository();
    providerRepository = new InMemoryProviderRepository();

    const now = new Date();
    const category = new Category(CategoryId.create(), {
      name: 'Plumbing',
      description: 'Pipes and water systems',
      icon: 'icon',
      color: '#000',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await categoryRepository.save(category);
    categoryId = category.id.value;

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

  function createCommand(overrides: Partial<{ name: string }> = {}) {
    return new CreateServiceCommand(
      providerId,
      categoryId,
      overrides.name ?? 'Pipe Repair',
      'Fixes leaking pipes',
      50,
      60,
      ServiceType.Standard,
    );
  }

  function useCase() {
    return new CreateServiceUseCase(
      repository,
      categoryRepository,
      providerRepository,
    );
  }

  describe('CreateServiceUseCase', () => {
    it('creates a Service in Active status', async () => {
      const dto = await useCase().execute(createCommand(), owner());

      expect(dto.providerId).toBe(providerId);
      expect(dto.categoryId).toBe(categoryId);
      expect(dto.status).toBe(ServiceStatus.Active);
    });

    it('throws NotFoundException when the Category does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateServiceCommand(
            providerId,
            'unknown-category',
            'Pipe Repair',
            'desc',
            50,
            60,
            ServiceType.Standard,
          ),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateServiceCommand(
            'unknown-provider',
            categoryId,
            'Pipe Repair',
            'desc',
            50,
            60,
            ServiceType.Standard,
          ),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a negative basePrice', async () => {
      await expect(
        useCase().execute(
          new CreateServiceCommand(
            providerId,
            categoryId,
            'Pipe Repair',
            'desc',
            -1,
            60,
            ServiceType.Standard,
          ),
          owner(),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid type', async () => {
      await expect(
        useCase().execute(
          new CreateServiceCommand(
            providerId,
            categoryId,
            'Pipe Repair',
            'desc',
            50,
            60,
            'INVALID' as ServiceType,
          ),
          owner(),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it("refuses to create a Service under another Provider's id", async () => {
      await expect(
        useCase().execute(createCommand(), stranger),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an Admin create a Service for any Provider', async () => {
      const dto = await useCase().execute(createCommand(), admin);

      expect(dto.providerId).toBe(providerId);
    });
  });

  describe('GetServiceUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetServiceUseCase(repository).execute(
          new GetServiceQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateServiceUseCase', () => {
    it('updates basePrice, estimatedDuration and status', async () => {
      const created = await useCase().execute(createCommand(), owner());

      const updated = await new UpdateServiceUseCase(
        repository,
        providerRepository,
      ).execute(
        new UpdateServiceCommand(created.id, 75, 90, ServiceStatus.Inactive),
        owner(),
      );

      expect(updated.basePrice).toBe(75);
      expect(updated.estimatedDuration).toBe(90);
      expect(updated.status).toBe(ServiceStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateServiceUseCase(repository, providerRepository).execute(
          new UpdateServiceCommand('unknown-id', 75),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("refuses to update another Provider's Service", async () => {
      const created = await useCase().execute(createCommand(), owner());

      await expect(
        new UpdateServiceUseCase(repository, providerRepository).execute(
          new UpdateServiceCommand(created.id, 1),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an Admin update any Service', async () => {
      const created = await useCase().execute(createCommand(), owner());

      const updated = await new UpdateServiceUseCase(
        repository,
        providerRepository,
      ).execute(new UpdateServiceCommand(created.id, 99), admin);

      expect(updated.basePrice).toBe(99);
    });
  });

  describe('DeleteServiceUseCase', () => {
    it('deletes an existing Service', async () => {
      const created = await useCase().execute(createCommand(), owner());

      await new DeleteServiceUseCase(repository, providerRepository).execute(
        new DeleteServiceCommand(created.id),
        owner(),
      );

      await expect(
        new GetServiceUseCase(repository).execute(
          new GetServiceQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteServiceUseCase(repository, providerRepository).execute(
          new DeleteServiceCommand('unknown-id'),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("refuses to delete another Provider's Service", async () => {
      const created = await useCase().execute(createCommand(), owner());

      await expect(
        new DeleteServiceUseCase(repository, providerRepository).execute(
          new DeleteServiceCommand(created.id),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListServiceUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ name: 'A' }), owner());
      await useCase().execute(createCommand({ name: 'B' }), owner());

      const page = await new ListServiceUseCase(repository).execute(
        new ListServiceQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchServiceUseCase', () => {
    it('finds Services by name', async () => {
      await useCase().execute(
        createCommand({ name: 'Special Service' }),
        owner(),
      );

      const results = await new SearchServiceUseCase(repository).execute(
        new SearchServiceQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Special Service');
    });
  });
});
