import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CreateReviewCommand } from '../commands/create-review.command';
import { UpdateReviewCommand } from '../commands/update-review.command';

/**
 * Structural validation for Review commands — required fields,
 * well-formed values. The `rating` *scale* is not re-checked here:
 * `ReviewRating.of()` owns it, so the bound is stated once and holds
 * for every construction path (see that value object). This validator
 * only rejects a `rating` that is not a number at all, which would
 * otherwise reach the value object as `NaN`. No uniqueness check —
 * `findByOrderId` returns `Review[]`, so multiple reviews per Order
 * are allowed.
 */
export class ReviewValidator {
  static validateCreate(command: CreateReviewCommand): void {
    if (!command.orderId?.trim()) {
      throw new ValidationException('orderId is required');
    }
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!command.reviewerIdentityId?.trim()) {
      throw new ValidationException('reviewerIdentityId is required');
    }
    if (typeof command.rating !== 'number' || Number.isNaN(command.rating)) {
      throw new ValidationException('rating must be a number');
    }
    if (!command.title?.trim()) {
      throw new ValidationException('title is required');
    }
    if (!command.comment?.trim()) {
      throw new ValidationException('comment is required');
    }
  }

  static validateUpdate(command: UpdateReviewCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.title !== undefined && !command.title.trim()) {
      throw new ValidationException('title cannot be blank');
    }
    if (command.comment !== undefined && !command.comment.trim()) {
      throw new ValidationException('comment cannot be blank');
    }
  }
}
