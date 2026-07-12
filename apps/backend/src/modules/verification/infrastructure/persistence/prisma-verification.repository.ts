import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationPrismaMapper } from './verification-prisma.mapper';

/**
 * `VerificationRepository` implementation backed by Prisma/PostgreSQL
 * — the only place in this module that knows Prisma exists. Domain
 * and Application depend only on `VerificationRepository` (the
 * interface).
 */
@Injectable()
export class PrismaVerificationRepository implements VerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: VerificationId): Promise<Verification | null> {
    const row = await this.prisma.verificationModel.findUnique({
      where: { id: id.value },
    });
    return row ? VerificationPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Verification[]> {
    const rows = await this.prisma.verificationModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => VerificationPrismaMapper.toDomain(row));
  }

  async save(verification: Verification): Promise<void> {
    const data = VerificationPrismaMapper.toPersistence(verification);
    await this.prisma.verificationModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Verification>> {
    const [rows, total] = await Promise.all([
      this.prisma.verificationModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.verificationModel.count(),
    ]);
    return {
      items: rows.map((row) => VerificationPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Verification[]> {
    const rows = await this.prisma.verificationModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.type.includes(upper) || row.status.includes(upper))
      .map((row) => VerificationPrismaMapper.toDomain(row));
  }
}
