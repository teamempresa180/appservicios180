import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
    await app.init();

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: identityId, role: 'CUSTOMER' })}`;
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
        identityId: 'unknown-identity',
        type: 'PASSWORD',
        password: 'Str0ngPassw0rd!',
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /credentials/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/credentials/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
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
