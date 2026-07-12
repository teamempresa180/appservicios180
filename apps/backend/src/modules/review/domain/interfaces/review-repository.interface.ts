import { PaginatedResult } from '../../../core/application/paginated-result';
import { Review } from '../entities/review.entity';
import { ReviewId } from '../value-objects/review-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Review persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 9: `PrismaReviewRepository`).
 *
 * `findByOrderId` returns `Review[]` (not a single `Review`) — no 1:1
 * invariant between `Order` and `Review` exists in this repository
 * contract.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ReviewRepository` implementation by contract
 *  instead of by concrete class. */
export const REVIEW_REPOSITORY = Symbol('ReviewRepository');

export interface ReviewRepository {
  findById(id: ReviewId): Promise<Review | null>;
  findByOrderId(orderId: OrderId): Promise<Review[]>;
  findByProviderId(providerId: ProviderId): Promise<Review[]>;
  findByReviewerIdentityId(identityId: IdentityId): Promise<Review[]>;
  save(review: Review): Promise<void>;
  delete(id: ReviewId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Review>>;
  /** Free-text match against `title`/`comment`. */
  search(term: string): Promise<Review[]>;
}
