import { Entity } from '../../../core/domain/base/entity.base';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ReviewId } from '../value-objects/review-id.value-object';
import { ReviewRating } from '../value-objects/review-rating.value-object';
import { ReviewStatus } from '../value-objects/review-status.value-object';

export interface ReviewProps {
  orderId: OrderId;
  providerId: ProviderId;
  reviewerIdentityId: IdentityId;
  rating: ReviewRating;
  title: string;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a review a customer leaves after an order is completed.
 * Pure data holder — no reputation, no trust score calculation, no
 * moderation, no reports, no AI, no persistence, no business rules.
 */
export class Review extends Entity<ReviewId> {
  public readonly orderId: OrderId;
  public readonly providerId: ProviderId;
  public readonly reviewerIdentityId: IdentityId;
  public readonly rating: ReviewRating;
  public readonly title: string;
  public readonly comment: string;
  public readonly status: ReviewStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ReviewId, props: ReviewProps) {
    super(id);
    this.orderId = props.orderId;
    this.providerId = props.providerId;
    this.reviewerIdentityId = props.reviewerIdentityId;
    this.rating = props.rating;
    this.title = props.title;
    this.comment = props.comment;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
