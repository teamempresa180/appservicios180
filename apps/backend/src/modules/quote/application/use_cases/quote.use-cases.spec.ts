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
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { CreateQuoteCommand } from '../commands/create-quote.command';
import { UpdateQuoteCommand } from '../commands/update-quote.command';
import { AcceptQuoteCommand } from '../commands/accept-quote.command';
import { RejectQuoteCommand } from '../commands/reject-quote.command';
import { GetQuoteQuery } from '../queries/get-quote.query';
import { ListQuoteQuery } from '../queries/list-quote.query';
import { SearchQuoteQuery } from '../queries/search-quote.query';
import { InMemoryQuoteRepository } from './test-support/in-memory-quote.repository';
import { CreateQuoteUseCase } from './create-quote.use-case';
import { GetQuoteUseCase } from './get-quote.use-case';
import { UpdateQuoteUseCase } from './update-quote.use-case';
import { AcceptQuoteUseCase } from './accept-quote.use-case';
import { RejectQuoteUseCase } from './reject-quote.use-case';
import { ListQuoteUseCase } from './list-quote.use-case';
import { SearchQuoteUseCase } from './search-quote.use-case';

describe('Quote use cases', () => {
  let repository: InMemoryQuoteRepository;
  let orderRepository: InMemoryOrderRepository;
  let providerRepository: InMemoryProviderRepository;
  let orderId: string;
  let providerId: string;

  beforeEach(async () => {
    repository = new InMemoryQuoteRepository();
    orderRepository = new InMemoryOrderRepository();
    providerRepository = new InMemoryProviderRepository();
    const identityRepository = new InMemoryIdentityRepository();
    const serviceRepository = new InMemoryServiceRepository();
    const categoryRepository = new InMemoryCategoryRepository();

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
      identityId: identity.id,
      providerId: provider.id,
      serviceId: service.id,
      categoryId: service.categoryId,
      title: 'Fix the sink',
      description: 'The kitchen sink is leaking',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await orderRepository.save(order);
    orderId = order.id.value;
  });

  function createCommand(overrides: Partial<{ notes: string }> = {}) {
    return new CreateQuoteCommand(
      orderId,
      providerId,
      100,
      120,
      overrides.notes ?? 'Includes parts and labor',
      QuoteType.Standard,
    );
  }

  function useCase() {
    return new CreateQuoteUseCase(
      repository,
      orderRepository,
      providerRepository,
    );
  }

  describe('CreateQuoteUseCase', () => {
    it('creates a Quote in Pending status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.orderId).toBe(orderId);
      expect(dto.providerId).toBe(providerId);
      expect(dto.status).toBe(QuoteStatus.Pending);
    });

    it('throws NotFoundException when the Order does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateQuoteCommand(
            'unknown-order',
            providerId,
            100,
            120,
            'notes',
            QuoteType.Standard,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateQuoteCommand(
            orderId,
            'unknown-provider',
            100,
            120,
            'notes',
            QuoteType.Standard,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a negative proposedPrice', async () => {
      await expect(
        useCase().execute(
          new CreateQuoteCommand(
            orderId,
            providerId,
            -1,
            120,
            'notes',
            QuoteType.Standard,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetQuoteUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetQuoteUseCase(repository).execute(
        new GetQuoteQuery('unknown-id'),
      );
      expect(result).toBeNull();
    });

    it('returns the Quote when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetQuoteUseCase(repository).execute(
        new GetQuoteQuery(created.id),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('UpdateQuoteUseCase', () => {
    it('updates proposedPrice, estimatedDuration and notes', async () => {
      const created = await useCase().execute(createCommand());

      const updated = await new UpdateQuoteUseCase(repository).execute(
        new UpdateQuoteCommand(created.id, 150, 180, 'Updated notes'),
      );

      expect(updated.proposedPrice).toBe(150);
      expect(updated.estimatedDuration).toBe(180);
      expect(updated.notes).toBe('Updated notes');
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateQuoteUseCase(repository).execute(
          new UpdateQuoteCommand('unknown-id', 150),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('AcceptQuoteUseCase', () => {
    it('accepts an existing Quote', async () => {
      const created = await useCase().execute(createCommand());

      const accepted = await new AcceptQuoteUseCase(repository).execute(
        new AcceptQuoteCommand(created.id),
      );

      expect(accepted.status).toBe(QuoteStatus.Accepted);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new AcceptQuoteUseCase(repository).execute(
          new AcceptQuoteCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('RejectQuoteUseCase', () => {
    it('rejects an existing Quote', async () => {
      const created = await useCase().execute(createCommand());

      const rejected = await new RejectQuoteUseCase(repository).execute(
        new RejectQuoteCommand(created.id),
      );

      expect(rejected.status).toBe(QuoteStatus.Rejected);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new RejectQuoteUseCase(repository).execute(
          new RejectQuoteCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListQuoteUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ notes: 'A' }));
      await useCase().execute(createCommand({ notes: 'B' }));

      const page = await new ListQuoteUseCase(repository).execute(
        new ListQuoteQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchQuoteUseCase', () => {
    it('finds Quotes by notes', async () => {
      await useCase().execute(createCommand({ notes: 'Special Quote' }));

      const results = await new SearchQuoteUseCase(repository).execute(
        new SearchQuoteQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].notes).toBe('Special Quote');
    });
  });
});
