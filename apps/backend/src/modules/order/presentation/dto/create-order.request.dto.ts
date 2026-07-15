import { ApiProperty } from '@nestjs/swagger';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * HTTP request body for `POST /orders`. Distinct from
 * `application/dto/create-order.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `OrderHttpMapper` translates between the two.
 */
export class CreateOrderRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the customer Identity requesting the Order.',
  })
  identityId!: string;

  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider fulfilling the Order.',
  })
  providerId!: string;

  @ApiProperty({
    example: 'service-id-123',
    description: 'The id of the Service being ordered.',
  })
  serviceId!: string;

  @ApiProperty({ example: 'Fix leaking kitchen faucet' })
  title!: string;

  @ApiProperty({
    example: 'The faucet under the kitchen sink has been leaking for a week.',
  })
  description!: string;

  @ApiProperty({ example: '2026-02-01T09:00:00.000Z', type: String })
  scheduledDate!: string;

  @ApiProperty({ enum: OrderPriority, example: OrderPriority.Medium })
  priority!: OrderPriority;
}
