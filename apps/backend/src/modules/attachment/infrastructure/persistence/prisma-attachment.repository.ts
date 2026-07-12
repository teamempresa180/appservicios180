import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentPrismaMapper } from './attachment-prisma.mapper';

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
  ): Promise<PaginatedResult<Attachment>> {
    const [rows, total] = await Promise.all([
      this.prisma.attachmentModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.attachmentModel.count(),
    ]);
    return {
      items: rows.map((row) => AttachmentPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Attachment[]> {
    const rows = await this.prisma.attachmentModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const lower = term.toLowerCase();
    return rows
      .filter((row) => row.fileName.toLowerCase().includes(lower))
      .map((row) => AttachmentPrismaMapper.toDomain(row));
  }
}
