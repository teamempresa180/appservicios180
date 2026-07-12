import { PaymentModel as PrismaPayment } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * Translates between the `Payment` domain entity and its Prisma row
 * shape (`PaymentModel`, mapped to the `payments` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class PaymentPrismaMapper {
  static toDomain(row: PrismaPayment): Payment {
    return new Payment(PaymentId.fromString(row.id), {
      quoteId: QuoteId.fromString(row.quoteId),
      orderId: OrderId.fromString(row.orderId),
      payerIdentityId: IdentityId.fromString(row.payerIdentityId),
      receiverProviderId: ProviderId.fromString(row.receiverProviderId),
      amount: row.amount,
      method: row.method as unknown as PaymentMethod,
      status: row.status as unknown as PaymentStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(payment: Payment): PrismaPayment {
    return {
      id: payment.id.value,
      quoteId: payment.quoteId.value,
      orderId: payment.orderId.value,
      payerIdentityId: payment.payerIdentityId.value,
      receiverProviderId: payment.receiverProviderId.value,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
