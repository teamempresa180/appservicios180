import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../domain/entities/address.entity';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { AddressPrismaMapper } from './address-prisma.mapper';

/**
 * `AddressRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. Domain and
 * Application depend only on `AddressRepository` (the interface).
 */
@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: AddressId): Promise<Address | null> {
    const row = await this.prisma.addressModel.findUnique({
      where: { id: id.value },
    });
    return row ? AddressPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Address[]> {
    const rows = await this.prisma.addressModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => AddressPrismaMapper.toDomain(row));
  }

  async save(address: Address): Promise<void> {
    const data = AddressPrismaMapper.toPersistence(address);
    await this.prisma.addressModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: AddressId): Promise<void> {
    await this.prisma.addressModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Address>> {
    const where =
      identityId !== undefined ? { identityId: identityId.value } : {};
    const [rows, total] = await Promise.all([
      this.prisma.addressModel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.addressModel.count({ where }),
    ]);
    return {
      items: rows.map((row) => AddressPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string, identityId?: IdentityId): Promise<Address[]> {
    const rows = await this.prisma.addressModel.findMany({
      where: {
        ...(identityId !== undefined
          ? { identityId: identityId.value }
          : undefined),
        OR: [
          { alias: { contains: term } },
          { fullAddress: { contains: term } },
          { city: { contains: term } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => AddressPrismaMapper.toDomain(row));
  }
}
