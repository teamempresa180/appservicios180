import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
import { CATEGORY_SPECIALIZATION_REPOSITORY } from '../src/modules/category/domain/interfaces/category-specialization-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { InMemoryCategorySpecializationRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category-specialization.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../src/modules/category/domain/value-objects/category-id.value-object';
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
  /** The Provider that submits the Quotes — the only role allowed to. */
  let providerAuthHeader: string;
  /** The customer who requested the seeded Order — decides on Quotes. */
  let customerAuthHeader: string;
  /** Authenticated, but on neither side of the Quote. */
  let strangerAuthHeader: string;
  let orderId: string;
  let providerId: string;

  beforeEach(async () => {
    const now = new Date();

    const customerIdentityId = IdentityId.create();
    const orderRepository = new InMemoryOrderRepository();
    const order = new Order(OrderId.create(), {
      identityId: customerIdentityId,
      providerId: null,
      serviceId: null,
      categoryId: CategoryId.create(),
      addressId: null,
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

    const providerIdentityId = IdentityId.create();
    const providerRepository = new InMemoryProviderRepository();
    const provider = new Provider(ProviderId.create(), {
      identityId: providerIdentityId,
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
      .overrideProvider(CATEGORY_SPECIALIZATION_REPOSITORY)
      .useValue(new InMemoryCategorySpecializationRepository())
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(new InMemoryServiceRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    // Mirrors the global pipe `main.ts` installs, so this suite
    // exercises the same DTO validation production runs.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    const config = app.get(ConfigService);
    providerAuthHeader = `Bearer ${signTestAccessToken(config, { sub: providerIdentityId.value, role: 'PROVIDER' })}`;
    customerAuthHeader = `Bearer ${signTestAccessToken(config, { sub: customerIdentityId.value, role: 'CUSTOMER' })}`;
    strangerAuthHeader = `Bearer ${signTestAccessToken(config, { sub: randomUUID(), role: 'CUSTOMER' })}`;
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

  /** Submits the seeded Provider's Quote and returns its id. */
  async function createQuote(): Promise<string> {
    const created = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', providerAuthHeader)
      .send(createQuoteBody());
    return (created.body as QuoteResponseDto).id;
  }

  it('POST /quotes creates a Quote and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', providerAuthHeader)
      .send(createQuoteBody())
      .expect(201);

    const body = response.body as QuoteResponseDto;
    expect(body.orderId).toBe(orderId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /quotes returns 403 for a caller without the Provider role', async () => {
    await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', customerAuthHeader)
      .send(createQuoteBody())
      .expect(403);
  });

  it('POST /quotes returns 403 when quoting under a Provider the caller does not own', async () => {
    const otherProvider = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: randomUUID(), role: 'PROVIDER' })}`;

    const response = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', otherProvider)
      .send(createQuoteBody())
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('POST /quotes returns 404 when the Order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', providerAuthHeader)
      .send(createQuoteBody({ orderId: randomUUID() }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /quotes returns 400 for a fractional estimatedDuration', async () => {
    await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', providerAuthHeader)
      .send(createQuoteBody({ estimatedDuration: 90.5 }))
      .expect(400);
  });

  it('POST /quotes returns 400 for a non-positive proposedPrice', async () => {
    await request(app.getHttpServer())
      .post('/quotes')
      .set('Authorization', providerAuthHeader)
      .send(createQuoteBody({ proposedPrice: 0 }))
      .expect(400);
  });

  it('GET /quotes/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/quotes/unknown-id')
      .set('Authorization', customerAuthHeader)
      .expect(404);
  });

  it('PUT /quotes/:id updates the proposedPrice for the quoting Provider', async () => {
    const createdId = await createQuote();

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}`)
      .set('Authorization', providerAuthHeader)
      .send({ proposedPrice: 80.0 })
      .expect(200);

    expect((response.body as QuoteResponseDto).proposedPrice).toBe(80.0);
  });

  it('PUT /quotes/:id returns 403 for the customer receiving the Quote', async () => {
    const createdId = await createQuote();

    await request(app.getHttpServer())
      .put(`/quotes/${createdId}`)
      .set('Authorization', customerAuthHeader)
      .send({ proposedPrice: 1 })
      .expect(403);
  });

  it('PUT /quotes/:id/accept accepts an existing Quote for the Order customer', async () => {
    const createdId = await createQuote();

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}/accept`)
      .set('Authorization', customerAuthHeader)
      .expect(200);

    expect((response.body as QuoteResponseDto).status).toBe('ACCEPTED');
  });

  it('PUT /quotes/:id/accept returns 403 for anyone but the Order customer', async () => {
    const createdId = await createQuote();

    await request(app.getHttpServer())
      .put(`/quotes/${createdId}/accept`)
      .set('Authorization', strangerAuthHeader)
      .expect(403);
    await request(app.getHttpServer())
      .put(`/quotes/${createdId}/accept`)
      .set('Authorization', providerAuthHeader)
      .expect(403);
  });

  it('PUT /quotes/:id/reject rejects an existing Quote for the Order customer', async () => {
    const createdId = await createQuote();

    const response = await request(app.getHttpServer())
      .put(`/quotes/${createdId}/reject`)
      .set('Authorization', customerAuthHeader)
      .expect(200);

    expect((response.body as QuoteResponseDto).status).toBe('REJECTED');
  });

  it('PUT /quotes/:id/reject returns 403 for a caller who is not the Order customer', async () => {
    const createdId = await createQuote();

    await request(app.getHttpServer())
      .put(`/quotes/${createdId}/reject`)
      .set('Authorization', strangerAuthHeader)
      .expect(403);
  });

  it('GET /quotes lists the caller’s own Quotes page by page', async () => {
    await createQuote();

    for (const header of [providerAuthHeader, customerAuthHeader]) {
      const response = await request(app.getHttpServer())
        .get('/quotes')
        .set('Authorization', header)
        .expect(200);

      const body = response.body as QuoteListResponseDto;
      expect(body.items).toHaveLength(1);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(20);
    }
  });

  it('GET /quotes hides Quotes the caller is not a party to', async () => {
    await createQuote();

    const response = await request(app.getHttpServer())
      .get('/quotes')
      .set('Authorization', strangerAuthHeader)
      .expect(200);

    const body = response.body as QuoteListResponseDto;
    expect(body.items).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  it('GET /quotes/search searches by notes within the caller’s own Quotes', async () => {
    await createQuote();

    const response = await request(app.getHttpServer())
      .get('/quotes/search')
      .set('Authorization', providerAuthHeader)
      .query({ term: 'labor' })
      .expect(200);

    const body = response.body as QuoteResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].notes).toBe('Includes parts and labor.');
  });

  it('GET /quotes/search hides matches the caller is not a party to', async () => {
    await createQuote();

    const response = await request(app.getHttpServer())
      .get('/quotes/search')
      .set('Authorization', strangerAuthHeader)
      .query({ term: 'labor' })
      .expect(200);

    expect(response.body as QuoteResponseDto[]).toHaveLength(0);
  });
});
