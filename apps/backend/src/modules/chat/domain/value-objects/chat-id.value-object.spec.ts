import { ChatId } from './chat-id.value-object';

describe('ChatId', () => {
  it('creates a new unique id', () => {
    const a = ChatId.create();
    const b = ChatId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ChatId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ChatId.fromString('same-id');
    const b = ChatId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
