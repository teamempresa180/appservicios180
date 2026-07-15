import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ServicePresentationModule } from '../src/modules/service/presentation/service.module';
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ServicePresentationModule],
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
    await app.init();
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
      .send(createServiceBody({ categoryId: 'unknown-category' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /services returns 404 when the Provider does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .send(createServiceBody({ providerId: 'unknown-provider' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /services/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer()).get('/services/unknown-id').expect(404);
  });

  it('PUT /services/:id updates the basePrice', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/services/${createdId}`)
      .send({ basePrice: 55.0 })
      .expect(200);

    expect((response.body as ServiceResponseDto).basePrice).toBe(55.0);
  });

  it('DELETE /services/:id deletes an existing Service', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .send(createServiceBody());
    const createdId = (created.body as ServiceResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/services/${createdId}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/services/${createdId}`)
      .expect(404);
  });

  it('GET /services lists Services page by page', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .send(createServiceBody());

    const response = await request(app.getHttpServer())
      .get('/services')
      .expect(200);

    const body = response.body as ServiceListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /services/search searches by name', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .send(createServiceBody());

    const response = await request(app.getHttpServer())
      .get('/services/search')
      .query({ term: 'Pipe repair' })
      .expect(200);

    const body = response.body as ServiceResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe('Pipe repair');
  });
});
