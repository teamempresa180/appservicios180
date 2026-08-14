import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { ChatParticipantScope } from '../../../chat/domain/interfaces/chat-repository.interface';
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

  // Deliberately *not* capped with `take`, unlike every other feed in
  // this file: truncating a chat to an arbitrary 200 messages with no
  // `orderBy` would silently drop part of a conversation. Bounding
  // this one properly needs a cursor/`sentAt` window on the read
  // model — a real change to the chat contract, not a query tweak.
  async findByChatId(chatId: ChatId): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: { chatId: chatId.value },
    });
    return rows.map((row) => MessagePrismaMapper.toDomain(row));
  }

  async findBySenderIdentityId(identityId: IdentityId): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: { senderIdentityId: identityId.value },
      take: MAX_UNPAGINATED_RESULTS,
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

  /**
   * Turns a participant scope into a `where` fragment on the related
   * Chat row — a Message is readable exactly when its conversation is.
   * An absent scope yields `{}` (Admin only).
   */
  private static whereFor(scope: ChatParticipantScope | null): object {
    if (!scope) {
      return {};
    }
    const branches: { clientIdentityId?: string; providerId?: string }[] = [
      { clientIdentityId: scope.clientIdentityId.value },
    ];
    if (scope.providerId) {
      branches.push({ providerId: scope.providerId.value });
    }
    return { chat: { OR: branches } };
  }

  async list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Message>> {
    const where = PrismaMessageRepository.whereFor(scope);
    const [rows, total] = await Promise.all([
      this.prisma.messageModel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.messageModel.count({ where }),
    ]);
    return {
      items: rows.map((row) => MessagePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(
    term: string,
    scope: ChatParticipantScope | null,
  ): Promise<Message[]> {
    const rows = await this.prisma.messageModel.findMany({
      where: {
        content: { contains: term },
        ...PrismaMessageRepository.whereFor(scope),
      },
      orderBy: { sentAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => MessagePrismaMapper.toDomain(row));
  }
}
