import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { DeleteReviewCommand } from '../commands/delete-review.command';

/**
 * Deletes an existing Review. No cascade rule is documented for what
 * this means for aggregate reputation scores — same criterion as
 * every other `Delete*UseCase`.
 */
export class DeleteReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(command: DeleteReviewCommand): Promise<void> {
    const id = ReviewId.fromString(command.id);
    const existing = await this.reviewRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Review ${command.id} not found`);
    }
    await this.reviewRepository.delete(id);
  }
}
