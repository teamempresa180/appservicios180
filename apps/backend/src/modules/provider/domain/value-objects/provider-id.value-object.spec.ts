import { ProviderId } from './provider-id.value-object';

describe('ProviderId', () => {
  it('creates a new unique id', () => {
    const a = ProviderId.create();
    const b = ProviderId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ProviderId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ProviderId.fromString('same-id');
    const b = ProviderId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
