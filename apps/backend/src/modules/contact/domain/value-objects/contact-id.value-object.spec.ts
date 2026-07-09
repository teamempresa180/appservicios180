import { ContactId } from './contact-id.value-object';

describe('ContactId', () => {
  it('creates a new unique id', () => {
    const a = ContactId.create();
    const b = ContactId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = ContactId.fromString('same-id');
    const b = ContactId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
