import { Audit } from './audit.entity';
import { AuditId } from '../value-objects/audit-id.value-object';
import { AuditActionType } from '../value-objects/audit-action-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Audit', () => {
  it('holds all the assigned properties', () => {
    const id = AuditId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const audit = new Audit(id, {
      identityId,
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device',
      occurredAt: now,
    });

    expect(audit.id).toBe(id);
    expect(audit.identityId).toBe(identityId);
    expect(audit.actionType).toBe(AuditActionType.LoggedIn);
    expect(audit.occurredAt).toBe(now);
  });
});
