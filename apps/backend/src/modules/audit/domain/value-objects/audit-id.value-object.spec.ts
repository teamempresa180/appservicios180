import { AuditId } from './audit-id.value-object';

describe('AuditId', () => {
  it('creates a new unique id', () => {
    const a = AuditId.create();
    const b = AuditId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('is equal by value', () => {
    const a = AuditId.fromString('same-id');
    const b = AuditId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
