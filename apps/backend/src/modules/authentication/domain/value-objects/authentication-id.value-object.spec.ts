import { AuthenticationId } from './authentication-id.value-object';

describe('AuthenticationId', () => {
  it('creates a new unique id', () => {
    const a = AuthenticationId.create();
    const b = AuthenticationId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = AuthenticationId.fromString('same-id');
    const b = AuthenticationId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
