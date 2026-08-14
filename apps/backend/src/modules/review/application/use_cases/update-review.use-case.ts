import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Review } from '../../domain/entities/review.entity';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { assertReviewAuthor } from '../authorization/review-access';
import { UpdateReviewCommand } from '../commands/update-review.command';
import { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';
import { ReviewValidator } from '../validators/review.validator';

/**
 * Updates the mutable fields of an existing Review (`title`,
 * `comment`) — `orderId`/`providerId`/`reviewerIdentityId`/`rating`/
 * `status` are not offered by `UpdateReviewCommand`, so they stay
 * untouched.
 *
 * Restricted to the review's author (or an Admin) — notably the
 * reviewed Provider must not be able to rewrite criticism of their
 * own work.
 */
export class UpdateReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(command: UpdateReviewCommand): Promise<ReviewDto> {
    ReviewValidator.validateUpdate(command);

    const id = ReviewId.fromString(command.id);
    const existing = await this.reviewRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Review ${command.id} not found`);
    }
    assertReviewAuthor(existing, command.caller, 'update');

    const updated = new Review(existing.id, {
      orderId: existing.orderId,
      providerId: existing.providerId,
      reviewerIdentityId: existing.reviewerIdentityId,
      rating: existing.rating,
      title: command.title ?? existing.title,
      comment: command.comment ?? existing.comment,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.reviewRepository.save(updated);
    return ReviewMapper.toDto(updated);
  }
}
