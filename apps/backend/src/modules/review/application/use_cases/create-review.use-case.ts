import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewDto } from '../dto/review.dto';
import { CreateReviewCommand } from '../commands/create-review.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(command: CreateReviewCommand): Promise<ReviewDto> {
    void this.reviewRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
