import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuotePrismaMapper } from './quote-prisma.mapper';

/**
 * `QuoteRepository` implementation backed by Prisma/PostgreSQL — the
 * only place in this module that knows Prisma exists.
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
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Quote[]> {
    const rows = await this.prisma.quoteModel.findMany({
      where: { providerId: providerId.value },
    });
    return rows.map((row) => QuotePrismaMapper.toDomain(row));
  }

  async save(quote: Quote): Promise<void> {
    const data = QuotePrismaMapper.toPersistence(quote);
    await this.prisma.quoteModel.upsert({
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
      orderBy: { createdAt: 'desc' },
    });
    const lower = term.toLowerCase();
    return rows
      .filter((row) => row.notes.toLowerCase().includes(lower))
      .map((row) => QuotePrismaMapper.toDomain(row));
  }
}
