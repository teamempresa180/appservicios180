import { MessageId } from './message-id.value-object';

describe('MessageId', () => {
  it('creates a new unique id', () => {
    const a = MessageId.create();
    const b = MessageId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = MessageId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = MessageId.fromString('same-id');
    const b = MessageId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
