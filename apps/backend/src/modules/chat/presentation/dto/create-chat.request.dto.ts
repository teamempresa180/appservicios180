import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * HTTP request body for `POST /chats`. Distinct from
 * `application/dto/create-chat.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients. `ChatHttpMapper` translates between the two.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist`/`forbidNonWhitelisted`, so an undecorated property would
 * be stripped from the payload before the controller ever sees it.
 */
export class CreateChatRequestDto {
  @ApiProperty({
    example: '3f1a6c2e-9d4b-4f0a-8c7e-1b2d3e4f5a6b',
    description: 'The id of the Order this Chat is about.',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'The id of the client Identity in the conversation.',
  })
  @IsUUID()
  clientIdentityId!: string;

  @ApiProperty({
    example: 'b1d6a1f0-2c3d-4e5f-8a9b-0c1d2e3f4a5b',
    description: 'The id of the Provider in the conversation.',
  })
  @IsUUID()
  providerId!: string;

  @ApiProperty({ enum: ChatType, example: ChatType.OrderRelated })
  @IsEnum(ChatType)
  type!: ChatType;
}
