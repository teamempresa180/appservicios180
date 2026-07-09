import { AddressId } from './address-id.value-object';

describe('AddressId', () => {
  it('creates a new unique id', () => {
    const a = AddressId.create();
    const b = AddressId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = AddressId.fromString('same-id');
    const b = AddressId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
