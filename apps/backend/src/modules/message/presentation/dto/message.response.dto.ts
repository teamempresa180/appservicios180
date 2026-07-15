import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * HTTP response body for the Message endpoints. Distinct from
 * `application/dto/message.dto.ts` — see
 * `send-message.request.dto.ts` for the rationale.
 */
export class MessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  chatId!: string;

  @ApiProperty()
  senderIdentityId!: string;

  @ApiProperty({ example: 'On my way, be there in 10 minutes.' })
  content!: string;

  @ApiProperty({ enum: MessageType })
  type!: MessageType;

  @ApiProperty({ enum: MessageStatus })
  status!: MessageStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  sentAt!: string;

  @ApiPropertyOptional({ example: null, type: String, nullable: true })
  readAt!: string | null;
}
