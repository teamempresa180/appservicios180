import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthenticationPrismaMapper } from './authentication-prisma.mapper';

/**
 * `AuthenticationRepository` implementation backed by
 * Prisma/PostgreSQL — the only place in this module that knows Prisma
 * exists.
 */
@Injectable()
export class PrismaAuthenticationRepository implements AuthenticationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: AuthenticationId): Promise<Authentication | null> {
    const row = await this.prisma.authenticationModel.findUnique({
      where: { id: id.value },
    });
    return row ? AuthenticationPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Authentication[]> {
    const rows = await this.prisma.authenticationModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => AuthenticationPrismaMapper.toDomain(row));
  }

  async save(authentication: Authentication): Promise<void> {
    const data = AuthenticationPrismaMapper.toPersistence(authentication);
    await this.prisma.authenticationModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: AuthenticationId): Promise<void> {
    await this.prisma.authenticationModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Authentication>> {
    const [rows, total] = await Promise.all([
      this.prisma.authenticationModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.authenticationModel.count(),
    ]);
    return {
      items: rows.map((row) => AuthenticationPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Authentication[]> {
    const upper = term.toUpperCase();
    const rows = await this.prisma.authenticationModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows
      .filter(
        (row) => row.methodType.includes(upper) || row.status.includes(upper),
      )
      .map((row) => AuthenticationPrismaMapper.toDomain(row));
  }
}
