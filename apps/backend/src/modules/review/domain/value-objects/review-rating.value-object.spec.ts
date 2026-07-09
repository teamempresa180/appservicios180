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
});
