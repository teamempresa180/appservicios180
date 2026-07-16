import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { VerificationPresentationModule } from '../src/modules/verification/presentation/verification.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { VERIFICATION_REPOSITORY } from '../src/modules/verification/domain/interfaces/verification-repository.interface';
import { InMemoryVerificationRepository } from '../src/modules/verification/application/use_cases/test-support/in-memory-verification.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { VerificationType } from '../src/modules/verification/domain/value-objects/verification-type.value-object';
import { VerificationResponseDto } from '../src/modules/verification/presentation/dto/verification.response.dto';
import { VerificationListResponseDto } from '../src/modules/verification/presentation/dto/verification-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Verification controller — same
 * reasoning as `identity.e2e-spec.ts`. Both `VERIFICATION_REPOSITORY`
 * and `IDENTITY_REPOSITORY` (imported transitively via
 * `VerificationPresentationModule` → `IdentityPresentationModule`)
 * are overridden with in-memory fakes. No Delete endpoint exists, so
 * no delete test case is included — matching the real HTTP surface.
 */
describe('VerificationController (e2e)', () => {
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
        VerificationPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(VERIFICATION_REPOSITORY)
      .useValue(new InMemoryVerificationRepository())
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

  it('POST /verifications creates a Verification and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/verifications')
      .set('Authorization', authHeader)
      .send({ identityId, type: VerificationType.Document })
      .expect(201);

    const body = response.body as VerificationResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('PENDING');
    expect(body.verifiedAt).toBeNull();
  });

  it('POST /verifications returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/verifications')
      .set('Authorization', authHeader)
      .send({ identityId: 'unknown-identity', type: VerificationType.Document })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /verifications/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/verifications/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /verifications/:id updates the status', async () => {
    const created = await request(app.getHttpServer())
      .post('/verifications')
      .set('Authorization', authHeader)
      .send({ identityId, type: VerificationType.Document });
    const createdId = (created.body as VerificationResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/verifications/${createdId}`)
      .set('Authorization', authHeader)
      .send({ status: 'APPROVED' })
      .expect(200);

    expect((response.body as VerificationResponseDto).status).toBe('APPROVED');
  });

  it('GET /verifications lists Verifications page by page', async () => {
    await request(app.getHttpServer())
      .post('/verifications')
      .set('Authorization', authHeader)
      .send({ identityId, type: VerificationType.Document });

    const response = await request(app.getHttpServer())
      .get('/verifications')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as VerificationListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /verifications/search searches by type', async () => {
    await request(app.getHttpServer())
      .post('/verifications')
      .set('Authorization', authHeader)
      .send({ identityId, type: VerificationType.Document });

    const response = await request(app.getHttpServer())
      .get('/verifications/search')
      .set('Authorization', authHeader)
      .query({ term: 'DOCUMENT' })
      .expect(200);

    const body = response.body as VerificationResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].type).toBe('DOCUMENT');
  });
});
