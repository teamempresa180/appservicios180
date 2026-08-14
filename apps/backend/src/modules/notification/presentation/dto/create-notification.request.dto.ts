import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * HTTP request body for `POST /notifications`. Distinct from
 * `application/dto/create-notification.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `NotificationHttpMapper`
 * translates between the two.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload rather than
 * reaching the Use Case.
 */
export class CreateNotificationRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity receiving the notification.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  identityId!: string;

  @ApiProperty({ example: 'Your order was accepted' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'Provider Jane Doe accepted your service request.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body!: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.Info })
  @IsEnum(NotificationType)
  type!: NotificationType;
}
