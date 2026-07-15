import { ApiProperty } from '@nestjs/swagger';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * HTTP response body for the Chat endpoints. Distinct from
 * `application/dto/chat.dto.ts` — see
 * `create-chat.request.dto.ts` for the rationale.
 */
export class ChatResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  clientIdentityId!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty({ enum: ChatStatus })
  status!: ChatStatus;

  @ApiProperty({ enum: ChatType })
  type!: ChatType;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
