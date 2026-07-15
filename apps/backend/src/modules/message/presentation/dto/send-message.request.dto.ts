import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * HTTP request body for `POST /messages`. Distinct from
 * `application/dto/send-message.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients. `MessageHttpMapper` translates between the two.
 */
export class SendMessageRequestDto {
  @ApiProperty({
    example: 'chat-id-123',
    description: 'The id of the Chat this Message belongs to.',
  })
  chatId!: string;

  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity sending the message.',
  })
  senderIdentityId!: string;

  @ApiProperty({ example: 'On my way, be there in 10 minutes.' })
  content!: string;

  @ApiProperty({ enum: MessageType, example: MessageType.Text })
  type!: MessageType;
}
