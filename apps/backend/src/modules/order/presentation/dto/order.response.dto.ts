import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * HTTP response body for the Order endpoints. Distinct from
 * `application/dto/order.dto.ts` — see
 * `create-order.request.dto.ts` for the rationale.
 */
export class OrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ nullable: true })
  providerId!: string | null;

  @ApiProperty({ nullable: true })
  serviceId!: string | null;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty({ nullable: true })
  addressId!: string | null;

  @ApiProperty({ example: 'Fix leaking kitchen faucet' })
  title!: string;

  @ApiProperty({
    example: 'The faucet under the kitchen sink has been leaking for a week.',
  })
  description!: string;

  @ApiProperty({ example: '2026-02-01T09:00:00.000Z', type: String })
  scheduledDate!: string;

  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;

  @ApiProperty({ enum: OrderPriority })
  priority!: OrderPriority;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
