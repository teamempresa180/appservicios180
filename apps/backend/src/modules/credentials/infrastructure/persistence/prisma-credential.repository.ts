import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../domain/entities/credential.entity';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { CredentialPrismaMapper } from './credential-prisma.mapper';

/**
 * `CredentialRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaCredentialRepository implements CredentialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: CredentialId): Promise<Credential | null> {
    const row = await this.prisma.credentialModel.findUnique({
      where: { id: id.value },
    });
    return row ? CredentialPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Credential[]> {
    const rows = await this.prisma.credentialModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => CredentialPrismaMapper.toDomain(row));
  }

  async save(credential: Credential): Promise<void> {
    const data = CredentialPrismaMapper.toPersistence(credential);
    await this.prisma.credentialModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: CredentialId): Promise<void> {
    await this.prisma.credentialModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Credential>> {
    const [rows, total] = await Promise.all([
      this.prisma.credentialModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.credentialModel.count(),
    ]);
    return {
      items: rows.map((row) => CredentialPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Credential[]> {
    const upper = term.toUpperCase();
    const rows = await this.prisma.credentialModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows
      .filter((row) => row.type.includes(upper) || row.status.includes(upper))
      .map((row) => CredentialPrismaMapper.toDomain(row));
  }
}
