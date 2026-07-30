import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentPrismaMapper } from './payment-prisma.mapper';

/**
 * `PaymentRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: PaymentId): Promise<Payment | null> {
    const row = await this.prisma.paymentModel.findUnique({
      where: { id: id.value },
    });
    return row ? PaymentPrismaMapper.toDomain(row) : null;
  }

  async findByQuoteId(quoteId: QuoteId): Promise<Payment[]> {
    const rows = await this.prisma.paymentModel.findMany({
      where: { quoteId: quoteId.value },
    });
    return rows.map((row) => PaymentPrismaMapper.toDomain(row));
  }

  async findByOrderId(orderId: OrderId): Promise<Payment[]> {
    const rows = await this.prisma.paymentModel.findMany({
      where: { orderId: orderId.value },
    });
    return rows.map((row) => PaymentPrismaMapper.toDomain(row));
  }

  async findByPayerIdentityId(identityId: IdentityId): Promise<Payment[]> {
    const rows = await this.prisma.paymentModel.findMany({
      where: { payerIdentityId: identityId.value },
    });
    return rows.map((row) => PaymentPrismaMapper.toDomain(row));
  }

  async findByReceiverProviderId(providerId: ProviderId): Promise<Payment[]> {
    const rows = await this.prisma.paymentModel.findMany({
      where: { receiverProviderId: providerId.value },
    });
    return rows.map((row) => PaymentPrismaMapper.toDomain(row));
  }

  async save(payment: Payment): Promise<void> {
    const data = PaymentPrismaMapper.toPersistence(payment);
    await this.prisma.paymentModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Payment>> {
    const [rows, total] = await Promise.all([
      this.prisma.paymentModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentModel.count(),
    ]);
    return {
      items: rows.map((row) => PaymentPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Payment[]> {
    // `method` is a Prisma enum column — enum filters only support
    // `equals`/`in`, not `contains`, so the substring match has to
    // happen in application code after the fetch.
    const rows = await this.prisma.paymentModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.method.includes(upper))
      .map((row) => PaymentPrismaMapper.toDomain(row));
  }
}
