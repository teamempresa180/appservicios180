import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../domain/entities/address.entity';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { PrismaAddressRepository } from './prisma-address.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaAddressRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaAddressRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-address-it-${Date.now()}`,
        fullName: 'Address Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-ADDRESS-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    identityId = identity.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildAddress(overrides: Partial<{ alias: string }> = {}) {
    const now = new Date();
    return new Address(AddressId.create(), {
      identityId: IdentityId.fromString(identityId),
      alias: overrides.alias ?? 'Integration Test Address',
      fullAddress: 'Calle 1 # 2-3',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds an Address by id', async () => {
    const address = buildAddress();

    await repository.save(address);
    const found = await repository.findById(address.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(address.id)).toBe(true);
    expect(found?.alias).toBe(address.alias);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(AddressId.create());
    expect(found).toBeNull();
  });

  it('finds Addresses by identityId', async () => {
    const address = buildAddress();
    await repository.save(address);

    const results = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(results.some((a) => a.id.equals(address.id))).toBe(true);
  });

  it('updates an existing Address on save (upsert)', async () => {
    const address = buildAddress({ alias: 'Before Update' });
    await repository.save(address);

    const updated = new Address(address.id, {
      identityId: address.identityId,
      alias: 'After Update',
      fullAddress: address.fullAddress,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      type: address.type,
      status: address.status,
      createdAt: address.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(address.id);
    expect(found?.alias).toBe('After Update');
  });

  it('deletes an Address', async () => {
    const address = buildAddress();
    await repository.save(address);

    await repository.delete(address.id);

    const found = await repository.findById(address.id);
    expect(found).toBeNull();
  });

  it('lists Addresses with pagination', async () => {
    await repository.save(buildAddress());
    await repository.save(buildAddress());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Addresses by alias', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildAddress({ alias: marker }));

    const results = await repository.search(marker);

    expect(results.some((address) => address.alias === marker)).toBe(true);
  });
});
