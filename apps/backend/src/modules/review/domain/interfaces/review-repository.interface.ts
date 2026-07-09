import { Review } from '../entities/review.entity';
import { ReviewId } from '../value-objects/review-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Review persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ReviewRepository {
  findById(id: ReviewId): Promise<Review | null>;
  findByOrderId(orderId: OrderId): Promise<Review[]>;
  findByProviderId(providerId: ProviderId): Promise<Review[]>;
  findByReviewerIdentityId(identityId: IdentityId): Promise<Review[]>;
  save(review: Review): Promise<void>;
}
