import { ValueObject } from '../../../core/domain/base/value-object.base';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';

interface ReviewRatingProps {
  value: number;
}

/** Lowest rating a review may carry (inclusive). */
export const MIN_REVIEW_RATING = 1;
/** Highest rating a review may carry (inclusive). */
export const MAX_REVIEW_RATING = 5;

/**
 * The numeric rating a customer gives in a review: a whole number of
 * stars from 1 to 5.
 *
 * The scale is enforced here, not only in the HTTP DTO. It is a rule
 * about what a rating *is* — a provider's aggregate score is the mean
 * of these values, so a single `1000000` or `-5` silently corrupts
 * every reputation figure derived from it, and until now nothing in
 * the stack rejected either (the DTO had no decorators and the column
 * is a plain `Int`). Keeping the check in the value object means it
 * holds for every construction path, including the Prisma mapper
 * hydrating a row, not just for requests that happen to arrive
 * through the controller.
 */
export class ReviewRating extends ValueObject<ReviewRatingProps> {
  private constructor(value: number) {
    super({ value });
  }

  public static of(value: number): ReviewRating {
    if (!Number.isInteger(value)) {
      throw new ValidationException('rating must be a whole number');
    }
    if (value < MIN_REVIEW_RATING || value > MAX_REVIEW_RATING) {
      throw new ValidationException(
        `rating must be between ${MIN_REVIEW_RATING} and ${MAX_REVIEW_RATING}`,
      );
    }
    return new ReviewRating(value);
  }

  public get value(): number {
    return this.props.value;
  }
}
