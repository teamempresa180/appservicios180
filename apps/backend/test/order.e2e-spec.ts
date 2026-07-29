import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { OrderPresentationModule } from '../src/modules/order/presentation/order.module';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../src/modules/provider/domain/entities/provider.entity';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../src/modules/provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { Category } from '../src/modules/category/domain/entities/category.entity';
import { CategoryType } from '../src/modules/category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../src/modules/category/domain/value-objects/category-status.value-object';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { Service } from '../src/modules/service/domain/entities/service.entity';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../src/modules/service/domain/value-objects/service-status.value-object';
import { ServiceType } from '../src/modules/service/domain/value-objects/service-type.value-object';
import { CategoryId } from '../src/modules/category/domain/value-objects/category-id.value-object';
import { OrderPriority } from '../src/modules/order/domain/value-objects/order-priority.value-object';
import { OrderResponseDto } from '../src/modules/order/presentation/dto/order.response.dto';
import { OrderListResponseDto } from '../src/modules/order/presentation/dto/order-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Order controller — same reasoning as
 * `identity.e2e-spec.ts`. `ORDER_REPOSITORY`, `IDENTITY_REPOSITORY`,
 * `PROVIDER_REPOSITORY` and `SERVICE_REPOSITORY` (imported
 * transitively via `OrderPresentationModule`) are overridden with
 * in-memory fakes, pre-seeding one Identity, one Provider and one
 * Service. `PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY` are also
 * overridden because `ProviderPresentationModule`/
 * `ServicePresentationModule` (imported transitively) depend on them,
 * whose real `PrismaXRepository` providers would otherwise need a
 * live `PrismaService`.
 */
describe('OrderController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;
  let identityId: string;
  let providerId: string;
  let serviceId: string;
  let categoryId: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
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

    const categoryRepository = new InMemoryCategoryRepository();
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

    const serviceRepository = new InMemoryServiceRepository();
    const service = new Service(ServiceId.create(), {
      providerId: provider.id,
      categoryId: category.id,
      name: 'Pipe repair',
      description: 'Fixes leaking or broken pipes.',
      basePrice: 50.0,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await serviceRepository.save(service);
    serviceId = service.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        OrderPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(new InMemoryOrderRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(serviceRepository)
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(categoryRepository)
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

  const createOrderBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    identityId,
    categoryId,
    providerId,
    serviceId,
    title: 'Fix leaking kitchen faucet',
    description:
      'The faucet under the kitchen sink has been leaking for a week.',
    scheduledDate: '2026-02-01T09:00:00.000Z',
    priority: OrderPriority.Medium,
    ...overrides,
  });

  it('POST /orders creates an Order and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody())
      .expect(201);

    const body = response.body as OrderResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /orders returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody({ identityId: 'unknown-identity' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /orders/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/orders/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /orders/:id updates the title', async () => {
    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody());
    const createdId = (created.body as OrderResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/orders/${createdId}`)
      .set('Authorization', authHeader)
      .send({ title: 'Updated Title' })
      .expect(200);

    expect((response.body as OrderResponseDto).title).toBe('Updated Title');
  });

  it('PUT /orders/:id/cancel cancels an existing Order', async () => {
    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody());
    const createdId = (created.body as OrderResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/orders/${createdId}/cancel`)
      .set('Authorization', authHeader)
      .expect(200);

    expect((response.body as OrderResponseDto).status).toBe('CANCELLED');
  });

  it('GET /orders lists Orders page by page', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody());

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as OrderListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /orders/search searches by title', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', authHeader)
      .send(createOrderBody());

    const response = await request(app.getHttpServer())
      .get('/orders/search')
      .set('Authorization', authHeader)
      .query({ term: 'faucet' })
      .expect(200);

    const body = response.body as OrderResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Fix leaking kitchen faucet');
  });
});
