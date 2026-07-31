import { AddressModel as PrismaAddress } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../domain/entities/address.entity';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressPrismaMapper } from './address-prisma.mapper';

describe('AddressPrismaMapper', () => {
  const row: PrismaAddress = {
    id: 'id-1',
    identityId: 'identity-1',
    alias: 'Home',
    fullAddress: 'Calle 1 # 2-3',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
    latitude: 4.710989,
    longitude: -74.072092,
    type: 'HOME',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const address = AddressPrismaMapper.toDomain(row);

    expect(address.id.value).toBe('id-1');
    expect(address.identityId.value).toBe('identity-1');
    expect(address.alias).toBe('Home');
    expect(address.type).toBe(AddressType.Home);
    expect(address.status).toBe(AddressStatus.Active);
    expect(address.latitude).toBe(4.710989);
    expect(address.longitude).toBe(-74.072092);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const address = new Address(AddressId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      alias: 'Home',
      fullAddress: 'Calle 1 # 2-3',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: 4.710989,
      longitude: -74.072092,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(AddressPrismaMapper.toPersistence(address)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const address = AddressPrismaMapper.toDomain(row);
    expect(AddressPrismaMapper.toPersistence(address)).toEqual(row);
  });
});
