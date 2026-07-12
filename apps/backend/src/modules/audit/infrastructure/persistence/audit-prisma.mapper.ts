import { AuditModel as PrismaAudit } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../domain/entities/audit.entity';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';

/**
 * Translates between the `Audit` domain entity and its Prisma row
 * shape (`AuditModel`, mapped to the `audit_records` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class AuditPrismaMapper {
  static toDomain(row: PrismaAudit): Audit {
    return new Audit(AuditId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      actionType: row.actionType as unknown as AuditActionType,
      description: row.description,
      occurredAt: row.occurredAt,
    });
  }

  static toPersistence(audit: Audit): PrismaAudit {
    return {
      id: audit.id.value,
      identityId: audit.identityId.value,
      actionType: audit.actionType,
      description: audit.description,
      occurredAt: audit.occurredAt,
    };
  }
}
