import { ServiceId } from './service-id.value-object';

describe('ServiceId', () => {
  it('creates a new unique id', () => {
    const a = ServiceId.create();
    const b = ServiceId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ServiceId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ServiceId.fromString('same-id');
    const b = ServiceId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
