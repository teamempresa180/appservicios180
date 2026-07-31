import { Address } from './address.entity';
import { AddressId } from '../value-objects/address-id.value-object';
import { AddressType } from '../value-objects/address-type.value-object';
import { AddressStatus } from '../value-objects/address-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Address', () => {
  it('holds all the assigned properties', () => {
    const id = AddressId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const address = new Address(id, {
      identityId,
      alias: 'Casa',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: 4.710989,
      longitude: -74.072092,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(address.id).toBe(id);
    expect(address.identityId).toBe(identityId);
    expect(address.alias).toBe('Casa');
    expect(address.type).toBe(AddressType.Home);
    expect(address.status).toBe(AddressStatus.Active);
    expect(address.latitude).toBe(4.710989);
    expect(address.longitude).toBe(-74.072092);
  });

  it('accepts a null latitude/longitude when no pin was dropped', () => {
    const id = AddressId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const address = new Address(id, {
      identityId,
      alias: 'Casa',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: null,
      longitude: null,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(address.latitude).toBeNull();
    expect(address.longitude).toBeNull();
  });

  it('is equal to another address with the same id', () => {
    const id = AddressId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const props = {
      identityId,
      alias: 'Casa',
      fullAddress: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: null,
      longitude: null,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Address(id, props);
    const b = new Address(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
