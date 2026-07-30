import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessagePrismaMapper } from './message-prisma.mapper';

/**
 * `MessageRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: MessageId): Promise<Message | null> {
    const row = await this.prisma.messageModel.findUnique({
      where: { id: id.value },
    });
    return row ? MessagePrismaMapper.toDomain(row) : null;
  }

  async findByChatId(chatId: ChatId): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: { chatId: chatId.value },
    });
    return rows.map((row) => MessagePrismaMapper.toDomain(row));
  }

  async findBySenderIdentityId(identityId: IdentityId): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: { senderIdentityId: identityId.value },
    });
    return rows.map((row) => MessagePrismaMapper.toDomain(row));
  }

  async save(message: Message): Promise<void> {
    const data = MessagePrismaMapper.toPersistence(message);
    await this.prisma.messageModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: MessageId): Promise<void> {
    await this.prisma.messageModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Message>> {
    const [rows, total] = await Promise.all([
      this.prisma.messageModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.messageModel.count(),
    ]);
    return {
      items: rows.map((row) => MessagePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: { content: { contains: term } },
      orderBy: { sentAt: 'desc' },
    });
    return rows.map((row) => MessagePrismaMapper.toDomain(row));
  }
}
