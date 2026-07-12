import { TrustModel as PrismaTrust } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustScore } from '../../domain/value-objects/trust-score.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * Translates between the `Trust` domain entity and its Prisma row
 * shape (`TrustModel`, mapped to the `trust_profiles` table). The
 * only place in this module that imports from `@prisma/client` —
 * Domain/Application never do.
 */
export class TrustPrismaMapper {
  static toDomain(row: PrismaTrust): Trust {
    return new Trust(TrustId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      score: TrustScore.of(row.score),
      level: row.level as unknown as TrustLevel,
      status: row.status as unknown as TrustStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(trust: Trust): PrismaTrust {
    return {
      id: trust.id.value,
      identityId: trust.identityId.value,
      score: trust.score.value,
      level: trust.level,
      status: trust.status,
      createdAt: trust.createdAt,
      updatedAt: trust.updatedAt,
    };
  }
}
