import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Category } from '../../../category/domain/entities/category.entity';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategoryType } from '../../../category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../../category/domain/value-objects/category-status.value-object';
import { InMemoryCategoryRepository } from '../../../category/application/use_cases/test-support/in-memory-category.repository';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
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
  let categoryId: string;
  const providerId = ProviderId.create().value;

  beforeEach(async () => {
    repository = new InMemoryServiceRepository();
    categoryRepository = new InMemoryCategoryRepository();

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
  });

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

  describe('CreateServiceUseCase', () => {
    it('creates a Service in Active status', async () => {
      const useCase = new CreateServiceUseCase(repository, categoryRepository);
      const dto = await useCase.execute(createCommand());

      expect(dto.providerId).toBe(providerId);
      expect(dto.categoryId).toBe(categoryId);
      expect(dto.status).toBe(ServiceStatus.Active);
    });

    it('throws NotFoundException when the Category does not exist', async () => {
      const useCase = new CreateServiceUseCase(repository, categoryRepository);
      await expect(
        useCase.execute(
          new CreateServiceCommand(
            providerId,
            'unknown-category',
            'Pipe Repair',
            'desc',
            50,
            60,
            ServiceType.Standard,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a negative basePrice', async () => {
      const useCase = new CreateServiceUseCase(repository, categoryRepository);
      await expect(
        useCase.execute(
          new CreateServiceCommand(
            providerId,
            categoryId,
            'Pipe Repair',
            'desc',
            -1,
            60,
            ServiceType.Standard,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateServiceUseCase(repository, categoryRepository);
      await expect(
        useCase.execute(
          new CreateServiceCommand(
            providerId,
            categoryId,
            'Pipe Repair',
            'desc',
            50,
            60,
            'INVALID' as ServiceType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
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
      const created = await new CreateServiceUseCase(
        repository,
        categoryRepository,
      ).execute(createCommand());

      const updated = await new UpdateServiceUseCase(repository).execute(
        new UpdateServiceCommand(created.id, 75, 90, ServiceStatus.Inactive),
      );

      expect(updated.basePrice).toBe(75);
      expect(updated.estimatedDuration).toBe(90);
      expect(updated.status).toBe(ServiceStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateServiceUseCase(repository).execute(
          new UpdateServiceCommand('unknown-id', 75),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteServiceUseCase', () => {
    it('deletes an existing Service', async () => {
      const created = await new CreateServiceUseCase(
        repository,
        categoryRepository,
      ).execute(createCommand());

      await new DeleteServiceUseCase(repository).execute(
        new DeleteServiceCommand(created.id),
      );

      await expect(
        new GetServiceUseCase(repository).execute(
          new GetServiceQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteServiceUseCase(repository).execute(
          new DeleteServiceCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListServiceUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateServiceUseCase(
        repository,
        categoryRepository,
      );
      await createUseCase.execute(createCommand({ name: 'A' }));
      await createUseCase.execute(createCommand({ name: 'B' }));

      const page = await new ListServiceUseCase(repository).execute(
        new ListServiceQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchServiceUseCase', () => {
    it('finds Services by name', async () => {
      await new CreateServiceUseCase(repository, categoryRepository).execute(
        createCommand({ name: 'Special Service' }),
      );

      const results = await new SearchServiceUseCase(repository).execute(
        new SearchServiceQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Special Service');
    });
  });
});
