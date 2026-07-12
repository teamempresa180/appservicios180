import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../../domain/entities/review.entity';
import { ReviewRepository } from '../../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../../domain/value-objects/review-id.value-object';

/** In-memory `ReviewRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryReviewRepository implements ReviewRepository {
  private readonly rows = new Map<string, Review>();

  findById(id: ReviewId): Promise<Review | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByOrderId(orderId: OrderId): Promise<Review[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.orderId.equals(orderId)),
    );
  }

  findByProviderId(providerId: ProviderId): Promise<Review[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  findByReviewerIdentityId(identityId: IdentityId): Promise<Review[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.reviewerIdentityId.equals(identityId),
      ),
    );
  }

  save(review: Review): Promise<void> {
    this.rows.set(review.id.value, review);
    return Promise.resolve();
  }

  delete(id: ReviewId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Review>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Review[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.title.toLowerCase().includes(lower) ||
          row.comment.toLowerCase().includes(lower),
      ),
    );
  }
}
