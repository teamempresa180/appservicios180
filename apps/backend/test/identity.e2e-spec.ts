import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { IdentityPresentationModule } from '../src/modules/identity/presentation/identity.module';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { IdentityResponseDto } from '../src/modules/identity/presentation/dto/identity.response.dto';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
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
  let config: ConfigService;

  /** A bearer token for the Identity `sub` — every by-id route is now
   *  scoped to the caller's own Identity (Etapa 18), so each test signs
   *  a token for whichever Identity it is acting as. */
  const tokenFor = (sub: string): string =>
    `Bearer ${signTestAccessToken(config, { sub, role: 'CUSTOMER' })}`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        IdentityPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
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
      'BadRequestException',
    );
  });

  it('POST /identities returns 400 for an unknown property (forbidNonWhitelisted)', async () => {
    await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Jane Doe',
        documentType: 'NATIONAL_ID',
        documentNumber: '123456789',
        birthDate: '1990-01-01',
        status: 'ACTIVE',
      })
      .expect(400);
  });

  it('POST /identities returns 422 for a documentNumber that is already registered', async () => {
    const payload = {
      fullName: 'Jane Doe',
      documentType: 'NATIONAL_ID',
      documentNumber: '555000555',
      birthDate: '1990-01-01',
    };
    await request(app.getHttpServer())
      .post('/identities')
      .send(payload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/identities')
      .send({ ...payload, fullName: 'Impostor' })
      .expect(422);

    expect((response.body as ErrorResponseDto).error).toBe(
      'BusinessRuleException',
    );
  });

  it('GET /identities/:id returns 404 for an unknown id the caller claims as its own', async () => {
    const response = await request(app.getHttpServer())
      .get('/identities/unknown-id')
      .set('Authorization', tokenFor('unknown-id'))
      .expect(404);

    const body = response.body as ErrorResponseDto;
    expect(body.error).toBe('NotFoundException');
    expect(body.path).toBe('/identities/unknown-id');
  });

  it('GET /identities/:id returns 403 for another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Victim',
        documentType: 'NATIONAL_ID',
        documentNumber: '444555666',
        birthDate: '1990-01-01',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    const response = await request(app.getHttpServer())
      .get(`/identities/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('PUT /identities/:id returns 403 for another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Victim',
        documentType: 'NATIONAL_ID',
        documentNumber: '777888999',
        birthDate: '1990-01-01',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    await request(app.getHttpServer())
      .put(`/identities/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .send({ fullName: 'Hijacked' })
      .expect(403);
  });

  it('DELETE /identities/:id returns 403 for another Identity', async () => {
    const created = await request(app.getHttpServer())
      .post('/identities')
      .send({
        fullName: 'Victim',
        documentType: 'NATIONAL_ID',
        documentNumber: '222333444',
        birthDate: '1990-01-01',
      });
    const createdId = (created.body as IdentityResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/identities/${createdId}`)
      .set('Authorization', tokenFor('another-identity'))
      .expect(403);
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
      .set('Authorization', tokenFor(createdId))
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
      .set('Authorization', tokenFor(createdId))
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
      .set('Authorization', tokenFor(createdId))
      .expect(200);

    await request(app.getHttpServer())
      .get(`/identities/${createdId}`)
      .set('Authorization', tokenFor(createdId))
      .expect(404);
  });
});
