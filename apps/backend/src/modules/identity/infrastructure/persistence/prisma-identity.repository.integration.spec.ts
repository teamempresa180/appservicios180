import { PrismaClient } from '@prisma/client';
import { Identity } from '../../domain/entities/identity.entity';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { PrismaIdentityRepository } from './prisma-identity.repository';

/**
 * Integration test — runs against a real PostgreSQL database (see
 * `DATABASE_URL`; `npm run test:integration` after
 * `docker run ... postgres` + `npx prisma migrate deploy`). Excluded
 * from `npm test` (see `testPathIgnorePatterns` in `package.json`) so
 * the default test suite never requires a live database.
 */
describe('PrismaIdentityRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaIdentityRepository(prisma as never);

  function buildIdentity(overrides: Partial<{ fullName: string }> = {}) {
    const now = new Date();
    return new Identity(IdentityId.create(), {
      fullName: overrides.fullName ?? 'Integration Test User',
      documentType: DocumentType.NationalId,
      documentNumber: `IT-${Date.now()}-${Math.random()}`,
      birthDate: new Date('1995-06-15'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('saves and finds an Identity by id', async () => {
    const identity = buildIdentity();

    await repository.save(identity);
    const found = await repository.findById(identity.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(identity.id)).toBe(true);
    expect(found?.fullName).toBe(identity.fullName);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(IdentityId.create());
    expect(found).toBeNull();
  });

  it('updates an existing Identity on save (upsert)', async () => {
    const identity = buildIdentity({ fullName: 'Before Update' });
    await repository.save(identity);

    const updated = new Identity(identity.id, {
      fullName: 'After Update',
      documentType: identity.documentType,
      documentNumber: identity.documentNumber,
      birthDate: identity.birthDate,
      status: identity.status,
      createdAt: identity.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(identity.id);
    expect(found?.fullName).toBe('After Update');
  });

  it('deletes an Identity', async () => {
    const identity = buildIdentity();
    await repository.save(identity);

    await repository.delete(identity.id);

    const found = await repository.findById(identity.id);
    expect(found).toBeNull();
  });

  it('lists Identities with pagination', async () => {
    await repository.save(buildIdentity());
    await repository.save(buildIdentity());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Identities by fullName', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildIdentity({ fullName: marker }));

    const results = await repository.search(marker);

    expect(results.some((identity) => identity.fullName === marker)).toBe(true);
  });
});
