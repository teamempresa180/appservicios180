import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import {
  MAX_UNPAGINATED_RESULTS,
  enumValuesMatching,
} from '../../../core/infrastructure/enum-search';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import {
  ChatParticipantScope,
  ChatRepository,
} from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
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
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }

  async findByClientIdentityId(identityId: IdentityId): Promise<Chat[]> {
    const rows = await this.prisma.chatModel.findMany({
      where: { clientIdentityId: identityId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }

  async findByProviderId(providerId: ProviderId): Promise<Chat[]> {
    const rows = await this.prisma.chatModel.findMany({
      where: { providerId: providerId.value },
      take: MAX_UNPAGINATED_RESULTS,
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

  /**
   * Translates a participant scope into a Prisma `where` fragment. An
   * absent scope yields `{}` (Admin only); a caller with no Provider
   * record only matches the client side.
   */
  private static whereFor(
    scope: ChatParticipantScope | null,
  ): { OR: { clientIdentityId?: string; providerId?: string }[] } | object {
    if (!scope) {
      return {};
    }
    const branches: { clientIdentityId?: string; providerId?: string }[] = [
      { clientIdentityId: scope.clientIdentityId.value },
    ];
    if (scope.providerId) {
      branches.push({ providerId: scope.providerId.value });
    }
    return { OR: branches };
  }

  async list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Chat>> {
    const where = PrismaChatRepository.whereFor(scope);
    const [rows, total] = await Promise.all([
      this.prisma.chatModel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.chatModel.count({ where }),
    ]);
    return {
      items: rows.map((row) => ChatPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(
    term: string,
    scope: ChatParticipantScope | null,
  ): Promise<Chat[]> {
    // `type` is a Prisma enum column — enum filters only support
    // `equals`/`in`, not `contains`. Resolving the substring match
    // against the (compile-time known) enum values first turns what
    // used to be an unfiltered full-table fetch + in-memory
    // `.filter()` into a single bounded `IN (...)` query.
    const types = enumValuesMatching(ChatType, term);
    if (types.length === 0) {
      return [];
    }
    const rows = await this.prisma.chatModel.findMany({
      where: {
        type: { in: types },
        ...PrismaChatRepository.whereFor(scope),
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ChatPrismaMapper.toDomain(row));
  }
}
