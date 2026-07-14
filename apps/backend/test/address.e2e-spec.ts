import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AddressPresentationModule } from '../src/modules/address/presentation/address.module';
import { ADDRESS_REPOSITORY } from '../src/modules/address/domain/interfaces/address-repository.interface';
import { InMemoryAddressRepository } from '../src/modules/address/application/use_cases/test-support/in-memory-address.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { AddressType } from '../src/modules/address/domain/value-objects/address-type.value-object';
import { AddressResponseDto } from '../src/modules/address/presentation/dto/address.response.dto';
import { AddressListResponseDto } from '../src/modules/address/presentation/dto/address-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Address controller — same reasoning
 * as `identity.e2e-spec.ts`. Both `ADDRESS_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `AddressPresentationModule` → `IdentityPresentationModule`) are
 * overridden with in-memory fakes.
 */
describe('AddressController (e2e)', () => {
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
      imports: [AddressPresentationModule],
    })
      .overrideProvider(ADDRESS_REPOSITORY)
      .useValue(new InMemoryAddressRepository())
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

  const createAddressBody = (
    overrides: Partial<Record<string, string>> = {},
  ) => ({
    identityId,
    alias: 'Home',
    fullAddress: 'Calle 123 #45-67',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
    type: AddressType.Home,
    ...overrides,
  });

  it('POST /addresses creates an Address and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody())
      .expect(201);

    const body = response.body as AddressResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.city).toBe('Bogotá');
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /addresses returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody({ identityId: 'unknown-identity' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /addresses/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer()).get('/addresses/unknown-id').expect(404);
  });

  it('PUT /addresses/:id updates the alias', async () => {
    const created = await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody());
    const createdId = (created.body as AddressResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/addresses/${createdId}`)
      .send({ alias: 'Updated Alias' })
      .expect(200);

    expect((response.body as AddressResponseDto).alias).toBe('Updated Alias');
  });

  it('DELETE /addresses/:id deletes an existing Address', async () => {
    const created = await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody());
    const createdId = (created.body as AddressResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/addresses/${createdId}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/addresses/${createdId}`)
      .expect(404);
  });

  it('GET /addresses lists Addresses page by page', async () => {
    await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody());

    const response = await request(app.getHttpServer())
      .get('/addresses')
      .expect(200);

    const body = response.body as AddressListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /addresses/search searches by city', async () => {
    await request(app.getHttpServer())
      .post('/addresses')
      .send(createAddressBody());

    const response = await request(app.getHttpServer())
      .get('/addresses/search')
      .query({ term: 'Bogotá' })
      .expect(200);

    const body = response.body as AddressResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].city).toBe('Bogotá');
  });
});
