import { VerificationModel as PrismaVerification } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';

/**
 * Translates between the `Verification` domain entity and its Prisma
 * row shape (`VerificationModel`, mapped to the `verifications`
 * table). The only place in this module that imports from
 * `@prisma/client` — Domain/Application never do.
 */
export class VerificationPrismaMapper {
  static toDomain(row: PrismaVerification): Verification {
    return new Verification(VerificationId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      type: row.type as unknown as VerificationType,
      status: row.status as unknown as VerificationStatus,
      verifiedAt: row.verifiedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(verification: Verification): PrismaVerification {
    return {
      id: verification.id.value,
      identityId: verification.identityId.value,
      type: verification.type,
      status: verification.status,
      verifiedAt: verification.verifiedAt,
      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };
  }
}
