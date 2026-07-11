import { CredentialModel as PrismaCredential } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * Translates between the `Credential` domain entity and its Prisma
 * row shape (`CredentialModel`, mapped to the `credentials` table).
 * The only place in this module that imports from `@prisma/client` —
 * Domain/Application never do.
 */
export class CredentialPrismaMapper {
  static toDomain(row: PrismaCredential): Credential {
    return new Credential(CredentialId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      type: row.type as unknown as CredentialType,
      status: row.status as unknown as CredentialStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(credential: Credential): PrismaCredential {
    return {
      id: credential.id.value,
      identityId: credential.identityId.value,
      type: credential.type,
      status: credential.status,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}
