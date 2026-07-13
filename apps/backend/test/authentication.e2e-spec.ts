import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthenticationPresentationModule } from '../src/modules/authentication/presentation/authentication.module';
import { AUTHENTICATION_REPOSITORY } from '../src/modules/authentication/domain/interfaces/authentication-repository.interface';
import { InMemoryAuthenticationRepository } from '../src/modules/authentication/application/use_cases/test-support/in-memory-authentication.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { AuthenticationResponseDto } from '../src/modules/authentication/presentation/dto/authentication.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Authentication controller — same
 * reasoning as `identity.e2e-spec.ts`. Both `AUTHENTICATION_REPOSITORY`
 * and `IDENTITY_REPOSITORY` (imported transitively via
 * `AuthenticationPresentationModule` → `IdentityPresentationModule`)
 * are overridden with in-memory fakes.
 */
describe('AuthenticationController (e2e)', () => {
  let app: INestApplication<App>;
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
      imports: [AuthenticationPresentationModule],
    })
      .overrideProvider(AUTHENTICATION_REPOSITORY)
      .useValue(new InMemoryAuthenticationRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
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

  it('POST /authentications creates an Authentication method and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .send({ identityId, methodType: 'PASSWORD' })
      .expect(201);

    const body = response.body as AuthenticationResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /authentications returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .send({ identityId: 'unknown-identity', methodType: 'PASSWORD' })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /authentications/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/authentications/unknown-id')
      .expect(404);
  });

  it('PUT /authentications/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/authentications/${createdId}`)
      .send({ status: 'LOCKED' })
      .expect(200);

    expect((response.body as AuthenticationResponseDto).status).toBe('LOCKED');
  });

  it('DELETE /authentications/:id deletes an existing Authentication method', async () => {
    const created = await request(app.getHttpServer())
      .post('/authentications')
      .send({ identityId, methodType: 'PASSWORD' });
    const createdId = (created.body as AuthenticationResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/authentications/${createdId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/authentications/${createdId}`)
      .expect(404);
  });
});
