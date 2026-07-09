import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { DeleteReviewCommand } from '../commands/delete-review.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(command: DeleteReviewCommand): Promise<void> {
    void this.reviewRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
