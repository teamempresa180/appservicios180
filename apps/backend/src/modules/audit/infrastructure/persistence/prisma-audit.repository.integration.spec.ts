import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../domain/entities/audit.entity';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { PrismaAuditRepository } from './prisma-audit.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaAuditRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaAuditRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-audit-it-${Date.now()}`,
        fullName: 'Audit Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-AUDIT-${Date.now()}`,
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

  function buildAudit(overrides: Partial<{ description: string }> = {}) {
    return new Audit(AuditId.create(), {
      identityId: IdentityId.fromString(identityId),
      actionType: AuditActionType.Created,
      description: overrides.description ?? 'Integration test event',
      occurredAt: new Date(),
    });
  }

  it('saves and finds an Audit record by id', async () => {
    const audit = buildAudit();

    await repository.save(audit);
    const found = await repository.findById(audit.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(audit.id)).toBe(true);
    expect(found?.description).toBe(audit.description);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(AuditId.create());
    expect(found).toBeNull();
  });

  it('finds Audit records by identityId', async () => {
    const audit = buildAudit();
    await repository.save(audit);

    const results = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(results.some((a) => a.id.equals(audit.id))).toBe(true);
  });

  it('lists Audit records with pagination', async () => {
    await repository.save(buildAudit());
    await repository.save(buildAudit());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Audit records by description', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildAudit({ description: marker }));

    const results = await repository.search(marker);

    expect(results.some((audit) => audit.description === marker)).toBe(true);
  });
});
