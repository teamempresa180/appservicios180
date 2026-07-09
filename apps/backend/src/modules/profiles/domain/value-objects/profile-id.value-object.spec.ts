import { ProfileId } from './profile-id.value-object';

describe('ProfileId', () => {
  it('creates a new unique id', () => {
    const a = ProfileId.create();
    const b = ProfileId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ProfileId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ProfileId.fromString('same-id');
    const b = ProfileId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
