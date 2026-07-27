import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthenticationPresentationModule } from '../src/modules/authentication/presentation/authentication.module';
import { AUTHENTICATION_REPOSITORY } from '../src/modules/authentication/domain/interfaces/authentication-repository.interface';
import { InMemoryAuthenticationRepository } from '../src/modules/authentication/application/use_cases/test-support/in-memory-authentication.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../src/modules/authentication/domain/interfaces/refresh-token-repository.interface';
import { InMemoryRefreshTokenRepository } from '../src/modules/authentication/application/use_cases/test-support/in-memory-refresh-token.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { CREDENTIAL_REPOSITORY } from '../src/modules/credentials/domain/interfaces/credential-repository.interface';
import { InMemoryCredentialRepository } from '../src/modules/credentials/application/use_cases/test-support/in-memory-credential.repository';
import { Credential } from '../src/modules/credentials/domain/entities/credential.entity';
import { CredentialId } from '../src/modules/credentials/domain/value-objects/credential-id.value-object';
import { CredentialType } from '../src/modules/credentials/domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../src/modules/credentials/domain/value-objects/credential-status.value-object';
import { BcryptPasswordHasher } from '../src/modules/credentials/infrastructure/security/bcrypt-password-hasher';
import { Authentication } from '../src/modules/authentication/domain/entities/authentication.entity';
import { AuthenticationId } from '../src/modules/authentication/domain/value-objects/authentication-id.value-object';
import { AuthMethodType } from '../src/modules/authentication/domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../src/modules/authentication/domain/value-objects/authentication-status.value-object';
import { AuthenticationResponseDto } from '../src/modules/authentication/presentation/dto/authentication.response.dto';
import { AuthTokensResponseDto } from '../src/modules/authentication/presentation/dto/auth-tokens.response.dto';
import { CurrentUserResponseDto } from '../src/modules/authentication/presentation/dto/current-user.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Authentication controller — same
 * reasoning as `identity.e2e-spec.ts`. `AUTHENTICATION_REPOSITORY`/
 * `IDENTITY_REPOSITORY`/`REFRESH_TOKEN_REPOSITORY` (imported
 * transitively via `AuthenticationPresentationModule`) are overridden
 * with in-memory fakes. `PROVIDER_REPOSITORY`/`PROFILE_REPOSITORY`/
 * `CREDENTIAL_REPOSITORY` are also overridden because
 * `ProviderPresentationModule`/`CredentialsPresentationModule`
 * (imported transitively — Sprint 4, Etapa 7) depend on them.
 */
describe('AuthenticationController (e2e)', () => {
  let app: INestApplication<App>;
  let identityId: string;
  const documentNumber = `123456789-${Date.now()}`;
  const password = 'Str0ngPassw0rd!';

  async function buildApp(): Promise<INestApplication<App>> {
    const identityRepository = new InMemoryIdentityRepository();
    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber,
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;

    const authenticationRepository = new InMemoryAuthenticationRepository();
    await authenticationRepository.save(
      new Authentication(AuthenticationId.create(), {
        identityId: identity.id,
        methodType: AuthMethodType.Password,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const credentialRepository = new InMemoryCredentialRepository();
    const passwordHash = await new BcryptPasswordHasher().hash(password);
    await credentialRepository.save(
      new Credential(CredentialId.create(), {
        identityId: identity.id,
        type: CredentialType.Password,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
        passwordHash,
      }),
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationPresentationModule],
    })
      .overrideProvider(AUTHENTICATION_REPOSITORY)
      .useValue(authenticationRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(REFRESH_TOKEN_REPOSITORY)
      .useValue(new InMemoryRefreshTokenRepository())
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(new InMemoryProviderRepository())
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CREDENTIAL_REPOSITORY)
      .useValue(credentialRepository)
      .compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    await nestApp.init();
    return nestApp;
  }

  let authHeader: string;

  beforeEach(async () => {
    app = await buildApp();

    const login = await request(app.getHttpServer())
      .post('/authentications/login')
      .send({ documentNumber, password })
      .expect(200);
    authHeader = `Bearer ${(login.body as AuthTokensResponseDto).accessToken}`;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /authentications creates an Authentication method and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' })
      .expect(201);

    const body = response.body as AuthenticationResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /authentications returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId: 'unknown-identity', methodType: 'PASSWORD' })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /authentications succeeds without an Authorization header — it is the public registration step that creates the very first Authentication record a caller needs before they can log in at all', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .send({ identityId, methodType: 'PASSWORD' })
      .expect(201);

    const body = response.body as AuthenticationResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('ACTIVE');
  });

  it('PUT /authentications/:id still returns 401 without an Authorization header', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    await request(app.getHttpServer())
      .put(`/authentications/${createdId}`)
      .send({ status: 'LOCKED' })
      .expect(401);
  });

  it('DELETE /authentications/:id still returns 401 without an Authorization header', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/authentications/${createdId}`)
      .expect(401);
  });

  it('GET /authentications/:id still returns 401 without an Authorization header', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    await request(app.getHttpServer())
      .get(`/authentications/${createdId}`)
      .expect(401);
  });

  it('GET /authentications/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/authentications/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /authentications/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/authentications/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'LOCKED' })
      .expect(200);

    expect((response.body as AuthenticationResponseDto).status).toBe('LOCKED');
  });

  it('DELETE /authentications/:id deletes an existing Authentication method', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .set('Authorization', authHeader)
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/authentications/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/authentications/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  describe('login / refresh / logout / me', () => {
    it('POST /authentications/login succeeds with a valid documentNumber/password', async () => {
      const response = await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber, password })
        .expect(200);

      const body = response.body as AuthTokensResponseDto;
      expect(body.accessToken).toEqual(expect.any(String));
      expect(body.refreshToken).toEqual(expect.any(String));
      expect(body.tokenType).toBe('Bearer');
      expect(body.role).toBe('CUSTOMER');
      expect(body.expiresIn).toBeGreaterThan(0);
    });

    it('POST /authentications/login returns 401 for an unknown documentNumber', async () => {
      const response = await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber: 'unknown-doc', password })
        .expect(401);

      expect((response.body as ErrorResponseDto).error).toBe(
        'UnauthorizedException',
      );
    });

    it('POST /authentications/login returns 401 for an incorrect password', async () => {
      await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber, password: 'wrong-password' })
        .expect(401);
    });

    it('GET /authentications/me returns 401 without a token', async () => {
      await request(app.getHttpServer()).get('/authentications/me').expect(401);
    });

    it('GET /authentications/me returns 401 with a malformed token', async () => {
      await request(app.getHttpServer())
        .get('/authentications/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });

    it('GET /authentications/me returns the current user with a valid access token', async () => {
      const login = await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber, password })
        .expect(200);
      const { accessToken } = login.body as AuthTokensResponseDto;

      const response = await request(app.getHttpServer())
        .get('/authentications/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as CurrentUserResponseDto;
      expect(body.id).toBe(identityId);
      expect(body.role).toBe('CUSTOMER');
    });

    it('POST /authentications/refresh issues a new pair and revokes the old refresh token (rotation)', async () => {
      const login = await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber, password })
        .expect(200);
      const { refreshToken } = login.body as AuthTokensResponseDto;

      const refreshed = await request(app.getHttpServer())
        .post('/authentications/refresh')
        .send({ refreshToken })
        .expect(200);
      const newTokens = refreshed.body as AuthTokensResponseDto;
      expect(newTokens.accessToken).toEqual(expect.any(String));
      expect(newTokens.refreshToken).not.toBe(refreshToken);

      // The old refresh token was rotated out — using it again must fail.
      await request(app.getHttpServer())
        .post('/authentications/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('POST /authentications/refresh returns 401 for a malformed refresh token', async () => {
      await request(app.getHttpServer())
        .post('/authentications/refresh')
        .send({ refreshToken: 'not-a-real-token' })
        .expect(401);
    });

    it('POST /authentications/logout revokes the refresh token', async () => {
      const login = await request(app.getHttpServer())
        .post('/authentications/login')
        .send({ documentNumber, password })
        .expect(200);
      const { refreshToken } = login.body as AuthTokensResponseDto;

      await request(app.getHttpServer())
        .post('/authentications/logout')
        .send({ refreshToken })
        .expect(200);

      await request(app.getHttpServer())
        .post('/authentications/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('POST /authentications/logout is idempotent for an unknown refresh token', async () => {
      await request(app.getHttpServer())
        .post('/authentications/logout')
        .send({ refreshToken: 'unknown-token' })
        .expect(200);
    });
  });
});
