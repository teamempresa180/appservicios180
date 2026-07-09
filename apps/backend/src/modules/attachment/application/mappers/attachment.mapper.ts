import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentDto } from '../dto/attachment.dto';

/**
 * Translates between the Attachment domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class AttachmentMapper {
  static toDto(attachment: Attachment): AttachmentDto {
    const dto = new AttachmentDto();
    dto.id = attachment.id.value;
    dto.messageId = attachment.messageId.value;
    dto.fileName = attachment.fileName;
    dto.mimeType = attachment.mimeType;
    dto.fileSize = attachment.fileSize;
    dto.type = attachment.type;
    dto.status = attachment.status;
    dto.createdAt = attachment.createdAt;
    return dto;
  }
}
