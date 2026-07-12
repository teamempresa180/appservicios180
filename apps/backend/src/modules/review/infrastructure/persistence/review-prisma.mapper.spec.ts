import { ReviewModel as PrismaReview } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../domain/entities/review.entity';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewRating } from '../../domain/value-objects/review-rating.value-object';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';
import { ReviewPrismaMapper } from './review-prisma.mapper';

describe('ReviewPrismaMapper', () => {
  const row: PrismaReview = {
    id: 'id-1',
    orderId: 'order-1',
    providerId: 'provider-1',
    reviewerIdentityId: 'identity-1',
    rating: 5,
    title: 'Great service',
    comment: 'Very professional and on time.',
    status: 'PENDING',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const review = ReviewPrismaMapper.toDomain(row);

    expect(review.id.value).toBe('id-1');
    expect(review.orderId.value).toBe('order-1');
    expect(review.providerId.value).toBe('provider-1');
    expect(review.reviewerIdentityId.value).toBe('identity-1');
    expect(review.rating.value).toBe(5);
    expect(review.status).toBe(ReviewStatus.Pending);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const review = new Review(ReviewId.fromString('id-1'), {
      orderId: OrderId.fromString('order-1'),
      providerId: ProviderId.fromString('provider-1'),
      reviewerIdentityId: IdentityId.fromString('identity-1'),
      rating: ReviewRating.of(5),
      title: 'Great service',
      comment: 'Very professional and on time.',
      status: ReviewStatus.Pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ReviewPrismaMapper.toPersistence(review)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const review = ReviewPrismaMapper.toDomain(row);
    expect(ReviewPrismaMapper.toPersistence(review)).toEqual(row);
  });
});
