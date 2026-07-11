import { IdentityModel as PrismaIdentity } from '@prisma/client';
import { Identity } from '../../domain/entities/identity.entity';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * Translates between the `Identity` domain entity and its Prisma row
 * shape (`IdentityModel`, mapped to the `identities` table). The only
 * place in the app that imports from `@prisma/client` for this
 * module — Domain/Application never do.
 */
export class IdentityPrismaMapper {
  static toDomain(row: PrismaIdentity): Identity {
    return new Identity(IdentityId.fromString(row.id), {
      fullName: row.fullName,
      documentType: row.documentType as unknown as DocumentType,
      documentNumber: row.documentNumber,
      birthDate: row.birthDate,
      status: row.status as unknown as IdentityStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(identity: Identity): PrismaIdentity {
    return {
      id: identity.id.value,
      fullName: identity.fullName,
      documentType: identity.documentType,
      documentNumber: identity.documentNumber,
      birthDate: identity.birthDate,
      status: identity.status,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    };
  }
}
