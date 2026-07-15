import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * HTTP request body for `POST /notifications`. Distinct from
 * `application/dto/create-notification.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `NotificationHttpMapper`
 * translates between the two.
 */
export class CreateNotificationRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity receiving the notification.',
  })
  identityId!: string;

  @ApiProperty({ example: 'Your order was accepted' })
  title!: string;

  @ApiProperty({ example: 'Provider Jane Doe accepted your service request.' })
  body!: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.Info })
  type!: NotificationType;
}
