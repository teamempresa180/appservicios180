import { QuoteId } from './quote-id.value-object';

describe('QuoteId', () => {
  it('creates a new unique id', () => {
    const a = QuoteId.create();
    const b = QuoteId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = QuoteId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = QuoteId.fromString('same-id');
    const b = QuoteId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
