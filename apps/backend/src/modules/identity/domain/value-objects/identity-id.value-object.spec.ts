import { IdentityId } from './identity-id.value-object';

describe('IdentityId', () => {
  it('creates a new unique id', () => {
    const a = IdentityId.create();
    const b = IdentityId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = IdentityId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = IdentityId.fromString('same-id');
    const b = IdentityId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
