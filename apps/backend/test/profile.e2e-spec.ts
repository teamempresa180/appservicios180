import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
  let config: ConfigService;

  /** Someone who owns none of the Profiles under test — writes are
   *  owner-only since Etapa 18, and a Private Profile is unreadable to
   *  anyone else. */
  const otherAuthHeader = (): string =>
    `Bearer ${signTestAccessToken(config, {
      sub: IdentityId.create().value,
      role: 'CUSTOMER',
    })}`;

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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    config = app.get(ConfigService);
    authHeader = `Bearer ${signTestAccessToken(config, { sub: identityId, role: 'CUSTOMER' })}`;
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
    // The caller must claim its *own* identityId to get past the
    // ownership check, so this signs a token for an Identity that was
    // never saved.
    const unknownIdentityId = IdentityId.create().value;
    const response = await request(app.getHttpServer())
      .post('/profiles')
      .set(
        'Authorization',
        `Bearer ${signTestAccessToken(config, {
          sub: unknownIdentityId,
          role: 'CUSTOMER',
        })}`,
      )
      .send({
        identityId: unknownIdentityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /profiles returns 403 when creating a Profile for another Identity', async () => {
    const response = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', otherAuthHeader())
      .send({
        identityId,
        displayName: 'Impostor',
        visibility: ProfileVisibility.Public,
      })
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
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
      'BadRequestException',
    );
  });

  it('POST /profiles returns 400 for an unknown property (forbidNonWhitelisted)', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
        status: 'ACTIVE',
      })
      .expect(400);
  });

  it('GET /profiles/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/profiles/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /profiles/:id returns a Public Profile to another authenticated caller', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Public Provider',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/profiles/${createdId}`)
      .set('Authorization', otherAuthHeader())
      .expect(200);

    expect((response.body as ProfileResponseDto).displayName).toBe(
      'Public Provider',
    );
  });

  it('GET /profiles/:id returns 403 for another Identity’s Private Profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Hidden',
        visibility: ProfileVisibility.Private,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/profiles/${createdId}`)
      .set('Authorization', otherAuthHeader())
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('PUT /profiles/:id returns 403 for another Identity’s Profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Victim',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    await request(app.getHttpServer())
      .put(`/profiles/${createdId}`)
      .set('Authorization', otherAuthHeader())
      .send({ displayName: 'Hijacked' })
      .expect(403);
  });

  it('DELETE /profiles/:id returns 403 for another Identity’s Profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Victim',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/profiles/${createdId}`)
      .set('Authorization', otherAuthHeader())
      .expect(403);
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

  it('GET /profiles lists only the caller’s own Profiles', async () => {
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

  it('GET /profiles does not leak Profiles owned by another Identity', async () => {
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
      .set('Authorization', otherAuthHeader())
      .expect(200);

    const body = response.body as ProfileListResponseDto;
    expect(body.items).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  it('GET /profiles/search is closed to non-administrative callers', async () => {
    // Free-text search spans every Profile with no owner filter, and
    // nothing in the app calls it — it is gated to Role.Admin, which
    // nothing issues yet.
    const response = await request(app.getHttpServer())
      .get('/profiles/search')
      .set('Authorization', authHeader)
      .query({ term: 'Jane' })
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('POST /profiles/:id/avatar uploads a photo and stores its path', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    const response = await request(app.getHttpServer())
      .post(`/profiles/${createdId}/avatar`)
      .set('Authorization', authHeader)
      .attach('file', Buffer.from('fake-png-bytes'), {
        filename: 'avatar.png',
        contentType: 'image/png',
      })
      .expect(201);

    const body = response.body as ProfileResponseDto;
    expect(body.avatarUrl).toBe(`uploads/profiles/${createdId}/avatar.png`);
  });

  it('POST /profiles/:id/avatar returns 400 for an unsupported mimetype', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Jane Doe',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    const response = await request(app.getHttpServer())
      .post(`/profiles/${createdId}/avatar`)
      .set('Authorization', authHeader)
      .attach('file', Buffer.from('fake-pdf-bytes'), {
        filename: 'document.pdf',
        contentType: 'application/pdf',
      })
      .expect(400);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ValidationException',
    );
  });

  it('POST /profiles/:id/avatar returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .post('/profiles/unknown-id/avatar')
      .set('Authorization', authHeader)
      .attach('file', Buffer.from('fake-png-bytes'), {
        filename: 'avatar.png',
        contentType: 'image/png',
      })
      .expect(404);
  });

  it('POST /profiles/:id/avatar returns 403 for another Identity’s Profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/profiles')
      .set('Authorization', authHeader)
      .send({
        identityId,
        displayName: 'Victim',
        visibility: ProfileVisibility.Public,
      });
    const createdId = (created.body as ProfileResponseDto).id;

    await request(app.getHttpServer())
      .post(`/profiles/${createdId}/avatar`)
      .set('Authorization', otherAuthHeader())
      .attach('file', Buffer.from('fake-png-bytes'), {
        filename: 'avatar.png',
        contentType: 'image/png',
      })
      .expect(403);
  });
});
