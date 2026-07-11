import { AuthenticationModel as PrismaAuthentication } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * Translates between the `Authentication` domain entity and its
 * Prisma row shape (`AuthenticationModel`, mapped to the
 * `authentications` table). The only place in this module that
 * imports from `@prisma/client` — Domain/Application never do.
 */
export class AuthenticationPrismaMapper {
  static toDomain(row: PrismaAuthentication): Authentication {
    return new Authentication(AuthenticationId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      methodType: row.methodType as unknown as AuthMethodType,
      status: row.status as unknown as AuthenticationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(authentication: Authentication): PrismaAuthentication {
    return {
      id: authentication.id.value,
      identityId: authentication.identityId.value,
      methodType: authentication.methodType,
      status: authentication.status,
      createdAt: authentication.createdAt,
      updatedAt: authentication.updatedAt,
    };
  }
}
