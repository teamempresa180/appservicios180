import { Review } from '../../domain/entities/review.entity';
import { ReviewDto } from '../dto/review.dto';

/**
 * Translates between the Review domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ReviewMapper {
  static toDto(review: Review): ReviewDto {
    const dto = new ReviewDto();
    dto.id = review.id.value;
    dto.orderId = review.orderId.value;
    dto.providerId = review.providerId.value;
    dto.reviewerIdentityId = review.reviewerIdentityId.value;
    dto.rating = review.rating.value;
    dto.title = review.title;
    dto.comment = review.comment;
    dto.status = review.status;
    dto.createdAt = review.createdAt;
    dto.updatedAt = review.updatedAt;
    return dto;
  }
}
