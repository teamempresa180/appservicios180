import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuditPresentationModule } from '../src/modules/audit/presentation/audit.module';
import { AUDIT_REPOSITORY } from '../src/modules/audit/domain/interfaces/audit-repository.interface';
import { InMemoryAuditRepository } from '../src/modules/audit/application/use_cases/test-support/in-memory-audit.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { AuditActionType } from '../src/modules/audit/domain/value-objects/audit-action-type.value-object';
import { AuditRecordResponseDto } from '../src/modules/audit/presentation/dto/audit-record.response.dto';
import { AuditRecordListResponseDto } from '../src/modules/audit/presentation/dto/audit-record-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Audit controller — same reasoning as
 * `identity.e2e-spec.ts`. Both `AUDIT_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `AuditPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes. No Update/Delete endpoint exists —
 * audit records are immutable by design — so no such test cases are
 * included, matching the real HTTP surface.
 */
describe('AuditController (e2e)', () => {
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
      imports: [AuditPresentationModule],
    })
      .overrideProvider(AUDIT_REPOSITORY)
      .useValue(new InMemoryAuditRepository())
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

  it('POST /audit-records creates an Audit record and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/audit-records')
      .send({
        identityId,
        actionType: AuditActionType.LoggedIn,
        description: 'User logged in from a new device.',
      })
      .expect(201);

    const body = response.body as AuditRecordResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.actionType).toBe('LOGGED_IN');
  });

  it('POST /audit-records returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/audit-records')
      .send({
        identityId: 'unknown-identity',
        actionType: AuditActionType.LoggedIn,
        description: 'User logged in from a new device.',
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /audit-records/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/audit-records/unknown-id')
      .expect(404);
  });

  it('GET /audit-records/:id returns the created Audit record', async () => {
    const created = await request(app.getHttpServer())
      .post('/audit-records')
      .send({
        identityId,
        actionType: AuditActionType.Created,
        description: 'Profile created.',
      });
    const createdId = (created.body as AuditRecordResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/audit-records/${createdId}`)
      .expect(200);

    expect((response.body as AuditRecordResponseDto).description).toBe(
      'Profile created.',
    );
  });

  it('GET /audit-records lists Audit records page by page', async () => {
    await request(app.getHttpServer()).post('/audit-records').send({
      identityId,
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device.',
    });

    const response = await request(app.getHttpServer())
      .get('/audit-records')
      .expect(200);

    const body = response.body as AuditRecordListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /audit-records/search searches by description', async () => {
    await request(app.getHttpServer()).post('/audit-records').send({
      identityId,
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device.',
    });

    const response = await request(app.getHttpServer())
      .get('/audit-records/search')
      .query({ term: 'new device' })
      .expect(200);

    const body = response.body as AuditRecordResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].description).toContain('new device');
  });
});
