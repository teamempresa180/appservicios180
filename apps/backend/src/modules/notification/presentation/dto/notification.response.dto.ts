import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * HTTP response body for the Notification endpoints. Distinct from
 * `application/dto/notification.dto.ts` — see
 * `create-notification.request.dto.ts` for the rationale.
 */
export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ example: 'Your order was accepted' })
  title!: string;

  @ApiProperty({ example: 'Provider Jane Doe accepted your service request.' })
  body!: string;

  @ApiProperty({ enum: NotificationType })
  type!: NotificationType;

  @ApiProperty({ enum: NotificationStatus })
  status!: NotificationStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiPropertyOptional({ example: null, type: String, nullable: true })
  readAt!: string | null;
}
