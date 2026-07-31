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
import { Quote } from '../../../quote/domain/entities/quote.entity';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../../quote/domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../../quote/domain/value-objects/quote-type.value-object';
import { InMemoryQuoteRepository } from '../../../quote/application/use_cases/test-support/in-memory-quote.repository';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentCommand } from '../commands/create-payment.command';
import { UpdatePaymentCommand } from '../commands/update-payment.command';
import { CancelPaymentCommand } from '../commands/cancel-payment.command';
import { GetPaymentQuery } from '../queries/get-payment.query';
import { ListPaymentQuery } from '../queries/list-payment.query';
import { SearchPaymentQuery } from '../queries/search-payment.query';
import { InMemoryPaymentRepository } from './test-support/in-memory-payment.repository';
import { CreatePaymentUseCase } from './create-payment.use-case';
import { GetPaymentUseCase } from './get-payment.use-case';
import { UpdatePaymentUseCase } from './update-payment.use-case';
import { CancelPaymentUseCase } from './cancel-payment.use-case';
import { ListPaymentUseCase } from './list-payment.use-case';
import { SearchPaymentUseCase } from './search-payment.use-case';

describe('Payment use cases', () => {
  let repository: InMemoryPaymentRepository;
  let quoteRepository: InMemoryQuoteRepository;
  let orderRepository: InMemoryOrderRepository;
  let identityRepository: InMemoryIdentityRepository;
  let providerRepository: InMemoryProviderRepository;
  let quoteId: string;
  let orderId: string;
  let payerIdentityId: string;
  let providerId: string;

  beforeEach(async () => {
    repository = new InMemoryPaymentRepository();
    quoteRepository = new InMemoryQuoteRepository();
    orderRepository = new InMemoryOrderRepository();
    identityRepository = new InMemoryIdentityRepository();
    providerRepository = new InMemoryProviderRepository();
    const serviceRepository = new InMemoryServiceRepository();
    const categoryRepository = new InMemoryCategoryRepository();

    const now = new Date();
    const payer = new Identity(IdentityId.create(), {
      fullName: 'Payment Payer',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(payer);
    payerIdentityId = payer.id.value;

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
      identityId: payer.id,
      providerId: provider.id,
      serviceId: service.id,
      categoryId: service.categoryId,
      addressId: null,
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

    const quote = new Quote(QuoteId.create(), {
      orderId: order.id,
      providerId: provider.id,
      proposedPrice: 100,
      estimatedDuration: 120,
      notes: 'Includes parts and labor',
      status: QuoteStatus.Accepted,
      type: QuoteType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await quoteRepository.save(quote);
    quoteId = quote.id.value;
  });

  function createCommand(overrides: Partial<{ amount: number }> = {}) {
    return new CreatePaymentCommand(
      quoteId,
      orderId,
      payerIdentityId,
      providerId,
      overrides.amount ?? 100,
      PaymentMethod.Card,
    );
  }

  function useCase() {
    return new CreatePaymentUseCase(
      repository,
      quoteRepository,
      orderRepository,
      identityRepository,
      providerRepository,
    );
  }

  describe('CreatePaymentUseCase', () => {
    it('creates a Payment in Pending status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.quoteId).toBe(quoteId);
      expect(dto.orderId).toBe(orderId);
      expect(dto.status).toBe(PaymentStatus.Pending);
    });

    it('throws NotFoundException when the Quote does not exist', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            'unknown-quote',
            orderId,
            payerIdentityId,
            providerId,
            100,
            PaymentMethod.Card,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Order does not exist', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            quoteId,
            'unknown-order',
            payerIdentityId,
            providerId,
            100,
            PaymentMethod.Card,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the payer Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            quoteId,
            orderId,
            'unknown-identity',
            providerId,
            100,
            PaymentMethod.Card,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the receiver Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            quoteId,
            orderId,
            payerIdentityId,
            'unknown-provider',
            100,
            PaymentMethod.Card,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a non-positive amount', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            quoteId,
            orderId,
            payerIdentityId,
            providerId,
            0,
            PaymentMethod.Card,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetPaymentUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetPaymentUseCase(repository).execute(
        new GetPaymentQuery('unknown-id'),
      );
      expect(result).toBeNull();
    });

    it('returns the Payment when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetPaymentUseCase(repository).execute(
        new GetPaymentQuery(created.id),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('UpdatePaymentUseCase', () => {
    it('updates status', async () => {
      const created = await useCase().execute(createCommand());

      const updated = await new UpdatePaymentUseCase(repository).execute(
        new UpdatePaymentCommand(created.id, PaymentStatus.Completed),
      );

      expect(updated.status).toBe(PaymentStatus.Completed);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdatePaymentUseCase(repository).execute(
          new UpdatePaymentCommand('unknown-id', PaymentStatus.Completed),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('CancelPaymentUseCase', () => {
    it('cancels an existing Payment', async () => {
      const created = await useCase().execute(createCommand());

      const cancelled = await new CancelPaymentUseCase(repository).execute(
        new CancelPaymentCommand(created.id),
      );

      expect(cancelled.status).toBe(PaymentStatus.Cancelled);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new CancelPaymentUseCase(repository).execute(
          new CancelPaymentCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListPaymentUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ amount: 50 }));
      await useCase().execute(createCommand({ amount: 75 }));

      const page = await new ListPaymentUseCase(repository).execute(
        new ListPaymentQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchPaymentUseCase', () => {
    it('finds Payments by method', async () => {
      await useCase().execute(createCommand());

      const results = await new SearchPaymentUseCase(repository).execute(
        new SearchPaymentQuery('card'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].method).toBe(PaymentMethod.Card);
    });
  });
});
