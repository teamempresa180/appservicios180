import { PaymentModel as PrismaPayment } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { PaymentPrismaMapper } from './payment-prisma.mapper';

describe('PaymentPrismaMapper', () => {
  const row: PrismaPayment = {
    id: 'id-1',
    quoteId: 'quote-1',
    orderId: 'order-1',
    payerIdentityId: 'identity-1',
    receiverProviderId: 'provider-1',
    amount: 100,
    method: 'CARD',
    status: 'PENDING',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const payment = PaymentPrismaMapper.toDomain(row);

    expect(payment.id.value).toBe('id-1');
    expect(payment.quoteId.value).toBe('quote-1');
    expect(payment.orderId.value).toBe('order-1');
    expect(payment.payerIdentityId.value).toBe('identity-1');
    expect(payment.receiverProviderId.value).toBe('provider-1');
    expect(payment.method).toBe(PaymentMethod.Card);
    expect(payment.status).toBe(PaymentStatus.Pending);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const payment = new Payment(PaymentId.fromString('id-1'), {
      quoteId: QuoteId.fromString('quote-1'),
      orderId: OrderId.fromString('order-1'),
      payerIdentityId: IdentityId.fromString('identity-1'),
      receiverProviderId: ProviderId.fromString('provider-1'),
      amount: 100,
      method: PaymentMethod.Card,
      status: PaymentStatus.Pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(PaymentPrismaMapper.toPersistence(payment)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const payment = PaymentPrismaMapper.toDomain(row);
    expect(PaymentPrismaMapper.toPersistence(payment)).toEqual(row);
  });
});
