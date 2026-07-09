import { Review } from './review.entity';
import { ReviewId } from '../value-objects/review-id.value-object';
import { ReviewRating } from '../value-objects/review-rating.value-object';
import { ReviewStatus } from '../value-objects/review-status.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Review', () => {
  it('holds all the assigned properties', () => {
    const id = ReviewId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const reviewerIdentityId = IdentityId.create();
    const now = new Date();
    const review = new Review(id, {
      orderId,
      providerId,
      reviewerIdentityId,
      rating: ReviewRating.of(5),
      title: 'Excelente servicio',
      comment: 'Muy puntual y profesional',
      status: ReviewStatus.Published,
      createdAt: now,
      updatedAt: now,
    });

    expect(review.id).toBe(id);
    expect(review.orderId).toBe(orderId);
    expect(review.providerId).toBe(providerId);
    expect(review.reviewerIdentityId).toBe(reviewerIdentityId);
    expect(review.rating.value).toBe(5);
    expect(review.title).toBe('Excelente servicio');
    expect(review.status).toBe(ReviewStatus.Published);
  });

  it('is equal to another review with the same id', () => {
    const id = ReviewId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const reviewerIdentityId = IdentityId.create();
    const now = new Date();
    const props = {
      orderId,
      providerId,
      reviewerIdentityId,
      rating: ReviewRating.of(4),
      title: 'Bien',
      comment: 'Comentario',
      status: ReviewStatus.Pending,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Review(id, props);
    const b = new Review(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
