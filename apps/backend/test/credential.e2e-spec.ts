import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { CredentialsPresentationModule } from '../src/modules/credentials/presentation/credential.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { CREDENTIAL_REPOSITORY } from '../src/modules/credentials/domain/interfaces/credential-repository.interface';
import { InMemoryCredentialRepository } from '../src/modules/credentials/application/use_cases/test-support/in-memory-credential.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { CredentialResponseDto } from '../src/modules/credentials/presentation/dto/credential.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Credentials controller — same
 * reasoning as `identity.e2e-spec.ts`. Both `CREDENTIAL_REPOSITORY`
 * and `IDENTITY_REPOSITORY` (imported transitively via
 * `CredentialsPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes.
 */
describe('CredentialController (e2e)', () => {
  let app: INestApplication<App>;
  let identityId: string;
  let authHeader: string;
  let config: ConfigService;

  /** Every by-id Credential route is scoped to the owning Identity
   *  (Etapa 18), so tests acting as a different account sign their own
   *  token. */
  const tokenFor = (sub: string): string =>
    `Bearer ${signTestAccessToken(config, { sub, role: 'CUSTOMER' })}`;

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
        CredentialsPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(CREDENTIAL_REPOSITORY)
      .useValue(new InMemoryCredentialRepository())
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

  it('POST /credentials creates a Credential and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' })
      .expect(201);

    const body = response.body as CredentialResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /credentials returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/credentials')
      .send({
        identityId: IdentityId.create().value,
        type: 'PASSWORD',
        password: 'Str0ngPassw0rd!',
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /credentials returns 400 for a non-UUID identityId', async () => {
    await request(app.getHttpServer())
      .post('/credentials')
      .send({
        identityId: 'unknown-identity',
        type: 'PASSWORD',
        password: 'Str0ngPassw0rd!',
      })
      .expect(400);
  });

  it('POST /credentials returns 400 for a password below the minimum length', async () => {
    await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'short' })
      .expect(400);
  });

  it('POST /credentials refuses a second Password credential for the same Identity (account takeover)', async () => {
    await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Attack3rPassw0rd!' })
      .expect(422);

    expect((response.body as ErrorResponseDto).error).toBe(
      'BusinessRuleException',
    );
  });

  it('GET /credentials/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/credentials/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /credentials/:id returns 403 for a Credential owned by another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' });
    const createdId = (created.body as CredentialResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/credentials/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('PUT /credentials/:id returns 403 for a Credential owned by another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' });
    const createdId = (created.body as CredentialResponseDto).id;

    await request(app.getHttpServer())
      .put(`/credentials/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .send({ status: 'REVOKED' })
      .expect(403);
  });

  it('DELETE /credentials/:id returns 403 for a Credential owned by another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' });
    const createdId = (created.body as CredentialResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/credentials/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .expect(403);
  });

  it('PUT /credentials/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' });
    const createdId = (created.body as CredentialResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/credentials/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'REVOKED' })
      .expect(200);

    expect((response.body as CredentialResponseDto).status).toBe('REVOKED');
  });

  it('DELETE /credentials/:id deletes an existing Credential', async () => {
    const created = await request(app.getHttpServer())
      .post('/credentials')
      .send({ identityId, type: 'PASSWORD', password: 'Str0ngPassw0rd!' });
    const createdId = (created.body as CredentialResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/credentials/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/credentials/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });
});
