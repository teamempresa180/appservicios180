import { ContactModel as PrismaContact } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * Translates between the `Contact` domain entity and its Prisma row
 * shape (`ContactModel`, mapped to the `contacts` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ContactPrismaMapper {
  static toDomain(row: PrismaContact): Contact {
    return new Contact(ContactId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      type: row.type as unknown as ContactType,
      value: row.value,
      status: row.status as unknown as ContactStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(contact: Contact): PrismaContact {
    return {
      id: contact.id.value,
      identityId: contact.identityId.value,
      type: contact.type,
      value: contact.value,
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
