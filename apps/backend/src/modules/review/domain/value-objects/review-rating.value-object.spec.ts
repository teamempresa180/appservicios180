import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ReviewRating } from './review-rating.value-object';

describe('ReviewRating', () => {
  it('wraps a numeric value', () => {
    const rating = ReviewRating.of(5);
    expect(rating.value).toBe(5);
  });

  it('is equal by value', () => {
    expect(ReviewRating.of(4).equals(ReviewRating.of(4))).toBe(true);
    expect(ReviewRating.of(4).equals(ReviewRating.of(3))).toBe(false);
  });

  it('accepts both ends of the scale', () => {
    expect(ReviewRating.of(1).value).toBe(1);
    expect(ReviewRating.of(5).value).toBe(5);
  });

  it('rejects a rating outside 1..5', () => {
    expect(() => ReviewRating.of(0)).toThrow(ValidationException);
    expect(() => ReviewRating.of(-5)).toThrow(ValidationException);
    expect(() => ReviewRating.of(6)).toThrow(ValidationException);
    expect(() => ReviewRating.of(1000000)).toThrow(ValidationException);
  });

  it('rejects a fractional rating', () => {
    expect(() => ReviewRating.of(4.5)).toThrow(ValidationException);
  });
});
