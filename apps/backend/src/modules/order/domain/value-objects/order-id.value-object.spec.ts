import { OrderId } from './order-id.value-object';

describe('OrderId', () => {
  it('creates a new unique id', () => {
    const a = OrderId.create();
    const b = OrderId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = OrderId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = OrderId.fromString('same-id');
    const b = OrderId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
