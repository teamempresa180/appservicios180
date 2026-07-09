import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewDto } from '../dto/review.dto';
import { GetReviewQuery } from '../queries/get-review.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(query: GetReviewQuery): Promise<ReviewDto | null> {
    void this.reviewRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
