import { PrismaClient } from '@prisma/client';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { PrismaIdentityRepository } from '../../../identity/infrastructure/persistence/prisma-identity.repository';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { PrismaAuthenticationRepository } from './prisma-authentication.repository';

/**
 * Integration test — see `PrismaIdentityRepository.integration.spec.ts`
 * for the run instructions. Creates its own Identity first (a real
 * foreign key exists in `authentications.identity_id`).
 */
describe('PrismaAuthenticationRepository (integration)', () => {
  const prisma = new PrismaClient();
  const identityRepository = new PrismaIdentityRepository(prisma as never);
  const repository = new PrismaAuthenticationRepository(prisma as never);

  async function seedIdentity(): Promise<IdentityId> {
    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner Of Authentication',
      documentType: DocumentType.NationalId,
      documentNumber: `IT-AUTH-${Date.now()}-${Math.random()}`,
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

  it('saves and finds an Authentication by id', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const authentication = new Authentication(AuthenticationId.create(), {
      identityId,
      methodType: AuthMethodType.Password,
      status: AuthenticationStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await repository.save(authentication);
    const found = await repository.findById(authentication.id);

    expect(found).not.toBeNull();
    expect(found?.identityId.equals(identityId)).toBe(true);
    expect(found?.methodType).toBe(AuthMethodType.Password);
  });

  it('finds all Authentications for an Identity', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    await repository.save(
      new Authentication(AuthenticationId.create(), {
        identityId,
        methodType: AuthMethodType.Password,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );
    await repository.save(
      new Authentication(AuthenticationId.create(), {
        identityId,
        methodType: AuthMethodType.Biometric,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const found = await repository.findByIdentityId(identityId);

    expect(found).toHaveLength(2);
  });

  it('deletes an Authentication', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const authentication = new Authentication(AuthenticationId.create(), {
      identityId,
      methodType: AuthMethodType.OneTimeCode,
      status: AuthenticationStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await repository.save(authentication);

    await repository.delete(authentication.id);

    expect(await repository.findById(authentication.id)).toBeNull();
  });

  it('searches Authentications by methodType', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    await repository.save(
      new Authentication(AuthenticationId.create(), {
        identityId,
        methodType: AuthMethodType.ThirdParty,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const results = await repository.search('THIRD_PARTY');

    expect(
      results.some((auth) => auth.methodType === AuthMethodType.ThirdParty),
    ).toBe(true);
  });
});
