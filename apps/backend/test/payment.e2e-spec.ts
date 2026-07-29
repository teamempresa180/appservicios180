import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { PaymentPresentationModule } from '../src/modules/payment/presentation/payment.module';
import { PAYMENT_REPOSITORY } from '../src/modules/payment/domain/interfaces/payment-repository.interface';
import { InMemoryPaymentRepository } from '../src/modules/payment/application/use_cases/test-support/in-memory-payment.repository';
import { QUOTE_REPOSITORY } from '../src/modules/quote/domain/interfaces/quote-repository.interface';
import { InMemoryQuoteRepository } from '../src/modules/quote/application/use_cases/test-support/in-memory-quote.repository';
import { Quote } from '../src/modules/quote/domain/entities/quote.entity';
import { QuoteId } from '../src/modules/quote/domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../src/modules/quote/domain/value-objects/quote-status.value-object';
import { QuoteType } from '../src/modules/quote/domain/value-objects/quote-type.value-object';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { Order } from '../src/modules/order/domain/entities/order.entity';
import { OrderId } from '../src/modules/order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../src/modules/order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../src/modules/order/domain/value-objects/order-priority.value-object';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../src/modules/provider/domain/entities/provider.entity';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../src/modules/provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../src/modules/category/domain/value-objects/category-id.value-object';
import { PaymentMethod } from '../src/modules/payment/domain/value-objects/payment-method.value-object';
import { PaymentResponseDto } from '../src/modules/payment/presentation/dto/payment.response.dto';
import { PaymentListResponseDto } from '../src/modules/payment/presentation/dto/payment-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Payment controller — same reasoning
 * as `quote.e2e-spec.ts`. `PAYMENT_REPOSITORY`, `QUOTE_REPOSITORY`,
 * `ORDER_REPOSITORY`, `IDENTITY_REPOSITORY` and `PROVIDER_REPOSITORY`
 * (imported transitively via `PaymentPresentationModule`) are
 * overridden with in-memory fakes, pre-seeding one Quote, one Order,
 * one Identity and one Provider. `PROFILE_REPOSITORY`/
 * `CATEGORY_REPOSITORY`/`SERVICE_REPOSITORY` are also overridden
 * because `OrderPresentationModule`/`ProviderPresentationModule`
 * (imported transitively) depend on them, whose real
 * `PrismaXRepository` providers would otherwise need a live
 * `PrismaService`.
 */
describe('PaymentController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;
  let quoteId: string;
  let orderId: string;
  let identityId: string;
  let providerId: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Payer',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;

    const providerRepository = new InMemoryProviderRepository();
    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.create(),
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Plumber with 10 years of experience.',
      yearsOfExperience: 10,
      createdAt: now,
      updatedAt: now,
    });
    await providerRepository.save(provider);
    providerId = provider.id.value;

    const orderRepository = new InMemoryOrderRepository();
    const order = new Order(OrderId.create(), {
      identityId: IdentityId.create(),
      providerId: ProviderId.create(),
      serviceId: ServiceId.create(),
      categoryId: CategoryId.create(),
      title: 'Fix leaking kitchen faucet',
      description: 'Description.',
      scheduledDate: now,
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await orderRepository.save(order);
    orderId = order.id.value;

    const quoteRepository = new InMemoryQuoteRepository();
    const quote = new Quote(QuoteId.create(), {
      orderId: OrderId.create(),
      providerId: ProviderId.create(),
      proposedPrice: 75.0,
      estimatedDuration: 90,
      notes: 'Includes parts and labor.',
      status: QuoteStatus.Accepted,
      type: QuoteType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await quoteRepository.save(quote);
    quoteId = quote.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        PaymentPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(PAYMENT_REPOSITORY)
      .useValue(new InMemoryPaymentRepository())
      .overrideProvider(QUOTE_REPOSITORY)
      .useValue(quoteRepository)
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(orderRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(new InMemoryCategoryRepository())
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(new InMemoryServiceRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    await app.init();

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: identityId, role: 'CUSTOMER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const createPaymentBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    quoteId,
    orderId,
    payerIdentityId: identityId,
    receiverProviderId: providerId,
    amount: 75.0,
    method: PaymentMethod.Card,
    ...overrides,
  });

  it('POST /payments creates a Payment and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody())
      .expect(201);

    const body = response.body as PaymentResponseDto;
    expect(body.quoteId).toBe(quoteId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /payments returns 404 when the Quote does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody({ quoteId: 'unknown-quote' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /payments/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/payments/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /payments/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody());
    const createdId = (created.body as PaymentResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/payments/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'COMPLETED' })
      .expect(200);

    expect((response.body as PaymentResponseDto).status).toBe('COMPLETED');
  });

  it('PUT /payments/:id/cancel cancels an existing Payment', async () => {
    const created = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody());
    const createdId = (created.body as PaymentResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/payments/${createdId}/cancel`)
      .set('Authorization', authHeader)
      .expect(200);

    expect((response.body as PaymentResponseDto).status).toBe('CANCELLED');
  });

  it('GET /payments lists Payments page by page', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody());

    const response = await request(app.getHttpServer())
      .get('/payments')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as PaymentListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /payments/search searches by method', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', authHeader)
      .send(createPaymentBody());

    const response = await request(app.getHttpServer())
      .get('/payments/search')
      .set('Authorization', authHeader)
      .query({ term: 'CARD' })
      .expect(200);

    const body = response.body as PaymentResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].method).toBe('CARD');
  });
});
