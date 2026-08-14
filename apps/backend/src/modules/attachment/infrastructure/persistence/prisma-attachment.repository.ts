import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentPrismaMapper } from './attachment-prisma.mapper';

/**
 * Restricts a query to Attachments hanging off Chats the given
 * Identity takes part in. A Chat stores its provider side as a
 * `providerId`, not an `identityId`, so the provider branch has to hop
 * through the relation — that hop is exactly why this predicate is
 * built once here instead of being repeated per query.
 */
function participantWhere(
  participantIdentityId: IdentityId,
): Prisma.AttachmentModelWhereInput {
  return {
    message: {
      chat: {
        OR: [
          { clientIdentityId: participantIdentityId.value },
          { provider: { identityId: participantIdentityId.value } },
        ],
      },
    },
  };
}

/**
 * `AttachmentRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: AttachmentId): Promise<Attachment | null> {
    const row = await this.prisma.attachmentModel.findUnique({
      where: { id: id.value },
    });
    return row ? AttachmentPrismaMapper.toDomain(row) : null;
  }

  async findByMessageId(messageId: MessageId): Promise<Attachment[]> {
    const rows = await this.prisma.attachmentModel.findMany({
      where: { messageId: messageId.value },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => AttachmentPrismaMapper.toDomain(row));
  }

  async save(attachment: Attachment): Promise<void> {
    const data = AttachmentPrismaMapper.toPersistence(attachment);
    await this.prisma.attachmentModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: AttachmentId): Promise<void> {
    await this.prisma.attachmentModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
    participantIdentityId?: IdentityId,
  ): Promise<PaginatedResult<Attachment>> {
    const where =
      participantIdentityId !== undefined
        ? participantWhere(participantIdentityId)
        : {};
    const [rows, total] = await Promise.all([
      this.prisma.attachmentModel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.attachmentModel.count({ where }),
    ]);
    return {
      items: rows.map((row) => AttachmentPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(
    term: string,
    participantIdentityId?: IdentityId,
  ): Promise<Attachment[]> {
    const rows = await this.prisma.attachmentModel.findMany({
      where: {
        ...(participantIdentityId !== undefined
          ? participantWhere(participantIdentityId)
          : undefined),
        fileName: { contains: term },
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => AttachmentPrismaMapper.toDomain(row));
  }

  async findParticipantIdentityIds(id: AttachmentId): Promise<string[]> {
    const row = await this.prisma.attachmentModel.findUnique({
      where: { id: id.value },
      select: {
        message: {
          select: {
            chat: {
              select: {
                clientIdentityId: true,
                provider: { select: { identityId: true } },
              },
            },
          },
        },
      },
    });
    if (!row) {
      return [];
    }
    return [
      row.message.chat.clientIdentityId,
      row.message.chat.provider.identityId,
    ];
  }
}
