import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * HTTP request body for `PUT /orders/:id`. Distinct from
 * `application/dto/update-order.dto.ts` — see
 * `create-order.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateOrderCommand` actually accepts (title/description/
 * scheduledDate/priority) — `status` is not updatable via this
 * endpoint (see `PUT /orders/:id/cancel` for the only supported
 * status transition), per the existing Application layer contract.
 */
export class UpdateOrderRequestDto {
  @ApiPropertyOptional({ example: 'Fix leaking kitchen faucet' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  description?: string;

  @ApiPropertyOptional({ example: '2026-02-02T09:00:00.000Z', type: String })
  scheduledDate?: string;

  @ApiPropertyOptional({ enum: OrderPriority, example: OrderPriority.High })
  priority?: OrderPriority;
}
