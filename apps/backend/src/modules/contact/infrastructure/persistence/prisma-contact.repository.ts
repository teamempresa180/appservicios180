import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { ContactPrismaMapper } from './contact-prisma.mapper';

/**
 * `ContactRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. Domain and
 * Application depend only on `ContactRepository` (the interface).
 */
@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ContactId): Promise<Contact | null> {
    const row = await this.prisma.contactModel.findUnique({
      where: { id: id.value },
    });
    return row ? ContactPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Contact[]> {
    const rows = await this.prisma.contactModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ContactPrismaMapper.toDomain(row));
  }

  async save(contact: Contact): Promise<void> {
    const data = ContactPrismaMapper.toPersistence(contact);
    await this.prisma.contactModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ContactId): Promise<void> {
    await this.prisma.contactModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Contact>> {
    const [rows, total] = await Promise.all([
      this.prisma.contactModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactModel.count(),
    ]);
    return {
      items: rows.map((row) => ContactPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Contact[]> {
    const rows = await this.prisma.contactModel.findMany({
      where: { value: { contains: term } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ContactPrismaMapper.toDomain(row));
  }
}
