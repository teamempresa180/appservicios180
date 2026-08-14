import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationPrismaMapper } from './notification-prisma.mapper';

/**
 * `NotificationRepository` implementation backed by Prisma/PostgreSQL
 * — the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: NotificationId): Promise<Notification | null> {
    const row = await this.prisma.notificationModel.findUnique({
      where: { id: id.value },
    });
    return row ? NotificationPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Notification[]> {
    const rows = await this.prisma.notificationModel.findMany({
      where: { identityId: identityId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => NotificationPrismaMapper.toDomain(row));
  }

  async save(notification: Notification): Promise<void> {
    const data = NotificationPrismaMapper.toPersistence(notification);
    await this.prisma.notificationModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: NotificationId): Promise<void> {
    await this.prisma.notificationModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Notification>> {
    const where =
      identityId !== undefined ? { identityId: identityId.value } : {};
    const [rows, total] = await Promise.all([
      this.prisma.notificationModel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notificationModel.count({ where }),
    ]);
    return {
      items: rows.map((row) => NotificationPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string, identityId?: IdentityId): Promise<Notification[]> {
    const rows = await this.prisma.notificationModel.findMany({
      where: {
        ...(identityId !== undefined
          ? { identityId: identityId.value }
          : undefined),
        OR: [{ title: { contains: term } }, { body: { contains: term } }],
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => NotificationPrismaMapper.toDomain(row));
  }
}
