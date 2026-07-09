import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewDto } from '../dto/review.dto';
import { UpdateReviewCommand } from '../commands/update-review.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(command: UpdateReviewCommand): Promise<ReviewDto> {
    void this.reviewRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
