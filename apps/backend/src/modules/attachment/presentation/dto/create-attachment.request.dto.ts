import { ApiProperty } from '@nestjs/swagger';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * HTTP request body for `POST /attachments`. Distinct from
 * `application/dto/create-attachment.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `AttachmentHttpMapper` translates
 * between the two.
 */
export class CreateAttachmentRequestDto {
  @ApiProperty({
    example: 'message-id-123',
    description: 'The id of the Message this Attachment belongs to.',
  })
  messageId!: string;

  @ApiProperty({ example: 'leak-photo.jpg' })
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType!: string;

  @ApiProperty({ example: 204800 })
  fileSize!: number;

  @ApiProperty({ enum: AttachmentType, example: AttachmentType.Image })
  type!: AttachmentType;
}
