import { Verification } from './verification.entity';
import { VerificationId } from '../value-objects/verification-id.value-object';
import { VerificationType } from '../value-objects/verification-type.value-object';
import { VerificationStatus } from '../value-objects/verification-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Verification', () => {
  it('holds all the assigned properties', () => {
    const id = VerificationId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const verification = new Verification(id, {
      identityId,
      type: VerificationType.Document,
      status: VerificationStatus.Approved,
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      documentPath: null,
    });

    expect(verification.id).toBe(id);
    expect(verification.identityId).toBe(identityId);
    expect(verification.type).toBe(VerificationType.Document);
    expect(verification.status).toBe(VerificationStatus.Approved);
    expect(verification.documentPath).toBeNull();
  });

  it('holds an assigned documentPath', () => {
    const id = VerificationId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const verification = new Verification(id, {
      identityId,
      type: VerificationType.CriminalRecord,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      documentPath: 'uploads/verifications/id-1/record.pdf',
    });

    expect(verification.type).toBe(VerificationType.CriminalRecord);
    expect(verification.documentPath).toBe(
      'uploads/verifications/id-1/record.pdf',
    );
  });
});
