import { Caller } from '../../../core/application/caller';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { CreateOrderCommand } from '../commands/create-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { CancelOrderCommand } from '../commands/cancel-order.command';
import { StartOrderCommand } from '../commands/start-order.command';
import { CompleteOrderCommand } from '../commands/complete-order.command';
import { GetOrderQuery } from '../queries/get-order.query';
import { ListOrderQuery } from '../queries/list-order.query';
import { SearchOrderQuery } from '../queries/search-order.query';
import { InMemoryOrderRepository } from './test-support/in-memory-order.repository';
import { CreateOrderUseCase } from './create-order.use-case';
import { GetOrderUseCase } from './get-order.use-case';
import { UpdateOrderUseCase } from './update-order.use-case';
import { CancelOrderUseCase } from './cancel-order.use-case';
import { StartOrderUseCase } from './start-order.use-case';
import { CompleteOrderUseCase } from './complete-order.use-case';
import { ListOrderUseCase } from './list-order.use-case';
import { SearchOrderUseCase } from './search-order.use-case';

describe('Order use cases', () => {
  let repository: InMemoryOrderRepository;
  let identityRepository: InMemoryIdentityRepository;
  let providerRepository: InMemoryProviderRepository;
  let serviceRepository: InMemoryServiceRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let identityId: string;
  let providerId: string;
  let serviceId: string;
  let categoryId: string;
  /** The customer who requests every Order created in these tests. */
  let customer: Caller;
  /** The Identity behind the seeded Provider record. */
  let assignedProvider: Caller;
  /** An authenticated user with no relationship to the Order at all. */
  const stranger: Caller = {
    identityId: 'a0000000-0000-4000-8000-000000000000',
    isAdmin: false,
  };
  const admin: Caller = {
    identityId: 'b0000000-0000-4000-8000-000000000000',
    isAdmin: true,
  };

  beforeEach(async () => {
    repository = new InMemoryOrderRepository();
    identityRepository = new InMemoryIdentityRepository();
    providerRepository = new InMemoryProviderRepository();
    serviceRepository = new InMemoryServiceRepository();
    categoryRepository = new InMemoryCategoryRepository();

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Order Customer',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;
    customer = { identityId, isAdmin: false };

    const providerIdentityId = IdentityId.create();
    assignedProvider = { identityId: providerIdentityId.value, isAdmin: false };
    const provider = new Provider(ProviderId.create(), {
      identityId: providerIdentityId,
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
    categoryId = category.id.value;

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
    serviceId = service.id.value;
  });

  function createCommand(overrides: Partial<{ title: string }> = {}) {
    return new CreateOrderCommand(
      identityId,
      categoryId,
      overrides.title ?? 'Fix the sink',
      'The kitchen sink is leaking',
      new Date('2026-01-01T08:00:00Z'),
      OrderPriority.Medium,
      providerId,
      serviceId,
    );
  }

  function useCase() {
    return new CreateOrderUseCase(
      repository,
      identityRepository,
      providerRepository,
      serviceRepository,
      categoryRepository,
    );
  }

  describe('CreateOrderUseCase', () => {
    it('creates a direct-hire Order in Pending status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.identityId).toBe(identityId);
      expect(dto.providerId).toBe(providerId);
      expect(dto.serviceId).toBe(serviceId);
      expect(dto.categoryId).toBe(categoryId);
      expect(dto.status).toBe(OrderStatus.Pending);
    });

    it('creates an open request with providerId/serviceId both null', async () => {
      const dto = await useCase().execute(
        new CreateOrderCommand(
          identityId,
          categoryId,
          'Open plumbing request',
          'Need a plumber, any compatible provider',
          new Date('2026-01-01T08:00:00Z'),
          OrderPriority.Medium,
        ),
      );

      expect(dto.providerId).toBeNull();
      expect(dto.serviceId).toBeNull();
      expect(dto.categoryId).toBe(categoryId);
      expect(dto.status).toBe(OrderStatus.Pending);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            'unknown-identity',
            categoryId,
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
            providerId,
            serviceId,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Category does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            identityId,
            'unknown-category',
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            identityId,
            categoryId,
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
            'unknown-provider',
            serviceId,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Service does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            identityId,
            categoryId,
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
            providerId,
            'unknown-service',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank title', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            identityId,
            categoryId,
            '  ',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
            providerId,
            serviceId,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects providing only one of providerId/serviceId', async () => {
      await expect(
        useCase().execute(
          new CreateOrderCommand(
            identityId,
            categoryId,
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            OrderPriority.Medium,
            providerId,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetOrderUseCase', () => {
    function getUseCase() {
      return new GetOrderUseCase(repository, providerRepository);
    }

    it('returns null when it does not exist', async () => {
      const result = await getUseCase().execute(
        new GetOrderQuery('unknown-id', customer),
      );
      expect(result).toBeNull();
    });

    it('returns the Order to the customer who requested it', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetOrderQuery(created.id, customer),
      );
      expect(result?.id).toBe(created.id);
    });

    it('returns the Order to the assigned Provider', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetOrderQuery(created.id, assignedProvider),
      );
      expect(result?.id).toBe(created.id);
    });

    it('throws ForbiddenException for an unrelated caller', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        getUseCase().execute(new GetOrderQuery(created.id, stranger)),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an Admin read any Order', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetOrderQuery(created.id, admin),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('UpdateOrderUseCase', () => {
    it('updates title, description, scheduledDate and priority', async () => {
      const created = await useCase().execute(createCommand());

      const updated = await new UpdateOrderUseCase(repository).execute(
        new UpdateOrderCommand(
          created.id,
          customer,
          'New title',
          'New description',
          new Date('2026-02-01T08:00:00Z'),
          OrderPriority.High,
        ),
      );

      expect(updated.title).toBe('New title');
      expect(updated.description).toBe('New description');
      expect(updated.priority).toBe(OrderPriority.High);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateOrderUseCase(repository).execute(
          new UpdateOrderCommand('unknown-id', customer, 'New title'),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it("throws ForbiddenException when the caller is not the Order's customer", async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new UpdateOrderUseCase(repository).execute(
          new UpdateOrderCommand(created.id, stranger, 'Hijacked title'),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException even for the assigned Provider', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new UpdateOrderUseCase(repository).execute(
          new UpdateOrderCommand(created.id, assignedProvider, 'New title'),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('CancelOrderUseCase', () => {
    function cancelUseCase() {
      return new CancelOrderUseCase(repository, providerRepository);
    }

    it('cancels an existing Order for the customer who requested it', async () => {
      const created = await useCase().execute(createCommand());

      const cancelled = await cancelUseCase().execute(
        new CancelOrderCommand(created.id, customer),
      );

      expect(cancelled.status).toBe(OrderStatus.Cancelled);
    });

    it('lets the assigned Provider cancel', async () => {
      const created = await useCase().execute(createCommand());

      const cancelled = await cancelUseCase().execute(
        new CancelOrderCommand(created.id, assignedProvider),
      );

      expect(cancelled.status).toBe(OrderStatus.Cancelled);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        cancelUseCase().execute(new CancelOrderCommand('unknown-id', customer)),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the caller is neither party to the Order', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        cancelUseCase().execute(new CancelOrderCommand(created.id, stranger)),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException for a Provider that is not assigned to the Order (open request)', async () => {
      const open = await useCase().execute(
        new CreateOrderCommand(
          identityId,
          categoryId,
          'Open plumbing request',
          'Need a plumber, any compatible provider',
          new Date('2026-01-01T08:00:00Z'),
          OrderPriority.Medium,
        ),
      );

      await expect(
        cancelUseCase().execute(
          new CancelOrderCommand(open.id, assignedProvider),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('StartOrderUseCase / CompleteOrderUseCase', () => {
    it('throws ForbiddenException when the caller is not the assigned Provider', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new StartOrderUseCase(repository, providerRepository).execute(
          new StartOrderCommand(created.id, stranger),
        ),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        new CompleteOrderUseCase(repository, providerRepository).execute(
          new CompleteOrderCommand(created.id, stranger),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException even for the customer who requested the Order', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new StartOrderUseCase(repository, providerRepository).execute(
          new StartOrderCommand(created.id, customer),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('reaches the status guard for the assigned Provider', async () => {
      const created = await useCase().execute(createCommand());

      // Authorized, but the Order is still Pending — the transition
      // guard is what rejects it now, not the ownership check.
      await expect(
        new StartOrderUseCase(repository, providerRepository).execute(
          new StartOrderCommand(created.id, assignedProvider),
        ),
      ).rejects.toThrow(BusinessRuleException);
    });
  });

  describe('ListOrderUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ title: 'A' }));
      await useCase().execute(createCommand({ title: 'B' }));

      const page = await new ListOrderUseCase(repository).execute(
        new ListOrderQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchOrderUseCase', () => {
    it('finds Orders by title', async () => {
      await useCase().execute(createCommand({ title: 'Special Order' }));

      const results = await new SearchOrderUseCase(repository).execute(
        new SearchOrderQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Special Order');
    });
  });
});
