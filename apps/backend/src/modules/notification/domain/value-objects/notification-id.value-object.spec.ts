import { NotificationId } from './notification-id.value-object';

describe('NotificationId', () => {
  it('creates a new unique id', () => {
    const a = NotificationId.create();
    const b = NotificationId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = NotificationId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = NotificationId.fromString('same-id');
    const b = NotificationId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
