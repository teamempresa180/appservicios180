import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderPrismaMapper } from './order-prisma.mapper';

/**
 * `OrderRepository` implementation backed by Prisma/PostgreSQL — the
 * only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: OrderId): Promise<Order | null> {
    const row = await this.prisma.orderModel.findUnique({
      where: { id: id.value },
    });
    return row ? OrderPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Order[]> {
    const rows = await this.prisma.orderModel.findMany({
      where: { identityId: identityId.value },
    });
    return rows.map((row) => OrderPrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Order[]> {
    const rows = await this.prisma.orderModel.findMany({
      where: { providerId: providerId.value },
    });
    return rows.map((row) => OrderPrismaMapper.toDomain(row));
  }

  async findOpenByCategoryId(categoryId: CategoryId): Promise<Order[]> {
    const rows = await this.prisma.orderModel.findMany({
      where: {
        categoryId: categoryId.value,
        providerId: null,
        status: OrderStatus.Pending,
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => OrderPrismaMapper.toDomain(row));
  }

  async save(order: Order): Promise<void> {
    const data = OrderPrismaMapper.toPersistence(order);
    await this.prisma.orderModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Order>> {
    const [rows, total] = await Promise.all([
      this.prisma.orderModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.orderModel.count(),
    ]);
    return {
      items: rows.map((row) => OrderPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Order[]> {
    const rows = await this.prisma.orderModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const lower = term.toLowerCase();
    return rows
      .filter(
        (row) =>
          row.title.toLowerCase().includes(lower) ||
          row.description.toLowerCase().includes(lower),
      )
      .map((row) => OrderPrismaMapper.toDomain(row));
  }
}
