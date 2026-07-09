import { PaymentId } from './payment-id.value-object';

describe('PaymentId', () => {
  it('creates a new unique id', () => {
    const a = PaymentId.create();
    const b = PaymentId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = PaymentId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = PaymentId.fromString('same-id');
    const b = PaymentId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
