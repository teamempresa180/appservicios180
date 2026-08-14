import { Caller } from '../../../core/application/caller';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { Review } from '../../domain/entities/review.entity';

/**
 * Per-record authorization for a Review.
 *
 * Reads are deliberately *not* restricted: reviews are public
 * marketplace content, and any customer needs to read a Provider's
 * reviews before hiring them. Only authorship is protected — and the
 * asymmetry matters most for the reviewed Provider, who must never be
 * able to edit or delete criticism of their own work.
 */
export function assertReviewAuthor(
  review: Review,
  caller: Caller,
  action: string,
): void {
  if (
    caller.isAdmin ||
    review.reviewerIdentityId.value === caller.identityId
  ) {
    return;
  }
  throw new ForbiddenException(
    `Only the author of Review ${review.id.value} may ${action} it`,
  );
}
