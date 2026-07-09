import { ValueObject } from '../../../core/domain/base/value-object.base';

interface ReviewRatingProps {
  value: number;
}

/**
 * Represents the numeric rating a customer gives in a review. Pure data
 * wrapper — no scale validation, no aggregation, no scoring logic.
 */
export class ReviewRating extends ValueObject<ReviewRatingProps> {
  private constructor(value: number) {
    super({ value });
  }

  public static of(value: number): ReviewRating {
    return new ReviewRating(value);
  }

  public get value(): number {
    return this.props.value;
  }
}
