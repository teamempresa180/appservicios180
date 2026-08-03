import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../domain/entities/review.entity';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewPrismaMapper } from './review-prisma.mapper';

/**
 * `ReviewRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ReviewId): Promise<Review | null> {
    const row = await this.prisma.reviewModel.findUnique({
      where: { id: id.value },
    });
    return row ? ReviewPrismaMapper.toDomain(row) : null;
  }

  async findByOrderId(orderId: OrderId): Promise<Review[]> {
    const rows = await this.prisma.reviewModel.findMany({
      where: { orderId: orderId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ReviewPrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Review[]> {
    const rows = await this.prisma.reviewModel.findMany({
      where: { providerId: providerId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ReviewPrismaMapper.toDomain(row));
  }

  async findByReviewerIdentityId(identityId: IdentityId): Promise<Review[]> {
    const rows = await this.prisma.reviewModel.findMany({
      where: { reviewerIdentityId: identityId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ReviewPrismaMapper.toDomain(row));
  }

  async save(review: Review): Promise<void> {
    const data = ReviewPrismaMapper.toPersistence(review);
    await this.prisma.reviewModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ReviewId): Promise<void> {
    await this.prisma.reviewModel.delete({ where: { id: id.value } });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Review>> {
    const [rows, total] = await Promise.all([
      this.prisma.reviewModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reviewModel.count(),
    ]);
    return {
      items: rows.map((row) => ReviewPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Review[]> {
    const rows = await this.prisma.reviewModel.findMany({
      where: {
        OR: [{ title: { contains: term } }, { comment: { contains: term } }],
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ReviewPrismaMapper.toDomain(row));
  }
}
