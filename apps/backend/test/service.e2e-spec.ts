import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { ServicePresentationModule } from '../src/modules/service/presentation/service.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { Category } from '../src/modules/category/domain/entities/category.entity';
import { CategoryId } from '../src/modules/category/domain/value-objects/category-id.value-object';
import { CategoryType } from '../src/modules/category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../src/modules/category/domain/value-objects/category-status.value-object';
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
import { ServiceType } from '../src/modules/service/domain/value-objects/service-type.value-object';
import { ServiceResponseDto } from '../src/modules/service/presentation/dto/service.response.dto';
import { ServiceListResponseDto } from '../src/modules/service/presentation/dto/service-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Service controller — same reasoning
 * as `identity.e2e-spec.ts`. `SERVICE_REPOSITORY`, `CATEGORY_REPOSITORY`
 * and `PROVIDER_REPOSITORY` (imported transitively via
 * `ServicePresentationModule`) are overridden with in-memory fakes,
 * pre-seeding one Category and one Provider. `IDENTITY_REPOSITORY`/
 * `PROFILE_REPOSITORY` are also overridden because
 * `ProviderPresentationModule` (imported transitively via
 * `ServicePresentationModule`) imports `IdentityPresentationModule`/
 * `ProfilesPresentationModule`, whose real `PrismaXRepository`
 * providers would otherwise need a live `PrismaService`.
 */
describe('ServiceController (e2e)', () => {
  let app: INestApplication<App>;
  let categoryId: string;
  let providerId: string;
  let providerIdentityId: string;
  let authHeader: string;
  let ownerAuthHeader: string;
  let otherProviderAuthHeader: string;

  beforeEach(async () => {
    const now = new Date();

    const categoryRepository = new InMemoryCategoryRepository();
    const category = new Category(CategoryId.create(), {
      name: 'Plumbing',
      description: 'Plumbing-related home services.',
      icon: 'wrench-icon',
      color: '#0088CC',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await categoryRepository.save(category);
    categoryId = category.id.value;

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
    providerIdentityId = provider.identityId.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ServicePresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(new InMemoryServiceRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(categoryRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    // Writes require the Provider role *and* ownership of the target
    // Provider, so the owner token carries the seeded Provider's own
    // Identity. `authHeader` stays a plain Customer: it is what the
    // read-only browsing cases use.
    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: 'test-identity', role: 'CUSTOMER' })}`;
    ownerAuthHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: providerIdentityId, role: 'PROVIDER' })}`;
    otherProviderAuthHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: 'another-identity', role: 'PROVIDER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const createServiceBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    providerId,
    categoryId,
    name: 'Pipe repair',
    description: 'Fixes leaking or broken pipes.',
    basePrice: 50.0,
    estimatedDuration: 60,
    type: ServiceType.Standard,
    ...overrides,
  });

  it('POST /services creates a Service and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody())
      .expect(201);

    const body = response.body as ServiceResponseDto;
    expect(body.providerId).toBe(providerId);
    expect(body.categoryId).toBe(categoryId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /services returns 404 when the Category does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody({ categoryId: 'unknown-category' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /services returns 404 when the Provider does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody({ providerId: 'unknown-provider' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /services refuses a Customer', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', authHeader)
      .send(createServiceBody())
      .expect(403);
  });

  it("POST /services refuses a Provider publishing under another Provider's id", async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', otherProviderAuthHeader)
      .send(createServiceBody())
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('POST /services rejects a zero basePrice', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody({ basePrice: 0 }))
      .expect(400);
  });

  it('POST /services rejects a fractional estimatedDuration', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody({ estimatedDuration: 30.5 }))
      .expect(400);
  });

  it('POST /services rejects an unknown field', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody({ status: 'ACTIVE' }))
      .expect(400);
  });

  it('GET /services/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/services/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /services/:id updates the basePrice', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/services/${createdId}`)
      .set('Authorization', ownerAuthHeader)
      .send({ basePrice: 55.0 })
      .expect(200);

    expect((response.body as ServiceResponseDto).basePrice).toBe(55.0);
  });

  it("PUT /services/:id refuses to edit another Provider's Service", async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/services/${createdId}`)
      .set('Authorization', otherProviderAuthHeader)
      .send({ basePrice: 1 })
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it("DELETE /services/:id refuses to delete another Provider's Service", async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/services/${createdId}`)
      .set('Authorization', otherProviderAuthHeader)
      .expect(403);
  });

  it('DELETE /services/:id deletes an existing Service', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/services/${createdId}`)
      .set('Authorization', ownerAuthHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/services/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /services lists Services page by page', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());

    const response = await request(app.getHttpServer())
      .get('/services')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ServiceListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /services/search searches by name', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', ownerAuthHeader)
      .send(createServiceBody());

    const response = await request(app.getHttpServer())
      .get('/services/search')
      .set('Authorization', authHeader)
      .query({ term: 'Pipe repair' })
      .expect(200);

    const body = response.body as ServiceResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe('Pipe repair');
  });
});
