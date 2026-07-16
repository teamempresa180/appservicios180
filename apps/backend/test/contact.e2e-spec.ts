import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { ContactPresentationModule } from '../src/modules/contact/presentation/contact.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { CONTACT_REPOSITORY } from '../src/modules/contact/domain/interfaces/contact-repository.interface';
import { InMemoryContactRepository } from '../src/modules/contact/application/use_cases/test-support/in-memory-contact.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { ContactType } from '../src/modules/contact/domain/value-objects/contact-type.value-object';
import { ContactResponseDto } from '../src/modules/contact/presentation/dto/contact.response.dto';
import { ContactListResponseDto } from '../src/modules/contact/presentation/dto/contact-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Contact controller — same reasoning
 * as `identity.e2e-spec.ts`. Both `CONTACT_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `ContactPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes.
 */
describe('ContactController (e2e)', () => {
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
        ContactPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(CONTACT_REPOSITORY)
      .useValue(new InMemoryContactRepository())
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

  it('POST /contacts creates a Contact and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId,
        type: ContactType.Email,
        value: 'jane.doe@example.com',
      })
      .expect(201);

    const body = response.body as ContactResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.value).toBe('jane.doe@example.com');
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /contacts returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId: 'unknown-identity',
        type: ContactType.Email,
        value: 'jane.doe@example.com',
      })
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /contacts/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/contacts/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /contacts/:id updates the value', async () => {
    const created = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId,
        type: ContactType.Email,
        value: 'original@example.com',
      });
    const createdId = (created.body as ContactResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/contacts/${createdId}`)
      .set('Authorization', authHeader)
      .send({ value: 'updated@example.com' })
      .expect(200);

    expect((response.body as ContactResponseDto).value).toBe(
      'updated@example.com',
    );
  });

  it('DELETE /contacts/:id deletes an existing Contact', async () => {
    const created = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId,
        type: ContactType.Email,
        value: 'to-delete@example.com',
      });
    const createdId = (created.body as ContactResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/contacts/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/contacts/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /contacts lists Contacts page by page', async () => {
    await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId,
        type: ContactType.Email,
        value: 'jane.doe@example.com',
      });

    const response = await request(app.getHttpServer())
      .get('/contacts')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ContactListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /contacts/search searches by value', async () => {
    await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', authHeader)
      .send({
        identityId,
        type: ContactType.Email,
        value: 'jane.doe@example.com',
      });

    const response = await request(app.getHttpServer())
      .get('/contacts/search')
      .set('Authorization', authHeader)
      .query({ term: 'jane.doe' })
      .expect(200);

    const body = response.body as ContactResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].value).toBe('jane.doe@example.com');
  });
});
