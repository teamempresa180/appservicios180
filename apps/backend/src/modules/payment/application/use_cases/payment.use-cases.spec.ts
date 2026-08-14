import { Caller } from '../../../core/application/caller';
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
  /** The Identity that pays for every Payment created here. */
  let payerCaller: Caller;
  /** The Identity behind the Provider receiving those Payments. */
  let receiverCaller: Caller;
  /** Authenticated, but on neither end of the Payment. */
  const stranger: Caller = {
    identityId: 'a0000000-0000-4000-8000-000000000000',
    isAdmin: false,
  };

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
    payerCaller = { identityId: payerIdentityId, isAdmin: false };

    const providerIdentityId = IdentityId.create();
    receiverCaller = { identityId: providerIdentityId.value, isAdmin: false };
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
      payerCaller,
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
            payerCaller,
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
            payerCaller,
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
            // The caller *is* the unknown payer, so this gets past the
            // "pay only as yourself" check and reaches the existence
            // check it is testing.
            { identityId: 'unknown-identity', isAdmin: false },
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when paying in another Identity’s name', async () => {
      await expect(
        useCase().execute(
          new CreatePaymentCommand(
            quoteId,
            orderId,
            payerIdentityId,
            providerId,
            100,
            PaymentMethod.Card,
            stranger,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
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
            payerCaller,
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
            payerCaller,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetPaymentUseCase', () => {
    function getUseCase() {
      return new GetPaymentUseCase(repository, providerRepository);
    }

    it('returns null when it does not exist', async () => {
      const result = await getUseCase().execute(
        new GetPaymentQuery('unknown-id', payerCaller),
      );
      expect(result).toBeNull();
    });

    it('returns the Payment to its payer', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetPaymentQuery(created.id, payerCaller),
      );
      expect(result?.id).toBe(created.id);
    });

    it('returns the Payment to the receiving Provider', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetPaymentQuery(created.id, receiverCaller),
      );
      expect(result?.id).toBe(created.id);
    });

    it('throws ForbiddenException for a third party', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        getUseCase().execute(new GetPaymentQuery(created.id, stranger)),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('UpdatePaymentUseCase', () => {
    it('updates status for the payer', async () => {
      const created = await useCase().execute(createCommand());

      const updated = await new UpdatePaymentUseCase(repository).execute(
        new UpdatePaymentCommand(
          created.id,
          payerCaller,
          PaymentStatus.Completed,
        ),
      );

      expect(updated.status).toBe(PaymentStatus.Completed);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdatePaymentUseCase(repository).execute(
          new UpdatePaymentCommand(
            'unknown-id',
            payerCaller,
            PaymentStatus.Completed,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for the receiving Provider', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new UpdatePaymentUseCase(repository).execute(
          new UpdatePaymentCommand(
            created.id,
            receiverCaller,
            PaymentStatus.Completed,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('CancelPaymentUseCase', () => {
    it('cancels an existing Payment for the payer', async () => {
      const created = await useCase().execute(createCommand());

      const cancelled = await new CancelPaymentUseCase(repository).execute(
        new CancelPaymentCommand(created.id, payerCaller),
      );

      expect(cancelled.status).toBe(PaymentStatus.Cancelled);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new CancelPaymentUseCase(repository).execute(
          new CancelPaymentCommand('unknown-id', payerCaller),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for anyone but the payer', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new CancelPaymentUseCase(repository).execute(
          new CancelPaymentCommand(created.id, stranger),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListPaymentUseCase', () => {
    function listUseCase() {
      return new ListPaymentUseCase(repository, providerRepository);
    }

    it('paginates the payer’s own Payments', async () => {
      await useCase().execute(createCommand({ amount: 50 }));
      await useCase().execute(createCommand({ amount: 75 }));

      const page = await listUseCase().execute(
        new ListPaymentQuery(payerCaller, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });

    it('shows the receiving Provider the Payments made to them', async () => {
      await useCase().execute(createCommand());

      const page = await listUseCase().execute(
        new ListPaymentQuery(receiverCaller),
      );

      expect(page.total).toBe(1);
    });

    it('shows nothing to a third party', async () => {
      await useCase().execute(createCommand());

      const page = await listUseCase().execute(new ListPaymentQuery(stranger));

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('shows everything to an Admin', async () => {
      await useCase().execute(createCommand());

      const page = await listUseCase().execute(
        new ListPaymentQuery({ identityId: 'admin-1', isAdmin: true }),
      );

      expect(page.total).toBe(1);
    });
  });

  describe('SearchPaymentUseCase', () => {
    function searchUseCase() {
      return new SearchPaymentUseCase(repository, providerRepository);
    }

    it('finds the caller’s own Payments by method', async () => {
      await useCase().execute(createCommand());

      const results = await searchUseCase().execute(
        new SearchPaymentQuery('card', payerCaller),
      );

      expect(results).toHaveLength(1);
      expect(results[0].method).toBe(PaymentMethod.Card);
    });

    it('drops matches belonging to third parties', async () => {
      await useCase().execute(createCommand());

      const results = await searchUseCase().execute(
        new SearchPaymentQuery('card', stranger),
      );

      expect(results).toHaveLength(0);
    });
  });
});
