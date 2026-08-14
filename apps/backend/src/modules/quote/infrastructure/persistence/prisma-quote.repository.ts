import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { TransactionContext } from '../../../core/domain/ports/transaction-context';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuotePrismaMapper } from './quote-prisma.mapper';

/** Anything Prisma's `quoteModel.upsert` can be called on — either the
 *  app-wide singleton or a transaction-scoped client handed back by
 *  `TransactionRunner.run`. */
type QuoteQueryable = PrismaService | Prisma.TransactionClient;

/**
 * `QuoteRepository` implementation backed by Prisma/MySQL — the only
 * place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaQuoteRepository implements QuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: QuoteId): Promise<Quote | null> {
    const row = await this.prisma.quoteModel.findUnique({
      where: { id: id.value },
    });
    return row ? QuotePrismaMapper.toDomain(row) : null;
  }

  async findByOrderId(orderId: OrderId): Promise<Quote[]> {
    const rows = await this.prisma.quoteModel.findMany({
      where: { orderId: orderId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }

  async findByOrderIds(orderIds: OrderId[]): Promise<Quote[]> {
    if (orderIds.length === 0) {
      return [];
    }
    const rows = await this.prisma.quoteModel.findMany({
      where: { orderId: { in: orderIds.map((orderId) => orderId.value) } },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Quote[]> {
    const rows = await this.prisma.quoteModel.findMany({
      where: { providerId: providerId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }

  async save(quote: Quote, tx?: TransactionContext): Promise<void> {
    const data = QuotePrismaMapper.toPersistence(quote);
    const client = (tx as QuoteQueryable | undefined) ?? this.prisma;
    await client.quoteModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Quote>> {
    const [rows, total] = await Promise.all([
      this.prisma.quoteModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quoteModel.count(),
    ]);
    return {
      items: rows.map((row) => QuotePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Quote[]> {
    const rows = await this.prisma.quoteModel.findMany({
      where: { notes: { contains: term } },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }
}
