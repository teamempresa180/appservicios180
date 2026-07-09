import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';

/**
 * Input shape for updating a Review. No validation.
 */
export class UpdateReviewDto {
  title?: string;
  comment?: string;
  status?: ReviewStatus;
}
