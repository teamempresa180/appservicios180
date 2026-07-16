import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { QuotePresentationModule } from '../src/modules/quote/presentation/quote.module';
import { QUOTE_REPOSITORY } from '../src/modules/quote/domain/interfaces/quote-repository.interface';
import { InMemoryQuoteRepository } from '../src/modules/quote/application/use_cases/test-support/in-memory-quote.repository';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { Order } from '../src/modules/order/domain/entities/order.entity';
import { OrderId } from '../src/modules/order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../src/modules/order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../src/modules/order/domain/value-objects/order-priority.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../src/modules/provider/domain/entities/provider.entity';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../src/modules/provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { QuoteType } from '../src/modules/quote/domain/value-objects/quote-type.value-object';
import { QuoteResponseDto } from '../src/modules/quote/presentation/dto/quote.response.dto';
import { QuoteListResponseDto } from '../src/modules/quote/presentation/dto/quote-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Quote controller — same reasoning as
 * `identity.e2e-spec.ts`. `QUOTE_REPOSITORY`, `ORDER_REPOSITORY` and
 * `PROVIDER_REPOSITORY` (imported transitively via
 * `QuotePresentationModule`) are overridden with in-memory fakes,
 * pre-seeding one Order and one Provider. `IDENTITY_REPOSITORY`/
 * `PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY`/`SERVICE_REPOSITORY` are
 * also overridden because `OrderPresentationModule` (imported
 * transitively via `QuotePresentationModule` → `OrderPresentationModule`)
 * imports `IdentityPresentationModule`/`ProviderPresentationModule`/
 * `ServicePresentationModule`, whose real `PrismaXRepository`
 * providers would otherwise need a live `PrismaService`.
 */
describe('QuoteController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;
  let orderId: string;
  let providerId: string;

  beforeEach(async () => {
    const now = new Date();

    const orderRepository = new InMemoryOrderRepository();
    const order = new Order(OrderId.create(), {
      identityId: IdentityId.create(),
      providerId: ProviderId.create(),
      serviceId: ServiceId.create(),
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        QuotePresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(QUOTE_REPOSITORY)
      .useValue(new InMemoryQuoteRepository())
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(orderRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
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

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: 'test-identity', role: 'CUSTOMER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const createQuoteBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    orderId,
    providerId,
    proposedPrice: 75.0,
    estimatedDuration: 90,
    notes: 'Includes parts and labor.',
    type: QuoteType.Standard,
    ...overrides,
  });

  it('POST /quotes creates a Quote and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody())
      .expect(201);

    const body = response.body as QuoteResponseDto;
    expect(body.orderId).toBe(orderId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /quotes returns 404 when the Order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody({ orderId: 'unknown-order' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /quotes/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/quotes/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /quotes/:id updates the proposedPrice', async () => {
    const created = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody());
    const createdId = (created.body as QuoteResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}`)
      .set('Authorization', authHeader)
      .send({ proposedPrice: 80.0 })
      .expect(200);

    expect((response.body as QuoteResponseDto).proposedPrice).toBe(80.0);
  });

  it('PUT /quotes/:id/accept accepts an existing Quote', async () => {
    const created = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody());
    const createdId = (created.body as QuoteResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}/accept`)
      .set('Authorization', authHeader)
      .expect(200);

    expect((response.body as QuoteResponseDto).status).toBe('ACCEPTED');
  });

  it('PUT /quotes/:id/reject rejects an existing Quote', async () => {
    const created = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody());
    const createdId = (created.body as QuoteResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}/reject`)
      .set('Authorization', authHeader)
      .expect(200);

    expect((response.body as QuoteResponseDto).status).toBe('REJECTED');
  });

  it('GET /quotes lists Quotes page by page', async () => {
    await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody());

    const response = await request(app.getHttpServer())
      .get('/quotes')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as QuoteListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /quotes/search searches by notes', async () => {
    await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', authHeader)
      .send(createQuoteBody());

    const response = await request(app.getHttpServer())
      .get('/quotes/search')
      .set('Authorization', authHeader)
      .query({ term: 'labor' })
      .expect(200);

    const body = response.body as QuoteResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].notes).toBe('Includes parts and labor.');
  });
});
