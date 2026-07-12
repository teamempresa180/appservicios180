import { AuditModel as PrismaAudit } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../domain/entities/audit.entity';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { AuditPrismaMapper } from './audit-prisma.mapper';

describe('AuditPrismaMapper', () => {
  const row: PrismaAudit = {
    id: 'id-1',
    identityId: 'identity-1',
    actionType: 'CREATED',
    description: 'Something happened',
    occurredAt: new Date('2024-01-01'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const audit = AuditPrismaMapper.toDomain(row);

    expect(audit.id.value).toBe('id-1');
    expect(audit.identityId.value).toBe('identity-1');
    expect(audit.actionType).toBe(AuditActionType.Created);
    expect(audit.description).toBe('Something happened');
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const audit = new Audit(AuditId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      actionType: AuditActionType.Created,
      description: 'Something happened',
      occurredAt: new Date('2024-01-01'),
    });

    expect(AuditPrismaMapper.toPersistence(audit)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const audit = AuditPrismaMapper.toDomain(row);
    expect(AuditPrismaMapper.toPersistence(audit)).toEqual(row);
  });
});
