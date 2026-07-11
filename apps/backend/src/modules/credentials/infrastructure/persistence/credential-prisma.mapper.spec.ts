import { CredentialModel as PrismaCredential } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CredentialPrismaMapper } from './credential-prisma.mapper';

describe('CredentialPrismaMapper', () => {
  const row: PrismaCredential = {
    id: 'cred-1',
    identityId: 'identity-1',
    type: 'PASSWORD',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const credential = CredentialPrismaMapper.toDomain(row);

    expect(credential.id.value).toBe('cred-1');
    expect(credential.identityId.value).toBe('identity-1');
    expect(credential.type).toBe(CredentialType.Password);
    expect(credential.status).toBe(CredentialStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const credential = new Credential(CredentialId.fromString('cred-1'), {
      identityId: IdentityId.fromString('identity-1'),
      type: CredentialType.Password,
      status: CredentialStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(CredentialPrismaMapper.toPersistence(credential)).toEqual(row);
  });
});
