import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * HTTP request body for `POST /messages`. Distinct from
 * `application/dto/send-message.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients. `MessageHttpMapper` translates between the two.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist`/`forbidNonWhitelisted`, so an undecorated property would
 * be stripped from the payload before the controller ever sees it.
 * `content` is capped at 2000 characters — a chat message, not an
 * unbounded blob a caller can use to fill the database.
 */
export class SendMessageRequestDto {
  @ApiProperty({
    example: '9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f',
    description: 'The id of the Chat this Message belongs to.',
  })
  @IsUUID()
  chatId!: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description:
      'The id of the Identity sending the message — must be the authenticated caller.',
  })
  @IsUUID()
  senderIdentityId!: string;

  @ApiProperty({ example: 'On my way, be there in 10 minutes.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;

  @ApiProperty({ enum: MessageType, example: MessageType.Text })
  @IsEnum(MessageType)
  type!: MessageType;
}
