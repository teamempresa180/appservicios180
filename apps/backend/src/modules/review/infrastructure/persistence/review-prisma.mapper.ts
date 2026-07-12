import { ReviewModel as PrismaReview } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../domain/entities/review.entity';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewRating } from '../../domain/value-objects/review-rating.value-object';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';

/**
 * Translates between the `Review` domain entity and its Prisma row
 * shape (`ReviewModel`, mapped to the `reviews` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ReviewPrismaMapper {
  static toDomain(row: PrismaReview): Review {
    return new Review(ReviewId.fromString(row.id), {
      orderId: OrderId.fromString(row.orderId),
      providerId: ProviderId.fromString(row.providerId),
      reviewerIdentityId: IdentityId.fromString(row.reviewerIdentityId),
      rating: ReviewRating.of(row.rating),
      title: row.title,
      comment: row.comment,
      status: row.status as unknown as ReviewStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(review: Review): PrismaReview {
    return {
      id: review.id.value,
      orderId: review.orderId.value,
      providerId: review.providerId.value,
      reviewerIdentityId: review.reviewerIdentityId.value,
      rating: review.rating.value,
      title: review.title,
      comment: review.comment,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
