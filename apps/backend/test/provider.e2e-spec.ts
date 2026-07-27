import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { ProviderPresentationModule } from '../src/modules/provider/presentation/provider.module';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { Profile } from '../src/modules/profiles/domain/entities/profile.entity';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { ProfileVisibility } from '../src/modules/profiles/domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../src/modules/profiles/domain/value-objects/profile-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { ProviderResponseDto } from '../src/modules/provider/presentation/dto/provider.response.dto';
import { ProviderListResponseDto } from '../src/modules/provider/presentation/dto/provider-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Provider controller — same reasoning
 * as `identity.e2e-spec.ts`. `PROVIDER_REPOSITORY`, `IDENTITY_REPOSITORY`
 * and `PROFILE_REPOSITORY` (imported transitively via
 * `ProviderPresentationModule` → `IdentityPresentationModule`/
 * `ProfilesPresentationModule`) are overridden with in-memory fakes,
 * pre-seeding one Identity and one Profile for it.
 */
describe('ProviderController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;
  let identityId: string;
  let profileId: string;

  beforeEach(async () => {
    const identityRepository = new InMemoryIdentityRepository();
    const now = new Date();
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

    const profileRepository = new InMemoryProfileRepository();
    const profile = new Profile(ProfileId.create(), {
      identityId: identity.id,
      displayName: 'Owner',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await profileRepository.save(profile);
    profileId = profile.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ProviderPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(new InMemoryProviderRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(profileRepository)
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

  const createProviderBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    identityId,
    providerProfileId: profileId,
    type: ProviderType.Independent,
    experience: ProviderExperience.Intermediate,
    biography: 'Plumber with 10 years of experience.',
    yearsOfExperience: 10,
    ...overrides,
  });

  it('POST /providers creates a Provider and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody())
      .expect(201);

    const body = response.body as ProviderResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /providers returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody({ identityId: 'unknown-identity' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /providers returns 422 when the Identity already has a Provider record', async () => {
    await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody());

    const response = await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody())
      .expect(422);

    expect((response.body as ErrorResponseDto).error).toBe(
      'BusinessRuleException',
    );
  });

  it('GET /providers/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/providers/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /providers/:id updates the biography', async () => {
    const created = await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody());
    const createdId = (created.body as ProviderResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/providers/${createdId}`)
      .set('Authorization', authHeader)
      .send({ biography: 'Updated bio.' })
      .expect(200);

    expect((response.body as ProviderResponseDto).biography).toBe(
      'Updated bio.',
    );
  });

  it('DELETE /providers/:id deletes an existing Provider', async () => {
    const created = await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody());
    const createdId = (created.body as ProviderResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/providers/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/providers/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /providers lists Providers page by page', async () => {
    await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody());

    const response = await request(app.getHttpServer())
      .get('/providers')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ProviderListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /providers/search searches by biography', async () => {
    await request(app.getHttpServer())
      .post('/providers')
      .set('Authorization', authHeader)
      .send(createProviderBody());

    const response = await request(app.getHttpServer())
      .get('/providers/search')
      .set('Authorization', authHeader)
      .query({ term: 'plumber' })
      .expect(200);

    const body = response.body as ProviderResponseDto[];
    expect(body).toHaveLength(1);
  });
});
