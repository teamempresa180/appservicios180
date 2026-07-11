import { ContactModel as PrismaContact } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactPrismaMapper } from './contact-prisma.mapper';

describe('ContactPrismaMapper', () => {
  const row: PrismaContact = {
    id: 'id-1',
    identityId: 'identity-1',
    type: 'EMAIL',
    value: 'a@b.com',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const contact = ContactPrismaMapper.toDomain(row);

    expect(contact.id.value).toBe('id-1');
    expect(contact.identityId.value).toBe('identity-1');
    expect(contact.type).toBe(ContactType.Email);
    expect(contact.status).toBe(ContactStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const contact = new Contact(ContactId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      type: ContactType.Email,
      value: 'a@b.com',
      status: ContactStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ContactPrismaMapper.toPersistence(contact)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const contact = ContactPrismaMapper.toDomain(row);
    expect(ContactPrismaMapper.toPersistence(contact)).toEqual(row);
  });
});
