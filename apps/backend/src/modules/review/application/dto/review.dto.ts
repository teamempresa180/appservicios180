import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ReviewDto {
  id!: string;
  orderId!: string;
  providerId!: string;
  reviewerIdentityId!: string;
  rating!: number;
  title!: string;
  comment!: string;
  status!: ReviewStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
