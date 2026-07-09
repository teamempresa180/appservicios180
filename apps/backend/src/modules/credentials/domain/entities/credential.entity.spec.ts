import { Credential } from './credential.entity';
import { CredentialId } from '../value-objects/credential-id.value-object';
import { CredentialType } from '../value-objects/credential-type.value-object';
import { CredentialStatus } from '../value-objects/credential-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Credential', () => {
  it('holds all the assigned properties', () => {
    const id = CredentialId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const credential = new Credential(id, {
      identityId,
      type: CredentialType.Password,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(credential.id).toBe(id);
    expect(credential.identityId).toBe(identityId);
    expect(credential.type).toBe(CredentialType.Password);
    expect(credential.status).toBe(CredentialStatus.Active);
  });
});
