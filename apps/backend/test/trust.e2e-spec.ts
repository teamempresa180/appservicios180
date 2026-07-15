import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TrustPresentationModule } from '../src/modules/trust/presentation/trust.module';
import { TRUST_REPOSITORY } from '../src/modules/trust/domain/interfaces/trust-repository.interface';
import { InMemoryTrustRepository } from '../src/modules/trust/application/use_cases/test-support/in-memory-trust.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { TrustLevel } from '../src/modules/trust/domain/value-objects/trust-level.value-object';
import { TrustResponseDto } from '../src/modules/trust/presentation/dto/trust.response.dto';
import { TrustListResponseDto } from '../src/modules/trust/presentation/dto/trust-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Trust controller — same reasoning as
 * `identity.e2e-spec.ts`. Both `TRUST_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `TrustPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes. No Delete endpoint exists, so no
 * delete test case is included — matching the real HTTP surface.
 * Includes a test for the "at most one Trust profile per Identity"
 * business rule (422).
 */
describe('TrustController (e2e)', () => {
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
      imports: [TrustPresentationModule],
    })
      .overrideProvider(TRUST_REPOSITORY)
      .useValue(new InMemoryTrustRepository())
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

  it('POST /trust-profiles creates a Trust profile and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 75, level: TrustLevel.High })
      .expect(201);

    const body = response.body as TrustResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /trust-profiles returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({
        identityId: 'unknown-identity',
        score: 75,
        level: TrustLevel.High,
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('POST /trust-profiles returns 422 when the Identity already has a Trust profile', async () => {
    await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 75, level: TrustLevel.High });

    const response = await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 50, level: TrustLevel.Medium })
      .expect(422);

    expect((response.body as ErrorResponseDto).error).toBe(
      'BusinessRuleException',
    );
  });

  it('GET /trust-profiles/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/trust-profiles/unknown-id')
      .expect(404);
  });

  it('PUT /trust-profiles/:id updates the score', async () => {
    const created = await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 75, level: TrustLevel.High });
    const createdId = (created.body as TrustResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/trust-profiles/${createdId}`)
      .send({ score: 90 })
      .expect(200);

    expect((response.body as TrustResponseDto).score).toBe(90);
  });

  it('GET /trust-profiles lists Trust profiles page by page', async () => {
    await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 75, level: TrustLevel.High });

    const response = await request(app.getHttpServer())
      .get('/trust-profiles')
      .expect(200);

    const body = response.body as TrustListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /trust-profiles/search searches by level', async () => {
    await request(app.getHttpServer())
      .post('/trust-profiles')
      .send({ identityId, score: 75, level: TrustLevel.High });

    const response = await request(app.getHttpServer())
      .get('/trust-profiles/search')
      .query({ term: 'HIGH' })
      .expect(200);

    const body = response.body as TrustResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].level).toBe('HIGH');
  });
});
