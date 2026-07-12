import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { MessageRepository } from '../../../message/domain/interfaces/message-repository.interface';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { CreateAttachmentCommand } from '../commands/create-attachment.command';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';
import { AttachmentValidator } from '../validators/attachment.validator';

/**
 * Creates a new Attachment for an existing Message, always in
 * `Pending` status. Depends on `MessageRepository` to verify the
 * referenced Message exists before creating the attachment — Message
 * is implemented earlier in this same Sprint 3, Etapa 10 prompt, so
 * this check is not deferred.
 */
export class CreateAttachmentUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(command: CreateAttachmentCommand): Promise<AttachmentDto> {
    AttachmentValidator.validateCreate(command);

    const messageId = MessageId.fromString(command.messageId);
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(`Message ${command.messageId} not found`);
    }

    const attachment = new Attachment(AttachmentId.create(), {
      messageId,
      fileName: command.fileName,
      mimeType: command.mimeType,
      fileSize: command.fileSize,
      type: command.type,
      status: AttachmentStatus.Pending,
      createdAt: new Date(),
    });

    await this.attachmentRepository.save(attachment);
    return AttachmentMapper.toDto(attachment);
  }
}
