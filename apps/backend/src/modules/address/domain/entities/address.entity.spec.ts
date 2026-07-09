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
