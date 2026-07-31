import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { Category } from '../../../category/domain/entities/category.entity';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategoryType } from '../../../category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../../category/domain/value-objects/category-status.value-object';
import { InMemoryCategoryRepository } from '../../../category/application/use_cases/test-support/in-memory-category.repository';
import { Service } from '../../../service/domain/entities/service.entity';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../../service/domain/value-objects/service-status.value-object';
import { ServiceType } from '../../../service/domain/value-objects/service-type.value-object';
import { InMemoryServiceRepository } from '../../../service/application/use_cases/test-support/in-memory-service.repository';
import { Order } from '../../../order/domain/entities/order.entity';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../../order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../../order/domain/value-objects/order-priority.value-object';
import { InMemoryOrderRepository } from '../../../order/application/use_cases/test-support/in-memory-order.repository';
import { CreateReviewCommand } from '../commands/create-review.command';
import { UpdateReviewCommand } from '../commands/update-review.command';
import { DeleteReviewCommand } from '../commands/delete-review.command';
import { GetReviewQuery } from '../queries/get-review.query';
import { ListReviewQuery } from '../queries/list-review.query';
import { SearchReviewQuery } from '../queries/search-review.query';
import { InMemoryReviewRepository } from './test-support/in-memory-review.repository';
import { CreateReviewUseCase } from './create-review.use-case';
import { GetReviewUseCase } from './get-review.use-case';
import { UpdateReviewUseCase } from './update-review.use-case';
import { DeleteReviewUseCase } from './delete-review.use-case';
import { ListReviewUseCase } from './list-review.use-case';
import { SearchReviewUseCase } from './search-review.use-case';

describe('Review use cases', () => {
  let repository: InMemoryReviewRepository;
  let orderRepository: InMemoryOrderRepository;
  let providerRepository: InMemoryProviderRepository;
  let identityRepository: InMemoryIdentityRepository;
  let orderId: string;
  let providerId: string;
  let reviewerIdentityId: string;

  beforeEach(async () => {
    repository = new InMemoryReviewRepository();
    orderRepository = new InMemoryOrderRepository();
    providerRepository = new InMemoryProviderRepository();
    identityRepository = new InMemoryIdentityRepository();
    const serviceRepository = new InMemoryServiceRepository();
    const categoryRepository = new InMemoryCategoryRepository();

    const now = new Date();
    const reviewer = new Identity(IdentityId.create(), {
      fullName: 'Review Customer',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(reviewer);
    reviewerIdentityId = reviewer.id.value;

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

    const service = new Service(ServiceId.create(), {
      providerId: provider.id,
      categoryId: category.id,
      name: 'Pipe Repair',
      description: 'Fixes leaking pipes',
      basePrice: 50,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await serviceRepository.save(service);

    const order = new Order(OrderId.create(), {
      identityId: reviewer.id,
      providerId: provider.id,
      serviceId: service.id,
      categoryId: service.categoryId,
      addressId: null,
      title: 'Fix the sink',
      description: 'The kitchen sink is leaking',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Completed,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await orderRepository.save(order);
    orderId = order.id.value;
  });

  function createCommand(overrides: Partial<{ title: string }> = {}) {
    return new CreateReviewCommand(
      orderId,
      providerId,
      reviewerIdentityId,
      5,
      overrides.title ?? 'Great service',
      'Very professional and on time.',
    );
  }

  function useCase() {
    return new CreateReviewUseCase(
      repository,
      orderRepository,
      providerRepository,
      identityRepository,
    );
  }

  describe('CreateReviewUseCase', () => {
    it('creates a Review in Pending status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.orderId).toBe(orderId);
      expect(dto.providerId).toBe(providerId);
      expect(dto.rating).toBe(5);
    });

    it('throws NotFoundException when the Order does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateReviewCommand(
            'unknown-order',
            providerId,
            reviewerIdentityId,
            5,
            'title',
            'comment',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateReviewCommand(
            orderId,
            'unknown-provider',
            reviewerIdentityId,
            5,
            'title',
            'comment',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the reviewer Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateReviewCommand(
            orderId,
            providerId,
            'unknown-identity',
            5,
            'title',
            'comment',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank title', async () => {
      await expect(
        useCase().execute(
          new CreateReviewCommand(
            orderId,
            providerId,
            reviewerIdentityId,
            5,
            '  ',
            'comment',
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetReviewUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetReviewUseCase(repository).execute(
        new GetReviewQuery('unknown-id'),
      );
      expect(result).toBeNull();
    });

    it('returns the Review when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetReviewUseCase(repository).execute(
        new GetReviewQuery(created.id),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('UpdateReviewUseCase', () => {
    it('updates title and comment', async () => {
      const created = await useCase().execute(createCommand());

      const updated = await new UpdateReviewUseCase(repository).execute(
        new UpdateReviewCommand(created.id, 'New title', 'New comment'),
      );

      expect(updated.title).toBe('New title');
      expect(updated.comment).toBe('New comment');
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateReviewUseCase(repository).execute(
          new UpdateReviewCommand('unknown-id', 'New title'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteReviewUseCase', () => {
    it('deletes an existing Review', async () => {
      const created = await useCase().execute(createCommand());

      await new DeleteReviewUseCase(repository).execute(
        new DeleteReviewCommand(created.id),
      );

      const result = await new GetReviewUseCase(repository).execute(
        new GetReviewQuery(created.id),
      );
      expect(result).toBeNull();
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteReviewUseCase(repository).execute(
          new DeleteReviewCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListReviewUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ title: 'A' }));
      await useCase().execute(createCommand({ title: 'B' }));

      const page = await new ListReviewUseCase(repository).execute(
        new ListReviewQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchReviewUseCase', () => {
    it('finds Reviews by title', async () => {
      await useCase().execute(createCommand({ title: 'Special Review' }));

      const results = await new SearchReviewUseCase(repository).execute(
        new SearchReviewQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Special Review');
    });
  });
});
