import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';
import { GetReviewQuery } from '../queries/get-review.query';

/**
 * Fetches a single Review by id, returning `null` when not found —
 * matches the `Promise<ReviewDto | null>` signature already declared
 * for this use case.
 */
export class GetReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: GetReviewQuery): Promise<ReviewDto | null> {
    const review = await this.reviewRepository.findById(
      ReviewId.fromString(query.id),
    );
    return review ? ReviewMapper.toDto(review) : null;
  }
}
