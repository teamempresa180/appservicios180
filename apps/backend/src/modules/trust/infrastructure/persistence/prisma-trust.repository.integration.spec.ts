import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustScore } from '../../domain/value-objects/trust-score.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { PrismaTrustRepository } from './prisma-trust.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaTrustRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaTrustRepository(prisma as never);

  async function createIdentity(): Promise<string> {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-trust-it-${Date.now()}-${Math.random()}`,
        fullName: 'Trust Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-TRUST-${Date.now()}-${Math.random()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return identity.id;
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildTrust(identityId: string) {
    const now = new Date();
    return new Trust(TrustId.create(), {
      identityId: IdentityId.fromString(identityId),
      score: TrustScore.of(75),
      level: TrustLevel.High,
      status: TrustStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Trust record by id', async () => {
    const identityId = await createIdentity();
    const trust = buildTrust(identityId);

    await repository.save(trust);
    const found = await repository.findById(trust.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(trust.id)).toBe(true);
    expect(found?.score.value).toBe(75);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(TrustId.create());
    expect(found).toBeNull();
  });

  it('finds a Trust record by identityId (singular, not array)', async () => {
    const identityId = await createIdentity();
    const trust = buildTrust(identityId);
    await repository.save(trust);

    const found = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(found?.id.equals(trust.id)).toBe(true);
  });

  it('updates an existing Trust record on save (upsert)', async () => {
    const identityId = await createIdentity();
    const trust = buildTrust(identityId);
    await repository.save(trust);

    const updated = new Trust(trust.id, {
      identityId: trust.identityId,
      score: TrustScore.of(90),
      level: TrustLevel.VeryHigh,
      status: trust.status,
      createdAt: trust.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(trust.id);
    expect(found?.score.value).toBe(90);
  });

  it('lists Trust records with pagination', async () => {
    await repository.save(buildTrust(await createIdentity()));
    await repository.save(buildTrust(await createIdentity()));

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Trust records by level', async () => {
    const identityId = await createIdentity();
    await repository.save(buildTrust(identityId));

    const results = await repository.search('high');

    expect(results.some((trust) => trust.level === TrustLevel.High)).toBe(true);
  });
});
