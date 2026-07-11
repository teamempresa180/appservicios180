import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { PrismaContactRepository } from './prisma-contact.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaContactRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaContactRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-contact-it-${Date.now()}`,
        fullName: 'Contact Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-CONTACT-${Date.now()}`,
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

  function buildContact(overrides: Partial<{ value: string }> = {}) {
    const now = new Date();
    return new Contact(ContactId.create(), {
      identityId: IdentityId.fromString(identityId),
      type: ContactType.Email,
      value: overrides.value ?? `integration-${Date.now()}@test.com`,
      status: ContactStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Contact by id', async () => {
    const contact = buildContact();

    await repository.save(contact);
    const found = await repository.findById(contact.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(contact.id)).toBe(true);
    expect(found?.value).toBe(contact.value);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ContactId.create());
    expect(found).toBeNull();
  });

  it('finds Contacts by identityId', async () => {
    const contact = buildContact();
    await repository.save(contact);

    const results = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(results.some((c) => c.id.equals(contact.id))).toBe(true);
  });

  it('updates an existing Contact on save (upsert)', async () => {
    const contact = buildContact({ value: 'before@update.com' });
    await repository.save(contact);

    const updated = new Contact(contact.id, {
      identityId: contact.identityId,
      type: contact.type,
      value: 'after@update.com',
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(contact.id);
    expect(found?.value).toBe('after@update.com');
  });

  it('deletes a Contact', async () => {
    const contact = buildContact();
    await repository.save(contact);

    await repository.delete(contact.id);

    const found = await repository.findById(contact.id);
    expect(found).toBeNull();
  });

  it('lists Contacts with pagination', async () => {
    await repository.save(buildContact());
    await repository.save(buildContact());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Contacts by value', async () => {
    const marker = `searchable-${Date.now()}@test.com`;
    await repository.save(buildContact({ value: marker }));

    const results = await repository.search(marker);

    expect(results.some((contact) => contact.value === marker)).toBe(true);
  });
});
