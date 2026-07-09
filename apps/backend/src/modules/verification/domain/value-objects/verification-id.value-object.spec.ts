import { VerificationId } from './verification-id.value-object';

describe('VerificationId', () => {
  it('creates a new unique id', () => {
    const a = VerificationId.create();
    const b = VerificationId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = VerificationId.fromString('same-id');
    const b = VerificationId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
