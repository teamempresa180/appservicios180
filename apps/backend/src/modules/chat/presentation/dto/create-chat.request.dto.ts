import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * HTTP request body for `POST /chats`. Distinct from
 * `application/dto/create-chat.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients. `ChatHttpMapper` translates between the two.
 */
export class CreateChatRequestDto {
  @ApiProperty({
    example: 'order-id-123',
    description: 'The id of the Order this Chat is about.',
  })
  orderId!: string;

  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the client Identity in the conversation.',
  })
  clientIdentityId!: string;

  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider in the conversation.',
  })
  providerId!: string;

  @ApiProperty({ enum: ChatType, example: ChatType.OrderRelated })
  type!: ChatType;
}
