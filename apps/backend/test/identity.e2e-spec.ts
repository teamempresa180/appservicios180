import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { IdentityPresentationModule } from '../src/modules/identity/presentation/identity.module';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { IdentityResponseDto } from '../src/modules/identity/presentation/dto/identity.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Identity controller — exercises the
 * real routing/DTO-mapping/exception-filter wiring end to end via
 * `supertest`, with `IDENTITY_REPOSITORY` overridden by an in-memory
 * fake so it stays in the fast, DB-free `test:e2e` bucket (same
 * reasoning as `app.e2e-spec.ts`).
 */
describe('IdentityController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IdentityPresentationModule],
    })
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
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

  it('POST /identities creates an Identity and returns 201 with ISO date strings', async () => {
    const response = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Jane Doe',
        documentType: 'NATIONAL_ID',
        documentNumber: '123456789',
        birthDate: '1990-01-01',
      })
      .expect(201);

    const body = response.body as IdentityResponseDto;
    expect(body.id).toEqual(expect.any(String));
    expect(body.fullName).toBe('Jane Doe');
    expect(body.status).toBe('ACTIVE');
    expect(body.birthDate).toBe('1990-01-01T00:00:00.000Z');
  });

  it('POST /identities returns 400 for a missing fullName', async () => {
    const response = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: '',
        documentType: 'NATIONAL_ID',
        documentNumber: '123456789',
        birthDate: '1990-01-01',
      })
      .expect(400);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ValidationException',
    );
  });

  it('GET /identities/:id returns 404 for an unknown id', async () => {
    const response = await request(app.getHttpServer())
      .get('/identities/unknown-id')
      .expect(404);

    const body = response.body as ErrorResponseDto;
    expect(body.error).toBe('NotFoundException');
    expect(body.path).toBe('/identities/unknown-id');
  });

  it('GET /identities/:id returns the created Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'John Smith',
        documentType: 'PASSPORT',
        documentNumber: 'X1234567',
        birthDate: '1985-05-05',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/identities/${createdId}`)
      .expect(200);

    expect((response.body as IdentityResponseDto).fullName).toBe('John Smith');
  });

  it('PUT /identities/:id updates an existing Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Original Name',
        documentType: 'NATIONAL_ID',
        documentNumber: '987654321',
        birthDate: '1992-02-02',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/identities/${createdId}`)
      .send({ fullName: 'Updated Name' })
      .expect(200);

    expect((response.body as IdentityResponseDto).fullName).toBe(
      'Updated Name',
    );
  });

  it('DELETE /identities/:id deletes an existing Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'To Delete',
        documentType: 'NATIONAL_ID',
        documentNumber: '111222333',
        birthDate: '1980-01-01',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/identities/${createdId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/identities/${createdId}`)
      .expect(404);
  });
});
