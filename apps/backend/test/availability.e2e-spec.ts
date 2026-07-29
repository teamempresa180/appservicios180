import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { AvailabilityPresentationModule } from '../src/modules/availability/presentation/availability.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { AVAILABILITY_REPOSITORY } from '../src/modules/availability/domain/interfaces/availability-repository.interface';
import { InMemoryAvailabilityRepository } from '../src/modules/availability/application/use_cases/test-support/in-memory-availability.repository';
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
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { AvailabilityType } from '../src/modules/availability/domain/value-objects/availability-type.value-object';
import { AvailabilityResponseDto } from '../src/modules/availability/presentation/dto/availability.response.dto';
import { AvailabilityListResponseDto } from '../src/modules/availability/presentation/dto/availability-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Availability controller — same
 * reasoning as `identity.e2e-spec.ts`. `AVAILABILITY_REPOSITORY` and
 * `PROVIDER_REPOSITORY` (imported transitively via
 * `AvailabilityPresentationModule` → `ProviderPresentationModule`)
 * are overridden with in-memory fakes, pre-seeding one Provider.
 * `IDENTITY_REPOSITORY`/`PROFILE_REPOSITORY` are also overridden
 * because `ProviderPresentationModule` imports
 * `IdentityPresentationModule`/`ProfilesPresentationModule`, whose
 * real `PrismaXRepository` providers would otherwise need a live
 * `PrismaService` — same reasoning as `provider.e2e-spec.ts`.
 */
describe('AvailabilityController (e2e)', () => {
  let app: INestApplication<App>;
  let providerId: string;
  let authHeader: string;

  beforeEach(async () => {
    const now = new Date();
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
        AvailabilityPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(AVAILABILITY_REPOSITORY)
      .useValue(new InMemoryAvailabilityRepository())
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(new InMemoryCategoryRepository())
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

  const createAvailabilityBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    providerId,
    type: AvailabilityType.FullTime,
    availableFrom: '2026-01-01T08:00:00.000Z',
    availableTo: '2026-01-01T18:00:00.000Z',
    ...overrides,
  });

  it('POST /availabilities creates an Availability and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody())
      .expect(201);

    const body = response.body as AvailabilityResponseDto;
    expect(body.providerId).toBe(providerId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /availabilities returns 404 when the Provider does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody({ providerId: 'unknown-provider' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /availabilities returns 400 when availableFrom is after availableTo', async () => {
    const response = await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(
        createAvailabilityBody({
          availableFrom: '2026-01-01T18:00:00.000Z',
          availableTo: '2026-01-01T08:00:00.000Z',
        }),
      )
      .expect(400);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ValidationException',
    );
  });

  it('GET /availabilities/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/availabilities/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /availabilities/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody());
    const createdId = (created.body as AvailabilityResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/availabilities/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'INACTIVE' })
      .expect(200);

    expect((response.body as AvailabilityResponseDto).status).toBe('INACTIVE');
  });

  it('DELETE /availabilities/:id deletes an existing Availability', async () => {
    const created = await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody());
    const createdId = (created.body as AvailabilityResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/availabilities/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/availabilities/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /availabilities lists Availabilities page by page', async () => {
    await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody());

    const response = await request(app.getHttpServer())
      .get('/availabilities')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as AvailabilityListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /availabilities/search searches by type', async () => {
    await request(app.getHttpServer())
      .post('/availabilities')
      .set('Authorization', authHeader)
      .send(createAvailabilityBody());

    const response = await request(app.getHttpServer())
      .get('/availabilities/search')
      .set('Authorization', authHeader)
      .query({ term: 'FULL_TIME' })
      .expect(200);

    const body = response.body as AvailabilityResponseDto[];
    expect(body).toHaveLength(1);
  });
});
