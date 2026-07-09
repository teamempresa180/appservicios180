import { CategoryId } from './category-id.value-object';

describe('CategoryId', () => {
  it('creates a new unique id', () => {
    const a = CategoryId.create();
    const b = CategoryId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = CategoryId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = CategoryId.fromString('same-id');
    const b = CategoryId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
