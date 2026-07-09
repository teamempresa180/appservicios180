import { Payment } from './payment.entity';
import { PaymentId } from '../value-objects/payment-id.value-object';
import { PaymentStatus } from '../value-objects/payment-status.value-object';
import { PaymentMethod } from '../value-objects/payment-method.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('Payment', () => {
  it('holds all the assigned properties', () => {
    const id = PaymentId.create();
    const quoteId = QuoteId.create();
    const orderId = OrderId.create();
    const payerIdentityId = IdentityId.create();
    const receiverProviderId = ProviderId.create();
    const now = new Date();
    const payment = new Payment(id, {
      quoteId,
      orderId,
      payerIdentityId,
      receiverProviderId,
      amount: 45000,
      method: PaymentMethod.Card,
      status: PaymentStatus.Completed,
      createdAt: now,
      updatedAt: now,
    });

    expect(payment.id).toBe(id);
    expect(payment.quoteId).toBe(quoteId);
    expect(payment.orderId).toBe(orderId);
    expect(payment.payerIdentityId).toBe(payerIdentityId);
    expect(payment.receiverProviderId).toBe(receiverProviderId);
    expect(payment.amount).toBe(45000);
    expect(payment.method).toBe(PaymentMethod.Card);
    expect(payment.status).toBe(PaymentStatus.Completed);
  });

  it('is equal to another payment with the same id', () => {
    const id = PaymentId.create();
    const quoteId = QuoteId.create();
    const orderId = OrderId.create();
    const payerIdentityId = IdentityId.create();
    const receiverProviderId = ProviderId.create();
    const now = new Date();
    const props = {
      quoteId,
      orderId,
      payerIdentityId,
      receiverProviderId,
      amount: 1000,
      method: PaymentMethod.Cash,
      status: PaymentStatus.Pending,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Payment(id, props);
    const b = new Payment(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
