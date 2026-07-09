import { AttachmentId } from './attachment-id.value-object';

describe('AttachmentId', () => {
  it('creates a new unique id', () => {
    const a = AttachmentId.create();
    const b = AttachmentId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = AttachmentId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = AttachmentId.fromString('same-id');
    const b = AttachmentId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
