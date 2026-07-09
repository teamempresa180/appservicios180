import { Identity } from './identity.entity';
import { IdentityId } from '../value-objects/identity-id.value-object';
import { DocumentType } from '../value-objects/document-type.value-object';
import { IdentityStatus } from '../value-objects/identity-status.value-object';

describe('Identity', () => {
  it('holds all the assigned properties', () => {
    const id = IdentityId.create();
    const now = new Date();
    const identity = new Identity(id, {
      fullName: 'Ana María Gómez',
      documentType: DocumentType.NationalId,
      documentNumber: '1002003000',
      birthDate: new Date('1990-05-10'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(identity.id).toBe(id);
    expect(identity.fullName).toBe('Ana María Gómez');
    expect(identity.documentType).toBe(DocumentType.NationalId);
    expect(identity.documentNumber).toBe('1002003000');
    expect(identity.status).toBe(IdentityStatus.Active);
  });

  it('is equal to another identity with the same id', () => {
    const id = IdentityId.create();
    const now = new Date();
    const props = {
      fullName: 'Ana',
      documentType: DocumentType.NationalId,
      documentNumber: '123',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Identity(id, props);
    const b = new Identity(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
