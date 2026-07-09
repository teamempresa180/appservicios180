/**
 * Input shape for creating a Review. No validation.
 */
export class CreateReviewDto {
  orderId!: string;
  providerId!: string;
  reviewerIdentityId!: string;
  rating!: number;
  title!: string;
  comment!: string;
}
