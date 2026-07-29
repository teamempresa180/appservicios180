import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { SchedulePresentationModule } from '../src/modules/schedule/presentation/schedule.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { SCHEDULE_REPOSITORY } from '../src/modules/schedule/domain/interfaces/schedule-repository.interface';
import { InMemoryScheduleRepository } from '../src/modules/schedule/application/use_cases/test-support/in-memory-schedule.repository';
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
import { ScheduleType } from '../src/modules/schedule/domain/value-objects/schedule-type.value-object';
import { ScheduleResponseDto } from '../src/modules/schedule/presentation/dto/schedule.response.dto';
import { ScheduleListResponseDto } from '../src/modules/schedule/presentation/dto/schedule-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Schedule controller — same reasoning
 * as `identity.e2e-spec.ts`. `SCHEDULE_REPOSITORY` and
 * `PROVIDER_REPOSITORY` (imported transitively via
 * `SchedulePresentationModule` → `ProviderPresentationModule`) are
 * overridden with in-memory fakes, pre-seeding one Provider.
 * `IDENTITY_REPOSITORY`/`PROFILE_REPOSITORY` are also overridden
 * because `ProviderPresentationModule` imports
 * `IdentityPresentationModule`/`ProfilesPresentationModule`, whose
 * real `PrismaXRepository` providers would otherwise need a live
 * `PrismaService` — same reasoning as `provider.e2e-spec.ts`.
 */
describe('ScheduleController (e2e)', () => {
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
        SchedulePresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(SCHEDULE_REPOSITORY)
      .useValue(new InMemoryScheduleRepository())
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

  const createScheduleBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    providerId,
    startDateTime: '2026-01-01T08:00:00.000Z',
    endDateTime: '2026-01-01T09:00:00.000Z',
    type: ScheduleType.Regular,
    ...overrides,
  });

  it('POST /schedules creates a Schedule block and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody())
      .expect(201);

    const body = response.body as ScheduleResponseDto;
    expect(body.providerId).toBe(providerId);
    expect(body.status).toBe('OPEN');
  });

  it('POST /schedules returns 404 when the Provider does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody({ providerId: 'unknown-provider' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /schedules/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/schedules/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /schedules/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody());
    const createdId = (created.body as ScheduleResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/schedules/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'CANCELLED' })
      .expect(200);

    expect((response.body as ScheduleResponseDto).status).toBe('CANCELLED');
  });

  it('DELETE /schedules/:id deletes an existing Schedule block', async () => {
    const created = await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody());
    const createdId = (created.body as ScheduleResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/schedules/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/schedules/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /schedules lists Schedule blocks page by page', async () => {
    await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody());

    const response = await request(app.getHttpServer())
      .get('/schedules')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ScheduleListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /schedules/search searches by type', async () => {
    await request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', authHeader)
      .send(createScheduleBody());

    const response = await request(app.getHttpServer())
      .get('/schedules/search')
      .set('Authorization', authHeader)
      .query({ term: 'REGULAR' })
      .expect(200);

    const body = response.body as ScheduleResponseDto[];
    expect(body).toHaveLength(1);
  });
});
