import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { PrismaVerificationRepository } from './prisma-verification.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaVerificationRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaVerificationRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-verification-it-${Date.now()}`,
        fullName: 'Verification Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-VERIFICATION-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    identityId = identity.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildVerification(
    overrides: Partial<{ type: VerificationType }> = {},
  ) {
    const now = new Date();
    return new Verification(VerificationId.create(), {
      identityId: IdentityId.fromString(identityId),
      type: overrides.type ?? VerificationType.Document,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      documentPath: null,
    });
  }

  it('saves and finds a Verification by id', async () => {
    const verification = buildVerification();

    await repository.save(verification);
    const found = await repository.findById(verification.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(verification.id)).toBe(true);
    expect(found?.type).toBe(verification.type);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(VerificationId.create());
    expect(found).toBeNull();
  });

  it('finds Verifications by identityId', async () => {
    const verification = buildVerification();
    await repository.save(verification);

    const results = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(results.some((v) => v.id.equals(verification.id))).toBe(true);
  });

  it('updates an existing Verification on save (upsert)', async () => {
    const verification = buildVerification();
    await repository.save(verification);

    const updated = new Verification(verification.id, {
      identityId: verification.identityId,
      type: verification.type,
      status: VerificationStatus.Approved,
      verifiedAt: new Date(),
      createdAt: verification.createdAt,
      updatedAt: new Date(),
      documentPath: verification.documentPath,
    });
    await repository.save(updated);

    const found = await repository.findById(verification.id);
    expect(found?.status).toBe(VerificationStatus.Approved);
  });

  it('lists Verifications with pagination', async () => {
    await repository.save(buildVerification());
    await repository.save(buildVerification());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Verifications by type', async () => {
    await repository.save(buildVerification({ type: VerificationType.Facial }));

    const results = await repository.search('facial');

    expect(results.some((v) => v.type === VerificationType.Facial)).toBe(true);
  });
});
