import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatPrismaMapper } from './chat-prisma.mapper';

/**
 * `ChatRepository` implementation backed by Prisma/PostgreSQL — the
 * only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ChatId): Promise<Chat | null> {
    const row = await this.prisma.chatModel.findUnique({
      where: { id: id.value },
    });
    return row ? ChatPrismaMapper.toDomain(row) : null;
  }

  async findByOrderId(orderId: OrderId): Promise<Chat[]> {
    const rows = await this.prisma.chatModel.findMany({
      where: { orderId: orderId.value },
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }

  async findByClientIdentityId(identityId: IdentityId): Promise<Chat[]> {
    const rows = await this.prisma.chatModel.findMany({
      where: { clientIdentityId: identityId.value },
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Chat[]> {
    const rows = await this.prisma.chatModel.findMany({
      where: { providerId: providerId.value },
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }

  async save(chat: Chat): Promise<void> {
    const data = ChatPrismaMapper.toPersistence(chat);
    await this.prisma.chatModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Chat>> {
    const [rows, total] = await Promise.all([
      this.prisma.chatModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.chatModel.count(),
    ]);
    return {
      items: rows.map((row) => ChatPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Chat[]> {
    // `type` is a Prisma enum column — enum filters only support
    // `equals`/`in`, not `contains`, so the substring match has to
    // happen in application code after the fetch.
    const rows = await this.prisma.chatModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.type.includes(upper))
      .map((row) => ChatPrismaMapper.toDomain(row));
  }
}
