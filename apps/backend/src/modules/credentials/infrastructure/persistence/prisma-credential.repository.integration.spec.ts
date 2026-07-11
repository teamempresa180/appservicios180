import { PrismaClient } from '@prisma/client';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { PrismaIdentityRepository } from '../../../identity/infrastructure/persistence/prisma-identity.repository';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { PrismaCredentialRepository } from './prisma-credential.repository';

/**
 * Integration test — see `PrismaIdentityRepository.integration.spec.ts`
 * for the run instructions.
 */
describe('PrismaCredentialRepository (integration)', () => {
  const prisma = new PrismaClient();
  const identityRepository = new PrismaIdentityRepository(prisma as never);
  const repository = new PrismaCredentialRepository(prisma as never);

  async function seedIdentity(): Promise<IdentityId> {
    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner Of Credential',
      documentType: DocumentType.NationalId,
      documentNumber: `IT-CRED-${Date.now()}-${Math.random()}`,
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    return identity.id;
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('saves and finds a Credential by id', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId,
      type: CredentialType.Password,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await repository.save(credential);
    const found = await repository.findById(credential.id);

    expect(found).not.toBeNull();
    expect(found?.identityId.equals(identityId)).toBe(true);
    expect(found?.type).toBe(CredentialType.Password);
  });

  it('finds all Credentials for an Identity', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    await repository.save(
      new Credential(CredentialId.create(), {
        identityId,
        type: CredentialType.Password,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );
    await repository.save(
      new Credential(CredentialId.create(), {
        identityId,
        type: CredentialType.RecoveryCode,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const found = await repository.findByIdentityId(identityId);

    expect(found).toHaveLength(2);
  });

  it('deletes a Credential', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const credential = new Credential(CredentialId.create(), {
      identityId,
      type: CredentialType.SecurityKey,
      status: CredentialStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await repository.save(credential);

    await repository.delete(credential.id);

    expect(await repository.findById(credential.id)).toBeNull();
  });

  it('lists Credentials with pagination', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    await repository.save(
      new Credential(CredentialId.create(), {
        identityId,
        type: CredentialType.Other,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const page = await repository.list(1, 5);

    expect(page.items.length).toBeGreaterThan(0);
    expect(page.pageSize).toBe(5);
  });
});
