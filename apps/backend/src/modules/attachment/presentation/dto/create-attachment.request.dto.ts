import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/** 20 MiB — `AttachmentModel.fileSize` is a Prisma `Int`, so the
 *  declared size also has to stay well inside a 32-bit integer. */
const MAX_FILE_SIZE_BYTES = 20971520;

/**
 * HTTP request body for `POST /attachments`. Distinct from
 * `application/dto/create-attachment.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `AttachmentHttpMapper` translates
 * between the two.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload rather than
 * reaching the Use Case.
 */
export class CreateAttachmentRequestDto {
  @ApiProperty({
    example: 'message-id-123',
    description: 'The id of the Message this Attachment belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  messageId!: string;

  @ApiProperty({ example: 'leak-photo.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  mimeType!: string;

  @ApiProperty({ example: 204800, maximum: MAX_FILE_SIZE_BYTES })
  @IsInt()
  @Min(1)
  @Max(MAX_FILE_SIZE_BYTES)
  fileSize!: number;

  @ApiProperty({ enum: AttachmentType, example: AttachmentType.Image })
  @IsEnum(AttachmentType)
  type!: AttachmentType;
}
