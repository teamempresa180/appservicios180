import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { ProfilesPresentationModule } from '../src/modules/profiles/presentation/profile.module';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { ProfileVisibility } from '../src/modules/profiles/domain/value-objects/profile-visibility.value-object';
import { ProfileResponseDto } from '../src/modules/profiles/presentation/dto/profile.response.dto';
import { ProfileListResponseDto } from '../src/modules/profiles/presentation/dto/profile-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Profile controller — same reasoning
 * as `identity.e2e-spec.ts`. Both `PROFILE_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `ProfilesPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes.
 */
describe('ProfileController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;
  let identityId: string;

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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ProfilesPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
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

  it('POST /profiles creates a Profile and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      })
      .expect(201);

    const body = response.body as ProfileResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.displayName).toBe('Jane Doe');
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /profiles returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId: 'unknown-identity',
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /profiles returns 400 for a missing displayName', async () => {
    const response = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: '',
        visibility: ProfileVisibility.Public,
      })
      .expect(400);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ValidationException',
    );
  });

  it('GET /profiles/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/profiles/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /profiles/:id updates the displayName', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Original Name',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/profiles/${createdId}`)
      .set('Authorization', authHeader)
      .send({ displayName: 'Updated Name' })
      .expect(200);

    expect((response.body as ProfileResponseDto).displayName).toBe(
      'Updated Name',
    );
  });

  it('DELETE /profiles/:id deletes an existing Profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'To Delete',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/profiles/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/profiles/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /profiles lists Profiles page by page', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      });

    const response = await request(app.getHttpServer())
      .get('/profiles')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ProfileListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /profiles/search searches by displayName', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      });

    const response = await request(app.getHttpServer())
      .get('/profiles/search')
      .set('Authorization', authHeader)
      .query({ term: 'Jane' })
      .expect(200);

    const body = response.body as ProfileResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].displayName).toBe('Jane Doe');
  });
});
