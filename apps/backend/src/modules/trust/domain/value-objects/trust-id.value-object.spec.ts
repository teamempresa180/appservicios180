import { TrustId } from './trust-id.value-object';

describe('TrustId', () => {
  it('creates a new unique id', () => {
    const a = TrustId.create();
    const b = TrustId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = TrustId.fromString('same-id');
    const b = TrustId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
