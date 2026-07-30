import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../domain/entities/audit.entity';
import { AuditRepository } from '../../domain/interfaces/audit-repository.interface';
import { AuditId } from '../../domain/value-objects/audit-id.value-object';
import { AuditPrismaMapper } from './audit-prisma.mapper';

/**
 * `AuditRepository` implementation backed by Prisma/PostgreSQL — the
 * only place in this module that knows Prisma exists. No `delete`
 * method — audit records are immutable by design.
 */
@Injectable()
export class PrismaAuditRepository implements AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: AuditId): Promise<Audit | null> {
    const row = await this.prisma.auditModel.findUnique({
      where: { id: id.value },
    });
    return row ? AuditPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Audit[]> {
    const rows = await this.prisma.auditModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { occurredAt: 'desc' },
    });
    return rows.map((row) => AuditPrismaMapper.toDomain(row));
  }

  async save(audit: Audit): Promise<void> {
    const data = AuditPrismaMapper.toPersistence(audit);
    await this.prisma.auditModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Audit>> {
    const [rows, total] = await Promise.all([
      this.prisma.auditModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { occurredAt: 'desc' },
      }),
      this.prisma.auditModel.count(),
    ]);
    return {
      items: rows.map((row) => AuditPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Audit[]> {
    const rows = await this.prisma.auditModel.findMany({
      where: { description: { contains: term } },
      orderBy: { occurredAt: 'desc' },
    });
    return rows.map((row) => AuditPrismaMapper.toDomain(row));
  }
}
