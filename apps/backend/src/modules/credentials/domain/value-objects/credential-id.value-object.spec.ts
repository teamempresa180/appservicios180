import { CredentialId } from './credential-id.value-object';

describe('CredentialId', () => {
  it('creates a new unique id', () => {
    const a = CredentialId.create();
    const b = CredentialId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = CredentialId.fromString('same-id');
    const b = CredentialId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
