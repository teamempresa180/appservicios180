import { ReviewId } from './review-id.value-object';

describe('ReviewId', () => {
  it('creates a new unique id', () => {
    const a = ReviewId.create();
    const b = ReviewId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ReviewId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ReviewId.fromString('same-id');
    const b = ReviewId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
