import { ApiProperty } from '@nestjs/swagger';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * HTTP response body for the Attachment endpoints. Distinct from
 * `application/dto/attachment.dto.ts` — see
 * `create-attachment.request.dto.ts` for the rationale. No
 * `updatedAt`: `AttachmentDto` doesn't have one, matching the Prisma
 * model.
 */
export class AttachmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  messageId!: string;

  @ApiProperty({ example: 'leak-photo.jpg' })
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType!: string;

  @ApiProperty({ example: 204800 })
  fileSize!: number;

  @ApiProperty({ enum: AttachmentType })
  type!: AttachmentType;

  @ApiProperty({ enum: AttachmentStatus })
  status!: AttachmentStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;
}
